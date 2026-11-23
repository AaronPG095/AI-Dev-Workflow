import { existsSync, readdirSync } from 'node:fs';
import { join, relative, basename } from 'node:path';

export function listFilesRel(rootDir, baseDir = rootDir) {
  if (!existsSync(rootDir)) return [];
  const out = [];
  for (const entry of readdirSync(rootDir, { withFileTypes: true })) {
    const full = join(rootDir, entry.name);
    if (entry.isDirectory()) out.push(...listFilesRel(full, baseDir));
    else out.push(relative(baseDir, full).replace(/\\/g, '/'));
  }
  return out.sort();
}

export function isTestFile(filePath, cfg = {}) {
  const normPath = filePath.replace(/\\/g, '/');
  if (normPath.startsWith(`${cfg.plansDir || 'docs/plans'}/`)) return false;
  const custom = cfg.hygiene?.testFilePatterns;
  if (Array.isArray(custom) && custom.length) {
    return custom.some((pat) => new RegExp(pat, 'i').test(normPath));
  }
  return /(?:^|\/)(?:tests?|__tests__)\/|(?:\.test\.|\.spec\.|_test\.)/i.test(normPath);
}

export function isIgnoredDiffPath(filePath, ignorePatterns) {
  const name = basename(filePath);
  return ignorePatterns.some((pattern) => {
    if (pattern.startsWith('*.')) return name.endsWith(pattern.slice(1));
    return filePath === pattern || name === pattern;
  });
}

export function tailLines(textValue, count = 15) {
  if (!textValue) return '';
  return textValue
    .split(/\r?\n/)
    .map((l) => l.trimEnd())
    .filter(Boolean)
    .slice(-count)
    .join('\n');
}

export function percentile(sortedNums, p) {
  if (!sortedNums.length) return null;
  if (sortedNums.length === 1) return sortedNums[0];
  if (p === 0.5) {
    const mid = Math.floor(sortedNums.length / 2);
    return sortedNums.length % 2 === 1
      ? sortedNums[mid]
      : Number(((sortedNums[mid - 1] + sortedNums[mid]) / 2).toFixed(2));
  }
  const idx = Math.min(sortedNums.length - 1, Math.ceil(p * sortedNums.length) - 1);
  return sortedNums[idx];
}

export function round1(n) {
  return Number(n.toFixed(1));
}
