# Workflow Lessons

<!-- Captured via `node scripts/ticket.mjs lesson` or `--retro` on `ship`/`pr`. Surfaced by `recall`, `review --prompt`, and `step --role reviewer`. -->
- 2026-11-23 | bug-fix · docs/plans/ADW-Plan-Fix-ListFilesRel-Junction-EISDIR-2026-11.plan.md | Fix `listFilesRel()` in `scripts/lib/invariants-lint.mjs` so directory symlinks and Windows directory junctions (such as `.claude/skills/supabase-postgres-best-practices` in `example-web-app`) are traversed rather
- 2026-11-23 | hooks, git, verify | When spawning git or verification subprocesses from git hooks, strip inherited GIT_DIR/GIT_WORK_TREE/GIT_INDEX_FILE env vars so child tests and temp repos do not mutate the parent checkout.
- 2026-11-23 | tests, sync, downstream | Every test in scripts/ticket.test.mjs must remain hermetic in downstream repos where AI-Dev-Workflow-only files (such as ticket.config.example.json) may not exist.
- 2026-11-23 | review, ci, shipping | Always bind PR shipping, review fingerprints, and Notion closeout to the exact committed HEAD and base branch so plan-link commits never invalidate reviews or close the wrong ticket.
- 2026-11-24 | bug-fix · docs/plans/ADW-Plan-Hermetic-Fast-Verify-Test-Hooks-And-Seeded-Lessons-2026-11.plan.md | Make F1 verify.fast test assertion hermetic for downstream repos, track .claude/settings.json runtime hooks in git, and merge the 3 seeded workflow lessons onto main.
- 2026-11-28 | bug-fix · docs/plans/ADW-Plan-Independent-Re-review-Handoff-2026-11.plan.md | Align the fixer and reviewer instructions with the independent review gate.
