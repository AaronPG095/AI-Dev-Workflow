---
title: Plan - Feature: Hooks Boot Ritual And Evidence Modes
ticket: local://ADW:ADW-Plan-Hooks-Boot-Ritual-And-Evidence-Modes-2026-11
status: planned
priority: 
state: 
due: 
appetite: L
devTicketKey: ADW:ADW-Plan-Hooks-Boot-Ritual-And-Evidence-Modes-2026-11
agent: Gemini
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

- [ ] AC1: `prime --verify` and `resume --verify` execute the configured `bootVerifyTier` / `fast` / `test` verify tier before printing context and display `Baseline: PASS` or `Baseline: FAIL` with a fix-first directive without aborting output on failure.
- [ ] AC2: `tick <#> --red "<cmd>"` executes `<cmd>`, fails if exit code is 0, and appends `red: \`<cmd>\` exit <code> @<shortSha>` to the item while leaving `[ ]` unchecked; `new --type Refactor` without custom `--steps` seeds a characterization-test step.
- [ ] AC3: `scripts/hooks/adw-hook.mjs` handles `pre-tool`, `post-tool`, and `stop` stdin payloads, blocking direct `.plan.md` checkbox edits (`- [ ]`/`- [x]`), protected-branch `git push`, and workflow-file edits without an active plan on branch, while permitting prose edits and failing open (unless `--strict`) on malformed JSON.
- [ ] AC4: `ticket.mjs hook [install|uninstall|status] --agent-hooks` manages `.claude/settings.json` hook wiring without clobbering existing user hooks, and `scripts/hooks/adw-hook.mjs` is included in `WORKFLOW_FILES` and `scripts/workflow-manifest.json`.
- [ ] AC5: `node --test scripts/ticket.test.mjs` passes with hermetic tests for `prime --verify`, `resume --verify`, `tick --red`, `Refactor` seeding, `hook --agent-hooks`, and all 3 `adw-hook.mjs` modes; `README.md` and mirrored skills match byte-for-byte.

## Steps

- [ ] Add `prime --verify` and `resume --verify` baseline health helper and `bootVerifyTier` support in `scripts/ticket.mjs` (AC1).
- [ ] Add `tick --red "<cmd>"` reproduction stamping and `new --type Refactor` characterization step seeding in `scripts/ticket.mjs` (AC2).
- [ ] Create `scripts/hooks/adw-hook.mjs` implementing `pre-tool`, `post-tool`, and `stop` stdin hook handlers (AC3).
- [ ] Wire `scripts/hooks/adw-hook.mjs` into `WORKFLOW_FILES`, `scripts/workflow-manifest.json`, and `commands.hook()` `--agent-hooks` `.claude/settings.json` lifecycle (AC4).
- [ ] Update `README.md`, `.agents/skills/dev-workflow/SKILL.md`, and `.claude/skills/dev-workflow/SKILL.md` identically, add hermetic tests for T2.3/T2.4/T2.5 in `scripts/ticket.test.mjs`, and run `node --test scripts/ticket.test.mjs` (AC5).

## Risks

- Claude/Antigravity hook JSON payloads differ slightly across client versions or could block legitimate edits to plan `Notes`/`Summary` sections; mitigate by checking multiple standard tool/input field shapes, blocking only checkbox lines (`- [ ]`/`- [x]`) in `.plan.md`, and failing open unless `--strict` is set.
- Syncing `scripts/hooks/adw-hook.mjs` must not auto-modify `.claude/settings.json` in downstream repos; keep `--agent-hooks` strictly opt-in via `hook install --agent-hooks`.

## Out of scope

- Auto-installing `--agent-hooks` during `sync.mjs` without explicit user opt-in.

## Notes

- Aaron approved `tier1-tier2-implementation-plan.md` ("The user has approved this document.") and instructed: "Merge 30 and proceed to plan E."

## Progress log

<!-- One line per session/review, added with `ticket.mjs log` or `ticket.mjs review` -->
