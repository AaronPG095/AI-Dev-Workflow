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

import { readFileSync, writeFileSync, existsSync, mkdirSync, lstatSync, readdirSync, rmSync } from 'node:fs';
import { dirname, join, resolve, basename } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const workflowRoot = resolve(here, '..');
const codingRoot = resolve(workflowRoot, '..');

let KNOWN_REPOS = [];
for (const cfgName of ['ticket.config.local.json', 'ticket.config.json']) {
  try {
    const cfg = JSON.parse(readFileSync(join(here, cfgName), 'utf8'));
    if (Array.isArray(cfg.knownRepos) && cfg.knownRepos.length > 0) {
      KNOWN_REPOS = cfg.knownRepos.filter((r) => r !== 'AI-Dev-Workflow');
      break;
    }
  } catch {}
}

const MANIFEST = 'scripts/workflow-manifest.json';

const args = process.argv.slice(2);
const opts = {
  repos: [],
  allKnown: false,
  check: false,
  bundleOnly: false,
  dryRun: false,
  ensureInvariants: false,
  ensureIgnore: false,
  universal: false,
  initPrefix: '',
  remote: false,
  upstream: 'AaronPG095/AI-Dev-Workflow',
  branch: 'main',
};
for (let i = 0; i < args.length; i++) {
  const a = args[i];
  if (a === '--all-known' || a === '-AllKnown') opts.allKnown = true;
  else if (a === '--check' || a === '-Check') opts.check = true;
  else if (a === '--bundle-only') opts.bundleOnly = true;
  else if (a === '--dry-run' || a === '-DryRun') opts.dryRun = true;
  else if (a === '--ensure-invariants' || a === '-EnsureInvariants') opts.ensureInvariants = true;
  else if (a === '--ensure-ignore' || a === '-EnsureIgnore') opts.ensureIgnore = true;
  else if (a === '--universal' || a === '-Universal') opts.universal = true;
  else if (a === '--remote' || a === '-Remote') opts.remote = true;
  else if (a === '--upstream' || a === '-Upstream') opts.upstream = args[++i] || opts.upstream;
  else if (a === '--branch' || a === '-Branch') opts.branch = args[++i] || opts.branch;
  else if (a === '--init-prefix' || a === '-InitPrefix') opts.initPrefix = args[++i] || '';
  else opts.repos.push(a);
}

async function fetchSource(url) {
  const response = await fetch(url, { signal: AbortSignal.timeout(30_000) });
  if (!response.ok) throw new Error(`Could not fetch ${url}: HTTP ${response.status}`);
  return response.text();
}

