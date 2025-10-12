# Mutopia Pet Grooming - 项目配置说明

## 🎉 项目概述

一个使用现代技术栈构建的宠物美容服务网站，完全响应式设计，具有完善的开发工具链。

## 🚀 技术栈

### 核心框架
- **Vue 3.5.22** - 使用 Composition API (`<script setup>`)
- **TypeScript 5.6.3** - 类型安全
- **Vite 6.0.1** - 快速构建工具

### UI & 样式
- **Tailwind CSS 4.0** - 实用优先的CSS框架
- **Radix Vue 1.9.17** - 无样式、可访问的UI组件
- **Lucide Vue Next** - 图标库
- **class-variance-authority** - 组件变体管理

### 开发工具链

#### 1. 代码格式化 (Prettier)
```bash
npm run format        # 格式化所有代码
npm run format:check  # 检查格式
```

**配置文件**: `.prettierrc`
- 单引号
- 分号
- 2空格缩进
- 行宽100字符

#### 2. 代码检测 (ESLint 9)
```bash
npm run lint         # 检测并自动修复
npm run lint:check   # 仅检测
```

**配置文件**: `eslint.config.js` (Flat Config)
- 支持 Vue 3 + TypeScript
- 自动修复问题
- 与 Prettier 集成

#### 3. Git Hooks (Husky + lint-staged)

**Pre-commit Hook**:
- 自动格式化暂存文件
- 运行 ESLint 检测
- 只处理暂存的文件

**Commit-msg Hook**:
- 验证提交消息格式
- 强制使用约定式提交

#### 4. 提交规范 (Commitlint)

**格式**: `type(scope?): subject`

**允许的类型**:
- `feat` - 新功能
- `fix` - Bug修复
- `docs` - 文档更新
- `style` - 代码格式
- `refactor` - 代码重构
- `perf` - 性能优化
- `test` - 测试
- `chore` - 构建/工具
- `revert` - 回退
- `build` - 打包

**示例**:
```bash
git commit -m "feat: 添加用户认证功能"
git commit -m "fix: 修复导航栏样式问题"
git commit -m "docs: 更新README文档"
```

## 📦 项目结构

```
mutopia-pet-grooming/
├── src/
│   ├── components/
│   │   ├── ui/              # 可复用UI组件
│   │   │   ├── accordion.vue
│   │   │   ├── avatar.vue
│   │   │   ├── badge.vue
│   │   │   ├── button.vue
│   │   │   ├── card.vue
│   │   │   ├── dialog.vue
│   │   │   ├── input.vue
│   │   │   ├── label.vue
│   │   │   ├── separator.vue
│   │   │   ├── tabs.vue
│   │   │   └── utils.ts
│   │   ├── figma/           # Figma组件
│   │   │   └── ImageWithFallback.vue
│   │   ├── AuthDialog.vue   # 认证对话框
│   │   ├── FAQ.vue          # 常见问题
│   │   ├── Footer.vue       # 页脚
│   │   ├── Header.vue       # 头部导航
│   │   ├── Hero.vue         # 首屏
│   │   ├── Packages.vue     # 服务套餐
│   │   ├── Services.vue     # 服务内容
│   │   ├── Testimonials.vue # 客户评价
│   │   └── WhyUs.vue        # 选择我们的理由
│   ├── styles/
│   │   └── globals.css      # 全局样式
│   ├── App.vue              # 根组件
│   ├── main.ts              # 应用入口
│   └── env.d.ts             # TypeScript声明
├── public/
│   ├── favicon/             # 网站图标
│   ├── images/              # 图片资源
│   ├── robots.txt           # 搜索引擎爬虫配置
│   └── sitemap.xml          # 网站地图
├── .husky/                  # Git hooks
│   ├── pre-commit           # 提交前检查
│   └── commit-msg           # 提交消息验证
├── .prettierrc              # Prettier配置
├── .prettierignore          # Prettier忽略文件
├── eslint.config.js         # ESLint配置
├── .lintstagedrc.json       # lint-staged配置
├── commitlint.config.cjs    # Commitlint配置
├── vite.config.ts           # Vite配置
├── tsconfig.json            # TypeScript配置
└── package.json             # 项目依赖
```

## 🛠️ 开发指南

### 启动开发服务器
```bash
npm run dev
```
访问: http://localhost:3000

### 生产构建
```bash
npm run build
```
- 自动移除 `console.log`
- 保留 `console.warn` 和 `console.error`
- 输出到 `dist/` 目录

### 预览生产版本
```bash
npm run preview
```

## 🎨 UI组件库

所有UI组件基于 Radix Vue 构建，确保可访问性：

### 可用组件
- **Accordion** - 可展开/折叠内容
- **Avatar** - 用户头像（带回退）
- **Badge** - 标签徽章
- **Button** - 多种变体按钮
- **Card** - 卡片容器
- **Dialog** - 模态对话框
- **Input** - 表单输入
- **Label** - 表单标签
- **Separator** - 分隔线
- **Tabs** - 选项卡切换

### 使用示例
```vue
<script setup lang="ts">
import Button from '@/components/ui/button.vue';
</script>

<template>
  <Button variant="default" size="lg">
    点击我
  </Button>
</template>
```

## 📱 响应式设计

断点配置：
- **Mobile**: < 640px
- **Tablet**: 640px - 1024px
- **Desktop**: > 1024px

## ♿ 可访问性

- ✅ 语义化HTML
- ✅ ARIA标签和角色
- ✅ 键盘导航
- ✅ 焦点管理
- ✅ 屏幕阅读器支持

## 🔍 SEO优化

- ✅ Meta标签（Open Graph, Twitter Card）
- ✅ 结构化数据（JSON-LD）
- ✅ Sitemap.xml
- ✅ Robots.txt
- ✅ 图片alt文本
- ✅ 语义化HTML结构

## 📊 依赖统计

- **总依赖包**: 348个
- **生产依赖**: 8个
- **开发依赖**: 11个
- **安全漏洞**: 0个

## 🔧 配置详情

### Vite配置特性
- Vue 3 插件
- Tailwind CSS 4 插件
- 路径别名 (`@/` → `src/`)
- 开发服务器端口: 3000
- 生产构建: Terser压缩 + 移除console.log

### TypeScript配置
- Target: ES2020
- JSX: preserve (Vue)
- 严格模式
- 路径映射支持

### Tailwind CSS
- 通过 `@import "tailwindcss"` 导入
- CSS变量主题系统
- 自定义颜色和字体

## 📄 许可证

MIT License

## 👥 作者

Mutopia Team

---

## 🎯 快速开始

```bash
# 1. 安装依赖
npm install

# 2. 启动开发服务器
npm run dev

# 3. 构建生产版本
npm run build

# 4. 预览生产版本
npm run preview
```

## 💡 提交代码

```bash
# 1. 暂存文件
git add .

# 2. 提交（会自动格式化和检测）
git commit -m "feat: 添加新功能"

# 3. 推送
git push
```

**注意**:
- Pre-commit hook 会自动格式化和检测代码
- Commit message 必须符合约定式提交规范
- 开发环境保留 console.log，生产环境自动移除

