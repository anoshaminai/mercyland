# Chat-World Magic-Link Auth — Implementation Plan

Replaces the current gate (Formspree + localStorage flag) with real email verification via magic links. First backend service in the project.

## Locked-in decisions (from user)

- **Custom domain:** `thankgodformercyland.com`, managed via Squarespace. Frontend stays at the apex; backend at `api.thankgodformercyland.com`. Squarespace DNS handles the records.
- **Access policy:** open-but-verified. Any valid email that can receive + click the link gets in. No allowlist.
- **Render plan:** free tier, cold starts accepted (~30s wake after 15min idle).
- **Rate limiting:** include the one-line `SETNX rate:<email> 1 EX 60` guard.
- **Formspree list migration:** skipped. Current Formspree list is not exported; cutover is clean.

---

## 1. Architecture

- **Email sender:** Resend. Free 3k/mo, 100/day. Transactional-focused. DNS verification = SPF TXT + 3 DKIM CNAMEs + DMARC TXT, all added in Squarespace DNS.
- **Token / session store:** Upstash Redis (free tier, serverless HTTPS, native TTL). Handles both short-lived magic tokens and long-lived sessions. Also stores the verified-email set.
- **Backend host:** Render Web Service (Node + Fastify, free tier). Same dashboard as frontend, single `render.yaml` for both services. Custom subdomain `api.thankgodformercyland.com`.
- **Session mechanism:** HttpOnly, Secure, SameSite=Lax cookie with opaque session token, scoped to `.thankgodformercyland.com` so both apex and `api.` subdomain share it. Frontend never reads the cookie; `/chat-world` mount makes a `GET /api/session` call that the backend authoritatively answers. Leaked localStorage is not a bypass.

## 2. End-to-end flow

### Submit email
1. User types email on `/gate`, hits ENTER.
2. Frontend `POST /api/auth/request { email }`.
3. Backend: validate format with zod. Check rate limit (`SETNX rate:<email> 1 EX 60`) — if key already exists, respond 200 anyway (no enumeration). Else: generate 32-byte base64url token, store `magic:<token> -> email` with 15-min TTL, send Resend email containing `https://api.thankgodformercyland.com/api/auth/callback?token=<token>`.
4. Always respond `200 { sent: true }` regardless of rate-limit state or unknown email (no user enumeration).
5. Gate page swaps to "check your email — link expires in 15 min" confirmation screen, with a "resend" button (client 30s cooldown).

### Magic-link click
1. Hits backend `GET /api/auth/callback?token=...`.
2. Backend: atomic `GETDEL magic:<token>`. If missing → 302 to `https://thankgodformercyland.com/gate?error=expired`.
3. If found: `SADD emails:verified <email>`. Generate session token. Store `session:<token> -> email` with 30-day TTL. Set cookie: `mercy_session=<token>; HttpOnly; Secure; SameSite=Lax; Domain=.thankgodformercyland.com; Max-Age=2592000; Path=/`. 302 to `https://thankgodformercyland.com/chat-world`.

### Arrival at `/chat-world`
1. Page mounts. Hook calls `GET /api/session` with `credentials: 'include'`.
2. Backend reads cookie, looks up `session:<token>`, returns 200 `{ authorized: true, email }` or 401.
3. Frontend: 200 → render; 401 → `<Navigate to="/gate" />`. While loading, show existing `<LoadingOverlay />` — don't flash a redirect.

### Failure cases
- Expired / invalid / already-used token → `/gate?error=expired` with inline "link expired, try again" message above the form.
- Session expired → 401 on `/api/session` → redirect to gate; user re-enters email, re-verifies.

### Returning visitor
- Valid cookie: `/chat-world` loads directly, no gate.
- Visits `/gate` with valid session → gate detects via `GET /api/session` and redirects straight to `/chat-world`.

## 3. Data model (Redis)

| Purpose | Key | Type | Value | TTL |
|---|---|---|---|---|
| Magic tokens | `magic:<token>` | string | email | 900s |
| Sessions | `session:<token>` | string | email | 2,592,000s |
| Verified emails | `emails:verified` | SET | emails | persistent |
| Rate limit | `rate:<email>` | string | "1" | 60s |

## 4. API surface

Backend base URL: `https://api.thankgodformercyland.com`. All JSON.

| Method | Path | Body | Response | Auth |
|---|---|---|---|---|
| POST | `/api/auth/request` | `{ email }` | `200 { sent: true }` | none |
| GET | `/api/auth/callback?token=` | — | 302 redirect | token in URL |
| GET | `/api/session` | — | `200 { authorized, email }` or `401` | cookie |
| POST | `/api/auth/logout` | — | `200 { ok: true }` | cookie |
| POST | `/api/subscribe` | `{ email }` | `200 { ok: true }` | none |

