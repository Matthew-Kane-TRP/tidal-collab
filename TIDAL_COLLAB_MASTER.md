# TIDAL COLLAB — MASTER BUILD DOCUMENT (CMA Generator, Tool #1)

> Hermes: this is the single source of truth for the Tidal Collab project.
> Save this file to your working directory and commit it to memory. Read it in
> full before doing anything. It contains everything: how to build, the full
> project spec, and the complete branding standards. There is no other file to
> wait for except the logo image (`tidal_logo.svg`), which is provided separately
> as an attachment — save it to assets/tidal_logo.svg.

-----

## 0. HOW TO BUILD THIS (read first)

You are building an internal real-estate tool platform for Tidal Realty Partners.
Build it in six phases, in order. After each phase: **STOP, report what you did,
and wait for my explicit "go" before starting the next phase.** Do not chain phases.
Do not run unattended across a phase boundary.

**Two phases are non-negotiable verification gates — do NOT proceed past them until
I personally confirm:**

- Phase 3 (AI parsing) — I will check the extracted JSON against real MLS sheets.
- Phase 4 (adjustment math) — I will review the actual numbers on a real comp set.

These two feed a document that goes in front of home sellers and competing agents.
Wrong-but-confident output here is the main risk in the whole project. Accuracy
beats speed at these two gates.

Operating rules:

1. One phase at a time; stop and report; wait for my "go."
1. Before writing code in a phase, propose your approach/structure and let me approve.
1. Commit to git after each verified phase so we can roll back.
1. For anything involving the Anthropic API, look up current details live at
   docs.claude.com — do NOT rely on memory or hardcode a guessed model name.
1. Enforce the naming rule (Section 8) on every visible surface.
1. If I say nothing about the next phase, do not start it. Ask.

The six phases (full detail in Section 6):

- Phase 0 — Foundations / infra (mostly mine to set up; you advise)
- Phase 1 — Platform shell (PWA, branding, auth, tool launcher)
- Phase 2 — CMA intake flow (subject + two PDF uploads)
- Phase 3 — AI parsing layer ⚠ VERIFY GATE
- Phase 4 — Adjustment engine ⚠ VERIFY GATE
- Phase 5 — 3-page PDF render + download

When a session resumes later, re-read this file from your working directory, tell me
the last verified phase, and wait for my go.

-----

## 1. WHAT WE'RE BUILDING

Tidal Collab — an internal, installable (PWA) web platform for the agents of
Tidal Realty Partners (Wilmington, NC). It is a launcher for multiple AI tools.
The first tool is the CMA Generator. The platform foundation (auth, branding,
backend, AI plumbing) is built ONCE and shared by every future tool.

Future tools (DO NOT build now, but architect so they slot in cleanly):
Listing Presentation Generator, Listing Description Writer, Showing Feedback
Summarizer, Buyer/Seller Doc Prep. Each is a self-contained module under a shared shell.

Phone-first. Agents use this on their phones at/after listing appointments.
Installable to home screen, works like a native app.

-----

## 2. ARCHITECTURE

The AI is the engine, the app is the product. Agents never see a chat box.
They see forms and a finished document.
Tidal Collab
├── Shared foundation (build once)
│   ├── PWA shell (manifest + service worker, installable, phone-first)
│   ├── Branding layer (reads the tokens in Section 7; TRP look & feel)
│   ├── Auth (agent login — NOT public; protects API spend)
│   ├── Backend (holds Anthropic API key SERVER-SIDE; makes all AI calls)
│   └── Home screen = tool launcher (cards for each tool)
├── Tool 1: CMA Generator   ← BUILD NOW
└── Tool 2+ ...             ← later, slot into the shell

### Critical security rule

The Anthropic API key lives server-side only — in the backend / serverless
function / environment variable. It is NEVER shipped to the frontend PWA. All AI
calls route: PWA → backend → Anthropic API → back. If the key is ever in client
code, it leaks and gets abused. Non-negotiable.

### Recommended stack (propose equivalents if you have a strong reason)
- Frontend: React PWA (Vite), Inter + Playfair Display via Google Fonts.
- Backend: lightweight Node/serverless (or Supabase Edge Functions). Holds the
  API key, exposes a few endpoints the PWA calls.
- Auth + storage: Supabase (Postgres + auth) is the fast path. v1 needs login;
  saved CMAs can be a fast-follow but design the schema for it now.
- AI: Anthropic Claude API, Claude Opus (current top model) for parsing and
  analysis. Confirm the exact current model string from docs.claude.com at build time.
