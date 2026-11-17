/* NecroRepo — graveyard for dead code.
 * Zero-dependency static app. Talks to the public GitHub REST API v3.
 * Pure logic (scoreRepo / statusOf / busFactor) is exported for node testing via
 * `module.exports` when running outside the browser.
 */
'use strict';

/* ------------------------------------------------------------------ */
/* Demo cemetery — works with zero API calls.                          */
/* ------------------------------------------------------------------ */
const DEMO_CEMETERY = [
  { full_name: 'left-pad/left-pad', name: 'left-pad', description: 'String left pad. Eleven lines that once broke the internet.', pushed_at: '2016-03-22T10:00:00Z', open_issues_count: 4, stargazers_count: 214, forks_count: 31, language: 'JavaScript', archived: false, html_url: 'https://github.com/left-pad/left-pad' },
  { full_name: 'acme/jquery-plugin-2009', name: 'jquery-plugin-2009', description: 'A jQuery carousel from the golden age. Still spins, nobody watches.', pushed_at: '2014-08-11T09:12:00Z', open_issues_count: 87, stargazers_count: 512, forks_count: 96, language: 'JavaScript', archived: false, html_url: 'https://github.com/acme/jquery-plugin-2009' },
  { full_name: 'ghosttown/flash-game-engine', name: 'flash-game-engine', description: 'ActionScript 3 game engine. The Flash is gone; the engine remains.', pushed_at: '2019-01-05T18:40:00Z', open_issues_count: 12, stargazers_count: 1204, forks_count: 210, language: 'ActionScript', archived: true, html_url: 'https://github.com/ghosttown/flash-game-engine' },
  { full_name: 'someone/express-middleware-x', name: 'express-middleware-x', description: 'Tiny Express middleware, still maintained by one stubborn soul.', pushed_at: daysAgoIso(20), open_issues_count: 2, stargazers_count: 89, forks_count: 7, language: 'JavaScript', archived: false, html_url: 'https://github.com/someone/express-middleware-x' },
  { full_name: 'oldcorp/php-cms-2012', name: 'php-cms-2012', description: 'A CMS from 2012. The admin panel still says "Welcome, webmaster".', pushed_at: '2017-11-30T08:00:00Z', open_issues_count: 143, stargazers_count: 340, forks_count: 58, language: 'PHP', archived: false, html_url: 'https://github.com/oldcorp/php-cms-2012' },
  { full_name: 'vim-fan/dotfiles', name: 'dotfiles', description: 'Dotfiles, lovingly updated every full moon.', pushed_at: daysAgoIso(4), open_issues_count: 0, stargazers_count: 45, forks_count: 3, language: 'Shell', archived: false, html_url: 'https://github.com/vim-fan/dotfiles' },
  { full_name: 'retro/bbs-door-games', name: 'bbs-door-games', description: 'Door games for a BBS that has not answered the phone since 2003.', pushed_at: '2009-05-17T12:00:00Z', open_issues_count: 9, stargazers_count: 678, forks_count: 44, language: 'C', archived: false, html_url: 'https://github.com/retro/bbs-door-games' },
  { full_name: 'tiny/react-hooks-lib', name: 'react-hooks-lib', description: 'A hooks library — healthy, but its maintainer is on a long holiday.', pushed_at: daysAgoIso(200), open_issues_count: 18, stargazers_count: 2310, forks_count: 120, language: 'TypeScript', archived: false, html_url: 'https://github.com/tiny/react-hooks-lib' },
];

function daysAgoIso(n) {
  const d = new Date(Date.now() - n * 864e5);
  return d.toISOString();
}

/* ------------------------------------------------------------------ */
/* Autopsy — pure functions.                                           */
/* ------------------------------------------------------------------ */
function monthsSince(iso) {
  if (!iso) return 999;
  return (Date.now() - new Date(iso).getTime()) / (1000 * 60 * 60 * 24 * 30.44);
}

function statusOf(score) {
  if (score >= 80) return 'thriving';
  if (score >= 60) return 'alive';
  if (score >= 40) return 'ailing';
  if (score >= 15) return 'dying';
  return 'dead';
}

