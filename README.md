# Mutopia Pet Landing Page

这是一个基于 Figma 设计图 1:1 还原的宠物服务着陆页项目，使用 React + TypeScript + Tailwind CSS 构建，具有完整的响应式布局和交互功能。

## 技术栈

- **React 18+** - UI 框架
- **TypeScript** - 类型安全
- **Tailwind CSS v4.0** - 样式框架
- **shadcn/ui** - UI 组件库
- **Lucide React** - 图标库
- **Sonner** - Toast 通知
- **Motion (Framer Motion)** - 动画库
- **pnpm** - 包管理器

## 项目特点

- ✅ 完全响应式设计（桌面端/平板/移动端）
- ✅ 基于 Figma 设计 1:1 还原
- ✅ 完整的用户登录流程
- ✅ 自定义组件（Checkbox、Radio、Accordion、Spinner）
- ✅ 平滑滚动和动画效果
- ✅ 用户上下文管理

## 项目结构

```
├── App.tsx                 # 主应用入口
├── components/             # React 组件
│   ├── Header.tsx         # 头部导航
│   ├── Hero.tsx           # 英雄区域
│   ├── WhyUs.tsx          # 为什么选择我们
│   ├── Services.tsx       # 服务介绍
│   ├── Packages.tsx       # 套餐价格
│   ├── FAQ.tsx            # 常见问题
│   ├── Footer.tsx         # 页脚
│   ├── LoginModal.tsx     # 登录弹窗
│   ├── UserContext.tsx    # 用户状态管理
│   ├── ui/                # shadcn/ui 组件
│   └── figma/             # Figma 特定组件
├── imports/               # Figma 导入的资源
│   ├── *.tsx             # Figma 导入的组件
│   └── svg-*.ts          # SVG 路径定义
└── styles/
    └── globals.css       # 全局样式
```

## 🚨 Figma Make 平台特殊功能说明

此项目最初在 **Figma Make** 平台上开发，使用了一些平台特定功能。在本地环境运行需要进行以下调整：

### 1. 图片导入路径 (`figma:asset`)

**平台功能：** Figma Make 支持 `figma:asset` 协议来导入 Figma 设计中的图片资源。

**本地替换方案：**

```typescript
// Figma Make 平台写法
import imgA from "figma:asset/76faf8f617b56e6f079c5a7ead8f927f5a5fee32.png";

// 本地环境替换为：
import imgA from "./assets/image-name.png";
```

**操作步骤：**

1. 创建 `/public/assets` 或 `/src/assets` 目录
2. 将所有图片资源放入该目录
3. 全局搜索 `figma:asset` 并替换为实际的本地路径
4. 或使用占位图片服务（如 Unsplash）

### 2. ImageWithFallback 组件

**平台功能：** Figma Make 提供的带回退功能的图片组件。

**本地实现：** 该组件已包含在项目中（`/components/figma/ImageWithFallback.tsx`），无需额外操作。

### 3. 特定版本的包导入

**平台功能：** 支持直接导入特定版本的包。

```typescript
// Figma Make 平台写法
import { toast } from "sonner@2.0.3";

// 本地环境需要：
// 1. 在 package.json 中指定版本
// 2. 正常导入
import { toast } from "sonner";
```

## 本地环境设置

### 前置要求

- **Node.js** 16.x 或更高版本
- **npm** 或 **yarn** 或 **pnpm**

### 安装步骤

1. **克隆或下载项目**

```bash
# 如果是从 Git 仓库克隆
git clone <repository-url>
cd mutopia-pet-landing

# 或直接下载并解压项目文件
```

2. **创建 package.json**

如果项目中没有 `package.json`，创建一个：

