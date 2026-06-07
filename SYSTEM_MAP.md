# Tidal Collab System Map

> **Last Updated:** June 6, 2025  
> **Live Site:** https://matthew-kane-trp.github.io/tidal-collab/  
> **Repository:** https://github.com/Matthew-Kane-TRP/tidal-collab

---

## 🏗️ Architecture Overview

**Type:** Single-Page Application (SPA)  
**Pattern:** Serverless JAMstack  
**Hosting:** GitHub Pages (static site)  
**Backend:** Supabase Edge Functions (Deno runtime)  
**Database:** Supabase PostgreSQL (planned, not yet implemented)

```
┌─────────────────────────────────────────────────────┐
│  GitHub Pages (Static Host)                         │
│  https://matthew-kane-trp.github.io/tidal-collab/   │
└──────────────────┬──────────────────────────────────┘
                   │
                   │ User visits site
                   ▼
┌─────────────────────────────────────────────────────┐
│  React Frontend (Vite build)                        │
│  - Tool Launcher home screen                        │
│  - CMA Generator workflow                           │
│  - Future tools (placeholders)                      │
└──────────────────┬──────────────────────────────────┘
                   │
                   │ API calls to /functions/v1/*
                   ▼
┌─────────────────────────────────────────────────────┐
│  Supabase Edge Functions                            │
│  Project: lmsvcvdmqqcbchvsmvzk                      │
│  - generate-cma (Anthropic Claude PDF parsing)      │
│  - download-cma (PDF generation placeholder)        │
└──────────────────┬──────────────────────────────────┘
                   │
                   │ AI processing
                   ▼
┌─────────────────────────────────────────────────────┐
│  Anthropic Claude API                               │
│  - PDF parsing & structured extraction              │
│  - Adjustment calculations                          │
│  - Market narrative generation                      │
└─────────────────────────────────────────────────────┘
```

---

## 📦 Tech Stack

### Frontend
- **Framework:** React 18.3 (via Vite 8.0.16)
- **Bundler:** Vite (fast HMR, optimized builds)
- **Styling:** Vanilla CSS with CSS variables (TRP brand colors)
- **State Management:** React useState hooks (no Redux/Context needed yet)
- **Routing:** None (single-page tool launcher, conditional rendering)
- **Icons:** Emoji (📊 🔍 🛠️ etc.)

### Backend
- **Runtime:** Deno (Supabase Edge Functions)
- **AI:** Anthropic Claude 3.5 Sonnet (via @anthropic-ai/sdk)
- **Database:** Supabase PostgreSQL (not yet used)
- **Auth:** Removed (was Supabase Auth, now open access)

### APIs & Integrations
- **Anthropic API:** PDF parsing, text generation
- **Supabase:** Edge Functions hosting, future database
- **Planned:**
  - Dotloop API (contract generation)
  - MLS Data API (property data)
  - Follow Up Boss API (CRM integration)

### Deployment
- **CI/CD:** Manual via `git push` (no GitHub Actions yet)
- **Static Host:** GitHub Pages (gh-pages branch)
- **CDN:** GitHub's CDN (automatic)
- **DNS:** Domain `tidalcollab.com` registered via Squarespace (not yet pointed)

---

## 📁 Repository Structure

