# NecroRepo — Kiroween 2026 Submission

**Category:** Resurrection
**Live app:** https://emagaul135.github.io/necrorepo/
**Repository:** https://github.com/emagaul135/necrorepo
**Demo video:** _to be added (under 3 minutes, public on YouTube)_

## What it does

NecroRepo is the graveyard where dead code comes back to life. Paste a GitHub
username or an `owner/repo` and it performs an autopsy on each repository:

- **Health score 0–100** with a status — Thriving, Alive, Ailing, Dying or
  Dead — and human-readable reasons for every score (idle time, open issues,
  archived state).
- **Bus-factor signal** — how many contributors a repo actually has, so you
  can tell whether it depends on a single person.
- **Dependency autopsy** — reads a repo's `package.json` and checks each
  dependency's last publish date on the npm registry, flagging fresh, stale,
  dying or dead packages.
- **Resurrection plan** — for dead or dying repos, it finds the most alive
  fork (unarchived, recently pushed, ordered by recency) and gives a 4-step
  adoption checklist so you can switch to living code instead of forking a
  corpse.
- **Cemetery** — inspected repos are saved in localStorage and can be
  re-checked with one click ("séance"); a cemetery can be shared with a URL
  hash (`#cemetery=owner/repo,...`).
- **Demo cemetery** — 8 sample repos render instantly with zero API calls,
  so the app always has something to show even without network access.

Abandoned open-source projects are dead technology: every developer has been
burned by a dependency whose maintainer walked away (left-pad, Log4Shell,
event-stream). Existing tools report versions and vulnerabilities; none frame
abandonment as death and hand you a one-click path to the living fork.
NecroRepo does exactly that — the graveyard metaphor is the interface, not
decoration: tombstones are repo cards, the health bar is the grave's
condition, and the séance is the re-check.

## How it was built with Kiro

The app was built with the **Kiro CLI** (logged in as oyentv770@gmail.com,
free plan), using spec-driven development:

- **Spec first.** The product was specified in `.kiro/specs/necrorepo/`
  (`requirements.md` in EARS style, `design.md`, `tasks.md` with milestones
  0–3) before implementation, and the Kiro agent sessions worked through that
  task list.
- **Steering docs.** `.kiro/steering/` holds the product, tech and structure
  guidance every session followed (static site, zero dependencies, no CDN or
  trackers, graceful degradation when an API is unreachable).
- **Real Kiro agent sessions.** All feature work after the initial scaffold
  was implemented by Kiro CLI agent sessions, run non-interactively with
  `kiro-cli chat --no-interactive --trust-all-tools --trust-workspace --v3`
  (verifiable with `kiro-cli chat --list-sessions` in this repo):
  - `sess_424f61d0-cba0-46a3-9af4-b3a9ee7734e1` — "Implement NecroRepo Bus
    Factor Signal": reviewed the scaffold against the spec, found and fixed
    5 gaps, implemented the bus-factor signal, the shareable cemetery URL
    hash, and fixed the on-save hook. 35/35 checks. Commit `bf04f28`.
  - `sess_e6fa4f7c-ba32-4522-ae5c-95ddcd73286e` — "Implement NecroRepo
    Dependency Autopsy": dependency autopsy via the GitHub contents API and
    the npm registry. 57 assertions. Commit `2e76c02`. (Interrupted mid-run
    by a runtime restart; resumed with `--resume-id` and finished.)
  - `sess_93308a38-664e-4030-a49b-32d8c7713c5c` — "Fix NecroRepo Dependency
    Autopsy Bug": verification caught that the autopsy read
    `meta.time.modified` from the npm `/latest` endpoint, which returns
    `time: null` — every dependency would have scored dead. Fixed to fetch
    the full packument and read `time[latestVersion]`, live-verified against
    the real npm registry. Commit `57048fc`.
- **Custom agent.** `.kiro/agents/graveyard-reviewer.md` defines a review
  agent used to check the implementation against the spec.
- **Agent hook.** `.kiro/hooks/on-save-test.json` is a `PostFileSave` hook
  (schema v1) that runs `node --check app/app.js && node
  tests/dom-harness.cjs` on every save of `app/*`.
- **Tests.** `tests/dom-harness.cjs` is a 60-check fake-DOM harness that runs
  in Node with no browser; it passes with exit 0.

Honest note: the initial skeleton (Milestone 0) was authored by the
developer's other AI assistant; every feature in Milestones 1–2 was
implemented by the Kiro CLI agent sessions listed above. The "built with
Kiro" claim rests on those sessions plus the `.kiro/` spec, steering, agent
and hook artefacts in this repository.

## Tech

- Static site, zero dependencies, no build step: `app/index.html`,
  `app/styles.css`, `app/app.js`.
- Data: GitHub REST API (public repos, contents, forks, contributors) and
  the npm registry — no backend, no keys stored. An optional personal access
  token field (Bearer auth, never stored) lifts the 60 req/hr unauthenticated
  GitHub rate limit.
- Hosting: GitHub Pages, deployed automatically by
  `.github/workflows/pages.yml` on every push to `master`.

## How to try it

1. Open https://emagaul135.github.io/necrorepo/
2. Click **"Open the demo cemetery"** — 8 sample repos appear instantly, no
   API calls needed.
3. Or type a GitHub username (e.g. `torvalds`) or a repo (`owner/repo`) and
   click **"Inspect"** — tombstones appear dead-first, with scores, reasons,
   bus factor, dependency autopsy and resurrection plans.
4. Click a tombstone for the full autopsy, or **"Copy share link"** to share
   your cemetery.

## Verification

- `node --check app/app.js` — clean.
- `node tests/dom-harness.cjs` — 60 checks, 0 failures, exit 0.
- Live GitHub API and npm registry shapes verified with curl/Node.
- Real-browser visual check (Chromium, 1440×900): no horizontal overflow,
  dead-first sorting confirmed, detail panel clean. Screenshots in
  `docs/screenshots/`.
