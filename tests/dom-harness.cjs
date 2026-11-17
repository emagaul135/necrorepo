// Minimal fake-DOM harness: loads app/app.js in node and exercises the
// render path (demo cemetery click) without a browser.
// Run from the repo root: node tests/dom-harness.cjs
'use strict';
const path = require('path');
const { createRequire } = require('module');
const require2 = createRequire(__filename);

function fakeEl(id) {
  const listeners = {};
  const el = {
    id, style: {}, dataset: {}, value: '', textContent: '',
    hidden: false, disabled: false, href: '', _html: '', listeners,
    addEventListener: (type, fn) => { (listeners[type] = listeners[type] || []).push(fn); },
    querySelectorAll: () => [],
    scrollIntoView: () => {},
  };
  Object.defineProperty(el, 'innerHTML', {
    get() { return el._html; },
    set(v) { el._html = String(v); },
  });
  return el;
}

const ids = [
  'inspect-form','inspect-kind','inspect-target','gh-token','demo-btn',
  'recheck-btn','share-btn','status-line','cemetery','cemetery-count',
  'cemetery-empty','cemetery-title','detail','detail-close','detail-name',
  'detail-epitaph','detail-score','detail-push','detail-issues','detail-stars',
  'detail-forks','detail-lang','detail-busfactor','detail-reasons',
  'detail-gh-link','resurrect-note','resurrect-steps','resurrect-candidates',
  'detail-deps','detail-deps-container',
];
const els = {};
for (const id of ids) els[id] = fakeEl(id);

global.document = { getElementById: (id) => els[id] || fakeEl(id) };
const store = {};
global.localStorage = {
  getItem: (k) => (k in store ? store[k] : null),
  setItem: (k, v) => { store[k] = String(v); },
};
global.window = {
  location: { hash: '', pathname: '/', search: '', href: 'http://localhost/' },
};
global.history = { replaceState: () => {} };
Object.defineProperty(global, "navigator", { value: { clipboard: { writeText: async () => {} } }, writable: true, configurable: true });
// Suppress fetch so init async path exits cleanly (no network).
global.fetch = async () => { throw new Error('no network in harness'); };

const appPath = path.resolve(__dirname, '..', 'app', 'app.js');
const app = require2(appPath);

const t = (c, m) => {
  if (!c) { console.error('FAIL:', m); process.exitCode = 1; }
  else console.log('ok:', m);
};

// --- Pure-logic assertions ---
const archived = app.scoreRepo({ archived: true });
t(archived.score === 0 && archived.status === 'dead', 'archived repo scores 0/dead');

const ancient = app.scoreRepo({ pushed_at: '2009-01-01T00:00:00Z', archived: false,
  open_issues_count: 9, stargazers_count: 678, forks_count: 44 });
t(ancient.status === 'dead', 'ancient repo (2009) is dead');

const recent = app.scoreRepo({ pushed_at: new Date(Date.now() - 5 * 864e5).toISOString(),
  archived: false, open_issues_count: 0, stargazers_count: 100, forks_count: 10 });
t(recent.status === 'thriving', 'recently pushed repo is thriving');

const ailing200 = app.scoreRepo({ pushed_at: new Date(Date.now() - 200 * 864e5).toISOString(),
  archived: false, open_issues_count: 18, stargazers_count: 2310, forks_count: 120 });
t(ailing200.status === 'ailing', '200-day idle repo is ailing');

t(app.statusOf(100) === 'thriving', 'statusOf 100 = thriving');
t(app.statusOf(80)  === 'thriving', 'statusOf 80 = thriving');
t(app.statusOf(79)  === 'alive',    'statusOf 79 = alive');
t(app.statusOf(60)  === 'alive',    'statusOf 60 = alive');
t(app.statusOf(59)  === 'ailing',   'statusOf 59 = ailing');
t(app.statusOf(40)  === 'ailing',   'statusOf 40 = ailing');
t(app.statusOf(39)  === 'dying',    'statusOf 39 = dying');
t(app.statusOf(15)  === 'dying',    'statusOf 15 = dying');
t(app.statusOf(14)  === 'dead',     'statusOf 14 = dead');
t(app.statusOf(0)   === 'dead',     'statusOf 0 = dead');

