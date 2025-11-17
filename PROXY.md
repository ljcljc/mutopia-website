# Vite 代理配置说明

本项目已配置 Vite 开发服务器代理，用于解决 CORS 跨域问题。

## 配置说明

### 代理规则

所有以 `/api` 开头的请求都会被代理到后端服务器：

- **开发环境**: `http://localhost:5173/api/*` → `https://api.mutopia.ca/api/*`
- **生产环境**: 直接使用 `VITE_API_BASE_URL` 配置的完整 URL

### 工作原理

1. **开发环境** (`import.meta.env.DEV === true`):
   - API 调用使用相对路径（如 `/api/auth/email/check`）
   - Vite 开发服务器拦截这些请求
   - 自动转发到配置的后端服务器
   - 修改请求头中的 `Origin`，避免 CORS 问题

2. **生产环境**:
   - API 调用使用完整的 URL（如 `https://api.mutopia.ca/api/auth/email/check`）
   - 直接请求后端服务器（需要后端配置 CORS）

## 配置详情

### vite.config.ts

```typescript
server: {
  proxy: {
    '/api': {
      target: 'https://api.mutopia.ca',
      changeOrigin: true,  // 修改请求头中的 origin
      secure: true,        // HTTPS 支持
      ws: true,           // WebSocket 支持
    },
  },
}
```

### src/lib/api.ts

```typescript
// 开发环境使用相对路径（通过代理）
// 生产环境使用完整 URL
const API_BASE_URL = import.meta.env.DEV 
  ? ''  // 开发环境：相对路径
  : (import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000');
```

## 使用方法

### 开发环境

1. 启动开发服务器：
   ```bash
   pnpm dev
   ```

2. API 请求会自动通过代理：
   ```typescript
   // 代码中调用
   fetch('/api/auth/email/check', { ... })
   
   // 实际请求
   // 前端: http://localhost:5173/api/auth/email/check
   // 代理后: https://api.mutopia.ca/api/auth/email/check
   ```

### 生产环境

1. 构建生产版本：
   ```bash
   pnpm build:prod
   ```

2. API 请求使用完整 URL：
   ```typescript
   // 代码中调用
   fetch('https://api.mutopia.ca/api/auth/email/check', { ... })
   ```

## 调试

### 查看代理请求

在浏览器 Network 面板中：
- 请求 URL 显示为：`http://localhost:5173/api/...`
- 实际请求被代理到：`https://api.mutopia.ca/api/...`

### 调试日志

如果启用了调试模式（`VITE_DEBUG=true`），会在控制台看到：
```
[API Debug] Request URL: /api/auth/email/check
[API Debug] Request body: { email: "user@example.com" }
[API Debug] Response status: 200 OK
```

## 常见问题

### 1. 代理不工作

**问题**: 请求仍然出现 CORS 错误

**解决方案**:
- 确保开发服务器已重启（修改 vite.config.ts 后需要重启）
- 检查代理配置中的 `target` 是否正确
- 确认请求路径以 `/api` 开头

### 2. 404 错误

**问题**: 请求返回 404

**解决方案**:
- 检查后端服务器地址是否正确
- 确认后端 API 路径是否存在
- 检查是否需要路径重写（`rewrite` 选项）

### 3. 生产环境 CORS 错误

**问题**: 生产环境仍然有 CORS 错误

**解决方案**:
- 生产环境不使用代理，需要后端配置 CORS
- 确保后端返回正确的 CORS 头：
  ```
  Access-Control-Allow-Origin: https://your-frontend-domain.com
  Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS
  Access-Control-Allow-Headers: Content-Type, Authorization
  ```

## 自定义代理配置

代理目标地址通过环境变量 `VITE_API_BASE_URL` 配置，无需修改 `vite.config.ts`。

如果需要代理到不同的服务器，只需修改对应的环境变量文件：

**开发环境** (`.env.development`):
```bash
VITE_API_BASE_URL=https://api-dev.mutopia.ca
```

**测试环境** (`.env.test`):
```bash
VITE_API_BASE_URL=https://api-test.mutopia.ca
```

代理配置会自动使用环境变量中的值：

```typescript
// vite.config.ts 会自动读取 VITE_API_BASE_URL
server: {
  proxy: {
    '/api': {
      target: apiBaseUrl, // 从环境变量读取
      changeOrigin: true,
      secure: true,
      ws: true,
    },
  },
}
```

如果需要重写路径，可以修改 `vite.config.ts`:

```typescript
'/api': {
  target: apiBaseUrl,
  changeOrigin: true,
  secure: true,
  ws: true,
  // 如果需要重写路径
  rewrite: (path) => path.replace(/^\/api/, '/v1/api'),
}
```

## 注意事项

1. **仅开发环境**: 代理只在开发环境（`pnpm dev`）生效
2. **生产环境**: 生产环境需要后端正确配置 CORS
3. **HTTPS**: 如果后端使用 HTTPS，确保 `secure: true`
4. **WebSocket**: 如果使用 WebSocket，确保 `ws: true`