/** Score a repo 0–100 and explain why. Input: a GitHub repo object. */
function scoreRepo(r) {
  const reasons = [];
  let score = 100;
  const idle = monthsSince(r.pushed_at);

  if (r.archived) {
    return { score: 0, status: 'dead',
      reasons: ['This repository is archived — officially buried by its maintainer.'] };
  }
  if (idle > 96)      { score -= 95; reasons.push(`No commits for ${Math.floor(idle / 12)} years — this one is long dead.`); }
  else if (idle > 48) { score -= 90; reasons.push(`No commits for ${Math.floor(idle / 12)} years — abandoned.`); }
  else if (idle > 24) { score -= 80; reasons.push(`No commits for ${Math.floor(idle / 12)} years — the maintainer is gone.`); }
  else if (idle > 12) { score -= 65; reasons.push(`No commits for ${Math.floor(idle)} months — the maintainer has moved on.`); }
  else if (idle > 6)  { score -= 45; reasons.push(`No commits for ${Math.floor(idle)} months — silence is settling in.`); }
  else if (idle > 3)  { score -= 25; reasons.push(`No commits for ${Math.floor(idle)} months — worth watching.`); }
  else                { reasons.push(`Active recently — last push ${Math.floor(idle * 30)} days ago.`); }

  if (r.open_issues_count > 100)      { score -= 15; reasons.push(`${r.open_issues_count} open issues — the backlog is haunting this repo.`); }
  else if (r.open_issues_count > 50)  { score -= 10; reasons.push(`${r.open_issues_count} open issues piling up.`); }
  else if (r.open_issues_count === 0) { reasons.push('Zero open issues — tidy, or simply forgotten.'); }

  if ((r.stargazers_count || 0) < 10 && idle > 12) {
    score -= 10; reasons.push('Almost nobody starred it, and nobody maintains it.');
  }
  if ((r.forks_count || 0) === 0 && idle > 12) {
    score -= 5; reasons.push('No forks — nobody has taken up the torch.');
  }
  score = Math.max(0, Math.min(100, score));
  return { score, status: statusOf(score), reasons };
}

/**
 * Extract the last-publish date from an npm packument (full registry doc).
 * Tries meta.time[latestVersion] first, falls back to meta.time.modified,
 * and returns null if neither is available.
 * Pure function — no DOM access.
 * @param {object} meta  Parsed JSON from https://registry.npmjs.org/{pkg}
 * @returns {string|null}  ISO date string, or null.
 */
function latestPublishDate(meta) {
  if (!meta || !meta.time) return null;
  var latestVer = (meta['dist-tags'] && meta['dist-tags'].latest) || meta.version || null;
  if (latestVer && meta.time[latestVer]) return meta.time[latestVer];
  if (meta.time.modified) return meta.time.modified;
  return null;
}

/**
 * Map idle months (since last npm publish) to a dep health status.
 * Mirrors the five health buckets used by scoreRepo / statusOf.
 * Pure function -- no DOM access.
 * @param {number} months  Idle months (use Infinity for unknown/never).
 * @returns {'fresh'|'alive'|'stale'|'dying'|'dead'}
 */
function depStatusOf(months) {
  if (months < 3)  return 'fresh';
  if (months < 6)  return 'alive';
  if (months < 12) return 'stale';
  if (months < 48) return 'dying';
  return 'dead';
}

/**
 * Parse a package.json text and return a flat array of dependency entries
 * (dependencies first, then devDependencies), capped at `limit`.
 * Pure function -- no DOM access.
 * @param {string} jsonText   Raw package.json content (not base64).
 * @param {number} [limit=20]
 * @returns {Array<{name:string, range:string, isDev:boolean}>}
 */
function parsePackageJsonDeps(jsonText, limit) {
  if (limit === undefined) limit = 20;
  var pkg;
  try { pkg = JSON.parse(jsonText); } catch (e) { return []; }
  var out = [];
  var deps    = (pkg && pkg.dependencies)    || {};
  var devDeps = (pkg && pkg.devDependencies) || {};
  var allDeps = Object.keys(deps);
  var allDev  = Object.keys(devDeps);
  for (var i = 0; i < allDeps.length && out.length < limit; i++) {
    out.push({ name: allDeps[i], range: String(deps[allDeps[i]]), isDev: false });
  }
  for (var j = 0; j < allDev.length && out.length < limit; j++) {
    out.push({ name: allDev[j], range: String(devDeps[allDev[j]]), isDev: true });
  }
  return out;
}


/**
 * Map a contributor count to a bus-factor label string.
 * Pure function — no DOM access.
 * @param {number} n  Number of contributors (integer >= 0).
 * @returns {string}
 */
function busFactorLabel(n) {
  if (n === 1) return 'Bus factor 1 — a single keeper. If they leave, the project dies.';
  if (n <= 3)  return `Bus factor ${n} — fragile, a tiny crew.`;
  return `Bus factor ${n} — shared by a crew.`;
}

