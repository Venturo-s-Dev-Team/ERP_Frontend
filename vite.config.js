import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // Proxy para o servidor na porta 3001
      '/api/ServerOne': {
        target: 'http://10.144.170.17:3001', // URL completa do servidor
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/ServerOne/, '')
      },
      // Proxy para o servidor na porta 3002
      '/api/ServerTwo': {
        target: 'http://10.144.170.17:3002', // URL completa do servidor 2
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/ServerTwo/, '')
      }
    }
  }
});
