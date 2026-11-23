---
title: Plan - Feature: Fast Verify And Fleet Hygiene
ticket: local://ADW:ADW-Plan-Fast-Verify-And-Fleet-Hygiene-2026-11
status: shipped
priority: 
state: 
due: 
appetite: L
version: 
impact: 
blueprint: docs/architecture/ADW-Blueprint-Workflow-Next-Gen-Refinements.md
devTicketKey: ADW:ADW-Plan-Fast-Verify-And-Fleet-Hygiene-2026-11
agent: Gemini
branch: feat/fast-verify-and-fleet-hygiene
worktree: AI-Dev-Workflow
startedAt: 2026-11-23
reviewedBy: Other
reviewVerdict: pass
reviewSession: reviewer-argon-low
reviewModel: gemini-4-argon-low
baseBranch: main
reviewFingerprint: 1a013b51cadeb73260a2c87e7e96bf1211d26817468dbec448fe471fecefb7e6
pr: https://github.com/AaronPG095/AI-Dev-Workflow/pull/46
---
# Fast Verify And Fleet Hygiene

## Summary

Accelerate the test suite and boot verification via cached template `.git` fixtures and a sub-second `verify.fast` tier, add `archive --merged [--fleet]` to clean up merged `shipped` plans, backfill downstream invariants via `sync.mjs --ensure-invariants`, and warn on dirty protected branches in `doctor`.

## Context

- Blueprint: `docs/architecture/ADW-Blueprint-Workflow-Next-Gen-Refinements.md`
- `scripts/ticket.test.mjs`: `fixture()` (`#L46-L145`) spawns `git init` and `git config` subprocesses ~147 times across tests.
- `scripts/ticket.config.json` (`#L8-L12`) & `scripts/workflow-manifest.json` (`#L33-L49`): `verify` tiers and `starterConfig.invariants`.
- `scripts/ticket.mjs`: `BOOLEAN_FLAGS` (`#L128-L160`), `commands.archive()` (`#L5440-L5490`), `commands.doctor()` (`#L5491-L5602`).
- `scripts/sync.mjs`: flag parser (`#L38-L60`) and config comparison (`#L220-L248`).

## Open questions

None

## Acceptance criteria

- [x] AC1: `fixture()` in `scripts/ticket.test.mjs` caches a pre-initialized template `.git` directory (`user.name = Test`, `user.email = test@example.invalid`) once per process, copies it on `f.git('init', ...)` while short-circuiting matching `f.git('config', ...)` calls, and copies `scripts/lib/` into the fixture when present. verified(test): F1 test verifies getGitTemplateDir cache, short-circuited git config, and scripts/lib copy in scripts/ticket.test.mjs
- [x] AC2: `scripts/ticket.config.json` defines `verify.fast` (`node --check scripts/ticket.mjs`) and `scripts/workflow-manifest.json` includes `noSecretsPatterns` and `excludePaths` in `starterConfig.invariants`. verified(test): F1 test and doctor verify verify.fast in ticket.config.json and starterConfig.invariants in workflow-manifest.json
- [x] AC3: `ticket.mjs archive --merged [--fleet] [--dry-run]` archives any unarchived plan whose status is `done`/`completed`, whose `localPlanStatus(plan)` resolves to `done` on a protected branch, or whose status is `shipped` with all checkboxes closed (`--dry-run` previews without moving files). verified(test): F1 test verifies archive --merged [--dry-run] for shipped-closed and local-merged plans while preserving open plans
- [x] AC4: `node scripts/sync.mjs [--all-known] --ensure-invariants` backfills `starterConfig.invariants` into existing downstream `scripts/ticket.config.json` files when `invariants` is missing without causing drift under `--check --bundle-only`, and `doctor [--fleet]` warns when a repository is on a dirty protected branch. verified(test): F1 test verifies sync.mjs --ensure-invariants backfill without --check --bundle-only drift and doctor dirty protected branch warning
- [x] AC5: `node --test scripts/ticket.test.mjs` passes with hermetic tests for `archive --merged [--fleet]`, `sync.mjs --ensure-invariants`, and dirty-protected-branch `doctor` warnings; `README.md` and mirrored skills match byte-for-byte. verified(test): node --test scripts/ticket.test.mjs (95/95 pass) and doctor Invariants 4/4 passed

## Steps

- [x] Add template `.git` directory cache and automatic `scripts/lib/` copy support to `fixture()` in `scripts/ticket.test.mjs` (AC1). verified(test): done
- [x] Configure `verify.fast` in `scripts/ticket.config.json` and enrich `starterConfig.invariants` in `scripts/workflow-manifest.json` (AC2). verified(test): done
- [x] Implement `--merged`, `--fleet`, and `--dry-run` in `commands.archive()` and dirty-protected-branch warnings in `commands.doctor()` in `scripts/ticket.mjs` (AC3, AC4). verified(test): done
- [x] Add `--ensure-invariants` backfill support in `scripts/sync.mjs` (AC4). verified(test): done
- [x] Update `README.md`, `.agents/skills/dev-workflow/SKILL.md`, and `.claude/skills/dev-workflow/SKILL.md` identically, add hermetic tests in `scripts/ticket.test.mjs`, and run `node --test scripts/ticket.test.mjs` (AC5). verified(test): done

## Risks

- A test calling `f.git('init')` after writing files into `f.root` expects existing working-tree files to remain intact; mitigate by copying only the `.git` directory into `join(root, '.git')`.
- `sync.mjs --check --bundle-only` used by `doctor` must not report drift on downstream `scripts/ticket.config.json`; mitigate by comparing `scripts/ticket.config.json` only when `!configExists` or `opts.ensureInvariants` is explicitly set.

## Out of scope

- Hunk-level escaped-defect attribution and automatic lessons capture (covered in Plan G).
- `dependsOn`, `ready`, `blueprint status`, and `map` (covered in Plan H).
- Extracting `scripts/lib/*.mjs` modules (covered in Plan I).

## Notes

- Aaron approved `next-gen-workflow-implementation-plan.md` ("The user has approved this document.") after instructing: "Run and implement all. Plan out using Argon High and implement using Argon Low."

## Progress log

<!-- One line per session/review, added with `ticket.mjs log` or `ticket.mjs review` -->
- 2026-11-23 14:24 UTC, Other (review: pass [standards: pass, spec: pass]): AC1-AC5 verified: cached git template fixture, verify.fast, archive --merged [--fleet] [--dry-run], sync --ensure-invariants, and doctor dirty-protected-branch warning implemented cleanly with hermetic tests and full mirror parity. [reviewer: reviewer-argon-low] (model: gemini-4-argon-low)
