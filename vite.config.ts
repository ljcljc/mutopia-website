import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
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
      tailwindcss(),
      react(),
    ],
    resolve: {
      alias: {
        "@": resolve(fileURLToPath(new URL(".", import.meta.url)), "src"),
      },
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
      },
    },
  };
});
