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

## Kiro CLI auth status (DONE 2026-11-17)
- CLI installed: `~/.local/bin/kiro-cli`, version 3.4.0 (NOT on default PATH — use the full path or add `~/.local/bin` to PATH).
- `kiro-cli whoami` → **"Logged in with Builder ID, Email: oyentv770@gmail.com"** (verified by the agent on 2026-11-17; the user approved the device-flow login on their phone at ~16:21 WIB, code MZLN-KCDM).
- Login path used: `kiro-cli login --social google --use-device-flow --license free`.
- Kiro web account: oyentv770@gmail.com, free plan, 0/50 credits, user ID `d-9067c98495.04d82458-b051-70bd-86ca-6fff707e3655`. (Kiro Web home shows an upgrade wall for the web app, but the account + CLI free tier are separate.)
- **Non-interactive sessions work** with: `kiro-cli chat --no-interactive --trust-all-tools --trust-workspace --v3 "<prompt>" </dev/null` (output to a log file). Gotcha: without `</dev/null` the session hangs waiting on stdin (looks like a confirmation prompt but is just an open stdin); with a PTY unavailable, `</dev/null` is the fix. Sessions are saved and listed with `kiro-cli chat --list-sessions`; resume with `--resume-id <sess_id>`. Free-plan credit use: 3 sessions + 1 resume used so far (probe OK + session 1 + session 2 + session 2 resume + session 3) — well within 50/month.

## Milestones 1 + 2 — DONE 2026-11-17 (real Kiro agent sessions)
- **M1 login** — committed `61e1814`.
- **Kiro session 1** (sess_424f61d0, "Implement NecroRepo Bus Factor Signal") — review vs spec (5 gaps found + fixed: demo unsorted, share-btn missing, detail-busfactor missing, hook schema wrong, harness in /tmp), bus-factor signal, shareable cemetery via URL hash, hook rewritten to valid v1 schema, harness moved to `tests/dom-harness.cjs`. 35/35 checks. Committed `bf04f28`. Full log: `/tmp/kiro-session1.log`.
- **Kiro session 2** (sess_e6fa4f7c, "Implement NecroRepo Dependency Autopsy") — dependency autopsy (package.json via GitHub contents API + per-dep npm check). **Interrupted mid-run by a runtime restart**; resumed with `--resume-id` and finished (call site, exports, CSS, tests, tasks.md). 57 assertions. Committed `2e76c02`. Full logs: `/tmp/kiro-session2.log` (empty — killed), `/tmp/kiro-session2b.log`.
- **Kiro session 3** (npm publish-date bug fix) — verification found the session-2 code read `meta.time.modified` from the npm `/latest` endpoint, which returns `time: null` — every dep would have scored dead. Fixed to fetch the full packument and read `time[latestVersion]` (fallback `time.modified`) via pure `latestPublishDate()`. Live-verified against the real npm registry (loose-envify 1.4.0 → 2018-07-10 dead; @babel/cli → 2026-11-02 fresh) and the GitHub contents API (facebook/react package.json parses to 20 devDeps). 60 harness checks pass (Kiro reported 59; independent count is 60 `ok:` lines, exit 0). Committed as "Kiro session 3: fix dep autopsy npm publish-date source".
- **Honesty note (updated):** the scaffold (M0) was authored by the agent (Muse), but **all Milestone 2 features were implemented by real Kiro CLI agent sessions** (logged in as oyentv770@gmail.com, sessions listed above). The "built with Kiro" claim for the submission rests on those sessions plus the `.kiro/` spec/steering/agent/hook artefacts.

