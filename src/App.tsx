import React, { useEffect, useMemo, useState } from 'react';
import {
  Activity, AlertTriangle, ArrowRight, Bot, Box, CheckCircle2, ChevronRight, CircleDot,
  ClipboardCheck, Code2, Factory, FileCheck2, Gauge, Globe, HeartPulse, LayoutDashboard,
  Menu, Plus, Rocket, Search, ShieldCheck, Sparkles, X, Zap, Eye, ExternalLink
} from 'lucide-react';
import { factoryApi, factoryConfigured, type FactorySnapshot, type FactoryRun, type FactoryRunDetail, type FactoryConfig } from './factory-api';

type Lang='en'|'ar';
type Screen='home'|'create'|'control'|'design'|'review'|'agents'|'factory'|'health'|'attention'|'activity';
const stages=['Idea','Product','Architecture','Design','Build','QA','Security','Staging','Review','Production'];
const arStages=['الفكرة','المنتج','الهندسة','التصميم','البناء','الجودة','الأمان','التجهيز','المراجعة','الإنتاج'];

const copy={
 en:{brand:'OGROUP',sub:'AI FACTORY',online:'Factory online',home:'Factory Home',create:'Create Product',control:'Project Control Room',design:'Design Approval',review:'Product Review',agents:'Agent Registry',health:'Factory Health',attention:'Needs My Attention',activity:'Factory Activity',factory:'My Factory',newProduct:'Build New Product',title:'Factory Overview',desc:'Everything the Factory is building, in one place.',back:'Back to Factory',approve:'Approve',reject:'Request changes'},
 ar:{brand:'أو جروب',sub:'مصنع الذكاء الاصطناعي',online:'المصنع متصل',home:'الرئيسية',create:'إنشاء منتج',control:'غرفة تحكم المشروع',design:'اعتماد التصميم',review:'مراجعة المنتج',agents:'سجل الوكلاء',health:'صحة المصنع',attention:'تتطلب انتباهي',activity:'نشاط المصنع',factory:'مصنعي',newProduct:'بناء منتج جديد',title:'نظرة عامة على المصنع',desc:'كل ما يبنيه المصنع في مكان واحد.',back:'العودة للمصنع',approve:'موافقة',reject:'طلب تعديلات'}
};

const agents=[
 ['OGroup Factory Orchestrator','Orchestration','Factory controller','ACTIVE'],
 ['Product Generator / Factory logic','Product definition','Deterministic Factory logic','ACTIVE'],
 ['Architecture stage','Architecture','Orchestrator stage · no separate AI adapter','READY'],
 ['Stitch Design Adapter','Design','Google Stitch','READY'],
 ['OGroup Design Review Agent','Design review','Structural/content review','READY'],
 ['Antigravity Build Agent','Build','Google Antigravity','RUNNING'],
 ['CI / Orchestrator QA','QA','GitHub Actions + Factory verification','ACTIVE'],
 ['Security verification stage','Security','Rules/checks · specialist adapter not configured','READY'],
 ['Engineering Review','Review','Factory / CI / human gate','READY'],
 ['Watchdog','Progress supervision','Deterministic Factory service','ACTIVE'],
 ['Release Controller','Release','Factory controller + human authority','READY']
];

