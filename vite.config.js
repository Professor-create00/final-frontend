import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: '/', // ✅ absolute paths so assets load on refresh
  build: {
    outDir: 'dist', // ✅ fine, default is dist
  },
});