/* ------------------------------------------------------------------ */
/* GitHub API                                                          */
/* ------------------------------------------------------------------ */
const GH_API = 'https://api.github.com';

function ghHeaders() {
  const token = (document.getElementById('gh-token').value || '').trim();
  const h = { Accept: 'application/vnd.github+json' };
  if (token) h.Authorization = 'Bearer ' + token;
  return h;
}

async function gh(path) {
  const res = await fetch(GH_API + path, { headers: ghHeaders() });
  if (res.status === 403) {
    const remaining = res.headers.get('x-ratelimit-remaining');
    if (remaining === '0') throw new Error('GitHub rate limit reached (60 req/hr without a token). Add a token above, or try the demo cemetery.');
    throw new Error('GitHub refused the request (403).');
  }
  if (res.status === 404) throw new Error('Not found on GitHub — check the name and try again.');
  if (!res.ok) throw new Error('GitHub error ' + res.status + '. Try again in a moment.');
  return res.json();
}

async function fetchUserRepos(user) {
  const repos = await gh(`/users/${encodeURIComponent(user)}/repos?per_page=100&sort=updated`);
  return repos.filter(r => !r.fork);
}

async function fetchRepo(fullName) {
  return gh(`/repos/${fullName}`);
}

/** Find the most alive forks of a repo — candidates for resurrection. */
async function findResurrectionCandidates(repo) {
  const forks = await gh(`/repos/${repo.full_name}/forks?per_page=100&sort=stargazers`);
  return forks
    .filter(f => !f.archived && monthsSince(f.pushed_at) < 12)
    .sort((a, b) => new Date(b.pushed_at) - new Date(a.pushed_at))
    .slice(0, 3);
}

/* ------------------------------------------------------------------ */
/* Cemetery state (localStorage) + URL hash                           */
/* ------------------------------------------------------------------ */
const STORE_KEY = 'necrorepo.cemetery.v1';
let cemetery = loadCemetery();

function loadCemetery() {
  try { return JSON.parse(localStorage.getItem(STORE_KEY) || '[]'); }
  catch (e) { return []; }
}

function saveCemetery() {
  try { localStorage.setItem(STORE_KEY, JSON.stringify(cemetery)); } catch (e) { /* private mode */ }
  updateHash();
  document.getElementById('recheck-btn').disabled = cemetery.length === 0;
  document.getElementById('share-btn').disabled = cemetery.length === 0;
}

/** Encode the current cemetery into the URL hash without a navigation. */
function updateHash() {
  if (cemetery.length === 0) {
    history.replaceState(null, '', window.location.pathname + window.location.search);
    return;
  }
  const encoded = cemetery.map(r => encodeURIComponent(r.full_name)).join(',');
  history.replaceState(null, '', '#cemetery=' + encoded);
}

/** Read a cemetery list from the URL hash, or return null. */
function hashRepos() {
  const hash = window.location.hash;
  if (!hash.startsWith('#cemetery=')) return null;
  const raw = hash.slice('#cemetery='.length);
  if (!raw) return null;
  return raw.split(',').map(decodeURIComponent).filter(Boolean);
}

/* ------------------------------------------------------------------ */
/* Rendering helpers                                                   */
/* ------------------------------------------------------------------ */
function fmtDate(iso) {
  if (!iso) return 'unknown';
  return new Date(iso).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
}

function escapeHtml(s) {
  return String(s == null ? '' : s)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}

function renderCemetery(title) {
  const grid = document.getElementById('cemetery');
  const count = document.getElementById('cemetery-count');
  const empty = document.getElementById('cemetery-empty');
  if (title) document.getElementById('cemetery-title').textContent = title;
  count.textContent = cemetery.length ? `${cemetery.length} soul${cemetery.length === 1 ? '' : 's'} buried` : '';
  empty.style.display = cemetery.length ? 'none' : 'block';
  grid.innerHTML = cemetery.map((r, i) => {
    const a = scoreRepo(r);
    return `<article class="tombstone" data-i="${i}" tabindex="0" role="button"
        aria-label="${escapeHtml(r.full_name)}, ${a.status}, score ${a.score}">
      <div class="rip">R.I.P.</div>
      <h3>${escapeHtml(r.name)}</h3>
      <span class="badge badge-${a.status}">${a.status}</span>
      <p class="desc">${escapeHtml(r.description || 'No epitaph left behind.')}</p>
      <div class="meta">Last rites: ${fmtDate(r.pushed_at)} · ★ ${r.stargazers_count || 0}</div>
      <div class="health-bar"><span class="hp-${a.status}" style="width:${a.score}%"></span></div>
    </article>`;
  }).join('');
  grid.querySelectorAll('.tombstone').forEach(el => {
    el.addEventListener('click', () => showDetail(+el.dataset.i));
    el.addEventListener('keydown', e => { if (e.key === 'Enter') showDetail(+el.dataset.i); });
  });
}

