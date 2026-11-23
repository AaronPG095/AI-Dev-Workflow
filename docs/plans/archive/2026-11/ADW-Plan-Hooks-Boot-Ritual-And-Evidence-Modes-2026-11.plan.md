---
title: Plan - Feature: Hooks Boot Ritual And Evidence Modes
ticket: local://ADW:ADW-Plan-Hooks-Boot-Ritual-And-Evidence-Modes-2026-11
status: shipped
priority: 
state: 
due: 
appetite: L
devTicketKey: ADW:ADW-Plan-Hooks-Boot-Ritual-And-Evidence-Modes-2026-11
agent: Gemini
branch: feat/hooks-boot-and-red-first
worktree: AI-Dev-Workflow
startedAt: 2026-11-14
reviewedBy: Other
reviewVerdict: pass
reviewFingerprint: 3e674757ebbaa6e6e75ffcb2d96a1dc583009c631c86b311fb7df672e0818c1f
pr: https://github.com/AaronPG095/AI-Dev-Workflow/pull/31
---
# Hooks Boot Ritual And Evidence Modes

## Summary

Baseline-health boot ritual (`prime --verify`, `resume --verify`), red-first & characterization evidence modes (`tick --red`, `Refactor` characterization seed), and an opt-in zero-dependency AI client runtime hooks bundle (`scripts/hooks/adw-hook.mjs` + `hook --agent-hooks`) prevent building on broken baselines, verify test failures before fixes, and guard protected branches/checkbox integrity at tool execution time.

## Context

- `scripts/ticket.mjs`: `WORKFLOW_FILES` (`#L95-L120`), `BOOLEAN_FLAGS` (`#L128-L154`), `commands.new()` (`#L2540-L2580`), `commands.prime()` (`#L2688-L2762`), `commands.tick()` (`#L2764-L2860`), `commands.resume()` (`#L3401-L3461`), `commands.hook()` (`#L4232-L4305`).
- `scripts/workflow-manifest.json` (`#L3-L18`): `copy` manifest for downstream repo syncing.
- Note on `BOOLEAN_FLAGS`: `--agent-hooks` will be added to `BOOLEAN_FLAGS`; `--red "<cmd>"` takes a value argument like `--verify-cmd`.

## Open questions

None

## Acceptance criteria

- [x] AC1: `prime --verify` and `resume --verify` execute the configured `bootVerifyTier` / `fast` / `test` verify tier before printing context and display `Baseline: PASS` or `Baseline: FAIL` with a fix-first directive without aborting output on failure. verified(test): T2.4 verifies prime --verify and resume --verify Baseline PASS/FAIL without aborting
- [x] AC2: `tick <#> --red "<cmd>"` executes `<cmd>`, fails if exit code is 0, and appends `red: \`<cmd>\` exit <code> @<shortSha>` to the item while leaving `[ ]` unchecked; `new --type Refactor` without custom `--steps` seeds a characterization-test step. verified(test): T2.5 verifies tick --red exit!=0 reproduction stamping and Refactor characterization seed
- [x] AC3: `scripts/hooks/adw-hook.mjs` handles `pre-tool`, `post-tool`, and `stop` stdin payloads, blocking direct `.plan.md` checkbox edits (`- [ ]`/`- [x]`), protected-branch `git push`, and workflow-file edits without an active plan on branch, while permitting prose edits and failing open (unless `--strict`) on malformed JSON. verified(test): T2.3 verifies adw-hook.mjs pre-tool, post-tool, stop, and fail-open JSON handling
- [x] AC4: `ticket.mjs hook [install|uninstall|status] --agent-hooks` manages `.claude/settings.json` hook wiring without clobbering existing user hooks, and `scripts/hooks/adw-hook.mjs` is included in `WORKFLOW_FILES` and `scripts/workflow-manifest.json`. verified(test): T2.3 verifies hook --agent-hooks .claude/settings.json wiring and manifest/WORKFLOW_FILES registration
- [x] AC5: `node --test scripts/ticket.test.mjs` passes with hermetic tests for `prime --verify`, `resume --verify`, `tick --red`, `Refactor` seeding, `hook --agent-hooks`, and all 3 `adw-hook.mjs` modes; `README.md` and mirrored skills match byte-for-byte. verified(test): 84/84 tests pass in node --test scripts/ticket.test.mjs and skill diff is empty

## Steps

- [x] Add `prime --verify` and `resume --verify` baseline health helper and `bootVerifyTier` support in `scripts/ticket.mjs` (AC1). verified: Implemented runBootBaselineCheck and wired --verify into prime and resume
- [x] Add `tick --red "<cmd>"` reproduction stamping and `new --type Refactor` characterization step seeding in `scripts/ticket.mjs` (AC2). verified: Implemented tick --red and new --type Refactor characterization seed
- [x] Create `scripts/hooks/adw-hook.mjs` implementing `pre-tool`, `post-tool`, and `stop` stdin hook handlers (AC3). verified: Created scripts/hooks/adw-hook.mjs with pre-tool, post-tool, and stop handlers
- [x] Wire `scripts/hooks/adw-hook.mjs` into `WORKFLOW_FILES`, `scripts/workflow-manifest.json`, and `commands.hook()` `--agent-hooks` `.claude/settings.json` lifecycle (AC4). verified: Updated WORKFLOW_FILES, workflow-manifest.json, and hook --agent-hooks
- [x] Update `README.md`, `.agents/skills/dev-workflow/SKILL.md`, and `.claude/skills/dev-workflow/SKILL.md` identically, add hermetic tests for T2.3/T2.4/T2.5 in `scripts/ticket.test.mjs`, and run `node --test scripts/ticket.test.mjs` (AC5). verified: Updated README and skills identically; added T2.3/T2.4/T2.5 tests; 84/84 pass

## Risks

- Claude/Antigravity hook JSON payloads differ slightly across client versions or could block legitimate edits to plan `Notes`/`Summary` sections; mitigate by checking multiple standard tool/input field shapes, blocking only checkbox lines (`- [ ]`/`- [x]`) in `.plan.md`, and failing open unless `--strict` is set.
- Syncing `scripts/hooks/adw-hook.mjs` must not auto-modify `.claude/settings.json` in downstream repos; keep `--agent-hooks` strictly opt-in via `hook install --agent-hooks`.

## Out of scope

- Auto-installing `--agent-hooks` during `sync.mjs` without explicit user opt-in.

## Notes

- Aaron approved `tier1-tier2-implementation-plan.md` ("The user has approved this document.") and instructed: "Merge 30 and proceed to plan E."

## Progress log

<!-- One line per session/review, added with `ticket.mjs log` or `ticket.mjs review` -->
- 2026-11-14 09:53 UTC, Other (review: warn [standards: warn, spec: pass]): AC1-AC5 satisfied, 84/84 tests pass, skill parity and 4/4 invariants clean. Non-blocking: handlePreTool checks any in-progress plan rather than matching curBranch; README.md documents new CLI flags but omits bootVerifyTier/hooks.postToolVerify config keys.
- 2026-11-14 10:02 UTC, Other (review: pass [standards: pass, spec: pass]): Re-review pass: adw-hook.mjs branch-matching and git -C push detection fixed, README.md config keys/tree/84-test count updated, AC1-AC5 and AGENTS.md compliance verified (84/84 tests pass, 4/4 invariants clean).
