# 🚀 Deployment Guide

## Current Status

✅ **Phase 1-4 COMPLETE**
- React PWA with TRP branding
- Supabase auth + profiles
- Full CMA intake flow (subject + comps)
- Anthropic AI backend (PDF parsing + adjustments)
- Results view with analysis preview

⚠️ **Phase 5: PDF Generation** (Placeholder implemented)
- HTML template ready
- Needs: Puppeteer/headless Chrome for HTML→PDF conversion
- Mapbox integration deferred (you'll add when ready)

---

## Quick Deploy (3 Steps)

### 1. Deploy Supabase Functions

```bash
cd ~/tidal-collab

# Install Supabase CLI if needed
brew install supabase/tap/supabase

# Login
supabase login

# Link to your project
supabase link --project-ref lmsvcvdmqqcbchvsmvzk

# Set secrets
supabase secrets set ANTHROPIC_API_KEY="sk-ant-api03-..."

# Deploy functions
supabase functions deploy generate-cma
supabase functions deploy download-cma
```

### 2. Deploy Frontend (Vercel Recommended)

```bash
cd frontend

# Build
npm run build

# Deploy to Vercel (or Netlify/Cloudflare Pages)
npx vercel --prod

# Set environment variables in Vercel dashboard:
# VITE_SUPABASE_URL=https://lmsvcvdmqqcbchvsmvzk.supabase.co
# VITE_SUPABASE_ANON_KEY=eyJ...
```

### 3. Update CORS & Allowed Origins

In Supabase dashboard:
- **Authentication → URL Configuration**
- Add your production URL to "Site URL" and "Redirect URLs"

---

## Local Development

### Start Supabase (Local)

```bash
cd ~/tidal-collab
supabase start
```

This runs local Supabase on `http://localhost:54321`

### Start Frontend

```bash
cd frontend
npm run dev
```

Open http://localhost:3000

---

## Environment Variables

### Frontend (.env)
```
VITE_SUPABASE_URL=https://lmsvcvdmqqcbchvsmvzk.supabase.co
VITE_SUPABASE_ANON_KEY=eyJ...
```

### Supabase Functions (secrets)
```
ANTHROPIC_API_KEY=sk-ant-...
```

---

## Database Setup (If Not Done)

Run `supabase/schema.sql` in Supabase SQL Editor:

```sql
-- Creates profiles table with RLS policies
-- Auto-creates profile on user signup
```

---

## Production Checklist

- [ ] Supabase functions deployed
- [ ] Frontend deployed (Vercel/Netlify)
- [ ] Environment variables set
- [ ] Database schema run
- [ ] CORS/redirect URLs configured
- [ ] Test signup/login flow
- [ ] Test CMA generation with real PDFs
- [ ] Verify Anthropic API calls working

---

## Known Limitations (v1)

1. **PDF Generation:** Returns HTML preview instead of PDF
   - **Fix:** Add Puppeteer to `download-cma` function
   - **OR:** Use a PDF service like PDFShift/DocRaptor

2. **Maps:** No proximity map on Page 1 yet
   - **Fix:** You'll add Mapbox when ready (60sec signup)

3. **Saved CMAs:** Not persisted to database
   - **Fast-follow:** Add `cmas` table to store results

4. **File Upload Limits:** Edge functions have size limits
   - **If needed:** Use Supabase Storage for large PDFs

---

## Testing the AI Pipeline

### Sample CMA Generation Flow

1. **Login/Signup** → Create account
2. **Profile Setup** → Add name/phone
3. **Launch CMA Generator** → Click card
4. **Subject Property:**
   - Upload MLS PDF OR enter manually
   - Add update notes
5. **Upload Comps:** 2 PDFs (comps + competition)
6. **Wait 30-60s** → AI extracts + analyzes
7. **Review Results** → See value + narrative
8. **Download PDF** → Opens HTML preview

### Testing with Real PDFs

Use actual MLS sheets from NCRMLS to verify:
- ✅ Address extraction
- ✅ Price parsing
- ✅ Feature detection (pool, ADU, etc.)
- ✅ Adjustment calculations
- ✅ Market narrative quality

---

## Cost Estimates

### Anthropic API (Phase 3-4)
- ~$0.25-0.50 per CMA (3 Claude API calls)
- At 10 CMAs/day = ~$5/day = $150/month

### Supabase (Free tier covers most)
- Auth: Unlimited
- Database: 500MB free
- Edge Functions: 500K invocations/month free

### Hosting (Vercel/Netlify)
- Free tier works for early usage

**Total estimated monthly cost: $150-200 for moderate use**

---

## Next Steps

1. **Deploy & test** with this guide
2. **Generate 3-5 CMAs** with real data
3. **Verify accuracy** of adjustments
4. **Report any issues** found
5. **Add PDF rendering** when needed
6. **Add Mapbox** in Phase 5 complete

---

Built by Hermes (Claude Code)  
June 6, 2026
