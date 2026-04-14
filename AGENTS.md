# AGENTS.md

## Project Overview

This is a personal portfolio website built with TypeScript, Web Components, and Webpack. It includes dark/light mode, internationalization (EN/TR), and HTMX-powered SPA-like navigation.

---

## Tech Stack

- **Language**: TypeScript + PHP
- **Build Tool**: Webpack 5
- **CSS**: SCSS + Bootstrap 5.3
- **Localization**: i18next
- **SPA Navigation**: HTMX 2.0
- **Testing**: Jest with JSDom
- **Linting**: ESLint 9

---

## Directory Structure

```text
src/
├── assets/          # Static assets (scss, images, fonts, json, videos)
├── components/      # Web Components (see below)
├── pages/           # Page modules and static HTML templates
├── locales/         # i18n translations (en/, tr/)
├── types/           # TypeScript type definitions
├── utils/           # Utility functions
├── scripts/         # Build scripts (sitemap, robots.txt)
├── php/             # PHP server-side files
├── main.ts          # Entry point
└── index.html       # Main HTML template
```

---

## Component Naming Convention

| Prefix | Meaning                     | Example                            |
| ------ | --------------------------- | ---------------------------------- |
| `A_`   | Advanced (complex features) | `A_Accordion.ts`, `A_EmailForm.ts` |
| `C_`   | Core (main sections)        | `C_Hero.ts`, `C_Promo.ts`          |
| `G_`   | Global (shared)             | `G_Maintenance.ts`                 |
| `M_`   | Minor (small reusable)      | `M_link.ts`, `M_image.ts`          |
| `R_`   | Responsive                  | `R_navbar.ts`                      |

---

## Key Files

| File                            | Purpose                                               |
| ------------------------------- | ----------------------------------------------------- |
| `src/main.ts`                   | Entry point, initializes all modules                  |
| `src/static.ts`                 | Static content data                                   |
| `src/i18n.ts`                   | i18next configuration                                 |
| `src/utils/helper.ts`           | Core helpers (DarkLightMode, TypeWriterDisplay, etc.) |
| `src/utils/initLocalization.ts` | i18n wrapper                                          |

---

## Commands

```bash
npm run dev       # Development build
npm run live      # Dev server with hot reload
npm run build     # Production build
npm run lint      # ESLint check
npm test          # Jest tests
```

---

## Coding Patterns

### Web Component Structure

```typescript
class MyComponent extends HTMLElement {
    connectedCallback() { this.innerHTML = this.render(); }
    disconnectedCallback() { /* cleanup */ }
    render() { return /*html*/`...`; }
}
customElements.define("my-component", MyComponent);
```

### Template Literals

Use `/*html*/` tagged template for HTML strings.

### i18n Usage

```typescript
Localize.translate("namespace:section:key");
// or
Localize.translate("common:hero:buttons:workWMe");
```

---

## Design System

- **Colors**: Light (#FDF9FD), Dark (#1F1F24), Yellow accent (#FCD93A)
- **Fonts**: Geist (primary), Franuces (accent), Cascadia Code (mono)
- **Breakpoints**: Phone (320-599px), Tablet (600-1023px), Desktop (1024px+)
- **Border Radius**: sm (18px), l (23px), xl (28px), xxl (42px)

See `DESIGN.md` for full details.

---

## Notes

- Output builds to `/public` (gitignored)
- Supports EN/TR languages
- Theme preference stored in localStorage as `userThemePreference`
- CSS variables defined in `src/assets/scss/globals.scss`
