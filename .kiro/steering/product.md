# Product — NecroRepo

## What it is
NecroRepo is a "graveyard for dead code": a web app that inspects public GitHub
repositories, diagnoses their health, and helps users resurrect abandoned
open-source projects by finding the most alive fork.

## Who it is for
- Developers who depend on small open-source libraries and want to know which
  of their dependencies are dying.
- Open-source maintainers and contributors looking for a project to adopt.
- Anyone who has ever been bitten by an unmaintained dependency (Log4Shell,
  left-pad, event-stream…).

## The problem (real, with stakes)
Abandoned dependencies are a supply-chain risk: no security fixes, no
compatibility updates, no one to answer issues. Existing tools (deps.dev,
libraries.io, Dependabot) report versions and vulnerabilities, but none of
them *frame the problem as death and adoption* — and none give a user a
one-click path from "this is dead" to "here is the living fork, adopt it".

## Tone
Spooky but useful, never gimmicky. The graveyard metaphor is the interface:
tombstones, autopsies, resurrections. Every spooky element must *do work* —
the tombstone shape is the repo card, the health bar is the grave's condition,
the séance is the re-check. If a design element does not help the user
understand a repo's health, cut it.

## Success criteria
- A stranger can open the app, run the demo cemetery, and understand the
  whole product in under 60 seconds.
- Inspecting a real GitHub user shows a sorted cemetery (dead first) in
  under 5 seconds on a normal connection.
- Every dead repo shows at least one concrete resurrection action.
- The app works with zero sign-up and zero backend.
