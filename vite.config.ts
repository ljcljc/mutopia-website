import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import tailwindcss from '@tailwindcss/vite';
import path from 'path';
import AutoImport from 'unplugin-auto-import/vite';
import Components from 'unplugin-vue-components/vite';

export default defineConfig({
  plugins: [
    vue(),
    tailwindcss(),
    // 自动导入 Vue API
    AutoImport({
      imports: [
        'vue',
        {
          'lucide-vue-next': [
            // 按需导入常用图标
            'Menu',
            'X',
            'Calendar',
            'Star',
            'Heart',
            'Shield',
            'Clock',
            'Users',
            'Award',
            'Smartphone',
            'Quote',
            'Facebook',
            'Instagram',
            'Twitter',
            'Mail',
            'MapPin',
            'Check',
            'ChevronDown',
            'ArrowRight',
          ],
        },
      ],
      dts: 'src/auto-imports.d.ts',
      eslintrc: {
        enabled: true,
      },
    }),
    // 自动导入组件
    Components({
      dirs: ['src/components', 'src/components/ui'],
      extensions: ['vue'],
      dts: 'src/components.d.ts',
      deep: true,
    }),
  ],
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
