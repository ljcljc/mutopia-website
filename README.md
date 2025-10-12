# Mutopia - Premium Pet Grooming

A modern, responsive landing page for Mutopia pet grooming services, featuring a sleek design and comprehensive service offerings.

## 🚀 Technology Stack

- **Vue 3** - Progressive JavaScript framework with Composition API
- **TypeScript** - Type-safe development
- **Vite** - Next generation frontend tooling
- **Tailwind CSS v4** - Utility-first CSS framework
- **Radix Vue** - Unstyled, accessible UI components
- **Lucide Vue** - Beautiful & consistent icons

## ✨ Features

- 📱 Fully responsive design
- ♿ Accessible UI components (Radix Vue)
- 🎨 Modern gradient backgrounds and animations
- 🔐 Authentication dialog with OAuth support
- 📋 FAQ accordion with smooth animations
- 💳 Service packages with pricing
- ⭐ Customer testimonials
- 📧 Newsletter subscription
- 🎯 SEO optimized (meta tags, sitemap, robots.txt)

## 📦 Project Structure

```
src/
├── components/
│   ├── ui/              # Reusable UI components
│   │   ├── accordion.vue
│   │   ├── avatar.vue
│   │   ├── badge.vue
│   │   ├── button.vue
│   │   ├── card.vue
│   │   ├── dialog.vue
│   │   ├── input.vue
│   │   ├── label.vue
│   │   ├── separator.vue
│   │   └── tabs.vue
│   ├── figma/           # Figma-specific components
│   ├── AuthDialog.vue   # Login/Signup dialog
│   ├── FAQ.vue          # FAQ section
│   ├── Footer.vue       # Footer component
│   ├── Header.vue       # Header/Navigation
│   ├── Hero.vue         # Hero section
│   ├── Packages.vue     # Pricing packages
│   ├── Services.vue     # Service offerings
│   ├── Testimonials.vue # Customer reviews
│   └── WhyUs.vue        # Why choose us section
├── styles/
│   └── globals.css      # Global styles & Tailwind
├── App.vue              # Root component
└── main.ts              # Application entry point

public/
├── favicon/             # Favicon assets
├── images/              # Image assets
├── robots.txt           # SEO robots file
└── sitemap.xml          # SEO sitemap
```

## 🛠️ Getting Started

### Prerequisites

- Node.js >= 18.0.0
- npm >= 9.0.0

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd project
```

2. Install dependencies:
```bash
npm install
```

3. Start development server:
```bash
npm run dev
```

The application will be available at `http://localhost:3000`

### Build for Production

```bash
npm run build
```

This will:
1. Run TypeScript compiler (`tsc`)
2. Build optimized production bundle with Vite

Output will be in the `dist/` directory.

### Preview Production Build

```bash
npm run preview
```

## 🎨 UI Components

All UI components are built using Radix Vue for accessibility and customized with Tailwind CSS:

- **Accordion** - Expandable FAQ sections
- **Avatar** - User profile images with fallback
- **Badge** - Status indicators and labels
- **Button** - Multiple variants (default, outline, ghost, etc.)
- **Card** - Content containers with header, content, footer
- **Dialog** - Modal dialogs for authentication
- **Input** - Form input fields
- **Label** - Form labels
- **Separator** - Visual dividers
- **Tabs** - Tabbed content switching

## 🔧 Configuration

### Vite Configuration (`vite.config.ts`)

- Vue 3 plugin
- Tailwind CSS v4 plugin
- Path aliases (`@/` → `src/`)
- Dev server on port 3000

### TypeScript Configuration (`tsconfig.json`)

- Target: ES2020
- JSX: preserve (for Vue)
- Strict mode enabled
- Path mapping for `@/*` imports

### Tailwind CSS Configuration

Tailwind CSS v4 is imported via `@import "tailwindcss"` in `globals.css`. Custom CSS variables for theming are defined in the `:root` selector.

## 📱 Responsive Design

The application is fully responsive with breakpoints:
- Mobile: < 640px
- Tablet: 640px - 1024px
- Desktop: > 1024px

## ♿ Accessibility

- Semantic HTML elements
- ARIA labels and roles
- Keyboard navigation support
- Focus management in dialogs
- Screen reader friendly

## 🔍 SEO Optimization

- Comprehensive meta tags (Open Graph, Twitter Card)
- Structured data (JSON-LD)
- Sitemap.xml
- Robots.txt
- Optimized images with alt text
- Semantic HTML structure

## 📄 License

MIT License - see LICENSE file for details

## 👥 Author

Mutopia Team

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!
