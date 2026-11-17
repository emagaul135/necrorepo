# Requirements — NecroRepo (Kiroween 2026, Resurrection)

## Introduction
NecroRepo inspects public GitHub repositories, diagnoses their health, and
helps users resurrect abandoned projects. It is a zero-backend static web app.

## Glossary
- **Cemetery:** the user's saved list of inspected repos, stored in localStorage.
- **Autopsy:** the health diagnosis of one repo (score, status, reasons).
- **Resurrection:** the adoption plan for a dead/dying repo (living forks + checklist).
- **Séance:** a one-click re-check of every repo in the cemetery.

## Requirements

### Requirement 1: Inspect a GitHub user
**User Story:** As a developer, I want to paste a GitHub username and see the
health of all their public repos, so I can spot which of my dependencies are dying.

#### Acceptance Criteria
1. WHEN the user submits a username THEN the system SHALL fetch that user's
   public non-fork repos from the GitHub API and display them sorted by health
   score ascending (dead first).
2. WHEN the GitHub API returns 404 THEN the system SHALL show "Not found on
   GitHub — check the name and try again."
3. WHEN the GitHub rate limit is hit THEN the system SHALL explain the limit
   and suggest adding a token or using the demo cemetery.
4. WHEN the user provides a personal access token THEN the system SHALL send
   it as a Bearer token on API requests.

### Requirement 2: Inspect a single repo
**User Story:** As a developer, I want to paste `owner/repo` and get an
autopsy of exactly that project.

#### Acceptance Criteria
1. WHEN the user submits `owner/repo` THEN the system SHALL fetch that repo
   and open its detail panel automatically.
2. WHEN the input is not in `owner/repo` form THEN the system SHALL show a
   format hint and SHALL NOT call the API.

### Requirement 3: Health scoring (autopsy)
**User Story:** As a user, I want an honest, explainable health score so I
can trust the diagnosis.

#### Acceptance Criteria
1. WHEN a repo is archived THEN the system SHALL score it 0 and status `dead`.
2. WHEN scoring THEN the system SHALL penalise silence on a graduated scale
   (>3mo −25, >6mo −45, >12mo −65, >24mo −80, >48mo −90, >96mo −95) and open
   issues (>50 −10, >100 −15), and SHALL clamp the result to 0–100.
3. WHEN displaying a score THEN the system SHALL map it to a status:
   ≥80 thriving, ≥60 alive, ≥40 ailing, ≥15 dying, <15 dead.
4. WHEN showing an autopsy THEN the system SHALL list at least one human-readable
   reason for the score.

### Requirement 4: Resurrection plan
**User Story:** As a user, I want a dead repo to tell me what to do next,
so a diagnosis is never a dead end.

#### Acceptance Criteria
1. WHEN a repo is dead, dying or ailing THEN the detail panel SHALL show a
   4-step adoption checklist and SHALL search for living forks.
2. WHEN living forks exist THEN the system SHALL list up to 3, ordered by
   most recent push, with stars and last-push date.
3. WHEN no living fork exists THEN the system SHALL say so and suggest
   forking the original.
4. WHEN a repo is thriving or alive THEN the panel SHALL say no resurrection
   is needed.

### Requirement 5: Cemetery persistence and séance
**User Story:** As a user, I want my cemetery saved in my browser and
re-checkable with one click.

#### Acceptance Criteria
1. WHEN repos are inspected THEN the system SHALL persist them to localStorage
   under `necrorepo.cemetery.v1`.
2. WHEN the page loads with a saved cemetery THEN the system SHALL render it.
3. WHEN the user clicks "Re-check my cemetery" THEN the system SHALL refetch
   every saved repo, keep the old record on failure, and re-sort by score.

### Requirement 6: Demo cemetery (offline)
**User Story:** As a first-time visitor, I want to see the product work
without a GitHub account or network.

#### Acceptance Criteria
1. WHEN the user clicks "Open the demo cemetery" THEN the system SHALL render
   8 sample repos with zero API calls.
2. WHEN the demo is shown THEN the sample set SHALL include at least one repo
   in each of the `dead`, `ailing` and `thriving` states.

### Requirement 7: Design
**User Story:** As a user, I want the graveyard theme to help me read repo
health at a glance.

#### Acceptance Criteria
1. WHEN viewing the cemetery THEN each repo SHALL be a tombstone card with a
   status badge, a health bar, and the last-push date.
2. WHEN using a keyboard THEN tombstones SHALL be focusable and openable
   with Enter.
3. WHEN the page loads THEN the first paint SHALL NOT depend on any network
   request (all local assets, no CDN).
