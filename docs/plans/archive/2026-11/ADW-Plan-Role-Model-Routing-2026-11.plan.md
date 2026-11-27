---
title: Plan - Feature: Role Model Routing
ticket: local://ADW:ADW-Plan-Role-Model-Routing-2026-11
status: shipped
priority: 
state: 
due: 
appetite: M
version: 
impact: 
devTicketKey: ADW:ADW-Plan-Role-Model-Routing-2026-11
agent: Gemini
branch: feat/role-model-routing
worktree: AI-Dev-Workflow
startedAt: 2026-11-19
reviewedBy: Gemini
reviewVerdict: pass
reviewSession: reviewer-neon-low
reviewModel: gemini-4-neon-low
baseBranch: main
reviewFingerprint: 6833244f094379de50baab8abfbcf96425e063b0832235b0c542d340c0555801
pr: https://github.com/AaronPG095/AI-Dev-Workflow/pull/43
---
# Role Model Routing

## Summary

Add configurable role-to-model routing (`agentic.models`: `planner`, `builder`, `reviewer`, `fixer`) to AI-Dev-Workflow defaulting to `gemini-4-neon-medium` for planning, `gemini-4-hydrogen-medium` for implementation/fixing, and `gemini-4-neon-low` for independent review. Surface configured role models across `ticket.mjs` briefs, supervisor runs (`ADW_MODEL`), and optional review metadata (`--model`), and document Antigravity `swarm` worker delegation across `AGENTS.md`, skills, and `README.md`.

## Context

- `scripts/ticket.config.json:54-57`, `ticket.config.example.json:37-40`, and `scripts/workflow-manifest.json:42-45` currently configure `agentic: { maxRetries: 3, verifyTier: "test" }` with no per-role model map.
- `scripts/ticket.mjs:1858-1886` (`resolveStepContext`), `scripts/ticket.mjs:2310-2430` (`buildStepBrief`), `scripts/ticket.mjs:2739-2765` (`runExternalPrompt`), `scripts/ticket.mjs:3027-3106` (`prime`), `scripts/ticket.mjs:3280-3335` (`step`), `scripts/ticket.mjs:3390-3607` (`run`), and `scripts/ticket.mjs:4017-4200` (`review`) handle agentic briefs, external runner execution, and review stamping without role-to-model routing or `ADW_MODEL`.
- In Antigravity, `invoke_subagent` only supports coarse tiers (`inherit | flash_lite | flash | pro`), whereas `swarm` workers (`swarm add --model <id>`) support exact model IDs (`gemini-4-neon-medium`, `gemini-4-hydrogen-medium`, `gemini-4-neon-low`).
- Repo invariants require zero external dependencies, Node.js 22+, identical `.agents/skills/` and `.claude/skills/`, `README.md` CLI/config sync, and passing `node --test scripts/ticket.test.mjs`.

## Open questions

None

## Acceptance criteria

