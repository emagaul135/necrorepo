# Kiroween 2026 — NecroRepo build notes

## Hackathon facts (verified 2026-11-17 from kiroween.devpost.com/rules + /resources)
- **Deadline:** registration + submission end Fri 4 Dec 2026 14:00 PT = **Sat 5 Dec 2026 05:00 WIB**. No extensions. Judging 16 Dec 2026–29 Jan 2027; winners ~3 Feb 2027.
- **Prizes:** $100,000 total. Overall 1st $30,000 / 2nd $20,000 / 3rd $10,000. Each category $5,000. Bonuses: Best Startup $10,000, Best Ghost of Kiroween Past $2,000, Best Kiro Crew App $1,000, Best Demo $1,000, Best Student per category (1-yr Kiro Pro Max ~$1,500), Blog Prize 2,000 credits ×100, Social Blitz 3-mo Kiro Pro+ ×5. One project can win 1 Overall OR 1 category prize + any number of bonuses.
- **Eligibility:** Indonesia eligible (excluded: Argentina, Belarus, Brazil, Crimea, Cuba, Donetsk, Iran, Italy, North Korea, Luhansk, Philippines, Quebec, Russia, Syria, UAE). Teams max 3. User registered solo ("Bekerja sendirian").
- **Submission checklist:** working app URL (free for judges until judging ends) + text description + demo video <3 min, public on YouTube + public GitHub repo (NOT GitLab/Bitbucket) with **`/.kiro` at the root** (never gitignored) + Kiro-usage write-up (IDE/CLI/Web/Crew, custom agents, hooks, spec-driven dev, steering, MCP, property-based testing, Kiro powers). All materials in English or with English translation. New projects only (built during the submission period, 30 Oct–4 Dec 2026).
- **Judging:** Stage One pass/fail (fits theme + uses Kiro). Stage Two, 5 criteria × 20% (10 pts each): Potential Impact (real problem, real audience, would someone use it?), Technological Implementation (depth/variety of Kiro use, strategy, experimentation), Design (complete coherent product, polished, intuitive), Innovation/Idea (novelty, unusual tech/data combinations), Presentation (video shows it working end-to-end, pitch clear, memorable).
- **Bonus paths worth taking:** Social Blitz (post starting with `#KiroweenHackathon26` + link in form, judged on quality/originality) and Blog Prize (public blog post mentioning Kiroween 2026, top 100 scoring submissions get 2,000 credits). Best Demo goes to the top Presentation score in the top 10% overall — the video matters.
- **Free credits:** 4,000 Kiro credits, one-time. Request via the form by **Tue 1 Dec 2026 12:00 PT (Wed 2 Dec 03:00 WIB)**, redeem by 4 Dec, expire 31 Dec 2026. Requires Didit ID verification (selfie + government ID photo) — **only the user can do this**. Devpost profile name must match the ID exactly (most common failure). Kiro user ID: `d-9067c98495.04d82458-b051-70bd-86ca-6fff707e3655`.
- **Entrants:** ~15,225 registered (per the 2026-11-17 browser check).

## The 4 categories (exact, from the rules)
1. **Resurrection** — "Bring your favorite dead technology back to life. Reimagine obsolete tech with today's innovations or solving tomorrow's problems."
2. **Frankenstein** — "Stitch together a chimera of technologies into one app. Bring together seemingly incompatible elements to build something unexpectedly powerful."
3. **Skeleton Crew** — "Build a skeleton code template lean enough to be clear but flexible enough to support various use cases. Show us its versatility with two distinct applications from your foundation." Repo must contain **2 separate repo folders for the 2 separate applications**.
4. **Costume Contest** — "Build any app but show us a haunting user interface that's polished and unforgettable. Bring in spooky design elements that enhance your app's function."

