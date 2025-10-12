import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import tailwindcss from '@tailwindcss/vite';
import path from 'path';

export default defineConfig({
  plugins: [vue(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 3000,
    open: true,
  },
  build: {
    minify: 'terser',
    terserOptions: {
      compress: {
        // 生产环境移除 console.log
        drop_console: true,
        // 保留 console.warn 和 console.error
        pure_funcs: ['console.log'],
      },
    },
  },
});
