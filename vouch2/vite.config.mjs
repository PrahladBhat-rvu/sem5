
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { cloudflare } from "@cloudflare/vite-plugin";

const isVercel = process.env.VERCEL === "1";

export default defineConfig(({ command }) => ({
  plugins: [
    react(),
    ...(command === "build" && !isVercel ? [cloudflare()] : []),
  ],

  server: {
    proxy: {
      "/api": "http://localhost:5000",
    },
  },
}));
