import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  server:{
    proxy:{
      "/api": {
        target: "http://localhost:3000", // Replace with your actual backend URL
        changeOrigin: true,
        secure: false, // Set to true if using HTTPS
      },
    }
  },
  plugins: [react(),
    tailwindcss(),
  ],
})
