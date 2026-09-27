import fs from 'node:fs';
import { spawnSync } from 'node:child_process';

const appPath = 'src/App.tsx';
if (!fs.existsSync(appPath)) throw new Error('REPAIR_TARGET_MISSING: src/App.tsx');

const check = spawnSync('npm', ['run', 'typecheck'], { encoding: 'utf8', shell: process.platform === 'win32' });
const diagnostics = `${check.stdout || ''}\n${check.stderr || ''}`;
const matches = [...diagnostics.matchAll(/src\/App\.tsx\((\d+),(\d+)\): error TS1005: ',' expected\./g)];

if (!matches.length) {
  console.log(JSON.stringify({ type: 'FACTORY_REPAIR_NOOP', target: appPath, reason: 'NO_SUPPORTED_TS1005' }));
  process.exit(0);
}

const lines = fs.readFileSync(appPath, 'utf8').split('\n');
const repaired = [];

for (const match of matches.reverse()) {
  const errorLine = Number(match[1]);
  const previousIndex = errorLine - 2;
  if (previousIndex < 0 || previousIndex >= lines.length) continue;
  const previous = lines[previousIndex];
  const trimmed = previous.trimEnd();
  if (!trimmed || trimmed.endsWith(',')) continue;
  lines[previousIndex] = trimmed + ',';
  repaired.push({ errorLine, repairedLine: errorLine - 1 });
}

if (!repaired.length) {
  console.log(JSON.stringify({ type: 'FACTORY_REPAIR_NOOP', target: appPath, reason: 'NO_SAFE_EDIT' }));
  process.exit(0);
}

fs.writeFileSync(appPath, lines.join('\n'));
console.log(JSON.stringify({ type: 'FACTORY_REPAIR_APPLIED', target: appPath, repaired }));