```
tidal-collab/
├── frontend/                      # React application
│   ├── src/
│   │   ├── main.jsx              # React entry point
│   │   ├── App.jsx               # Root component (tool routing)
│   │   ├── components/
│   │   │   ├── Home/
│   │   │   │   └── ToolLauncher.jsx       # Home screen with 8 tool cards
│   │   │   ├── CMA/
│   │   │   │   ├── CMAGenerator.jsx       # CMA workflow orchestrator
│   │   │   │   ├── SubjectIntake.jsx      # Subject property form
│   │   │   │   ├── CompsUpload.jsx        # Comps/competition PDFs
│   │   │   │   ├── ProcessingView.jsx     # Loading state
│   │   │   │   └── ResultsView.jsx        # Analysis results + download
│   │   │   └── Auth/
│   │   │       └── Login.jsx              # UNUSED (auth removed)
│   │   ├── styles/
│   │   │   └── brand.css         # TRP colors, card styles
│   │   ├── assets/
│   │   │   └── tidal_logo.svg    # TRP logo
│   │   └── lib/
│   │       └── supabase.js       # Supabase client init
│   ├── public/
│   ├── index.html                # HTML shell
│   ├── package.json              # Dependencies
│   └── vite.config.js            # Vite config (base: '/tidal-collab/')
│
├── supabase/
│   └── functions/
│       ├── generate-cma/
│       │   └── index.ts          # PDF parsing + AI analysis
│       └── download-cma/
│           └── index.ts          # PDF generation (placeholder)
│
├── SYSTEM_MAP.md                 # This file
├── THIS_IS_WHAT_YOU_HAVE.md     # Feature inventory
├── DEPLOY.md                     # Deployment guide
└── README.md                     # Project overview
```

---

## 🛠️ System Components

### 1. Tool Launcher (`ToolLauncher.jsx`)

**Purpose:** Home screen showing all available tools

**State:**
- 8 tool cards (1 active, 7 placeholders)
- Each card has: `id`, `name`, `description`, `icon`, `available`
- Available tools call `onLaunchTool(id)` → triggers App.jsx route

**Tools List:**
1. ✅ **CMA Generator** (live)
2. 🔍 **Home Inspection Review** (placeholder)
3. 🛠️ **Repair Request Generator** (placeholder)
4. 📋 **Contract Document Generator** (placeholder)
5. 📱 **Social Post Generator** (placeholder)
6. 📧 **Listing Alert Builder** (placeholder)
7. 📈 **FUB Pipeline Dashboard** (placeholder)
8. 🏘️ **Market Snapshot** (placeholder)

**Code Flow:**
```javascript
ToolLauncher → user clicks card → onLaunchTool('cma-generator')
  → App.jsx sets activeTool state
  → renders <CMAGenerator /> instead of <ToolLauncher />
```

---

### 2. CMA Generator (Full Workflow)

**Purpose:** Generate Comparative Market Analysis with AI

**Workflow Steps:**
1. **Subject Property Intake** (`SubjectIntake.jsx`)
2. **Comparables Upload** (`CompsUpload.jsx`)
3. **AI Processing** (`ProcessingView.jsx`)
4. **Results & Download** (`ResultsView.jsx`)

#### Step 1: Subject Property Intake

**Two Input Modes:**
- **PDF Upload:** MLS sheet if property was recently listed
- **Manual Entry:** Form with address, year, sqft, bed/bath, quality slider, pool, updates

**Required Fields:**
- Manual: `address`, `heatedSqft`, `quality`, `updateNotes`
- PDF: `file`, `updateNotes`

**Output:** 
```javascript
{
  mode: 'pdf' | 'manual',
  file?: File,
  address?: string,
  yearBuilt?: string,
  // ... other property details
  updateNotes: string  // Always required
}
```

#### Step 2: Comparables Upload

**Inputs:**
- **Comps PDF:** 3-6 recently sold properties (similar size, <1 mile, <6 months)
- **Competition PDF:** Active listings competing for buyers

**Validation:** Both PDFs required

**Output:**
```javascript
{
  subject: { ...subjectData },
  comps: File,        // PDF of sold comparables
  competition: File   // PDF of active listings
}
```

#### Step 3: AI Processing (Backend)

**Endpoint:** `POST /functions/v1/generate-cma`

**Request:**
```javascript
FormData {
  subject: JSON string of property details
  comps: PDF file
  competition: PDF file
}
```

**Backend Process:**
1. Parse all PDFs with Claude API
2. Extract property details (address, price, sqft, bed/bath, features)
3. Calculate $/sqft for each comp
4. Apply adjustments for differences vs. subject:
   - Sqft difference × $/sqft
   - Quality score delta
   - Pool presence
   - Special features
