import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from 'react'
import './chatbot.css'

/**
 * Floating AI chat assistant.
 *
 * Talks to the site's own /api/chat endpoint (which holds the Groq key and the site knowledge), so
 * nothing secret ever reaches the browser. All site-specific text, colours and links live in
 * chatConfig.js. Replies stream in; a trailing ">> a | b | c" line from the model is turned into
 * tappable follow-up chips and never shown as text.
 */

const MAX_INPUT = 600
const MAX_HISTORY = 12

/* ---------- tiny, safe Markdown renderer (no innerHTML) ---------- */

const SAFE_URL = /^(https?:\/\/|mailto:|tel:|\/(?!\/)|#)/i
const INLINE = /(\*\*[^*\n]+\*\*|\[[^\]\n]+\]\([^)\s]+\)|https?:\/\/[^\s<>()]+[^\s<>().,;:!?'"]|[\w.+-]+@[\w-]+\.[\w.-]*[A-Za-z]|`[^`\n]+`)/g

function renderInline(text, onLink, keyPrefix) {
  const out = []
  let last = 0
  let i = 0
  for (const match of text.matchAll(INLINE)) {
    const token = match[0]
    if (match.index > last) out.push(text.slice(last, match.index))
    const key = `${keyPrefix}-${i++}`
    if (token.startsWith('**')) {
      out.push(<strong key={key}>{token.slice(2, -2)}</strong>)
    } else if (token.startsWith('`')) {
      out.push(<code key={key}>{token.slice(1, -1)}</code>)
    } else if (token.startsWith('[')) {
      const [, label, href] = token.match(/^\[([^\]]+)\]\(([^)]+)\)$/)
      out.push(
        SAFE_URL.test(href) ? (
          <A key={key} href={href} onLink={onLink}>
            {label}
          </A>
        ) : (
          label
        ),
      )
    } else if (/^https?:/i.test(token)) {
      out.push(
        <A key={key} href={token} onLink={onLink}>
          {token.replace(/^https?:\/\/(www\.)?/i, '')}
        </A>,
      )
    } else {
      out.push(
        <A key={key} href={`mailto:${token}`} onLink={onLink}>
          {token}
        </A>,
      )
    }
    last = match.index + token.length
  }
  if (last < text.length) out.push(text.slice(last))
  return out
}

function A({ href, onLink, children }) {
  const external = /^https?:\/\//i.test(href) && !href.startsWith(window.location.origin)
  return (
    <a
      href={href}
      {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
      onClick={(e) => onLink?.(e, href)}
    >
      {children}
    </a>
  )
}

function Markdown({ text, onLink }) {
  const blocks = []
  let list = null
  let para = []
  const flushPara = () => {
    if (para.length) blocks.push({ type: 'p', text: para.join(' ') })
    para = []
  }
  const flushList = () => {
    if (list) blocks.push(list)
    list = null
  }
  for (const raw of text.split('\n')) {
    const line = raw.trim()
    const bullet = line.match(/^[-*•]\s+(.*)/)
    const numbered = line.match(/^\d+[.)]\s+(.*)/)
    if (!line) {
      flushPara()
      flushList()
    } else if (bullet || numbered) {
      flushPara()
      const type = bullet ? 'ul' : 'ol'
      if (!list || list.type !== type) {
        flushList()
        list = { type, items: [] }
      }
      list.items.push((bullet || numbered)[1])
    } else {
      flushList()
      para.push(line.replace(/^#{1,6}\s+/, ''))
    }
  }
  flushPara()
  flushList()

  return blocks.map((b, i) => {
    if (b.type === 'p') return <p key={i}>{renderInline(b.text, onLink, `p${i}`)}</p>
    const Tag = b.type
    return (
      <Tag key={i}>
        {b.items.map((item, j) => (
          <li key={j}>{renderInline(item, onLink, `l${i}-${j}`)}</li>
        ))}
      </Tag>
    )
  })
}

/* ---------- reply parsing: strip the ">> follow-up | follow-up" line ---------- */

function splitReply(raw) {
  const marker = raw.search(/(^|\n)\s*>>/)
  let text = marker === -1 ? raw : raw.slice(0, marker)
  // hide a half-streamed marker such as a trailing "\n>"
  text = text.replace(/\n\s*>?$/, '')
  let chips = []
  if (marker !== -1) {
    chips = raw
      .slice(marker)
      .replace(/^\s*>>\s*/, '')
      .split('|')
      .map((s) => s.replace(/^[\s>\-*•"“]+|[\s"”]+$/g, '').trim())
      .filter((s) => s.length > 1 && s.length <= 60)
      .slice(0, 3)
  }
  return { text: text.trim(), chips }
}

/* ---------- icons ---------- */

const Icon = {
  chat: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M21 12a8 8 0 0 1-11.6 7.1L4 20.5l1.5-4.6A8 8 0 1 1 21 12Z" />
      <path d="M8.5 11.5h.01M12 11.5h.01M15.5 11.5h.01" strokeWidth="2.6" />
    </svg>
  ),
  close: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M6 6l12 12M18 6 6 18" />
    </svg>
  ),
  down: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="m6 9 6 6 6-6" />
    </svg>
  ),
  send: (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M3.4 20.4 21 12 3.4 3.6l-.1 6.5L14 12 3.3 13.9l.1 6.5Z" />
    </svg>
  ),
  stop: (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <rect x="6.5" y="6.5" width="11" height="11" rx="2.5" />
    </svg>
  ),
  reset: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M3 12a9 9 0 1 0 3-6.7L3 8" />
      <path d="M3 3v5h5" />
    </svg>
  ),
}

