# AI Agent Instructions for Pokemon DnD Project

## Project Overview
This is a React + TypeScript + Vite application for managing Pokemon characters in a D&D-style game. The project uses modern React practices with hooks, TailwindCSS for styling, and Vite for build tooling.

## Key Architecture Points
- Single-page application built with React 19 and TypeScript
- Uses Vite for development and build tooling
- TailwindCSS for styling with custom design system elements
- Component-based architecture with main UI in `src/App.tsx`
- State management using React hooks (primarily `useState`)

## Project Structure
```
src/
  ├── App.tsx        # Main application component
  ├── Sidebar.tsx    # Sidebar navigation component
  ├── main.tsx       # Application entry point
  └── index.css      # Global styles and Tailwind imports
```

## Development Workflow
1. Start development server:
   ```bash
   npm run dev
   ```
2. Build for production:
   ```bash
   npm run build
   ```
3. Preview production build:
   ```bash
   npm run preview
   ```

## Design Patterns & Conventions
- Components use functional style with hooks
- Tailwind utility classes for styling (see `App.tsx` for examples)
- Custom brand color via CSS variable `--brand`
- Consistent dark theme using slate color palette
- Rounded corners use `rounded-xl` or `rounded-2xl` class
- Border styling follows `border border-white/10` pattern
- Background uses layered approach with backdrop blur effects

## Common Component Patterns
```tsx
// Card-style container pattern
<section className="rounded-2xl border border-white/10 p-6 bg-white/5">

// Interactive element pattern
<button className="rounded-xl px-4 py-2 font-semibold bg-[hsl(var(--brand))] text-slate-950 hover:opacity-90">

// Input field pattern
<input className="rounded-xl bg-black/30 border border-white/10 px-4 py-2 outline-none focus:ring-2 ring-[hsl(var(--brand))]" />
```

## ESLint Configuration
- Project uses TypeScript-aware ESLint rules
- Configuration in `eslint.config.js` supports modern ESM format
- React-specific rules from `eslint-plugin-react-hooks` and `eslint-plugin-react-refresh`