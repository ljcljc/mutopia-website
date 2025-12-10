# Cloudflare Pages Functions

这个目录包含 Cloudflare Pages Functions，用于在 Cloudflare Pages 部署时处理服务器端逻辑。

## 文件结构

```
functions/
  media/
    [[path]].ts    # 代理 /media/* 请求到 API 服务器
```

## 功能说明

### `/media/[[path]].ts`

代理所有 `/media/*` 路径的请求到后端 API 服务器（`https://api.mutopia.ca`）。

**功能：**
- 解决跨域（CORS）问题
- 避免浏览器在跨域请求时添加 `Cache-Control: no-cache` 头
- 正确传递缓存头，使浏览器能够缓存图片
- 支持所有 HTTP 方法（GET、HEAD、OPTIONS）

**环境变量：**
- `API_BASE_URL`：API 服务器地址（可选，默认为 `https://api.mutopia.ca`）

**在 Cloudflare Pages 中配置：**
1. 进入 Cloudflare Dashboard
2. 选择你的 Pages 项目
3. 进入 Settings → Environment Variables
4. 添加环境变量：
   - 变量名：`API_BASE_URL`
   - 值：`https://api.mutopia.ca`（或你的 API 服务器地址）

## 工作原理

1. **开发环境**：
   - 使用 Vite 代理（`vite.config.ts`）
   - 图片请求通过 `/media/*` 路径，由 Vite 代理转发到 API 服务器

2. **生产环境**：
   - 使用 Cloudflare Pages Function
   - 图片请求通过 `/media/*` 路径，由 Function 代理转发到 API 服务器
   - 避免了跨域问题，浏览器可以正常使用缓存

## 部署

Functions 会在部署到 Cloudflare Pages 时自动识别和部署。无需额外配置。

## 调试

在本地开发时，Functions 不会运行，使用 Vite 代理。只有在部署到 Cloudflare Pages 后，Functions 才会生效。
