# Tasks — NecroRepo

## Milestone 0 — Scaffold (done, 2026-11-17)
- [x] Category research (rules + resources pages) — chose Resurrection
- [x] Repo structure: README, LICENSE (MIT), .gitignore (never ignores .kiro), serve.sh
- [x] `.kiro/steering/` — product, tech, structure
- [x] `.kiro/specs/necrorepo/` — requirements, design, tasks (this file)
- [x] App skeleton: index.html + styles.css + app.js
  - [x] Demo cemetery (8 sample repos, zero API calls)
  - [x] Health scoring with explainable reasons
  - [x] User + single-repo inspection via GitHub API
  - [x] Resurrection candidates (living forks) + adoption checklist
  - [x] localStorage cemetery + one-click re-check (séance)
  - [x] Optional token field for rate limits
- [x] Node tests: scoring assertions + fake-DOM render harness — all passing
- [x] Live GitHub API shape verified with curl

## Milestone 1 — Kiro auth + real Kiro sessions (BLOCKED — needs the user)
- [ ] Log in Kiro CLI: `kiro-cli login --social google --use-device-flow`
      (prints a URL + code; the user opens it in their browser and approves)
- [ ] Run a Kiro agent session in this repo to review the scaffold against the
      spec and implement the Milestone 2 items below (spec-driven: feed it
      `.kiro/specs/necrorepo/` and let it work the task list)
- [ ] Validate `.kiro/hooks/on-save-test.json` against the real Kiro hook schema

## Milestone 2 — Polish to submittable (before 28 Nov)
- [ ] Bus-factor signal (contributors count) in the autopsy
- [ ] Dependency autopsy: paste a repo → autopsy its package.json dependencies
- [ ] Shareable cemetery via URL hash
- [ ] Real-browser visual check (screenshots at 1440×900) + fix any layout issues
- [ ] README demo GIF / screenshots

## Milestone 3 — Publish + submit (before 3 Dec)
- [ ] Create public GitHub repo under the user's account (needs the user — do
      NOT touch emagaul135 without asking) with `/.kiro` at root
- [ ] Deploy to GitHub Pages, verify the live URL works for a stranger
- [ ] Record the <3 min demo video, publish public on YouTube (Abang Oyen TV)
- [ ] Write the Kiro-usage write-up (spec-driven dev, steering, custom agent, hooks)
- [ ] Submit on Devpost (Resurrection) + draft the Social Blitz post
      (#KiroweenHackathon26) and the bonus blog post
- [ ] Claim the 4,000 free Kiro credits — needs the user's ID verification
      (selfie + KTP via Didit) by 1 Dec 2026 12:00 PT / 2 Dec 03:00 WIB
