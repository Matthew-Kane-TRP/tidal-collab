# Tidal Collab — Internal Tools Platform

> **Phase 1 COMPLETE** ✅ Platform shell, auth, branding, tool launcher

Internal PWA for Tidal Realty Partners agents. Phone-first, installable, AI-powered.

## Status

- ✅ Phase 1 — Platform shell (PWA, auth, branding, home screen)
- ⏳ Phase 2 — CMA intake flow
- ⏳ Phase 3 — AI parsing layer ⚠️ VERIFY GATE
- ⏳ Phase 4 — Adjustment engine ⚠️ VERIFY GATE
- ⏳ Phase 5 — PDF render

## What's Built

### Phase 1 ✅
- React PWA with Vite (installable to phone)
- Supabase auth (email/password + profiles)
- TRP branding (navy/blue, Playfair Display + Inter, logo)
- Home screen tool launcher
- "CMA Generator" card (clickable placeholder)
- Service worker for offline capability

## Stack

- **Frontend:** React + Vite
- **Auth/DB:** Supabase
- **Styling:** CSS custom properties (tokens from TIDAL_COLLAB_MASTER.md)
- **Fonts:** Google Fonts (Playfair Display + Inter)
- **PWA:** Manifest + service worker

## Setup

### 1. Supabase Project

1. Create new project at [supabase.com](https://supabase.com)
2. Run the schema migration:
   ```sql
   -- Copy contents of supabase/schema.sql into SQL Editor
   ```
3. Get your project URL and anon key from Settings → API

### 2. Environment Variables

Create `frontend/.env`:

```bash
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

### 3. Install & Run

```bash
cd frontend
npm install
npm run dev
```

Open http://localhost:3000

### 4. Deploy (when ready)

```bash
npm run build
# Upload dist/ to hosting (Vercel, Netlify, etc.)
```

## Project Structure

```
tidal-collab/
├── frontend/
│   ├── src/
│   │   ├── App.jsx              # Main app + auth flow
│   │   ├── components/
│   │   │   ├── Auth/
│   │   │   │   ├── Login.jsx
│   │   │   │   └── ProfileSetup.jsx
│   │   │   └── Home/
│   │   │       └── ToolLauncher.jsx
│   │   ├── lib/
│   │   │   └── supabase.js      # Supabase client
│   │   ├── styles/
│   │   │   └── brand.css        # TRP design tokens
│   │   └── assets/
│   │       └── tidal_logo.svg
│   ├── public/
│   │   ├── manifest.json        # PWA manifest
│   │   └── sw.js                # Service worker
│   └── package.json
├── supabase/
│   └── schema.sql               # DB schema
└── README.md
```

## Branding Enforcement

**CRITICAL:** "Tidal Collab" is the domain only. All visible branding says **"Tidal Realty Partners"**.

- ✅ PWA name: "Tidal Realty Partners"
- ✅ Browser title: "Tidal Realty Partners"
- ✅ Logo: TRP wordmark
- ✅ Colors: Navy (#091B34) + Blue (#42A5D7)
- ✅ Fonts: Playfair Display (headings) + Inter (body)

## Auth Flow

1. **Login/Signup** → Supabase email/password
2. **Profile Setup** → Name, phone (headshot upload in Phase 2)
3. **Home Screen** → Tool cards

## Next: Phase 2

**CMA Intake Flow:**
- Subject property input (manual + PDF upload paths)
- Comps PDF upload
- Competition PDF upload
- Data capture → backend

---

**Domain:** tidalcollab.com  
**Codebase:** Phase 1 verified, committed to git  
**Built by:** Hermes (Claude Code)  
**Master doc:** `TIDAL_COLLAB_MASTER.md`
