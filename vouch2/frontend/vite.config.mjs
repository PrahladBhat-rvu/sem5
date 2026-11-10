
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { cloudflare } from "@cloudflare/vite-plugin";
import path from "path";
import { fileURLToPath } from "url";
import { createRequire } from "module";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const require = createRequire(import.meta.url);

const isVercel = process.env.VERCEL === "1";

const apiServerPlugin = {
  name: "vouch-api-middleware",
  configureServer(server) {
    try {
      const backendPath = path.resolve(__dirname, "../backend/server.js");
      const app = require(backendPath);
      server.middlewares.use((req, res, next) => {
        if (req.url && (req.url.startsWith("/api/") || req.url === "/api")) {
          return app(req, res, next);
        }
        next();
      });
      console.log("⚡ [Vite] Backend Express API mounted in dev server");
    } catch (err) {
      console.warn("⚠️ [Vite] Backend middleware note:", err.message);
    }
  },
};

export default defineConfig(({ command }) => ({
  envDir: "../",
  plugins: [
    react(),
    ...(command === "serve" ? [apiServerPlugin] : []),
    ...(command === "build" && !isVercel ? [cloudflare()] : []),
  ],

  server: {
    port: 5173,
    proxy: {
      "/api": {
        target: "http://localhost:5000",
        changeOrigin: true,
      },
    },
  },
}));
