# 📖MangaVerse - A Manga Reader

A modern manga reading web app built with Next.js App Router and the MangaDex API.

The project provides:

- 🏠 A home page with trending and latest manga
- 🔎 Search by title
- 📚 Manga details with chapter lists
- 📖 A chapter reader with vertical and horizontal modes
- 💾 Reading progress persistence in local storage
- ⚡ Progressive Web App support for installable, app-like behavior

## 📑 Table of Contents

- Overview
- Features
- Tech Stack
- Project Structure
- API Routes
- Getting Started
- Available Scripts
- How Data Flows
- PWA Notes
- Known Limitations
- Future Improvements
- Acknowledgements

## 🧠 Overview

MangaVerse is a full-stack Next.js application that uses server API routes as a clean internal layer in front of MangaDex. The frontend reads from local API endpoints such as `/api/manga` and `/api/search`, and those endpoints fetch and format data from MangaDex.

This keeps UI components simple and avoids spreading MangaDex response parsing logic across many frontend files.

## ✨Features

### 🏠 Home Experience

- Trending manga section (based on followed count)
- Latest updates section (latest uploaded chapter ordering)
- Search bar for manga title lookup

### 📚 Manga Details

- Cover image, title, and description
- Chapter list (English translation filter)
- Direct links from chapter list to the reader

### 📖 Reader Experience

- Vertical reading mode
- Horizontal reading mode with keyboard arrow navigation
- Page indicator
- Local reading progress persistence per chapter

### ⚙ Platform and Performance

- Built on Next.js App Router
- Next/Image optimization for remote MangaDex assets
- PWA support with service worker generation in production

## 🧩 Tech Stack

- Framework: Next.js 16 (App Router)
- UI: React 19 + Tailwind CSS v4
- Language: TypeScript
- PWA: `next-pwa`
- Data source: MangaDex public API

## 🗂 Project Structure

```text
src/
	app/
		api/
			chapter/[id]/route.ts      # chapter list by manga id
			manga/route.ts             # trending manga
			manga/[id]/route.ts        # manga details
			pages/[chapterId]/route.ts # chapter page image URLs
			search/route.ts            # manga title search
		manga/[id]/page.tsx          # manga detail screen
		reader/[chapterId]/page.tsx  # chapter reader
		page.tsx                     # home screen
		layout.tsx                   # global metadata/layout
		globals.css                  # global styles
	components/
		MangaCard.tsx                # reusable manga card UI
	lib/
		api.ts                       # client helpers for local API calls
	types/
		manga.ts                     # shared TypeScript interfaces
public/
	sw.js                          # generated or provided service worker artifact
```
## 🔐 Environment Variables

This project does not require any environment variables.
All data is fetched from the public MangaDex API through internal Next.js API routes.

## 🔌API Routes

All routes are implemented in the Next.js App Router under `src/app/api`.

### 1️⃣ GET /api/manga

Returns a formatted list of trending manga.

Source mapping:

- MangaDex endpoint: `/manga`
- Query: `limit=12`, `order[followedCount]=desc`, `includes[]=cover_art`

### 2️⃣ GET /api/search?q=<query>

Returns search results by title.

Source mapping:

- MangaDex endpoint: `/manga`
- Query: `title=<query>`, `limit=20`, `includes[]=cover_art`

### 3️⃣ GET /api/manga/:id GET /api/manga/:id

Returns formatted metadata for one manga.

Source mapping:

- MangaDex endpoint: `/manga/:id`
- Query: `includes[]=cover_art`

### 4️⃣ GET /api/chapter/:id

Returns chapter list for a manga id.

Source mapping:

- MangaDex endpoint: `/chapter`
- Query: `manga=<id>`, `translatedLanguage[]=en`, `order[chapter]=desc`, `limit=100`

### 5️⃣ GET /api/pages/:chapterId

Returns direct page image URLs for a chapter.

Source mapping:

- MangaDex endpoint: `/at-home/server/:chapterId`



## 🚀 Getting Started

### 📋 Prerequisites

- Node.js 20+
- npm (or pnpm/yarn if preferred)

### 📦 Install

```bash
npm install
```

### ▶ Run in Development

```bash
npm run dev
```

Then open:

- http://localhost:3000

### 🏗 Production Build

```bash
npm run build
npm run start
```

## Available Scripts

- `npm run dev` - Start development server (webpack mode)
- `npm run build` - Build the production app
- `npm run start` - Start production server
- `npm run lint` - Run Next.js linting

## 🧭 How Data Flows

1. UI components call local endpoints under `/api/*`.
2. Route handlers call MangaDex endpoints.
3. Route handlers normalize response shape (id, title, cover, description, chapters).
4. Frontend renders this normalized data.

This design improves maintainability and makes future backend changes easier.

## 📱PWA Notes

PWA is configured through `next-pwa` in `next.config.ts`.

- Service worker output destination: `public`
- PWA registration: enabled
- Skip waiting: enabled
- Disabled during development (`NODE_ENV=development`)

To verify PWA behavior, test a production build (`npm run build` and `npm run start`) in a Chromium-based browser.

## ⚠ Known Limitations

- Reader and listing behavior currently depends on MangaDex API availability and response structure.
- The app currently assumes English chapter preference in chapter fetching.
- No authentication, user accounts, or cloud sync yet (progress is local-only).

## 🔮Future Improvements

- Add advanced filters (genre, status, demographic)
- Add bookmarks and favorites
- Add chapter prefetching and smarter caching
- Add stronger error boundaries and retry UX states
- Add tests for API route handlers and reader behavior
- Add i18n support for multilingual UI