5. Generate market narrative
6. Return structured analysis

**Response:**
```javascript
{
  id: 'cma_xxx',
  subject: { address, ... },
  suggestedValue: 450000,
  comps: [
    {
      address: '123 Main St',
      originalPrice: 425000,
      adjustedPrice: 448000,
      dom: 12,
      sqft: 1950,
      adjustments: '+$23,000 (smaller, lower quality)'
    },
    // ... more comps
  ],
  narrative: 'Based on 5 comparable sales...',
  competition: [ ... ]
}
```

#### Step 4: Results & Download

**Display:**
- Subject address
- Suggested value (large, blue)
- Number of comps analyzed
- Market narrative
- Comps table (address, original price, adjusted price, DOM)

**Actions:**
- **Download PDF:** Opens `/functions/v1/download-cma?id={cma_id}` (currently returns HTML placeholder)
- **New CMA:** Resets workflow to step 1

---

### 3. Supabase Edge Functions

#### `generate-cma/index.ts`

**Runtime:** Deno  
**Dependencies:** `@anthropic-ai/sdk`, `npm:pdf-parse`

**Environment Variables:**
- `ANTHROPIC_API_KEY` (set via `supabase secrets set`)

**Key Logic:**

```typescript
// 1. Parse PDFs
const subjectText = await parsePDF(subjectFile)
const compsText = await parsePDF(compsFile)
const competitionText = await parsePDF(competitionFile)

// 2. Send to Claude API
const response = await anthropic.messages.create({
  model: 'claude-3-5-sonnet-20241022',
  messages: [{
    role: 'user',
    content: `Extract property details from these PDFs and calculate CMA:
    
    Subject: ${subjectText}
    Comparables: ${compsText}
    Competition: ${competitionText}
    
    Return JSON with: subject, comps, suggestedValue, narrative`
  }],
  temperature: 0.3
})

// 3. Parse JSON response and return
```

**Adjustment Algorithm:**
- Uses **$/sqft spine method** (industry standard)
- Comp adjusted price = Original price + (sqft diff × avg $/sqft) + quality adj + feature adj
- Conservative estimates (undervalues rather than overvalues)

#### `download-cma/index.ts`

**Status:** Placeholder (returns HTML template, not actual PDF)

**Planned Implementation:**
- Use Puppeteer or jsPDF to generate branded PDF
- Include TRP logo, charts, comp photos
- Download as `CMA_123MainSt_2025-06-06.pdf`

---

## 🔐 Secrets & Configuration

### Environment Variables

**Frontend** (`.env` - NOT committed to git):
```bash
VITE_SUPABASE_URL=https://lmsvcvdmqqcbchvsmvzk.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbG...N4Kg
```

**Supabase Secrets** (set via CLI):
```bash
supabase secrets set ANTHROPIC_API_KEY=sk-ant-...
```

### Retrieval from macOS Keychain

```bash
# Supabase anon key
security find-generic-password -s supabase-anon-key -a matthew -w

# Anthropic API key
security find-generic-password -s anthropic-api-key -a matthew -w

# GitHub token (for repo operations)
security find-generic-password -s github-token -a matthew-kane-trp -w
```

---

## 🚀 Deployment Process

### Initial Setup (One-time)

1. **Link Supabase Project:**
   ```bash
   cd ~/tidal-collab
   supabase link --project-ref lmsvcvdmqqcbchvsmvzk
   ```

2. **Set Secrets:**
   ```bash
   supabase secrets set ANTHROPIC_API_KEY=sk-ant-xxx
   ```

3. **Create GitHub Repo:**
   ```bash
   git init
   git remote add origin https://github.com/Matthew-Kane-TRP/tidal-collab.git
   ```

4. **Enable GitHub Pages:**
   - Go to repo Settings → Pages
   - Source: Deploy from branch
   - Branch: `gh-pages` / root

### Deploy Backend (Supabase Edge Functions)

