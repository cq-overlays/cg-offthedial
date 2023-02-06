import { defineConfig } from "vite"
import { resolve } from "path"
import preact from "@preact/preset-vite"

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [preact()],
  base: "./",
  build: {
    target: "chrome95",
    sourcemap: true,
    outDir: "graphics",
    rollupOptions: {
      input: {
        break: resolve(__dirname, "break.html"),
        game: resolve(__dirname, "game.html"),
      },
    },
  },
})
