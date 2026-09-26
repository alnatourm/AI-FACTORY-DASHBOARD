import fs from 'node:fs';
import path from 'node:path';
import zlib from 'node:zlib';

const sourceRepository=process.env.SOURCE_REPOSITORY;
const sourceIssue=process.env.SOURCE_ISSUE;
const runId=process.env.RUN_ID;
if(!sourceRepository||!sourceIssue||!runId) throw new Error('FACTORY_SOURCE_CONTEXT_REQUIRED');
const response=await fetch(`https://api.github.com/repos/${sourceRepository}/issues/${sourceIssue}/comments?per_page=100`,{headers:{Accept:'application/vnd.github+json','X-GitHub-Api-Version':'2022-11-28'}});
if(!response.ok) throw new Error(`FACTORY_RESULT_HTTP_${response.status}`);
const comments=await response.json();
const groups=new Map();
for(const comment of comments){
  const body=comment.body||'';
  const first=body.indexOf('\n');
  const header=first<0?body:body.slice(0,first);
  const data=first<0?'':body.slice(first+1).trim();
  const m=header.match(/^FACTORY_ANTIGRAVITY_RESULT (\S+) (\d+) (\d+)\/(\d+)$/);
  if(!m||m[1]!==runId) continue;
  const [, ,buildId,index,total]=m;
  const group=groups.get(buildId)||{total:Number(total),parts:new Map()};
  group.parts.set(Number(index),data); groups.set(buildId,group);
}
const complete=[...groups.entries()].filter(([,g])=>g.parts.size===g.total).sort((a,b)=>Number(b[0])-Number(a[0]));
if(!complete.length) throw new Error('FACTORY_ANTIGRAVITY_RESULT_NOT_READY');
const [buildId,group]=complete[0];
let encoded=''; for(let i=1;i<=group.total;i++) encoded+=group.parts.get(i)||'';
const payload=JSON.parse(zlib.gunzipSync(Buffer.from(encoded,'base64')).toString('utf8'));
const allowedRoots=['src/','public/'];
const allowedFiles=new Set(['index.html','package.json','vite.config.ts','tsconfig.json']);
if(!Array.isArray(payload.files)||!payload.files.length) throw new Error('FACTORY_RESULT_NO_FILES');
for(const file of payload.files){
  const p=String(file.path||'').replaceAll('\\\\','/');
  if(p.includes('..')||p.startsWith('/')||p.startsWith('.github/')||p.startsWith('factory-evidence/')) throw new Error(`FACTORY_RESULT_UNSAFE_PATH: ${p}`);
  if(!(allowedRoots.some(root=>p.startsWith(root))||allowedFiles.has(p))) throw new Error(`FACTORY_RESULT_PATH_NOT_ALLOWED: ${p}`);
  if(typeof file.content!=='string') throw new Error(`FACTORY_RESULT_INVALID_CONTENT: ${p}`);
  fs.mkdirSync(path.dirname(p),{recursive:true}); fs.writeFileSync(p,file.content);
}
fs.mkdirSync('factory-evidence',{recursive:true});
fs.writeFileSync('factory-evidence/antigravity-latest.json',JSON.stringify({provider:payload.provider,interactionId:payload.interactionId,summary:payload.summary,buildId,changedFiles:payload.files.map(f=>f.path)},null,2)+'\n');
console.log(JSON.stringify({type:'FACTORY_ANTIGRAVITY_RESULT_APPLIED',buildId,files:payload.files.map(f=>f.path)}));
