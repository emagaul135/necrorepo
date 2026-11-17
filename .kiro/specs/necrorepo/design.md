# Design — NecroRepo

## Overview
A single-page static app. Three layers, no framework:
`index.html` (structure) → `styles.css` (graveyard theme) → `app.js`
(state + GitHub API + rendering). All state lives in one `cemetery` array,
persisted to localStorage.

## Components

### 1. Séance form (`#inspect-form`)
- Mode select (user vs single repo), text input, submit button.
- Optional token field (password input, never stored — read fresh per request).
- Demo button (renders embedded sample data, no network).
- Re-check button (disabled when the cemetery is empty).

### 2. Cemetery grid (`#cemetery`)
- One `.tombstone` article per repo: RIP marker, name, status badge,
  description (clamped to 2 lines), last-push date + stars, health bar.
- Sorted by health score ascending (dead first) — the worst news is the
  most visible, which is the point of the product.
- Click / Enter opens the detail panel.

### 3. Detail panel (`#detail`)
- Autopsy table: score, last push, open issues, stars, forks, language.
- Human-readable reasons list (from `scoreRepo`).
- Resurrection plan: 4-step checklist + living-fork search (forks endpoint,
  filtered to unarchived forks pushed within 12 months, top 3 by recency).

## Data flow
```
user input → gh() [fetch + error mapping] → scoreRepo() per repo
         → cemetery[] → saveCemetery() → renderCemetery()
click tombstone → showDetail(i) → findResurrectionCandidates()
```

## Scoring model (`scoreRepo`)
Start at 100. Archived → 0 immediately. Idle-time penalty is graduated
(>3mo −25 … >96mo −95) so a decade of silence is fatal but a 4-month pause
is only a warning. Open-issue load penalises neglect (>50 −10, >100 −15).
Result clamped 0–100, mapped to 5 statuses. Every deduction appends a
human-readable reason — the score is always explainable.

## Error handling
- 403 with `x-ratelimit-remaining: 0` → rate-limit message + token/demo suggestion.
- 404 → "not found" message. Other non-2xx → generic retry message.
- Fork search failure → inline message, never a broken panel.
- Re-check failure for one repo → keep the stale record, continue with the rest.

## Testing
- Pure logic (`scoreRepo`, `statusOf`) is unit-tested in node.
- The render path is exercised with a fake-DOM harness (`/tmp/dom-harness.cjs`):
  init empty state, demo-cemetery click (8 tombstones, badges, health bars,
  localStorage write), detail panel open + graceful fork-search failure.
- Live GitHub API shape verified with curl against `facebook/react`
  (fields used: full_name, name, description, pushed_at, open_issues_count,
  stargazers_count, forks_count, language, archived, html_url).
- Headless-browser render could NOT be run on this VM: the Hatch Chromium
  build refuses to start without its WebGL domain-policy file
  (`hatch-webgl-all-origins-v1`), which is no longer on disk. Re-verify in a
  real browser before recording the demo video.

## Future work (post-skeleton, pre-submission)
- Contributor/bus-factor signal (contributors endpoint, Link-header count).
- Dependency graph view: inspect a repo's `package.json` dependencies and
  autopsy each one.
- "Adopt" flow: one-click fork via GitHub OAuth (needs a backend or device
  flow — deferred; links out to GitHub for now).
- Shareable cemetery link (encode repo list in the URL hash).
- Dark/light "daylight" toggle for accessibility (theme is dark-only today).
