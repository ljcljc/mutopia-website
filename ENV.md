# 环境变量配置说明

本项目使用 Vite 的环境变量系统来管理不同环境的配置。

## 环境变量文件

项目包含以下环境变量文件：

- `.env.example` - 环境变量模板文件（会被提交到 Git）
- `.env.development` - 开发环境配置（本地开发使用）
- `.env.test` - 测试/预发布环境配置
- `.env.production` - 生产环境配置

## 环境变量列表

### API 配置

| 变量名 | 说明 | 默认值 | 示例 |
|--------|------|--------|------|
| `VITE_API_BASE_URL` | API 基础 URL | `'https://api.mutopia.ca'` | `https://api.mutopia.ca` |

**注意**: 
- 开发环境：如果留空，Vite 代理会使用默认值 `https://api.mutopia.ca`
- 开发环境：如果设置了值，Vite 代理会使用该值作为目标地址
- 生产环境：必须设置完整的 API 服务器地址

### 开发调试配置

| 变量名 | 说明 | 默认值 | 可选值 |
|--------|------|--------|--------|
| `VITE_DEBUG` | 启用调试日志 | `false` | `'true'` \| `'false'` |

### 应用配置

| 变量名 | 说明 | 默认值 |
|--------|------|--------|
| `VITE_APP_NAME` | 应用名称 | `'Mutopia Pet'` |
| `VITE_APP_VERSION` | 应用版本 | `'1.0.0'` |

### 功能开关

| 变量名 | 说明 | 默认值 | 可选值 |
|--------|------|--------|--------|
| `VITE_ENABLE_GUEST_MODE` | 启用访客模式 | `'true'` | `'true'` \| `'false'` |
| `VITE_ENABLE_SOCIAL_LOGIN` | 启用社交登录 | `'true'` | `'true'` \| `'false'` |
| `VITE_ENABLE_PAYMENT` | 启用支付功能 | `'true'` | `'true'` \| `'false'` |
| `VITE_ENABLE_REVIEW` | 启用评价功能 | `'true'` | `'true'` \| `'false'` |

### 第三方服务配置

| 变量名 | 说明 | 默认值 |
|--------|------|--------|
| `VITE_STRIPE_PUBLIC_KEY` | Stripe 公钥 | - |
| `VITE_GOOGLE_CLIENT_ID` | Google OAuth 客户端 ID | - |
| `VITE_FACEBOOK_APP_ID` | Facebook App ID | - |

### 性能配置

| 变量名 | 说明 | 默认值 | 单位 |
|--------|------|--------|------|
| `VITE_API_TIMEOUT` | API 请求超时时间 | `30000` | 毫秒 |
| `VITE_API_RETRY` | API 请求重试次数 | `0` | 次 |
| `VITE_API_RETRY_DELAY` | API 请求重试延迟 | `1000` | 毫秒 |

## 当前配置

### 开发环境 (Development)
```bash
VITE_API_BASE_URL=          # 留空，使用 Vite 代理
VITE_DEBUG=true
VITE_APP_NAME=Mutopia Pet (Dev)
```

### 测试环境 (Test)
```bash
VITE_API_BASE_URL=https://api-test.mutopia.ca
VITE_DEBUG=true
VITE_APP_NAME=Mutopia Pet (Test)
```

### 生产环境 (Production)
```bash
VITE_API_BASE_URL=https://api.mutopia.ca
VITE_DEBUG=false
VITE_APP_NAME=Mutopia Pet
```

## 使用方法

### 开发模式

**默认开发环境（使用 .env.development）：**
```bash
pnpm dev
```

**测试环境开发模式（使用 .env.test）：**
```bash
pnpm dev:test
```

### 构建

**开发环境构建：**
```bash
pnpm build
```

**测试环境构建：**
```bash
pnpm build:test
```

**生产环境构建：**
```bash
pnpm build:prod
```

## 环境变量优先级

Vite 会按以下优先级加载环境变量（高优先级覆盖低优先级）：

1. `.env.[mode].local` - 本地覆盖文件（最高优先级，不会被 Git 提交）
2. `.env.local` - 本地覆盖文件（不会被 Git 提交）
3. `.env.[mode]` - 模式特定文件（如 `.env.test`）
4. `.env` - 默认文件

## 自定义配置

如果需要自定义环境变量：

1. 复制 `.env.example` 到对应的环境文件
2. 修改 `VITE_API_BASE_URL` 的值
3. 确保环境变量以 `VITE_` 开头（Vite 要求）

## 注意事项

- 所有 `.env*` 文件（除了 `.env.example`）都会被 Git 忽略
- 环境变量必须以 `VITE_` 前缀开头才能在客户端代码中使用
- 修改环境变量后需要重启开发服务器才能生效
- 生产环境构建时，环境变量会被内联到代码中

## 在代码中使用

环境变量在代码中通过 `import.meta.env` 访问：

```typescript
// 基本使用
const apiUrl = import.meta.env.VITE_API_BASE_URL;
const isDebug = import.meta.env.VITE_DEBUG === 'true';

// 带默认值
const apiUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';
const appName = import.meta.env.VITE_APP_NAME || 'Mutopia Pet';
```

### 当前实现位置

**HTTP 客户端** (`src/lib/http.ts`):
```typescript
const API_BASE_URL = import.meta.env.DEV 
  ? '' // 开发环境使用相对路径，通过 Vite 代理
  : (import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000');
const DEBUG = import.meta.env.VITE_DEBUG === 'true' || import.meta.env.DEV;
```

### 类型安全

为了获得更好的 TypeScript 类型支持，可以在 `src/vite-env.d.ts` 中声明环境变量类型：

```typescript
/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_BASE_URL: string;
  readonly VITE_DEBUG: string;
  readonly VITE_APP_NAME: string;
  readonly VITE_APP_VERSION: string;
  // ... 其他环境变量
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
```

## 环境变量验证

建议在应用启动时验证必需的环境变量：

```typescript
// src/lib/env.ts
export function validateEnv() {
  const required = ['VITE_API_BASE_URL'];
  const missing = required.filter(key => !import.meta.env[key]);
  
  if (missing.length > 0 && !import.meta.env.DEV) {
    console.error('Missing required environment variables:', missing);
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
  }
}
```

## 最佳实践

1. **敏感信息**: 不要在环境变量中存储敏感信息（如私钥、密码）
2. **默认值**: 为可选的环境变量提供合理的默认值
3. **类型检查**: 使用 TypeScript 类型定义确保类型安全
4. **文档更新**: 添加新环境变量时，记得更新 `.env.example` 和本文档
5. **版本控制**: 只提交 `.env.example`，不要提交实际的环境变量文件
6. **环境隔离**: 不同环境使用不同的配置文件，避免混淆

