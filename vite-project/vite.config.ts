import { defineConfig } from 'vite'
import mkcert from 'vite-plugin-mkcert'

// https://vite.dev/config/
export default defineConfig({
  build: {
    outDir: '../API/wwwroot',
    chunkSizeWarningLimit : 1500,
    emptyOutDir : true,
    rollupOptions: {
      onwarn(warning, warn) {
        if (warning.code === "MODULE_LEVEL_DIRECTIVE") {
          return;
        }
        warn(warning);
      },
    },
  },
  server:{
    port: 3000
  },
  plugins: [mkcert()],
})
