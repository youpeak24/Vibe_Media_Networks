/**
 * Vercel serverless function: POST /api/chat
 *
 * Streams a Groq chat completion that is grounded in this website's knowledge base
 * (api/_chatKnowledge.js). The Groq API key is read from the GROQ_API_KEY environment
 * variable on the server only; it is never sent to the browser.
 *
 * Request body:  { messages: [{ role: 'user' | 'assistant', content: string }], page?: string }
 * Response:      200 text/plain stream of the assistant's reply, or JSON { error } with a 4xx/5xx status.
 */
import { buildSystemPrompt } from './_chatKnowledge.js'

// Vercel: allow a streamed answer to run for up to 30 s.
export const config = { maxDuration: 30 }

const GROQ_URL = 'https://api.groq.com/openai/v1/chat/completions'

// Tried in order. If one is unavailable (retired, rate limited, overloaded) the next one answers.
const MODELS = [
  { id: process.env.GROQ_MODEL?.trim() || 'openai/gpt-oss-120b', extra: process.env.GROQ_MODEL ? {} : { reasoning_effort: 'low' } },
  { id: 'qwen/qwen3.8-27b', extra: { reasoning_effort: 'none' } },
  { id: 'openai/gpt-oss-20b', extra: { reasoning_effort: 'low' } },
]

const MAX_TURNS = 12 // most recent messages sent to the model
const MAX_CHARS = 1200 // per message
// Reasoning + answer budget. Groq counts prompt + max_tokens against the per-minute token limit, so keep it modest.
const MAX_TOKENS = 700

// Best-effort per-instance rate limit. Serverless instances do not share memory, so this only
// slows down trivial abuse; it is not a replacement for an edge rate limiter.
const WINDOW_MS = 10 * 60 * 1000
const MAX_PER_WINDOW = 40
const hits = new Map()

function rateLimited(ip) {
  const now = Date.now()
  for (const [key, list] of hits) {
    const fresh = list.filter((t) => now - t < WINDOW_MS)
    if (fresh.length) hits.set(key, fresh)
    else hits.delete(key)
  }
  const list = hits.get(ip) ?? []
  if (list.length >= MAX_PER_WINDOW) return true
  list.push(now)
  hits.set(ip, list)
  return false
}

function parseBody(body) {
  if (typeof body === 'string') {
    try {
      return JSON.parse(body) ?? {}
    } catch {
      return {}
    }
  }
  return body && typeof body === 'object' ? body : {}
}

/** Keep only well-formed user/assistant turns, trimmed and length-capped. */
function cleanMessages(input) {
  if (!Array.isArray(input)) return []
  const out = []
  for (const m of input) {
    if (!m || (m.role !== 'user' && m.role !== 'assistant') || typeof m.content !== 'string') continue
    const content = m.content.split('\0').join('').trim().slice(0, MAX_CHARS)
    if (content) out.push({ role: m.role, content })
  }
  const recent = out.slice(-MAX_TURNS)
  while (recent.length && recent[0].role !== 'user') recent.shift()
  return recent
}

/** The page the visitor is on is only a hint, so accept nothing but a plain path. */
const cleanPage = (page) => (typeof page === 'string' && /^[\w\-/#.]{1,80}$/.test(page) ? page : '/')

/**
 * Streams one model's answer into `res`. Returns true once something was sent.
 * Headers are only written when the first answer token arrives, so a model that fails (or spends
 * its whole budget "thinking") can be replaced by the next one without the visitor noticing.
 */
async function streamFromModel(model, messages, res, controller, apiKey) {
  const upstream = await fetch(GROQ_URL, {
    method: 'POST',
    headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: model.id,
      messages,
      stream: true,
      temperature: 0.45,
      top_p: 0.9,
      max_tokens: MAX_TOKENS,
      ...model.extra,
    }),
    signal: controller.signal,
  })

  if (!upstream.ok || !upstream.body) {
    const detail = await upstream.text().catch(() => '')
    const err = new Error(`Groq ${upstream.status} (${model.id}): ${detail.slice(0, 300)}`)
    err.status = upstream.status
    throw err
  }

  const reader = upstream.body.getReader()
  const decoder = new TextDecoder()
  let buffer = ''
  let started = false

  for (;;) {
    const { done, value } = await reader.read()
    if (done) break
    buffer += decoder.decode(value, { stream: true })
    const lines = buffer.split('\n')
    buffer = lines.pop() ?? ''
    for (const raw of lines) {
      const line = raw.trim()
      if (!line.startsWith('data:')) continue
      const data = line.slice(5).trim()
      if (!data || data === '[DONE]') continue
      let chunk
      try {
        chunk = JSON.parse(data)
      } catch {
        continue
      }
      const text = chunk?.choices?.[0]?.delta?.content // reasoning tokens arrive in delta.reasoning and are ignored
      if (!text) continue
      if (!started) {
        started = true
        res.statusCode = 200
        res.setHeader('Content-Type', 'text/plain; charset=utf-8')
        res.setHeader('Cache-Control', 'no-store, no-transform')
        res.setHeader('X-Accel-Buffering', 'no')
      }
      res.write(text)
    }
  }
  return started
}

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store')

  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    return res.status(405).json({ error: 'Method not allowed.' })
  }

  const apiKey = process.env.GROQ_API_KEY?.trim()
  if (!apiKey) {
    console.error('[chat] GROQ_API_KEY is not set.')
    return res.status(503).json({ error: 'The assistant is not available right now. Please use the contact page.' })
  }

  const forwarded = String(req.headers?.['x-forwarded-for'] ?? '').split(',')[0].trim()
  const ip = forwarded || req.socket?.remoteAddress || 'unknown'
  if (rateLimited(ip)) {
    return res.status(429).json({ error: 'You are sending messages very quickly. Please wait a few minutes and try again.' })
  }

  const body = parseBody(req.body)
  const history = cleanMessages(body.messages)
  if (!history.length || history[history.length - 1].role !== 'user') {
    return res.status(400).json({ error: 'Please type a message.' })
  }

  const messages = [{ role: 'system', content: buildSystemPrompt(cleanPage(body.page)) }, ...history]

  // Stop paying for tokens nobody will read if the visitor closes the chat mid-answer.
  const controller = new AbortController()
  res.on('close', () => {
    if (!res.writableEnded) controller.abort()
  })
  const timeout = setTimeout(() => controller.abort(), 25000)

  let rateLimitedUpstream = false
  try {
    for (const model of MODELS) {
      try {
        if (await streamFromModel(model, messages, res, controller, apiKey)) {
          return res.end()
        }
        console.warn(`[chat] ${model.id} returned no answer text; trying the next model.`)
      } catch (err) {
        if (controller.signal.aborted) return res.end()
        console.error('[chat]', err?.message ?? err)
        if (err?.status === 429) rateLimitedUpstream = true
        if (res.headersSent) return res.end() // already part-way through an answer: never splice in a second model
        if (err?.status === 401 || err?.status === 403) break // bad key: other models will not help
      }
    }
    if (!res.headersSent) {
      if (rateLimitedUpstream) {
        return res.status(429).json({ error: 'We are getting a lot of questions right now. Please try again in a few seconds.' })
      }
      return res.status(502).json({ error: 'The assistant could not answer just now. Please try again in a moment, or use the contact page.' })
    }
    return res.end()
  } finally {
    clearTimeout(timeout)
  }
}