`/api/subscribe` is for the `/flat` `EmailSignup` — no magic link, just adds to `emails:verified`.

**CORS:** `Access-Control-Allow-Origin: https://thankgodformercyland.com` (exact), `Access-Control-Allow-Credentials: true`. Preflight on POST with JSON triggers.

Frontend fetches via a small `apiFetch()` wrapper that prepends `VITE_API_URL` and sets `credentials: 'include'`.

## 5. Environment

**Backend** (Render env vars):
- `RESEND_API_KEY`
- `RESEND_FROM` (e.g., `Mercy Land <noreply@thankgodformercyland.com>`)
- `UPSTASH_REDIS_REST_URL`
- `UPSTASH_REDIS_REST_TOKEN`
- `FRONTEND_ORIGIN` (`https://thankgodformercyland.com`)
- `COOKIE_DOMAIN` (`.thankgodformercyland.com`)
- `PORT` — Render provides

**Frontend** (Render static site env vars + local `.env.local`):
- `VITE_API_URL` (`https://api.thankgodformercyland.com`, or `http://localhost:3000` for dev)

Add `.env*` to `.gitignore`.

## 6. Formspree cutover

Drop it entirely. No export. Cut over both forms simultaneously:
- `src/pages/gate-page.tsx` → `POST /api/auth/request`
- `src/components/EmailSignup.tsx` → `POST /api/subscribe`

`npm uninstall @formspree/react` after cutover works.

## 7. Code changes, ordered

### Phase A — Backend scaffold

New directory `server/` at repo root.

**Create:**
- `server/package.json` — deps: `fastify`, `@fastify/cookie`, `@fastify/cors`, `resend`, `@upstash/redis`, `zod`. Scripts: `dev`, `build`, `start`.
- `server/tsconfig.json` — Node ESM, target ES2022.
- `server/src/index.ts` — Fastify app, cookie + CORS plugins with `credentials: true`, route registration, listen on `PORT`.
- `server/src/routes/auth.ts` — the five endpoints above.
- `server/src/lib/redis.ts` — Upstash REST client singleton.
- `server/src/lib/email.ts` — Resend client + `sendMagicLink(email, token)` with inline HTML (pink/green/blue palette matching site).
- `server/src/lib/tokens.ts` — `crypto.randomBytes(32).toString('base64url')`.
- `server/.env.example` — documents required vars.
- `server/README.md` — local dev instructions.

### Phase B — Frontend refactor

**Edit:**
- `src/hooks/useChatWorldAccess.ts` — remove localStorage. Hook fetches `GET /api/session` on mount, returns `{ hasAccess, isLoading, refresh }`.
- `src/pages/chat-world-page.tsx` — respect `isLoading` (keep `<LoadingOverlay />`, don't redirect yet); on `!isLoading && !hasAccess` redirect to `/gate`.
- `src/pages/gate-page.tsx` — rip out `@formspree/react`. Local state machine `idle → submitting → awaitingLink → error`. Submit posts to `POST /api/auth/request`. Read `?error=expired` from URL on mount and render inline error. "Resend" button with 30s client cooldown.
- `src/components/EmailSignup.tsx` — swap Formspree for `fetch(${VITE_API_URL}/api/subscribe)`. Preserve UI (green/red/blue palette).

**Create:**
- `src/lib/api.ts` — `apiFetch(path, init)` wrapper.
- `.env.example` at repo root.

### Phase C — Deployment

**Edit `render.yaml`:**
- Add a second service: `type: web`, `runtime: node`, `rootDir: server`, `buildCommand: npm install && npm run build`, `startCommand: npm start`, `plan: free`.
- Attach custom domain `api.thankgodformercyland.com` to the web service.

**Squarespace DNS:**
- `api.thankgodformercyland.com` CNAME → Render's provided hostname.
- Resend domain verification records on `thankgodformercyland.com`: SPF TXT, DKIM CNAMEs (3), DMARC TXT. Exact values from Resend dashboard.

**Upstash:** create one Redis database (free tier, region near Render's Oregon). Copy REST URL + token into Render backend env vars.

**Order of deploy:** backend first (verify `/api/session` returns 401 on bare request), then frontend. Otherwise a broken backend + new frontend = full gate outage.

## 8. Risks / remaining flags

- **Cold starts (~30s)** on Render free tier will occasionally bite the magic-link callback. Accepted.
- **Fresh-domain deliverability.** First Resend emails may land in spam until `thankgodformercyland.com` warms up. Send a test, mark-not-spam. Stabilizes quickly.
- **Multi-device.** Verifying on phone doesn't log in desktop. Expected; skipping multi-device sync.
- **Legal.** Once list is used for marketing, add unsubscribe link + privacy notice on `/gate`. Out of scope for this milestone.
