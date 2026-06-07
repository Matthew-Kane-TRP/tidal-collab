# AI Lead Follow-Up Bot - Design Document

> **Status:** Planning / Not Yet Implemented  
> **Priority:** High - Game-changer for lead conversion  
> **Estimated Timeline:** 3-4 weeks to MVP

---

## 🎯 Vision

**Autonomous AI agent** that monitors Follow Up Boss CRM, reads lead context (source, tags, conversation history), and sends personalized follow-ups at optimal times based on lead segmentation.

**Goal:** Never let a hot lead go cold. Automate nurture while maintaining personal touch.

---

## 💡 Core Concept

Instead of generic drip campaigns, the AI:
1. **Reads** the lead's full context (tags, source, conversation history)
2. **Decides** if follow-up is needed based on rules
3. **Generates** personalized message using Claude AI
4. **Sends** via Follow Up Boss API (or queues for approval)
5. **Learns** from open/reply rates to improve

---

## 📋 Lead Segmentation Strategy

### ✅ RECOMMENDED: Tag-Based System

**Why tags over source:**
- More granular control
- Can combine multiple tags per lead
- Easy to add/remove as lead evolves
- You control the taxonomy

**Example Tag Taxonomy:**

**Buyer Intent:**
- `hot-buyer` - Ready to move now
- `warm-buyer` - Actively looking, 3-6 month timeline
- `cold-buyer` - Future interest, 6+ months
- `first-time-buyer` - Needs education & hand-holding

**Buyer Type:**
- `investor` - ROI-focused, analytical
- `luxury` - High-touch, premium service expected
- `relocating` - Needs area info, school districts
- `downsizing` - Different priorities than upsizing

**Seller Intent:**
- `listing-inquiry` - Considering selling
- `fsbo` - For Sale By Owner (needs agent value prop)
- `pre-listing` - House prep, staging advice

**Status:**
- `new-lead` - First 48 hours
- `nurture` - Long-term relationship building
- `past-client` - Repeat/referral potential

---

## 🧠 AI Communication Rules Engine

### Rule Structure

```javascript
{
  tag: 'hot-buyer',
  tone: 'responsive, helpful, proactive',
  frequency_hours: 24,  // Daily check-ins
  triggers: [
    {
      type: 'time_since_last_contact',
      threshold_hours: 48,
      action: 'send_checkin'
    },
    {
      type: 'email_opened_no_reply',
      threshold_hours: 24,
      action: 'send_followup'
    },
    {
      type: 'new_property_saved',
      threshold_hours: 0,  // Immediate
      action: 'send_showing_offer'
    }
  ],
  message_templates: [
    {
      scenario: 'checkin',
      max_length: 160,  // SMS-friendly
      tone: 'casual, friendly',
      prompt: 'Write a brief check-in asking if they want to see any new listings. Reference their saved properties if applicable.'
    },
    {
      scenario: 'showing_offer',
      max_length: 300,
      tone: 'enthusiastic, helpful',
      prompt: 'Notify them about their newly saved property. Highlight key features matching their criteria. Offer to schedule showing.'
    }
  ],
  content_focus: [
    'New listings matching criteria',
    'Price drops in their area',
    'Showing availability',
    'Market updates (inventory trends)'
  ]
}
```

### Example Rules Library

#### 1. Hot Buyer
```javascript
{
  tag: 'hot-buyer',
  tone: 'responsive, helpful, proactive',
  frequency_hours: 24,
  triggers: [
    'No contact in 48h',
    'Email opened but no reply in 24h',
    'New property saved',
    'Price drop on saved property'
  ],
  content: [
    'New listings matching criteria',
    'Showing availability (same-day/next-day)',
    'Market urgency (low inventory, competition)',
    'Price drop alerts'
  ],
  example_message: "Hi Sarah! Just saw 3 new listings hit the market in your price range. One on Oak Street has the home office you wanted. Free to see it tomorrow?"
}
```

#### 2. First-Time Buyer
```javascript
{
  tag: 'first-time-buyer',
  tone: 'educational, patient, reassuring',
  frequency_hours: 168,  // Weekly
  triggers: [
    'No contact in 1 week',
    'Asked question about process',
    'Saved property but no action in 3 days'
  ],
  content: [
    'Buying process explainers (step-by-step)',
    'Financing tips (pre-approval, down payment)',
    'Inspection/closing timelines',
    'Success stories from other first-timers'
  ],
  example_message: "Hey Mike! Wanted to share a quick guide on the home inspection process since you mentioned you weren't sure what to expect. It's way less scary than it sounds 😊 [link]"
}
```

