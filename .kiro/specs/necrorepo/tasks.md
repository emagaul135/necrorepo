# Tasks — NecroRepo

## Milestone 0 — Scaffold (done, 2026-11-17)
- [x] Category research (rules + resources pages) — chose Resurrection
- [x] Repo structure: README, LICENSE (MIT), .gitignore (never ignores .kiro), serve.sh
- [x] .kiro/steering/ — product, tech, structure
- [x] .kiro/specs/necrorepo/ — requirements, design, tasks (this file)
- [x] App skeleton: index.html + styles.css + app.js
  - [x] Demo cemetery (8 sample repos, zero API calls)
  - [x] Health scoring with explainable reasons
  - [x] User + single-repo inspection via GitHub API
  - [x] Resurrection candidates (living forks) + adoption checklist
  - [x] localStorage cemetery + one-click re-check (seance)
  - [x] Optional token field for rate limits
- [x] Node tests: scoring assertions + fake-DOM render harness — all passing
- [x] Live GitHub API shape verified with curl

## Milestone 1 — Kiro auth + real Kiro sessions (DONE 2026-11-17)
- [x] Log in Kiro CLI via device flow — email: oyentv770@gmail.com, free plan
- [x] Run a Kiro agent session to review scaffold and implement Milestone 2 items
- [x] Validate .kiro/hooks/on-save-test.json against the real Kiro hook schema

## Milestone 2 — Polish to submittable (before 28 Nov)
- [x] Bus-factor signal (contributors count) in the autopsy
- [x] Dependency autopsy: paste a repo -> autopsy its package.json dependencies
- [x] Shareable cemetery via URL hash
- [ ] Real-browser visual check (screenshots at 1440x900) + fix any layout issues
- [ ] README demo GIF / screenshots

## Milestone 3 — Publish + submit (before 3 Dec)
- [ ] Create public GitHub repo under the user account (needs the user) with /.kiro at root
- [ ] Deploy to GitHub Pages, verify the live URL works for a stranger
- [ ] Record the <3 min demo video, publish public on YouTube (Abang Oyen TV)
- [ ] Write the Kiro-usage write-up
- [ ] Submit on Devpost (Resurrection) + Social Blitz post (#KiroweenHackathon26) + blog post
- [ ] Claim 4,000 free Kiro credits (ID verification by 1 Dec 2026 12:00 PT)
