---
title: Plan - Feature: Token Lean Context And Compact Cli
ticket: local://ADW:ADW-Plan-Token-Lean-Context-And-Compact-Cli-2026-11
status: in-progress
priority: 
state: 
due: 
appetite: L
version: 
impact: 
dependsOn: 
devTicketKey: ADW:ADW-Plan-Token-Lean-Context-And-Compact-Cli-2026-11
agent: Gemini
branch: feat/token-lean-context-and-compact-cli
worktree: plan-kl
startedAt: 2026-11-26
reviewedBy: Other
reviewVerdict: pass
reviewSession: independent-plan-k-reviewer
baseBranch: main
reviewFingerprint: c0b23bbe4e0ffe897b8c21b3b395e22264aa9d5fbc74dc9b26f29f6347f87d18
---
# Token Lean Context And Compact Cli

## Summary

Cut always-on `AGENTS.md` dev-process overhead by ~75% (~1,722t to <=500t), split `agentic-workflow/SKILL.md` into a lean router plus progressive `references/`, add batch `tick` (`1,2,3` and `--all-steps`) to cut turn count, and add `--quiet` on `verify` plus `--compact` on `pack`, `doctor --fleet`, and `stats --fleet`.

## Context

- `scripts/sync.mjs` (`#L162-L187`) & `AGENTS.md`: `renderDevProcessSection()` currently emits ~1,722 tokens on every turn across all 7 repos.
- `.agents/skills/agentic-workflow/SKILL.md` (200L, ~2,077t): loads all 3 levels (A, B, C) upfront instead of progressive references.
- `scripts/ticket.mjs`: `BOOLEAN_FLAGS` (`#L164-L195`), `commands.tick()` (`#L3423+`), `commands.pack()` (`#L4211-L4260`), `commands.doctor()` (`#L5826+`), `commands.verify()` (`#L5944-L6020`), `commands.stats()` (`#L7000+`).

## Open questions

None

## Acceptance criteria

- [x] AC1: `renderDevProcessSection()` in `scripts/sync.mjs` and `## Development process` in `AGENTS.md` stay under 2,000 chars (~500 tokens) while preserving all 6 steps, the `no-plan` rule, `context-gatekeeper` preference, independent-review rule, and existing `patchAgentsMd` assertions. verified(test): K1 + full test suite (101/101), doctor --compact, stats --compact, and sync --check --bundle-only passed
- [x] AC2: `.agents/skills/agentic-workflow/SKILL.md` (and `.claude/` mirror) is compressed to <2,500 chars as a compact router linking to `references/level-a.md`, `references/level-b.md`, and `references/level-c.md`, with all 6 reference files registered in `WORKFLOW_FILES` and `scripts/workflow-manifest.json` `copy`. verified(test): K1 + full test suite (101/101), doctor --compact, stats --compact, and sync --check --bundle-only passed
- [x] AC3: `ticket.mjs tick [<plan>] <1,2,3|--all-steps> [--verified "<evidence>"]` resolves all target indices against the initial snapshot before mutating and ticks multiple items in a single command without index shift. verified(test): K1 + full test suite (101/101), doctor --compact, stats --compact, and sync --check --bundle-only passed
- [x] AC4: `verify --quiet` prints a single-line pass summary with elapsed time and dumps only the last 20 lines on failure; `pack --compact` defaults `maxFileLines=40` and `maxLines=150`; `doctor --fleet --compact` and `stats --fleet --compact` emit a 1-line-per-repo summary table. verified(test): K1 + full test suite (101/101), doctor --compact, stats --compact, and sync --check --bundle-only passed
- [x] AC5: `node --test scripts/ticket.test.mjs`, `node scripts/ticket.mjs doctor`, and `node scripts/sync.mjs --check --bundle-only .` pass with hermetic test `K1`; `README.md` and mirrored skills match byte-for-byte. verified(test): K1 + full test suite (101/101), doctor --compact, stats --compact, and sync --check --bundle-only passed

## Steps

- [x] Compress `renderDevProcessSection()` in `scripts/sync.mjs` and `## Development process` in `AGENTS.md` under 2,000 chars (AC1). verified: Implemented and verified in K1 (101/101 pass)
- [x] Split `agentic-workflow/SKILL.md` into router + `references/level-{a,b,c}.md` (mirrored in `.agents` & `.claude`) and register in `WORKFLOW_FILES` & `scripts/workflow-manifest.json` (AC2). verified: Implemented and verified in K1 (101/101 pass)
- [x] Add batch `tick` (`1,2,3` and `--all-steps`), `verify --quiet`, `pack --compact`, and `doctor`/`stats` `--compact` in `scripts/ticket.mjs` (AC3, AC4). verified: Implemented and verified in K1 (101/101 pass)
- [x] Update `README.md`, `.agents/skills/dev-workflow/SKILL.md`, and `.claude/skills/dev-workflow/SKILL.md` identically, add hermetic test `K1` in `scripts/ticket.test.mjs`, and run `node --test scripts/ticket.test.mjs` (AC5). verified: Implemented and verified in K1 (101/101 pass)

## Risks

- Over-compressing `AGENTS.md` could break existing `patchAgentsMd` assertions in `scripts/ticket.test.mjs` (`Non-trivial changes follow these six steps`, `${prefix}-Plan-<Topic>-<YYYY-MM>.plan.md`, `node scripts/ticket.mjs pack`); keep those exact phrases and verify with `K1`.
- Batch `tick 1,2,3` could mis-target items if `openItems` indices shift mid-loop; mitigate by resolving all target `lineIndex` entries against the initial snapshot before mutating any line.

## Out of scope

- `quick-review/SKILL.md` `context-gatekeeper` update, downstream `.ignore` generation, `merge --archive`, and fleet `verify.fast` rollout (covered in Plan L).

## Notes

- Aaron approved implementing both Plan K and Plan L ("Yes please implement both.").
- Appetite bumped from `M` to `L` (`945` lines across `17` files including mirrored `.agents/` and `.claude/` progressive skill references).

## Progress log

<!-- One line per session/review, added with `ticket.mjs log` or `ticket.mjs review` -->
- 2026-11-26 09:10 UTC, Other (review: pass [standards: pass, spec: pass]): All 5 ACs verified: lean AGENTS.md (<2000 chars), progressive agentic-workflow refs registered in manifest/WORKFLOW_FILES, snapshot-based batch tick, verify --quiet, pack/doctor/stats --compact with shared printTable. Targeted tests, strict lint, fast verify, doctor --compact, sync --check, and skill mirror diff all pass. [reviewer: independent-plan-k-reviewer]
