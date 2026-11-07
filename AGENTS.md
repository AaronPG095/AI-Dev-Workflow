# AI-Dev-Workflow

Canonical source for the shared, token-lean AI development workflow (plan, ticket, implement, single-pass review, close-out gate) used across repositories and AI clients (Claude Code, Codex, Gemini/Antigravity, Cursor).

- Zero external npm dependencies; runs on Node.js 22+.
- Verify changes to `scripts/ticket.mjs` with `node --test scripts/ticket.test.mjs`.
- Keep `.agents/skills/` and `.claude/skills/` identical.
- Never commit private Notion tokens or personal workspace UUIDs; keep public defaults in `scripts/ticket.config.json` and `ticket.config.example.json`.

## Development process (every AI: Claude, Codex, Gemini/Antigravity, Cursor)

Non-trivial changes follow these six steps. Only trivial changes (at most 40 changed lines, no new files under `scripts/`: typos, dependency bumps, one-line fixes) may skip them; their PR gets the `no-plan` label.

1. **Plan.** Investigate read-only and propose a plan. Wait for approval before changing code, and quote it under Notes in the plan.
2. **Plan doc.** Copy `docs/plans/_template.plan.md` to `docs/plans/ADW-Plan-<Topic>-<YYYY-MM>.plan.md` or scaffold with `node scripts/ticket.mjs new "<Topic>" [--type Feature] [--branch]`. The title reads `<Plan|Debug|Ask> - <Type>: <Title>` (for example `Plan - Feature: Smart Shortcut Suggestions`); optionally set `priority`, `state` and `due` in the frontmatter. Acceptance criteria and Steps are `- [ ]` checkboxes. A plan bigger than one PR is split into separate plans, one per PR.
3. **Ticket.** Run `node scripts/ticket.mjs create <plan> --agent <Claude|Codex|Gemini|Other>`. In Notion mode, it creates the Notion Task (ADW prefix, To Do, `Task Lane = Development`, a stable `Dev Ticket Key`, plus any explicit priority, state and real deadline (`due`); no Focus Slot or scheduling Date) and writes its URL into the plan; in local mode (`tracker: "local"`), it records `local://<key>`. Creation queries the stable key first in Notion mode and restores an existing canonical URL without changing the Task. Preserve `devTicketKey` when renaming a plan. Do not run concurrent creates for the same plan.
4. **Implement.** Create a branch, commit the plan on it, and run `node scripts/ticket.mjs start [<plan>]` (Task → Doing and Started At; records the branch and worktree in the plan).
   - Cold start / resume: run `node scripts/ticket.mjs prime` for a compact session context primer with numbered `[#]` checkboxes, `node scripts/ticket.mjs resume` for handoff state, or `node scripts/ticket.mjs overview` for multi-repo status.
   - Tick each checkbox as soon as it is done with zero tokens: `node scripts/ticket.mjs tick <#|query> [--verified <evidence>]`. A ticked acceptance criterion ends with concise `verified: <how it was checked and the result>` evidence (one line, no raw terminal dumps); never tick one you have not verified.
   - Never delete a checkbox. Anything you will not do stays unticked and ends with `deferred: <reason>` via `node scripts/ticket.mjs defer <#|query> --reason <why>`.
   - Record architectural choices in `docs/decisions/` with `node scripts/ticket.mjs adr "<Title>"`. Search past decisions and notes with `node scripts/ticket.mjs recall "<query>" [--fleet]`. Manage isolated worktrees cleanly with `node scripts/ticket.mjs wt [list|new|prune] [--fleet]`. Run `node scripts/ticket.mjs doctor [--fleet]` for fleet diagnostic health. Progress lives in the plan; do not post progress to Notion.
   - **Before you stop** (end of session, usage limit, handing over), run `node scripts/ticket.mjs handoff --agent <you> --done "<done>" --next "<step>" [--open "<questions>"]` (or `log`) and commit the plan. To continue someone else's work, run `node scripts/ticket.mjs resume`, read the plan fully, and resume at the first unticked step.
5. **Review.** Before closing out, run `node scripts/ticket.mjs pack [<plan>] [--test]` (0 LLM tokens, embeds test results with `--test`) to generate a compact review digest (plan criteria, hygiene check, and filtered diff). Perform a single-pass review checking plan fidelity, regressions, and verification honesty (using the `quick-review` skill or a fresh session/second model when practical), then stamp the result with `node scripts/ticket.mjs review [<plan>] --agent <you> --verdict <pass|warn|block> --summary "<findings>"`. A `block` verdict fails close-out until resolved.
6. **Finish.** You are done only when `node scripts/ticket.mjs check [<plan>]` passes. Open the PR and ship in one command: `node scripts/ticket.mjs pr [--verify] [--auto] [--draft]` (or open manually with the template filled in and run `node scripts/ticket.mjs ship [<plan>] --pr <url>`). Merging closes the Task (Done and Completed At); never set it to Done yourself.

If a `ticket.mjs` command fails (for example no `NOTION_TOKEN` in Notion mode), say so and stop at that step. Do not create or update the ticket another way. CI (`Plan check`) blocks a PR whose plan has open items, unverified criteria, a `block` review verdict, removed checkboxes or no ticket, and a `no-plan` PR that is not trivial.
Git pre-push guardrail: run `node scripts/ticket.mjs hook install` to prevent accidental direct pushes to protected branches.

Setting up or syncing this process in another repo: follow `docs/dev-workflow/setup-other-repos.md` or run `node scripts/sync.mjs --remote` (or `.\scripts\sync-repos.ps1`).
