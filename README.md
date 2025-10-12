# Mutopia Pet Grooming - Landing Page

Premium pet grooming service landing page built with React, TypeScript, Tailwind CSS v4, and Vite.

## 📋 Project Overview

A modern, conversion-focused one-page landing page for Mutopia pet grooming services featuring:
- Responsive header with authentication system
- Hero section with CTAs
- Why Us section highlighting unique value propositions
- Services and Packages sections with detailed listings
- FAQ accordion
- Footer with contact information and links
- Complete authentication modal with OAuth support

**Brand Colors:**
- Primary Orange: `#DE6A07`
- Mutopia Brown: `#8B6357`
- Purple (Membership): `#633479`
- Background: `#F6EEEA` (light sections) / `#F8F7F1` (default)

**Font:** Comfortaa (Google Fonts)

## 🛠️ Tech Stack

- **Framework:** React 18.3.1
- **Build Tool:** Vite 6.0.1
- **Language:** TypeScript 5.6.3
- **Styling:** Tailwind CSS 4.0
- **UI Components:** Radix UI + shadcn/ui
- **Icons:** Lucide React 0.487.0
- **Forms:** React Hook Form 7.55.0
- **Notifications:** Sonner 2.0.3

## 📦 Prerequisites

- Node.js >= 18.0.0
- npm >= 9.0.0

## 🚨 Missing Configuration Files

This project was originally created in Figma Make environment. To run locally, you need to create the following configuration files:

### 1. `vite.config.ts` (Required)
```typescript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import path from 'path';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 3000,
    open: true,
  },
});
```

### 2. `tsconfig.json` (Required)
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
      "@/*": ["./src/*"]
    }
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
```

### 3. `tsconfig.node.json` (Required)
```json
{
  "compilerOptions": {
    "composite": true,
    "skipLibCheck": true,
    "module": "ESNext",
    "moduleResolution": "bundler",
    "allowSyntheticDefaultImports": true,
    "strict": true
  },
  "include": ["vite.config.ts"]
}
```

### 4. `index.html` (Required - Entry Point)
```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Mutopia - Premium Pet Grooming Services</title>
    <meta name="description" content="Professional mobile pet grooming services in the Greater Toronto Area. Book online and let our certified groomers come to you." />
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

### 5. `src/main.tsx` (Required - React Entry Point)
```typescript
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './styles/globals.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
```

### 6. `.gitignore` (Recommended)
```
# Dependencies
node_modules/

# Build output
dist/
build/

# Environment variables
.env
.env.local
.env.production

# IDE
.vscode/
.idea/
*.swp
*.swo

# OS
.DS_Store
Thumbs.db

# Logs
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Testing
coverage/
```

## 📁 Required File Structure Changes

Move all existing files into a `src/` directory:

```
project-root/
├── index.html
├── package.json
├── vite.config.ts
├── tsconfig.json
├── tsconfig.node.json
├── .gitignore
└── src/
    ├── main.tsx          (NEW - create this)
    ├── App.tsx           (MOVE from root)
    ├── components/       (MOVE from root)
    │   ├── Header.tsx
    │   ├── Hero.tsx
    │   ├── WhyUs.tsx
    │   ├── Services.tsx
    │   ├── Packages.tsx
    │   ├── FAQ.tsx
    │   ├── Footer.tsx
    │   ├── AuthDialog.tsx
    │   ├── figma/
    │   │   └── ImageWithFallback.tsx
    │   └── ui/
    │       └── ...all ui components
    └── styles/           (MOVE from root)
        └── globals.css
```

## 🖼️ Handling Figma Assets

The project currently uses `figma:asset/...` import paths which are **Figma Make specific**. You need to replace these with actual images:

### Files that need image updates:

1. **`src/components/Header.tsx`** (Line 4)
2. **`src/components/Footer.tsx`** (Line 5)
3. **`src/components/Hero.tsx`** (Line 4)

### Option A: Use placeholder images
Replace `figma:asset` imports with Unsplash or local images:

```typescript
// Instead of:
import mutopiaLogo from "figma:asset/426fd0c4e11f2570addadcefef01a1641a2310f6.png";

// Use:
const mutopiaLogo = "https://via.placeholder.com/150x150?text=Mutopia";
// Or place actual images in public/images/ and use:
const mutopiaLogo = "/images/mutopia-logo.png";
```

### Option B: Create an assets module
Create `src/assets/images.ts`:

```typescript
export const images = {
  mutopiaLogo: "https://images.unsplash.com/photo-1677144649497-238168e2339c",
  groomingHero: "https://images.unsplash.com/photo-1672931653595-1e2e9d4050ef",
} as const;

export default images;
```

Then update imports in components:
```typescript
import images from "../assets/images";
// Use: <img src={images.mutopiaLogo} ... />
```

## 🚀 Installation & Setup

### Step 1: Install Dependencies
```bash
npm install
```

### Step 2: Create Missing Configuration Files
Create all the files listed in the "Missing Configuration Files" section above.

### Step 3: Restructure Project
Move existing files into `src/` directory as shown in the file structure.

### Step 4: Fix Image Imports
Update the three files mentioned above to use real image URLs or local assets.

### Step 5: Run Development Server
```bash
npm run dev
```

The app should now be running at `http://localhost:3000`

## 📜 Available Scripts

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run linter
npm run lint
```

## 🎨 Component Library

The project uses shadcn/ui components (Radix UI based) located in `src/components/ui/`:
- Accordion, Alert Dialog, Avatar
- Button, Card, Checkbox
- Dialog, Dropdown Menu
- Form, Input, Label
- Tabs, Tooltip
- And 30+ more components

## 🔧 Troubleshooting

### Issue: "Cannot find module '@/...'"
**Solution:** Ensure `tsconfig.json` has the correct path mapping and `vite.config.ts` has the alias configured.

### Issue: "Cannot find module 'figma:asset/...'"
**Solution:** Replace all `figma:asset` imports with actual image URLs or local paths.

### Issue: Tailwind styles not working
**Solution:** 
1. Ensure `@tailwindcss/vite` is in devDependencies
2. Check that `globals.css` is imported in `main.tsx`
3. Verify `tailwindcss()` plugin is in `vite.config.ts`

### Issue: "Cannot find name 'React'"
**Solution:** Add `import React from 'react';` at the top of .tsx files or ensure `jsx: "react-jsx"` is in tsconfig.json.

## 📝 Environment Variables (Optional)

Create `.env` file for any API keys:
```
VITE_GOOGLE_CLIENT_ID=your_google_client_id
VITE_FACEBOOK_APP_ID=your_facebook_app_id
```

Access in code: `import.meta.env.VITE_GOOGLE_CLIENT_ID`

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

The project should then be fully functional at `http://localhost:3000`.

## 📄 License

MIT

## 👥 Author

Mutopia Team

---

**Note:** This project was originally built in Figma Make and requires the above setup steps to run in a standard Node.js/Vite environment.
