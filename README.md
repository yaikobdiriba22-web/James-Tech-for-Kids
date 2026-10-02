# James Tech for Kids — Production Full-Stack Platform

> **Tagline:** Building Future Generations Through Technology  
> **Production Domain:** [https://james-tech-learn.vercel.app](https://james-tech-learn.vercel.app)  
> **Supabase Project:** `https://wxhzbhggavjxiqxxfmvu.supabase.co`  
> **Target Audience:** Young innovators aged 7–16, parents, and educators  
> **Director Email:** `yaikobdiriba22@gmail.com` | **Phone:** `+251 922 067 302`

---

## 1. Project Overview & Architecture

James Tech for Kids is a modern, responsive technology education platform designed to move young minds from technology consumers into active creators. The architecture is engineered with:

* **Frontend:** React 19 + TypeScript + Vite + Tailwind CSS + React Router v7.
* **Authentication & Database:** Official `@supabase/supabase-js` connected to Supabase PostgreSQL with strict Row Level Security (RLS) policies.
* **Full-Stack Backend Routes:** Express (`server.ts`) providing `/api/enroll`, `/api/contact`, and `/api/health` endpoints.
* **Email & Notifications:** Direct multi-channel dispatch to Director Yaikob Diriba (`yaikobdiriba22@gmail.com`) via Gmail Web compose, native Mail App, and WhatsApp API (`+251 922 067 302`).
* **Deployment:** Pre-configured for zero-configuration Vercel deployment with SPA rewrites (`vercel.json`).

---

## 2. Application Route Map

| Path | Access Level | Description |
| :--- | :--- | :--- |
| `/` | **Public** | High-conversion homepage (Hero, About, Programs preview, Methodology, Why James Tech, Parents, Pricing, FAQ, Admissions, Contact). |
| `/programs` | **Public** | Complete course catalog with search, age filter (7–10, 10–12, 12–16), detailed syllabus modals, and enroll CTA. |
| `/contact` | **Public** | Dedicated contact & advisory page with direct inquiry form, campus address, phone, and WhatsApp launcher. |
| `/login` | **Public** | Student/parent login with password visibility toggle, session persistence, and error handling. |
| `/signup` | **Public** | Account registration with student full name, parent name, student age, phone, email, and password confirmation. |
| `/forgot-password`| **Public** | Password reset request form triggering Supabase reset email. |
| `/reset-password` | **Public** | Set new password with confirmation handling. |
| `/dashboard` | **Protected** | Student dashboard with enrolled courses, interactive lesson checklist, real progress bars, catalog enrollments, and profile settings. |

---

## 3. Database Schema & Migration Instructions

The platform database is powered by Supabase PostgreSQL. The version-controlled migration is located at:
`supabase/migrations/20261002000000_init_schema.sql`

### Tables Created:
1. `profiles`: Extends `auth.users` with student full name, age (7–16), phone number, guardian name, and role.
2. `programs`: Published curriculum tracks (Scratch, Web Development, Python, Robotics, AI).
3. `enrollments`: Student course enrollments, learning format (`in-person` vs `online`), schedule, and reference code. Unique per `(user_id, program_id)`.
4. `lessons`: Modular syllabus lessons for each program.
5. `lesson_progress`: Student lesson completion tracker. Unique per `(user_id, lesson_id)`.
6. `contact_messages`: Inquiries and questions submitted to the academy.

### Automated Triggers:
* `on_auth_user_created`: Automatically creates a row in `public.profiles` whenever a new user registers through Supabase Auth.

### Row Level Security (RLS) Enforced:
* Users can view and update **only their own** profile, enrollments, and lesson progress.
* Public visitors can read **only published** programs and lessons.
* Contact messages can be created by anyone, but read only by authorized administrators.

### How to Apply the Migration in Supabase:
1. Open the [Supabase Dashboard](https://supabase.com/dashboard/project/wxhzbhggavjxiqxxfmvu).
2. Navigate to the **SQL Editor** in the left sidebar.
3. Click **New Query**.
4. Copy the entire contents of `supabase/migrations/20261002000000_init_schema.sql`.
5. Click **Run**.
6. All 6 tables, triggers, RLS policies, and seed curriculum data will be created instantly.

---

## 4. Resolving the "Supabase is not configured yet" Error

If you or your users ever see:
`"Supabase authentication is not configured. Please set VITE_SUPABASE_PUBLISHABLE_KEY in Vercel Environment Variables (for production) or in your local .env file."`

### Why this happens:
1. **On Vercel (`https://james-tech-learn.vercel.app`):**  
   Local `.env` files are ignored by Git (`.gitignore`) and are **never uploaded to GitHub or Vercel**. Therefore, Vercel builds the site without the publishable key unless it is added in the Vercel dashboard.
   - **Fix:**
     1. Open [Supabase Dashboard](https://supabase.com/dashboard/project/wxhzbhggavjxiqxxfmvu) → **Project Settings** → **API**.
     2. Copy the `anon` / `public` key under **Project API keys**.
     3. Open [Vercel Dashboard](https://vercel.com/dashboard) → Select your project `James-Tech-for-Kids`.
     4. Navigate to **Settings** → **Environment Variables**.
     5. Add:
        - Key: `VITE_SUPABASE_URL` | Value: `https://wxhzbhggavjxiqxxfmvu.supabase.co`
        - Key: `VITE_SUPABASE_PUBLISHABLE_KEY` | Value: `<your-copied-anon-key>`
     6. Go to the **Deployments** tab, click the three dots (`...`) on your latest deployment, and select **Redeploy**. *(Vite injects environment variables at build time, so a redeploy is required!)*

2. **In Local Development (`localhost:3000`):**  
   Create a `.env` file in the project root (next to `package.json`):
   ```bash
   VITE_SUPABASE_URL=https://wxhzbhggavjxiqxxfmvu.supabase.co
   VITE_SUPABASE_PUBLISHABLE_KEY=your_copied_anon_key
   ADMIN_EMAIL=yaikobdiriba22@gmail.com
   ADMIN_PHONE=+251922067302
   ```
   Restart the dev server: `npm run dev`.

---

## 5. Environment Variables Configuration

Copy `.env.example` to your environment settings:

```bash
# Supabase Production Configuration
VITE_SUPABASE_URL="https://wxhzbhggavjxiqxxfmvu.supabase.co"
VITE_SUPABASE_PUBLISHABLE_KEY="YOUR_REAL_SUPABASE_PUBLISHABLE_KEY"

# Leadership Direct Contact
ADMIN_EMAIL="yaikobdiriba22@gmail.com"
ADMIN_PHONE="+251922067302"
```

### Where to get your Supabase Publishable Key:
1. Go to your Supabase Project Settings: **Project Settings** → **API**.
2. Under **Project API keys**, locate the `anon` / `public` key.
3. Set this key as `VITE_SUPABASE_PUBLISHABLE_KEY` in Vercel and local `.env`.

---

## 5. Supabase Auth URL Configuration

To ensure registration, confirmation emails, and password reset links redirect properly:

1. In Supabase Dashboard, go to **Authentication** → **URL Configuration**.
2. Set **Site URL** to:
   ```
   https://james-tech-learn.vercel.app
   ```
3. In **Redirect URLs**, add:
   ```
   https://james-tech-learn.vercel.app/**
   https://james-tech-learn.vercel.app/dashboard
   https://james-tech-learn.vercel.app/reset-password
   http://localhost:3000/**
   ```

---

## 6. Vercel Deployment Guide

1. Push your repository to GitHub: `https://github.com/yaikobdiriba22-web/James-Tech-for-Kids`.
2. In Vercel, click **Add New Project** and select the repository.
3. Build Settings:
   - **Framework Preset:** Vite
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
4. Environment Variables:
   - `VITE_SUPABASE_URL`: `https://wxhzbhggavjxiqxxfmvu.supabase.co`
   - `VITE_SUPABASE_PUBLISHABLE_KEY`: *(Your Supabase publishable anon key)*
   - `ADMIN_EMAIL`: `yaikobdiriba22@gmail.com`
   - `ADMIN_PHONE`: `+251922067302`
5. Click **Deploy**. SPA rewrites configured in `vercel.json` will ensure deep routes (`/programs`, `/dashboard`, etc.) resolve seamlessly without 404 errors.

---

## 7. Verification & Testing Checklist

- [x] **Build & Bundle:** Production build compiles cleanly with zero TypeScript errors (`tsc --noEmit && vite build`).
- [x] **Route Deep Linking:** Direct URL access and browser refreshes work on `/`, `/programs`, `/contact`, `/login`, `/signup`, `/dashboard`.
- [x] **Authentication Flow:**
  - Registration handles full student details and creates Supabase auth record.
  - Sign in checks credentials, returns friendly error message on incorrect password, and sets session.
  - Password visibility eye toggle works on all auth forms.
  - Protected route guard redirects unauthorized guests attempting to access `/dashboard` to `/login?redirect=/dashboard`.
  - Session restores seamlessly on browser refresh.
  - Logout clears session and redirects to sign-in.
- [x] **Student Dashboard:**
  - Real student display name and account email.
  - Displays real enrolled programs from Supabase `enrollments` table with proper empty state when none exist.
  - Real lesson checklist with interactive checkboxes updating `lesson_progress` table.
  - Profile and password management forms.
- [x] **Multi-Channel Email Notifications:**
  - Enrollment and Contact forms save to Supabase tables AND auto-trigger direct message compose addressed to `yaikobdiriba22@gmail.com` with WhatsApp and phone call fallbacks.
