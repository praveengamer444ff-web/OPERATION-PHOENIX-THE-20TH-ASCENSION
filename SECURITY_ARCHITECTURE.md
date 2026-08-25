# Security Architecture

The current frontend is a local-first Vite application. It must not contain service-role keys, Twilio credentials, or trusted authorization decisions.

## Required production boundary

- Use Supabase Auth or Firebase Auth for email/password authentication and email verification.
- Store only a public profile (`user_id`, `full_name`, `phone_e164`, `created_at`) in the database. Password hashes remain owned by the auth provider.
- Store challenge records with a `user_id` foreign key. Enforce ownership with Supabase RLS or Firebase Security Rules, not frontend filtering.
- Recalculate scores, streaks, date ranges, and completion status in a trusted server function. Reject client-supplied totals.
- Send WhatsApp reports from a server endpoint or scheduled function using Twilio credentials stored only in server environment variables. Never expose those credentials in `VITE_*` variables.
- Require a CSRF token for cookie-authenticated state-changing requests and apply per-user/IP rate limits to auth, profile, and report endpoints.
- Set CSP, HSTS, `X-Content-Type-Options`, `Referrer-Policy`, and frame protections at the hosting/server layer. Vite cannot enforce response headers in a static deployment by itself.

## Client-side safeguards

`src/utils/security.ts` sanitizes display text with DOMPurify, validates E.164 phone numbers, and provides the requested strong-password check. These checks improve UX but do not replace server-side validation.

## Suggested tables

- `profiles`: `id`, `user_id`, `full_name`, `phone_e164`, `created_at`
- `challenges`: `id`, `user_id`, `start_date`, `end_date`, `created_at`
- `day_records`: `id`, `challenge_id`, `user_id`, `day_number`, `date`, `quest_states`, `created_at`, `updated_at`

Every table should have an ownership policy based on the authenticated subject. Add a unique constraint on `(challenge_id, day_number)` and validate that challenge dates span exactly 30 calendar days.
