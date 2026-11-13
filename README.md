# JobShield AI 🛡️
### Don't Just Find Jobs. Verify Your Future.
**Next-Generation AI-Powered Job & Internship Fraud Detection Platform**

---

## 🌟 Production Platform Overview
**JobShield AI** is an enterprise-grade cybersecurity web application engineered to protect students, freshers, and job seekers from modern employment fraud. While standard career platforms merely list jobs, JobShield AI provides a rigorous, explainable verification layer before candidates risk their hard-earned money, identity, or academic credentials.

### Key Differentiators & Innovations
1. **Scam DNA™ Fingerprinting**: Breaks down recruitment communications into semantic fraud genes (such as pressure tactics, off-platform Telegram redirection, unrealistic unskilled earnings, and generic free mailboxes) and produces an archetype hash to detect recurring scam syndicates.
2. **Screenshot-to-Scam Scanner (Multimodal AI)**: Allows candidates to drag & drop screenshots of WhatsApp chats, Telegram job posters, or fake offer letters. Powered by **Gemini 3.8 Flash** multimodal OCR to extract visible text and flag suspicious clauses.
3. **AI Recruiter Credibility Checker**: Validates domain consistency, flags corporate impersonation (e.g. fraudsters using free `@gmail.com` claiming to be Microsoft or TCS HR), and performs MX registry heuristics.
4. **Transparent AI Evidence Explainer**: Strictly separates **verified facts** from **user claims** and **AI inferences**. Demystifies hidden fee demands down to exact rupee/dollar figures.
5. **Community Scam Alert Network**: Crowdsourced, peer-verified alert feed where victims report fraudulent UPI handles, WhatsApp recruitment numbers, and fake placement agencies.
6. **Downloadable Official PDF Risk Reports**: Generates verifiable PDF certificates with Scam DNA hashes to show college placement cells.
7. **ShieldBot AI Assistant**: Floating cybersecurity assistant supporting **English, Hindi, and Hinglish** across the platform.

---

## 🏗️ Architecture & Technology Stack

- **Frontend**: React 19, TypeScript, Vite, Tailwind CSS v4, Lucide Icons, Recharts, Canvas Confetti.
- **Backend**: Node.js & Express (`server.ts`) hosting REST APIs and integrated Vite middleware.
- **Artificial Intelligence**: Google Gemini 3.8 Flash (`@google/genai`) with structured JSON schema (`responseSchema`) + Fallback heuristic fraud detection engine.
- **Database & Storage**: Supabase PostgreSQL schemas with Row Level Security (RLS), foreign keys, indexes, and triggers (`/supabase/schema.sql`).
- **Security & RBAC**: Role-based access control distinguishing candidate users from verified security administrators.
- **Instant Demo Mode**: 1-click Fast-Pass with preloaded sample fraud cases, live interactive scanning, and instant role switching without requiring external setup.

---

## 🚀 Getting Started

### 1. Environment Variables
Create or verify your `.env` file (see `.env.example`):
```env
# Injected automatically in Google AI Studio
GEMINI_API_KEY="your-gemini-api-key"
PORT=3000

# Optional Supabase integration (JobShield operates seamlessly in demo mode if omitted)
VITE_SUPABASE_URL="https://your-project.supabase.co"
VITE_SUPABASE_ANON_KEY="your-anon-key"
```

### 2. Run the Development Server
```bash
npm run dev
```
The server will boot on `http://localhost:3000`.

### 3. Build for Production
```bash
npm run build
npm start
```

---

## 🗄️ Supabase PostgreSQL Setup
To deploy the database schema to your Supabase project:
1. Open your Supabase SQL Editor.
2. Copy and paste the contents of `/supabase/schema.sql`.
3. Execute the script. It provisions:
   - `profiles`
   - `job_analyses`
   - `recruiter_checks`
   - `community_reports`
   - `saved_jobs`
   - `chat_history`
   - `notifications`
   - `admin_activity`
   - RLS policies and new user signup triggers.

---

## 🧭 Platform Feature Walkthrough
1. **Landing Page**: View the cyber hero section, trust metrics, and try the **Instant Threat Scanner** widget.
2. **AI Scanner (`/scanner`)**: Click on test presets like *"Data Entry ₹1,500 Deposit Scam"* or *"Legitimate Stripe SWE Intern"*. Observe the animated Risk Meter, Scam DNA™ sequence, and Evidence Explainer. Click **"Download PDF Report"** to export an official certificate.
3. **Screenshot Scanner (`/screenshot`)**: Click one of the curated sample screenshots (WhatsApp chat or fake appointment letter) to trigger multimodal OCR extraction and risk classification.
4. **Recruiter Checker (`/recruiter-check`)**: Test free email impersonations (e.g. `google.recruitment@gmail.com`) to evaluate domain credibility audits.
5. **Scam DNA Comparison (`/scam-dna-compare`)**: Compare two offers side-by-side to detect overlapping syndicate fraud templates.
6. **Community Network (`/community`)**: View live allegations, upvote reports, or submit an anonymous alert.
7. **ShieldBot AI**: Click the floating bot in the bottom right corner. Toggle between English, Hinglish, or Hindi!
8. **Admin Portal (`/admin`)**: Use the user menu in the top navbar to switch to **Admin Mode** to access the moderation queue and audit logs.
