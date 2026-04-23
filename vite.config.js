import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    // Local dev proxy: all /api requests forwarded to the backend.
    // Not used in production builds — set VITE_API_BASE instead.
    proxy: {
      "/api": {
        target: "http://localhost:3001",
        changeOrigin: true,
      },
    },
  },
  build: {
    // Produce a clean /dist directory for deployment
    outDir: "dist",
    sourcemap: false,
  },
});