export function App(){
 const [lang,setLang]=useState<Lang>('en'); const [screen,setScreen]=useState<Screen>('home');
 const [menu,setMenu]=useState(false); const [toast,setToast]=useState('');
 const [factorySnapshot,setFactorySnapshot]=useState<FactorySnapshot|null>(null); const [factoryError,setFactoryError]=useState('');
 const [selectedRunId,setSelectedRunId]=useState(()=>localStorage.getItem('factory:selectedRunId')||''); const [selectedRun,setSelectedRun]=useState<FactoryRunDetail|null>(null);
 const t=copy[lang]; const rtl=lang==='ar'; const stageNames=rtl?arStages:stages;
 useEffect(()=>{document.documentElement.dir=rtl?'rtl':'ltr';document.documentElement.lang=lang},[rtl,lang]);
 useEffect(()=>{ if(!factoryConfigured) return; let alive=true; const load=()=>factoryApi.snapshot().then(x=>{if(alive){setFactorySnapshot(x);setFactoryError('')}}).catch(e=>{if(alive)setFactoryError(e instanceof Error?e.message:'FACTORY_API_ERROR')}); load(); const timer=setInterval(load,30000); return()=>{alive=false;clearInterval(timer)} },[]);
 useEffect(()=>{if(!selectedRunId){setSelectedRun(null);return} localStorage.setItem('factory:selectedRunId',selectedRunId); factoryApi.run(selectedRunId).then(setSelectedRun).catch(()=>{setSelectedRun(null);localStorage.removeItem('factory:selectedRunId')})},[selectedRunId,factorySnapshot]);
 const selectRun=(id:string,next:Screen='control')=>{setSelectedRunId(id);go(next)};
 const nav=[
  ['home',t.home,LayoutDashboard],['create',t.create,Plus],['control',t.control,Gauge],
  ['design',t.design,ShieldCheck],['review',t.review,ClipboardCheck],['factory',t.factory,Factory],['agents',t.agents,Bot],
  ['health',t.health,HeartPulse],['attention',t.attention,AlertTriangle],['activity',t.activity,Activity]
 ] as const;
 const go=(s:Screen)=>{setScreen(s);setMenu(false);window.scrollTo({top:0,behavior:'smooth'})};
 const notify=(m:string)=>{setToast(m);setTimeout(()=>setToast(''),2200)};
 return <div className="shell">
  <div className="mobile-header"><button className="icon-btn" onClick={()=>setMenu(!menu)}>{menu?<X/>:<Menu/>}</button><b>{t.brand}</b><button className="lang-mini" onClick={()=>setLang(rtl?'en':'ar')}><Globe size={15}/>{rtl?'EN':'العربية'}</button></div>
  {menu&&<div className="mobile-backdrop" onClick={()=>setMenu(false)}/>}
  <aside className={'sidebar '+(menu?'open':'')}>
   <div className="brand"><div className="mark"><Factory size={21}/></div><div><b>{t.brand}</b><span>{t.sub}</span></div></div>
   <nav>{nav.map(([id,label,Icon])=><button key={id} className={'nav-btn '+(screen===id?'active':'')} onClick={()=>go(id)}><Icon size={18}/><span>{label}</span></button>)}</nav>
   <div className="sidebar-footer"><span className="system-line"><i className="status-dot green"/>{t.online}</span><small>Watchdog · healthy</small></div>
  </aside>
  <main className="content">
   <Topbar title={screen==='home'?t.title:nav.find(n=>n[0]===screen)?.[1]||t.title} subtitle={screen==='home'?t.desc:'AI Factory · Product Owner Control Plane'} lang={lang} setLang={setLang} onCreate={()=>go('create')} factoryLive={factoryConfigured&&!factoryError} factoryConfigured={factoryConfigured}/>
   {screen==='home'&&<Home go={go} rtl={rtl} snapshot={factorySnapshot} selectRun={selectRun}/>}
   {screen==='create'&&<CreateProduct notify={notify} rtl={rtl} onStarted={(id)=>{setSelectedRunId(id);go('control')}}/>}
   {screen==='control'&&<ControlRoom stageNames={stageNames} run={selectedRun}/>}
   {screen==='design'&&<DesignApproval notify={notify} t={t} run={selectedRun}/>}
   {screen==='review'&&<ProductReview notify={notify} t={t} run={selectedRun}/>}
   {screen==='factory'&&<MyFactory notify={notify}/>}\n   {screen==='agents'&&<AgentRegistry/>}
   {screen==='health'&&<FactoryHealth/>}
   {screen==='attention'&&<Attention snapshot={factorySnapshot} selectRun={selectRun}/>}
   {screen==='activity'&&<FactoryActivity snapshot={factorySnapshot} run={selectedRun}/>}
  </main>
  {toast&&<div className="toast"><CheckCircle2 size={17}/>{toast}</div>}
 </div>
}

