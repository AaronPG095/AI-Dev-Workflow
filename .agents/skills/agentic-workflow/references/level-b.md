# Level B: Role-Isolated Adversarial Review

Prevent confirmation bias by separating Builder and Reviewer contexts:

1. **Spawn Reviewer in Fresh Context:**
   ```bash
   node scripts/ticket.mjs step --role reviewer
   ```
2. **Run Deterministic Review Digest:**
   ```bash
   node scripts/ticket.mjs pack --test
   ```
   Check spec fidelity, test proof, verification honesty, and working-tree hygiene.
3. **Stamp Verdict:**
   ```bash
   node scripts/ticket.mjs review --agent <client> --reviewer-id <id> [--model <model-id>] --verdict <pass|warn|block> --summary "<concise findings>"
   ```
4. **Resolve Block Verdicts (Fixer Role):**
   ```bash
   node scripts/ticket.mjs step --role fixer
   ```
   Fix the blocker findings from Progress log, re-run verification, and request re-review.
