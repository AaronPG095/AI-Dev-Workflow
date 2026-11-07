#!/usr/bin/env node
// Cross-platform multi-repo workflow sync and drift checker (Windows, macOS, Linux).
// Syncs ticket.mjs, ticket.test.mjs, skills, plan template, GitHub workflows, PR template,
// and the "## Development process" section of AGENTS.md (plus @AGENTS.md in CLAUDE.md).
//
// Usage:
//   node scripts/sync.mjs --all-known --check
//   node scripts/sync.mjs --all-known
//   node scripts/sync.mjs --remote [--check] [--dry-run]
//   node scripts/sync.mjs <repo-path> [--check] [--dry-run] [--init-prefix <PREFIX>]

import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs';
import { dirname, join, resolve, basename } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const workflowRoot = resolve(here, '..');
const codingRoot = resolve(workflowRoot, '..');

const KNOWN_REPOS = [
  'FluentOverlay',
  'Fluent-Studio-Website',
  'FluentTimer',
  'TokenHUD',
  'Fluent-Studio-Atlas',
  'AI-Cortex',
];

const DIRECT_FILES = [
  'scripts/ticket.mjs',
  'scripts/ticket.test.mjs',
  'scripts/install.ps1',
  'docs/plans/_template.plan.md',
  '.agents/skills/quick-review/SKILL.md',
  '.claude/skills/quick-review/SKILL.md',
  '.github/pull_request_template.md',
];

const PREFIX_TEMPLATED_FILES = [
  '.agents/skills/dev-workflow/SKILL.md',
  '.claude/skills/dev-workflow/SKILL.md',
];

const args = process.argv.slice(2);
const opts = {
  repos: [],
  allKnown: false,
  check: false,
  dryRun: false,
  initPrefix: '',
  remote: false,
  upstream: 'AaronPG095/AI-Dev-Workflow',
  branch: 'main',
};
for (let i = 0; i < args.length; i++) {
  const a = args[i];
  if (a === '--all-known' || a === '-AllKnown') opts.allKnown = true;
  else if (a === '--check' || a === '-Check') opts.check = true;
  else if (a === '--dry-run' || a === '-DryRun') opts.dryRun = true;
  else if (a === '--remote' || a === '-Remote') opts.remote = true;
  else if (a === '--upstream' || a === '-Upstream') opts.upstream = args[++i] || opts.upstream;
  else if (a === '--branch' || a === '-Branch') opts.branch = args[++i] || opts.branch;
  else if (a === '--init-prefix' || a === '-InitPrefix') opts.initPrefix = args[++i] || '';
  else opts.repos.push(a);
}

const remoteCache = new Map();
async function getSourceFile(rel) {
  if (opts.remote) {
    if (remoteCache.has(rel)) return remoteCache.get(rel);
    const url = `https://raw.githubusercontent.com/${opts.upstream}/${opts.branch}/${rel}`;
    const res = await fetch(url);
    if (res.status === 404) {
      remoteCache.set(rel, null);
      return null;
    }
    if (!res.ok) {
      throw new Error(`Failed to fetch ${url}: HTTP ${res.status}`);
    }
    const text = await res.text();
    remoteCache.set(rel, text);
    return text;
  }
  const localPath = join(workflowRoot, rel);
  if (!existsSync(localPath)) return null;
  return readFileSync(localPath, 'utf8');
}

if (resolve(process.argv[1] || '') === fileURLToPath(import.meta.url)) {
  if (opts.remote && opts.repos.length === 0) {
    opts.repos.push(process.cwd());
  } else if (opts.allKnown && opts.repos.length === 0) {
    for (const name of KNOWN_REPOS) {
      const candidate = join(codingRoot, name);
      if (existsSync(candidate)) opts.repos.push(candidate);
    }
  }

  if (opts.repos.length === 0) {
    console.log('Usage:');
    console.log('  node scripts/sync.mjs --all-known --check');
    console.log('  node scripts/sync.mjs --all-known');
    console.log('  node scripts/sync.mjs --remote [--check] [--dry-run]');
    console.log('  node scripts/sync.mjs <repo-path> [--check] [--dry-run] [--init-prefix <PREFIX>]');
    process.exit(0);
  }
}

function norm(text) {
  return text.replace(/\r\n/g, '\n').trimEnd();
}

function readNorm(path) {
  if (!existsSync(path)) return null;
  return norm(readFileSync(path, 'utf8'));
}

function writeManaged(destPath, content, dryRun) {
  if (dryRun) {
    console.log(`  [dry-run] write ${destPath}`);
    return;
  }
  mkdirSync(dirname(destPath), { recursive: true });
  writeFileSync(destPath, content.replace(/\r\n/g, '\n'), 'utf8');
}