```bash
cd ~/tidal-collab

# Deploy all functions
supabase functions deploy

# Or deploy specific function
supabase functions deploy generate-cma
```

**Live URLs:**
- `https://lmsvcvdmqqcbchvsmvzk.supabase.co/functions/v1/generate-cma`
- `https://lmsvcvdmqqcbchvsmvzk.supabase.co/functions/v1/download-cma`

### Deploy Frontend (GitHub Pages)

```bash
cd ~/tidal-collab

# 1. Build frontend
cd frontend
npm run build  # Creates frontend/dist/

# 2. Commit to main
cd ..
git add -A
git commit -m "Your changes"
git push origin main

# 3. Deploy to gh-pages
git checkout gh-pages
cp -r frontend/dist/* .
git add -A
git commit -m "Deploy: Your changes"
git push origin gh-pages
git checkout main
```

**Live URL:** https://matthew-kane-trp.github.io/tidal-collab/

**Cache Warning:** GitHub Pages CDN caches for 5-10 minutes. Users may need hard refresh (Shift+Reload) to see changes.

---

## 🎨 Branding & Styling

### TRP Brand Colors

Defined in `frontend/src/styles/brand.css`:

```css
:root {
  --brand-navy: #091B34;      /* Primary dark blue */
  --brand-navy-dk: #001F45;   /* Darker navy */
  --brand-blue: #42A5D7;      /* TRP bright blue */
  --brand-blue-lt: #6BB8E0;   /* Light blue (links) */
  --brand-slate: #64748B;     /* Gray text */
  --brand-mist: #E2E8F0;      /* Light borders */
  --brand-wash: #F8FAFC;      /* Page background */
  --brand-white: #FFFFFF;
}
```

### Typography

- **Headings:** Playfair Display (serif, elegant)
- **Body:** Inter (sans-serif, clean)

```css
body {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
}

h1, h2, h3 {
  font-family: 'Playfair Display', Georgia, serif;
}
```

### Card Component

Used throughout (tool cards, form sections):

```css
.card {
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
}
```

---

## ➕ How to Add a New Tool

### 1. Add Placeholder to Tool Launcher

Edit `frontend/src/components/Home/ToolLauncher.jsx`:

```javascript
const tools = [
  // ... existing tools
  {
    id: 'new-tool-id',
    name: 'Tool Name',
    description: 'What it does',
    icon: '🔥',
    available: false  // true when built
  }
]
```

### 2. Create Component

```bash
mkdir frontend/src/components/NewTool
touch frontend/src/components/NewTool/NewTool.jsx
```

Example structure:
```javascript
export default function NewTool({ onBack }) {
  return (
    <div>
      <button onClick={onBack}>← Back to Tools</button>
      <h1>New Tool</h1>
      {/* Tool UI */}
    </div>
  )
}
```

### 3. Wire to App.jsx

Edit `frontend/src/App.jsx`:

```javascript
import NewTool from './components/NewTool/NewTool'

function App() {
  const [activeTool, setActiveTool] = useState(null)

  if (activeTool === 'new-tool-id') {
    return <NewTool onBack={() => setActiveTool(null)} />
  }

  // ... rest of routing
}
```

### 4. Update Tool Card

Change `available: false` → `available: true` and add:

```javascript
{
  id: 'new-tool-id',
  name: 'Tool Name',
  description: 'What it does',
  icon: '🔥',
  available: true,
  onLaunch: () => onLaunchTool('new-tool-id')
}
```

### 5. Create Backend Function (if needed)

```bash
supabase functions new tool-name
```

Edit `supabase/functions/tool-name/index.ts`:

```typescript
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

serve(async (req) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  // Your logic here
  const data = await req.json()
  
  return new Response(
    JSON.stringify({ result: 'success' }),
    { headers: { 'Content-Type': 'application/json', ...corsHeaders } }
  )
})
```

Deploy:
```bash
supabase functions deploy tool-name
```

---

## 📋 Planned Integrations

### 1. Dotloop API

**Purpose:** Auto-populate contracts from MLS data