- [x] AC1: WHEN `agentic.models` is configured in `scripts/ticket.config.json`, `ticket.config.example.json`, and `scripts/workflow-manifest.json` (`starterConfig`), THE SYSTEM SHALL default `planner` to `gemini-4-neon-medium`, `builder` to `gemini-4-hydrogen-medium`, `fixer` to `gemini-4-hydrogen-medium`, and `reviewer` to `gemini-4-neon-low`. verified: test: role-to-model routing test verified agentic.models defaults in config, example, and manifest
- [x] AC2: WHEN running `node scripts/ticket.mjs step [--role planner|builder|reviewer|fixer]` (text or `--json`), `prime`, or `review --prompt`, THE SYSTEM SHALL display the configured target model for the active role and omit it cleanly when `agentic.models` is unset. verified: test: verified step (text/--json), prime, and review --prompt display configured role models and omit when unset
- [x] AC3: WHEN running `node scripts/ticket.mjs run` (including `--dry-run`), THE SYSTEM SHALL pass `ADW_MODEL` for the active role (`builder` or `reviewer`) into `runExternalPrompt`'s environment and display configured role models in `--dry-run` output. verified: test: verified ADW_MODEL env propagation for builder/reviewer in run and Models summary in run --dry-run
- [x] AC4: WHEN stamping a review with `node scripts/ticket.mjs review --model <model-id>`, THE SYSTEM SHALL persist `reviewModel` in plan frontmatter and include it in the review progress log entry while remaining backward-compatible when `--model` is omitted. verified: test: verified review --model persists reviewModel and (model: ...) log tag while remaining backward-compatible
- [x] AC5: WHEN reading `AGENTS.md`, `.agents/skills/{dev-workflow,quick-review,agentic-workflow}/SKILL.md` (mirrored identically under `.claude/skills/`), and `README.md`, THE SYSTEM SHALL document `agentic.models`, `ADW_MODEL`, `review --model`, and Antigravity `swarm` worker delegation per role. verified: inspect: updated AGENTS.md, README.md, and byte-identical .agents/.claude skill mirrors
- [x] AC6: WHEN `node --test scripts/ticket.test.mjs` executes, THE SYSTEM SHALL pass all existing tests plus new unit tests covering `agentic.models`, `step`/`prime`/`review --prompt`, `ADW_MODEL` in `run`, and `review --model`. verified: test: node --test scripts/ticket.test.mjs passed 93/93 tests (0 failures)

## Steps

- [x] Add `agentic.models` defaults to `scripts/ticket.config.json`, `ticket.config.example.json`, and `scripts/workflow-manifest.json` (AC1)
- [x] Update `scripts/ticket.mjs` to resolve `agentic.models` per role (including `step --role planner`), include role models in `step`/`step --json`/`prime`/`review --prompt`/`run --dry-run`, export `ADW_MODEL` in `runExternalPrompt`, and support optional `--model` on `review` (AC2, AC3, AC4)
- [x] Update `AGENTS.md`, `.agents/skills/{dev-workflow,quick-review,agentic-workflow}/SKILL.md` (and identical `.claude/skills/` mirrors), and `README.md` with role-to-model routing instructions and Antigravity `swarm` delegation guidance (AC5)
- [x] Add unit tests in `scripts/ticket.test.mjs` and verify with `node --test scripts/ticket.test.mjs` (AC6)

## Risks

- Hardcoding Gemini model names in shared prose could confuse Claude Code, Codex, or Cursor sessions; mitigated by keeping `agentic.models` config-driven/optional and scoping Antigravity `swarm` instructions clearly.
- Existing repos synced via `sync.mjs` keep their own `scripts/ticket.config.json`; mitigated by graceful omission when `agentic.models` is absent and documenting the config snippet in `README.md`.
- CLI sync invariant (`readmeCliSync`) and skill mirror invariant (`mirrorDirs`) will fail `ticket.mjs check` if `README.md` or `.claude/skills/` diverge; mitigated by updating mirrors together and running `node scripts/ticket.mjs check` and `node --test scripts/ticket.test.mjs`.

## Out of scope

- Running `sync.mjs` across other local repos (`example-desktop-app`, `FluentTimer`, etc.) in this PR.
- Enforcing or blocking reviews when `--model` does not match `agentic.models.reviewer` (kept informational/optional for cross-client compatibility).

## Notes

- Plan approval from Aaron (2026-11-19): "Agreed, plan looks good."
- Dogfooding this workflow in-session: Coordinator/Planner on `gemini-4-neon-medium`, Implementation delegated to `swarm` worker on `gemini-4-hydrogen-medium`, Independent Review delegated to `swarm` worker on `gemini-4-neon-low`.

## Progress log

<!-- One line per session/review, added with `ticket.mjs log` or `ticket.mjs review` -->
- 2026-11-19 16:01 UTC, Gemini (review: pass): All 6 ACs implemented cleanly with 93/93 tests passing, mirrored skills intact, and no regressions. [reviewer: reviewer-neon-low] (model: gemini-4-neon-low)