function setStatus(msg) { document.getElementById('status-line').textContent = msg || ''; }

/* ------------------------------------------------------------------ */
/* Detail panel                                                        */
/* ------------------------------------------------------------------ */
async function showDetail(i) {
  const r = cemetery[i];
  if (!r) return;
  const a = scoreRepo(r);
  const panel = document.getElementById('detail');
  document.getElementById('detail-name').textContent = '⚰️ ' + r.full_name;
  document.getElementById('detail-epitaph').textContent = r.description || 'No epitaph left behind.';
  document.getElementById('detail-score').textContent = a.score + ' / 100 — ' + a.status;
  document.getElementById('detail-push').textContent = fmtDate(r.pushed_at);
  document.getElementById('detail-issues').textContent = r.open_issues_count;
  document.getElementById('detail-stars').textContent = r.stargazers_count || 0;
  document.getElementById('detail-forks').textContent = r.forks_count || 0;
  document.getElementById('detail-lang').textContent = r.language || '—';
  document.getElementById('detail-reasons').innerHTML =
    a.reasons.map(x => `<li>${escapeHtml(x)}</li>`).join('');
  document.getElementById('detail-gh-link').href = r.html_url || ('https://github.com/' + r.full_name);

  // Bus-factor signal — fetch contributors, then update the element.
  const bfEl = document.getElementById('detail-busfactor');
  bfEl.textContent = '👥 Bus factor: loading…';
  fetchBusFactor(r.full_name).then(label => {
    bfEl.textContent = '👥 ' + label;
  }).catch(() => {
    bfEl.textContent = '👥 Bus factor unknown — could not read contributors.';
  });

  // Dependency autopsy — fires async, never breaks the panel.
  loadDependencyAutopsy(r.full_name, a.status).catch(() => {
    const c = document.getElementById('detail-deps-container');
    if (c) c.innerHTML = '<p>Dependency autopsy unavailable.</p>';
  });

  panel.hidden = false;
  panel.scrollIntoView({ behavior: 'smooth', block: 'start' });

  const steps = document.getElementById('resurrect-steps');
  const note = document.getElementById('resurrect-note');
  const cand = document.getElementById('resurrect-candidates');
  steps.innerHTML = ''; cand.innerHTML = '';
  if (a.status === 'thriving' || a.status === 'alive') {
    note.textContent = 'This one is still breathing. No resurrection needed — just keep an eye on it.';
    return;
  }
  note.textContent = 'This project is ' + a.status + '. Here is how to bring it back:';
  steps.innerHTML = [
    'Fork the most alive fork below (or the original, if no fork is alive).',
    'Open an issue saying you intend to maintain it — give the old maintainer a chance to hand over the keys.',
    'Close the rot: triage open issues, update the README, cut a fresh release.',
    'Tell the world: post the revival so the old users can find their way home.',
  ].map(s => `<li>${escapeHtml(s)}</li>`).join('');
  cand.innerHTML = '<p>🔍 Searching for living forks…</p>';
  try {
    const forks = await findResurrectionCandidates(r);
    cand.innerHTML = forks.length
      ? forks.map(f => `<div class="candidate">✨ <a href="${escapeHtml(f.html_url)}" target="_blank" rel="noopener">${escapeHtml(f.full_name)}</a>
          — ★ ${f.stargazers_count || 0}, last push ${fmtDate(f.pushed_at)}<br>
          <span>${escapeHtml(f.description || 'No description.')}</span></div>`).join('')
      : '<p>No living fork found. This one needs a hero — maybe you. Fork the original and become its keeper.</p>';
  } catch (e) {
    cand.innerHTML = `<p>Could not search forks: ${escapeHtml(e.message)}</p>`;
  }
}

/**
 * Fetch contributor count for a repo and return the bus-factor label.
 * Never throws — on any failure, returns the "unknown" string.
 */
async function fetchBusFactor(fullName) {
  const contributors = await gh(`/repos/${fullName}/contributors?per_page=100`);
  if (!Array.isArray(contributors)) throw new Error('unexpected response');
  return busFactorLabel(contributors.length);
}

