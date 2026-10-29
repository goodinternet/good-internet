import { writeFile } from "node:fs/promises"
import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"
import { siteConfig } from "./src/config/site.js"

const ADMIN_BACKLOG = new URL("./docs/admin/BACKLOG.md", import.meta.url)

export default defineConfig({
  plugins: [
    react(),
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
          .replace("%SITE_TITLE%", () => escape(`${siteConfig.name} — ${siteConfig.description}`))
          .replace("%SITE_DESCRIPTION%", () => escape(siteConfig.description))
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
})
