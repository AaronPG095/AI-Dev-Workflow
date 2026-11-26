---
title: Plan - Feature: Universal Adw Architecture
ticket: local://ADW:ADW-Plan-Universal-Adw-Architecture-2026-11
status: in-progress
priority: 
state: 
due: 
appetite: L
version: 
impact: 
dependsOn: 
devTicketKey: ADW:ADW-Plan-Universal-Adw-Architecture-2026-11
agent: Gemini
branch: feat/universal-adw-architecture
worktree: AI-Dev-Workflow
startedAt: 2026-11-26
reviewedBy: Other
reviewVerdict: pass
reviewSession: independent-plan-m-reviewer
baseBranch: main
reviewFingerprint: ac7b2315df235fe3e5d072a2655875eea67324b3d55ae20141f978869aad10cd
---
# Universal Adw Architecture

## Summary

Turn `AI-Dev-Workflow` into a single universal installation (`adw` global CLI + global skill links + reusable GitHub Actions workflows) so sibling repositories only keep `scripts/ticket.config.json`, `AGENTS.md`/`CLAUDE.md`, `docs/plans/`, and a 14-line `.github/workflows/plan-check.yml` caller — eliminating per-repo syncing of `ticket.mjs`, `sync.mjs`, `ticket.test.mjs`, and duplicated skill files.

## Context

- `scripts/ticket.mjs` (`lines 73-77`) currently resolves `repoRoot = resolve(here, '..')` and reads `here/ticket.config.json`, which assumes `ticket.mjs` is vendored inside every repo.
- `scripts/sync.mjs` copies 18+ files into every sibling repo (`scripts/ticket.mjs`, `scripts/sync.mjs`, `scripts/ticket.test.mjs`, `.agents/skills/*`, `.claude/skills/*`), causing 14–17 dirty files across 7 repos on every workflow upgrade.
- Global skill directories exist on Windows at `~/.gemini/config/skills`, `~/.claude/skills`, and `~/.agents/skills`, and `npm prefix -g` (`C:\nvm4w\nodejs`) is on `PATH`.

## Open questions

None

## Acceptance criteria

- [x] AC1: Zero-dependency `package.json` (`"bin": { "adw": "./scripts/adw.mjs" }`), `scripts/adw.mjs` (`ADW_GLOBAL=1`), and `ADW_REPO_ROOT`/`ADW_GLOBAL` resolution in `scripts/ticket.mjs` allow `adw <cmd>` to run against any git repository from `process.cwd()` while keeping `node scripts/ticket.mjs` 100% backwards-compatible. verified(test): M1 + full test suite (103/103), doctor --compact, sync --check --bundle-only, and skill mirror check passed
- [x] AC2: `scripts/install-global.mjs` (with `--check` and `--uninstall`) idempotently links `adw` on `PATH` via `npm link` and symlinks/junctions `dev-workflow`, `quick-review`, and `agentic-workflow` into `~/.gemini/config/skills/`, `~/.claude/skills/`, and `~/.agents/skills/` without touching other user skills. verified(test): M1 + full test suite (103/103), doctor --compact, sync --check --bundle-only, and skill mirror check passed
- [x] AC3: `.github/workflows/reusable-plan-check.yml` and `.github/workflows/reusable-ticket-done.yml` provide `workflow_call` CI gates that check out the caller repo and `AI-Dev-Workflow`, restore `scripts/ticket.config.json` from `BASE_SHA`, and execute `ci-check` / `ci-done` with `ADW_REPO_ROOT`. verified(test): M1 + full test suite (103/103), doctor --compact, sync --check --bundle-only, and skill mirror check passed
- [x] AC4: `scripts/ticket.mjs` (`doctor`, `hook`, `getKnownRepoDirs`) and `scripts/sync.mjs --universal` support `"mode": "universal"` — validating the reusable caller in `doctor`, emitting `adw` in `hook` and `AGENTS.md`, setting `mode: "universal"`, removing vendored workflow scripts/skills while preserving repo-custom skills, and updating `README.md`. verified(test): M1 + full test suite (103/103), doctor --compact, sync --check --bundle-only, and skill mirror check passed
- [x] AC5: Unit test `M1` in `scripts/ticket.test.mjs` covers `ADW_REPO_ROOT` / `ADW_GLOBAL`, `doctor` universal mode, and `sync.mjs --universal` migration (preserving repo-custom skills); full suite passes (`103/103`). verified(test): M1 + full test suite (103/103), doctor --compact, sync --check --bundle-only, and skill mirror check passed

## Steps

- [x] Add `package.json`, `scripts/adw.mjs`, and `ADW_REPO_ROOT` / `ADW_GLOBAL` / universal-mode support in `scripts/ticket.mjs` (AC1, AC4)
- [x] Add `scripts/install-global.mjs` with `--check` and `--uninstall` (AC2)
- [x] Add `.github/workflows/reusable-plan-check.yml` and `.github/workflows/reusable-ticket-done.yml` (AC3)
- [x] Add `--universal` migration mode and `renderReusablePlanCheckWorkflow()` in `scripts/sync.mjs` (AC4)
- [x] Update `README.md`, add `M1` test in `scripts/ticket.test.mjs`, and verify `103/103` tests, `doctor --compact`, `sync --check --bundle-only`, and skill mirrors (AC5)

## Risks

- Risk: Reusable CI workflow could let a PR modify its own `scripts/ticket.config.json` to bypass checks. Mitigation: restore `scripts/ticket.config.json` from `BASE_SHA` before running `ci-check`.
- Risk: `sync.mjs --universal` accidentally deleting repo-custom skills. Mitigation: delete only the 3 explicit workflow skill directories (`dev-workflow`, `quick-review`, `agentic-workflow`) and clean parent dirs only when empty.
- Risk: Existing tests relying on script-relative `repoRoot`. Mitigation: activate cwd/git-toplevel resolution only when `ADW_REPO_ROOT` or `ADW_GLOBAL=1` is set.

## Out of scope

- Publishing to the public npm registry.
- Force-committing or discarding uncommitted user work in sibling repositories.

## Notes

- Approved by Aaron ("Yes let's switch to this universal architecture." / "Confirmed.").

## Progress log

<!-- One line per session/review, added with `ticket.mjs log` or `ticket.mjs review` -->
- 2026-11-26 09:57 UTC, Other (review: pass [standards: pass, spec: pass]): Plan M AC1-AC5 verified: adw global CLI, install-global.mjs, reusable CI workflows with BASE_SHA config restore, universal doctor/hook/sync --universal (preserving custom skills), skills parity clean, and 103/103 tests pass. [reviewer: independent-plan-m-reviewer]
