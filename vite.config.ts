import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react-swc';
import path from 'path';
import { defineConfig } from 'vite';

export default defineConfig({
  clearScreen: false,
  server: {
    strictPort: true,
    host: 'localhost',
    port: 5173,
  },
  plugins: [react(), tailwindcss()],
  build: {
    target: 'safari13',
    minify: false,
    sourcemap: true,
  },
  envPrefix: ['VITE_', 'TAURI_ENV_*'],
  resolve: {
    alias: {
      // eslint-disable-next-line no-undef
      '@': path.resolve(__dirname, 'src'),
    },
  },
});
