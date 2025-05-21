import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  plugins: [
    react(),
    tsconfigPaths(),
  ],
  base: './',
  root: './',
  publicDir: 'public',
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: './index.html',
      },
      // Add known external dependencies here
      external: [
        '@tanstack/react-query',
        // Add other missing dependencies here if they appear in future errors
      ],
    },
  },
  server: {
    port: 5173,
    strictPort: true,
    host: true,
  },
  resolve: {
    alias: [
      { find: '@', replacement: '/src' },
    ],
  },
  optimizeDeps: {
    include: ['@tanstack/react-query'],
  },
});
