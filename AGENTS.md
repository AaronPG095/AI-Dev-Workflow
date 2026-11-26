# AI-Dev-Workflow

Canonical source for the shared, token-lean AI development workflow (plan, ticket, implement, single-pass review, close-out gate) used across repositories and AI clients (Claude Code, Codex, Gemini/Antigravity, Cursor).

- Zero external npm dependencies; runs on Node.js 22+.
- Verify changes to `scripts/ticket.mjs` with `node --test scripts/ticket.test.mjs`.
- Keep `.agents/skills/` and `.claude/skills/` identical.
- Always keep `README.md` updated with newly introduced CLI commands, flags, and configuration features.
- Never commit private Notion tokens or personal workspace UUIDs; keep public defaults in `scripts/ticket.config.json` and `ticket.config.example.json`.

## Development process (every AI: Claude, Codex, Gemini/Antigravity, Cursor)

Non-trivial changes follow these six steps. Only trivial changes with at most 40 changed lines, no new files under `scripts/`, and no managed workflow changes may skip them. Label those PRs `no-plan`.

1. **Plan.** Investigate read-only, propose a plan, wait for approval, and quote it under Notes (use `blueprint` for multi-PR initiatives).
2. **Plan doc.** Create `docs/plans/ADW-Plan-<Topic>-<YYYY-MM>.plan.md` via `node scripts/ticket.mjs new "<Topic>"` (one PR per plan; split if larger).
3. **Ticket.** Run `node scripts/ticket.mjs create <plan> --agent <Claude|Codex|Gemini|Other>` (ADW prefix, To Do, Development, stable `Dev Ticket Key` / `local://`). Preserve `devTicketKey` on rename; never run concurrent creates.
4. **Implement.** Branch, commit plan, run `node scripts/ticket.mjs start [<plan>]`. Use `prime`/`resume` on cold starts, `context-gatekeeper` (`run_compact` + `fetch_chunk`; `repo_map` → `symbol_outline` → `read_symbol`) for verbose output or large files, and `tick`/`defer` (never delete checkboxes). Progress stays in the plan; run `handoff` before stopping.
5. **Review.** Run `node scripts/ticket.mjs pack [<plan>] [--test]`, complete a mandatory independent review (`requireReview: true`, `allowSelfReview: false`) using `quick-review`, and stamp `review --agent <client> --reviewer-id <id> --verdict <pass|warn|block> --summary "..."`.
6. **Finish.** Run `node scripts/ticket.mjs check [<plan>]`, open/link PR (`pr` or `ship --pr <url>`), and `merge` (never mark Task Done pre-merge).

If `ticket.mjs` fails, stop and report. Detailed flags: `dev-workflow` skill & `README.md`.
Pre-push guardrail: `node scripts/ticket.mjs hook install`. Sync: `node scripts/sync.mjs --remote`.