#### 3. Investor
```javascript
{
  tag: 'investor',
  tone: 'analytical, data-driven, ROI-focused',
  frequency_hours: 336,  // Bi-weekly
  triggers: [
    'No contact in 2 weeks',
    'New investment property listed',
    'Price reduced on viewed property',
    'Cap rate > their threshold'
  ],
  content: [
    'Cap rate analysis',
    'Rental comps & cash flow projections',
    'Market trends (appreciation rates, rental demand)',
    'Off-market opportunities'
  ],
  example_message: "David - spotted a 4-unit on Market St. Listed at $425k, my analysis shows 7.2% cap rate at asking. Rents are $1,200/unit avg in that area. Want the full breakdown?"
}
```

#### 4. Cold Lead (Re-engagement)
```javascript
{
  tag: 'cold-lead',
  tone: 'warm, no-pressure, value-first',
  frequency_hours: 336,  // Weekly
  triggers: [
    'No contact in 1 week',
    'No activity in 30 days'
  ],
  content: [
    'Market updates (educational, not salesy)',
    'Neighborhood guides',
    'Homeownership tips',
    'Local events, community news'
  ],
  example_message: "Hi Jessica! No pressure, just wanted to share Wilmington's Q1 market report. Prices up 4% but inventory is finally increasing. Good news for buyers. Let me know if you want the full breakdown 📊"
}
```

#### 5. New Lead (First Contact)
```javascript
{
  tag: 'new-lead',
  tone: 'professional, welcoming, helpful',
  frequency_hours: 0,  // Immediate
  triggers: [
    'Lead created in FUB'
  ],
  content: [
    'Personal introduction',
    'How you can help',
    'Next steps',
    'Availability'
  ],
  example_message: "Hi Alex! Thanks for reaching out about homes in Wilmington. I'm Matthew with Tidal Realty Partners. I'd love to learn more about what you're looking for. Are you free for a quick call this week?"
}
```

#### 6. Luxury Buyer
```javascript
{
  tag: 'luxury',
  tone: 'sophisticated, consultative, white-glove',
  frequency_hours: 72,  // 3 days
  triggers: [
    'No contact in 72h',
    'New luxury listing ($500k+)',
    'Private showing request'
  ],
  content: [
    'Exclusive listings (pre-market, pocket)',
    'Market insights (high-end trends)',
    'Concierge services (inspector, designer referrals)',
    'Lifestyle amenities (schools, clubs, restaurants)'
  ],
  example_message: "Good afternoon Robert. I wanted to give you first look at a waterfront estate coming to market next week before it's publicly listed. 4,200 sqft, deep water dock, chef's kitchen. Private showing available Thursday if you're interested."
}
```

---

## 🏗️ System Architecture

### High-Level Flow

```
┌─────────────────────────────────────────────┐
│  FUB Monitor (Cron - every 15 min)          │
│  - Fetch leads with recent activity         │
│  - Identify new leads, replies, events      │
│  - Flag leads needing follow-up             │
└──────────────────┬──────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────┐
│  Lead Analyzer (AI)                         │
│  - Read full conversation history           │
│  - Extract tags, source, custom fields      │
│  - Calculate time since last contact        │
│  - Match to rule triggers                   │
│  - Determine if action needed               │
└──────────────────┬──────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────┐
│  Message Generator (Claude AI)              │
│  - Load appropriate rule & template         │
│  - Inject lead context:                     │
│    • Name, tags, conversation history       │
│    • Saved properties, budget, preferences  │
│    • Recent activity, opened emails         │
│  - Generate personalized message            │
│  - Respect tone, length, content focus      │
└──────────────────┬──────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────┐
│  Approval Queue (Optional)                  │
│  - Matthew reviews message before send      │
│  - Can approve, edit, or skip               │
│  - Auto-send mode available after trust     │
└──────────────────┬──────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────┐
│  FUB API - Send Message                     │
│  - POST /events (email or SMS)              │
│  - Logs in FUB timeline automatically       │
│  - Tracks delivery, opens, replies          │
└──────────────────┬──────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────┐
│  Analytics & Learning                       │
│  - Track open rates by tag/template         │
│  - Measure reply rates, meeting bookings    │
│  - A/B test message variants                │
│  - Refine prompts based on performance      │
└─────────────────────────────────────────────┘
```

---

## 💬 Message Generation Flow (Detailed)

### Example: Hot Buyer, No Reply for 48 Hours

**Step 1: Context Assembly**

