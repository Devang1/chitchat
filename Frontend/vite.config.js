import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  server:{
    proxy:{
      "/api": {
        target: "https://chitchat2.onrender.com", // Replace with your actual backend URL
        changeOrigin: true,
        secure: true, // Set to true if using HTTPS
      },
    }
  },
  plugins: [react(),
    tailwindcss(),
  ],
})
