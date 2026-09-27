import fs from 'node:fs';

const appPath = 'src/App.tsx';
if (!fs.existsSync(appPath)) throw new Error('REPAIR_TARGET_MISSING: src/App.tsx');

let source = fs.readFileSync(appPath, 'utf8');
const before = source;
const lines = source.split('\n');

const property = /^\s*[A-Za-z_$][\w$]*\s*:/;
const needsComma = (line) => {
  const t = line.trim();
  if (!t || t.endsWith(',') || t.endsWith('{') || t.endsWith('[') || t.endsWith(';')) return false;
  if (t.startsWith('//') || t.startsWith('/*') || t.startsWith('*')) return false;
  return /(?:['"`\d}\]])$/.test(t);
};

for (let i = 1; i < lines.length; i += 1) {
  if (property.test(lines[i]) && needsComma(lines[i - 1])) {
    lines[i - 1] = lines[i - 1].replace(/\s*$/, ',');
  }
  if (/^\s*\{\s*(?:id|key|label|title):/.test(lines[i]) && /^\s*\}\s*$/.test(lines[i - 1])) {
    lines[i - 1] = lines[i - 1].replace(/\}\s*$/, '},');
  }
}

source = lines.join('\n');
if (source === before) {
  console.log(JSON.stringify({ type: 'FACTORY_REPAIR_NOOP', target: appPath }));
} else {
  fs.writeFileSync(appPath, source);
  console.log(JSON.stringify({ type: 'FACTORY_REPAIR_APPLIED', target: appPath }));
}