## Milestone 3a — DONE 2026-11-17 (GitHub repo + Pages + write-up)
- **Public repo created:** https://github.com/emagaul135/necrorepo (created by the user via the cloud browser; the user then approved the `gh` device-flow login, so `gh` is authenticated as emagaul135 with token scopes `gist`, `read:org`, `repo`). Local master pushed: latest commit `11bc3bb` (verified via API: `.kiro/`, `app/`, `docs/`, `tests/`, `README.md`, `LICENSE`, `NOTES.md` all present).
- **GitHub Pages LIVE:** https://emagaul135.github.io/necrorepo/ — verified: index 200, `app.js` 200 (25,974 bytes, byte-identical to local), `styles.css` 200, Pages status `built`, title "NecroRepo — the graveyard where dead code comes back to life".
- **How the deploy works:** Pages serves from branch `master`, path `/docs` (legacy build type, set via `gh api`). The app in `app/` is copied to `docs/` (same 3 files: `index.html`, `styles.css`, `app.js`) — **after any app change, re-copy `app/*` to `docs/` before pushing**, or the live site goes stale. `docs/screenshots/` (demo GIF + PNGs) lives alongside.
- **Why not Actions:** the first attempt used a `.github/workflows/pages.yml` (upload-pages-artifact + deploy-pages), but the push was rejected — the `gh` OAuth token lacks the `workflow` scope ("refusing to allow an OAuth App to create or update workflow `.github/workflows/pages.yml` without `workflow` scope"). The workflow file was dropped. If Actions deploys are ever wanted, run `gh auth refresh -s workflow` (needs the user to re-authorize in the browser).
- **Kiro-usage write-up:** `SUBMISSION.md` in the repo — what the app does, category (Resurrection), how Kiro was used (3 real CLI agent sessions with full IDs: `sess_424f61d0-cba0-46a3-9af4-b3a9ee7734e1`, `sess_e6fa4f7c-ba32-4522-ae5c-95ddcd73286e`, `sess_93308a38-664e-4030-a49b-32d8c7713c5c`; spec-driven dev, steering, custom agent, hook), features, live + repo URLs. Session IDs verified via `kiro-cli chat --list-sessions` run in the repo dir (sessions are scoped per working directory). Note: `/tmp/kiro-session1.log` and `/tmp/kiro-session2.log` were lost to a runtime restart; `session2b` and `session3` logs survive; the git commits are the durable evidence.
- **Still open (M3, by 3 Dec):** demo video <3 min public on YouTube → Devpost submit (Resurrection) → Social Blitz post + bonus blog post → claim 4,000 credits (user's selfie + KTP via Didit, by 1 Dec 12:00 PT).
- **Live-API caveat (unchanged):** in-VM Chromium cannot reach GitHub/npm (egress proxy), so the live API path is verified via curl/Node only; the demo cemetery renders with zero API calls, and the page degrades gracefully. Re-verify the live site from a normal browser before recording the demo video.

## Real-browser visual check (done 2026-11-17)
- Chromium (`/opt/meta-chromium/chrome`, "Muse Browser 157") works again via a recreated WebGL domain-policy file: `~/.local/share/hatch-webgl-policy.txt` (header line `hatch-webgl-allowed-domains-v1` + sorted registrable domain, e.g. `example.com`) + sha256 passed as `--hatch-webgl-allowed-domains-file` / `--hatch-webgl-allowed-domains-sha256` (validate with `--hatch-validate-webgl-allowed-domains --version`). The old one-shot `--screenshot`/`--dump-dom` flags exit silently without output in this build — use the CDP route: launch with `--remote-debugging-port=NNNN` and drive it with the Node CDP scripts in `/tmp` (`/tmp/shoot-necro.mjs` — home/demo/detail screenshots at 1440×900; `/tmp/shoot-live.mjs` — live repo inspect flow).
- **Caveats:** this build blocks `http://localhost` navigation (Local Network Access check) — screenshots were taken via `file:///home/hatch/workspace/kiroween/app/index.html`, which renders identically. The VM's internet goes through an authenticated egress proxy (`$https_proxy`) that Chrome cannot use (`ERR_NO_SUPPORTED_PROXIES`), so in-browser GitHub/npm API calls fail inside this VM's Chromium only — on GitHub Pages / a judge's browser they work normally. The app degrades gracefully everywhere (verified in screenshots: bus factor "unknown", deps "No package.json", forks "Could not search forks" — all inline, nothing breaks).
- **Result:** no horizontal overflow (scrollW == clientW), no layout issues found, dead-first sorting confirmed visually, Copy share link button present, detail panel clean. Screenshots: `docs/screenshots/home.png`, `demo-cemetery.png`, `autopsy-detail.png` + `demo.gif` (ffmpeg slideshow, 720w, 6s). README has a Screenshots section.

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
- **M1 (DONE 2026-11-17):** CLI login → real Kiro agent sessions → hook schema validated.
- **M2 (DONE 2026-11-17):** bus-factor signal, dependency autopsy (package.json), shareable cemetery via URL hash, real-browser visual check + screenshots, README demo GIF/screenshots.
- **M3 (by 3 Dec):** public GitHub repo under the user's account (needs the user — never touch emagaul135 without asking) → GitHub Pages deploy → demo video (<3 min, public YouTube) → Kiro-usage write-up → Devpost submit (Resurrection) → Social Blitz post + bonus blog post → claim 4,000 credits (user ID verification by 1 Dec 12:00 PT).
  - **Update 2026-11-17:** repo created + pushed, Pages LIVE at https://emagaul135.github.io/necrorepo/, SUBMISSION.md written. Remaining: demo video → Devpost submit → Social Blitz + blog → credits claim.

## Open items / risks
- GitHub repo creation + push needs the user (their account emagaul135; never touch without asking). **DONE 2026-11-17 — repo live, code pushed, Pages live (see Milestone 3a above).**
- GitHub API unauthenticated limit is 60 req/hr; a judge inspecting a big user could hit it — the token field + demo mode mitigate, but a cached demo video matters.
- The 4,000-credit claim needs the user's selfie + KTP (Didit) — only the user can do it, deadline 1 Dec 12:00 PT.
- Demo video: needs a real-browser screen recording; the VM's Chromium can screenshot via CDP but cannot reach the internet (egress proxy), so live API calls will show graceful "unknown" states in a VM-recorded video — record the demo from a real browser with internet, or use the demo cemetery + pre-recorded live walkthrough. The GitHub API live path is verified via curl/node, not in the VM browser.
- In-browser live API calls cannot be visually verified on this VM (see visual-check caveats above) — verify once more after the GitHub Pages deploy, from a normal browser.
