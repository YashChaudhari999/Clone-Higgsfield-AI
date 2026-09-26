# Forgefield

**Forgefield** is a cloud-based creative workspace where creators turn ideas into organized projects, manage creative briefs and assets, and discover visual inspiration.

> Built for the 8x engineering assessment. Powered by Next.js 16 + Supabase.

---

## What is Forgefield?

Forgefield is a focused creative project management tool. It is **not** an AI video or image generator — it is a workspace for organizing the creative process: briefs, references, direction, and assets.

**Core workflow:**
```
Sign up → Create Project → Write Creative Brief → Upload Reference Assets
→ Add Notes → Return Later → Data Persists → Explore Inspiration
```

---

## Key Features

| Feature | Status |
|---|---|
| Supabase Auth (sign up / sign in / sign out) | ✅ Live |
| Protected dashboard routes | ✅ Live |
| Create + save projects to Supabase PostgreSQL | ✅ Live |
| Upload reference assets to Supabase Storage | ✅ Live |
| Project detail view (edit, notes, assets, delete) | ✅ Live |
| Row Level Security — users own their data | ✅ Live |
| Explore inspiration gallery | ✅ Live |
| Studio profile (display name synced to DB) | ✅ Live |
| Responsive layout (mobile + desktop) | ✅ Live |
| One-click demo login | ✅ Live |

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript |
| Styling | Vanilla CSS (custom design system) |
| Auth | Supabase Auth |
| Database | Supabase PostgreSQL |
| Storage | Supabase Storage |
| Security | Row Level Security (RLS) |
| Fonts | Inter + Space Grotesk (Google Fonts) |
| Icons | Lucide React |

---

## Architecture

```
forge-app/
├── src/
│   ├── app/
│   │   ├── page.tsx                    # Public landing page
│   │   ├── auth/page.tsx               # Sign in / Sign up
│   │   ├── explore/                    # Public inspiration (redirects to dashboard/explore)
│   │   └── dashboard/
│   │       ├── layout.tsx              # Protected layout + sidebar nav
│   │       ├── page.tsx                # Dashboard home (real Supabase stats)
│   │       ├── create/page.tsx         # Create project form
│   │       ├── projects/
│   │       │   ├── page.tsx            # Projects list
│   │       │   └── [id]/page.tsx       # Project detail (edit, assets, notes)
│   │       ├── explore/page.tsx        # Inspiration gallery
│   │       └── settings/page.tsx       # Profile + account settings
│   ├── components/
│   │   ├── Navbar.tsx                  # Public navigation
│   │   ├── Footer.tsx                  # Public footer
│   │   └── ProjectModal.tsx            # Explore card detail modal
│   ├── context/
│   │   └── AuthContext.tsx             # Supabase session provider
│   ├── lib/
│   │   ├── supabase.ts                 # All Supabase API functions
│   │   ├── types.ts                    # TypeScript type definitions
│   │   └── media.ts                    # Static inspiration content data
│   └── middleware.ts                   # Edge auth guard for /dashboard/*
└── supabase/
    └── schema.sql                      # Database schema + RLS policies
```

---

## Supabase Database Structure

### Tables

```sql
profiles          -- id (FK auth.users), display_name, avatar_url
projects          -- id, user_id (FK), name, description, category, status, cover_image_url
project_assets    -- id, project_id (FK), user_id, name, file_url, file_type
project_notes     -- id, project_id (FK), user_id, content
```

### Row Level Security

All tables enforce strict user ownership via `auth.uid() = user_id`.

- Users can only read, update, and delete their **own** records.
- RLS is enabled on all four tables.
- Cross-user data access is prevented at the **database level** — not just the frontend.

### Storage

- **Bucket:** `project-assets`
- **Access:** Public (images are served via CDN public URL)
- Files are path-prefixed by `uploads/{user_id}_{timestamp}_{random}.{ext}`

---

## Authentication

- Powered by **Supabase Auth** (`signUp`, `signInWithPassword`, `signOut`, `onAuthStateChange`).
- Session is persisted in browser via Supabase's built-in cookie mechanism.
- Edge middleware (`src/middleware.ts`) guards all `/dashboard/*` routes — unauthenticated requests are redirected to `/auth?mode=signin`.
- `AuthContext` provides user, session, and profile state app-wide.

---

## Local Development Setup

### 1. Prerequisites
- Node.js 18+
- A Supabase project ([supabase.com](https://supabase.com))

### 2. Clone & Install

```bash
git clone <repo-url>
cd forge-app
npm install
```

### 3. Configure Environment

```bash
cp .env.example .env.local
```

Edit `.env.local`:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-public-key
```

### 4. Set Up Supabase Database

Run `supabase/schema.sql` in your Supabase SQL Editor:
- Creates `profiles`, `projects`, `project_assets`, `project_notes` tables
- Enables RLS on all tables
- Creates all user-ownership policies

### 5. Create Storage Bucket

In Supabase Dashboard → Storage → New Bucket:
- **Name:** `project-assets`
- **Public:** ✅ enabled

### 6. Run Dev Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Deployment

### Vercel (recommended)

1. Push to GitHub
2. Import project in [vercel.com](https://vercel.com)
3. Add environment variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. Deploy

### Supabase Auth: Allowed Redirect URLs

In Supabase Dashboard → Auth → URL Configuration, add your production domain:
```
https://your-domain.vercel.app
https://your-domain.vercel.app/**
```

---

## Build Verification

```bash
npm run build    # Must succeed with 0 errors
npx tsc --noEmit # Must pass with 0 TypeScript errors
```

---

## Product Decisions (Intentional)

| Decision | Rationale |
|---|---|
| No AI generation features | Forgefield is a workspace, not an AI engine. Keeping the product honest. |
| No localStorage as primary persistence | Supabase is the sole source of truth. Data survives across devices and sessions. |
| Dynamic routes (`/projects/[id]`) | Clean URLs, bookmarkable project pages, no query-param hacks. |
| Vanilla CSS over Tailwind | Maximum flexibility, no class proliferation, consistent design tokens. |
| Client-side + edge auth guards | Belt-and-suspenders: middleware redirects unauthenticated users AND components verify session client-side. |

---

## Agent Logs

This project was built using the Antigravity IDE agent. Session logs are preserved in:

```
.agent-logs/2026-09-25_22-54-00_8e93d6ae.md
```

These logs are intentionally committed to the repository as part of the 8x assessment requirements.
