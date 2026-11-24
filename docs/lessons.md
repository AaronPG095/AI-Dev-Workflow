# Workflow Lessons

<!-- Captured via `node scripts/ticket.mjs lesson` or `--retro` on `ship`/`pr`. Surfaced by `recall`, `review --prompt`, and `step --role reviewer`. -->
- 2026-11-23 | bug-fix · docs/plans/ADW-Plan-Fix-ListFilesRel-Junction-EISDIR-2026-11.plan.md | Fix `listFilesRel()` in `scripts/lib/invariants-lint.mjs` so directory symlinks and Windows directory junctions (such as `.claude/skills/supabase-postgres-best-practices` in `Fluent-Studio-Website`) are traversed rather
- 2026-11-23 | hooks, git, verify | When spawning git or verification subprocesses from git hooks, strip inherited GIT_DIR/GIT_WORK_TREE/GIT_INDEX_FILE env vars so child tests and temp repos do not mutate the parent checkout.
- 2026-11-23 | tests, sync, downstream | Every test in scripts/ticket.test.mjs must remain hermetic in downstream repos where AI-Dev-Workflow-only files (such as ticket.config.example.json) may not exist.
- 2026-11-23 | review, ci, shipping | Always bind PR shipping, review fingerprints, and Notion closeout to the exact committed HEAD and base branch so plan-link commits never invalidate reviews or close the wrong ticket.