```json
{
  "name": "mutopia-pet-landing",
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview",
    "lint": "eslint . --ext ts,tsx --report-unused-disable-directives --max-warnings 0"
  },
  "dependencies": {
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "lucide-react": "^0.408.0",
    "sonner": "^2.0.3",
    "motion": "^10.18.0",
    "clsx": "^2.1.1",
    "tailwind-merge": "^2.4.0",
    "@radix-ui/react-accordion": "^1.2.0",
    "@radix-ui/react-alert-dialog": "^1.1.1",
    "@radix-ui/react-aspect-ratio": "^1.1.0",
    "@radix-ui/react-avatar": "^1.1.0",
    "@radix-ui/react-checkbox": "^1.1.1",
    "@radix-ui/react-collapsible": "^1.1.0",
    "@radix-ui/react-dialog": "^1.1.1",
    "@radix-ui/react-dropdown-menu": "^2.1.1",
    "@radix-ui/react-label": "^2.1.0",
    "@radix-ui/react-popover": "^1.1.1",
    "@radix-ui/react-radio-group": "^1.2.0",
    "@radix-ui/react-scroll-area": "^1.1.0",
    "@radix-ui/react-select": "^2.1.1",
    "@radix-ui/react-separator": "^1.1.0",
    "@radix-ui/react-slider": "^1.2.0",
    "@radix-ui/react-slot": "^1.1.0",
    "@radix-ui/react-switch": "^1.1.0",
    "@radix-ui/react-tabs": "^1.1.0",
    "@radix-ui/react-toast": "^1.2.1",
    "@radix-ui/react-toggle": "^1.1.0",
    "@radix-ui/react-toggle-group": "^1.1.0",
    "@radix-ui/react-tooltip": "^1.1.2",
    "react-hook-form": "^7.55.0",
    "recharts": "^2.12.7",
    "react-day-picker": "^8.10.1",
    "date-fns": "^3.6.0"
  },
  "devDependencies": {
    "@types/react": "^18.3.3",
    "@types/react-dom": "^18.3.0",
    "@typescript-eslint/eslint-plugin": "^7.13.1",
    "@typescript-eslint/parser": "^7.13.1",
    "@vitejs/plugin-react": "^4.3.1",
    "eslint": "^8.57.0",
    "eslint-plugin-react-hooks": "^4.6.2",
    "eslint-plugin-react-refresh": "^0.4.7",
    "typescript": "^5.2.2",
    "vite": "^5.3.1",
    "tailwindcss": "^4.0.0",
    "@tailwindcss/vite": "^4.0.0"
  }
}
```

3. **安装依赖**

```bash
# 推荐使用 pnpm（更快、更节省空间）
pnpm install

# 或者使用其他包管理器
npm install
# 或
yarn install
```

4. **创建 Vite 配置文件**

创建 `vite.config.ts`：

```typescript
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./"),
    },
  },
});
```

5. **创建 TypeScript 配置**

创建 `tsconfig.json`：

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["./*"]
    }
  },
  "include": ["**/*.ts", "**/*.tsx"],
  "exclude": ["node_modules"]
}
```

6. **创建入口 HTML 文件**

创建 `index.html`：

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Mutopia Pet - Pet Care Services</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/main.tsx"></script>
  </body>
</html>
```

7. **创建主入口文件**

创建 `main.tsx`：

```typescript
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './styles/globals.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
```

8. **处理图片资源（重要！）**

由于项目使用了 `figma:asset` 导入，需要进行以下操作之一：

**选项 A：替换为实际图片**

```bash
# 创建资源目录
mkdir -p public/assets

# 将 Figma 导出的图片放入该目录
# 然后全局搜索并替换所有 figma:asset 引用
```

**选项 C：修改 ImageWithFallback 组件**

```typescript
// 在 components/figma/ImageWithFallback.tsx 中
// 设置默认的 fallback 图片为占位图
```

### 运行项目

```bash
# 开发模式
pnpm dev

# 构建生产版本
pnpm build

# 预览生产构建
pnpm preview

# 代码检查和修复
pnpm lint
pnpm lint:fix

# 类型检查
pnpm type-check

# 运行自动测试
pnpm test

# 监听模式运行测试
pnpm test:watch

# 清理和重新安装
pnpm clean
pnpm reinstall

# 检查过时的依赖
pnpm outdated
```

访问 `http://localhost:5173`（默认端口）查看应用。

### CI 校验

项目已配置 GitHub Actions CI，触发条件如下：

- push 到 `main`
- 任意 `pull_request`

CI 会执行以下校验：

- `pnpm type-check`
- `pnpm test`
- `pnpm lint`

建议在本地提交前至少先运行一次：

```bash
pnpm type-check && pnpm test && pnpm lint
```

## 核心功能说明

### 1. 用户认证系统

- 邮箱验证（模拟 API）
- 密码输入与验证
- 密码强度检测（强/中/弱）
- Remember Me 功能
- 用户状态管理（UserContext）

**测试账号：**

- 任何包含 "test" 的邮箱会被识别为已注册用户
- 模拟密码：`123456` 或 `password`

### 2. 响应式设计

- **桌面端**（>= 1024px）：左右布局，最大宽度 1280px
- **平板端**（768px - 1023px）：优化的中等尺寸布局
- **移动端**（< 768px）：上下堆叠布局

### 3. 自定义组件

所有自定义组件都包含完整的使用文档：

- `components/demo/CHECKBOX_GUIDE.md` - Checkbox 使用指南
- `components/demo/SPINNER_GUIDE.md` - Spinner 使用指南
- 查看 `components/demo/` 目录获取更多示例

### 4. 页面区块