```javascript
const leadContext = {
  name: 'Sarah Johnson',
  tags: ['hot-buyer', 'first-time-buyer'],
  source: 'Zillow',
  created_at: '2025-06-01',
  
  last_contact: {
    date: '2025-06-04',
    type: 'email',
    from: 'Matthew',
    message: 'Sent MLS sheets for 3 properties matching your criteria',
    opened: true,
    replied: false
  },
  
  conversation_history: [
    { date: '2025-06-01', role: 'lead', text: 'Looking for 3br house, under $350k, good schools' },
    { date: '2025-06-01', role: 'agent', text: 'Great! What area are you focusing on?' },
    { date: '2025-06-02', role: 'lead', text: 'Midtown or downtown Wilmington' },
    { date: '2025-06-03', role: 'agent', text: 'Got it. When are you hoping to move?' },
    { date: '2025-06-03', role: 'lead', text: 'ASAP, lease ends July 31st' }
  ],
  
  saved_properties: [
    { address: '123 Oak St', price: 325000, beds: 3, baths: 2 },
    { address: '456 Pine Ave', price: 340000, beds: 3, baths: 2.5 }
  ],
  
  preferences: {
    budget_max: 350000,
    bedrooms: 3,
    neighborhoods: ['Midtown', 'Downtown'],
    must_haves: ['good schools', 'home office space'],
    timeline: 'ASAP (lease ends July 31)'
  }
}
```

**Step 2: Rule Matching**

```javascript
// Match tag: 'hot-buyer'
const rule = rules.find(r => r.tag === 'hot-buyer')

// Check triggers
const hoursSinceContact = (now - leadContext.last_contact.date) / 3600000
// = 48 hours

const trigger = rule.triggers.find(t => 
  t.type === 'email_opened_no_reply' && 
  hoursSinceContact >= t.threshold_hours
)
// Matched: email_opened_no_reply (48h threshold)

// Select template
const template = rule.message_templates.find(t => 
  t.scenario === 'checkin'
)
```

**Step 3: Claude Prompt Construction**

```
You are Matthew Kane, a real estate agent with Tidal Realty Partners in Wilmington, NC.

LEAD CONTEXT:
Name: Sarah Johnson
Tags: hot-buyer, first-time-buyer
Timeline: ASAP (lease ends July 31st)
Budget: Up to $350k
Needs: 3 bedrooms, good schools, home office space
Areas: Midtown or Downtown Wilmington

RECENT ACTIVITY:
- 2 days ago: I sent her MLS sheets for 3 properties
- She opened the email but didn't reply
- She has 2 properties saved:
  • 123 Oak St ($325k, 3br/2ba)
  • 456 Pine Ave ($340k, 3br/2.5ba)

TASK:
Write a friendly, casual text message (under 160 characters) checking in with Sarah.

GUIDELINES:
- Reference the properties she saved
- Ask if she wants to see them this weekend
- Mention one feature that matches her needs (home office)
- Keep it light and helpful, not pushy
- Use her first name only

TONE: Friendly, helpful, proactive (not salesy)

OUTPUT: Just the message text, nothing else.
```

**Step 4: Claude Response**

```
Hi Sarah! Saw you checked out Oak St & Pine Ave. Want to tour them this weekend? Both have great home office setups 🏡
```

**Step 5: Approval (if enabled) or Send**

```javascript
// If approval mode:
await addToApprovalQueue({
  lead_id: leadContext.id,
  lead_name: 'Sarah Johnson',
  message: "Hi Sarah! Saw you checked out Oak St & Pine Ave...",
  reason: 'hot-buyer: email_opened_no_reply (48h)',
  status: 'pending'
})

// If auto-send mode:
await sendToFUB({
  person_id: leadContext.fub_id,
  type: 'sms',
  message: "Hi Sarah! Saw you checked out Oak St & Pine Ave...",
  log: true
})
```

---

## 🔧 Implementation Options

### Option A: Hermes Cron Job (Background Automation)

**Architecture:**
- Hermes cron job runs every 15 minutes on your Mac
- Reads rule config from Supabase
- Calls FUB API to fetch leads
- Generates messages via Claude
- Sends via FUB API or queues for approval

**Pros:**
- Leverage existing Hermes setup
- Powerful `execute_code` for complex logic
- Easy to debug locally
- Can access FUB API credentials from Keychain

**Cons:**
- Requires your Mac to stay on
- Not accessible to other team members
- Single point of failure (your machine)

