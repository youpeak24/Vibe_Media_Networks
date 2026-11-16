import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "tailwindcss";
import autoprefixer from "autoprefixer";

/**
 * Serves api/chat.js (the Groq-powered AI assistant) during `npm run dev`, in-process, so no extra
 * server is needed for chat. It is registered before the /api proxy below, which still forwards
 * /api/contact to the Express server (npm run server). In production Vercel runs api/chat.js itself.
 */
function devChatApi(env) {
  return {
    name: "vibe-dev-chat-api",
    apply: "serve",
    configureServer(server) {
      for (const [key, value] of Object.entries(env)) process.env[key] ??= value;

      server.middlewares.use("/api/chat", async (req, res) => {
        const chunks = [];
        for await (const chunk of req) chunks.push(chunk);
        try {
          req.body = JSON.parse(Buffer.concat(chunks).toString() || "null");
        } catch {
          req.body = null;
        }
        res.status = (code) => {
          res.statusCode = code;
          return res;
        };
        res.json = (payload) => {
          res.setHeader("Content-Type", "application/json");
          res.end(JSON.stringify(payload));
        };
        try {
          const { default: handler } = await server.ssrLoadModule("/api/chat.js");
          await handler(req, res);
        } catch (err) {
          server.config.logger.error(String(err?.stack ?? err));
          if (!res.writableEnded) res.status(500).json({ error: "Server error." });
        }
      });
    },
  };
}

// https://vite.dev/config/
export default defineConfig(({ mode }) => ({
  plugins: [react(), devChatApi(loadEnv(mode, process.cwd(), ""))],
  css: {
    postcss: {
      plugins: [tailwindcss(), autoprefixer()],
    },
  },
  server: {
    port: 3000,
    open: false,
    proxy: {
      "/api": {
        target: "http://localhost:5000",
        changeOrigin: true,
      },
    },
  },
}));
