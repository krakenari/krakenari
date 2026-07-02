# Krakenari

A personal portfolio experience built with React, TypeScript, and Vite.

## Commands

```bash
npm install
npm run dev
npm run check
```

## Project structure

```text
src/
├── App.tsx                      # Application entry component
├── features/
│   ├── blog/
│   │   ├── content/             # Markdown blog posts
│   │   ├── services/            # Content loading and cache
│   │   └── types.ts
│   └── portfolio/
│       ├── assets/              # Portfolio images
│       ├── components/          # Reusable UI components
│       ├── data/                # Static content and settings
│       ├── hooks/               # Portfolio-specific React hooks
│       ├── pages/               # Page-level components
│       ├── styles/              # Portfolio styles
│       ├── utils/               # Small helper functions
│       ├── PortfolioExperience.tsx
│       └── types.ts
├── styles/                      # Global application styles
└── main.tsx                     # React DOM entry point
```

## Architecture

- `App.tsx` only assembles the application. Feature code stays inside `features`.
- Blog posts are kept separate from the UI and loaded through `services/blogRepository.ts`.
- `portfolio/pages` contains page layouts, while `components` contains reusable pieces.
- The `@/` alias points to the `src/` directory.
- New Markdown files inside `features/blog/content` are discovered automatically.