export function renderDevProcessSection({ prefix, noNewFilesUnder = ['src'], maxChangedLines = 40 }) {
  const folders = noNewFilesUnder.map(f => `\`${f}/\``).join(', ');
  return [
    '## Development process (every AI: Claude, Codex, Gemini/Antigravity, Cursor)',
    '',
    `Non-trivial changes follow these six steps. Only trivial changes (at most ${maxChangedLines} changed lines, no new files under ${folders}: typos, dependency bumps, one-line fixes) may skip them; their PR gets the \`no-plan\` label.`,
    '',
    '1. **Plan.** Investigate read-only and propose a plan. Wait for Aaron\'s approval before changing code, and quote it under Notes in the plan.',
    `2. **Plan doc.** Copy \`docs/plans/_template.plan.md\` to \`docs/plans/${prefix}-Plan-<Topic>-<YYYY-MM>.plan.md\` or scaffold with \`node scripts/ticket.mjs new "<Topic>" [--type Feature] [--branch]\`. The title reads \`<Plan|Debug|Ask> - <Type>: <Title>\` (for example \`Plan - Feature: Smart Shortcut Suggestions\`); optionally set \`priority\`, \`state\` and \`due\` in the frontmatter. Acceptance criteria and Steps are \`- [ ]\` checkboxes. A plan bigger than one PR is split into separate plans, one per PR.`,
    `3. **Ticket.** Run \`node scripts/ticket.mjs create <plan> --agent <Claude|Codex|Gemini|Other>\`. It creates the Notion Task (${prefix} prefix, To Do, \`Task Lane = Development\`, a stable \`Dev Ticket Key\`, plus any explicit priority, state and real deadline (\`due\`); no Focus Slot or scheduling Date) and writes its URL into the plan. Create ${prefix} tickets only this way. Creation queries the stable key first; if the Task already exists, it restores its canonical URL without changing the Task. Preserve \`devTicketKey\` when renaming a plan. Do not run concurrent creates for the same plan (Notion has no unique-key constraint).`,
    '4. **Implement.** Create a branch, commit the plan on it, and run `node scripts/ticket.mjs start [<plan>]` (Task → Doing and Started At; records the branch and worktree in the plan).',
    '   - Cold start / resume: run `node scripts/ticket.mjs prime` for a compact session context primer, `node scripts/ticket.mjs resume` for handoff state, or `node scripts/ticket.mjs overview` for multi-repo status.',
    '   - Tick each checkbox as soon as it is done. A ticked acceptance criterion ends with concise `verified: <how it was checked and the result>` evidence (one line, no raw terminal dumps); never tick one you have not verified.',
    '   - Never delete a checkbox. Anything you will not do stays unticked and ends with `deferred: <reason>`.',
    '   - Record architectural choices in `docs/decisions/` with `node scripts/ticket.mjs adr "<Title>"`. Progress lives in the plan; do not post progress to Notion.',
    '   - **Before you stop** (end of session, usage limit, handing over), run `node scripts/ticket.mjs handoff --agent <you> --done "<done>" --next "<step>" [--open "<questions>"]` (or `log`) and commit the plan. To continue someone else\'s work, run `node scripts/ticket.mjs resume`, read the plan fully, and resume at the first unticked step.',
    '5. **Review.** Before closing out, run `node scripts/ticket.mjs pack [<plan>] [--test]` (0 LLM tokens, embeds test results with `--test`) to generate a compact review digest (plan criteria, hygiene check, and filtered diff). Perform a single-pass review checking plan fidelity, regressions, and verification honesty (using the `quick-review` skill or a fresh session/second model when practical), then stamp the result with `node scripts/ticket.mjs review [<plan>] --agent <you> --verdict <pass|warn|block> --summary "<findings>"`. A `block` verdict fails close-out until resolved.',
    '6. **Finish.** You are done only when `node scripts/ticket.mjs check [<plan>]` passes. Open the PR and ship in one command: `node scripts/ticket.mjs pr [--draft]` (or open manually with the template filled in and run `node scripts/ticket.mjs ship [<plan>] --pr <url>`). Merging closes the Task (Done and Completed At); never set it to Done yourself.',
    '',
    'If a `ticket.mjs` command fails (for example no `NOTION_TOKEN`), say so and stop at that step. Do not create or update the ticket another way. CI (`Plan check`) blocks a PR whose plan has open items, unverified criteria, a `block` review verdict, removed checkboxes or no ticket, and a `no-plan` PR that is not trivial.',
    'Git pre-push guardrail: run `node scripts/ticket.mjs hook install` to prevent accidental direct pushes to protected branches.',
    '',
    'Upstream workflow & multi-repo sync: https://github.com/AaronPG095/AI-Dev-Workflow (`node scripts/sync.mjs --remote` or `scripts/sync-repos.ps1`).',
  ].join('\n');
}

