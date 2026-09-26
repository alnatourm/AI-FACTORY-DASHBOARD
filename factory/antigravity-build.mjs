import fs from 'node:fs';
import path from 'node:path';

const apiKey = process.env.ANTIGRAVITY_API_KEY?.trim();
if (!apiKey) throw new Error('NEEDS_FACTORY_CONFIGURATION: OGROUP_ANTIGRAVITY_API_KEY');
const endpoint = (process.env.ANTIGRAVITY_ENDPOINT || 'https://generativelanguage.googleapis.com/v1beta').replace(/\/$/, '');
const agent = process.env.ANTIGRAVITY_AGENT || 'antigravity-preview-09-2026';

const allowedRoots = ['src/', 'public/'];
const allowedFiles = new Set(['index.html', 'package.json', 'vite.config.ts', 'tsconfig.json']);
const skip = new Set(['node_modules', '.git', 'dist', 'factory-evidence']);

function collect(dir='.') {
  const out = [];
  for (const entry of fs.readdirSync(dir, {withFileTypes:true})) {
    if (skip.has(entry.name)) continue;
    const p = path.join(dir, entry.name).replaceAll('\\\\','/');
    if (entry.isDirectory()) out.push(...collect(p));
    else if (/\.(tsx?|jsx?|css|html|json|md)$/.test(entry.name) && fs.statSync(p).size < 120000) {
      out.push({target:p.replace(/^\.\//,''), content:fs.readFileSync(p,'utf8')});
    }
  }
  return out;
}

const sources = collect();
const instructions = `You are the OGroup AI Factory Antigravity Build Agent.
Implement the approved AI Factory Dashboard design in the supplied repository sources.
Product: AI Factory Dashboard. Product Owner design approval: APPROVED.
Approved Stitch revision passed Design Review 100/100: 9/9 screens, Arabic 9/9, RTL 9/9, responsive 9/9, no blocking issues.
Required screens: Factory Home, Create Product, Project Control Room, Design Approval, Product Review, Agent Registry, Factory Health/Watchdog, Needs My Attention, Activity.
Preserve existing architecture and working behavior. Make the visible implementation genuinely bilingual Arabic/English, RTL-ready, responsive, and Product-Owner-first.
Implement real product code, not evidence or documentation only.
Return ONLY valid JSON, no markdown, with shape {"summary":"...","files":[{"path":"src/...","content":"complete file contents"}]}.
Only return files that must change. Never modify .github, secrets, credentials, factory-evidence, or lockfiles.`;

const response = await fetch(`${endpoint}/interactions`, {
  method:'POST',
  headers:{'content-type':'application/json','x-goog-api-key':apiKey,'Api-Revision':'2026-05-20'},
  body:JSON.stringify({
    agent,
    input:instructions,
    environment:{type:'remote',sources:sources.map(s=>({type:'inline',target:s.target,content:s.content}))},
    background:false,
    store:true,
    agent_config:{type:'antigravity',max_total_tokens:50000}
  })
});
if (!response.ok) throw new Error(`ANTIGRAVITY_HTTP_${response.status}: ${(await response.text()).slice(0,500)}`);
const result = await response.json();
if (!result.id) throw new Error('ANTIGRAVITY_RESPONSE_MISSING_ID');
const text = result.output_text || (result.steps||[]).filter(s=>s.type==='model_output').flatMap(s=>s.content||[]).filter(x=>x.type==='text').map(x=>x.text).join('\n');
if (!text) throw new Error('ANTIGRAVITY_OUTPUT_MISSING');
const cleaned = text.trim().replace(/^\`\`\`(?:json)?\s*/i,'').replace(/\s*\`\`\`$/,'');
const payload = JSON.parse(cleaned);
if (!Array.isArray(payload.files) || payload.files.length === 0) throw new Error('ANTIGRAVITY_NO_IMPLEMENTATION_FILES');
for (const file of payload.files) {
  const p = String(file.path || '').replaceAll('\\\\','/');
  if (p.includes('..') || p.startsWith('/') || p.startsWith('.github/') || p.startsWith('factory-evidence/')) throw new Error(`ANTIGRAVITY_UNSAFE_PATH: ${p}`);
  if (!(allowedRoots.some(root=>p.startsWith(root)) || allowedFiles.has(p))) throw new Error(`ANTIGRAVITY_PATH_NOT_ALLOWED: ${p}`);
  if (typeof file.content !== 'string') throw new Error(`ANTIGRAVITY_INVALID_CONTENT: ${p}`);
  fs.mkdirSync(path.dirname(p), {recursive:true});
  fs.writeFileSync(p,file.content);
}
fs.mkdirSync('factory-evidence',{recursive:true});
fs.writeFileSync('factory-evidence/antigravity-latest.json', JSON.stringify({
  provider:'google-antigravity', interactionId:result.id, status:result.status || 'completed',
  summary:payload.summary || null, changedFiles:payload.files.map(f=>f.path)
}, null, 2)+'\n');
console.log(JSON.stringify({type:'ANTIGRAVITY_BUILD_APPLIED',interactionId:result.id,files:payload.files.map(f=>f.path)}));