**Setup:**
```bash
hermes cronjob create \
  --schedule "*/15 * * * *" \
  --name "fub-ai-followup" \
  --prompt "
    Execute the AI lead follow-up workflow:
    1. Read rules from Supabase (project: lmsvcvdmqqcbchvsmvzk, table: followup_rules)
    2. Fetch FUB leads via API (check leads updated in last 15 min + leads needing periodic follow-up)
    3. For each lead:
       - Analyze tags, conversation history, last contact time
       - Match to rule triggers
       - If action needed: generate personalized message via Claude
       - Add to approval queue (Supabase table: approval_queue)
    4. Log all activity to Supabase (table: followup_log)
  "
```

---

### Option B: Supabase Edge Function + External Cron Trigger

**Architecture:**
- Supabase Edge Function contains the logic
- External cron service (Zapier, GitHub Actions, or Supabase Cron) triggers every 15 min
- All state stored in Supabase (rules, logs, approval queue)
- Team configures via Tidal Collab web UI

**Pros:**
- Cloud-hosted (always running)
- Team-accessible (any agent can configure their rules)
- Scales to multiple agents
- Centralized logging & analytics

**Cons:**
- More complex setup (need cron trigger service)
- Supabase free tier has Edge Function limits (500K requests/month)

**Implementation:**

```typescript
// supabase/functions/fub-ai-followup/index.ts

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import Anthropic from 'https://esm.sh/@anthropic-ai/sdk@0.20.0'

serve(async (req) => {
  const anthropic = new Anthropic({
    apiKey: Deno.env.get('ANTHROPIC_API_KEY')
  })

  // 1. Fetch rules from Supabase
  const { data: rules } = await supabaseAdmin
    .from('followup_rules')
    .select('*')
    .eq('enabled', true)

  // 2. Fetch FUB leads needing attention
  const fubLeads = await fetchFUBLeads()

  // 3. Process each lead
  for (const lead of fubLeads) {
    const matchedRule = findMatchingRule(lead, rules)
    
    if (matchedRule && shouldFollowUp(lead, matchedRule)) {
      // 4. Generate message via Claude
      const message = await generateMessage(lead, matchedRule, anthropic)
      
      // 5. Add to approval queue
      await supabaseAdmin
        .from('approval_queue')
        .insert({
          lead_id: lead.id,
          lead_name: lead.name,
          generated_message: message,
          reason: `${matchedRule.tag}: ${matchedRule.trigger}`,
          status: 'pending'
        })
      
      // 6. Log activity
      await logActivity(lead, matchedRule, message)
    }
  }

  return new Response('OK', { status: 200 })
})
```

---

### Option C: Hybrid (RECOMMENDED)

**Best of both worlds:**

- **Configuration UI** → Tidal Collab website (React app)
  - Rule builder (drag-drop, forms)
  - Approval queue UI
  - Analytics dashboard
  - Rules stored in Supabase DB

- **Worker** → Hermes cron job (reads rules from Supabase, executes locally)
  - Faster iteration (no deploy cycle)
  - Access to local credentials (FUB API key in Keychain)
  - Can use powerful `execute_code` tool
  - Easy debugging

- **Future Migration Path** → Move worker to Supabase Edge Function when ready
  - Same rule DB, just change worker
  - No changes to frontend UI

**Why Hybrid:**
- Start fast (leverage Hermes you already have)
- Easy to configure (web UI, not editing cron command)
- Team-friendly (anyone can see pending messages)
- Future-proof (can migrate to cloud later)

---

## 📊 Data Model (Supabase Tables)

### 1. `followup_rules`

Stores AI communication rules by tag.

```sql
CREATE TABLE followup_rules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tag VARCHAR(100) NOT NULL UNIQUE,      -- 'hot-buyer', 'investor', etc.
  tone TEXT,                              -- 'professional', 'casual', 'analytical'
  frequency_hours INT,                    -- 24, 48, 168 (weekly), etc.
  enabled BOOLEAN DEFAULT true,
  
  -- Message templates (JSONB for flexibility)
  message_templates JSONB,
  -- Example:
  -- [
  --   {
  --     "scenario": "checkin",
  --     "max_length": 160,
  --     "prompt": "Write a brief check-in...",
  --     "tone": "casual"
  --   },
  --   { ... }
  -- ]
  
  -- Triggers that activate this rule (JSONB)
  triggers JSONB,
  -- Example:
  -- [
  --   {
  --     "type": "time_since_last_contact",
  --     "threshold_hours": 48,
  --     "action": "send_checkin"
  --   },
  --   { ... }
  -- ]
  
  -- Content focus areas (array)
  content_focus TEXT[],
  -- Example: ['New listings', 'Price drops', 'Market updates']
  
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_followup_rules_tag ON followup_rules(tag);
CREATE INDEX idx_followup_rules_enabled ON followup_rules(enabled);
```

