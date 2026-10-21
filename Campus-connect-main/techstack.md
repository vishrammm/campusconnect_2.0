# Technical Stack & Architecture Specification

## Project: Campus Connect Web Application
**Document Version:** 1.0.0  
**Application Type:** Single Page Application (SPA) / Progressive Web App Ready  
**Core Stack:** React 18 · TypeScript · Vite 6 · Tailwind CSS v4  

---

## 1. Core Technology Overview

```
+-------------------------------------------------------------------------+
¦                       CAMPUS CONNECT TECH STACK                        ¦
+-------------------------------------------------------------------------¦
¦  Layer               ¦ Technology Selected       ¦ Version / Engine     ¦
+----------------------+---------------------------+----------------------¦
¦  Runtime / Language  ¦ TypeScript / JavaScript   ¦ ES2022+ / TS 5.x     ¦
¦  UI Framework        ¦ React                     ¦ 18.3.1               ¦
¦  Build Tool & Bundler¦ Vite                      ¦ 6.4.x                ¦
¦  Styling Engine      ¦ Tailwind CSS              ¦ 4.1.x (@tailwindcss) ¦
¦  Iconography         ¦ Lucide React              ¦ 0.487.0              ¦
¦  Animation Engine    ¦ tw-animate-css & CSS3     ¦ 1.3.8                ¦
¦  UI Primitives       ¦ Radix UI Primitives       ¦ Latest Suite         ¦
¦  Package Manager     ¦ npm / pnpm / yarn         ¦ Node 18+             ¦
+-------------------------------------------------------------------------+
```

---

## 2. Frontend Architecture & Ecosystem

### 2.1. Framework & Rendering Engine
- **React 18:** Leverages React's root API (`createRoot`), Concurrent Rendering capabilities, functional components with hooks (`useState`, `useEffect`, `useMemo`), and strict TypeScript typing.
- **TypeScript:** Strict type checking across all data models (`AppUser`, `Role`, `View`, `LostItem`, `Notice`, `Club`, `EventItem`, `ProductListing`), preventing runtime crashes.
- **Vite 6:** Ultra-fast Hot Module Replacement (HMR) during development, zero-config ES module loading, and optimized Rollup production builds with automated tree-shaking and minification.

### 2.2. Styling & Design Tokens
- **Tailwind CSS v4 (`@tailwindcss/vite`):** Modern atomic CSS generation with zero runtime overhead.
- **CSS Variables & Theming:** Custom `@theme` and `@layer base` declarations in `src/styles/theme.css` supplying reactive tokens for dark/light themes, typography scale, border radii, and color palettes.
- **Lucide Icons:** Highly tree-shakeable vector SVG iconography providing over 30 consistent, semantic UI icons.

---

## 3. Directory & File Organization

```
Campus Connect Web Application/
+-- public/                     # Static public assets
¦   +-- campus-hero.jpg         # High-resolution campus hero image
+-- src/
¦   +-- app/
¦   ¦   +-- components/
¦   ¦   ¦   +-- ui/             # Reusable UI component library (Shadcn/Radix)
¦   ¦   ¦       +-- button.tsx
¦   ¦   ¦       +-- card.tsx
¦   ¦   ¦       +-- dialog.tsx
¦   ¦   ¦       +-- input.tsx
¦   ¦   ¦       +-- select.tsx
¦   ¦   ¦       +-- tabs.tsx
¦   ¦   ¦       +-- image-with-fallback.tsx
¦   ¦   +-- App.tsx             # Main application orchestrator & views
¦   +-- styles/
¦   ¦   +-- fonts.css           # Google Fonts import (Plus Jakarta Sans, Inter)
¦   ¦   +-- index.css           # Master stylesheet entry point
¦   ¦   +-- tailwind.css        # Tailwind v4 import & animation utility config
¦   ¦   +-- theme.css           # CSS custom properties, tokens & base layers
¦   +-- main.tsx                # Application root DOM mount point
+-- .gitignore                  # Git repository exclusion rules
+-- index.html                  # HTML5 document template & web metadata
+-- package.json                # Project dependencies, scripts & metadata
+-- package-lock.json           # Locked dependency tree
+-- postcss.config.mjs          # PostCSS processing configuration
+-- vite.config.ts              # Vite server & bundler configuration
+-- prd.md                      # Product Requirements Document
+-- design.md                   # Design System & UI/UX Architecture
+-- techstack.md                # Technical Stack Specification
```

