# Structure — NecroRepo

```
kiroween/                  repo root (this is the GitHub repo to be published)
├── README.md              project overview, run + deploy instructions
├── LICENSE                MIT
├── NOTES.md               build log, concept, decisions, open items
├── serve.sh               local dev server (python http.server on :8130)
├── .gitignore             (never ignores .kiro)
├── .kiro/
│   ├── steering/          product.md, tech.md, structure.md (this file)
│   ├── specs/necrorepo/   requirements.md, design.md, tasks.md
│   ├── agents/            graveyard-reviewer.md (custom review agent)
│   └── hooks/             on-save-test.json (draft — validate schema in Kiro)
└── app/                   the static web app (deploy this folder)
    ├── index.html
    ├── styles.css
    └── app.js             (pure logic exported for node testing)
```

## Rules
- `app/` is self-contained: no imports from outside the folder.
- No build artifacts are committed. If a build step is ever added, its output
  goes in `dist/` and is gitignored.
- `.kiro/` is always committed — Kiroween requires it at the repo root.
- Tests live outside the shipped app: the node harness is documented in
  NOTES.md and kept in /tmp during development.
