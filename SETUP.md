# Phase 1 Setup Instructions

## ✅ What's Done

- React PWA with TRP branding
- Auth flow (login → profile → home)
- Tool launcher home screen
- Git initialized + committed

## 🔧 What You Need to Do

### 1. Create Supabase Project

1. Go to https://supabase.com/dashboard
2. Click "New Project"
3. Name: `tidal-collab` (or anything you want)
4. Database Password: [SAVE THIS SOMEWHERE SAFE]
5. Region: Choose closest to Wilmington, NC
6. Wait ~2 minutes for provisioning

### 2. Run the Database Schema

1. In Supabase dashboard → SQL Editor
2. Copy the ENTIRE contents of `supabase/schema.sql`
3. Paste into SQL Editor
4. Click "Run"
5. You should see success messages

### 3. Get Your Credentials

1. In Supabase dashboard → Settings → API
2. Copy **Project URL** (looks like `https://abcdefgh.supabase.co`)
3. Copy **anon/public key** (long string starting with `eyJ...`)

### 4. Create .env File

```bash
cd ~/tidal-collab/frontend
cp .env.example .env
```

Then edit `frontend/.env`:

```
VITE_SUPABASE_URL=https://YOUR-PROJECT-REF.supabase.co
VITE_SUPABASE_ANON_KEY=eyJ...your-anon-key-here
```

Paste YOUR actual values from step 3.

### 5. Test It

```bash
cd ~/tidal-collab/frontend
npm run dev
```

Open http://localhost:3000

**Expected behavior:**
- See TRP logo + "Welcome Back" login screen
- Navy header, blue button
- Can click "Need an account? Sign up"
- Signup should work (check email for confirmation)

## 🐛 Troubleshooting

**"Invalid API key"**
→ Check .env file has correct URL and key (no quotes, no spaces)

**"Email not confirmed"**
→ Check spam folder, or disable email confirmation in Supabase dashboard:
  Authentication → Settings → Email Auth → Disable "Confirm email"

**Logo not showing**
→ Make sure `~/assets/tidal_logo.svg` exists and was copied to `frontend/src/assets/`

## ✋ STOP HERE

When you confirm:
- ✅ App loads at localhost:3000
- ✅ Branding looks like TRP (navy/blue, correct fonts)
- ✅ Login/signup works
- ✅ Profile setup appears after signup
- ✅ Home screen shows "CMA Generator" card

Then you can tell me **"Phase 1 verified, proceed to Phase 2"** and I'll build the CMA intake flow.

**Do NOT proceed to Phase 2 until you personally confirm this works.**

---

Built with ❤️ by Hermes  
June 6, 2026 — 9:54am