1. **Header** - 响应式导航栏，带登录/用户状态
2. **Hero** - 英雄区域，主要 CTA
3. **WhyUs** - 特色功能展示
4. **Services** - 服务介绍（带图片和描述）
5. **Packages** - 价格套餐（3 个套餐选项）
6. **FAQ** - 常见问题（手风琴组件）
7. **Footer** - 页脚链接和信息

## 常见问题

### Q: 运行时出现 "Cannot find module" 错误？

**A:** 确保所有依赖都已安装。如果使用了特定版本的包（如 `react-hook-form@7.55.0`），需要在 `package.json` 中指定。

### Q: 图片无法显示？

**A:** 检查是否正确处理了 `figma:asset` 导入。参考上面的"处理图片资源"部分。

### Q: Tailwind 样式不生效？

**A:** 确保：

1. 已安装 `tailwindcss@4.0.0` 和 `@tailwindcss/vite`
2. `styles/globals.css` 文件存在且被正确导入
3. Vite 配置中没有冲突的插件

### Q: Motion/Framer Motion 动画不工作？

**A:** 确保使用正确的导入：

```typescript
import { motion } from "motion/react";
// 不是 'framer-motion'
```

### Q: Toast 通知不显示？

**A:** 确保在 App.tsx 中包含了 Toaster 组件：

```typescript
import { Toaster } from "sonner";

function App() {
  return (
    <>
      <YourComponents />
      <Toaster />
    </>
  );
}
```

## 自定义和扩展

### 修改主题颜色

编辑 `styles/globals.css` 中的 CSS 变量：

```css
:root {
  --primary: #your-color;
  --secondary: #your-color;
  /* 等等... */
}
```

### 添加新页面区块

1. 在 `components/` 中创建新组件
2. 在 `App.tsx` 中导入并使用
3. 使用 `max-w-7xl` 类保持一致的容器宽度

### 连接真实 API

项目已集成完整的 API 客户端，位于 `src/lib/api.ts`。所有 API 端点定义在 `src/api/openapi.json`（OpenAPI 3.1.0 规范）。

**主要 API 模块：**

1. **认证模块** (`/api/auth/*`)
   - 邮箱验证、发送验证码、登录、注册
   - 社交登录、密码重置
   - JWT Token 管理（自动加密存储）

2. **服务目录** (`/api/catalog/*`)
   - 获取服务列表和附加服务

3. **宠物管理** (`/api/pets/*`)
   - 宠物 CRUD 操作
   - 照片上传（支持进度回调）

4. **预约管理** (`/api/bookings/*`)
   - 预约创建、查询、取消
   - 价格报价、地址管理
   - 签到/签退、评价

5. **支付管理** (`/api/payments/*`)
   - Stripe Checkout 集成
   - 押金和最终支付会话

6. **促销相关** (`/api/promotions/*`)
   - 会员套餐、优惠券管理

**使用示例：**

```typescript
import { checkEmailRegistered, login, getCurrentUser } from "@/lib/api";

// 检查邮箱是否已注册
const result = await checkEmailRegistered("user@example.com");

// 用户登录（自动保存 token）
const tokens = await login({
  email: "user@example.com",
  password: "password",
  code: "123456"
});

// 获取当前用户信息（自动使用保存的 token）
const user = await getCurrentUser();
```

**详细 API 文档：** 查看 `src/api/openapi.json` 或项目记忆文件 `mutopia-api-structure.md`

## 部署

### Vercel（推荐）

```bash
npm install -g vercel
vercel
```

### Netlify

```bash
npm run build
# 上传 dist/ 目录到 Netlify
```

### 其他平台

构建输出在 `dist/` 目录，可直接部署到任何静态托管服务。

## 🤖 Cursor AI Prompt

**To set up this project locally, please:**

1. Create all missing configuration files listed in the README under "Missing Configuration Files"
2. Create `src/main.tsx` as the React entry point
3. Create `index.html` at the project root
4. Move all existing source files (`App.tsx`, `components/`, `styles/`) into a new `src/` directory
5. Replace all `figma:asset` imports in these three files with placeholder URLs:
   - `src/components/Header.tsx` (line 4)
   - `src/components/Footer.tsx` (line 5)
   - `src/components/Hero.tsx` (line 4)
6. Update all relative imports in components to account for the new `src/` directory structure
7. Ensure `package.json` is at the project root
8. Run `npm install` to install dependencies
9. Run `npm run dev` to start the development server

## 许可证

本项目仅供学习和演示使用。

## 支持

如有问题或建议，请查看：

- 组件使用指南：`components/demo/` 目录
- 开发指南：`guidelines/Guidelines.md`

---

**注意：** 此项目从 Figma Make 平台导出，部分功能需要按照上述说明进行调整才能在本地环境完整运行。