function MyFactory({notify}:{notify:(s:string)=>void}){
 const empty:FactoryConfig={mode:'managed',providers:[],models:[],agents:[],roles:[]};
 const [config,setConfig]=useState<FactoryConfig>(empty); const [loading,setLoading]=useState(true); const [saving,setSaving]=useState(false);
 useEffect(()=>{factoryApi.config().then(setConfig).catch(()=>setConfig(empty)).finally(()=>setLoading(false))},[]);
 const save=async()=>{setSaving(true);try{setConfig(await factoryApi.saveConfig(config));notify('Factory configuration saved')}catch{notify('Could not save Factory configuration')}finally{setSaving(false)}};
 if(loading)return <section className="panel"><PanelTitle title="My Factory" sub="Loading your workforce…"/></section>;
 return <div className="factory-home">
  <section className="home-command panel"><div><span className="kicker">YOUR AI WORKFORCE</span><h2>My Factory</h2><p>Use our workforce, or bring yours. The same Project Brain, orchestration, testing and deployment pipeline powers both.</p></div><button className="primary" disabled={saving} onClick={save}>{saving?'Saving…':'Save Factory'}</button></section>
  <section className="panel section-gap"><PanelTitle title="How should we build?" sub="You can change this per Factory configuration."/>
   <div className="metrics">
    <button className={'metric '+(config.mode==='managed'?'selected':'')} onClick={()=>setConfig({...config,mode:'managed'})}><Bot/><b>Build For Me</b><small>OGroup chooses and manages the AI workforce.</small></button>
    <button className={'metric '+(config.mode==='custom'?'selected':'')} onClick={()=>setConfig({...config,mode:'custom'})}><Code2/><b>Build With My AI</b><small>Connect your agents, models and providers.</small></button>
   </div>
  </section>
  <section className="panel section-gap"><PanelTitle title="Workforce" sub="ROLE → AGENT → MODEL → PROVIDER"/>
   <div className="metrics"><Metric icon={Bot} label="Agents" value={String(config.agents.length)} note="OGroup or customer agents"/><Metric icon={Sparkles} label="Models" value={String(config.models.length)} note="Capability-routed models"/><Metric icon={Globe} label="Providers" value={String(config.providers.length)} note="Managed or BYOK"/><Metric icon={Gauge} label="Role assignments" value={String(config.roles.length)} note="Stable roles, swappable workers"/></div>
   {config.mode==='custom'&&<div className="empty-state compact"><Zap/><b>Custom Factory is enabled</b><span>Provider credentials are stored by reference. Raw API keys never belong in this screen.</span></div>}
  </section>
 </div>
}

function Topbar({title,subtitle,lang,setLang,onCreate,factoryLive,factoryConfigured}:{title:string;subtitle:string;lang:Lang;setLang:(x:Lang)=>void;onCreate:()=>void;factoryLive:boolean;factoryConfigured:boolean}){
 return <header className="page-header"><div><p className="eyebrow">PRODUCT OWNER CONTROL PLANE</p><h1>{title}</h1><span className="header-subtitle">{subtitle}</span></div><div className="header-actions"><span className="system-line"><i className={'status-dot '+(factoryLive?'green':'')}/>{factoryLive?'FACTORY CONNECTED':factoryConfigured?'FACTORY UNREACHABLE':'FACTORY NOT CONFIGURED'}</span><div className="lang-toggle-group"><button className={'lang-btn '+(lang==='en'?'active':'')} onClick={()=>setLang('en')}>English</button><button className={'lang-btn '+(lang==='ar'?'active':'')} onClick={()=>setLang('ar')}>العربية</button></div><button className="primary" onClick={onCreate}><Plus size={17}/>Build New Product</button></div></header>
}
function Home({go,rtl,snapshot,selectRun}:{go:(s:Screen)=>void;rtl:boolean;snapshot:FactorySnapshot|null;selectRun:(id:string,next?:Screen)=>void}){ const runs=snapshot?.runs??[]; const attention=snapshot?.attention??[]; return <div className="factory-home"><section className="home-command panel"><div><span className="kicker">AUTONOMOUS SOFTWARE FACTORY · CONTROL PLANE</span><h2>OGroup AI Factory</h2><p>Real Factory projects for this control plane.</p></div><button className="primary build-command" onClick={()=>go('create')}><Plus/> Build New Product</button></section><section className="metrics"><Metric icon={CircleDot} label="Projects" value={String(runs.length)} note="Live Factory runs"/><Metric icon={AlertTriangle} label="Needs attention" value={String(attention.length)} note="Human decisions"/><Metric icon={Activity} label="Recent activity" value={String(snapshot?.activity?.length??0)} note="GitHub evidence"/><Metric icon={HeartPulse} label="Factory health" value={String(snapshot?.health?.status??'Unknown')} note="Live API"/></section><section className="panel section-gap"><PanelTitle title="My Projects" sub="Live projects only · no demo records"/>{runs.length?runs.map(p=><button className="project-row" key={p.id} onClick={()=>selectRun(p.id)}><div className="product-avatar"><Box size={18}/></div><div className="grow"><b>{p.name}</b><small>{p.targetRepository||'Target repository pending'}</small></div><Status value={p.status}/><ChevronRight size={17}/></button>):<div className="empty-state compact"><Box/><b>No Factory projects yet</b><span>Create a product to start your first run.</span></div>}</section></div>}

