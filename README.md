# Mutopia - Premium Pet Grooming 🐾

<div align="center">

一个现代化、响应式的宠物美容服务落地页，采用Vue 3 + TypeScript + Tailwind CSS 4构建。

[![Vue](https://img.shields.io/badge/Vue-3.5.13-4FC08D?logo=vue.js)](https://vuejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.6.3-3178C6?logo=typescript)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-6.3.6-646CFF?logo=vite)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.0-38B2AC?logo=tailwind-css)](https://tailwindcss.com/)

[在线演示](#) · [功能特性](#-功能特性) · [快速开始](#-快速开始) · [性能指标](#-性能指标)

</div>

---

## 📖 项目简介

Mutopia是一个专业的宠物美容服务品牌落地页，提供全面的宠物护理服务展示、在线预约、服务套餐和用户认证功能。项目采用最新的前端技术栈，注重性能、可访问性和用户体验。

## ✨ 功能特性

### 🎯 核心功能
- **响应式设计** - 完美适配手机、平板和桌面设备
- **智能导航** - 移动端菜单自动管理，窗口resize响应式切换
- **用户认证** - 完整的登录/注册对话框，支持OAuth和邮箱登录
- **服务展示** - 美容服务、套餐价格和用户评价展示
- **FAQ系统** - 可折叠的常见问题解答
- **SEO优化** - 完整的meta标签、sitemap和robots.txt

### 🎨 设计亮点
- 现代渐变背景和流畅动画
- 无障碍UI组件（Radix Vue）
- 深色模式支持（预留接口）
- 品牌色彩系统（Orange: #DE6A07, Brown: #8B6357）

### 🚀 技术亮点
- **自动导入** - Vue API和组件无需手动import
- **类型安全** - 完整的TypeScript支持
- **开发工具链** - Prettier + ESLint 9 + Husky + Commitlint
- **构建优化** - 生产环境自动移除console.log
- **本地资源** - 零CDN依赖，所有资源本地化

## 🛠️ 技术栈

### 核心框架
- **[Vue 3](https://vuejs.org/)** (3.5.13) - 采用Composition API和`<script setup>`
- **[TypeScript](https://www.typescriptlang.org/)** (5.6.3) - 类型安全开发
- **[Vite](https://vitejs.dev/)** (6.3.6) - 超快的构建工具

### UI & 样式
- **[Tailwind CSS v4](https://tailwindcss.com/)** - 实用优先的CSS框架
- **[Radix Vue](https://www.radix-vue.com/)** - 无样式的可访问组件库
- **[Lucide Vue](https://lucide.dev/)** - 美观一致的图标库
- **[class-variance-authority](https://cva.style/)** - 组件变体管理

### 开发工具
- **[unplugin-auto-import](https://github.com/unplugin/unplugin-auto-import)** - Vue API自动导入
- **[unplugin-vue-components](https://github.com/unplugin/unplugin-vue-components)** - 组件自动导入
- **[Prettier](https://prettier.io/)** - 代码格式化
- **[ESLint 9](https://eslint.org/)** - 代码检查（Flat Config）
- **[Husky](https://typicode.github.io/husky/)** + **[lint-staged](https://github.com/lint-staged/lint-staged)** - Git Hooks
- **[Commitlint](https://commitlint.js.org/)** - 提交信息规范

## 📦 项目结构

```
project/
├── public/                     # 静态资源
│   ├── favicon.png            # 网站图标
│   ├── robots.txt             # SEO爬虫规则
│   └── sitemap.xml            # 站点地图
├── src/
│   ├── assets/                # 项目资源
│   │   ├── images/           # 图片资源（6张，本地化）
│   │   │   ├── grooming-hero.png
│   │   │   ├── mutopia-logo.png
│   │   │   ├── happy-dog-grooming.jpg
│   │   │   ├── grooming-setup.jpg
│   │   │   ├── groomer-working.jpg
│   │   │   └── pet-grooming.png
│   │   └── styles/           # 样式文件
│   │       └── globals.css   # 全局样式 + Tailwind
│   ├── components/            # Vue组件
│   │   ├── ui/               # UI基础组件（27个）
│   │   │   ├── accordion.vue, AccordionItem.vue, AccordionTrigger.vue, AccordionContent.vue
│   │   │   ├── avatar.vue, AvatarImage.vue, AvatarFallback.vue
│   │   │   ├── badge.vue
│   │   │   ├── button.vue
│   │   │   ├── card.vue, CardHeader.vue, CardTitle.vue, CardDescription.vue, CardContent.vue, CardFooter.vue
│   │   │   ├── dialog.vue, DialogContent.vue, DialogHeader.vue, DialogTitle.vue, DialogDescription.vue
│   │   │   ├── input.vue
│   │   │   ├── label.vue
│   │   │   ├── separator.vue
│   │   │   ├── tabs.vue, TabsList.vue, TabsTrigger.vue, TabsContent.vue
│   │   │   ├── use-mobile.ts # 响应式Hook
│   │   │   └── utils.ts      # 工具函数
│   │   ├── AuthDialog.vue    # 认证对话框（登录/注册/忘记密码）
│   │   ├── FAQ.vue           # 常见问题
│   │   ├── Footer.vue        # 页脚（Newsletter + 社交媒体）
│   │   ├── Header.vue        # 导航栏（响应式菜单）
│   │   ├── Hero.vue          # 首屏英雄区
│   │   ├── Packages.vue      # 套餐价格
│   │   ├── Services.vue      # 服务展示
│   │   ├── Testimonials.vue  # 用户评价
│   │   └── WhyUs.vue         # 为什么选择我们
│   ├── App.vue               # 根组件
│   ├── main.ts               # 入口文件
│   ├── env.d.ts              # TypeScript声明
│   ├── auto-imports.d.ts     # 自动导入类型（自动生成）
│   └── components.d.ts       # 组件类型（自动生成）
├── .eslintrc-auto-import.json # ESLint自动导入配置（自动生成）
├── .gitignore                # Git忽略规则
├── .lintstagedrc.json        # Lint-staged配置
├── .prettierrc               # Prettier配置
├── .prettierignore           # Prettier忽略规则
├── commitlint.config.cjs     # Commitlint配置
├── eslint.config.js          # ESLint 9配置（Flat Config）
├── index.html                # HTML入口
├── package.json              # 项目依赖
├── tsconfig.json             # TypeScript配置
├── tsconfig.node.json        # Node TypeScript配置
└── vite.config.ts            # Vite配置
```

## 🚀 快速开始

### 环境要求

- **Node.js** >= 18.0.0
- **npm** >= 9.0.0

### 安装步骤

```bash
# 1. 克隆项目
git clone <repository-url>
cd project

# 2. 安装依赖
npm install

# 3. 启动开发服务器
npm run dev

# 项目将运行在 http://localhost:3000
```

### 可用命令

| 命令 | 说明 |
|------|------|
| `npm run dev` | 启动开发服务器 |
| `npm run build` | 构建生产版本 |
| `npm run preview` | 预览生产构建 |
| `npm run format` | 格式化代码（Prettier） |
| `npm run format:check` | 检查代码格式 |
| `npm run lint` | 修复代码问题（ESLint） |
| `npm run lint:check` | 检查代码问题 |

### Git提交规范

项目使用Commitlint强制执行[约定式提交](https://www.conventionalcommits.org/zh-hans/)：

```bash
# 提交格式
<type>(<scope>): <subject>

# 示例
feat(auth): 添加OAuth登录功能
fix(header): 修复移动端菜单关闭问题
docs(readme): 更新安装说明
style(button): 调整按钮圆角
refactor(api): 重构用户API
test(utils): 添加工具函数测试
chore(deps): 升级依赖版本
```

**类型（type）**：
- `feat`: 新功能
- `fix`: 修复bug
- `docs`: 文档更新
- `style`: 代码格式（不影响代码运行）
- `refactor`: 重构（既不是新功能也不是修复bug）
- `test`: 测试相关
- `chore`: 构建过程或辅助工具的变动

## 📊 性能指标

### 构建性能 (Production)

```
✅ 构建时间:    2.57秒
✅ HTML:        5.04 KB  (gzip: 1.51 KB)
✅ CSS:         50.19 KB (gzip: 8.69 KB)
✅ JavaScript:  198.52 KB (gzip: 63.92 KB)
✅ 首次加载:    ~73 KB (不含图片)
✅ 图片总计:    ~3.6 MB (已优化)
```

### Lighthouse 预估分数

- **Performance**: 90-95/100 🟢
- **Accessibility**: 95-100/100 🟢
- **Best Practices**: 95-100/100 🟢
- **SEO**: 100/100 🟢

### 优化特性

- ✅ **Tree-shaking** - 自动移除未使用代码
- ✅ **代码分割** - 按需加载
- ✅ **资源压缩** - Gzip压缩率达83%（CSS）和68%（JS）
- ✅ **Console清理** - 生产环境自动移除console.log
- ✅ **本地资源** - 零外部CDN依赖

## 🎨 UI组件库

所有UI组件基于Radix Vue构建，确保无障碍访问和键盘导航：

### 表单组件
- **Button** - 6种变体（default, destructive, outline, secondary, ghost, link）
- **Input** - 表单输入框
- **Label** - 表单标签

### 布局组件
- **Card** - 内容卡片（Header, Title, Description, Content, Footer）
- **Separator** - 分隔线
- **Tabs** - 选项卡（Tab List, Tab Trigger, Tab Content）

### 反馈组件
- **Dialog** - 模态对话框
- **Badge** - 徽章标签

### 数据展示
- **Accordion** - 可折叠面板
- **Avatar** - 头像（Image, Fallback）

### Hooks
- **useIsMobile** - 响应式断点检测（768px）

## 🔧 配置说明

### Vite配置 (`vite.config.ts`)

```typescript
{
  plugins: [
    vue(),                    // Vue 3支持
    tailwindcss(),           // Tailwind CSS v4
    AutoImport({             // Vue API自动导入
      imports: ['vue']
    }),
    Components({             // 组件自动导入
      dirs: ['src/components', 'src/components/ui']
    })
  ],
  build: {
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,  // 生产环境移除console.log
        pure_funcs: ['console.log']
      }
    }
  }
}
```

### 自动导入

**Vue Composition API**（无需import）：
```vue
<script setup>
// 直接使用，无需导入
const count = ref(0)
const doubled = computed(() => count.value * 2)
watch(count, (val) => console.log(val))
</script>
```

**UI组件**（无需import）：
```vue
<template>
  <!-- 直接使用 -->
  <Button @click="handleClick">点击</Button>
  <Card>
    <CardHeader>
      <CardTitle>标题</CardTitle>
    </CardHeader>
  </Card>
</template>
```

**Lucide图标**（需要手动导入）：
```vue
<script setup>
// 显式导入使用
import { Menu, X, Star } from 'lucide-vue-next'
</script>

<template>
  <Menu :size="24" />
  <Star :size="20" class="text-yellow-500" />
</template>
```

## 📱 响应式设计

### 断点

| 断点 | 宽度 | 设备 |
|------|------|------|
| `sm` | ≥ 640px | 大手机 |
| `md` | ≥ 768px | 平板 |
| `lg` | ≥ 1024px | 桌面 |
| `xl` | ≥ 1280px | 大屏 |

### 移动端优化

- **智能菜单** - 点击导航自动关闭
- **窗口resize** - 从移动切换到桌面时自动关闭菜单
- **触摸优化** - 更大的点击区域
- **流畅动画** - 硬件加速的CSS动画

## ♿ 可访问性

- ✅ **语义化HTML** - 正确使用标题层级
- ✅ **ARIA标签** - 完整的ARIA属性
- ✅ **键盘导航** - Tab、Enter、Escape支持
- ✅ **焦点管理** - Dialog打开时焦点陷阱
- ✅ **屏幕阅读器** - 友好的文本描述
- ✅ **颜色对比** - WCAG AA标准

## 🔍 SEO优化

### Meta标签
```html
<!-- 基础SEO -->
<title>Mutopia - Premium Pet Grooming Services</title>
<meta name="description" content="..." />
<meta name="keywords" content="..." />

<!-- Open Graph (Facebook) -->
<meta property="og:title" content="..." />
<meta property="og:description" content="..." />
<meta property="og:image" content="..." />

<!-- Twitter Card -->
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content="..." />
```

### 结构化数据
```json
{
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "name": "Mutopia Pet Grooming",
  "description": "Premium mobile pet grooming services",
  ...
}
```

### 文件
- `public/robots.txt` - 爬虫访问规则
- `public/sitemap.xml` - 站点地图
- `public/favicon.png` - 网站图标

## 🎯 浏览器支持

| Browser | Version |
|---------|---------|
| Chrome | last 2 versions |
| Firefox | last 2 versions |
| Safari | last 2 versions |
| Edge | last 2 versions |

## 📝 开发规范

### 代码风格
- 使用2空格缩进
- 使用单引号
- 末尾添加分号
- 遵循Prettier配置

### 组件规范
- 使用`<script setup>`语法
- Props使用TypeScript接口定义
- 事件使用`defineEmits`定义
- 组件名使用PascalCase

### 文件命名
- 组件文件：`PascalCase.vue`
- 工具文件：`kebab-case.ts`
- 样式文件：`kebab-case.css`

## 🔐 环境变量

项目支持环境变量配置（创建`.env`文件）：

```bash
# API端点
VITE_API_URL=https://api.mutopia.com

# OAuth配置
VITE_GOOGLE_CLIENT_ID=your-client-id
VITE_FACEBOOK_APP_ID=your-app-id
```

## 🤝 贡献指南

1. Fork本项目
2. 创建特性分支 (`git checkout -b feat/amazing-feature`)
3. 提交更改 (`git commit -m 'feat: add amazing feature'`)
4. 推送到分支 (`git push origin feat/amazing-feature`)
5. 开启Pull Request

## 📄 许可证

MIT License - 详见 [LICENSE](LICENSE) 文件

## 👥 团队

**Mutopia Development Team**

- 项目架构：Vue 3 + TypeScript + Vite
- UI设计：基于Figma设计稿
- 迁移自：React版本 → Vue 3

## 🙏 致谢

- [Vue.js](https://vuejs.org/) - 渐进式JavaScript框架
- [Vite](https://vitejs.dev/) - 下一代前端构建工具
- [Tailwind CSS](https://tailwindcss.com/) - 实用优先CSS框架
- [Radix Vue](https://www.radix-vue.com/) - 无障碍UI组件
- [Lucide](https://lucide.dev/) - 美观图标库

## 📞 联系方式

- 网站：[mutopia.com](https://mutopia.com)
- 邮箱：hello@mutopia.com
- 社交媒体：[@mutopia](#)

---

<div align="center">

**用 ❤️ 和 Vue 3 构建**

⭐ 如果这个项目对你有帮助，请给我们一个星标！

</div>
