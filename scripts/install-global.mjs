#!/usr/bin/env node
// Installs or checks the universal `adw` CLI and global skill links for
// Antigravity (~/.gemini/config/skills), Claude (~/.claude/skills), and Codex (~/.agents/skills).

import { existsSync, lstatSync, mkdirSync, readlinkSync, rmSync, symlinkSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { homedir } from 'node:os';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';

const workflowRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const args = new Set(process.argv.slice(2));
const checkOnly = args.has('--check');
const uninstall = args.has('--uninstall');
const dryRun = args.has('--dry-run');

const WORKFLOW_SKILLS = ['dev-workflow', 'quick-review', 'agentic-workflow'];
const home = homedir();
const SKILL_ROOTS = [
  join(home, '.gemini', 'config', 'skills'),
  join(home, '.claude', 'skills'),
  join(home, '.agents', 'skills'),
];

function normPath(p) {
  const r = resolve(p).replace(/[\\/]+$/, '');
  return process.platform === 'win32' ? r.toLowerCase() : r;
}

function runNpm(npmArgs) {
  return spawnSync('npm', npmArgs, {
    cwd: workflowRoot,
    encoding: 'utf8',
    shell: process.platform === 'win32',
  });
}

let issues = 0;

// 1. Global `adw` binary
if (checkOnly) {
  const probe = spawnSync(process.platform === 'win32' ? 'where.exe' : 'which', ['adw'], {
    encoding: 'utf8',
  });
  if (probe.status === 0) {
    console.log(`[OK] adw on PATH: ${probe.stdout.trim().split(/\r?\n/)[0]}`);
  } else {
    console.log('[MISSING] adw not found on PATH');
    issues++;
  }
} else if (uninstall) {
  if (!dryRun) {
    const res = runNpm(['unlink', '-g', 'ai-dev-workflow']);
    if (res.status !== 0) console.warn(`npm unlink warning: ${res.stderr || res.stdout}`);
    else console.log('[REMOVED] global adw link');
  } else {
    console.log('[dry-run] npm unlink -g ai-dev-workflow');
  }
} else {
  if (!dryRun) {
    const res = runNpm(['link']);
    if (res.status !== 0) {
      console.error(`npm link failed:\n${res.stderr || res.stdout}`);
      process.exit(1);
    }
    console.log(`[LINKED] adw -> ${join(workflowRoot, 'scripts', 'adw.mjs')}`);
  } else {
    console.log(`[dry-run] npm link in ${workflowRoot}`);
  }
}

// 2. Global skill junctions / symlinks
const linkType = process.platform === 'win32' ? 'junction' : 'dir';
for (const root of SKILL_ROOTS) {
  for (const skill of WORKFLOW_SKILLS) {
    const target = join(workflowRoot, '.agents', 'skills', skill);
    const dest = join(root, skill);
    if (!existsSync(target)) {
      console.error(`Missing source skill: ${target}`);
      issues++;
      continue;
    }

    const stat = lstatSync(dest, { throwIfNoEntry: false });
    if (checkOnly) {
      if (!stat) {
        console.log(`[MISSING] ${dest}`);
        issues++;
      } else if (stat.isSymbolicLink() && normPath(readlinkSync(dest)) === normPath(target)) {
        console.log(`[OK] ${dest} -> ${target}`);
      } else {
        console.log(`[DRIFT] ${dest} does not point to ${target}`);
        issues++;
      }
      continue;
    }

    if (uninstall) {
      if (stat) {
        if (!dryRun) rmSync(dest, { recursive: true, force: true });
        console.log(`${dryRun ? '[dry-run] ' : '[REMOVED] '}${dest}`);
      }
      continue;
    }

    if (stat && stat.isSymbolicLink() && normPath(readlinkSync(dest)) === normPath(target)) {
      console.log(`[OK] ${dest}`);
      continue;
    }

    if (!dryRun) {
      mkdirSync(root, { recursive: true });
      if (stat) rmSync(dest, { recursive: true, force: true });
      symlinkSync(target, dest, linkType);
    }
    console.log(`${dryRun ? '[dry-run] ' : '[LINKED] '}${dest} -> ${target}`);
  }
}

if (checkOnly && issues > 0) {
  console.error(`Detected ${issues} global install issue(s). Run: node scripts/install-global.mjs`);
  process.exit(1);
}
