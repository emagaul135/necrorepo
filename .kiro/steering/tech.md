# Tech — NecroRepo

## Stack (deliberately boring)
- **Vanilla HTML/CSS/JS, zero dependencies, no build step.** The app must run
  by opening a static file or any static host (GitHub Pages). No framework
  churn, no build to break during judging.
- **GitHub REST API v3** (public endpoints only). Unauthenticated by default
  (60 req/hr); optional personal access token field in the UI raises the
  limit. All calls are `GET`; nothing is written to GitHub.
- **localStorage** for the cemetery watchlist. No account, no server, no
  tracking. All user data stays in the browser.

## Key decisions
- **Static first:** judges must be able to run the app from the repo with no
  install step. A backend would add hosting risk for zero product value.
- **Demo mode is a first-class feature:** the demo cemetery uses embedded
  sample data, so the app is fully demonstrable even if the GitHub API is
  unreachable or rate-limited (e.g. during the demo video).
- **Graceful degradation everywhere:** a failed fork lookup shows a message,
  never a blank panel; a failed repo fetch keeps the old record.
- **Pure logic is testable in node:** `scoreRepo`, `statusOf` and the render
  path are exported via `module.exports` and covered by `/tmp/dom-harness.cjs`
  (kept out of the repo; the checks are documented in NOTES.md).

## Conventions
- American English in UI and docs; dates rendered with `toLocaleDateString('en-US')`.
- No third-party fonts, trackers, or CDNs — the app works offline except for
  the GitHub API calls.
- Accessibility: tombstones are keyboard-focusable (`tabindex`, Enter to open),
  status is text as well as colour, `role="status"` on the status line.
