---
title: Plan - Feature: Agentic Outer-Loop Supervisor and Wave Lifecycle Closure
ticket: local://ADW:ADW-Plan-Agentic-Supervisor-Wave-Lifecycle-2026-11
status: shipped
priority: high
state: flow
due: 
devTicketKey: ADW:ADW-Plan-Agentic-Supervisor-Wave-Lifecycle-2026-11
agent: Gemini
branch: feat/agentic-supervisor-wave-lifecycle
worktree: AI-Dev-Workflow
startedAt: 2026-11-12
reviewedBy: Gemini
reviewVerdict: pass
reviewFingerprint: 392171680bc6ae472bd4037d47db481518bf01e7fb28bbe7f9d77330a64a5030
pr: https://github.com/AaronPG095/AI-Dev-Workflow/pull/24
---
# Agentic Outer-Loop Supervisor and Wave Lifecycle Closure

<!--
Copy to docs/plans/<PREFIX>-Plan-<Topic>-<YYYY-MM>.plan.md. Follow "Development process" in AGENTS.md.
Title: <Plan|Debug|Ask> - <Type>: <Title>. Type is Feature, Bug, Refactor, Docs, Perf, Process or similar; the script adds the project prefix.
Optional, set before `create` (leave empty if unsure): priority (emergency, critical, high, medium, low), state (quick, easy, flow), due (YYYY-MM-DD, only an explicit real deadline).
Creation starts To Do with Task Lane = Development and a stable Dev Ticket Key, queries the key before creating, and leaves Focus Slot/Date blank. Preserve devTicketKey if renaming this plan; do not run concurrent creates for the same plan.
Frontmatter is maintained by scripts/ticket.mjs: ticket, devTicketKey, status (draft -> planned -> in-progress -> shipped -> done), agent, branch, worktree, reviewedBy, reviewVerdict, pr.
Rules the check enforces:
- Every Acceptance criteria and Steps line is a checkbox. Tick it the moment it is done.
- A ticked acceptance criterion ends with "verified: <how it was checked and the result>". Keep evidence terse (1 line).
- Never delete a checkbox. An item you will not do stays unticked and ends with "deferred: <reason>".
- Before shipping, run `node scripts/ticket.mjs pack` for a 0-token review digest and record the review with `node scripts/ticket.mjs review --agent <client> --verdict <pass|warn|block> --summary "<findings>"`.
-->

## Summary

Complete the Layer 2 Agentic Coding Engine in `scripts/ticket.mjs` by adding an outer-loop autonomous supervisor (`node scripts/ticket.mjs run [<plan>]`), full Level C wave verification and cleanup (`wave --check` and `wave --prune`), and aligning `starterConfig` in `scripts/workflow-manifest.json` with tiered `verify`, `hygiene`, and `agentic` defaults.

## Acceptance criteria

- [x] `step` and `checkpoint` share reusable internal helpers (`buildStepBrief` and `executeCheckpoint`) with `run` so prompt generation, verification, `retryCount` tracking, circuit-breaker enforcement, and `--commit` index/hygiene guards have a single source of truth. verified: step, checkpoint, and run share buildStepBrief and executeCheckpoint with 70/70 tests passing
- [x] `node scripts/ticket.mjs run [<plan>] [--cmd "<runner>"] [--review-cmd "<runner>"] [--commit] [--tier <name>] [--max-retries <N>] [--max-steps <N>] [--no-review] [--dry-run]` drives an external CLI command step-by-step via `stdin` and `ADW_PROMPT_FILE` (plus `ADW_PLAN`, `ADW_STEP`, `ADW_ROLE`), runs checkpoint verification after each step, feeds failure output into the next retry up to `maxRetries` before tripping the circuit breaker, and optionally runs a `--role reviewer` pass when all checkboxes complete. verified: run outer-loop retries, ADW_PROMPT_FILE/stdin, circuit breaker, and reviewer pass verified in test #69
- [x] `checkHygiene(cfg = config, dir = repoRoot)` supports inspecting any registered worktree directory via `worktreeGit(dir, ...)`, and `node scripts/ticket.mjs wave --check [--test] [--strict]` evaluates `problems(plan)` and `checkHygiene(config, entry.path)` (plus optional test tier with `--test`) across all active wave worktrees, printing a summary table and exiting non-zero if any worktree fails. verified: checkHygiene(cfg, dir) and wave --check [--test] table/exit verified in test #70
- [x] `node scripts/ticket.mjs wave --prune [--dry-run] [--all]` shares worktree pruning logic with `wt prune` and safely removes clean, unlocked linked worktrees under `.worktrees/` whose plan is closed (`done`/`shipped` or all checkboxes completed) and merged (or all clean closed wave worktrees with `--all`), never removing dirty, locked, or invoking checkouts. verified: wave --prune safe cleanup and dry-run verified in test #70 (exit 0)
- [x] `scripts/workflow-manifest.json` `starterConfig` includes `verify: { test: "npm test", full: "npm test" }`, `hygiene: { maxFileSizeKB: 1024, disallowedPatterns: [".tmp", "test-results", "coverage", ".worktrees"] }`, and `agentic: { maxRetries: 3, verifyTier: "test" }` while keeping `verifyCommand: "npm test"` for backward compatibility. verified: manifest starterConfig verified with verify, hygiene, and agentic defaults in test #70
- [x] `scripts/ticket.test.mjs`, `README.md`, `.agents/skills/agentic-workflow/SKILL.md`, and `.claude/skills/agentic-workflow/SKILL.md` are updated (with both `SKILL.md` files identical) and all unit tests pass via `node --test scripts/ticket.test.mjs`. verified: Skills byte-identical (7217 bytes) and 70/70 tests pass via node --test scripts/ticket.test.mjs

