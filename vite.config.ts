import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import svgr from "vite-plugin-svgr";
import { resolve } from "path";
import { fileURLToPath } from "url";


export default defineConfig(({ mode }) => {
  // 加载环境变量
  // 使用 import.meta.url 获取当前目录，兼容 ES 模块
  const root = fileURLToPath(new URL(".", import.meta.url));
  const env = loadEnv(mode, root, '');
  
  // 获取 API 基础 URL，如果没有配置则使用默认值
  const apiBaseUrl = env.VITE_API_BASE_URL || 'https://api.mutopia.ca';
  
  return {
    plugins: [
      react(),
      svgr({
        // 支持同时导入 URL 和组件
        svgrOptions: {
          icon: true,
          // 移除 SVG 的固定宽高，使其可缩放
          dimensions: false,
          // 使用 currentColor 替代固定颜色
          replaceAttrValues: {
            "#DE6A07": "currentColor",
            "#8B6357": "currentColor",
            "#4a3c2a": "currentColor",
            "#111113": "currentColor",
            "white": "currentColor",
            "#717182": "currentColor",
          },
        },
        // 支持 ?react 和 ?url 两种导入方式
        // 注意：include 应该匹配 ?react 查询参数
        include: "**/*.svg?react",
      }),
      tailwindcss(),
    ],
    resolve: {
      alias: {
        "@": resolve(fileURLToPath(new URL(".", import.meta.url)), "src"),
      },
    },
    build: {
      rollupOptions: {
        output: {
          manualChunks: (id) => {
            if (!id.includes("node_modules")) return;
            // React 相关库
            if (id.includes("react") || id.includes("react-dom") || id.includes("react-router")) {
              return "react-vendor";
            }
            // UI 组件库
            if (id.includes("sonner") || id.includes("@radix-ui")) {
              return "ui-vendor";
            }
            // 其他依赖交给 Rollup 自动分包，避免 vendor/react-vendor 形成循环引用
            return;
          },
        },
      },
      chunkSizeWarningLimit: 600, // 提高警告阈值到 600 KB
    },
    server: {
      proxy: {
        // 代理所有 /api 请求到后端服务器，解决 CORS 问题
        '/api': {
          target: apiBaseUrl,
          changeOrigin: true, // 修改请求头中的 origin
          secure: true, // 如果是 https 接口，需要配置这个参数
          // 可选：配置 WebSocket 代理
          ws: true,
          // 可选：重写路径（如果需要）
          // rewrite: (path) => path.replace(/^\/api/, ''),
        },
        // 代理图片资源请求，解决 CORS 和缓存问题
        '/media': {
          target: apiBaseUrl,
          changeOrigin: true,
          secure: true,
        },
      },
    },
  };
});