---

## 4. State Management & Navigation Pattern

### 4.1. Application Routing & Role Gating
Campus Connect uses a lightweight, highly responsive state-driven view routing system:
- **Authentication State (`user`):** Tracks user profile, role (`student`, `co-admin`, `admin`, `staff`), and active credentials.
- **View State (`view`):** Controls screen rendering (`login`, `signup-student`, `signup-coadmin`, `signup-staff`, `student-dashboard`, `lost-found`, `notice-board`, `event-hub`, `marketplace`, `co-admin-dashboard`, `admin-dashboard`, `staff-dashboard`, `notifications`, `profile`).
- **Dynamic Navigation:** Automatically calculates available sidebar navigation items according to the active user's permissions.

### 4.2. Local Storage & Cache Persistence Strategy
- Synchronous state updates with reactive search filtering for zero latency.
- Future integration ready for browser `localStorage` or `sessionStorage` session token caching.

---

## 5. Build, Bundling & Performance Metrics

### 5.1. Build Output
Running `npm run build` generates optimized distribution bundles:
```
dist/
+-- assets/
¦   +-- index-[hash].js    # Bundled & minified TypeScript application logic (~73 KB gzipped)
¦   +-- index-[hash].css   # Extracted and compressed Tailwind CSS bundle (~21 KB gzipped)
+-- campus-hero.jpg        # Optimized campus hero image
+-- index.html             # Minified HTML entry point (~0.5 KB gzipped)
```

### 5.2. Performance Optimization Techniques
1. **Tree-Shaking:** Rollup-based elimination of dead code during production compilation.
2. **Dynamic Substring & Fast Index Search:** Instant client-side search execution over datasets with zero lag.
3. **Hardware-Accelerated CSS Transitions:** Transitions scoped to `transform` and `opacity` to maintain 60 FPS animations.

---

## 6. Backend Integration & Production Roadmap

When transitioning from the current prototype to a distributed full-stack architecture:

### 6.1. Recommended Backend Architecture
- **API Server:** Node.js with Express.js / NestJS or Python FastAPI.
- **Database:** PostgreSQL (Relational integrity for user roles, notices, transactions) with Prisma ORM.
- **Authentication:** JWT (JSON Web Tokens) with refresh token rotation and bcrypt password hashing.
- **File Storage:** AWS S3 or Cloudinary for secure item photos, PDF circulars, and event flyers.
- **Real-Time Communication:** WebSockets / Socket.io for peer-to-peer marketplace chat and live notification broadcasts.

### 6.2. Database Schema Design (Entity Relationship)

```
+--------------+       1:N       +------------------+
¦    Users     ¦----------------<¦    LostItems     ¦
¦ (ID, Role,   ¦                 ¦ (ID, Title, Loc, ¦
¦  Email, Pw)  ¦       1:N       ¦  Status, UserID) ¦
¦              ¦----------------<+------------------¦
¦              ¦                 ¦   Marketplace    ¦
¦              ¦       1:N       ¦ (ID, Title, Price¦
¦              ¦----------------<¦  Cond, UserID)   ¦
¦              ¦                 +------------------¦
¦              ¦                 ¦     Notices      ¦
¦              ¦                 ¦ (ID, Title, Cat, ¦
¦              ¦                 ¦  AuthorID, PDF)  ¦
+--------------+                 +------------------+
```

---

## 7. Development & Deployment Guide

### Development Commands
```bash
# Install dependencies
npm install

# Start local dev server on http://localhost:5173
npm run dev

# Build production bundle
npm run build

# Preview production build locally
npm run preview
```

### Deployment Targets
- **Vercel / Netlify / Cloudflare Pages:** Connect Git repository for instant automated CI/CD static edge deployments.
- **Docker / Nginx:** Containerize the `dist/` build with a lightweight Nginx image.