export function patchAgentsMd(existingText, repoName, sectionConfig) {
  const newSection = renderDevProcessSection(sectionConfig);
  if (!existingText || !existingText.trim()) {
    return `# ${repoName}\n\n${newSection}\n`;
  }
  const lines = existingText.replace(/\r\n/g, '\n').split('\n');
  const startIdx = lines.findIndex(l => /^## Development process\b/i.test(l.trim()));
  if (startIdx === -1) {
    return `${norm(existingText)}\n\n${newSection}\n`;
  }
  let endIdx = lines.findIndex((l, i) => i > startIdx && (/^## /.test(l) || /^<!--\s*BEGIN:/i.test(l.trim())));
  if (endIdx === -1) endIdx = lines.length;
  const before = lines.slice(0, startIdx).join('\n').trimEnd();
  const after = lines.slice(endIdx).join('\n').trimStart();
  return `${before ? `${before}\n\n` : ''}${newSection}${after ? `\n\n${after}\n` : '\n'}`;
}

export function patchClaudeMd(existingText) {
  if (!existingText || !existingText.trim()) return '@AGENTS.md\n';
  const normalized = norm(existingText);
  if (normalized.split('\n')[0].trim() === '@AGENTS.md') return `${normalized}\n`;
  return `@AGENTS.md\n\n${normalized}\n`;
}

if (resolve(process.argv[1] || '') === fileURLToPath(import.meta.url)) {
  let totalDrift = 0;

  for (const rawRepo of opts.repos) {
    const repo = resolve(rawRepo);
    const repoName = basename(repo);
    const configPath = join(repo, 'scripts/ticket.config.json');

    if (!existsSync(configPath)) {
      if (opts.initPrefix) {
        const starter = JSON.parse(readFileSync(join(workflowRoot, 'scripts/ticket.config.json'), 'utf8'));
        starter.prefix = opts.initPrefix;
        starter.noPlan = { maxChangedLines: 40, noNewFilesUnder: ['src'] };
        writeManaged(configPath, `${JSON.stringify(starter, null, 2)}\n`, opts.dryRun);
        console.log(`[${repoName}] Initialized scripts/ticket.config.json (prefix: ${opts.initPrefix})`);
      } else {
        console.warn(`[${repoName}] Missing scripts/ticket.config.json. Pass --init-prefix <PREFIX> to initialize.`);
        continue;
      }
    }

    const cfg = existsSync(configPath)
      ? JSON.parse(readFileSync(configPath, 'utf8'))
      : { prefix: opts.initPrefix, protectedBranches: ['main'], noPlan: { maxChangedLines: 40, noNewFilesUnder: ['src'] } };
    const prefix = cfg.prefix || 'PROJ';
    let repoDrift = 0;

    console.log(`=== ${repoName} (prefix: ${prefix}) ===`);

    function syncItem(rel, expectedText) {
      if (expectedText === null) return;
      const dst = join(repo, rel);
      const expected = norm(expectedText);
      const actual = readNorm(dst);
      if (expected !== actual) {
        repoDrift++;
        totalDrift++;
        if (opts.check) {
          console.log(`  [${actual === null ? 'MISSING' : 'DRIFT'}] ${rel}`);
        } else {
          writeManaged(dst, `${expected}\n`, opts.dryRun);
          console.log(`  [UPDATED] ${rel}`);
        }
      } else if (opts.check) {
        console.log(`  [OK]      ${rel}`);
      }
    }

    for (const rel of DIRECT_FILES) {
      syncItem(rel, await getSourceFile(rel));
    }

    for (const rel of PREFIX_TEMPLATED_FILES) {
      const raw = await getSourceFile(rel);
      syncItem(rel, raw.replace(/ADW-Plan-/g, `${prefix}-Plan-`));
    }

    const branches = Array.isArray(cfg.protectedBranches) && cfg.protectedBranches.length
      ? `[${cfg.protectedBranches.join(', ')}]`
      : '[main]';
    for (const wf of ['.github/workflows/plan-check.yml', '.github/workflows/ticket-done.yml']) {
      const raw = await getSourceFile(wf);
      syncItem(wf, raw.replace(/branches: \[main, develop\]/g, `branches: ${branches}`));
    }
    const syncWfRaw = await getSourceFile('.github/workflows/workflow-sync.yml');
    syncItem('.github/workflows/workflow-sync.yml', syncWfRaw);

    const agentsPath = join(repo, 'AGENTS.md');
    const existingAgents = existsSync(agentsPath) ? readFileSync(agentsPath, 'utf8') : '';
    const patchedAgents = patchAgentsMd(existingAgents, repoName, {
      prefix,
      noNewFilesUnder: cfg.noPlan?.noNewFilesUnder || ['src'],
      maxChangedLines: cfg.noPlan?.maxChangedLines || 40,
    });
    syncItem('AGENTS.md', patchedAgents);

    const claudePath = join(repo, 'CLAUDE.md');
    const existingClaude = existsSync(claudePath) ? readFileSync(claudePath, 'utf8') : '';
    syncItem('CLAUDE.md', patchClaudeMd(existingClaude));

    if (!opts.check && repoDrift === 0) {
      console.log('  Already up to date.');
    }
  }

  if (opts.check && totalDrift > 0) {
    console.log(`\nDetected ${totalDrift} drifted/missing file(s). Run without --check to sync.`);
    process.exit(1);
  }
}
