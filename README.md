# Forge — AI Creative Studio

> A polished AI video and image generation web application inspired by the Higgsfield AI experience. Built for the 8x Engineering Assignment.

## Overview

**Forge** is a premium AI creative studio where users can generate stunning cinematic videos and images from text prompts. The product focuses on delivering a complete, polished core user journey — from landing page through generation to history.

## Features

### Core Journey
- **Landing Page** — Premium hero with rotating prompt previews, feature grid, social proof, and CTA
- **Authentication** — Sign in / Sign up with demo persistence via localStorage
- **Dashboard** — Personalized home with stats, quick create, prompt suggestions, and recent creations
- **Create Workspace** — Full generation UI with model selector, aspect ratio, duration, prompt input
- **Generation Flow** — Simulated generation with real-time progress, step labels, and satisfying completion
- **Result View** — Large preview, metadata, download, save, regenerate, and copy prompt actions
- **Projects / History** — Searchable, filterable grid/list of all past creations with delete
- **Explore** — Community gallery with tabs and trending banner
- **Settings** — Profile edit, appearance, notification toggles, account/plan overview

### UX Details
- Premium dark interface (`#080808` background, refined card system)
- Space Grotesk headings + Inter body typography
- Smooth hover states, focus rings, micro-animations
- Empty states, loading states, error states on every surface
- localStorage persistence for auth and generation history
- Fully responsive layout

## Tech Stack

| Layer | Choice |
|---|---|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS + Custom CSS Design System |
| Icons | Lucide React |
| Persistence | localStorage (demo) |
| Auth | Demo (localStorage) |
| AI | Simulated generation (no backend required) |

## Getting Started

```bash
cd forge-app
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

**Demo credentials**: Any email + any password (6+ characters)

## Project Structure

```
forge-app/
├── src/
│   ├── app/
│   │   ├── page.tsx              # Landing page
│   │   ├── auth/page.tsx         # Auth (sign in / sign up)
│   │   └── dashboard/
│   │       ├── layout.tsx        # Sidebar + nav shell
│   │       ├── page.tsx          # Dashboard home
│   │       ├── create/page.tsx   # Generation workspace ⭐
│   │       ├── projects/page.tsx # History + search
│   │       ├── explore/page.tsx  # Community gallery
│   │       └── settings/page.tsx # User settings
│   ├── components/
│   │   └── GenerationCard.tsx    # Reusable creation card
│   └── lib/
│       ├── types.ts              # TypeScript types
│       ├── storage.ts            # localStorage persistence
│       └── data.ts               # Static data / models
└── .agent-logs/                  # Session capture logs
```

## Agent Logs

All AI agent prompt/response pairs are captured in `.agent-logs/` per the 8x assignment requirements.
Logs are committed alongside the code they produced.

## Deployment

Deploy to Vercel:
```bash
vercel --prod
```

Or import the `forge-app` directory into Vercel dashboard.
