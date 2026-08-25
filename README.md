# OPERATION PHOENIX: THE 20TH ASCENSION

A gamified 30-day self-mastery campaign web app with glassmorphism UI, LocalStorage persistence, and WhatsApp daily dispatch export.

## Quick Start

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

## Build for Production

```bash
npm run build
npm run preview
```

## Features

- **Glassmorphism HUD** — Dark glass panels, neon accents, particle effects, Framer Motion animations
- **30-Day Campaign** — Aug 24 → Sep 22 lock/unlock calendar matrix
- **Daily Quest Grid** — 4 modules, 100 PTS/day across Physical, Mental, Skill, and Discipline
- **Rank System** — Novice Phoenix → Rising Warrior → Apex Commander → Phoenix Titan
- **Streak Tracking** — Consecutive 70+ point days with flame animation
- **LocalStorage** — Local-first progress persistence for the prototype
- **Personalized Voice** — Dynamic name injection with a replay control and browser fallback
- **Security foundation** — Sanitization and profile validation helpers in `src/utils/security.ts`
- **Production architecture** — Auth, RLS, CSRF, rate limiting, CSP, and server-side WhatsApp guidance in `SECURITY_ARCHITECTURE.md`

## Tech Stack

- React 18 + TypeScript
- Vite
- Tailwind CSS
- Framer Motion
- Lucide React
- DOMPurify

## Production note

The current app is a frontend prototype. Connect Supabase/Firebase and a server-side Twilio function before treating authentication, user data, or WhatsApp delivery as production-secure. Do not put provider secrets in client-side environment variables.
