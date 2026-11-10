---
title: Plan - Feature: Developer And Multi Agent Velocity
ticket: local://ADW:ADW-Plan-Developer-And-Multi-Agent-Velocity-2026-11
status: planned
priority: medium
state: flow
due: 
devTicketKey: ADW:ADW-Plan-Developer-And-Multi-Agent-Velocity-2026-11
agent: Gemini
---
# Developer And Multi Agent Velocity

## Summary

Enhance developer and multi-agent velocity across the workflow with three core capabilities: (1) a smart worktree switcher (`ticket.mjs switch [<plan|branch>]`) for instant context switching with `.env` setup, (2) an automated plan splitter (`ticket.mjs split <plan> --after <#|query>`) to partition oversized plans into consecutive PR milestones while preserving plan traceability, and (3) multi-agent review helpers (`ticket.mjs review --prompt` and dual-pass `--standards`/`--spec` validation with review guardrails).

## Acceptance criteria

- [ ] `node scripts/ticket.mjs switch [<plan|branch>]` navigates or creates isolated worktrees on-demand, copies `.env`, and supports `--path` output for shell integrations.
- [ ] `node scripts/ticket.mjs split <plan> --after <#|query>` cleanly splits a plan doc into Part 1 and Part 2, defers moved items in Part 1 with references to Part 2, and creates the Part 2 plan doc.
- [ ] `node scripts/ticket.mjs review --prompt [<plan>]` generates a structured, token-lean review prompt for AI sub-agents or secondary models containing acceptance criteria and review standards.
- [ ] `node scripts/ticket.mjs review` supports `--standards <pass|warn|block>` and `--spec <pass|warn|block>` dual-pass flags, calculating the combined verdict automatically.
- [ ] `node scripts/ticket.mjs review` guards against accidental `pass` verdicts when open criteria remain unticked or working tree hygiene has critical issues unless `--force` is passed.
- [ ] Comprehensive unit tests cover `switch`, `split`, review prompt generation, dual-pass reviews, and review guardrails in `scripts/ticket.test.mjs`.
- [ ] All unit tests pass 100% (`node --test scripts/ticket.test.mjs`).

## Steps

- [ ] Implement `switch` command in `scripts/ticket.mjs`.
- [ ] Implement `split` command in `scripts/ticket.mjs`.
- [ ] Implement review prompt generator, dual-pass verdict calculation, and review guardrails in `scripts/ticket.mjs`.
- [ ] Add comprehensive unit tests for `switch`, `split`, and review enhancements in `scripts/ticket.test.mjs`.
- [ ] Run test suite `node --test scripts/ticket.test.mjs` and verify 100% pass rate.
- [ ] Run `ticket.mjs pack --test` and stamp review verdict with `ticket.mjs review`.
- [ ] Run `ticket.mjs check`, push branch, open PR, and merge to `main`.

## Risks

- Worktree creation collisions or invalid paths: contained by checking existing worktrees, validating target directories, and supporting dry-run.
- Plan splitting corrupting checkbox state: contained by using line-based item extraction, strictly preserving YAML frontmatter, and keeping all original items in Part 1 marked as deferred with pointer to Part 2.

## Out of scope

- Interactive terminal GUI for worktree selection (kept lightweight CLI only).
- Directly executing external LLM API calls inside `ticket.mjs` (the prompt is emitted for the calling agent/user to delegate).

## Notes

User approval quoted:
"implement track b And then prompt the remaining options after."

## Progress log

<!-- One line per session/review, added with `ticket.mjs log` or `ticket.mjs review` -->
