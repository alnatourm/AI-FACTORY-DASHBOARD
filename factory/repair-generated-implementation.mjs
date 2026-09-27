import fs from 'node:fs';

const appPath = 'src/App.tsx';
if (!fs.existsSync(appPath)) {
  throw new Error('REPAIR_TARGET_MISSING: src/App.tsx');
}

let source = fs.readFileSync(appPath, 'utf8');
const before = source;

// Antigravity occasionally emits a top-level array/object entry followed by
// another declaration without the required separator. Repair only the narrow
// parser shape observed by independent TypeScript verification.
const lines = source.split('\n');
for (let i = 1; i < lines.length; i += 1) {
  const current = lines[i];
  const previous = lines[i - 1];
  if (/^\s*\{\s*(?:id|key|label|title):/.test(current) && /^\s*\}\s*$/.test(previous)) {
    lines[i - 1] = previous.replace(/\}\s*$/, '},');
  }
}
source = lines.join('\n');

// Remove a trailing comma before a closing array/object only when TS-style
// generated structure makes it redundant. This is intentionally conservative.
source = source.replace(/,\s*([}\]])/g, '$1');

if (source === before) {
  console.log(JSON.stringify({ type: 'FACTORY_REPAIR_NOOP', target: appPath }));
} else {
  fs.writeFileSync(appPath, source);
  console.log(JSON.stringify({ type: 'FACTORY_REPAIR_APPLIED', target: appPath }));
}
