# BJT Pro — Japanese Letter → Nepali Explainer

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2FLearnFromSiran%2FBJT-Pro&env=OPENAI_API_KEY,GOOGLE_VISION_API_KEY&envDescription=Keys%20for%20OCR%20(Google%20Vision)%20and%20AI%20(OpenAI)&envLink=https%3A%2F%2Fgithub.com%2FLearnFromSiran%2FBJT-Pro%2Fblob%2Fmain%2F.env.example&project-name=bjt-pro&repository-name=bjt-pro)

> **Deploy a live, shareable app:** see [DEPLOY.md](./DEPLOY.md) for step-by-step
> Vercel setup. The app also runs in **demo mode** with no keys at all.

Upload a photo of a Japanese letter and get, in under a minute:

- **What it means** in plain Nepali (or Japanese / English)
- **What you must do** — concrete action items
- **By when** — extracted deadlines
- **What happens if ignored** — risk flags
- **An optional polite Japanese reply** you can copy and send

Built for the ~300k Nepali residents in Japan who can manage daily life but
struggle with dense, time-sensitive official mail (residence tax, national
health insurance, pension, immigration, school/daycare, utilities).

> ⚠️ Not legal advice. The app is designed to be **cautious, not magical** — it
> always shows a confidence score, highlights uncertainty, surfaces the original
> Japanese source fields, and escalates risky cases to human review.

## Tech stack

| Layer | Choice |
|---|---|
| Web app | Next.js 14 (App Router) + TypeScript + Tailwind, phone-first |
| OCR | Google Cloud Vision `DOCUMENT_TEXT_DETECTION` (ja/ne hints) |
| AI pipeline | OpenAI — classify → extract → explain → reply (strict JSON) |
| Confidence | Deterministic + model-derived blend with rule validation |
| Data (prod) | Supabase (Postgres + Auth + Storage + RLS), Tokyo region |
| History (MVP) | Browser localStorage (no backend required to run) |

The pipeline is a small, inspectable sequence (not one opaque prompt):

```
Upload → quality/downscale → OCR → classify → extract (grounded facts)
       → explain (Nepali) → rule validate → confidence score → result UI
                                              ↘ retake / human review
```

## Quick start

```bash
npm install
cp .env.example .env.local   # optional — app runs in DEMO MODE without keys
npm run dev                  # http://localhost:3000
```

### Demo mode (zero config)

With **no API keys**, the app runs in demo mode: tap **"Try a sample letter"**
on the home screen to see the full flow (classification, Nepali explanation,
deadline/amount extraction, confidence, reply draft) on synthetic letters
modeled on real Japanese notice types.

### Live mode

Add keys to `.env.local` to enable real OCR + AI on your own photos:

```
OPENAI_API_KEY=sk-...
GOOGLE_VISION_API_KEY=...
```

Optionally add Supabase keys (`NEXT_PUBLIC_SUPABASE_URL`, etc.) and apply
`supabase/migrations/0001_init.sql` to enable accounts, server-side storage,
and the human-review queue with Row Level Security.

## Project structure

```
src/
  app/
    page.tsx              # screen state machine (welcome→review→…→result)
    layout.tsx, globals.css
    api/
      analyze/route.ts    # OCR → classify → extract → explain → confidence
      reply-draft/route.ts
      human-review/route.ts
      config/route.ts     # tells client if demo mode is active
  components/              # Welcome, Review, Processing, Result, Reply, History…
  lib/
    pipeline.ts           # live + demo orchestration
    ocr.ts                # Google Vision adapter
    openaiClient.ts       # OpenAI JSON-mode helper
    prompts.ts            # classify / extract / explain / reply templates
    schemas.ts            # zod validation of LLM JSON
    confidence.ts         # weighted confidence + rule validation
    extractHeuristics.ts  # regex dates (令和) + amounts (円)
    demo.ts               # synthetic sample letters + ideal outputs
    docTypes.ts, i18n.ts, types.ts, historyStore.ts
supabase/migrations/0001_init.sql   # schema + RLS + storage policies
```

## Confidence model

```
overall = 0.35*ocr + 0.20*classification + 0.20*extraction_completeness
        + 0.15*rule_validation + 0.10*self_consistency
```

- **Green** (≥0.85) — show normally
- **Amber** (0.65–0.84) — show with "verify Japanese source" banner
- **Red** (<0.65) — recommend retake or human review
- A normally-deadline-bearing document with **no detected deadline** is forced
  to at least Amber and never claims a date it didn't find.

## Privacy

Privacy-first per Japan's APPI: explicit upload consent, short default
retention, no storage of original images in the MVP (history keeps only the
derived result locally), and a one-tap delete in History. Disclose cloud/AI
subprocessors before broad launch and get a short legal review of consent and
overseas-transfer wording.

## License

MIT — Author: LearnFromSiran
