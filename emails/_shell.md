# Email templates

The site's sheet, rebuilt inside the constraints of email HTML.

## What carries over, and what cannot

| Site element | In email |
| --- | --- |
| Even margin on all four sides | Kept. Outer table padding, one value. |
| Hairline frame | Kept. 1px border on the inner table. |
| Rules crossing at the corners | **Dropped.** Overshoot needs absolute positioning, which email clients do not support. The frame closes instead. |
| Running header and footer in the margin | Kept, as the first and last rows inside the frame. |
| Archivo display against IBM Plex Mono | Approximated. Remote fonts are stripped by Gmail and Outlook, so the stacks fall back to Helvetica and a system monospace. |
| Graphite palette, amber signal | Kept, with a light-mode fallback since some clients force-invert. |

Corner crossing is the one real loss. Everything else survives.

## Files

- `magic-link.html` — sign-in link for an existing account
- `confirmation.html` — new account, sent by the subscribe flow
- `recovery.html` — password reset

## Applying them

These are **not applied**. The Supabase project `dosjqkvbvhnszpkvyzqk` is
shared with praetom and Cofoundri, and one project renders one set of
templates for every app on it. Current subjects show the collision already:
magic link says Praetom, confirmation and recovery say Cofoundri.

Installing these makes every praetom and Cofoundri auth email say Standard
Reasoning. Per-app branding needs the send-email hook described in
`standard-reasoning-auth/README.md`, which is deployed but inert pending a
verified Resend sending domain.