// busFactorLabel
t(app.busFactorLabel(1) === 'Bus factor 1 \u2014 a single keeper. If they leave, the project dies.',
  'busFactorLabel(1) correct');
t(app.busFactorLabel(2) === 'Bus factor 2 \u2014 fragile, a tiny crew.', 'busFactorLabel(2) correct');
t(app.busFactorLabel(3) === 'Bus factor 3 \u2014 fragile, a tiny crew.', 'busFactorLabel(3) correct');
t(app.busFactorLabel(4) === 'Bus factor 4 \u2014 shared by a crew.',     'busFactorLabel(4) correct');
t(app.busFactorLabel(50) === 'Bus factor 50 \u2014 shared by a crew.',   'busFactorLabel(50) correct');

// --- depStatusOf assertions ---
t(app.depStatusOf(0)        === 'fresh',  'depStatusOf(0) = fresh');
t(app.depStatusOf(2)        === 'fresh',  'depStatusOf(2) = fresh');
t(app.depStatusOf(3)        === 'alive',  'depStatusOf(3) = alive (threshold)');
t(app.depStatusOf(5)        === 'alive',  'depStatusOf(5) = alive');
t(app.depStatusOf(6)        === 'stale',  'depStatusOf(6) = stale (threshold)');
t(app.depStatusOf(11)       === 'stale',  'depStatusOf(11) = stale');
t(app.depStatusOf(12)       === 'dying',  'depStatusOf(12) = dying (threshold)');
t(app.depStatusOf(47)       === 'dying',  'depStatusOf(47) = dying');
t(app.depStatusOf(48)       === 'dead',   'depStatusOf(48) = dead (threshold)');
t(app.depStatusOf(100)      === 'dead',   'depStatusOf(100) = dead');
t(app.depStatusOf(Infinity) === 'dead',   'depStatusOf(Infinity) = dead');

// --- parsePackageJsonDeps assertions ---
// Normal case: deps first, then devDeps, correct fields.
var pkg1 = JSON.stringify({
  dependencies:    { express: '^4.18.0', lodash: '^4.17.21' },
  devDependencies: { jest: '^29.0.0' }
});
var d1 = app.parsePackageJsonDeps(pkg1);
t(d1.length === 3,              'parsePackageJsonDeps: 3 entries total');
t(d1[0].name === 'express',     'parsePackageJsonDeps: deps listed first');
t(d1[0].isDev === false,        'parsePackageJsonDeps: dep isDev false');
t(d1[2].name === 'jest',        'parsePackageJsonDeps: devDep listed last');
t(d1[2].isDev === true,         'parsePackageJsonDeps: devDep isDev true');
t(d1[0].range === '^4.18.0',    'parsePackageJsonDeps: range preserved');

// Cap at 20.
var bigDeps = {};
for (var i = 0; i < 25; i++) bigDeps['pkg-' + i] = '^1.0.0';
var d2 = app.parsePackageJsonDeps(JSON.stringify({ dependencies: bigDeps }));
t(d2.length === 20, 'parsePackageJsonDeps: capped at 20');

// Invalid JSON returns [].
var d3 = app.parsePackageJsonDeps('not json at all');
t(d3.length === 0, 'parsePackageJsonDeps: invalid JSON returns []');

// Missing dep fields returns [].
var d4 = app.parsePackageJsonDeps(JSON.stringify({ name: 'foo', version: '1.0.0' }));
t(d4.length === 0, 'parsePackageJsonDeps: no dep fields returns []');

// Empty object fields return [].
var d5 = app.parsePackageJsonDeps(JSON.stringify({ dependencies: {}, devDependencies: {} }));
t(d5.length === 0, 'parsePackageJsonDeps: empty dep objects return []');