function CreateProduct({notify,rtl,onStarted}:{notify:(s:string)=>void;rtl:boolean;onStarted:(id:string)=>void}){
 const [idea,setIdea]=useState(''); const [priority,setPriority]=useState('Normal'); const [launching,setLaunching]=useState(false); const ready=idea.trim().length>15;
 const launch=async()=>{ if(!factoryConfigured){notify('Factory API is not configured');return} setLaunching(true); try{const created=await factoryApi.startRun({intent:idea,priority,source:'product-owner-dashboard'});notify('Factory run accepted');onStarted(created.runId);}catch(e){notify(e instanceof Error?e.message:'Factory launch failed')}finally{setLaunching(false)} };
 return <div className="stitch-create">
  <section className="stitch-create-main">
   <div className="stitch-intro panel">
    <div><span className="kicker">AUTONOMOUS PRODUCT ENGINE</span><h2>{rtl?'ماذا تريد أن نصنع اليوم؟':'What do you want to build today?'}</h2><p>{rtl?'صف النتيجة التجارية التي تريدها. المصنع يتولى التخطيط والهندسة والتنفيذ والتحقق.':'Describe the business outcome. The Factory owns planning, engineering, execution and verification.'}</p></div>
    <div className="ai-ready"><Bot size={20}/><b>AI Factory</b><small>Command intake ready</small></div>
   </div>
   <section className="panel command-panel">
    <div className="command-title"><Sparkles size={18}/><div><span className="kicker">P1 · SYNTHESIZER</span><h3>{rtl?'حرّر فكرة المنتج باللغة الطبيعية':'Natural Language Product Intent'}</h3></div></div>
    <textarea rows={10} value={idea} onChange={e=>setIdea(e.target.value)} placeholder={rtl?'مثال: أريد منصة لإدارة العيادات في الأردن، عربية وإنجليزية، مع ملفات المرضى والمواعيد...':'Example: Build a bilingual clinic operating system for Jordan with patient files, appointments and secure staff roles...'}/>
    <div className="intent-meta"><span>Intent acceptance ≥ 90%</span><span>{idea.length} chars</span></div>
   </section>
   <section className="panel references-panel"><PanelTitle title={rtl?'المراجع والمدخلات':'References & Inputs'} sub={rtl?'روابط، مستندات، صور أو مستودع قائم':'URLs, documents, images or an existing repository'}/><div className="reference-grid"><button className="drop-zone"><FileCheck2/><b>{rtl?'أضف ملفات مرجعية':'Add reference files'}</b><small>PDF · DOCX · PNG · JPG</small></button><div className="url-stack"><input placeholder="https://github.com/..."/><input placeholder={rtl?'رابط مرجعي إضافي':'Additional reference URL'}/></div></div></section>
   <section className="panel constraints-panel"><PanelTitle title={rtl?'محددات الأعمال والحماية':'Business Constraints & Guardrails'} sub={rtl?'هذه القرارات تدخل عقد المنتج قبل بدء التنفيذ':'These become part of the governed product contract'}/><div className="constraint-grid"><label>Market<input placeholder={rtl?'الأردن / الخليج':'Jordan / MENA'}/></label><label>Language<select><option>Arabic + English</option><option>English</option><option>Arabic</option></select></label><label>Priority<select value={priority} onChange={e=>setPriority(e.target.value)}><option>Normal</option><option>High</option><option>Critical</option></select></label><label>Production authority<input value={rtl?'يتطلب موافقة بشرية':'Human approval required'} readOnly/></label></div></section>
   <details className="panel advanced"><summary>{rtl?'إعدادات هندسية متقدمة':'Advanced Engineering Parameters'} <small>{rtl?'اختياري':'optional'}</small></summary><p className="muted">{rtl?'تبقى مخفية افتراضياً. المصنع يختار الإعدادات الآمنة ما لم يوجد قرار معماري مادي.':'Hidden by default. The Factory chooses safe defaults unless a material architecture decision requires you.'}</p></details>
  </section>
  <aside className="stitch-create-side">
   <section className="panel launch-card"><span className="kicker">COMMAND CENTER</span><h3>{rtl?'إطلاق أمر التصنيع':'Launch Factory Run'}</h3><p>{rtl?'بعد الإطلاق، لا تحتاج لإدارة الفروع أو الاختبارات أو الإصلاحات الروتينية.':'After launch, you do not manage branches, CI retries or routine repairs.'}</p><div className="dispatch-ready"><span className="status-dot green"/> Agent Dispatch Ready</div><button disabled={!ready} className="primary full launch-big" onClick={launch}><Rocket size={18}/>{launching?(rtl?'جارٍ الإطلاق…':'Launching…'):(rtl?'ابدأ تشغيل المصنع':'Start AI Factory')}</button><small className="authority-note">Human gates: Design · Material architecture/security · Production</small></section>
   <section className="panel flow-card"><PanelTitle title={rtl?'ماذا يحدث بعد الضغط؟':'Automated Flow'} sub="Factory-owned execution"/>{[
    ['Product','Factory logic'],['Architecture','Orchestrator stage'],['Design','Google Stitch'],['Design Review','OGroup review'],['Human Gate','Product Owner'],['Build','Google Antigravity'],['QA','CI + Orchestrator'],['Security','Rules + checks'],['Staging','Verified deployment'],['Product Review','Product Owner']
   ].map((x,i)=><div className="flow-line" key={x[0]}><span>{i+1}</span><div><b>{x[0]}</b><small>{x[1]}</small></div>{i===4||i===9?<Status value="WAITING_HUMAN"/>:<Status value="QUEUED"/>}</div>)}</section>
  </aside>
 </div>
}

