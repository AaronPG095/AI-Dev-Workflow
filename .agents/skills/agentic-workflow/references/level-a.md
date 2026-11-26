# Level A: Autonomous Self-Healing Step Loop

1. **Obtain Next Step Brief:**
   ```bash
   node scripts/ticket.mjs step [--json]
   node scripts/ticket.mjs step --role planner|builder
   ```
2. **Implement Step:** Make minimal changes scoped strictly to the target step.
3. **Verify & Self-Heal (Max 3 Retries):**
   - Run the brief's verify tier; if tests fail, inspect errors and fix.
   - **Circuit Breaker:** After 3 consecutive failures, stop, record `node scripts/ticket.mjs handoff --agent <you> --done "..." --next "<failing step>" --open "<error>"`, and alert the user.
4. **Checkpoint & Commit:**
   ```bash
   node scripts/ticket.mjs checkpoint <#> --commit
   ```
5. **Outer-Loop Supervisor (`run`):**
   ```bash
   node scripts/ticket.mjs run [<plan>] --cmd "<runner>" [--review-cmd "<runner>"] [--commit] [--tier <name>] [--max-retries <N>] [--max-steps <N>] [--no-review] [--dry-run]
   ```
   Exports `ADW_PROMPT_FILE`, `ADW_PLAN`, `ADW_STEP`, `ADW_ROLE`, and `ADW_MODEL`.
