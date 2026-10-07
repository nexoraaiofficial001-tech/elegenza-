# Cafe Eleganza - Security & Protection Standards

## 1. Authentication & Role-Based Access Control (RBAC)
- All staff/admin routes protected.
- Roles stored strictly on Firestore security documents (`users/{uid}.role`).
- Patrons cannot modify their own privileges or loyalty balances from client SDK calls.

## 2. Injection & XSS Defenses
- Express body size limits set to 100kb to mitigate DDoS payload spikes.
- Zod schema validation applied before any database mutation.
- Profanity and spam filters on all review submissions.
- Pakistani phone number regex enforcement (`+923XXXXXXXXX` / `03XXXXXXXXX`).

## 3. Rate Limiting & Fraud Protection
- Express rate limiter applied to OTP requests (max 5 per 15 minutes per IP).
- Promo code brute force lockout preventing automated coupon testing.
- Double-submission lock on order checkout with unique idempotency keys.