/* ------------------------------------------------------------------ */
/**
 * Fetch and render the dependency autopsy for a repo into #detail-deps-container.
 * Shows up to 20 deps (dependencies first, devDependencies second).
 * Never throws -- on any failure, the section shows an inline error message.
 *
 * @param {string} fullName  "owner/repo"
 * @param {string} status    Current repo status ('thriving'|'alive'|'ailing'|'dying'|'dead')
 */
async function loadDependencyAutopsy(fullName, status) {
  const container = document.getElementById('detail-deps-container');
  if (!container) return;

  if (status === 'thriving' || status === 'alive') {
    container.innerHTML = '<p class="dep-skip">This project is healthy — dep autopsy skipped.</p>';
    return;
  }

  container.innerHTML = '<p>🔬 Examining dependencies…</p>';

  try {
    // Fetch package.json via GitHub contents API.
    var pkgData;
    try {
      pkgData = await gh('/repos/' + encodeURIComponent(fullName.split('/')[0]) +
        '/' + encodeURIComponent(fullName.split('/')[1]) + '/contents/package.json');
    } catch (e) {
      container.innerHTML = '<p>No package.json — nothing to autopsy.</p>';
      return;
    }

    if (!pkgData || !pkgData.content) {
      container.innerHTML = '<p>No package.json — nothing to autopsy.</p>';
      return;
    }

    var jsonText;
    try {
      // GitHub base64 includes newlines; strip them before decoding.
      jsonText = atob(pkgData.content.replace(/\s/g, ''));
    } catch (e) {
      container.innerHTML = '<p>Could not decode package.json.</p>';
      return;
    }

    var deps = parsePackageJsonDeps(jsonText, 20);
    if (!deps.length) {
      container.innerHTML = '<p>No package.json — nothing to autopsy.</p>';
      return;
    }

    // Build the table header immediately so the user sees something while we fetch.
    container.innerHTML = '<p>🔍 Checking ' + deps.length + ' package' +
      (deps.length === 1 ? '' : 's') + ' on npm…</p>';

    // Fetch each package's npm metadata in parallel.
    var rows = await Promise.all(deps.map(async function(dep) {
      try {
        // Fetch the full packument — /latest omits the time map entirely.
        var res = await fetch('https://registry.npmjs.org/' + encodeURIComponent(dep.name));
        if (!res.ok) throw new Error('status ' + res.status);
        var meta = await res.json();
        var latestVer   = (meta['dist-tags'] && meta['dist-tags'].latest) || meta.version || '?';
        var lastPublish = latestPublishDate(meta);
        var idle        = lastPublish ? monthsSince(lastPublish) : Infinity;
        var st          = depStatusOf(idle);
        var dateStr     = lastPublish ? new Date(lastPublish).toLocaleDateString('en-US',
          { year: 'numeric', month: 'short', day: 'numeric' }) : 'unknown';
        var npmUrl = 'https://www.npmjs.com/package/' + encodeURIComponent(dep.name);
        return { dep: dep, latestVer: latestVer, dateStr: dateStr, status: st, ok: true };
      } catch (e) {
        return { dep: dep, latestVer: '?', dateStr: 'unknown', status: 'unknown', ok: false };
      }
    }));

    var HTML = '<table class="dep-table"><thead><tr>' +
      '<th>Package</th><th>Pinned</th><th>Latest</th><th>Last publish</th><th>Status</th>' +
      '</tr></thead><tbody>';
    for (var i = 0; i < rows.length; i++) {
      var row = rows[i];
      var npmUrl = 'https://www.npmjs.com/package/' + encodeURIComponent(row.dep.name);
      var devMark = row.dep.isDev ? '<span class="dep-dev">dev</span> ' : '';
      if (!row.ok) {
        HTML += '<tr><td>' + devMark + '<a href="' + escapeHtml(npmUrl) + '" target="_blank" rel="noopener">' +
          escapeHtml(row.dep.name) + '</a></td>' +
          '<td>' + escapeHtml(row.dep.range) + '</td>' +
          '<td colspan="3">unknown — could not check</td></tr>';
      } else {
        HTML += '<tr><td>' + devMark + '<a href="' + escapeHtml(npmUrl) + '" target="_blank" rel="noopener">' +
          escapeHtml(row.dep.name) + '</a></td>' +
          '<td>' + escapeHtml(row.dep.range) + '</td>' +
          '<td>' + escapeHtml(row.latestVer) + '</td>' +
          '<td>' + escapeHtml(row.dateStr) + '</td>' +
          '<td><span class="badge badge-' + escapeHtml(row.status) + '">' +
          escapeHtml(row.status) + '</span></td></tr>';
      }
    }
    HTML += '</tbody></table>';
    container.innerHTML = HTML;
  } catch (e) {
    container.innerHTML = '<p>Dependency autopsy failed: ' + escapeHtml(e.message) + '</p>';
  }
}