**Docs:** https://www.dotloop.com/api/docs/

**Authentication:** OAuth 2.0

**Key Endpoints:**
- `POST /loop` - Create new transaction loop
- `POST /loop/{id}/document` - Add contract document
- `PATCH /loop/{id}/document/{doc_id}` - Update fields

**Integration Plan:**
- Store Dotloop access token in Supabase secrets
- Create `generate-contract` Edge Function
- Map MLS fields → Dotloop contract fields
- Auto-fill: price, address, dates, contingencies

### 2. MLS Data API

**Purpose:** Pull property listing data

**Common MLS APIs:**
- **RESO Web API** (Real Estate Standards Organization)
- **Bridge Interactive** (many MLSs use this)
- **Local MLS provider** (depends on Wilmington MLS)

**Typical Auth:** API key or OAuth

**Key Data Points:**
- Property details (address, sqft, bed/bath)
- Listing price, status, DOM
- Photos
- Agent info
- Tax records

**Integration Plan:**
- Identify which MLS API Wilmington/NC Realtors use
- Get API credentials
- Create `fetch-mls-data` Edge Function
- Use in multiple tools (CMA, contracts, social posts)

### 3. Follow Up Boss API

**Purpose:** Pull CRM pipeline data for dashboard

**Docs:** https://developers.followupboss.com/

**Authentication:** API key (already stored in Keychain)

**Key Endpoints:**
- `GET /users/{userId}` - Agent profile
- `GET /people` - Leads/contacts
- `GET /events` - Activity timeline
- `GET /calls` - Call logs

**Existing Research:**
- See `~/.hermes/real-broker-api-findings.md` for similar patterns
- FUB quirks documented in memory (filters, pagination, default limits)

**Integration Plan:**
- Create `fub-dashboard` Edge Function
- Pull: active leads, recent activity, pipeline stats
- Display on dashboard with charts

---

## 🐛 Known Issues & Limitations

### 1. GitHub Pages CDN Caching
- **Issue:** Changes take 5-10 minutes to propagate
- **Workaround:** Hard refresh (Shift+Reload) or incognito window
- **Future Fix:** Add cache-busting query params or migrate to Vercel/Netlify

### 2. No Authentication
- **Current State:** Open access (anyone with URL can use tools)
- **Risk:** API costs if URL is shared publicly
- **Future Fix:** Add simple password protection or Supabase Auth with `@tidalrealtypartners.com` email restriction

### 3. PDF Generation Placeholder
- **Current State:** `download-cma` returns HTML, not PDF
- **Needed:** Puppeteer or jsPDF integration
- **Challenge:** Puppeteer requires Node.js (Edge Functions are Deno)
- **Solution:** Use Deno-compatible PDF library or separate Node service

### 4. No Database Persistence
- **Current State:** CMA results only returned via API, not stored
- **Impact:** Can't retrieve past CMAs, no audit trail
- **Future Fix:** Store results in Supabase PostgreSQL

### 5. No Error Logging
- **Current State:** Errors only visible in browser console
- **Impact:** Hard to debug production issues
- **Future Fix:** Add Sentry or LogRocket

---

## 📊 Performance Metrics

### Frontend Build
- **Bundle Size:** ~211 KB (65 KB gzipped)
- **Build Time:** ~70-80ms
- **Dependencies:** 5 (React, ReactDOM, Supabase client, Vite)

### API Response Times
- **CMA Generation:** 30-60 seconds (Claude API processing)
- **Edge Function Cold Start:** ~1-2 seconds
- **Warm Requests:** <500ms