---

### 2. `followup_log`

Activity log for all sent/queued messages.

```sql
CREATE TABLE followup_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Lead info
  lead_id VARCHAR(100),                   -- FUB person ID
  lead_name VARCHAR(255),
  lead_email VARCHAR(255),
  lead_phone VARCHAR(50),
  
  -- Rule & message
  tag VARCHAR(100),                       -- Which rule triggered this
  trigger_reason TEXT,                    -- 'email_opened_no_reply (48h)'
  message_text TEXT,                      -- Generated message
  message_type VARCHAR(20),               -- 'email', 'sms', 'call_note'
  
  -- Delivery tracking
  status VARCHAR(50),                     -- 'pending', 'sent', 'delivered', 'opened', 'replied', 'bounced', 'skipped'
  sent_at TIMESTAMP,
  opened_at TIMESTAMP,
  replied_at TIMESTAMP,
  
  -- FUB event ID (for linking back to FUB)
  fub_event_id VARCHAR(100),
  
  -- Metadata (JSONB for flexibility)
  metadata JSONB,
  -- Example:
  -- {
  --   "saved_properties": ["123 Oak St", "456 Pine Ave"],
  --   "conversation_length": 5,
  --   "days_since_created": 3
  -- }
  
  created_at TIMESTAMP DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_followup_log_lead_id ON followup_log(lead_id);
CREATE INDEX idx_followup_log_tag ON followup_log(tag);
CREATE INDEX idx_followup_log_status ON followup_log(status);
CREATE INDEX idx_followup_log_sent_at ON followup_log(sent_at DESC);
```

---

### 3. `approval_queue`

Pending messages awaiting review (if approval mode enabled).

```sql
CREATE TABLE approval_queue (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Lead info
  lead_id VARCHAR(100),
  lead_name VARCHAR(255),
  lead_tags TEXT[],                       -- ['hot-buyer', 'first-time-buyer']
  
  -- Generated message
  generated_message TEXT,
  message_type VARCHAR(20),               -- 'email' or 'sms'
  reason TEXT,                            -- Why this was generated
  
  -- Lead context snapshot (for reviewer)
  lead_context JSONB,
  -- Example:
  -- {
  --   "last_contact": "2 days ago",
  --   "saved_properties": [...],
  --   "conversation_preview": "Last 3 messages..."
  -- }
  
  -- Review tracking
  status VARCHAR(50) DEFAULT 'pending',   -- 'pending', 'approved', 'rejected', 'edited', 'sent'
  reviewed_by VARCHAR(100),               -- Agent who reviewed (if multi-agent)
  reviewed_at TIMESTAMP,
  
  -- If edited, store the edited version
  edited_message TEXT,
  
  created_at TIMESTAMP DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_approval_queue_status ON approval_queue(status);
CREATE INDEX idx_approval_queue_created_at ON approval_queue(created_at DESC);
```

---

### 4. `agent_preferences` (Future - Multi-Agent Support)

Store per-agent settings.

```sql
CREATE TABLE agent_preferences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  agent_id VARCHAR(100) NOT NULL UNIQUE,  -- FUB user ID
  agent_name VARCHAR(255),
  
  -- Approval settings
  auto_send_enabled BOOLEAN DEFAULT false,
  require_approval_for_tags TEXT[],       -- ['new-lead', 'luxury'] require approval even in auto mode
  
  -- Notification settings
  notify_on_reply BOOLEAN DEFAULT true,
  notify_on_bounce BOOLEAN DEFAULT true,
  notification_method VARCHAR(20),        -- 'email', 'sms', 'slack'
  
  -- Working hours (don't send outside these times)
  working_hours JSONB,
  -- Example:
  -- {
  --   "timezone": "America/New_York",
  --   "start": "09:00",
  --   "end": "18:00",
  --   "days": ["Mon", "Tue", "Wed", "Thu", "Fri"]
  -- }
  
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

---

## 🚀 MVP Features (Phase 1)

**Goal:** Prove the concept, build trust in AI-generated messages

**Timeline:** 2-3 weeks

### Features

1. **Manual Trigger Only** (no automated cron yet)
   - "Scan FUB Now" button in Tidal Collab
   - Fetches leads needing follow-up based on rules
   - Shows list of pending messages

2. **3 Pre-Built Tag Rules**
   - `hot-buyer` → Daily check-ins (48h no contact)
   - `new-lead` → Immediate welcome (within 1 hour)
   - `cold-lead` → Weekly re-engagement (7 days no contact)

3. **Email Only** (no SMS yet)
   - Send via FUB API (`POST /events`)
   - Simpler than SMS (no character limits, no carrier issues)

4. **Approval Required** (no auto-send)
   - Every message queued for Matthew's review
   - Can approve, edit, or skip
   - Builds trust before enabling auto-send

5. **Basic Analytics**
   - Messages sent (by tag)
   - Open rate (if FUB provides)
   - Reply rate

### UI Components (Tidal Collab)

#### Tool Card (Home Screen)

```
┌──────────────────────────────────────────────┐
│  🤖 AI Follow-Up Manager                     │
│  Automate lead nurture with personalized     │
│  messages based on tags & activity           │
│                                              │
│  [Coming Soon]                               │
└──────────────────────────────────────────────┘
```

#### Main Screen

```
┌──────────────────────────────────────────────┐
│  🤖 AI Follow-Up Manager                     │
│  ← Back to Tools                             │
└──────────────────────────────────────────────┘

