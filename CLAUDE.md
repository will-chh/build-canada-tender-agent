# CLAUDE.md — Project Context for Claude Code

## Project
**Build Canada — Tender Match & Bid Assistant**
Hackathon project. Helps Canadian small businesses find, understand, and bid on government tenders (primarily from CanadaBuys). AI-powered.

## Stack
- **Frontend:** React + Vite + Tailwind CSS + shadcn/ui → `/client`
- **Backend:** Express.js on Node.js → `/server`
- **Database:** Supabase (PostgreSQL + pgvector extension)
- **AI:** Anthropic Claude API (Sonnet model) via `@anthropic-ai/sdk`
- **Deployment:** Vercel (frontend), Railway or Render (backend)

## Repo Structure
```
/client          → React frontend (Vite + Tailwind + shadcn/ui)
/server          → Express.js backend (API routes + Claude integration)
/server/db       → Database schema, seed scripts, Supabase client config
CLAUDE.md        → This file
```

## Core Features (MVP — build in this order)
1. **Business Profile Intake + Tender Matching** — User creates a company profile (NAICS codes, capabilities, province, certifications). System matches them to relevant tenders via NAICS overlap and/or vector similarity.
2. **RFP Plain Language Summarizer** — User clicks a tender → Claude reads the solicitation and returns a plain-English summary: what they want, deadlines, mandatory forms, evaluation criteria, disqualification risks.
3. **Buy Canadian Eligibility Checker** — Questionnaire (located in Canada? files taxes with CRA? Canadian content %?) → pass/fail with explanation from Claude.
4. **Forms Checklist & Tracker** — Each tender has mandatory forms. Display them as a checklist with status tracking (not started / in progress / done).
5. **Bid Draft Assistant** — Claude generates a proposal outline using the company profile + tender details.

## API Routes (Express.js — /server)
- `POST /api/profile` — create business profile
- `GET /api/profile/:id` — get profile
- `GET /api/tenders` — list tenders (optional NAICS filter)
- `POST /api/tenders/match` — match tenders to a profile
- `POST /api/summarize` — AI summarize a tender
- `POST /api/buy-canadian-check` — eligibility check
- `GET /api/tenders/:id/forms` — get forms checklist
- `PATCH /api/forms/:id` — update form status
- `POST /api/bid-draft` — generate bid draft

## Frontend Pages (React — /client)
1. Landing page — hero + CTA
2. Profile setup — multi-step form
3. Dashboard — matched tender cards
4. Tender detail — summary + Buy Canadian checker + forms checklist
5. Bid draft view — AI-generated proposal outline

## Database Tables (Supabase/PostgreSQL)
- `profiles` — company info, NAICS codes, capabilities, province
- `tenders` — title, description, department, closing_date, NAICS codes, embedding (vector)
- `form_checklists` — tender_id, form_name, is_mandatory, status

## Environment Variables
```
ANTHROPIC_API_KEY=
SUPABASE_URL=
SUPABASE_ANON_KEY=
```

## Design
- Accent color: Canadian red (#DC2626)
- Clean, minimal, professional
- shadcn/ui components throughout

## Constraints
- 10-hour hackathon build
- 2 teammates: one frontend, one backend
- MVP only — no auth, no live scraping, seeded tender data is fine
- Prioritize demo flow: Profile → Matched Tenders → Click Tender → AI Summary → Buy Canadian Check → Forms Checklist