/* ---------- component ---------- */

let uid = 0
const newId = () => `m${Date.now().toString(36)}${(uid++).toString(36)}`

function readStore(key) {
  try {
    return JSON.parse(window.sessionStorage.getItem(key) || 'null')
  } catch {
    return null
  }
}
/** Messages saved earlier in this browser session (empty on the server and when storage is unavailable). */
function loadSaved(key) {
  const saved = readStore(key)
  return Array.isArray(saved?.messages) ? saved.messages.map((m) => ({ ...m, streaming: false })) : []
}

// `false` while the site is prerendered / hydrating, `true` once running in the browser. Using
// useSyncExternalStore (instead of a setState-in-effect flag) keeps hydration markup identical.
const subscribeNoop = () => () => {}
const isClient = () => true
const isServer = () => false

function writeStore(key, value) {
  try {
    window.sessionStorage.setItem(key, JSON.stringify(value))
  } catch {
    /* storage unavailable (private mode): the chat still works, it just won't survive a reload */
  }
}

export default function Chatbot({ config, page = '/', onNavigate }) {
  const {
    siteKey,
    apiPath = '/api/chat',
    name,
    subtitle,
    avatar,
    greeting,
    teaser,
    suggestions = [],
    actions = [],
    placeholder = 'Type your question…',
    disclaimer,
    theme = {},
  } = config

  const storeKey = `cbx:${siteKey}`
  const mounted = useSyncExternalStore(subscribeNoop, isClient, isServer)
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState(() => loadSaved(storeKey))
  const [input, setInput] = useState('')
  const [busy, setBusy] = useState(false)
  const [showTeaser, setShowTeaser] = useState(false)

  const logRef = useRef(null)
  const inputRef = useRef(null)
  const launcherRef = useRef(null)
  const abortRef = useRef(null)
  const stickRef = useRef(true) // keep the view pinned to the newest text unless the visitor scrolls up

  // The site is prerendered, so nothing is rendered until the page is running in the browser.
  useEffect(() => {
    if (mounted) writeStore(storeKey, { messages: messages.filter((m) => !m.streaming).slice(-40) })
  }, [messages, mounted, storeKey])

  // Gentle nudge, once per browser session, only if the visitor has not opened the chat yet.
  useEffect(() => {
    if (!mounted || !teaser || readStore(`${storeKey}:teased`)) return
    const show = setTimeout(() => setShowTeaser(true), 7000)
    const hide = setTimeout(() => setShowTeaser(false), 19000)
    return () => {
      clearTimeout(show)
      clearTimeout(hide)
    }
  }, [mounted, teaser, storeKey])

  const dismissTeaser = useCallback(() => {
    setShowTeaser(false)
    writeStore(`${storeKey}:teased`, true)
  }, [storeKey])

  useEffect(() => {
    const el = logRef.current
    if (open && el && stickRef.current) el.scrollTop = el.scrollHeight
  }, [messages, open, busy])

  // On phones the chat is a full-screen sheet: stop the page behind it from scrolling.
  useEffect(() => {
    if (!open || !window.matchMedia('(max-width: 520px)').matches) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = prev
    }
  }, [open])

  useEffect(() => {
    if (open) {
      const t = setTimeout(() => inputRef.current?.focus({ preventScroll: true }), 60)
      return () => clearTimeout(t)
    }
  }, [open])

  useEffect(() => () => abortRef.current?.abort(), [])

  const close = useCallback(() => {
    setOpen(false)
    launcherRef.current?.focus({ preventScroll: true })
  }, [])

  useEffect(() => {
    if (!open) return
    const onKey = (e) => e.key === 'Escape' && close()
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open, close])

  /** Asks the assistant to answer `convo` (which must end with a user message) and streams the reply in. */
  const run = useCallback(
    async (convo) => {
      stickRef.current = true
      const botId = newId()
      const history = convo
        .slice(-MAX_HISTORY)
        .map(({ role, content }) => ({ role, content: role === 'assistant' ? splitReply(content).text : content }))

      setMessages([...convo, { id: botId, role: 'assistant', content: '', streaming: true }])
      setBusy(true)

      const controller = new AbortController()
      abortRef.current = controller
      const patch = (fields) => setMessages((prev) => prev.map((m) => (m.id === botId ? { ...m, ...fields } : m)))

      try {
        const res = await fetch(apiPath, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ messages: history, page }),
          signal: controller.signal,
        })
        if (!res.ok) {
          let message = 'Sorry, I could not answer just now. Please try again.'
          try {
            // our endpoints reply { error: "text" }; an API-wide limiter may reply { error: { message } }
            const { error } = await res.json()
            message = (typeof error === 'string' ? error : error?.message) || message
          } catch {
            /* non-JSON error body */
          }
          throw new Error(message)
        }

        const reader = res.body.getReader()
        const decoder = new TextDecoder()
        let acc = ''
        for (;;) {
          const { done, value } = await reader.read()
          if (done) break
          acc += decoder.decode(value, { stream: true })
          patch({ content: acc })
        }
        acc += decoder.decode()
        if (!acc.trim()) throw new Error('I did not get an answer back. Please try again.')
        patch({ content: acc, streaming: false })
      } catch (err) {
        if (controller.signal.aborted) {
          // visitor pressed stop: keep whatever arrived, drop the bubble if nothing did
          setMessages((prev) =>
            prev.flatMap((m) => (m.id !== botId ? [m] : m.content.trim() ? [{ ...m, streaming: false }] : [])),
          )
        } else {
          patch({ streaming: false, error: true, content: err?.message || 'Something went wrong. Please try again.' })
        }
      } finally {
        setBusy(false)
        abortRef.current = null
      }
    },
    [apiPath, page],
  )

  const send = (rawText) => {
    const text = rawText.trim().slice(0, MAX_INPUT)
    if (!text || busy) return
    setInput('')
    if (inputRef.current) inputRef.current.style.height = 'auto'
    run([...messages.filter((m) => !m.error), { id: newId(), role: 'user', content: text }])
  }

  const retry = (failed) => run(messages.filter((m) => m.id !== failed.id))

  const stop = () => abortRef.current?.abort()

  const reset = () => {
    abortRef.current?.abort()
    setMessages([])
    setBusy(false)
    writeStore(storeKey, { messages: [] })
    inputRef.current?.focus()
  }

  const onLink = (e, href) => {
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.button === 1) return
    const internal = href.startsWith('/') || href.startsWith('#')
    if (href.startsWith('/') && onNavigate) {
      e.preventDefault()
      onNavigate(href) // in-app navigation: no full page reload
    }
    // on phones the chat covers the page, so step aside once a link inside the site is followed
    if (internal && window.matchMedia('(max-width: 520px)').matches) setOpen(false)
  }

  const onScroll = () => {
    const el = logRef.current
    if (el) stickRef.current = el.scrollHeight - el.scrollTop - el.clientHeight < 60
  }

  const onKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey && !e.nativeEvent.isComposing) {
      e.preventDefault()
      send(input)
    }
  }

  const autosize = (el) => {
    el.style.height = 'auto'
    el.style.height = `${Math.min(el.scrollHeight, 110)}px`
  }

  if (!mounted) return null

  const last = messages[messages.length - 1]
  const lastReply = last && last.role === 'assistant' && !last.streaming && !last.error ? splitReply(last.content) : null
  const chips = messages.length === 0 ? suggestions : lastReply?.chips?.length ? lastReply.chips : []

  return (
    <div className={`cbx${open ? ' is-open' : ''}`} style={theme}>
      <div className="cbx-wrap">
        {open && (
          <section className="cbx-panel" role="dialog" aria-label={`${name} chat`}>
            <header className="cbx-head">
              <span className="cbx-avatar" aria-hidden="true">
                {avatar ? <img src={avatar} alt="" /> : Icon.chat}
              </span>
              <span className="cbx-titles">
                <span className="cbx-title">{name}</span>
                <span className="cbx-sub">{subtitle}</span>
              </span>
              {messages.length > 0 && (
                <button type="button" className="cbx-icon-btn" onClick={reset} aria-label="Start a new conversation" title="New conversation">
                  {Icon.reset}
                </button>
              )}
              <button type="button" className="cbx-icon-btn" onClick={close} aria-label="Close chat" title="Close">
                {Icon.down}
              </button>
            </header>

            <div className="cbx-log" ref={logRef} onScroll={onScroll} role="log" aria-live="polite" aria-relevant="additions text" aria-label="Conversation">
              <div className="cbx-msg is-bot">
                <div className="cbx-bubble">
                  <Markdown text={greeting} onLink={onLink} />
                </div>
              </div>

              {messages.map((m) => {
                if (m.role === 'user') {
                  return (
                    <div key={m.id} className="cbx-msg is-user">
                      <div className="cbx-bubble">{m.content}</div>
                    </div>
                  )
                }
                const { text } = splitReply(m.content)
                return (
                  <div key={m.id} className={`cbx-msg is-bot${m.error ? ' is-error' : ''}`}>
                    <div className="cbx-bubble">
                      {m.error ? (
                        <>
                          <p>{m.content}</p>
                          <button type="button" className="cbx-retry" onClick={() => retry(m)}>
                            Try again
                          </button>
                        </>
                      ) : text ? (
                        <Markdown text={text} onLink={onLink} />
                      ) : (
                        <span className="cbx-typing" role="status" aria-label="Typing">
                          <i />
                          <i />
                          <i />
                        </span>
                      )}
                    </div>
                  </div>
                )
              })}

              {!busy && (chips.length > 0 || (messages.length === 0 && actions.length > 0)) && (
                <div className="cbx-chips" aria-label="Suggested questions">
                  {chips.map((c) => (
                    <button key={c} type="button" className="cbx-chip" onClick={() => send(c)}>
                      {c}
                    </button>
                  ))}
                  {messages.length === 0 &&
                    actions.map((a) => (
                      <a
                        key={a.label}
                        className="cbx-chip is-action"
                        href={a.href}
                        {...(/^https?:/i.test(a.href) ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                        onClick={(e) => onLink(e, a.href)}
                      >
                        {a.label}
                      </a>
                    ))}
                </div>
              )}
            </div>

            <div className="cbx-foot">
              <form
                className="cbx-form"
                onSubmit={(e) => {
                  e.preventDefault()
                  send(input)
                }}
              >
                <textarea
                  ref={inputRef}
                  className="cbx-input"
                  rows={1}
                  value={input}
                  maxLength={MAX_INPUT}
                  placeholder={placeholder}
                  aria-label="Your message"
                  onChange={(e) => {
                    setInput(e.target.value)
                    autosize(e.target)
                  }}
                  onKeyDown={onKeyDown}
                />
                {busy ? (
                  <button type="button" className="cbx-send" onClick={stop} aria-label="Stop generating">
                    {Icon.stop}
                  </button>
                ) : (
                  <button type="submit" className="cbx-send" disabled={!input.trim()} aria-label="Send message">
                    {Icon.send}
                  </button>
                )}
              </form>
              {disclaimer && <p className="cbx-note">{disclaimer}</p>}
            </div>
          </section>
        )}

        {showTeaser && !open && (
          <div className="cbx-teaser" role="status">
            <button
              type="button"
              className="cbx-teaser-text"
              onClick={() => {
                dismissTeaser()
                setOpen(true)
              }}
            >
              {teaser}
            </button>
            <button type="button" className="cbx-teaser-x" onClick={dismissTeaser} aria-label="Dismiss">
              {Icon.close}
            </button>
          </div>
        )}

        <button
          ref={launcherRef}
          type="button"
          className="cbx-launcher"
          onClick={() => {
            if (!open) dismissTeaser()
            setOpen((v) => !v)
          }}
          aria-label={open ? 'Close chat' : `Open chat: ${name}`}
          aria-expanded={open}
        >
          {open ? Icon.close : Icon.chat}
          {!open && <span className="cbx-badge" aria-hidden="true" />}
        </button>
      </div>
    </div>
  )
}