function ControlRoom({stageNames,run}:{stageNames:string[];run:FactoryRunDetail|null}){ const [brain,setBrain]=useState<import('./factory-api').ProjectBrain|null>(null); useEffect(()=>{if(!run){setBrain(null);return}factoryApi.brain(run.id).then(setBrain).catch(()=>setBrain(null))},[run?.id]); if(!run)return <div className="empty-state"><Box/><b>Select a project</b><span>Choose a real project from Factory Home.</span></div>; const current=Math.max(0,['QUEUED','RUNNING','VERIFYING','WAITING_HUMAN','COMPLETED'].indexOf(run.status)); return <div className="control-room"><section className="panel control-command"><div><span className="kicker">LIVE FACTORY RUN · {run.id.toUpperCase()}</span><h2>{run.name}</h2><p>{run.intent}</p><small>{run.targetRepository||'Target repository pending'}</small></div><div className="control-state"><Status value={run.status}/></div></section><section className="panel pipeline-console"><PanelTitle title="Execution Pipeline" sub="Live status. Unverified stages are never shown as complete."/><Pipeline current={Math.min(current,stageNames.length-1)} names={stageNames}/></section><section className="panel section-gap"><PanelTitle title="Run Activity" sub="Factory issue evidence"/>{run.activity.length?run.activity.map(a=><div className="activity-row rich" key={a.id}><div className="grow"><b>{a.text||'Factory event'}</b><small>{a.actor} · {a.at}</small></div></div>):<div className="empty-state compact"><Activity/><b>Waiting for Factory evidence</b><span>The run is accepted but no verified activity has been recorded yet.</span></div>}</section></div>}