### Optimization Opportunities
- [ ] Code splitting by route (dynamic imports)
- [ ] Image optimization (logo is 5.7 KB SVG, fine for now)
- [ ] Lazy load placeholder tools (don't bundle until available)
- [ ] Cache Claude responses for identical inputs

---

## 🔮 Future Roadmap

### Phase 1: Core Transaction Tools (Next 2 weeks)
- [ ] Home Inspection Review Tool
- [ ] Repair Request Generator
- [ ] PDF generation for CMA (replace placeholder)

### Phase 2: Marketing Tools (Weeks 3-4)
- [ ] Social Post Generator
- [ ] Listing Alert Builder
- [ ] Neighborhood Guide Builder (from earlier suggestions)

### Phase 3: Integrations (Month 2)
- [ ] Follow Up Boss Dashboard
- [ ] MLS Data API integration
- [ ] Dotloop Contract Generator

### Phase 4: Platform Features (Month 3)
- [ ] User accounts (team member profiles)
- [ ] Usage analytics (which tools are most used)
- [ ] Saved templates/favorites
- [ ] Mobile app (React Native or PWA)

### Phase 5: Advanced Features (Month 4+)
- [ ] Real-time collaboration (multiple agents on same CMA)
- [ ] Automated workflows (trigger actions in FUB from tools)
- [ ] Custom branding per agent (personalized PDFs)
- [ ] API for third-party integrations

---

## 📞 Support & Maintenance

### Key Files to Monitor
- `frontend/package.json` - Dependency updates
- `supabase/functions/*/index.ts` - API logic
- `SYSTEM_MAP.md` - This doc (update as you build)

### Common Tasks

**Update Dependencies:**
```bash
cd frontend
npm update
npm audit fix
```

**Check Supabase Logs:**
```bash
supabase functions logs generate-cma
```

**View GitHub Pages Build Status:**
- Go to repo → Actions tab (if GitHub Actions enabled)
- Or check: Settings → Pages → Last deployment time

**Rollback Deployment:**
```bash
git checkout gh-pages
git reset --hard HEAD~1  # Go back one commit
git push -f origin gh-pages
```

---

## 🧠 AI Model Details

### Anthropic Claude 3.5 Sonnet

**Model ID:** `claude-3-5-sonnet-20241022`

**Why This Model:**
- Best at structured data extraction from PDFs
- Strong at following complex instructions
- Good at domain-specific tasks (real estate comps)
- Lower cost than Claude Opus

**Token Limits:**
- Input: 200K tokens
- Output: 8K tokens
- Typical CMA uses: ~15K input, ~2K output

**Temperature:** 0.3 (consistent, factual outputs)

**Cost:** ~$3 per 1M input tokens, ~$15 per 1M output tokens

**Estimated CMA Cost:** ~$0.10 per generation

---

## 📝 Development Notes

### Why Vite Over Create React App
- **10x faster** cold starts
- **Modern:** Native ESM, optimized for 2024+
- **Smaller bundles:** Better tree-shaking
- **Better DX:** Instant HMR

### Why Supabase Over Firebase
- **Open source** (can self-host if needed)
- **PostgreSQL** (real SQL, not NoSQL)
- **Edge Functions** = serverless without vendor lock-in
- **Better pricing** for small teams

### Why GitHub Pages Over Vercel
- **Free** for public repos
- **Simple** (no build config)
- **Owned by GitHub** (where code already lives)
- **Can migrate** to Vercel later if needed (just change deployment script)

---

## 🔗 Important Links

- **Live Site:** https://matthew-kane-trp.github.io/tidal-collab/
- **GitHub Repo:** https://github.com/Matthew-Kane-TRP/tidal-collab
- **Supabase Dashboard:** https://supabase.com/dashboard/project/lmsvcvdmqqcbchvsmvzk
- **Anthropic Console:** https://console.anthropic.com/
- **Domain Registrar:** Squarespace (tidalcollab.com)

---

## 🎓 Learning Resources

If you need to hand this off or learn more:

- **React:** https://react.dev/learn
- **Vite:** https://vitejs.dev/guide/
- **Supabase:** https://supabase.com/docs
- **Anthropic API:** https://docs.anthropic.com/
- **Deno:** https://deno.land/manual

---

**End of System Map**

*This document should be updated whenever major changes are made. Treat it as the single source of truth for the Tidal Collab platform.*