📋 Active Rules (3)                    [+ Add Rule]
┌──────────────────────────────────────────────┐
│ 🔥 hot-buyer                          [Edit] │
│ ↳ Daily check-ins, proactive tone            │
│ ↳ 12 leads active                            │
│                                              │
│ 👋 new-lead                           [Edit] │
│ ↳ Immediate welcome, professional tone       │
│ ↳ 3 leads pending                            │
│                                              │
│ ❄️ cold-lead                          [Edit] │
│ ↳ Weekly re-engagement, warm tone            │
│ ↳ 47 leads active                            │
└──────────────────────────────────────────────┘

                    [Scan FUB Now]

📬 Pending Messages (5)              [Auto: OFF]
┌──────────────────────────────────────────────┐
│ Sarah Johnson (hot-buyer)                    │
│ Last contact: 2 days ago                     │
│ Opened email but didn't reply                │
│                                              │
│ Generated Message (SMS):                     │
│ ┌────────────────────────────────────────┐   │
│ │ Hi Sarah! Saw you checked out Oak St  │   │
│ │ & Pine Ave. Want to tour them this    │   │
│ │ weekend? Both have great home office  │   │
│ │ setups 🏡                              │   │
│ └────────────────────────────────────────┘   │
│                                              │
│ [✓ Approve & Send] [✏️ Edit] [⏭️ Skip]       │
└──────────────────────────────────────────────┘

┌──────────────────────────────────────────────┐
│ Mike Chen (new-lead)                         │
│ Created: 45 minutes ago                      │
│ Source: Website contact form                 │
│                                              │
│ Generated Message (Email):                   │
│ ┌────────────────────────────────────────┐   │
│ │ Subject: Welcome to Tidal Realty!     │   │
│ │                                        │   │
│ │ Hi Mike,                               │   │
│ │                                        │   │
│ │ Thanks for reaching out! I'm Matthew  │   │
│ │ with Tidal Realty Partners. I saw you │   │
│ │ mentioned looking for homes in the    │   │
│ │ Wilmington area.                      │   │
│ │                                        │   │
│ │ I'd love to learn more about what     │   │
│ │ you're looking for. Are you free for  │   │
│ │ a quick call this week?               │   │
│ │                                        │   │
│ │ Best,                                  │   │
│ │ Matthew                                │   │
│ └────────────────────────────────────────┘   │
│                                              │
│ [✓ Approve & Send] [✏️ Edit] [⏭️ Skip]       │
└──────────────────────────────────────────────┘

📊 Stats (Last 30 Days)
┌──────────────────────────────────────────────┐
│ Messages Sent: 127                           │
│ Open Rate: 68%                               │
│ Reply Rate: 24%                              │
│ Meetings Booked: 8                           │
│                                              │
│ Top Performing Tag: hot-buyer (32% reply)    │
└──────────────────────────────────────────────┘
```

#### Rule Builder (Add/Edit Rule)

```
┌──────────────────────────────────────────────┐
│  Edit Rule: hot-buyer                        │
│  ← Back to Rules                             │
└──────────────────────────────────────────────┘

Basic Settings
┌──────────────────────────────────────────────┐
│ Tag Name: hot-buyer                          │
│ Tone: [Proactive ▼]                          │
│ Check-in Frequency: [24 hours ▼]             │
│                                              │
│ Enabled: [✓] Active                          │
└──────────────────────────────────────────────┘

