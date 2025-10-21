// vite.config.js
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
// ... other imports

export default defineConfig({
  base: '/vue-lessons/', // Use your repository name here
  plugins: [
    vue(),
    //... other plugins
  ],
  // ... resolve settings
})