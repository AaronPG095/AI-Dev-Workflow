# Workflow Lessons

<!-- Captured via `node scripts/ticket.mjs lesson` or `--retro` on `ship`/`pr`. Surfaced by `recall`, `review --prompt`, and `step --role reviewer`. -->
- 2026-11-23 | bug-fix · docs/plans/ADW-Plan-Fix-ListFilesRel-Junction-EISDIR-2026-11.plan.md | Fix `listFilesRel()` in `scripts/lib/invariants-lint.mjs` so directory symlinks and Windows directory junctions (such as `.claude/skills/supabase-postgres-best-practices` in `Fluent-Studio-Website`) are traversed rather