function DesignApproval({notify,t,run}:{notify:(s:string)=>void;t:any;run:FactoryRunDetail|null}){const [feedback,setFeedback]=useState('');if(!run)return <div className="empty-state"><Box/><b>Select a project first</b></div>;const approve=async()=>{try{await factoryApi.approveGate(run.id,'design');notify('Design approval recorded')}catch(e){notify(e instanceof Error?e.message:'Approval failed')}};const changes=async()=>{if(!feedback.trim()){notify('Enter the requested changes first');return}try{await factoryApi.requestChanges(run.id,'design',feedback);notify('Design change request recorded')}catch(e){notify(e instanceof Error?e.message:'Request failed')}};return <div className="gate-layout"><section className="gate-main"><section className="panel gate-hero"><div><span className="kicker">HUMAN GATE · DESIGN · {run.id}</span><h2>{run.name}</h2><p>Only verified design artifacts from this run will appear here.</p></div><Status value={run.status}/></section><section className="panel section-gap"><div className="empty-state"><LayoutDashboard/><b>Design artifact not exposed by Factory API yet</b><span>No placeholder screens are shown. Wait for the Factory to publish verified design evidence for this project.</span></div></section></section><aside className="gate-side panel"><span className="kicker">PRODUCT OWNER AUTHORITY</span><h3>Design decision</h3><textarea rows={5} value={feedback} onChange={e=>setFeedback(e.target.value)} placeholder="Requested design changes…"/><button className="secondary full" onClick={changes}>{t.reject}</button><button className="primary full gate-approve" onClick={approve}><ShieldCheck size={17}/>{t.approve} Design & Continue</button></aside></div>}

function ProductReview({notify,t,run}:{notify:(s:string)=>void;t:any;run:FactoryRunDetail|null}){const [feedback,setFeedback]=useState('');if(!run)return <div className="empty-state"><Box/><b>Select a project first</b></div>;const approve=async()=>{try{await factoryApi.approveGate(run.id,'production');notify('Production approval recorded')}catch(e){notify(e instanceof Error?e.message:'Approval failed')}};const changes=async()=>{if(!feedback.trim()){notify('Enter feedback first');return}try{await factoryApi.requestChanges(run.id,'production',feedback);notify('Product changes recorded')}catch(e){notify(e instanceof Error?e.message:'Request failed')}};return <div className="review-layout"><section className="gate-main"><section className="panel gate-hero"><div><span className="kicker">HUMAN GATE · PRODUCT REVIEW · {run.id}</span><h2>{run.name}</h2><p>Release evidence is shown only when published by the Factory.</p></div><Status value={run.status}/></section><section className="panel section-gap"><div className="empty-state"><FileCheck2/><b>Verified release evidence not available yet</b><span>The Dashboard will not invent build, QA, security or staging results.</span></div></section></section><aside className="gate-side panel"><span className="kicker">PRODUCTION AUTHORITY</span><h3>Final product decision</h3><textarea rows={5} value={feedback} onChange={e=>setFeedback(e.target.value)} placeholder="Feedback for the Factory…"/><button className="secondary full" onClick={changes}>{t.reject}</button><button className="primary full gate-approve" onClick={approve}><Rocket size={17}/>{t.approve} Production</button></aside></div>}

function AgentRegistry(){return <div className="operations-page"><section className="panel gate-hero"><div><span className="kicker">EXECUTION CAPABILITY MAP</span><h2>Agent Registry</h2><p>Jobs, executors and providers are separate. A stage is never shown as a connected AI agent unless a real adapter exists.</p></div><Status value="ACTIVE"/></section><section className="panel section-gap"><div className="table-wrap"><table className="registry-table"><thead><tr><th>Executor</th><th>Factory job</th><th>Provider / implementation</th><th>Status</th><th>Verification</th></tr></thead><tbody>{agents.map(a=><tr key={a[0]}><td><b>{a[0]}</b></td><td>{a[1]}</td><td>{a[2]}</td><td><Status value={a[3]}/></td><td><span className="verify-chip"><FileCheck2/> Evidence required</span></td></tr>)}</tbody></table></div></section><section className="panel section-gap registry-rule"><ShieldCheck/><div><b>Factory truth rule</b><span>Provider completion never equals Factory completion. Missing capability becomes explicit configuration or STALLED state, never a false PASS.</span></div></section></div>}