async function loadBundle() {
  const testSource = process.env.ADW_TEST_SYNC_SOURCE;
  let ref = opts.branch;
  if (opts.remote && !testSource) {
    if (!/^[\w.-]+\/[\w.-]+$/.test(opts.upstream))
      throw new Error('Upstream must be owner/repository');
    if (!/^[0-9a-f]{40}$/i.test(ref)) {
      const url = `https://api.github.com/repos/${opts.upstream}/commits/${encodeURIComponent(ref)}`;
      const commit = JSON.parse(await fetchSource(url));
      ref = commit.sha;
      if (typeof ref !== 'string' || !/^[0-9a-f]{40}$/i.test(ref))
        throw new Error('Upstream did not resolve to a commit SHA');
    }
    console.log(`Upstream release: ${opts.upstream}@${ref}`);
  }
  const read = async (path) => {
    const text = testSource
      ? readFileSync(join(testSource, path), 'utf8')
      : opts.remote
        ? await fetchSource(`https://raw.githubusercontent.com/${opts.upstream}/${ref}/${path}`)
        : readFileSync(join(workflowRoot, path), 'utf8');
    if (!text.trim()) throw new Error(`Empty required bundle file: ${path}`);
    return text;
  };
  const manifestText = await read(MANIFEST);
  const manifest = JSON.parse(manifestText);
  if (manifest.schemaVersion !== 1 ||
      ![manifest.copy, manifest.prefix, manifest.branches].every(Array.isArray) ||
      manifest.starterConfig?.tracker !== 'local')
    throw new Error('Invalid or unsupported workflow manifest');
  const paths = [...manifest.copy, ...manifest.prefix, ...manifest.branches];
  if (!manifest.copy.includes(MANIFEST) || !manifest.copy.includes('scripts/sync.mjs') ||
      new Set(paths).size !== paths.length || paths.some((path) =>
        typeof path !== 'string' || !/^(?:[\w.-]+\/)*[\w.-]+$/.test(path) ||
        path.split('/').some((part) => part === '.' || part === '..' || part === '.git') ||
        ['AGENTS.md', 'CLAUDE.md', 'scripts/ticket.config.json'].includes(path)))
    throw new Error('Invalid required paths in workflow manifest');
  const files = new Map([[MANIFEST, manifestText]]);
  for (const path of paths) {
    if (path !== MANIFEST) files.set(path, await read(path));
  }
  return { manifest, files };
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

function disablePullRequestTrigger(text) {
  if (/^  workflow_dispatch:/m.test(text)) {
    return text.replace(/^  pull_request(?:_target)?:\r?\n(?: {4}[^\r\n]*(?:\r?\n|$))*/m, '');
  }
  return text.replace(
    /^on:\r?\n(?:[ \t]+[^\r\n]*(?:\r?\n|$))*/m,
    'on:\n  workflow_dispatch:\n',
  );
}

export function renderDevProcessSection({ prefix, noNewFilesUnder = ['src'], maxChangedLines = 40, universal = false }) {
  const folders = noNewFilesUnder.map(f => `\`${f}/\``).join(', ');
  const cli = universal ? 'adw' : 'node scripts/ticket.mjs';
  return [
    '## Development process (every AI: Claude, Codex, Gemini/Antigravity, Cursor)',
    '',
    `Non-trivial changes follow these six steps. Only trivial changes with at most ${maxChangedLines} changed lines, no new files under ${folders}, and no managed workflow changes may skip them. Label those PRs \`no-plan\`.`,
    '',
    '1. **Plan.** Investigate read-only, propose a plan, wait for approval, and quote it under Notes (use `blueprint` for multi-PR initiatives).',
    `2. **Plan doc.** Create \`docs/plans/${prefix}-Plan-<Topic>-<YYYY-MM>.plan.md\` via \`${cli} new "<Topic>"\` (one PR per plan; split if larger).`,
    `3. **Ticket.** Run \`${cli} create <plan> --agent <Claude|Codex|Gemini|Other>\` (${prefix} prefix, To Do, Development, stable \`Dev Ticket Key\` / \`local://\`). Preserve \`devTicketKey\` on rename; never run concurrent creates.`,
    `4. **Implement.** Branch, commit plan, run \`${cli} start [<plan>]\`. Use \`prime\`/\`resume\` on cold starts, \`context-gatekeeper\` (\`run_compact\` + \`fetch_chunk\`; \`repo_map\` → \`symbol_outline\` → \`read_symbol\`) for verbose output or large files, and \`tick\`/\`defer\` (never delete checkboxes). Progress stays in the plan; run \`handoff\` before stopping.`,
    `5. **Review.** Run \`${cli} pack [<plan>] [--test]\`, complete a mandatory independent review (\`requireReview: true\`, \`allowSelfReview: false\`) using \`quick-review\`, and stamp \`review --agent <client> --reviewer-id <id> --verdict <pass|warn|block> --summary "..."\`.`,
    `6. **Finish.** Run \`${cli} check [<plan>]\`, open/link PR (\`pr\` or \`ship --pr <url>\`), and \`merge\` (never mark Task Done pre-merge).`,
    '',
    `If \`${universal ? 'adw' : 'ticket.mjs'}\` fails, stop and report. Detailed flags: \`dev-workflow\` skill & \`README.md\`.`,
    universal
      ? `Pre-push guardrail: \`adw hook install\`. Universal CLI: \`AI-Dev-Workflow\`.`
      : 'Pre-push guardrail: `node scripts/ticket.mjs hook install`. Sync: `node scripts/sync.mjs --remote`.',
  ].join('\n');
}

export function renderReusablePlanCheckWorkflow(branchesJson = '["main"]') {
  return [
    'name: Plan check',
    '',
    'on:',
    '  pull_request:',
    `    branches: ${branchesJson}`,
    '    types: [opened, synchronize, reopened, ready_for_review, labeled, unlabeled]',
    '',
    'jobs:',
    '  plan-check:',
    '    uses: AaronPG095/AI-Dev-Workflow/.github/workflows/reusable-plan-check.yml@main',
    '',
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

const MANAGED_IGNORE_HEADER = '# managed by AI-Dev-Workflow';
const MANAGED_IGNORE_ENTRIES = [
  '.agents/skills/',
  '.claude/skills/',
  'docs/plans/archive/',
  'scripts/ticket.mjs',
  'scripts/sync.mjs',
  'scripts/ticket.test.mjs',
];

export function patchIgnoreFile(existingText = '') {
  const normalized = (existingText || '').replace(/\r\n/g, '\n');
  const lines = normalized ? normalized.split('\n') : [];
  const existingSet = new Set(lines.map((l) => l.trim()));
  const missing = MANAGED_IGNORE_ENTRIES.filter((entry) => !existingSet.has(entry));
  if (!missing.length) return normalized.endsWith('\n') || !normalized ? normalized : `${normalized}\n`;
  const out = [...lines];
  while (out.length && out[out.length - 1] === '') out.pop();
  if (out.length) out.push('');
  if (!existingSet.has(MANAGED_IGNORE_HEADER)) out.push(MANAGED_IGNORE_HEADER);
  out.push(...missing);
  return `${out.join('\n')}\n`;
}

async function sync() {
  if (opts.bundleOnly && !opts.check)
    throw new Error('--bundle-only requires --check');
  const { manifest, files } = await loadBundle();
  const updates = [];
  const removals = [];

  for (const rawRepo of opts.repos) {
    const repo = resolve(rawRepo);
    const repoName = basename(repo);
    if (!existsSync(repo)) throw new Error('Target repository is missing: ' + repo);
    const configPath = join(repo, 'scripts/ticket.config.json');
    const configExists = existsSync(configPath);
    if (!configExists && !opts.initPrefix)
      throw new Error(repoName + ': missing scripts/ticket.config.json. Pass --init-prefix <PREFIX> to initialize.');

    const cfg = configExists
      ? JSON.parse(readFileSync(configPath, 'utf8'))
      : { prefix: opts.initPrefix, ...manifest.starterConfig };
    const prefix = cfg.prefix || 'PROJ';
    const branches = Array.isArray(cfg.protectedBranches) && cfg.protectedBranches.length
      ? JSON.stringify(cfg.protectedBranches)
      : '["main"]';

    function compare(path, text) {
      let partPath = repo;
      for (const part of path.split('/')) {
        partPath = join(partPath, part);
        if (lstatSync(partPath, { throwIfNoEntry: false })?.isSymbolicLink())
          throw new Error('Managed path contains a symbolic link: ' + partPath);
      }
      const destination = join(repo, path);
      const current = readNorm(destination);
      const expected = norm(text);
      if (current === expected) return;
      updates.push({ repoName, path, destination, text: expected + '\n', missing: current === null });
    }

    const isSelf = process.platform === 'win32'
      ? repo.toLowerCase() === workflowRoot.toLowerCase()
      : repo === workflowRoot;
    const canonicalSelf = opts.bundleOnly && !opts.remote && isSelf;

    if (opts.universal && !isSelf && !opts.bundleOnly) {
      cfg.mode = 'universal';
      if (Array.isArray(cfg.invariants?.mirrorDirs)) {
        cfg.invariants.mirrorDirs = cfg.invariants.mirrorDirs.filter(
          (pair) => !(Array.isArray(pair) && pair[0] === '.agents/skills' && pair[1] === '.claude/skills'),
        );
      }
      compare('scripts/ticket.config.json', JSON.stringify(cfg, null, 2));
      compare('.github/workflows/plan-check.yml', renderReusablePlanCheckWorkflow(branches));
      for (const path of manifest.prefix) {
        compare(path, files.get(path).replace(/\b[\w-]+-Plan-/g, () => prefix + '-Plan-'));
      }
      const agents = readNorm(join(repo, 'AGENTS.md')) || '';
      compare('AGENTS.md', patchAgentsMd(agents, repoName, {
        prefix,
        noNewFilesUnder: cfg.noPlan?.noNewFilesUnder || ['src'],
        maxChangedLines: cfg.noPlan?.maxChangedLines || 40,
        universal: true,
      }));
      const claude = readNorm(join(repo, 'CLAUDE.md')) || '';
      compare('CLAUDE.md', patchClaudeMd(claude));
      for (const rel of [
        'scripts/ticket.mjs',
        'scripts/sync.mjs',
        'scripts/ticket.test.mjs',
        'scripts/adw-hook.mjs',
        'scripts/workflow-manifest.json',
        'scripts/lib',
        '.agents/skills/dev-workflow',
        '.agents/skills/quick-review',
        '.agents/skills/agentic-workflow',
        '.claude/skills/dev-workflow',
        '.claude/skills/quick-review',
        '.claude/skills/agentic-workflow',
      ]) {
        const full = join(repo, rel);
        if (existsSync(full)) removals.push({ repo, repoName, rel, full });
      }
      const ignorePath = join(repo, '.ignore');
      if (existsSync(ignorePath)) {
        const lines = readFileSync(ignorePath, 'utf8')
          .replace(/\r\n/g, '\n')
          .split('\n')
          .map((l) => l.trim())
          .filter(Boolean);
        const managedSet = new Set([MANAGED_IGNORE_HEADER, ...MANAGED_IGNORE_ENTRIES]);
        if (lines.every((l) => managedSet.has(l))) {
          removals.push({ repo, repoName, rel: '.ignore', full: ignorePath });
        }
      }
      continue;
    }

    if (!configExists) {
      compare('scripts/ticket.config.json', JSON.stringify(cfg, null, 2));
    } else if (opts.ensureInvariants && !cfg.invariants) {
      cfg.invariants = manifest.starterConfig.invariants;
      compare('scripts/ticket.config.json', JSON.stringify(cfg, null, 2));
    }
    for (const path of manifest.copy) compare(path, files.get(path));
    for (const path of manifest.prefix)
      compare(path, canonicalSelf ? files.get(path) :
        files.get(path).replace(/\b[\w-]+-Plan-/g, () => prefix + '-Plan-'));
    for (const path of manifest.branches) {
      const text = files.get(path);
      if (path === '.github/workflows/ticket-done.yml' && cfg.ci?.ticketDoneWorkflow === false) {
        compare(path, canonicalSelf ? text : disablePullRequestTrigger(text));
        continue;
      }
      const branchList = /^(\s*branches:\s*)\[[^\r\n]+\]/gm;
      if (!branchList.test(text)) {
        if (path === '.github/workflows/ticket-done.yml' && /^\s*workflow_dispatch:/m.test(text)) {
          compare(path, text);
          continue;
        }
        throw new Error('Missing branch template in required bundle file: ' + path);
      }
      compare(path, canonicalSelf ? text :
        text.replace(branchList, (_, key) => key + branches));
    }

    if (opts.bundleOnly) continue;
    const agents = readNorm(join(repo, 'AGENTS.md')) || '';
    compare('AGENTS.md', patchAgentsMd(agents, repoName, {
      prefix,
      noNewFilesUnder: cfg.noPlan?.noNewFilesUnder || ['src'],
      maxChangedLines: cfg.noPlan?.maxChangedLines || 40,
    }));
    const claude = readNorm(join(repo, 'CLAUDE.md')) || '';
    compare('CLAUDE.md', patchClaudeMd(claude));
    if (opts.ensureIgnore && !isSelf) {
      compare('.ignore', patchIgnoreFile(readNorm(join(repo, '.ignore')) || ''));
    }
  }

  // Validate all source and target inputs before changing a managed file.
  for (const update of updates) {
    if (opts.check) {
      const state = update.missing ? 'MISSING' : 'DRIFT';
      console.log('[' + state + '] ' + update.repoName + ': ' + update.path);
    } else {
      writeManaged(update.destination, update.text, opts.dryRun);
      if (!opts.dryRun) console.log('[UPDATED] ' + update.repoName + ': ' + update.path);
    }
  }
  for (const rem of removals) {
    if (opts.check) {
      console.log('[VENDORED] ' + rem.repoName + ': ' + rem.rel);
    } else if (opts.dryRun) {
      console.log('  [dry-run] remove ' + rem.full);
    } else {
      rmSync(rem.full, { recursive: true, force: true });
      console.log('[REMOVED] ' + rem.repoName + ': ' + rem.rel);
    }
  }
  if (!opts.check && !opts.dryRun && removals.length) {
    const cleanedRepos = new Set(removals.map((r) => r.repo));
    for (const r of cleanedRepos) {
      for (const emptyRel of ['.agents/skills', '.claude/skills', '.agents', '.claude']) {
        const d = join(r, emptyRel);
        if (existsSync(d) && readdirSync(d).length === 0) rmSync(d, { recursive: true, force: true });
      }
    }
  }
  if (!updates.length && !removals.length) console.log('Workflow bundle is up to date.');
  if (opts.check && (updates.length || removals.length)) {
    console.log('Detected ' + (updates.length + removals.length) + ' drifted/missing/vendored managed files.');
    process.exitCode = 1;
  }
}

if (resolve(process.argv[1] || '') === fileURLToPath(import.meta.url)) {
  try {
    await sync();
  } catch (error) {
    console.error('Incomplete workflow check or update: ' + error.message);
    process.exitCode = 2;
  }
}
