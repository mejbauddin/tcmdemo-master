# 智启岐黄 TCM Learning - Deployment Guide

This project is built with Vue 3, Vite, and Tailwind CSS. It is designed to be a static site that can be deployed to any static hosting service (Netlify, Vercel, GitHub Pages, etc.).

## Prerequisites

- Node.js (v18 or higher recommended)
- npm or pnpm

## Local Development

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Start Development Server**
   ```bash
   npm run dev
   ```
   Access the app at `http://localhost:5173` (or the port shown in your terminal).

## Building for Production

1. **Run Build Command**
   ```bash
   npm run build
   ```
   This command compiles the application into the `dist/` directory. The output is optimized for production (minified CSS/JS, tree-shaking).

2. **Preview Production Build**
   ```bash
   npm run preview
   ```
   Test the built application locally before deploying.

## Deployment Options

### 1. Netlify (Recommended)
- Connect your GitHub repository to Netlify.
- Build settings:
  - **Build command:** `npm run build`
  - **Publish directory:** `dist`
- Netlify will automatically detect the Vite configuration and deploy.

### 2. Vercel
- Import your project from GitHub.
- Vercel automatically detects Vite framework preset.
- Click **Deploy**.

### 3. GitHub Pages
- Update `vite.config.js` to set the base path if you are deploying to a subdirectory (e.g., `https://username.github.io/repo-name/`):
  ```javascript
  export default defineConfig({
    base: '/repo-name/',
    plugins: [vue()],
    // ...
  })
  ```
- Push the contents of the `dist` folder to a `gh-pages` branch.

## Performance Optimization
- **Images**: All icons are SVGs (lucide-vue-next) or inline SVG patterns, ensuring zero layout shift and instant loading.
- **Code Splitting**: Vite automatically splits vendor chunks.
- **CSS**: Tailwind CSS generates minimal utility classes based on usage.

## Browser Support
- Chrome (Last 2 versions)
- Firefox (Last 2 versions)
- Safari (Last 2 versions)
- Edge (Last 2 versions)
