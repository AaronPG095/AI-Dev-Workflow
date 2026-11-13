---
title: Plan - Feature: Fleet and Archive Polish
ticket: local://ADW:ADW-Plan-Fleet-And-Archive-Polish-2026-11
status: planned
priority: 
state: 
due: 
devTicketKey: ADW:ADW-Plan-Fleet-And-Archive-Polish-2026-11
agent: Gemini
---
# Fleet and Archive Polish

## Summary

Unify active-plan resolution across `overview` and `fleet` via a shared `resolveRepoActivePlan` helper, exempt pure closed-plan moves into `archive/` from `no-plan`'s `maxChangedLines` cap in `ci-check`, add `--fleet` and worktree-aware `resolveHookPath` support to `hook` and `doctor`, and update setup docs and `README.md`. Finally, archive the 20 completed plans in `docs/plans/` and install pre-push hooks across the 7-repo fleet.

## Acceptance criteria

- [ ] `resolveRepoActivePlan(dir, branch, repoCfg)` cleanly resolves active plans across both `overview` and `fleet` so `fleet` matches `overview` for branch-matched plans.
- [ ] `ci-check` validates that newly archived plans under `${config.plansDir}/archive/` are closed (`isClosed`) and excludes verified archive moves from `no-plan`'s `maxChangedLines` count.
- [ ] `hook [install|uninstall|status]` supports `--fleet` across all known repos, and both `hook` and `doctor` use shared worktree-aware `resolveHookPath(dir)` (`git rev-parse --git-path hooks`).
- [ ] `docs/dev-workflow/setup-other-repos.md` and `README.md` document tiered `verify`/`hygiene`/`agentic` config options and `hook ... [--fleet]`.
- [ ] All 20 completed plans in `docs/plans/` are archived into `docs/plans/archive/2026-11/` via `node scripts/ticket.mjs archive --all`, and pre-push hooks are installed across all 7 fleet repos via `node scripts/ticket.mjs hook install --fleet`.
- [ ] Regression tests in `scripts/ticket.test.mjs` verify all new behaviors and `node --test scripts/ticket.test.mjs` passes.

## Steps

- [ ] Add `resolveHookPath` and `resolveRepoActivePlan` helpers and update `overview`, `fleet`, `hook`, and `doctor` in `scripts/ticket.mjs`.
- [ ] Update `ci-check` in `scripts/ticket.mjs` to validate closed archived plans and exempt verified archive moves from `no-plan` line limits.
- [ ] Update `docs/dev-workflow/setup-other-repos.md` and `README.md`.
- [ ] Run `archive --all`, `hook install --fleet`, and `doctor --fleet`.
- [ ] Add regression tests in `scripts/ticket.test.mjs` and run `node --test scripts/ticket.test.mjs`.

## Risks

Running `archive --all` after ticking all checkboxes in this plan would archive the active plan prematurely; mitigated by running `archive --all` before final checkbox tick/close-out. Using `git diff --numstat --no-renames` avoids `{old => new}` rename path mismatches in `ci-check`.

## Out of scope

Committing, staging, or opening PRs inside the 6 sibling repositories.

## Notes

Approval: "Plan the polish with argon and then switch to hydrogen medium for implementation."

## Progress log

<!-- One line per session/review, added with `ticket.mjs log` or `ticket.mjs review` -->
