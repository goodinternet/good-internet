import { writeFile } from "node:fs/promises"
import { realpathSync } from "node:fs"
import { fileURLToPath } from "node:url"
import { defineConfig, loadEnv } from "vite"
import react from "@vitejs/plugin-react"
import tailwindcss from "@tailwindcss/vite"
import { siteConfig } from "./src/config/site.js"

const ADMIN_BACKLOG = new URL("./docs/admin/BACKLOG.md", import.meta.url)

export default defineConfig(({ mode }) => ({
  plugins: [
    react(),
    tailwindcss(),
    {
      name: "site-metadata",
      transformIndexHtml(html) {
        const escape = (value) => value.replace(/[&<>"']/g, (char) => ({
          "&": "&amp;",
          "<": "&lt;",
          ">": "&gt;",
          '"': "&quot;",
          "'": "&#39;",
        })[char])
        return html
          .replace("%SITE_TITLE%", () => escape(`${siteConfig.name} — ${siteConfig.tagline}`))
          .replace("%SITE_DESCRIPTION%", () => escape(siteConfig.description))
      },
    },
    {
      // Dev only: serves /api/subscribe from api/subscribe.ts (on Vercel it is a function). Env comes from .env.local.
      name: "dev-api-subscribe",
      configureServer(server) {
        Object.assign(process.env, loadEnv(mode, process.cwd(), ""))
        server.middlewares.use("/api/subscribe", async (req, res) => {
          const chunks = []
          for await (const chunk of req) chunks.push(chunk)
          const host = req.headers.host ?? "localhost:5173"
          const request = new Request(`http://${host}/api/subscribe`, {
            method: req.method,
            headers: req.headers,
            body: req.method === "POST" ? Buffer.concat(chunks) : undefined,
          })
          try {
            const { POST } = await server.ssrLoadModule("/api/subscribe.ts")
            const response = req.method === "POST" ? await POST(request) : new Response(null, { status: 405 })
            res.statusCode = response.status
            response.headers.forEach((value, name) => res.setHeader(name, value))
            res.end(await response.text())
          } catch {
            res.statusCode = 500
            res.end()
          }
        })
      },
    },
    {
      // Dev only: the admin kanban saves docs/admin/BACKLOG.md here, like Autobahn's server.
      name: "admin-backlog",
      configureServer(server) {
        server.middlewares.use("/__admin/backlog", (req, res) => {
          if (req.method !== "PUT") {
            res.statusCode = 405
            return res.end()
          }
          let body = ""
          req.setEncoding("utf8")
          req.on("data", (chunk) => {
            body += chunk
            if (body.length > 1_000_000) req.destroy()
          })
          req.on("end", async () => {
            try {
              await writeFile(ADMIN_BACKLOG, body)
              res.statusCode = 204
            } catch {
              res.statusCode = 500
            }
            res.end()
          })
        })
      },
    },
  ],
  server: {
    // Worktrees can share node_modules through a symlink; allow its font assets.
    fs: { allow: [fileURLToPath(new URL('.', import.meta.url)), realpathSync(new URL('./node_modules', import.meta.url))] },
    host: true,
    port: 5173,
    open: false,
    allowedHosts: true,
  },
  preview: {
    host: true,
    port: 4173,
    allowedHosts: true,
  },
}))