## Chosen category + app
- **Category: Resurrection.**
- **App: NecroRepo — the graveyard where dead code comes back to life.**
- **What it does:** paste a GitHub username or `owner/repo` → autopsy each repo (health score 0–100 + status Thriving/Alive/Ailing/Dying/Dead, with human-readable reasons) → dead/dying repos get a resurrection plan (most-alive fork + 4-step adoption checklist) → cemetery saved in localStorage, one-click "séance" re-check. Demo cemetery works with zero API calls.
- **Why this one:**
  - *Literal fit for Resurrection:* abandoned open-source projects ARE dead technology; the app revives them by routing users to living forks. The category story writes itself.
  - *Real impact:* abandoned dependencies are a genuine supply-chain risk (left-pad, Log4Shell, event-stream). Judges are developers — they have felt this pain. Existing tools report versions/vulns; none frame it as death + adoption with a one-click path to the living fork.
  - *Innovation:* the graveyard metaphor is the interface, not decoration — tombstones are repo cards, the health bar is the grave's condition, the séance is the re-check. Novel framing of public data (GitHub API + fork graph).
  - *Buildable in ~2 weeks by one agent:* zero-backend static site, public API only, no auth flows, no paid services. The skeleton is already working (see below).
  - *Demo-friendly:* the demo cemetery renders instantly with no network; the 3-min video can show a real user inspection end-to-end.
  - *Scores on all 5 criteria:* Impact (real problem), Tech (spec-driven Kiro build + custom agent + hooks + steering), Design (coherent spooky UI where every element does work), Innovation (death/adoption framing), Presentation (instant visual demo).
