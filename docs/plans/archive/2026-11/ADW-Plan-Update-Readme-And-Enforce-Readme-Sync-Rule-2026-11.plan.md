---
title: Plan - Docs: Update Readme And Enforce Readme Sync Rule
ticket: local://ADW:ADW-Plan-Update-Readme-And-Enforce-Readme-Sync-Rule-2026-11
status: in-progress
priority: medium
state: flow
due: 
devTicketKey: ADW:ADW-Plan-Update-Readme-And-Enforce-Readme-Sync-Rule-2026-11
agent: Gemini
branch: feat/update-readme-and-enforce-readme-sync-rule
worktree: AI-Dev-Workflow
startedAt: 2026-11-10
reviewedBy: Gemini
reviewVerdict: pass
---
# Update Readme And Enforce Readme Sync Rule

## Summary

Update `README.md` with all recently introduced features from Track A (tiered verification matrix and working-tree hygiene guardrails) and Track B (smart worktree switcher, plan splitter, and multi-agent review helpers/guardrails). Additionally, institutionalize the workflow rule across `AGENTS.md` and the `dev-workflow` skills to ensure `README.md` is always kept up to date whenever new commands, flags, or configuration features are added.

## Acceptance criteria

- [x] `README.md` documents all Track A and Track B capabilities: tiered verification (`verify`), hygiene checks (`hygiene`), worktree switching (`switch`), plan splitting (`split`), and review enhancements (`--prompt`, dual-pass, guardrails). verified: README.md updated with all Track A and B commands and workflow steps
- [x] `README.md` test suite count updated to reflect the full 51-test suite. verified: README.md line 192 updated to 51-test hermetic test suite
- [x] `AGENTS.md` includes the explicit rule requiring `README.md` to be updated whenever new CLI commands, flags, or configuration features are introduced. verified: AGENTS.md top bullets and step 4 updated with README sync rule
- [x] `.agents/skills/dev-workflow/SKILL.md` and `.claude/skills/dev-workflow/SKILL.md` are kept identical and instruct agents to update `README.md` during feature development. verified: diff verified 0 difference between .agents and .claude skills with README rule added
- [x] All unit tests pass 100% (`node --test scripts/ticket.test.mjs`). verified: all 51 unit tests passed with 0 failures

## Steps

- [x] Update `README.md` with new features from Track A and Track B and updated test counts.
- [x] Update `AGENTS.md` and skills (`.agents/skills/dev-workflow/SKILL.md`, `.claude/skills/dev-workflow/SKILL.md`) to establish the README sync rule.
- [x] Run test suite `node --test scripts/ticket.test.mjs` and verify all tests pass.
- [x] Run `ticket.mjs pack --test` and stamp review verdict with `ticket.mjs review`.
- [x] Run `ticket.mjs check`, push branch, open PR, and merge to `main`.

## Risks

- Divergence between `.agents/skills/` and `.claude/skills/`: contained by updating both simultaneously and verifying file equality.

## Out of scope

- Modifying existing functional CLI code in `scripts/ticket.mjs`.

## Notes

User approval quoted:
"Please also ensure that the readme for the AI dev workflow always gets updated when we add new features."

## Progress log

<!-- One line per session/review, added with `ticket.mjs log` or `ticket.mjs review` -->
- 2026-11-10 07:39 UTC, Gemini (review: pass [standards: pass, spec: pass]): Updated README with Track A and B features, updated test count to 51, and established README sync rule across AGENTS.md and dev-workflow skills
