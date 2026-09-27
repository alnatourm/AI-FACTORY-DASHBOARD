import fs from 'node:fs';
import { spawnSync } from 'node:child_process';

const appPath = 'src/App.tsx';
if (!fs.existsSync(appPath)) throw new Error('REPAIR_TARGET_MISSING: src/App.tsx');

const repairs = [];
for (let pass = 1; pass <= 8; pass += 1) {
  const check = spawnSync('npm', ['run', 'typecheck'], { encoding: 'utf8', shell: process.platform === 'win32' });
  if (check.status === 0) {
    console.log(JSON.stringify({ type: 'FACTORY_REPAIR_APPLIED', target: appPath, repairs, verified: true }));
    process.exit(0);
  }
  const diagnostics = String(check.stdout || '') + '\n' + String(check.stderr || '');
  const lines = fs.readFileSync(appPath, 'utf8').split('\n');
  let changed = false;

  const comma = diagnostics.match(/src\/App\.tsx\((\d+),(\d+)\): error TS1005: ',' expected\./);
  if (comma) {
    const errorLine = Number(comma[1]);
    const i = errorLine - 2;
    if (i >= 0 && i < lines.length && !lines[i].trimEnd().endsWith(',')) {
      lines[i] = lines[i].trimEnd() + ',';
      repairs.push({ pass, code: 'TS1005', errorLine, repairedLine: errorLine - 1 });
      changed = true;
    }
  }

  if (!changed) {
    const shorthand = diagnostics.match(/src\/App\.tsx\((\d+),(\d+)\): error TS18004:/);
    if (shorthand) {
      const errorLine = Number(shorthand[1]);
      const errorColumn = Number(shorthand[2]);
      const i = errorLine - 1;
      if (i >= 0 && i < lines.length) {
        const before = lines[i];
        const prefix = before.slice(0, Math.max(0, errorColumn - 1));
        const tail = before.slice(Math.max(0, errorColumn - 1));
        const tokenMatch = tail.match(/^([^,}\]\s]+)/);
        if (tokenMatch) {
          const token = tokenMatch[1];
          let rest = tail.slice(token.length);
          rest = rest.replace(/^\s*,\s*/, '').replace(/^\s+/, '');
          let repairedLine = prefix + rest;
          repairedLine = repairedLine.replace(/,\s*,/g, ',').replace(/\{\s*,/g, '{').replace(/,\s*}/g, ' }');
          if (repairedLine !== before) {
            lines[i] = repairedLine;
            repairs.push({ pass, code: 'TS18004', errorLine, errorColumn, removedInvalidShorthand: token });
            changed = true;
          }
        }
      }
    }
  }

  if (!changed) {
    const diagnostic = diagnostics.split('\n').find(x => x.includes('src/App.tsx')) || '';
    console.log(JSON.stringify({ type: repairs.length ? 'FACTORY_REPAIR_PARTIAL' : 'FACTORY_REPAIR_NOOP', target: appPath, repairs, reason: 'UNSUPPORTED_DIAGNOSTIC', diagnostic }));
    process.exit(0);
  }
  fs.writeFileSync(appPath, lines.join('\n'));
}

console.log(JSON.stringify({ type: 'FACTORY_REPAIR_LIMIT_REACHED', target: appPath, repairs }));