- **Why not the others:** Frankenstein would need genuinely incompatible tech stitched together (more integration risk, less focus); Skeleton Crew doubles the work (2 full apps + 2 repo folders) for a template prize; Costume Contest is the most crowded (any app + spooky UI) and the UI would carry the entry instead of the idea. Resurrection gives the strongest concept-to-category match with the least scope risk.
- **Why not tied to the Oyen channel:** the app is judged on its own merit for a global developer audience; tying it to a cat-video channel would weaken Impact and Innovation. (A Social Blitz post can still come from the user's own accounts later.)

## Feature list (v0.1 scaffold — implemented)
1. Inspect a GitHub user/org (public non-fork repos, sorted dead-first).
2. Inspect a single repo (`owner/repo`) with auto-opened detail panel.
3. Health scoring: graduated idle penalty (>3mo −25, >6mo −45, >12mo −65, >24mo −80, >48mo −90, >96mo −95), open-issue penalty (>50 −10, >100 −15), archived = 0, clamped 0–100; statuses ≥80 thriving, ≥60 alive, ≥40 ailing, ≥15 dying, <15 dead; every score carries human-readable reasons.
4. Resurrection plan: 4-step adoption checklist + up to 3 living forks (unarchived, pushed <12mo, ordered by recency) with stars + last-push date.
5. Cemetery persistence in localStorage (`necrorepo.cemetery.v1`) + one-click re-check that keeps stale records on failure.
6. Demo cemetery: 8 sample repos (5 dead, 1 ailing, 2 thriving), zero API calls.
7. Optional GitHub token field (Bearer auth, never stored) for the 60 req/hr unauthenticated limit, with a clear rate-limit message.
8. Graveyard UI: tombstone cards, health bars, status badges, fog + moon, keyboard-accessible cards, no CDN/fonts/trackers (works offline except API calls).

## Kiro CLI auth status (BLOCKER — needs the user)
- CLI installed: `~/.local/bin/kiro-cli`, version 3.4.0 (NOT on default PATH — use the full path or add `~/.local/bin` to PATH).
- `kiro-cli whoami` → **"Not logged in"**.
- Login path: `kiro-cli login --social google --use-device-flow --license free` — prints a URL + code; the user opens it in their browser and approves with the Google account oyentv770@gmail.com. **This cannot be done headlessly by the agent; it needs the user.**
- Kiro web account itself exists and is confirmed: oyentv770@gmail.com, free plan, 0/50 credits, user ID `d-9067c98495.04d82458-b051-70bd-86ca-6fff707e3655`. (Kiro Web home shows an upgrade wall for the web app, but the account + CLI free tier are separate.)
- **Honesty note:** the scaffold in this repo was authored in this session by the agent (Muse), NOT yet through a Kiro agent session, because the CLI is unauthenticated. The `.kiro/` files are real spec/steering/agent/hook artefacts written to the Kiro conventions, and the build plan (tasks.md Milestone 1) requires running actual Kiro sessions once logged in — the "built with Kiro" claim for the submission must rest on those sessions, not on this scaffold alone.

## What was scaffolded (this session, 2026-11-17)
```
~/workspace/kiroween/
├── README.md, LICENSE (MIT), .gitignore (never ignores .kiro), serve.sh
├── NOTES.md (this file)
├── .kiro/
│   ├── steering/product.md, tech.md, structure.md
│   ├── specs/necrorepo/requirements.md (EARS-style, 7 requirements),
│   │   design.md, tasks.md (milestones 0–3)
│   ├── agents/graveyard-reviewer.md (custom review agent)
│   └── hooks/on-save-test.json (DRAFT — schema must be validated in Kiro)
└── app/ (static site, zero deps)
    ├── index.html, styles.css, app.js
```
- Local git repo initialised; first commit with identity Oyen Tv <oyentv770@gmail.com> (the user's established identity from the make.fun work). **Nothing pushed anywhere; no GitHub repo created.**

## Verification done (this session)
- `node --check app/app.js` — clean.
- Scoring assertions in node — all pass (archived = 0/dead; 2016/2014/2009 repos = dead; recent pushes = thriving; 200-day idle = ailing).
- Fake-DOM harness `/tmp/dom-harness.cjs` — all 14 checks pass (init empty state, demo click renders 8 tombstones with badges/health bars, count label, localStorage write, detail panel opens with autopsy reasons, fork-search failure handled gracefully).
- Live GitHub API shape verified with curl (facebook/react returns 200; all fields used exist; note: the API 301-redirects renamed repos — `fetch()` follows redirects automatically).
- All 26 DOM ids referenced in app.js exist in index.html (cross-checked).
- Static files serve 200 over a local HTTP server.
- **NOT verified:** real-browser render. The VM's Chromium (`/opt/meta-chromium/chrome`) refuses to start without its WebGL domain-policy file (`hatch-webgl-all-origins-v1`), which is no longer on disk (the old CDP workaround from the token-radar work is unusable until that file is restored). Re-verify visually in a real browser before recording the demo video.

## Build plan (summary — full milestones in .kiro/specs/necrorepo/tasks.md)
- **M1 (blocked on user):** CLI login → Kiro agent sessions review/extend the scaffold → validate hook schema.
- **M2 (by 28 Nov):** bus-factor signal, dependency autopsy (package.json), shareable cemetery via URL hash, real-browser visual check + screenshots.
- **M3 (by 3 Dec):** public GitHub repo under the user's account (needs the user — never touch emagaul135 without asking) → GitHub Pages deploy → demo video (<3 min, public YouTube) → Kiro-usage write-up → Devpost submit (Resurrection) → Social Blitz post + bonus blog post → claim 4,000 credits (user ID verification by 1 Dec 12:00 PT).

## Open items / risks
- Kiro CLI login needs the user (device-flow URL approval). Without it, no genuine Kiro agent session can run — the biggest submission-integrity risk.
- GitHub API unauthenticated limit is 60 req/hr; a judge inspecting a big user could hit it — the token field + demo mode mitigate, but a cached demo video matters.
- The 4,000-credit claim needs the user's selfie + KTP (Didit) — only the user can do it, deadline 1 Dec 12:00 PT.
- GitHub repo creation + push needs the user (their account emagaul135; never touch without asking).
- Demo video: needs a real-browser screen recording; the VM cannot render the app in Chromium right now (see verification note).
