import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import glsl from 'vite-plugin-glsl';
import * as path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), glsl()],
  optimizeDeps: {
    exclude: [
      'miniplex',
      'miniplex-react',
      '@hmans/controlfreak',
      '@hmans/signal',
      '@hmans/ui',
    ],
    include: ['react/jsx-runtime'],
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
});
