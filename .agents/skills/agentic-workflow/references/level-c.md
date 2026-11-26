# Level C: Parallel Worktree Waves

Coordinate multi-plan development across isolated git worktrees without collisions:

1. **Provision Worktree Wave:**
   ```bash
   node scripts/ticket.mjs wave --spawn
   node scripts/ticket.mjs wave docs/plans/Plan-A.plan.md docs/plans/Plan-B.plan.md --spawn
   ```
   Skips plans with unsatisfied `dependsOn` dependencies unless `--force` is passed.
2. **Dispatch Agents:**
   ```bash
   cd .worktrees/<name>
   node scripts/ticket.mjs step --role builder
   ```
3. **Monitor Progress:**
   ```bash
   node scripts/ticket.mjs wave --status
   ```
4. **Check & Prune:**
   ```bash
   node scripts/ticket.mjs wave --check [--test] [--strict]
   node scripts/ticket.mjs wave --prune [--dry-run] [--all]
   ```
