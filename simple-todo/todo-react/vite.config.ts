import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    port: 3001,
    cors: {
      origin: ['http://localhost:3001/','http://localhost:3000/'],
    }
  },
  plugins: [react()],
})