## Steps

- [x] Refactor `step` and `checkpoint` in `scripts/ticket.mjs` to extract `buildStepBrief(plan, options)` and `executeCheckpoint(plan, options)` (returning structured `{ passed, retries, maxRetries, verifyOutput, nextItem }` or throwing/failing as requested) without changing existing CLI behavior.
- [x] Implement `run` command in `scripts/ticket.mjs` (plus boolean flags `--no-review`, `--check`, `--prune` in `BOOLEAN_FLAGS`) supporting `--cmd` (or `config.agentic?.runnerCmd`), `--review-cmd`, `--commit`, `--tier`, `--max-retries`, `--max-steps`, `--no-review`, and `--dry-run`, passing the brief via `stdin` and temporary `ADW_PROMPT_FILE` (cleaned up in `finally`).
- [x] Extend `checkHygiene(cfg = config, dir = repoRoot)` to accept a target worktree `dir`, extract shared `pruneLinkedWorktrees` helper used by both `wt prune` and `wave --prune`, and implement `wave --check [--test] [--strict]` and `wave --prune [--dry-run] [--all]` in `scripts/ticket.mjs`.
- [x] Update `starterConfig` in `scripts/workflow-manifest.json` to include `verify`, `hygiene`, and `agentic` defaults alongside `verifyCommand`.
- [x] Update `README.md`, `.agents/skills/agentic-workflow/SKILL.md`, and `.claude/skills/agentic-workflow/SKILL.md` (keeping both skills byte-identical) to document `run`, `wave --check`, and `wave --prune`.
- [x] Add automated tests in `scripts/ticket.test.mjs` covering `run` (`--dry-run`, multi-step autonomous completion, self-healing retry on failure, circuit-breaker trip, and reviewer invocation), `wave --check` (clean vs failing worktree), and `wave --prune` (`--dry-run` and closed/merged worktree cleanup), then run full verification.

## Risks

- **Shell injection when passing plan text to external runner commands:** Mitigated by never interpolating plan text into the shell command string. Instead, pass the prompt via `stdin` (`input: brief`) and write it to a temporary file path exposed via `ADW_PROMPT_FILE` (plus `ADW_PLAN`, `ADW_STEP`, `ADW_ROLE` in `env`), cleaning up the temp file in `finally`.
- **Infinite loops if an external runner exits 0 without making progress:** Mitigated by running `executeCheckpoint` after each builder invocation (which increments `retryCount` and trips `CIRCUIT BREAKER TRIPPED` at `maxRetries` when verification fails) and enforcing a hard `--max-steps` cap (default `50`) plus a per-step progress guard if a runnerneither ticks nor modifies anything across `maxRetries` attempts.
- **Accidental deletion of active or dirty worktrees during `wave --prune`:** Mitigated by sharing the hardened `wt prune` safety checks (`!entry.locked`, `existsSync(path)`, not containing `repoRoot` or `process.cwd()`, inside `realpathSync(join(main.path, '.worktrees'))`, zero porcelain status output, and `worktreePlanClosed(plan)`).

## Out of scope

- Background daemonization or OS-specific process managers for `run` (it runs synchronously in the foreground terminal or CI job).
- Automatic branch merging or force-pushing across worktrees during `wave --prune`.

## Notes

- Plan approved by Aaron:
  > "Run the fleet sync. We will then plan and build the high value improvements after that."
  > "Create the plan doc, branch and local ticket. We will then implement with Flash 3.8."
- Implementation pointers for Flash 3.8:
  - In `BOOLEAN_FLAGS` (`scripts/ticket.mjs`), add `'--no-review'`, `'--check'`, and `'--prune'` so `node scripts/ticket.mjs wave --check`, `node scripts/ticket.mjs wave --prune`, and `node scripts/ticket.mjs run --no-review` parse cleanly as boolean flags.
  - In `executeCheckpoint`, capture stdout/stderr on verification failure (while still printing it to console) so `run` can pass the last ~15 lines of failure output (`failureContext`) into the next `builder` brief under a `## Last Verification Failure` section when retrying.
  - When `executeCheckpoint` succeeds in `run`, if the runner command didn't already tick the target checkbox itself, `executeCheckpoint` ticks it (and commits if `--commit` is set). If the runner command *already* called `ticket.mjs checkpoint` inside its own subshell and ticked the target item cleanly, detect that the target checkbox is already ticked on disk and advance to the next open item without double-ticking or failing!

## Progress log

<!-- One line per session/review, added with `ticket.mjs log` or `ticket.mjs review` -->
- 2026-11-12 14:11 UTC, Gemini (review: pass): All 6 acceptance criteria and 6 steps verified against diff and 70/70 passing tests. Shared helpers (resolveStepContext, buildStepBrief, executeCheckpoint, pruneLinkedWorktrees) eliminate duplication; run supervisor safely isolates prompts via stdin/ADW_PROMPT_FILE with finally cleanup and circuit-breaker enforcement; wave --check and --prune handle worktree lifecycle cleanly.
- 2026-11-12 14:15 UTC, Gemini (review: pass): Polished run command to auto-stamp verified evidence when runner ticks criteria directly; all 70 tests pass.