- PDF generation: server-side (headless-Chrome/Puppeteer HTML→PDF, or a PDF lib).
  The 3-page CMA is rendered from OUR templates, not by the AI.

### Anthropic API specifics (verify live at docs.claude.com)

- Endpoint: standard Messages API.
- The API can read PDFs natively via document content blocks — use this for the
  uploaded PDFs. (Confirm current document-support limits/format.)
- Request structured JSON back (instruct the model to return ONLY valid JSON for
  the parse and analysis steps; our code parses and controls all rendering).
- Cost note: fine to run everything on Opus for v1. Later optimization: route raw
  PDF text extraction to a cheaper/faster model (e.g., Haiku) and keep Opus for the
  adjustment reasoning + narrative. Do NOT optimize on day one.

-----

## 3. THE CMA GENERATOR — EXACT WORKFLOW

### Step 1 — Subject property intake

Two ways to provide the subject, agent picks one:

- (a) Upload the subject's MLS sheet (PDF) from a prior/recent listing, OR
- (b) Manual entry if never listed.

Manual-entry fields (also the fields parsed from the MLS sheet in path a):

- Address (required — used for the map)
- Year built
- Lot size (acres or sqft — capture units)
- Bedrooms
- Bathrooms (support half-baths, e.g., 2.5)
- Heated square footage
- Quality/condition rating 1–10 (agent's judgment)
- Pool (y/n + type)
- Other bonuses (free text + quick-tags: ADU, whole-home generator, new roof/HVAC,
  renovated kitchen/bath, waterfront, dock, solar, etc.)

**Regardless of path: the agent MUST be able to note changes/updates made to the
home since any prior listing**, so value is assigned correctly. Show a required
"Updates & condition notes since last listing" field. This text is fed to the AI as
subject context.

### Step 2 — Upload comps

Agent uploads a single PDF containing all comparable (sold) properties being used.

### Step 3 — Upload active competition

Agent uploads a single PDF of the active competition (currently-listed homes).

### Step 4 — AI parse (backend → Claude API)

For the comps PDF and competition PDF, extract per property into structured JSON:

- Address, sold price (comps) or list price (competition), heated sqft, beds, baths,
  year built, lot size, days on market (DOM), latitude/longitude if derivable
  (else geocode by address), and the full listing description text.
- From each listing description, extract bonus/feature flags: newly updated/
  renovated, pool, ADU/guest house, whole-home generator, new roof/HVAC, waterfront/
  water access, dock, solar, oversized lot, etc. These drive adjustments and notes.

### Step 5 — AI analysis & adjustment engine (the core)

Leading indicator: average price per heated square foot of the comps. Then adjust
each comp to be on par with the subject. Adjustments (computed from comp-set averages
where noted), at minimum for:

- Square footage — value the subject's sqft using the comp-set $/sqft. The spine.
- Lot size — adjust based on the comp-set's implied $/acre (or $/sqft of land) average.
- Bedroom count — adjust vs. comp-set average bedroom count.
- Bathroom count — adjust vs. comp-set average bath count.
- Year built — adjust for age difference vs. comp-set average (newer = premium).
- Condition/quality (1–10) — adjust toward the subject's rating.
- Bonuses — line-item add/subtract for pool, ADU, generator, updates, waterfront,
  etc., based on what the descriptions reveal each comp has vs. the subject.

Method: price-per-sqft spine + line-item add/subtracts for the factors above.
For each comp, output: original price, each adjustment (labeled, +/- dollar amount,
one-line rationale), adjusted price, and a short notes line capturing the key
description findings (e.g., "newly renovated kitchen; whole-home generator; DOM 7").

Output a defensible subject value / suggested price range derived from the
adjusted comps, with a short narrative explaining the recommendation (this is what
wins the listing appointment — the story, not just the number).

Return ALL of this as structured JSON our code renders. Do not let the AI draw the document.

### Step 6 — Render the 3-page CMA (our templates, TRP-branded)

Client-facing → branded Tidal Realty Partners (logo, navy/blue, Playfair titles),
NOT "Tidal Collab." Include EHO + brokerage footer (Section 7).

- Page 1 — Subject & proximity. Subject property summary (address, key stats,
  photo if available) and a **map showing the subject and the comparable homes'
  proximity** to it. Clean hero/title in Playfair.
- Page 2 — Comp adjustment chart. A table/chart showing **each comp, its
  adjustments** (per factor), original → adjusted price, and days on market.
  Special notes for each property at the bottom, surfacing description findings
  (newly updated, pools, ADUs, whole-home generators, etc.). End with the subject's
  suggested value/range and the narrative.
- Page 3 — Active competition. The active competition presented **in the same
  manner** as page 2 (same table/notes/DOM treatment) so the seller sees what they're
  competing against right now.

Export to PDF; agent downloads it. Show a clear "Download CMA" button when generation
finishes. No email/auto-send in v1. (Saved CMA history = fast-follow.)

-----

## 4. MARKET-TONE NOTE (for any AI-written narrative)

This is NOT the 2021–2025 market. Inventory is high and climbing, buyers are
rate-sensitive, listings sit. Narrative should reflect pricing realism and urgency —
DOM and active competition matter. Avoid frothy "it'll sell instantly" language.
Confident, data-driven, realistic.

-----

## 5. COMPLIANCE GUARDRAILS (build in from day one)

- CMA is an agent tool, not an automated appraisal. The agent reviews and owns
  the final number. Put a line on the document: prepared by [agent], not an appraisal.
- Keep the agent in control of comp selection and the condition rating.
- Include Equal Housing Opportunity + brokerage licensing on client-facing output.
- Do not auto-send anything to clients; agent downloads/shares deliberately.

-----

## 6. BUILD PHASES (do in order; verify each before moving on)

Phase 0 — Foundations (infra; mostly mine, you advise):
Team Google account owns everything → register Anthropic API account + key, domain
(tidalcollab.com), hosting, Supabase. API key goes in a backend env var. If anything
here is incomplete, tell me what you need before Phase 1.

Phase 1 — Platform shell: React PWA, installable, phone-first. Branding layer
from Section 7 (colors, fonts, logo). Agent auth/login. Home screen tool-launcher
with one card: "CMA Generator." Propose file structure + auth approach before coding.
VERIFY: looks like TRP, installs to phone, login works. STOP and report.

Phase 2 — CMA intake: Subject intake (manual + MLS-sheet-PDF path), updates/
condition notes field, then the two upload steps (comps PDF, competition PDF). No AI
parsing yet. VERIFY: data + files captured and sent to backend. STOP and report.

Phase 3 — AI parse ⚠ VERIFY GATE: Backend sends PDFs to Claude API, returns
structured JSON of comps + competition (incl. DOM and description feature-flags).
Look up current Messages API + PDF-support details from docs.claude.com first. Show
me the parsing prompt and JSON schema BEFORE building. VERIFY: I check the JSON
against a real sample PDF set by hand. Do NOT proceed to Phase 4 until I confirm.

Phase 4 — Adjustment engine ⚠ VERIFY GATE: Implement the $/sqft spine + line-item
adjustments (sqft, lot, beds, baths, year, condition, bonuses) → adjusted prices +
subject value/range + narrative, as structured JSON. Walk me through the full math on
ONE comp before finalizing. VERIFY: I review the real numbers on a real comp set.
Do NOT proceed to render until I confirm.

Phase 5 — 3-page render: TRP-branded server-side PDF: subject + proximity map /
adjustment chart + per-property notes + DOM / active competition (same format).
Render from our own templates, not the AI. "Download CMA" button at the end. Show me
the Page 1 layout before building all three. VERIFY: looks like a polished TRP
deliverable, exports cleanly.

Defer (design for, don't build): MLS (NCRMLS RESO) API integration, saved/shared
CMA history, handoff to Listing Presentation Generator. Design the DB schema now to
allow saved CMAs later. The MLS API will later add an alternate path to Phase 3
(pull-by-address instead of PDF upload) — keep the parse layer modular so it slots in.

-----

## 7. BRANDING STANDARDS (the platform must match Tidal Realty Partners)

Every tool MUST read its design tokens from this section so the whole platform stays
visually consistent with tidalrealtypartners.com.

### Colors (pulled from the live TRP site)

|Token            |Hex      |Use                                                  |
|-----------------|---------|-----------------------------------------------------|
|`--brand-blue`   |`#42A5D7`|Primary brand color. Buttons, links, accents, active.|
|`--brand-navy`   |`#091B34`|Headers, primary text, document title bars, footers. |
|`--brand-navy-2` |`#001F45`|Darker navy variant for gradients / depth.           |
|`--brand-blue-lt`|`#99CCE6`|Light blue — highlights, chips, chart fills.         |
|`--brand-slate`  |`#566E8F`|Secondary text, muted labels, captions.              |
|`--brand-wash`   |`#F2F6F8`|Page background, card backgrounds, table zebra.      |
|`--brand-mist`   |`#D7E3EA`|Borders, dividers, subtle separators.                |
|`--brand-white`  |`#FFFFFF`|Surfaces, cards, reversed text on navy/blue.         |

Semantic (status) colors — use sparingly, only for adjustment +/- and DOM signals:

|Token   |Hex      |Use                                  |
|--------|---------|-------------------------------------|
|`--pos` |`#5CB85C`|Positive adjustment (comp adj. up).  |
|`--neg` |`#D9534F`|Negative adjustment (comp adj. down).|
|`--warn`|`#F0AD4E`|High DOM / caution flags.            |

### Typography

Both are free Google Fonts. Load via Google Fonts CDN.

- Display / Headings: 'Playfair Display', serif — big titles and document
  headlines (mirrors the TRP site hero style). Weights 600/700.
- Body / UI / Data: 'Inter', system-ui, -apple-system, sans-serif — all
  interface text, forms, tables, numbers. Weights 400/500/600/700.
- Rule of thumb: Playfair for the title on a CMA page and major section headers;
  Inter for everything functional. Don't set body text or table data in Playfair.
font-family-display: 'Playfair Display', Georgia, serif;
font-family-body: 'Inter', system-ui, -apple-system, sans-serif;

### Logo

- Primary logo SVG provided separately — save to assets/tidal_logo.svg
  (wordmark, 152x39 viewBox, single-color path).
- For dark backgrounds (navy headers), render the logo in --brand-white.
- The PWA manifest name`/`short_name, the home-screen label, and the browser
  <title> all use "Tidal Realty Partners" — never "Tidal Collab."
- Backup logo files on the TRP site if needed:
  - Full color PNG: tidalrealtypartners.com/wp-content/uploads/2026/01/image-removebg-preview-1-1-1.png
  - White footer PNG: tidalrealtypartners.com/wp-content/uploads/2026/01/image-removebg-preview-1-1.png
- Clear space: keep at least the logo's cap-height of padding around it.
- On client-facing CMA documents, the TRP logo appears top-left of every page.

### Visual style (match the TRP site feel)

- Clean, airy, lots of white/wash space. Not busy.
- Navy and blue do the heavy lifting; light blue + wash for fills; slate for muted text.
- Cards with soft rounded corners (8–12px radius) and a very light shadow.
- Buttons: solid --brand-blue fill, white text, subtle hover darken; or navy.
- Data tables: navy header row, white text; --brand-wash zebra striping; --brand-mist borders.
- Avoid heavy gradients except subtle navy depth on document title bars.

### Firm / legal identity (for client-facing document footers)

- Tidal Realty Partners — a team brokered by Real Broker, LLC
- NC Firm License #C34379 · Matthew Kane, NC Broker #297432
- Equal Housing Opportunity
- 5215 Junction Circle, #200, Wilmington, NC 28412 · (910) 372-6720
- [info@tidalrealtypartners.com](mailto:info@tidalrealtypartners.com) · tidalrealtypartners.com

Always include "Equal Housing Opportunity" and the brokerage line on client-facing
CMA output. Build this compliance habit in from day one.

-----

## 8. NAMING RULE (enforce everywhere)

"Tidal Collab" is an internal codename and the domain (`tidalcollab.com`) ONLY.
It must appear NOWHERE visible. Everything a user or client sees is branded
"Tidal Realty Partners." The only legitimate place "tidalcollab" appears is the
URL in the browser address bar.

Keep the name out of all of these:

- PWA install name / home-screen icon label (use "Tidal Realty Partners")
- Any page title, header, footer, login screen, or home/launcher screen
- Browser tab title (`<title>`) and PWA manifest name`/`short_name
- Any generated document (CMA, etc.)
- Any loading screen, splash screen, toast, or error message

Two brand contexts, both branded Tidal Realty Partners:

- Platform UI — what agents log into at tidalcollab.com. Modern, clean, app-like.
- Client-facing output (CMAs) — includes the EHO + brokerage footer.

-----

## 9. CONFIRM LIVE AT BUILD TIME (don't trust memory)

- Current Anthropic model string + Messages API + PDF/document support → docs.claude.com
- Current API pricing → anthropic.com/pricing
- Geocoding/map provider for the proximity map (e.g., Mapbox / Google Maps) + its
  key, also stored server-side.