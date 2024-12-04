import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'

// https://vite.dev/config/
export default defineConfig({
  plugins: [svelte()],
  
  build: {
    lib: {
      entry: './src/main.js',
      name: 'ChatBot',
      fileName: (format) => `chat.bundle.${format}.js`,
      formats: ['es'],
    },
    rollupOptions: {
      output: {
        assetFileNames: (assetInfo) => {
          if (assetInfo.name === 'chatbot.css') {
            return 'styles.css';
          }
          return '[name].[ext]';
        },
      },
    },
  },
 
})
