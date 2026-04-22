# Chat World — Lean Milestones

## Context

Building out Chat World: a gated, pink-themed sister experience to the Void. Visitors find a "click me" object in the Void, hand over an email, and enter a space where floating "notes" contain special messages. Goal is to ship the full flow end-to-end as quickly as possible, collect emails, and iterate on polish and personalization later.

## Decisions locked in

- **Gate** = email capture only. No verification, no backend, no magic link in v1.
- **Email storage** = Formspree → `localStorage` flag for access.
- **Sending tool** = deferred. Collect now, export to Buttondown / Resend / Laylo later.
- **Click-me graphic** = 2D plane mixed into the existing Void floating-objects system.
- **Notes in chat world** = placeholder shape in v1 (reuse existing floating object).
- **Note popup** = reuse the Void's existing overlay component in v1 (it already renders text, image, video).
- **Messages** = hardcoded in a file, 3 to start, text/image/video all supported in M1.
- **No phone numbers** in v1.

---

## Milestone 1: Click-me → Gate → Chat World (end to end)

**Goal:** Full flow works. User sees click-me in the Void, enters email, lands in chat world, clicks a note, sees a hardcoded message. Deployed to production.

**Tasks:**
- [ ] Add `chatworld-logo.png` (or a "click me" variant) as a 2D plane to the existing Void floating-objects system. `onClick` → navigate to `/gate`.
- [ ] Build `src/pages/gate-page.tsx` at `/gate`: email input, submit button, "enter" CTA.
- [ ] On submit: POST to Formspree, set `localStorage.chatWorldAccess = true`, navigate to `/chat-world`.
- [ ] Build `src/data/chat-messages.ts` — 3 placeholder messages, each with `{ id, type: 'text' | 'image' | 'video', content, title? }`.
- [ ] Build `src/pages/chat-world-page.tsx` at `/chat-world`:
  - On mount, check `localStorage.chatWorldAccess` — if missing, redirect to `/gate`.
  - Pink swirling background using `ChatWorld-Background.mp4`.
  - Reuse floating-objects engine with a placeholder shape for each message.
- [ ] Wire note `onClick` → existing overlay component, rendering the message content (text/image/video).
- [ ] Deploy to Netlify, smoke-test full flow on production.
- [ ] Commit: `"chat world v1"`

**Explicitly not in M1:**
- Sticky-note visual styling
- Chat-world-specific overlay design
- Any backend / DB
- Editing messages without a redeploy
- "Welcome back" UX for returning visitors (localStorage handles access, but no dedicated moment)

---

## Milestone 2: Make it feel like Chat World

**Goal:** Chat World has its own identity — not just the Void with a pink filter. Messages become easier to update without touching components.

**Tasks:**
- [ ] Replace placeholder note objects with actual sticky-note styling, matching the reference video + closeup (pink/green palette, note shape, slight tilt).
- [ ] Build a chat-world-specific overlay — distinct from the Void overlay. Note-themed card or chat-bubble treatment matching the logo.
- [ ] Move messages to `src/data/chat-messages.json` (or keep TS but isolate from components) so copy edits don't touch component code.
- [ ] Optional: "welcome back" micro-moment for returning visitors (skip gate, subtle acknowledgment).
- [ ] Commit: `"chat world polish"`

---

## Milestone 3 (future, not scoped yet)

Flagged so we don't forget. **Do not build until M1 + M2 are live and real emails have been collected.**

- Backend + DB for messages (add/edit without a deploy)
- Real magic-link auth (replaces the localStorage gate — gives Chat World the "special place" feel)
- Admin UI or lightweight CMS for managing notes
- Migrate Formspree list to a real sending tool (Buttondown / Resend / Laylo)
- Phone number option as an alternate gate input
- Per-visitor personalization