# Design Architecture & System Specification

## Project: Campus Connect Web Application
**Design System Version:** 1.0.0  
**Design Paradigm:** Modern Neo-Brutalist Glassmorphism & Tokenized Dark/Light Adaptive UI  
**Target Viewports:** Mobile (360px–640px), Tablet (641px–1024px), Desktop (1025px+)  

---

## 1. Design Philosophy & Core Principles

Campus Connect is crafted to deliver a vibrant, frictionless, and modern digital experience for university students and faculty. The visual identity avoids dull institutional aesthetics in favor of high-energy, premium interfaces inspired by cutting-edge consumer apps.

### Core Principles
1. **Instant Clarity:** Every screen must prioritize high-signal information (e.g., urgent notices, event dates, item locations) with clear visual hierarchy.
2. **Tactile Interaction:** Interactive elements feature smooth hover lifts (`hover:-translate-y-0.5`), glowing borders, active state feedback, and micro-animations.
3. **Adaptive Contrast:** Seamless duality between high-contrast dark mode (for low-light campus sessions) and crisp, clean light mode.
4. **Accessible Depth:** Multi-layered glassmorphism (`backdrop-blur-xl`, semi-transparent frosted cards, subtle gradient halos) to convey elevation and structure.

---

## 2. Color System & Design Tokens

The system uses a tokenized CSS variable architecture defined in `@theme` and `:root` / `.dark` layers.

### 2.1. Primary Palette

| Token Name | Light Value | Dark Value | Purpose / Usage |
| :--- | :--- | :--- | :--- |
| `--background` | `#f8fafc` (Slate 50) | `#070b17` (Deep Obsidian) | Base background canvas |
| `--foreground` | `#0f172a` (Slate 900) | `#f8fafc` (Slate 50) | Primary typography & iconography |
| `--primary` | `#2563eb` (Royal Blue) | `#38bdf8` (Cyan 400) | Primary brand buttons, links, active tabs |
| `--primary-foreground` | `#ffffff` | `#020617` | Text on primary brand backgrounds |
| `--accent` | `#7c3aed` (Violet 600) | `#a78bfa` (Violet 400) | Secondary badges, events, club accents |
| `--card` | `#ffffff` (White 100%) | `rgba(15, 23, 42, 0.82)` | Elevated surface containers & cards |
| `--border` | `rgba(37, 99, 235, 0.12)`| `rgba(255, 255, 255, 0.10)`| Subtle boundary lines and separators |

### 2.2. Semantic Status & Category Colors

```
+-------------------------------------------------------------------------+
¦                       SEMANTIC STATUS TOKENS                           ¦
+-------------------------------------------------------------------------¦
¦ ?? Critical / Red ¦ Notice: Examination · Urgent Alert · Delete Modal   ¦
¦                   ¦ Light: bg-red-50 text-red-600 border-red-200        ¦
+-------------------+-----------------------------------------------------¦
¦ ?? Academic / Blue¦ Notice: Academic · Filter: Electronics · Primary CTA¦
¦                   ¦ Light: bg-blue-50 text-blue-600 border-blue-200     ¦
+-------------------+-----------------------------------------------------¦
¦ ?? Events / Violet¦ Notice: Events · Filter: Accessories · RSVP State   ¦
¦                   ¦ Light: bg-purple-50 text-purple-600 border-purple-200¦
+-------------------+-----------------------------------------------------¦
¦ ?? Success / Green¦ Item: Claimed · Condition: Like New · Verified Badge¦
¦                   ¦ Light: bg-green-50 text-green-700 border-green-200  ¦
+-------------------+-----------------------------------------------------¦
¦ ?? Warning / Amber¦ Notice: Guidelines · Condition: Fair · Marketplace  ¦
¦                   ¦ Light: bg-amber-50 text-amber-700 border-amber-200  ¦
+-------------------------------------------------------------------------+
```

---

## 3. Typography Hierarchy

The application leverages two distinct, complementary typefaces loaded via Google Fonts:
- **Headings & Brand Display:** `Plus Jakarta Sans` (Geometric, contemporary, geometric legibility)
- **Body & Data Typography:** `Inter` (Neutral, highly legible text, tabular numbers)

### Typography Scale

| Level | Font Size | Weight | Line Height | Application |
| :--- | :--- | :--- | :--- | :--- |
| **Display 1** | `48px–60px` | Black (900) | `1.0` | Auth Splash Hero ("Connect. Discover. Belong.") |
| **Heading 1** | `24px–32px` | Extrabold (800) | `1.2` | Page Titles, Dashboard Headers, Masthead |
| **Heading 2** | `20px–24px` | Bold (700) | `1.3` | Section Headers, Club Details, Modal Titles |
| **Heading 3** | `16px–18px` | Bold (700) | `1.4` | Card Titles, Item Names, Notice Subject |
| **Body (Base)** | `14px–16px` | Normal (400) / Medium (500) | `1.5` | Notice Descriptions, Form Labels, Text Inputs |
| **Caption / Small** | `12px–13px` | Medium (500) / Semibold (600) | `1.4` | Badges, Timestamps, Author Metas, Subtitles |
| **Micro** | `10px–11px` | Bold (700) | `1.2` | Uppercase Tracked Kicker Tags (`tracking-[0.25em]`) |

