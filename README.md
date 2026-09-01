# standardreasoningcompany

The Standard Reasoning Company site, and the account surface for the
shared Supabase auth plane (`dosjqkvbvhnszpkvyzqk`).

Next.js on Railway. It was a static GitHub Pages page until 08/01/2026;
Pages could not hold a session, so it could never be the frontend to the
auth plane.

## Routes

| Route | Rendering | Purpose |
| --- | --- | --- |
| `/` | static | Mandate and the catalog of instruments |
| `/login` | static | Magic-link request, posts to Supabase |
| `/auth/verify` | dynamic | Exchanges `token_hash` via `verifyOtp` |
| `/account` | dynamic | Signed-in email, sign out; redirects to `/login` when signed out |

`/auth/verify` implements the same contract every Standard Reasoning app
exposes, so one shared project can email links that land on each app's
own domain. See `standard-reasoning-auth/README.md` for the auth plane
and the send-email hook.

## Design language

**Standardized Structural Rationalism.** Four rules, applied in
`app/globals.css`:

1. **The grid is visible.** Hairlines at `--rule` are the only
   decoration. Four frame rules are drafted rather than bordered: each
   spans the sheet's full height or width, so it runs past the two it
   meets instead of stopping at them, and every corner resolves as a
   crossing. Internal rules stop at the verticals, which keeps the corners
   the one place the eye is asked to notice. Nothing is rounded. Nothing
   has a card background.

   `--cross` is the only margin value in the system. It is the gap between
   sheet and viewport on all four sides, the distance the frame rules
   overshoot, and the band the marginalia sits in. The sheet is therefore
   **full bleed**: capping its width and centring it would leave more room
   at the sides than at the head and foot on any wide screen, and an
   uneven margin is the one thing a drawing sheet cannot have.

2. **The margin carries the running header and footer.** They sit outside
   the frame rather than inside it, so the frame encloses nothing but the
   work itself and the head and foot cost the content no space. Identity
   and account at the top, date and contact at the bottom, inset by
   `--step` so they clear the rules and share a left edge with the
   wordmark and the section headers beneath them.
3. **Type carries the hierarchy.** Archivo 800 uppercase at up to
   5.25rem against IBM Plex Mono at 0.5625rem, with nothing in between
   competing. The contrast between authoritative display and clinical
   metadata is the whole system.
4. **Color is information.** Graphite scale throughout, plus one signal
   amber (`--signal`) used only on an instrument marked active. Bracket
   notation carries the state, so the reading survives without color and
   color only sharpens it.

The page is an **index, not a funnel**, in two numbered sections. Mandate
states what the workshop is. Catalog lists every instrument with its
version and status. Body copy is monospaced and set to a narrow measure,
because it is reference text rather than persuasion.

A third section stating shared engineering standards was built and cut.
Written as commitments it read as self-regard, and written as
specifications it restated what the catalog already shows. The catalog is
the evidence, so the page does not also argue for itself.

## Copy

Written as a technical specification, not as marketing. Four constraints
govern every string on the site:

1. **Agentless.** No first-person pronouns anywhere. The company name is
   never the subject of an active verb, so there is no "The Standard
   Reasoning Company builds ...". Functions are stated as conditions that
   hold.
2. **Objective.** Outcomes are stated as fact, in the register of a data
   plate or a material estimate sheet.
3. **Specification driven.** Command verbs, or labelled specification
   rows: `PURPOSE`, `FUNCTION`, `VER`, `STATUS`.
4. **No fluff and no negative space.** Hype adjectives are replaced with
   engineering terms (calibrated, standardized, structural, foundational).
   The copy never defines the workshop by what it is not; stating the
   absence of something invites a defensive read and spends words on a
   comparison nobody asked for.

Facts on this page are checkable or absent. Version numbers come from the
instrument's own manifest, which is why only praetom carries one, and
`--` means nothing is published rather than nothing exists. No uptime or
reliability figure appears anywhere, because there is no measurement
behind one.

`app/sheet.tsx` owns the frame and the head and foot set in its margin.
Every page is that sheet, so auth surfaces carry their own title block
and plate exactly as the index does, and the company name is stated once,
in the margin.

Adding an instrument means one entry in `CATALOG` in `app/page.tsx`. The
counts in the plate and the section header derive from it. Version reads
`--` where there is nothing published to report, rather than carrying a
number that was never real.

## Deployment

Railway project `standardreasoning`, service `web`, built with Railpack.
`railway up --service web` deploys from the working tree.

Three variables are set on the service, matching praetom's pattern:
`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`, and
`NEXT_PUBLIC_SITE_URL`. The last is authoritative for
`lib/public-origin.ts`, which keeps the host in an emailed link the same
as the host it redirects to.

## DNS

Cloudflare, modeled on the praetom zone. Every record is **DNS-only**.
Proxying breaks Railway's certificate issuance.

| Type | Name | Value |
| --- | --- | --- |
| CNAME | `@` | `q8ae3f8b.up.railway.app` |
| CNAME | `www` | `hpsm6038.up.railway.app` |
| TXT | `_railway-verify` | `railway-verify=<apex token>` |
| TXT | `_railway-verify.www` | `railway-verify=<www token>` |

The apex is a CNAME that Cloudflare flattens at the root, which is why
Railway reports its current value as empty while still marking the record
propagated.

### The gotcha that cost an hour

`railway domain <name>` prints the TXT value already prefixed:

```
Value  railway-verify=railway-verify=38dc8b7f...
```

Pasting that whole string produces a doubled prefix, and the certificate
sits in `VALIDATING_OWNERSHIP` forever with the DNS record reported as
`PROPAGATED`, and nothing indicates the value itself is wrong. The record
content must carry exactly one `railway-verify=`.

`standardreasoning.com`, `www.standardreasoning.com` and
`standardreasoning.co` 301 here through Cloudflare redirect rules on
proxied placeholder records, untouched by this migration.

## Supabase

Redirect URLs must be allowlisted or `signInWithOtp` silently drops the
`emailRedirectTo`. Added for this app: `https://standardreasoningcompany.com/**`,
`https://www.standardreasoningcompany.com/**`,
`https://web-production-44f9c.up.railway.app/**`, `http://localhost:3778/**`.

Built-in mailer sends are capped at 2/hour and over-quota sends are
dropped silently. Check the auth logs for `mail.send` before debugging a
template.
