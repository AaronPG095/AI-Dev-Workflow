---
title: Plan - Feature: Fleet and Archive Polish
ticket: local://ADW:ADW-Plan-Fleet-And-Archive-Polish-2026-11
status: shipped
priority: 
state: 
due: 
devTicketKey: ADW:ADW-Plan-Fleet-And-Archive-Polish-2026-11
agent: Gemini
branch: feat/fleet-and-archive-polish
worktree: AI-Dev-Workflow
startedAt: 2026-11-13
reviewedBy: Gemini
reviewVerdict: pass
reviewFingerprint: d792cbb909c7744739437289814cfa2b9a152ebd571e6f7e17486393391c5a65
pr: https://github.com/AaronPG095/AI-Dev-Workflow/pull/25
---
# Fleet and Archive Polish

## Summary

Unify active-plan resolution across `overview` and `fleet` via a shared `resolveRepoActivePlan` helper, exempt pure closed-plan moves into `archive/` from `no-plan`'s `maxChangedLines` cap in `ci-check`, add `--fleet` and worktree-aware `resolveHookPath` support to `hook` and `doctor`, and update setup docs and `README.md`. Finally, archive the 20 completed plans in `docs/plans/` and install pre-push hooks across the 7-repo fleet.

## Acceptance criteria

- [x] `resolveRepoActivePlan(dir, branch, repoCfg)` cleanly resolves active plans across both `overview` and `fleet` so `fleet` matches `overview` for branch-matched plans. verified: overview and fleet both show FO-Plan-Header-Translations-Slider-Sync-And-Favourites-Fix-2026-11 on FluentOverlay
- [x] `ci-check` validates that newly archived plans under `${config.plansDir}/archive/` are closed (`isClosed`) and excludes verified archive moves from `no-plan`'s `maxChangedLines` count. verified: ci-check regression test passed archive move, no-plan exclusion, and unclosed rejection
- [x] `hook [install|uninstall|status]` supports `--fleet` across all known repos, and both `hook` and `doctor` use shared worktree-aware `resolveHookPath(dir)` (`git rev-parse --git-path hooks`). verified: hook [install|status|uninstall] --fleet and doctor use resolveHookPath including custom .githooks
- [x] `docs/dev-workflow/setup-other-repos.md` and `README.md` document tiered `verify`/`hygiene`/`agentic` config options and `hook ... [--fleet]`. verified: setup-other-repos.md Option A/B include verify/hygiene/agentic; README.md documents hook --fleet
- [x] All 20 completed plans in `docs/plans/` are archived into `docs/plans/archive/2026-11/` via `node scripts/ticket.mjs archive --all`, and pre-push hooks are installed across all 7 fleet repos via `node scripts/ticket.mjs hook install --fleet`. verified: archive --all archived 20 plans to docs/plans/archive/2026-11; doctor --fleet shows Pre-push: installed in 7/7 repos
- [x] Regression tests in `scripts/ticket.test.mjs` verify all new behaviors and `node --test scripts/ticket.test.mjs` passes. verified: node --test scripts/ticket.test.mjs passed 71/71 (0 fail)

## Steps

- [x] Add `resolveHookPath` and `resolveRepoActivePlan` helpers and update `overview`, `fleet`, `hook`, and `doctor` in `scripts/ticket.mjs`. verified: resolveHookPath and resolveRepoActivePlan added and wired in ticket.mjs
- [x] Update `ci-check` in `scripts/ticket.mjs` to validate closed archived plans and exempt verified archive moves from `no-plan` line limits. verified: ci-check validates closed archive files and exempts verified moves
- [x] Update `docs/dev-workflow/setup-other-repos.md` and `README.md`. verified: setup-other-repos.md and README.md updated with tiered config and hook --fleet
- [x] Run `archive --all`, `hook install --fleet`, and `doctor --fleet`. verified: archive --all archived 20 plans; hook install --fleet + doctor --fleet showed 7/7 installed
- [x] Add regression tests in `scripts/ticket.test.mjs` and run `node --test scripts/ticket.test.mjs`. verified: node --test scripts/ticket.test.mjs passed 71/71

## Risks

Running `archive --all` after ticking all checkboxes in this plan would archive the active plan prematurely; mitigated by running `archive --all` before final checkbox tick/close-out. Using `git diff --numstat --no-renames` avoids `{old => new}` rename path mismatches in `ci-check`.

## Out of scope

Committing, staging, or opening PRs inside the 6 sibling repositories.

## Notes

Approval: "Plan the polish with argon and then switch to hydrogen medium for implementation."

## Progress log

<!-- One line per session/review, added with `ticket.mjs log` or `ticket.mjs review` -->
- 2026-11-13 08:21 UTC, Gemini (review: pass): Verified resolveRepoActivePlan parity in overview/fleet, ci-check closed-archive validation and move exemption, hook --fleet and resolveHookPath with custom hooksPath, docs alignment, 20 plans archived, and 71/71 tests passing.