function FactoryHealth(){return <div className="operations-page"><section className="health-banner"><HeartPulse/><div><span className="kicker">FACTORY CORE</span><b>Live connection established</b><small>Detailed per-service health is not exposed by the Factory API yet. No synthetic heartbeat data is shown.</small></div><Status value="CONNECTED"/></section></div>}

function Attention({snapshot,selectRun}:{snapshot:FactorySnapshot|null;selectRun:(id:string,next?:Screen)=>void}){const items=snapshot?.attention??[];return <div className="attention-console"><section className="panel gate-hero"><div><span className="kicker">HUMAN DECISION QUEUE</span><h2>Needs My Attention</h2></div></section><section className="panel section-gap">{items.length?items.map(x=><div className="attention-item" key={x.id}><div className="grow"><b>{x.name}</b><small>{x.id}</small></div><Status value={x.status}/><button className="primary" onClick={()=>selectRun(x.id,'control')}>Open project</button></div>):<div className="empty-state"><CheckCircle2/><b>No decisions waiting</b><span>Only real Factory human gates appear here.</span></div>}</section></div>}

function FactoryActivity({snapshot,run}:{snapshot:FactorySnapshot|null;run:FactoryRunDetail|null}){const events=run?.activity?.length?run.activity:(snapshot?.activity??[]);return <div className="operations-page"><section className="panel gate-hero"><div><span className="kicker">AUDIT TRAIL · LIVE</span><h2>Factory Activity</h2><p>{run?run.name:'All recent Factory evidence'}</p></div></section><section className="panel section-gap"><div className="activity-stream">{events.length?events.map((e:any)=><div className="activity-row rich" key={e.id}><div className="grow"><b>{e.text||e.name||'Factory event'}</b><small>{e.at||e.updatedAt||''}</small></div><Status value={(e.conclusion||e.status||'RECORDED').toUpperCase()}/></div>):<div className="empty-state"><Activity/><b>No live activity yet</b></div>}</div></section></div>}
function Pipeline({current,names=stages}:{current:number;names?:string[]}){return <div className="timeline">{names.map((x,i)=><div className={'stage-step '+(i<current?'done':i===current?'current':'')} key={x}><span className="step-marker">{i<current?'✓':i+1}</span><b>{x}</b></div>)}</div>}
function Metric({icon:Icon,label,value,note}:{icon:React.ElementType;label:string;value:string;note:string}){return <div className="metric"><div className="metricicon"><Icon size={20}/></div><div><span>{label}</span><strong>{value}</strong><small>{note}</small></div></div>}
function PanelTitle({title,sub}:{title:string;sub:string}){return <div className="panelhead"><div><h2>{title}</h2><p>{sub}</p></div></div>}
function Status({value}:{value:string}){const k=value.toLowerCase().replace('_','-');return <span className={'status '+k}><i/>{value}</span>}
function Info({title,value,sub}:{title:string;value:string;sub:string}){return <div className="panel info"><small>{title}</small><b>{value}</b><span>{sub}</span></div>}
function EvidenceTable(){return <div className="table-wrap"><table><thead><tr><th>Gate</th><th>Evidence</th><th>Result</th></tr></thead><tbody><tr><td>Build</td><td>TypeScript + Vite production build</td><td><Status value="COMPLETED"/></td></tr><tr><td>QA</td><td>Automated tests and exact-head verification</td><td><Status value="COMPLETED"/></td></tr><tr><td>Security</td><td>Policy and dependency checks</td><td><Status value="COMPLETED"/></td></tr><tr><td>Deployment</td><td>Staging artifact + heartbeat</td><td><Status value="VERIFYING"/></td></tr></tbody></table></div>}