---

## 4. Component Design System

### 4.1. Buttons (`Btn`)
- **Variants:**
  - `blue`: High-emphasis primary action (`bg-blue-600 hover:bg-blue-700 text-white shadow-sm hover:shadow-md`)
  - `violet`: Secondary high-emphasis (`bg-violet-600 hover:bg-violet-700 text-white`)
  - `outline`: Neutral bordered action (`bg-white border border-blue-200 hover:bg-blue-50 text-blue-700`)
  - `ghost`: Transparent low-emphasis (`hover:bg-slate-100 dark:hover:bg-white/10 text-slate-600`)
  - `red`: Destructive confirmation (`bg-red-600 hover:bg-red-700 text-white`)
  - `dark`: High-contrast slate action (`bg-slate-900 hover:bg-slate-800 text-white`)
- **Sizes:** `xs` (Compact chip size), `sm` (Standard card action), `md` (Standard form trigger), `lg` (Full-width submission).
- **Corner Radius:** `rounded-xl` (`0.75rem / 12px`).

### 4.2. Cards & Containers
- **Border Radius:** `rounded-2xl` (`1rem / 16px`) for standard cards; `rounded-3xl` (`1.5rem / 24px`) for hero banners and auth cards.
- **Glassmorphic Surface:**
  - Light: Crisp white with soft slate border (`border-slate-100 shadow-sm hover:shadow-md`).
  - Dark: Semi-transparent obsidian (`bg-slate-900/80 backdrop-blur-xl border-white/10 shadow-2xl`).
- **Interactive Depth:** Lift effect on hover (`hover:-translate-y-1 transition-all duration-300`).

### 4.3. Chips & Category Badges (`Chip`)
- Rounded pill shape (`rounded-full px-2.5 py-0.5 text-xs font-semibold border`).
- Pre-mapped color schemes indicating category, condition, and status flags.

### 4.4. Avatar Component (`Av`)
- Gradient background (`from-blue-500 to-violet-600`).
- Initials generation with sizes `sm` (32px), `md` (40px), and `lg` (56px).

---

## 5. UI Layout & Navigation Architecture

```
+-----------------------------------------------------------------------------+
¦                              APP SHELL LAYOUT                               ¦
+-----------------------------------------------------------------------------¦
¦              ¦ HEADER                                                       ¦
¦              ¦ [Menu Toggle]  [?? Search Campus...]    [?? Theme] [?? Notifs] [?? Profile]¦
¦ SIDEBAR      +--------------------------------------------------------------¦
¦              ¦                                                              ¦
¦ ??? Campus    ¦ MAIN CONTENT AREA (Scrollable)                               ¦
¦    Connect   ¦ +----------------------------------------------------------+ ¦
¦              ¦ ¦ HERO BANNER (MHSSCE Campus Network / Active Portal)      ¦ ¦
¦ ?? Dashboard ¦ +----------------------------------------------------------+ ¦
¦ ?? Lost&Found¦ +----------------------------------------------------------+ ¦
¦ ?? Notices   ¦ ¦ Module Card  ¦ Module Card  ¦ Module Card  ¦ Module Card ¦ ¦
¦ ?? Event Hub ¦ +----------------------------------------------------------+ ¦
¦ ??? Market    ¦ +----------------------------------------------------------+ ¦
¦ ?? Notifs    ¦ ¦ Dynamic Grid / Feed / Management Tables                  ¦ ¦
¦ ?? Profile   ¦ ¦                                                          ¦ ¦
¦              ¦ +----------------------------------------------------------+ ¦
¦ ?? Sign Out  ¦                                                              ¦
+-----------------------------------------------------------------------------+
```

---

## 6. Micro-Interactions & Animation Patterns

1. **Ambient Glows:** Animated radial pulse halos (`animate-pulse blur-3xl`) positioned behind login and signup panels.
2. **Card Transitions:** Smooth scale on click (`active:scale-95`), lift on hover (`hover:-translate-y-0.5`), and smooth SVG color transitions.
3. **Entry Transition:** Splash loader displaying an animated institutional badge while initializing role-based views.
4. **Theme Switch Rotation:** 12-degree icon rotation and smooth color transition (`transition-colors duration-500`) when toggling between dark and light themes.

---

## 7. Responsive Breakpoints Strategy

| Breakpoint | Minimum Width | Layout Adaptations |
| :--- | :--- | :--- |
| **Mobile (`<640px`)** | `360px` | Drawer navigation with backdrop blur; 1-column cards; condensed header actions. |
| **Tablet (`640px–1024px`)** | `640px` | 2-column card grids; responsive form inputs; compact tabular layouts. |
| **Desktop (`>1024px`)** | `1024px` | Persistent left sidebar; 3-column / 4-column module grids; full multi-panel dashboard. |
| **Wide Desktop (`>1280px`)**| `1280px` | Split-screen branding on authentication; expansive data visualization tables. |
