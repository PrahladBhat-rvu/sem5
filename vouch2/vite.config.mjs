import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { cloudflare } from "@cloudflare/vite-plugin";

export default defineConfig(({ command }) => ({
  plugins: [
    react(),
    ...(command === "build" ? [cloudflare()] : []),
  ],

  server: {
    proxy: {
      "/api": "http://localhost:5000",
    },
  },
}));