// --- latestPublishDate assertions ---
// (1) Full packument with time map containing the latest version date.
var pack1 = {
  'dist-tags': { latest: '2.0.0' },
  version: '2.0.0',
  time: { '1.0.0': '2020-01-01T00:00:00Z', '2.0.0': '2023-06-15T12:00:00Z', modified: '2023-06-15T12:00:00Z' }
};
t(app.latestPublishDate(pack1) === '2023-06-15T12:00:00Z',
  'latestPublishDate: returns time[latestVersion] when present');

// (2) Packument with only time.modified and no entry for the latest version.
var pack2 = {
  'dist-tags': { latest: '3.0.0' },
  version: '3.0.0',
  time: { '1.0.0': '2019-03-01T00:00:00Z', modified: '2021-09-10T08:00:00Z' }
};
t(app.latestPublishDate(pack2) === '2021-09-10T08:00:00Z',
  'latestPublishDate: falls back to time.modified when no entry for latest version');

// (3) Packument with no time field at all.
var pack3 = { 'dist-tags': { latest: '1.0.0' }, version: '1.0.0' };
t(app.latestPublishDate(pack3) === null,
  'latestPublishDate: returns null when no time field');

// (4) /latest-style doc with time: null (the broken old path).
var pack4 = { version: '1.0.0', time: null };
t(app.latestPublishDate(pack4) === null,
  'latestPublishDate: returns null when time is null (/latest-style doc)');

// --- Render-path assertions ---
console.log('init: empty note display =', els['cemetery-empty'].style.display);

const click = els['demo-btn'].listeners.click;
if (!click || !click.length) { console.error('FAIL: no demo click listener'); process.exit(1); }
click[0]();
const html = els['cemetery'].innerHTML;
t(html.includes('tombstone'),          'renders tombstone cards');
t(html.includes('left-pad'),           'demo data renders (left-pad)');
t(html.includes('badge-dead'),         'dead badge present');
t(html.includes('badge-thriving'),     'thriving badge present');
t(html.includes('width:5%') || html.includes('width:0%'), 'health bar width rendered');
t((html.match(/tombstone/g) || []).length >= 8, '8 demo tombstones rendered');
t(els['cemetery-count'].textContent.includes('8 souls'), 'count label shows 8 souls');
t(store['necrorepo.cemetery.v1'] &&
  JSON.parse(store['necrorepo.cemetery.v1']).length === 8, 'cemetery persisted to localStorage');

// Demo click must sort dead-first (ascending score).
const persisted = JSON.parse(store['necrorepo.cemetery.v1']);
const scores = persisted.map(r => app.scoreRepo(r).score);
const isSorted = scores.every((s, i) => i === 0 || s >= scores[i - 1]);
t(isSorted, 'demo cemetery sorted dead-first (ascending score)');

// Detail panel.
(async () => {
  global.fetch = async () => { throw new Error('no network in harness'); };
  await app.showDetail(0); // first entry after sort (a dead repo)
  t(!els['detail'].hidden,                                        'detail panel opens');
  t(els['detail-name'].textContent.includes('/'),                 'detail shows repo name');
  t(els['detail-score'].textContent.includes('dead'),             'detail shows dead status');
  t(els['detail-reasons'].innerHTML.includes('years') ||
    els['detail-reasons'].innerHTML.includes('archived'),         'autopsy reasons rendered');
  t(els['resurrect-candidates'].innerHTML.includes('Could not search forks'),
    'fork search failure handled gracefully');
  t(els['detail-busfactor'].textContent.startsWith('\u{1F465}'), 'bus factor element populated');
  t(els['detail-deps-container'].innerHTML.includes('autopsy') ||
    els['detail-deps-container'].innerHTML.includes('No package') ||
    els['detail-deps-container'].innerHTML.includes('unavailable') ||
    els['detail-deps-container'].innerHTML.length > 0, 'dep autopsy container populated');
  console.log('HARNESS DONE');
})().catch((e) => { console.error('FAIL: harness error', e); process.exit(1); });
