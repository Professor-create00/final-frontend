import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: './', // keeps relative paths for assets
  build: {
    outDir: 'dist', // default is fine but explicit
  },
  server: {
    historyApiFallback: true, // critical for React Router during dev
  }
});
