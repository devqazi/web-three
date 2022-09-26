import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  define: {
    "process.env.TESS_ENV": process.env.ENV,
  },
  plugins: [react()],
  server: {
    host: '0.0.0.0',
  },
})
