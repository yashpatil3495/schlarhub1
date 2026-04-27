# 🚀 ScholarHub Backend Setup Guide

Follow these steps **in order** to get the full backend running.

---

## Step 1 — Create a Supabase Project (free)

1. Go to [supabase.com](https://supabase.com) and click **"Start your project"**
2. Sign in with GitHub
3. Click **"New Project"**
4. Fill in:
   - **Name:** `scholarhub`
   - **Database Password:** choose a strong password (save it!)
   - **Region:** `South Asia (ap-south-1)` ← best for India
5. Click **"Create new project"** — wait ~2 minutes

---

## Step 2 — Run the Database Schema

1. In your Supabase dashboard, click **"SQL Editor"** in the left sidebar
2. Click **"New query"**
3. Open `supabase/migrations/001_schema.sql` from this project
4. Paste the entire file contents into the editor
5. Click **"Run"** — you should see "Success. No rows returned"
6. Repeat with `supabase/migrations/002_seed.sql` to load sample data

---

## Step 3 — Set Up Storage Bucket

1. In Supabase dashboard, click **"Storage"** in the left sidebar
2. Click **"New bucket"**
3. Name it: `documents`
4. **Uncheck** "Make bucket public" (keep it private for security)
5. Click **"Create bucket"**
6. Click on the `documents` bucket → **"Policies"** tab
7. Click **"New Policy"** → choose **"For full customization"**

Add these 3 policies (one by one):

**Policy 1 — Upload:**
```sql
CREATE POLICY "Users upload own docs"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'documents' AND
  auth.uid()::text = (storage.foldername(name))[1]
);
```

**Policy 2 — Read:**
```sql
CREATE POLICY "Users read own docs"
ON storage.objects FOR SELECT
USING (
  bucket_id = 'documents' AND
  auth.uid()::text = (storage.foldername(name))[1]
);
```

**Policy 3 — Delete:**
```sql
CREATE POLICY "Users delete own docs"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'documents' AND
  auth.uid()::text = (storage.foldername(name))[1]
);
```

---

## Step 4 — Enable Google OAuth (optional but recommended)

1. In Supabase dashboard → **"Authentication"** → **"Providers"**
2. Find **Google** and click it
3. Toggle it **enabled**
4. Go to [console.cloud.google.com](https://console.cloud.google.com)
5. Create a new project → **"APIs & Services"** → **"Credentials"**
6. Click **"Create Credentials"** → **"OAuth client ID"**
7. Application type: **Web application**
8. Add to Authorized redirect URIs:
   ```
   https://your-project-id.supabase.co/auth/v1/callback
   ```
9. Copy the **Client ID** and **Client Secret** back to Supabase

---

## Step 5 — Set Up Resend SMTP (eliminates email rate limits)

Supabase's free tier limits magic-link / OTP emails to **4/hour globally**.
Connecting your own SMTP removes this limit entirely. **Resend is free (3,000 emails/month).**

1. Sign up at [resend.com](https://resend.com) — free, no credit card
2. Go to **API Keys → Create API Key** → copy your key (`re_xxxxxxxxxxxx`)
3. *(Optional but recommended)* Go to **Domains → Add Domain**, add your domain (e.g. `scholarhub.in`)
   and add the DNS records they provide. Without this, emails send from `onboarding@resend.dev`.
4. In your Supabase dashboard → **Authentication → SMTP Settings**
5. Toggle **Enable Custom SMTP** ON and fill in:

   | Field          | Value                          |
   |---------------|-------------------------------|
   | Host           | `smtp.resend.com`              |
   | Port           | `465`                          |
   | Username       | `resend`                       |
   | Password       | your Resend API key            |
   | Sender name    | `ScholarHub`                   |
   | Sender email   | `noreply@yourdomain.com`       |

6. Click **Save** → **Send Test Email** to confirm it works
7. Go to **Authentication → Rate Limits → Email rate limit** and set it to `100`

> **No code changes needed for this step.** The OTP flow in the app will automatically
> use your new SMTP settings.

---

## Step 6 — Get Your API Keys

1. In Supabase dashboard → **"Settings"** → **"API"**
2. Copy:
   - **Project URL** → this is your `VITE_SUPABASE_URL`
   - **anon / public key** → this is your `VITE_SUPABASE_ANON_KEY`

---

## Step 7 — Configure Your .env File

```bash
cp .env.example .env
```

Edit `.env`:
```env
VITE_ANTHROPIC_API_KEY=sk-ant-your-claude-key
VITE_SUPABASE_URL=https://abcdefgh.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGci...your-anon-key
```

---

## Step 8 — Run Locally

```bash
npm install
npm run dev
# → http://localhost:3000
```

Sign in with your email — you'll receive a **6-digit code**. Enter it and you're in!

---

## Step 9 — Deploy to Vercel

```bash
# Push to GitHub first
git init && git add . && git commit -m "ScholarHub with Supabase backend"
git remote add origin https://github.com/YOUR_USERNAME/scholarhub.git
git push -u origin main
```

Then on [vercel.com](https://vercel.com):
1. Import your GitHub repo
2. Add all three environment variables:
   - `VITE_ANTHROPIC_API_KEY`
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
3. Click Deploy

**Add your Vercel URL to Supabase:**
- Supabase → Authentication → URL Configuration
- **Site URL:** `https://your-app.vercel.app`
- **Redirect URLs:** `https://your-app.vercel.app/**`

---

## What Works After Setup

| Feature | Before Supabase | After Supabase |
|---------|----------------|----------------|
| Login | ❌ | ✅ Email OTP (6-digit code) + Google |
| Profile | Resets on refresh | ✅ Persists forever |
| Saved scholarships | Resets on refresh | ✅ Sync across devices |
| Application tracker | Resets on refresh | ✅ Real database |
| Document vault | ❌ | ✅ Encrypted file storage |
| Notifications | Mock data | ✅ Real-time notifications |
| Peer review | Mock data | ✅ Real submissions |
| All AI features | ✅ | ✅ (unchanged) |

---

## Troubleshooting

**"relation does not exist" error:**
→ You haven't run the SQL schema yet. Go back to Step 2.

**"Invalid API key" error:**
→ Check your `.env` file — make sure there are no extra spaces or quotes.

**Google sign-in not working:**
→ Make sure your Vercel URL is added to both Supabase's redirect URLs AND Google's OAuth client.

**Documents not uploading:**
→ Make sure you created the `documents` storage bucket and added all 3 policies (Step 3).