/* Wiring (browser only — skipped under node for testing)              */
/* ------------------------------------------------------------------ */
if (typeof document !== 'undefined') {
document.getElementById('inspect-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const kind = document.getElementById('inspect-kind').value;
  const target = document.getElementById('inspect-target').value.trim();
  if (!target) return;
  setStatus('🔮 Consulting the spirits…');
  try {
    if (kind === 'user') {
      const repos = await fetchUserRepos(target);
      if (!repos.length) { setStatus('No public, non-fork repos found for that user.'); return; }
      cemetery = repos.sort((a, b) => scoreRepo(a).score - scoreRepo(b).score);
      saveCemetery();
      renderCemetery('⚰️ The cemetery of @' + target);
      setStatus(`Autopsy complete: ${cemetery.length} repos examined. The dead are on the left.`);
    } else {
      if (!/^[^/\s]+\/[^/\s]+$/.test(target)) { setStatus('Use the form owner/repo, e.g. facebook/react.'); return; }
      const repo = await fetchRepo(target);
      cemetery = [repo];
      saveCemetery();
      renderCemetery('⚰️ Autopsy: ' + target);
      setStatus('Autopsy complete.');
      showDetail(0);
    }
  } catch (err) {
    setStatus('☠ ' + err.message);
  }
});

document.getElementById('demo-btn').addEventListener('click', () => {
  cemetery = DEMO_CEMETERY.slice().sort((a, b) => scoreRepo(a).score - scoreRepo(b).score);
  saveCemetery();
  renderCemetery('⚰️ The demo cemetery');
  setStatus('Demo cemetery raised — eight sample souls, no API calls needed.');
});

document.getElementById('recheck-btn').addEventListener('click', async () => {
  if (!cemetery.length) return;
  setStatus('🔮 Re-checking every soul…');
  try {
    const fresh = [];
    for (const r of cemetery) {
      try { fresh.push(await fetchRepo(r.full_name)); }
      catch (e) { fresh.push(r); } // keep the old record if the API fails
    }
    cemetery = fresh.sort((a, b) => scoreRepo(a).score - scoreRepo(b).score);
    saveCemetery();
    renderCemetery();
    setStatus('Séance complete — the cemetery is up to date.');
  } catch (err) {
    setStatus('☠ ' + err.message);
  }
});

document.getElementById('detail-close').addEventListener('click', () => {
  document.getElementById('detail').hidden = true;
});

document.getElementById('share-btn').addEventListener('click', async () => {
  if (!cemetery.length) return;
  const url = window.location.href;
  try {
    await navigator.clipboard.writeText(url);
    setStatus('Share link copied.');
  } catch (e) {
    setStatus('Share link: ' + url);
  }
});

/* Init — load from URL hash first, then localStorage. */
(async function init() {
  const fromHash = hashRepos();
  if (fromHash && fromHash.length > 0) {
    setStatus(`Loading ${fromHash.length} repos from shared link…`);
    const loaded = [];
    const failed = [];
    for (const name of fromHash) {
      try { loaded.push(await fetchRepo(name)); }
      catch (e) { failed.push(name); }
    }
    cemetery = loaded.sort((a, b) => scoreRepo(a).score - scoreRepo(b).score);
    saveCemetery();
    renderCemetery('⚰️ Shared cemetery');
    if (failed.length) {
      setStatus(`Loaded ${loaded.length} repo${loaded.length === 1 ? '' : 's'}. Could not fetch: ${failed.join(', ')}.`);
    } else {
      setStatus(`Loaded ${loaded.length} repo${loaded.length === 1 ? '' : 's'} from shared link.`);
    }
  } else {
    saveCemetery();
    renderCemetery();
  }
})();
} // end browser-only wiring

/* Node test export (ignored in the browser). */
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { scoreRepo, statusOf, monthsSince, busFactorLabel, depStatusOf, parsePackageJsonDeps, latestPublishDate, DEMO_CEMETERY, renderCemetery, showDetail };
}