Triggers (When to send a message)
┌──────────────────────────────────────────────┐
│ [✓] No contact in 48 hours                   │
│ [✓] Email opened but no reply (24h)          │
│ [✓] New property saved                       │
│ [✓] Price drop on saved property             │
│ [ ] Lead asks question                       │
└──────────────────────────────────────────────┘

Content Focus (What to talk about)
┌──────────────────────────────────────────────┐
│ [✓] New listings matching their criteria     │
│ [✓] Showing availability                     │
│ [✓] Price drops                              │
│ [ ] Market trends                            │
│ [ ] Financing tips                           │
└──────────────────────────────────────────────┘

Message Templates
┌──────────────────────────────────────────────┐
│ Scenario: Check-in (no recent activity)      │
│ Max Length: [160 chars ▼] (SMS-friendly)     │
│                                              │
│ AI Instructions:                             │
│ ┌────────────────────────────────────────┐   │
│ │ Write a brief, friendly check-in.     │   │
│ │ Reference any properties they've saved.│   │
│ │ Ask if they want to schedule showings.│   │
│ │ Keep it casual and helpful.           │   │
│ └────────────────────────────────────────┘   │
│                                              │
│ [+ Add Another Template]                     │
└──────────────────────────────────────────────┘

                [Save Rule]  [Cancel]
```

---

## 🔮 Advanced Features (Phase 2+)

**Timeline:** Months 2-3

### 1. Auto-Send Mode

- **Enable after trust is built** (30+ approved messages)
- **Safety rails:**
  - Still queue certain tags for approval (e.g., `luxury`, `new-lead`)
  - Daily send limit (max 50 auto-sends/day)
  - Pause if bounce rate > 5%
  - Human review every Friday (weekly audit of sent messages)

### 2. SMS Support

- Send via FUB API or Twilio
- Respect carrier character limits (160 chars)
- Smart message splitting for longer content
- Emoji support (tested for deliverability)

### 3. Multi-Touch Sequences

Instead of one-off messages, create sequences:

```javascript
{
  tag: 'new-lead',
  sequence: [
    {
      day: 0,  // Immediate
      template: 'welcome',
      channel: 'email'
    },
    {
      day: 1,
      template: 'value_prop',
      channel: 'sms',
      condition: 'if email opened'
    },
    {
      day: 3,
      template: 'case_study',
      channel: 'email',
      condition: 'if not replied to day 1 sms'
    },
    {
      day: 7,
      template: 'last_chance',
      channel: 'sms',
      condition: 'if no activity'
    }
  ]
}
```

### 4. A/B Testing

- Create 2 message variants
- Send each to 50% of leads
- Track which performs better (open rate, reply rate)
- Auto-promote winner after statistical significance

### 5. Sentiment Analysis

- Analyze lead's last message for sentiment
- Adjust tone accordingly:
  - **Frustrated** → Empathetic, problem-solving
  - **Excited** → Match energy, move fast
  - **Confused** → Educational, patient
  - **Indecisive** → Consultative, options-focused

### 6. Smart Scheduling

- Don't send at 2am (respect working hours)
- Send at optimal time based on lead's past open behavior
- Example: If Sarah always opens emails at 9am, send then

### 7. Property Matching & Alerts

- Auto-suggest listings from MLS based on saved searches
- "New property just hit the market matching your criteria"
- Include link to listing, key stats, showing availability

### 8. Team Mode

- Multiple agents, each with their own rules
- Shared template library
- Performance leaderboard (who gets best reply rates)

### 9. Integration with Other Tools

- **Calendar:** "I have 3pm open Tuesday, want to tour Oak St?"
- **CMA Tool:** "I ran a CMA on that property you liked, worth $15k more than asking"
- **Market Snapshot:** "Inventory dropped 12% this month, here's what it means for you"

---

## 🎓 Best Practices & Guardrails

### Do's

✅ **Personalize every message** - Use lead's name, reference their saved properties, mention their timeline  
✅ **Respect frequency limits** - Don't spam (max 1 message/day for hot leads, 1/week for cold)  
✅ **Provide value** - Share market insights, new listings, helpful tips (not "just checking in")  
✅ **Match their communication style** - If they text, text back. If they email, email back.  
✅ **Track & learn** - Monitor what works, refine prompts based on reply rates  
✅ **Human review initially** - Approve all messages for first 2 weeks, then enable auto-send

### Don'ts

❌ **Never be pushy** - If lead asks for space, respect it (add `do-not-contact` tag)  
❌ **Don't send at odd hours** - Respect 9am-6pm working hours (configurable)  
❌ **Avoid generic templates** - "Just touching base" is useless, provide specific value  
❌ **Don't over-automate** - Some conversations need human judgment (negotiations, bad news)  
❌ **Never ignore unsubscribes** - Honor opt-out requests immediately  
❌ **Don't rely on AI for legal/contract stuff** - Keep AI for nurture, not contracts

### Safety Rails

🛡️ **Bounce Protection** - Pause auto-send if bounce rate > 5%  
🛡️ **Spam Filter Avoidance** - Vary message templates, avoid spam trigger words  
🛡️ **Consent Tracking** - Only message leads who opted in (FUB contact preferences)  
🛡️ **Daily Limits** - Max 50 auto-sends/day (prevents runaway if bug occurs)  
🛡️ **Human Escalation** - If lead mentions "lawyer", "complaint", "unsubscribe" → flag for manual review

---

## 📊 Success Metrics

### Primary KPIs

- **Reply Rate** - % of sent messages that get a reply (target: 20%+)
- **Meeting Booking Rate** - % that result in scheduled showing/call (target: 10%+)
- **Time to First Response** - How fast new leads get contacted (target: <1 hour)
- **Lead Reactivation Rate** - % of cold leads re-engaged (target: 5%+)

### Secondary Metrics

- Open rate (email only, target: 60%+)
- Bounce rate (target: <2%)
- Unsubscribe rate (target: <1%)
- Avg messages per conversion (lower = more efficient)

### Tag Performance

Track metrics by tag to identify:
- Which segments respond best
- Which message templates work
- When to send (time/day analysis)

Example dashboard:
```
Tag Performance (Last 30 Days)

