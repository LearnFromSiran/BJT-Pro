# Deploying BJT Pro to Vercel

This makes the app **live on a shareable URL** where users can upload their own
Japanese letters and get real Nepali explanations.

You'll need three things (all have free tiers to start):

1. A **Vercel** account — https://vercel.com/signup (sign in with GitHub)
2. An **OpenAI API key** — https://platform.openai.com/api-keys
3. A **Google Cloud Vision API key** — see step 3 below

---

## One-click deploy

Click the button, sign in with GitHub, and Vercel will clone the repo and ask
for the environment variables:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2FLearnFromSiran%2FBJT-Pro&env=OPENAI_API_KEY,GOOGLE_VISION_API_KEY&envDescription=Keys%20for%20OCR%20(Google%20Vision)%20and%20AI%20(OpenAI)&envLink=https%3A%2F%2Fgithub.com%2FLearnFromSiran%2FBJT-Pro%2Fblob%2Fmain%2F.env.example&project-name=bjt-pro&repository-name=bjt-pro)

> Tip: if the app deploys **without** keys, it still runs in **demo mode**
> (sample letters work). Add the keys to unlock real photo upload + AI.

---

## Step-by-step (manual import)

### 1. Import the repo
- Go to https://vercel.com/new
- Pick **LearnFromSiran/BJT-Pro** → **Import**
- Framework preset auto-detects **Next.js**. Leave build settings default
  (`next build`, output handled automatically).

### 2. Add the OpenAI key
- In the import screen, open **Environment Variables** and add:
  - `OPENAI_API_KEY` = your `sk-...` key
  - (optional) `OPENAI_MODEL` = `gpt-4o-mini`
  - (optional) `OPENAI_FALLBACK_MODEL` = `gpt-4o`

### 3. Add the Google Vision key
- In Google Cloud Console: create/select a project →
  **APIs & Services** → enable **Cloud Vision API** →
  **Credentials** → **Create credentials** → **API key**.
- Restrict the key to the Vision API (recommended).
- Add to Vercel:
  - `GOOGLE_VISION_API_KEY` = your key

### 4. Deploy
- Click **Deploy**. In ~1–2 minutes you get a live URL like
  `https://bjt-pro.vercel.app` — **this is the link you share with users.**

### 5. (Optional) Custom domain
- Project → **Settings → Domains** → add e.g. `bjtpro.com` and follow the DNS
  steps. Good for trust with users.

### 6. (Optional) Accounts + saved history (Supabase)
- Create a Supabase project in **Tokyo (ap-northeast-1)**.
- Run `supabase/migrations/0001_init.sql` in the Supabase SQL editor.
- Add to Vercel: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`,
  `SUPABASE_SERVICE_ROLE_KEY`.
- Until then, history is kept locally in each user's browser.

---

## Costs (rough, official list pricing)
- **Google Vision** Document Text Detection: first **1,000 pages/month free**,
  then **$1.50 / 1,000**.
- **OpenAI** `gpt-4o-mini`-class: a few dollars per ~hundreds of letters.
- **Vercel**: Hobby (free) is fine to start; Pro is $20/mo with spend controls.

Set a **spend limit** in both OpenAI and Vercel before sharing widely.

---

## Updating the live app
Every push to `main` auto-deploys. Open a PR, merge it, and Vercel ships it.
