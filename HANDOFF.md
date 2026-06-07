# Tidal Collab - AI Agent Handoff Document

> **Last Updated:** June 7, 2025  
> **Prepared For:** Claude Code (or any AI agent picking up this project)  
> **Project Owner:** Matthew Kane, Tidal Realty Partners

---

## 📋 Table of Contents

1. [Project Overview](#project-overview)
2. [What Has Been Built](#what-has-been-built)
3. [Current State](#current-state)
4. [How to Access Everything](#how-to-access-everything)
5. [Working with This Project](#working-with-this-project)
6. [What's Next (Roadmap)](#whats-next-roadmap)
7. [Important Context & Constraints](#important-context--constraints)
8. [Troubleshooting](#troubleshooting)

---

## 📋 Project Overview

### What This Is

**Tidal Collab** is an AI-powered agent hub for Tidal Realty Partners real estate agents. It's a collection of web-based tools that automate tedious tasks and leverage AI to make agents more productive.

**Think:** Internal SaaS platform, but purpose-built for one real estate team.

### The Vision

Matthew wants to create the **best agent experience** for his team. Instead of agents spending hours on:
- Manual CMA calculations
- Writing repair requests from inspection reports
- Generating social media posts
- Chasing leads in their CRM

...they click a button, upload a PDF, and AI does it in 30 seconds.

### Tech Stack at a Glance

- **Frontend:** React 18 + Vite (single-page app)
- **Backend:** Supabase Edge Functions (Deno serverless)
- **AI:** Anthropic Claude 3.5 Sonnet
- **Hosting:** GitHub Pages (frontend), Supabase (backend)
- **Database:** Supabase PostgreSQL (planned, not yet used)
- **Deployment:** Manual via git push

---

## 🏗️ What Has Been Built

### Phase 1: Infrastructure ✅ **COMPLETE**

**1. Repository & Deployment Pipeline**
- GitHub repo: `Matthew-Kane-TRP/tidal-collab`
- Two branches:
  - `main` - Source code
  - `gh-pages` - Deployed static site
- Live site: https://matthew-kane-trp.github.io/tidal-collab/

**2. React PWA Shell**
- Vite-based React app
- TRP branding (navy #091B34, blue #42A5D7, Playfair Display + Inter fonts)
- Installable as PWA (mobile-first design)
- Tool launcher home screen

**3. Supabase Backend**
- Project ID: `lmsvcvdmqqcbchvsmvzk`
- Two Edge Functions deployed:
  - `generate-cma` - PDF parsing + AI analysis
  - `download-cma` - PDF generation (placeholder)

**4. Authentication Removed**
- Originally had Supabase Auth with login/signup
- Matthew wanted open access (no login required)
- All auth code removed, site loads directly to home screen

---

### Phase 2: CMA Generator Tool ✅ **COMPLETE**

**What It Does:**
Upload 3 PDFs (subject property + sold comps + active competition) → AI analyzes → Generates professional Comparative Market Analysis with:
- Suggested property value
- Comp adjustments ($/sqft method)
- Market narrative
- Competition analysis

**Components Built:**

1. **SubjectIntake.jsx** (291 lines)
   - Two input modes: manual form OR PDF upload
   - Manual: address, year, sqft, bed/bath, quality slider, pool, updates
   - PDF: MLS sheet upload + update notes

2. **CompsUpload.jsx** (103 lines)
   - Upload 2 PDFs: comps (sold) + competition (active)
   - Validation (both required)

3. **ProcessingView.jsx** (35 lines)
   - Loading state while AI processes
   - "Analyzing PDFs..." message

4. **ResultsView.jsx** (134 lines)
   - Display suggested value
   - Comps table (address, price, adjusted price, DOM)
   - Market narrative
   - Download PDF button (currently placeholder)

5. **CMAGenerator.jsx** (141 lines)
   - Orchestrator for 4-step flow
   - Progress indicator
   - Back to tools button

**Backend: `generate-cma` Edge Function** (205 lines)
- Receives 3 PDFs via FormData
- Parses with `pdf-parse` library
- Sends text to Claude API with structured prompt
- Claude extracts property details, calculates adjustments
- Returns JSON with:
  - `suggestedValue`
  - `comps` array (with adjustments)
  - `competition` array
  - `narrative` (market context)

**Status:** ✅ Fully functional, deployed, ready to use

---

### Phase 3: Tool Placeholders ✅ **COMPLETE**

Added 7 placeholder tool cards to show the roadmap:

1. 🔍 **Home Inspection Review** - Upload inspection PDF → AI categorizes issues, estimates costs
2. 🛠️ **Repair Request Generator** - Convert inspection findings → professional repair request doc
3. 📋 **Contract Document Generator** - Dotloop + MLS integration for auto-populated contracts
4. 📱 **Social Post Generator** - Listing → Instagram/Facebook posts with captions
5. 📧 **Listing Alert Builder** - New listings → email/SMS templates
6. 📈 **FUB Pipeline Dashboard** - Follow Up Boss CRM stats at a glance
7. 🏘️ **Market Snapshot** - Wilmington area market data

**Status:** Cards visible on home screen, grayed out, not clickable yet

---

### Phase 4: Documentation 📚 **COMPLETE**

**Created 3 comprehensive docs:**

1. **SYSTEM_MAP.md** (837 lines)
   - Architecture diagrams
   - Tech stack rationale
   - Repository structure
   - Deployment process
   - How to add new tools
   - API integrations (planned)
   - Known issues & limitations

2. **AI_FOLLOWUP_SYSTEM.md** (1,180 lines)
   - Design for AI lead follow-up bot
   - Tag-based segmentation (hot-buyer, investor, etc.)
   - Rule engine for intelligent timing
   - Message generation with Claude
   - UI mockups
   - Database schema
   - 6-week implementation plan

3. **HANDOFF.md** (this file)
   - Everything an AI agent needs to continue building

---

## 🎯 Current State

### What Works

✅ **Live Website**
- URL: https://matthew-kane-trp.github.io/tidal-collab/
- Loads instantly, no login required
- Shows tool launcher with 8 cards (1 working, 7 placeholders)

✅ **CMA Generator**
- End-to-end workflow functional
- Upload 3 PDFs → Get analysis in ~30-60 seconds
- Results display correctly
- Download button exists (returns HTML placeholder, not real PDF yet)

✅ **Supabase Edge Functions**
- Deployed and live
- `generate-cma` processes PDFs correctly
- Claude API integration working
- CORS headers configured

✅ **Git Workflow**
- `main` branch: source code
- `gh-pages` branch: deployed site
- Both pushed to GitHub

---

### What's Incomplete

❌ **PDF Generation**
- `download-cma` Edge Function returns HTML template, not actual PDF
- Needs: Puppeteer or jsPDF integration to render PDF
- Challenge: Puppeteer requires Chrome binary (not available in Deno Edge Functions)

❌ **Database Persistence**
- No storage of CMA results
- Can't retrieve past CMAs
- Can't track usage analytics

❌ **Other 7 Tools**
- Only placeholders, no functionality yet
- Need to be built one by one

❌ **Authentication/Authorization**
- Site is completely open (anyone with URL can use it)
- No usage limits, API key exposed in requests
- Risk: If URL leaks, could incur high Anthropic API costs

❌ **Error Handling**
- Basic error display in frontend
- No logging/monitoring (Sentry, LogRocket)
- Hard to debug production issues

---

### Known Issues

1. **GitHub Pages CDN Caching**
   - Problem: Changes take 5-10 minutes to propagate globally
   - Workaround: Hard refresh (Shift+Reload) or incognito mode
   - Future fix: Migrate to Vercel/Netlify (instant deploys)

2. **No Authentication**
   - Problem: Anyone with URL can burn through API quota
   - Temporary solution: URL is private (not advertised)
   - Future fix: Add Supabase Auth with `@tidalrealtypartners.com` email restriction

3. **PDF Download Placeholder**
   - Problem: Button says "Download PDF" but returns HTML
   - Confusing for users
   - Future fix: Implement real PDF generation

4. **No Mobile Testing**
   - Problem: Built phone-first but not tested on actual phones
   - Risk: Layout issues on iOS/Android
   - Future fix: Test on real devices, adjust CSS

---

## 🔐 How to Access Everything

### Live Deployments

**Frontend:**
- URL: https://matthew-kane-trp.github.io/tidal-collab/
- No credentials needed (open access)

**Supabase Dashboard:**
- URL: https://supabase.com/dashboard/project/lmsvcvdmqqcbchvsmvzk
- Credentials: (Matthew has these, retrieve from his account)

**GitHub Repository:**
- URL: https://github.com/Matthew-Kane-TRP/tidal-collab
- Access: Matthew's account (`Matthew-Kane-TRP`)

---

### Local Development Setup

**1. Clone Repository**
```bash
cd ~
git clone https://github.com/Matthew-Kane-TRP/tidal-collab.git
cd tidal-collab
```

**2. Install Frontend Dependencies**
```bash
cd frontend
npm install
```

**3. Set Up Environment Variables**

The `.env` file is gitignored (for security), so you need to create it:

```bash
cd ~/tidal-collab/frontend
cat > .env << 'EOF'
VITE_SUPABASE_URL=https://lmsvcvdmqqcbchvsmvzk.supabase.co
VITE_SUPABASE_ANON_KEY=<RETRIEVE_FROM_KEYCHAIN>
EOF
```

To retrieve from macOS Keychain:
```bash
security find-generic-password -s supabase-anon-key -a matthew -w
```

**4. Run Development Server**
```bash
cd ~/tidal-collab/frontend
npm run dev
```

Site will be available at `http://localhost:5173/tidal-collab/`

**Note:** The base path `/tidal-collab/` is required because GitHub Pages serves from a subdirectory. This is configured in `vite.config.js`:
```javascript
export default defineConfig({
  base: '/tidal-collab/',
  // ...
})
```

---

### Supabase Setup

**1. Install Supabase CLI**
```bash
brew install supabase/tap/supabase
```

**2. Link to Project**
```bash
cd ~/tidal-collab
supabase link --project-ref lmsvcvdmqqcbchvsmvzk
```

You'll be prompted for your Supabase access token. Retrieve it:
```bash
security find-generic-password -s supabase-access-token -a matthew -w
```

**3. Set Edge Function Secrets**
```bash
# Anthropic API key
ANTHROPIC_KEY=$(security find-generic-password -s anthropic-api-key -a matthew -w)
supabase secrets set ANTHROPIC_API_KEY=$ANTHROPIC_KEY
```

**4. Deploy Edge Functions**
```bash
# Deploy all functions
supabase functions deploy

# Or deploy specific function
supabase functions deploy generate-cma
supabase functions deploy download-cma
```

**5. View Logs**
```bash
supabase functions logs generate-cma --tail
```

---

### Credentials Reference

All credentials are stored in macOS Keychain. Retrieve with:

```bash
# Supabase
security find-generic-password -s supabase-anon-key -a matthew -w
security find-generic-password -s supabase-access-token -a matthew -w

# Anthropic
security find-generic-password -s anthropic-api-key -a matthew -w

# GitHub
security find-generic-password -s github-token -a matthew-kane-trp -w

# Follow Up Boss (for future AI follow-up bot)
security find-generic-password -s fub-api-key -a Matthew -w
```

**DO NOT hardcode these in files.** Always use environment variables or Supabase secrets.

---

## 💻 Working with This Project

### File Structure

```
tidal-collab/
├── frontend/                          # React app
│   ├── src/
│   │   ├── main.jsx                  # Entry point
│   │   ├── App.jsx                   # Root component, tool routing
│   │   ├── components/
│   │   │   ├── Home/
│   │   │   │   └── ToolLauncher.jsx  # 8 tool cards
│   │   │   └── CMA/
│   │   │       ├── CMAGenerator.jsx  # Flow orchestrator
│   │   │       ├── SubjectIntake.jsx
│   │   │       ├── CompsUpload.jsx
│   │   │       ├── ProcessingView.jsx
│   │   │       └── ResultsView.jsx
│   │   ├── styles/
│   │   │   └── brand.css             # TRP colors
│   │   ├── assets/
│   │   │   └── tidal_logo.svg
│   │   └── lib/
│   │       └── supabase.js           # Supabase client
│   ├── public/
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js                # IMPORTANT: base: '/tidal-collab/'
│   └── .env                          # Gitignored (create locally)
│
├── supabase/
│   └── functions/
│       ├── generate-cma/
│       │   └── index.ts              # PDF parsing + AI
│       └── download-cma/
│           └── index.ts              # PDF generation (placeholder)
│
├── SYSTEM_MAP.md                     # Architecture docs
├── AI_FOLLOWUP_SYSTEM.md             # AI follow-up bot design
├── HANDOFF.md                        # This file
├── THIS_IS_WHAT_YOU_HAVE.md          # Original feature inventory (may be outdated)
├── DEPLOY.md                         # Deployment guide (may be outdated)
└── README.md                         # Project overview
```

---

### Adding a New Tool (Step-by-Step)

Let's say you want to build the **Home Inspection Review** tool.

#### Step 1: Add to Tool Launcher

Edit `frontend/src/components/Home/ToolLauncher.jsx`:

```javascript
{
  id: 'inspection-review',
  name: 'Home Inspection Review',
  description: 'Upload inspection PDFs → AI categorizes issues, estimates costs, suggests strategy',
  icon: '🔍',
  available: true,  // Changed from false
  onLaunch: () => onLaunchTool('inspection-review')  // Add this
}
```

#### Step 2: Create Component

```bash
mkdir ~/tidal-collab/frontend/src/components/Inspection
touch ~/tidal-collab/frontend/src/components/Inspection/InspectionReview.jsx
```

Basic structure:
```javascript
export default function InspectionReview({ onBack }) {
  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      <button onClick={onBack} style={{ marginBottom: '20px' }}>
        ← Back to Tools
      </button>
      <h1>Home Inspection Review</h1>
      {/* Your tool UI here */}
    </div>
  )
}
```

#### Step 3: Wire to App.jsx

Edit `frontend/src/App.jsx`:

```javascript
import InspectionReview from './components/Inspection/InspectionReview'

function App() {
  const [activeTool, setActiveTool] = useState(null)

  // Add routing
  if (activeTool === 'inspection-review') {
    return <InspectionReview onBack={() => setActiveTool(null)} />
  }

  if (activeTool === 'cma-generator') {
    return <CMAGenerator onBack={() => setActiveTool(null)} />
  }

  // Default: show tool launcher
  return (
    <div>
      <ToolLauncher 
        user={mockUser} 
        profile={mockProfile}
        onLaunchTool={setActiveTool}
      />
    </div>
  )
}
```

#### Step 4: Create Backend Function (if needed)

```bash
supabase functions new analyze-inspection
```

Edit `supabase/functions/analyze-inspection/index.ts`:

```typescript
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import Anthropic from 'https://esm.sh/@anthropic-ai/sdk@0.20.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const formData = await req.formData()
    const inspectionFile = formData.get('inspection')
    
    // Parse PDF, send to Claude, analyze...
    
    return new Response(
      JSON.stringify({ result: 'success', data: {} }),
      { 
        headers: { 
          'Content-Type': 'application/json',
          ...corsHeaders 
        } 
      }
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 400,
        headers: { 
          'Content-Type': 'application/json',
          ...corsHeaders 
        }
      }
    )
  }
})
```

Deploy:
```bash
supabase functions deploy analyze-inspection
```

#### Step 5: Test Locally

```bash
cd ~/tidal-collab/frontend
npm run dev
```

Visit `http://localhost:5173/tidal-collab/`, click the tool card, test functionality.

#### Step 6: Build & Deploy

```bash
# Build frontend
cd ~/tidal-collab/frontend
npm run build

# Commit changes
cd ~/tidal-collab
git add -A
git commit -m "Add Home Inspection Review tool"
git push origin main

# Deploy to gh-pages
git checkout gh-pages
cp -r frontend/dist/* .
git add -A
git commit -m "Deploy: Home Inspection Review"
git push origin gh-pages
git checkout main
```

Wait 5-10 minutes for GitHub Pages CDN to refresh, then test at live URL.

---

### Making Changes to Existing Tools

**Example: Fix a bug in CMA Generator**

1. **Make the change:**
   ```bash
   # Edit the file
   code ~/tidal-collab/frontend/src/components/CMA/ResultsView.jsx
   ```

2. **Test locally:**
   ```bash
   cd ~/tidal-collab/frontend
   npm run dev
   ```

3. **Commit & deploy:**
   ```bash
   cd ~/tidal-collab
   git add -A
   git commit -m "Fix: Results table formatting"
   git push origin main
   
   # Rebuild
   cd frontend
   npm run build
   
   # Deploy
   cd ..
   git checkout gh-pages
   cp -r frontend/dist/* .
   git add -A
   git commit -m "Deploy: Fix results table"
   git push origin gh-pages
   git checkout main
   ```

---

### Updating Edge Functions

**Example: Improve CMA analysis prompt**

1. **Edit the function:**
   ```bash
   code ~/tidal-collab/supabase/functions/generate-cma/index.ts
   ```

2. **Test locally (optional):**
   ```bash
   supabase functions serve generate-cma
   ```

3. **Deploy:**
   ```bash
   supabase functions deploy generate-cma
   ```

4. **Verify:**
   ```bash
   supabase functions logs generate-cma --tail
   ```

   Then test on the live site.

---

## 🗺️ What's Next (Roadmap)

### Immediate Priority (Next 2 Weeks)

**1. Home Inspection Review Tool**
- Upload inspection PDF
- AI extracts issues, categorizes (critical/major/minor)
- Estimates repair costs
- Suggests negotiation strategy

**Why first:** Matthew specifically requested it, high value for agents during due diligence

**Complexity:** Medium (similar to CMA tool, different AI prompt)

---

**2. Repair Request Generator**
- Takes inspection findings
- Generates professional repair request document
- Configurable tone (firm/balanced/conciliatory)
- Download as PDF (need to solve PDF generation first)

**Why second:** Natural follow-up to inspection review tool

**Complexity:** Medium (depends on PDF generation solution)

---

### Short-Term (Weeks 3-4)

**3. Fix PDF Generation**
- Research Deno-compatible PDF libraries (jsPDF, pdfmake)
- Or: Set up separate Node.js service for Puppeteer
- Or: Use third-party API (PDFShift, DocRaptor)
- Implement real PDF download for CMA + future tools

**Why important:** Every tool will need PDF output, blocking multiple features

**Complexity:** High (architectural decision needed)

---

**4. Social Post Generator**
- Upload listing photos + MLS data
- AI generates 3-5 caption variants
- Hashtag suggestions
- One-click copy to clipboard
- Optional: Direct post to Instagram/Facebook via API

**Why valuable:** Agents spend 20+ min per post, high ROI on automation

**Complexity:** Low-Medium (mostly prompt engineering)

---

### Medium-Term (Month 2)

**5. Follow Up Boss Dashboard**
- Connect to FUB API (credentials in Keychain)
- Display: pipeline stats, hot leads, recent activity
- Real-time data (refresh button)
- See `AI_FOLLOWUP_SYSTEM.md` for full design

**Why valuable:** Saves agents 15 min/day checking CRM

**Complexity:** Medium (API integration, data visualization)

---

**6. AI Lead Follow-Up Bot (Phase 1 - Manual)**
- Rule builder (tag-based)
- "Scan FUB Now" button
- Generate messages with Claude
- Approval queue (review before send)
- See `AI_FOLLOWUP_SYSTEM.md` for full spec

**Why game-changer:** Automates lead nurture, prevents leads from going cold

**Complexity:** High (multi-component system, needs testing)

---

### Long-Term (Months 3-4)

**7. Contract Document Generator**
- Integrate Dotloop API
- Pull MLS data
- Auto-populate contract fields
- Agent reviews, signs, sends

**Why valuable:** Saves 30-45 min per contract

**Complexity:** Very High (two external APIs, legal sensitivity)

---

**8. AI Follow-Up Bot (Phase 2 - Auto-Send)**
- Enable auto-send mode (after trust built)
- Multi-touch sequences
- A/B testing
- SMS support
- Analytics dashboard

**Complexity:** Very High (reliability critical)

---

### Ongoing / Infrastructure

- **Authentication:** Add Supabase Auth with `@tidalrealtypartners.com` email restriction
- **Database:** Start storing CMA results, user preferences, analytics
- **Monitoring:** Add Sentry or LogRocket for error tracking
- **Analytics:** Track tool usage, conversion rates
- **Mobile Testing:** Test on iOS/Android devices
- **Performance:** Code splitting, lazy loading
- **Multi-Agent:** Support other TRP team members (separate profiles, usage tracking)

---

## ⚠️ Important Context & Constraints

### Matthew's Preferences (User Profile)

**Decision-Making Style:**
- "Handle the rest" / "Make it live" = Do end-to-end to production, no option menus
- Prefers working prototypes over perfect planning
- Values speed over polish (ship fast, iterate)
- Gets frustrated by repetitive asks (save credentials immediately)

**Technical Preferences:**
- Remove blockers rather than wait (e.g., removed auth when it was slowing launch)
- Prefers autonomous execution once direction is clear
- Likes seeing placeholders to visualize the vision
- Manually checks calculations (doesn't blindly trust automation)

**Communication Style:**
- Appreciates comprehensive docs for reference (hence these 3 big .md files)
- Wants options presented, but trusts you to recommend the best path
- Catches mistakes (will call out "you're wrong" if math/logic errors)

---

### Project-Specific Rules

**1. Domain Confusion (CRITICAL)**
- There are THREE separate domains/projects:
  - `tidaloffers.com` - WordPress site (Hostinger)
  - `tidalrealtypartners.com` - TRP team site
  - `tidalcollab.com` - THIS PROJECT (Squarespace-registered, NOT hosted yet)
- **NEVER conflate them!** Always cross-check domain vs. git repo early
- When user corrects "this has no affiliation with X", update context immediately

**2. Credential Management**
- On first receipt of a secret: save to macOS Keychain immediately
- Record retrieval command in memory so future sessions pull autonomously
- NEVER ask for the same credential twice in a session

**3. Deployment Philosophy**
- Test URLs before sending to user
- When blocked by auth/setup complexity, prefer removing features to ship fast
- Add complexity back later (ship now, enhance later)

**4. Real Estate Market Language**
- Avoid: "luxury", "premium", "stunning"
- Use: DOM (Days on Market), cap rate, $/sqft, comps, inventory trends
- Market-realistic, data-driven language

---

### Technical Constraints

**1. GitHub Pages Limitations**
- Static site only (no server-side rendering)
- CDN caching (5-10 min delay on deploys)
- Must serve from `/tidal-collab/` subdirectory (not root)
- No custom domain yet (would require DNS changes)

**2. Supabase Edge Functions**
- Deno runtime (not Node.js)
- 500K requests/month free tier limit
- No Chrome binary (can't use Puppeteer directly)
- 10 MB max function size

**3. Anthropic API**
- $3 per 1M input tokens, $15 per 1M output tokens (Claude 3.5 Sonnet)
- Typical CMA costs ~$0.10 per generation
- No authentication = risk of runaway costs if URL leaks

**4. No Database Yet**
- All tools are stateless (don't save results)
- Can't track usage, past CMAs, user preferences
- Need to implement when adding analytics or multi-user

---

### Security Considerations

**Current State: INSECURE**
- No authentication (anyone with URL can use)
- API keys exposed in browser network tab (VITE_SUPABASE_ANON_KEY)
- Anthropic API key in Supabase secrets (secure), but no rate limiting

**Acceptable Because:**
- URL is private (not advertised)
- Matthew wants easy access for now
- Can add auth later

**When to Add Auth:**
- Before marketing to team
- If URL accidentally leaks
- When adding multi-user features
- When analytics show unexpected usage

---

## 🔧 Troubleshooting

### Site Shows Blank White Page

**Cause:** Browser cached old version with broken asset paths

**Fix:**
1. Hard refresh: `Shift + Reload` (Chrome/Firefox) or `Cmd + Shift + R` (Mac)
2. Or open in incognito/private window
3. Or wait 10 minutes for CDN cache to clear

---

### "Failed to fetch" Error on Tool Use

**Cause:** Supabase Edge Function not responding (or CORS issue)

**Debug:**
1. Check Edge Function logs:
   ```bash
   supabase functions logs generate-cma
   ```

2. Test Edge Function directly:
   ```bash
   curl -X POST https://lmsvcvdmqqcbchvsmvzk.supabase.co/functions/v1/generate-cma \
     -H "Content-Type: application/json" \
     -d '{"test": true}'
   ```

3. Check CORS headers in function code (should include `Access-Control-Allow-Origin: *`)

4. Redeploy function:
   ```bash
   supabase functions deploy generate-cma
   ```

---

### Local Dev Server Won't Start

**Cause:** Dependencies not installed or port conflict

**Fix:**
```bash
cd ~/tidal-collab/frontend

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install

# Try different port if 5173 is taken
npm run dev -- --port 5174
```

---

### Git Push to gh-pages Fails

**Cause:** Merge conflict or force push needed

**Fix:**
```bash
# If gh-pages is out of sync
git checkout gh-pages
git fetch origin
git reset --hard origin/gh-pages

# Then try deploy again
cp -r frontend/dist/* .
git add -A
git commit -m "Deploy: Your changes"
git push origin gh-pages
```

---

### Supabase Link Fails

**Cause:** Access token expired or wrong project ref

**Fix:**
```bash
# Get fresh access token from dashboard
# Settings → API → Generate new service role key

# Re-link
supabase link --project-ref lmsvcvdmqqcbchvsmvzk
```

---

### Claude API Returns Error

**Possible Causes:**
1. API key expired
2. Rate limit hit
3. Invalid request format
4. Token limit exceeded

**Debug:**
```bash
# Check logs
supabase functions logs generate-cma --tail

# Test API key manually
curl https://api.anthropic.com/v1/messages \
  -H "x-api-key: $ANTHROPIC_API_KEY" \
  -H "anthropic-version: 2023-06-01" \
  -H "content-type: application/json" \
  -d '{
    "model": "claude-3-5-sonnet-20241022",
    "max_tokens": 1024,
    "messages": [{"role": "user", "content": "Hello"}]
  }'
```

---

### Frontend Build Fails

**Cause:** Syntax error or missing dependency

**Fix:**
```bash
cd ~/tidal-collab/frontend

# Check for errors
npm run build

# If TypeScript errors (shouldn't be, but in case)
# React uses JSX, no TypeScript in this project

# If missing dependency
npm install
```

---

## 📚 Essential Reading

Before building anything new, read these (in order):

1. **SYSTEM_MAP.md** - Understand architecture, tech stack, how components connect
2. **AI_FOLLOWUP_SYSTEM.md** - If building anything FUB/CRM-related
3. **This file (HANDOFF.md)** - Reference for commands, credentials, workflow

---

## ✅ Pre-Flight Checklist (Before You Start)

Before making any changes:

- [ ] Read `SYSTEM_MAP.md` to understand architecture
- [ ] Clone repo and verify local dev server works
- [ ] Retrieve credentials from Keychain (Supabase, Anthropic, GitHub)
- [ ] Test the live site to understand current state
- [ ] Check `git status` to see if there are uncommitted changes
- [ ] Scan `ToolLauncher.jsx` to see which tools exist

Before deploying:

- [ ] Test locally (`npm run dev`)
- [ ] Build succeeds (`npm run build`)
- [ ] Commit to main with descriptive message
- [ ] Copy `dist/*` to gh-pages branch
- [ ] Push to GitHub
- [ ] Wait 5-10 min for CDN
- [ ] Test live URL
- [ ] Verify no console errors in browser

---

## 🎯 Your Mission (Next AI Agent)

**Primary Goal:** Continue building tools to make TRP agents more productive.

**Immediate Next Steps:**
1. Read this entire document
2. Review `SYSTEM_MAP.md`
3. Test the live site to see what works
4. Ask Matthew which tool to build next (probably Home Inspection Review)
5. Follow the "Adding a New Tool" workflow above
6. Deploy and verify

**Remember:**
- Matthew values speed over perfection
- Ship working prototypes, iterate based on feedback
- Save credentials immediately (Keychain)
- Never conflate the three domains (tidaloffers/trp/tidalcollab)
- Test before sending to user
- Update docs as you build

---

## 📞 Questions to Ask Matthew (If Needed)

If you're blocked or need decisions:

**For Home Inspection Review:**
- Do you have sample inspection PDFs I can test with?
- What inspection report software do your inspectors use? (HomeGauge, Spectora, other)
- Do you want cost estimates? If so, should I use a specific database or general market data?

**For Repair Request Generator:**
- Do you have a template/format TRP typically uses for repair requests?
- Should this integrate with Dotloop or just download a PDF?
- What tone do you prefer: firm, balanced, or configurable?

**For PDF Generation (blocking multiple tools):**
- Are you okay with using a third-party PDF API (costs ~$0.01/PDF)? Options:
  - PDFShift (paid)
  - DocRaptor (paid)
  - Self-hosted Puppeteer (requires separate Node service)
  - jsPDF (client-side, less polished output)

**For Authentication:**
- When should we add login? Now, or wait until tool is shared with team?
- Should it be email/password or Google OAuth with @tidalrealtypartners.com restriction?

---

## 🔄 How to Update This Document

When you build new features or make significant changes:

1. **Update HANDOFF.md:**
   - Add to "What Has Been Built"
   - Update "Current State"
   - Add new tools to roadmap
   - Document new credentials (if any)

2. **Update SYSTEM_MAP.md:**
   - Document new architecture decisions
   - Add new API integrations
   - Update file structure if new directories created

3. **Commit documentation with code:**
   ```bash
   git add HANDOFF.md SYSTEM_MAP.md
   git commit -m "Update docs: Home Inspection Review tool"
   ```

Keep these docs up-to-date so the next agent (or Matthew) can pick up where you left off.

---

**End of Handoff Document**

*You now have everything you need to continue building Tidal Collab. Good luck! 🚀*
