import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tsconfigPaths from 'vite-tsconfig-paths'
import path from 'path'

export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    host: true,
    allowedHosts: ['frontend'],
    proxy: {
      '/elementos': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        secure: false,
      },
      '/caracteristicas': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        secure: false,
      },
    },
  },
  plugins: [react(), tsconfigPaths()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          react: ['react', 'react-dom'],
          heroUI: ['@heroicons/react', '@heroui/react'],
        },
      },
    },
    chunkSizeWarningLimit: 1000, // Opcional: sube el límite si aún quieres evitar la advertencia
  },
})
