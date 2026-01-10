# Cloudflare Pages Functions 设置指南

## 问题：Functions 未自动启用

如果 Cloudflare Pages 没有自动识别和启用 Functions，请按照以下步骤检查和配置。

## 检查清单

### 1. 确认 functions/ 目录结构

确保项目根目录下有 `functions/` 目录，结构如下：

```
mutopia-pet/
├── functions/
│   └── media/
│       └── [[path]].ts
├── src/
├── dist/
└── ...
```

### 2. 确认 functions/ 目录已提交到 Git

```bash
# 检查 functions 目录是否在 Git 中
git ls-files functions/

# 如果不在，添加并提交
git add functions/
git commit -m "Add Cloudflare Pages Functions"
git push
```

### 3. 在 Cloudflare Dashboard 中配置

#### 方法 A：Git 集成部署（推荐）

1. 进入 [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. 选择你的 Pages 项目
3. 进入 **Settings** → **Builds & deployments**
4. 检查以下设置：
   - **Build command**: `pnpm build` 或 `npm run build`
   - **Build output directory**: `dist`
   - **Root directory**: `/`（项目根目录）

5. **重要**：确保 **Functions** 功能已启用
   - 在 Settings 页面，查找 "Functions" 或 "Workers" 相关设置
   - 如果看到 "Enable Functions" 选项，请启用它

#### 方法 B：直接上传部署

1. 构建项目：
   ```bash
   pnpm build
   ```

2. 确认 `dist/` 目录包含 `functions/`：
   ```bash
   ls -la dist/functions/
   ```

3. 如果 `functions/` 不在 `dist/` 中，构建脚本会自动复制（已配置）

4. 上传 `dist/` 目录到 Cloudflare Pages

### 4. 验证 Functions 是否启用

部署后，检查：

1. **在 Cloudflare Dashboard 中**：
   - 进入 Pages 项目
   - 查看最新部署的详情
   - 应该能看到 "Functions" 相关的信息

2. **测试 Function**：
   - 访问你的网站：`https://your-site.pages.dev/media/test`
   - 应该能正常代理请求（而不是 404）

### 5. 环境变量配置

如果 Function 需要环境变量：

1. 进入 **Settings** → **Environment Variables**
2. 添加变量：
   - **变量名**: `API_BASE_URL`
   - **值**: `https://api.mutopia.ca`
   - **环境**: Production（或根据需要选择）

## 常见问题

### Q: Functions 仍然未启用

**A**: 尝试以下步骤：

1. **重新部署**：
   - 在 Cloudflare Dashboard 中，进入部署历史
   - 点击 "Retry deployment" 重新部署

2. **检查构建日志**：
   - 查看部署日志，确认是否有错误
   - 确认 `functions/` 目录被识别

3. **手动启用**：
   - 某些情况下，需要在 Cloudflare Dashboard 中手动启用 Functions
   - 查找 "Workers" 或 "Functions" 相关设置

### Q: Function 返回 404

**A**: 检查：

1. 路径是否正确：应该是 `/media/*`，不是 `/api/media/*`
2. Function 文件命名：`[[path]].ts` 用于 catch-all 路由
3. 部署是否成功：检查部署日志

### Q: 本地开发时 Function 不工作

**A**: 这是正常的。Functions 只在 Cloudflare Pages 部署后生效。本地开发时使用 Vite 代理（`vite.config.ts` 中已配置）。

## 参考文档

- [Cloudflare Pages Functions 文档](https://developers.cloudflare.com/pages/functions/)
- [Functions 路由文档](https://developers.cloudflare.com/pages/functions/routing/)









