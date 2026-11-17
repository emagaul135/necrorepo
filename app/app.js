/* NecroRepo — graveyard for dead code.
 * Zero-dependency static app. Talks to the public GitHub REST API v3.
 * Pure logic (scoreRepo / statusOf) is exported for node testing via
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
/* Cemetery state (localStorage) + rendering                           */
/* ------------------------------------------------------------------ */
const STORE_KEY = 'necrorepo.cemetery.v1';
let cemetery = loadCemetery();

function loadCemetery() {
  try { return JSON.parse(localStorage.getItem(STORE_KEY) || '[]'); }
  catch (e) { return []; }
}
function saveCemetery() {
  try { localStorage.setItem(STORE_KEY, JSON.stringify(cemetery)); } catch (e) { /* private mode */ }
  document.getElementById('recheck-btn').disabled = cemetery.length === 0;
}

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

/* ------------------------------------------------------------------ */
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
  cemetery = DEMO_CEMETERY.slice();
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

/* Init */
saveCemetery();
renderCemetery();
} // end browser-only wiring

/* Node test export (ignored in the browser). */
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { scoreRepo, statusOf, monthsSince, DEMO_CEMETERY, renderCemetery, showDetail };
}