hot-buyer:      32% reply rate, 15% meeting rate
new-lead:       28% reply rate, 8% meeting rate
cold-lead:      8% reply rate, 2% meeting rate
investor:       18% reply rate, 12% meeting rate
luxury:         45% reply rate, 25% meeting rate ⭐️
```

---

## 🤔 Open Questions (Need Your Input)

1. **Tags vs. Source:**
   - Should we use FUB tags or lead sources as primary segmentation?
   - **Recommendation:** Tags (more flexible)

2. **Approval Mode:**
   - Start with manual approval on every message?
   - Or trust AI from day 1 with safety rails?
   - **Recommendation:** Manual approval for first 2 weeks

3. **Communication Channel:**
   - Email only, SMS only, or both?
   - Let AI choose based on lead's preferred method?
   - **Recommendation:** Email for MVP, add SMS in Phase 2

4. **Team Scope:**
   - Just Matthew, or other TRP agents too?
   - If multi-agent, does each have their own rules, or shared?
   - **Recommendation:** Start with Matthew only, add team in Phase 2

5. **Worker Architecture:**
   - Hermes cron (local), Supabase Edge Function (cloud), or hybrid?
   - **Recommendation:** Hybrid (Hermes worker + Supabase config/logs)

6. **FUB API Rate Limits:**
   - What's the FUB API rate limit? (need to check docs)
   - How many leads in FUB total?
   - **Action Item:** Research FUB API limits

---

## 📝 Next Steps

### To Build MVP (Phase 1):

1. **Week 1: Data & Config Setup**
   - Create Supabase tables (`followup_rules`, `approval_queue`, `followup_log`)
   - Seed 3 initial rules (`hot-buyer`, `new-lead`, `cold-lead`)
   - Build FUB API helper functions (fetch leads, send message, read history)

2. **Week 2: Message Generation Engine**
   - Build Claude prompt templates for each tag
   - Test message generation locally (sample leads)
   - Refine prompts until quality is high

3. **Week 3: Tidal Collab UI**
   - Create "AI Follow-Up Manager" tool card
   - Build "Scan FUB Now" button + pending messages list
   - Build approval queue UI (approve/edit/skip)
   - Wire to Supabase

4. **Week 4: Hermes Worker**
   - Build Hermes cron job to:
     - Read rules from Supabase
     - Fetch FUB leads
     - Generate messages
     - Queue for approval
   - Test end-to-end flow

5. **Week 5: Testing & Refinement**
   - Run in approval mode for 1-2 weeks
   - Tune prompts based on what you approve/reject
   - Track metrics (reply rate, meeting bookings)
   - Document learnings

6. **Week 6: Auto-Send (Optional)**
   - Enable auto-send for trusted tags
   - Keep manual approval for `new-lead` and `luxury`
   - Monitor daily for first week

---

**End of Design Document**

*This document should be updated as features are built and learnings are captured. Treat it as a living spec for the AI Follow-Up system.*
