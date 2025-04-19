// frontend/vite.config.js
import { defineConfig } from 'vite'

export default defineConfig({
  root: '.',      // index.html のあるフォルダ
  base: '/',      // public/assets/ 配下に出力
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: 'index.html',
      output: {
        entryFileNames: 'assets/[name].js',
        chunkFileNames: 'assets/[name].js',
        assetFileNames: 'assets/[name][extname]'
      }
    }
  }
})
