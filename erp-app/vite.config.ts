import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  // For GitHub Pages deployment: use your repo name
  // If deployed to https://username.github.io/hardware-erp/, set base to '/hardware-erp/'
  // If deployed to root (username.github.io), set base to '/'
  base: process.env.VITE_BASE_URL || '/hardware-erp/',
  server: {
    port: 5173,
    strictPort: false,
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    outDir: 'dist',
    sourcemap: false, // Disable sourcemaps for smaller build size on free tier
    minify: 'terser', // Aggressive minification
  },
});
