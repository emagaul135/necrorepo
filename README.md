# NecroRepo — the graveyard where dead code comes back to life

> **Kiroween 2026 · Category: Resurrection**
> Every year, thousands of open-source projects die quietly: the maintainer moves on,
> issues pile up, and the code rots. NecroRepo is a graveyard — and a resurrection
> clinic — for abandoned code. Paste a GitHub username or a repo, get an honest
> autopsy, and find the maintained fork that can bring it back to life.

## What it does

1. **Inspect** — enter a GitHub username or `owner/repo`. NecroRepo reads the public
   GitHub API and performs an *autopsy*: last push, open issues, stars, archived state.
2. **Diagnose** — each repo gets a health score (0–100) and a status:
   `Thriving` · `Alive` · `Ailing` · `Dying` · `Dead` (buried). Dead repos become
   tombstones in your cemetery.
3. **Resurrect** — for dead or dying repos, NecroRepo finds the most alive fork
   (recent pushes + stars) and gives you an adoption checklist: fork it, revive the
   README, close the rot, publish a release.
4. **Remember** — your cemetery is saved in the browser (localStorage). Come back
   anytime for a *séance* — a one-click re-check of everything you buried.

No sign-up, no server, no data leaves your browser except calls to the public
GitHub API. Add an optional personal access token if you hit the unauthenticated
rate limit (60 requests/hour).

## Try it

```bash
# from this repo root
./serve.sh
# then open http://localhost:8130
```

Or just open `app/index.html` in a browser (the demo cemetery works offline;
live GitHub inspection needs `http://` because of `fetch`).

Click **"Open the demo cemetery"** to see it work with zero API calls.

## Deploy

It is a zero-dependency static site. Any static host works; GitHub Pages is the
intended one:

- Settings → Pages → deploy from the `app/` folder (or repo root with `app/` as source).

## Stack

- Vanilla HTML/CSS/JS — no build step, no framework, no backend.
- GitHub REST API v3 (public endpoints, unauthenticated by default).
- `localStorage` for the cemetery watchlist.

## Built with Kiro

This project was built with Kiro using spec-driven development. See
[`.kiro/specs/necrorepo/`](.kiro/specs/necrorepo/) for the requirements, design and
task list, [`.kiro/steering/`](.kiro/steering/) for the product/tech/structure
steering docs, and [`.kiro/agents/`](.kiro/agents/) for the custom review agent.
The build story is in `NOTES.md`.

## License

MIT — see [LICENSE](LICENSE).
