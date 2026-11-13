---
title: Plan - Process: Polish Sync Template Docs Archive And Verified Sync Gate
ticket: local://ADW:ADW-Plan-Polish-Sync-Template-Docs-Archive-And-Verified-Sync-Gate-2026-11
status: planned
priority: 
state: 
due: 
devTicketKey: ADW:ADW-Plan-Polish-Sync-Template-Docs-Archive-And-Verified-Sync-Gate-2026-11
agent: Gemini
---
# Polish Sync Template Docs Archive And Verified Sync Gate

## Summary

Align `scripts/sync.mjs` (`renderDevProcessSection`) with the current `AGENTS.md` process (removing hardcoded personal names and adding local-mode + zero-token commands), add a verified workflow-sync fast path to `ci-check` under `no-plan`, fix stale `README.md` / `docs/dev-workflow/setup-other-repos.md` details, and archive all 20 completed plans in `docs/plans/`.

## Acceptance criteria

- [ ] `renderDevProcessSection` in `scripts/sync.mjs` matches `AGENTS.md` (generic approval wording, local + Notion tracker docs, zero-token `tick`/`defer`/`recall`/`wt`/`doctor`/`pr --verify --auto` commands) and passes `sync.mjs` tests.
- [ ] `ci-check` in `scripts/ticket.mjs` allows a `no-plan` PR when every changed/removed file is a managed workflow file and `sync.mjs --check` verifies parity against upstream (or `ADW_TEST_SYNC_SOURCE` in tests), while still rejecting tampered workflow files or mixed source changes.
- [ ] `README.md` and `docs/dev-workflow/setup-other-repos.md` reflect the current test count, repository tree (`install.sh`, `workflow-manifest.json`), deduplicated bullets, verified sync rule, and tiered `verify`/`hygiene`/`agentic` config examples.
- [ ] All 20 shipped/done plans in `docs/plans/` are archived into `docs/plans/archive/<YYYY-MM>/` via `node scripts/ticket.mjs archive --all`.
- [ ] Hermetic tests in `scripts/ticket.test.mjs` cover the verified workflow-sync fast path (pass on pure verified sync, fail on tampered or mixed PR) and all tests pass (`node --test scripts/ticket.test.mjs`).

## Steps

- [ ] Update `renderDevProcessSection` in `scripts/sync.mjs` to match `AGENTS.md` and keep `ticket.test.mjs` sync assertions passing.
- [ ] Add verified workflow-sync fast path in `ci-check` (`scripts/ticket.mjs`) with `ADW_TEST_SYNC_SOURCE` test hook in `scripts/sync.mjs`.
- [ ] Update `README.md` and `docs/dev-workflow/setup-other-repos.md` to remove stale counts/duplicates and document tiered config + verified sync.
- [ ] Add unit test(s) for the verified workflow-sync fast path in `scripts/ticket.test.mjs` and run `node --test scripts/ticket.test.mjs`.
- [ ] Run `node scripts/ticket.mjs archive --all` to archive completed plans cleanly.

## Risks

- Weakening `ci-check` workflow policy protection: mitigated by requiring `NO_PLAN=1`, checking that 100% of changed/removed paths belong to the managed workflow set, and requiring `sync.mjs --check` to pass exit 0 against upstream before allowing the PR.

## Out of scope

- Modifying downstream repositories inside this PR (downstream sync, `verify` config updates, commits, and `hook install` will be applied directly in the downstream repos after this PR ships).

## Notes

User approval quoted:
> "Do both." (in response to the proposed final polish pass in AI-Dev-Workflow and downstream fleet rollout)

## Progress log

<!-- One line per session/review, added with `ticket.mjs log` or `ticket.mjs review` -->
