import React, { useEffect, useMemo, useState } from 'react';
import {
  Activity, AlertTriangle, ArrowRight, Bot, Box, CheckCircle2, ChevronRight, CircleDot,
  ClipboardCheck, Code2, Factory, FileCheck2, Gauge, Globe, HeartPulse, LayoutDashboard,
  Menu, Plus, Rocket, Search, ShieldCheck, Sparkles, X, Zap, Eye, ExternalLink
} from 'lucide-react';
import { factoryApi, factoryConfigured, type FactorySnapshot } from './factory-api';

type Lang='en'|'ar';
type Screen='home'|'create'|'control'|'design'|'review'|'agents'|'health'|'attention'|'activity';
const stages=['Idea','Product','Architecture','Design','Build','QA','Security','Staging','Review','Production'];
const arStages=['الفكرة','المنتج','الهندسة','التصميم','البناء','الجودة','الأمان','التجهيز','المراجعة','الإنتاج'];

const copy={
 en:{brand:'OGROUP',sub:'AI FACTORY',online:'Factory online',home:'Factory Home',create:'Create Product',control:'Project Control Room',design:'Design Approval',review:'Product Review',agents:'Agent Registry',health:'Factory Health',attention:'Needs My Attention',activity:'Factory Activity',newProduct:'Build New Product',title:'Factory Overview',desc:'Everything the Factory is building, in one place.',back:'Back to Factory',approve:'Approve',reject:'Request changes'},
 ar:{brand:'أو جروب',sub:'مصنع الذكاء الاصطناعي',online:'المصنع متصل',home:'الرئيسية',create:'إنشاء منتج',control:'غرفة تحكم المشروع',design:'اعتماد التصميم',review:'مراجعة المنتج',agents:'سجل الوكلاء',health:'صحة المصنع',attention:'تتطلب انتباهي',activity:'نشاط المصنع',newProduct:'بناء منتج جديد',title:'نظرة عامة على المصنع',desc:'كل ما يبنيه المصنع في مكان واحد.',back:'العودة للمصنع',approve:'موافقة',reject:'طلب تعديلات'}
};

const projects=[
 {name:'AI Factory Dashboard',stage:4,status:'RUNNING',agent:'Antigravity Build Agent',progress:42},
 {name:'CVIDEO',stage:5,status:'VERIFYING',agent:'QA Agent',progress:63},
 {name:'Doors',stage:2,status:'QUEUED',agent:'Architecture Agent',progress:22}
];
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
 const t=copy[lang]; const rtl=lang==='ar'; const stageNames=rtl?arStages:stages;
 useEffect(()=>{document.documentElement.dir=rtl?'rtl':'ltr';document.documentElement.lang=lang},[rtl,lang]);
 useEffect(()=>{ if(!factoryConfigured) return; let alive=true; const load=()=>factoryApi.snapshot().then(x=>{if(alive){setFactorySnapshot(x);setFactoryError('')}}).catch(e=>{if(alive)setFactoryError(e instanceof Error?e.message:'FACTORY_API_ERROR')}); load(); const timer=setInterval(load,30000); return()=>{alive=false;clearInterval(timer)} },[]);
 const nav=[
  ['home',t.home,LayoutDashboard],['create',t.create,Plus],['control',t.control,Gauge],
  ['design',t.design,ShieldCheck],['review',t.review,ClipboardCheck],['agents',t.agents,Bot],
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
   {screen==='home'&&<Home go={go} rtl={rtl}/>}
   {screen==='create'&&<CreateProduct notify={notify} rtl={rtl}/>}
   {screen==='control'&&<ControlRoom stageNames={stageNames}/>}
   {screen==='design'&&<DesignApproval notify={notify} t={t}/>}
   {screen==='review'&&<ProductReview notify={notify} t={t}/>}
   {screen==='agents'&&<AgentRegistry/>}
   {screen==='health'&&<FactoryHealth/>}
   {screen==='attention'&&<Attention go={go}/>}
   {screen==='activity'&&<FactoryActivity/>}
  </main>
  {toast&&<div className="toast"><CheckCircle2 size={17}/>{toast}</div>}
 </div>
}

function Topbar({title,subtitle,lang,setLang,onCreate,factoryLive,factoryConfigured}:{title:string;subtitle:string;lang:Lang;setLang:(x:Lang)=>void;onCreate:()=>void;factoryLive:boolean;factoryConfigured:boolean}){
 return <header className="page-header"><div><p className="eyebrow">PRODUCT OWNER CONTROL PLANE</p><h1>{title}</h1><span className="header-subtitle">{subtitle}</span></div><div className="header-actions"><span className="system-line"><i className={'status-dot '+(factoryLive?'green':'')}/>{factoryLive?'FACTORY CONNECTED':factoryConfigured?'FACTORY UNREACHABLE':'FACTORY NOT CONFIGURED'}</span><div className="lang-toggle-group"><button className={'lang-btn '+(lang==='en'?'active':'')} onClick={()=>setLang('en')}>English</button><button className={'lang-btn '+(lang==='ar'?'active':'')} onClick={()=>setLang('ar')}>العربية</button></div><button className="primary" onClick={onCreate}><Plus size={17}/>Build New Product</button></div></header>
}
function Home({go,rtl}:{go:(s:Screen)=>void;rtl:boolean}){
 return <div className="factory-home"><section className="home-command panel"><div><span className="kicker">AUTONOMOUS SOFTWARE FACTORY · CONTROL PLANE</span><h2>OGroup AI Factory</h2><p>Build, verify and govern software products from one Product Owner command center.</p></div><button className="primary build-command" onClick={()=>go('create')}><Plus/> Build New Product</button></section><section className="metrics"><Metric icon={CircleDot} label="Running jobs" value="3" note="Factory controlled"/><Metric icon={AlertTriangle} label="Needs attention" value="1" note="Human decision"/><Metric icon={CheckCircle2} label="Verified today" value="7" note="Evidence recorded"/><Metric icon={HeartPulse} label="Factory health" value="Healthy" note="Watchdog active"/></section><div className="home-grid"><section className="panel"><div className="console-head"><PanelTitle title="Active Products" sub="Outcome-focused production queue"/><button className="ghost" onClick={()=>go('activity')}>Factory activity <ChevronRight size={13}/></button></div>{projects.map(p=><button className="project-row" key={p.name} onClick={()=>go('control')}><div className="product-avatar"><Box size={18}/></div><div className="grow"><b>{p.name}</b><small>{p.agent}</small><div className="progress"><i style={{width:p.progress+'%'}}/></div></div><Status value={p.status}/><div className="stage-label"><small>CURRENT STAGE</small><b>{(rtl?arStages:stages)[p.stage]}</b></div><ChevronRight size={17}/></button>)}</section><section className="panel attention-home"><PanelTitle title="Needs My Attention" sub="Only genuine authority gates"/><div className="decision-card"><div className="amber"><ShieldCheck size={19}/></div><span className="kicker">DESIGN APPROVAL</span><h3>AI Factory Dashboard</h3><p>Reviewed design is ready for your decision.</p><button className="primary full" onClick={()=>go('design')}>Review decision <ArrowRight size={16}/></button></div><div className="autonomy-note"><Bot/><span><b>Factory handles the rest</b><small>Branches · CI · retries · provider recovery · verification</small></span></div></section></div><section className="panel section-gap"><div className="console-head"><PanelTitle title="Live Factory Path" sub="Stage progress backed by evidence"/><Status value="RUNNING"/></div><Pipeline current={4}/></section></div>
}

function CreateProduct({notify,rtl}:{notify:(s:string)=>void;rtl:boolean}){
 const [idea,setIdea]=useState(''); const [priority,setPriority]=useState('Normal'); const ready=idea.trim().length>15;
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
   <section className="panel launch-card"><span className="kicker">COMMAND CENTER</span><h3>{rtl?'إطلاق أمر التصنيع':'Launch Factory Run'}</h3><p>{rtl?'بعد الإطلاق، لا تحتاج لإدارة الفروع أو الاختبارات أو الإصلاحات الروتينية.':'After launch, you do not manage branches, CI retries or routine repairs.'}</p><div className="dispatch-ready"><span className="status-dot green"/> Agent Dispatch Ready</div><button disabled={!ready} className="primary full launch-big" onClick={()=>notify('Product intent accepted for Factory preparation')}><Rocket size={18}/>{rtl?'ابدأ تشغيل المصنع':'Start AI Factory'}</button><small className="authority-note">Human gates: Design · Material architecture/security · Production</small></section>
   <section className="panel flow-card"><PanelTitle title={rtl?'ماذا يحدث بعد الضغط؟':'Automated Flow'} sub="Factory-owned execution"/>{[
    ['Product','Factory logic'],['Architecture','Orchestrator stage'],['Design','Google Stitch'],['Design Review','OGroup review'],['Human Gate','Product Owner'],['Build','Google Antigravity'],['QA','CI + Orchestrator'],['Security','Rules + checks'],['Staging','Verified deployment'],['Product Review','Product Owner']
   ].map((x,i)=><div className="flow-line" key={x[0]}><span>{i+1}</span><div><b>{x[0]}</b><small>{x[1]}</small></div>{i===4||i===9?<Status value="WAITING_HUMAN"/>:<Status value="QUEUED"/>}</div>)}</section>
  </aside>
 </div>
}

function ControlRoom({stageNames}:{stageNames:string[]}){
 return <div className="control-room">
  <section className="panel control-command">
   <div><span className="kicker">LIVE FACTORY RUN · FACTORY-WORK:135</span><h2>AI Factory Dashboard</h2><p>Outcome: Product Owner control plane for autonomous software delivery.</p></div>
   <div className="control-state"><span className="pulse-ring"/><div><small>FACTORY STATE</small><Status value="RUNNING"/><b>Build execution</b></div></div>
  </section>
  <section className="panel pipeline-console"><div className="console-head"><PanelTitle title="Execution Pipeline" sub="Evidence-driven stage progression"/><div className="telemetry"><span>WATCHDOG <b>ACTIVE</b></span><span>HEARTBEAT <b>HEALTHY</b></span></div></div><Pipeline current={4} names={stageNames}/></section>
  <div className="control-grid">
   <section className="panel active-operation"><PanelTitle title="Current Operation" sub="Factory-owned execution"/><div className="operation-id"><Bot/><div><span className="kicker">BUILD EXECUTOR</span><h3>Google Antigravity Build Agent</h3><p>Implementing the approved product contract. Provider completion is not Factory completion.</p></div></div><div className="operation-facts"><Info title="Stage" value="Build" sub="Orchestrator controlled"/><Info title="Verification" value="Required" sub="Independent CI evidence"/><Info title="Human action" value="None" sub="Factory continues autonomously"/></div></section>
   <section className="panel watchdog-console"><PanelTitle title="Watchdog" sub="Deterministic progress supervision"/><div className="watchdog-status"><Activity/><div><b>Execution is progressing</b><small>Provider activity and repository evidence observed</small></div></div><div className="recovery-chain"><span>RE-CHECK</span><ChevronRight/><span>RETRY</span><ChevronRight/><span>FALLBACK</span><ChevronRight/><span>ESCALATE</span></div><p className="muted tiny">Escalation appears only when the Factory cannot recover safely without Product Owner authority.</p></section>
  </div>
  <section className="panel section-gap"><div className="console-head"><PanelTitle title="Verification Evidence" sub="Machine-verifiable record, not agent confidence"/><button className="ghost">Engineering drill-down <ChevronRight size={13}/></button></div><EvidenceTable/></section>
  <section className="panel authority-strip"><ShieldCheck/><div><b>Human authority remains protected</b><small>Design approval · material architecture/security changes · destructive operations · production release</small></div><Status value="NO ACTION"/></section>
 </div>
}
function DesignApproval({notify,t}:{notify:(s:string)=>void;t:any}){
 const screens=['Factory Home','Create Product','Control Room','Design Approval','Product Review','Agent Registry','Factory Health','Needs My Attention','Factory Activity'];
 return <div className="gate-layout"><section className="gate-main">
  <section className="panel gate-hero"><div><span className="kicker">HUMAN GATE · DESIGN</span><h2>Design Approval</h2><p>Review the generated product experience before autonomous implementation continues to staging.</p></div><div className="gate-score"><strong>100</strong><small>DESIGN REVIEW</small></div></section>
  <section className="panel"><div className="console-head"><PanelTitle title="Approved Screen Set" sub="Google Stitch · 9 generated screens"/><Status value="VERIFYING"/></div><div className="preview-grid gate-previews">{screens.map((x,i)=><div className="screen-preview" key={x}><div className="preview-window"><LayoutDashboard/><span>0{i+1}</span><em>STITCH</em></div><b>{x}</b><small>Responsive · Arabic · RTL</small></div>)}</div></section>
  <section className="panel section-gap"><PanelTitle title="Design Review Evidence" sub="Structural and content verification"/><div className="evidence-matrix">{['9/9 screens generated','Arabic 9/9','RTL 9/9','Interactive 9/9','Responsive 9/9','No exposed secrets'].map(x=><span key={x}><CheckCircle2/>{x}</span>)}</div></section>
 </section><aside className="gate-side panel"><span className="kicker">PRODUCT OWNER AUTHORITY</span><h3>Decision required</h3><p>Approval authorizes routine autonomous work through build, QA, repair, security and staging. Production still requires a separate human approval.</p><button className="ghost full"><Eye size={16}/> Preview product</button><textarea rows={5} placeholder="Optional change request…"/><button className="secondary full" onClick={()=>notify('Design change request opened')}>{t.reject}</button><button className="primary full gate-approve" onClick={()=>notify('Design approved. Factory authorized through staging.')}><ShieldCheck size={17}/>{t.approve} Design & Continue</button><small className="authority-note">This gate does not grant production authority.</small></aside></div>
}

function ProductReview({notify,t}:{notify:(s:string)=>void;t:any}){
 return <div className="review-layout"><section className="gate-main"><section className="panel gate-hero"><div><span className="kicker">HUMAN GATE · PRODUCT REVIEW</span><h2>AI Factory Dashboard · Staging</h2><p>The Factory has reached staging. Review the product outcome and independent evidence, not engineering noise.</p></div><Status value="WAITING_HUMAN"/></section><div className="review-evidence section-gap">{[['Build','PASSED','Production bundle'],['QA','PASSED','Tests + typecheck'],['Security','PASSED','No blocking findings'],['CI','GREEN','Exact commit verified'],['Deployment','STAGING','Health verified']].map(x=><div className="panel evidence-tile" key={x[0]}><small>{x[0]}</small><b>{x[1]}</b><span>{x[2]}</span></div>)}</div><section className="panel section-gap"><div className="console-head"><PanelTitle title="Release Evidence" sub="What the Factory proved before asking you"/><button className="ghost"><ExternalLink size={13}/> Open staging product</button></div><EvidenceTable/></section><section className="panel section-gap known-issues"><PanelTitle title="Known Issues" sub="Material issues only"/><div className="empty-state compact"><CheckCircle2/><b>No release-blocking issues recorded</b><span>Routine implementation noise remains inside Factory execution.</span></div></section></section><aside className="gate-side panel"><span className="kicker">PRODUCTION AUTHORITY</span><h3>Final product decision</h3><p>Approving here authorizes the Release Controller to perform the governed production release. It does not bypass release evidence.</p><textarea rows={5} placeholder="Feedback for the Factory…"/><button className="secondary full" onClick={()=>notify('Product returned to Factory with feedback')}>{t.reject}</button><button className="primary full gate-approve" onClick={()=>notify('Production approval recorded for governed release')}><Rocket size={17}/>{t.approve} Production</button><small className="authority-note">Release Controller must still verify release gates.</small></aside></div>
}

function AgentRegistry(){return <div className="operations-page"><section className="panel gate-hero"><div><span className="kicker">EXECUTION CAPABILITY MAP</span><h2>Agent Registry</h2><p>Jobs, executors and providers are separate. A stage is never shown as a connected AI agent unless a real adapter exists.</p></div><Status value="ACTIVE"/></section><section className="panel section-gap"><div className="table-wrap"><table className="registry-table"><thead><tr><th>Executor</th><th>Factory job</th><th>Provider / implementation</th><th>Status</th><th>Verification</th></tr></thead><tbody>{agents.map(a=><tr key={a[0]}><td><b>{a[0]}</b></td><td>{a[1]}</td><td>{a[2]}</td><td><Status value={a[3]}/></td><td><span className="verify-chip"><FileCheck2/> Evidence required</span></td></tr>)}</tbody></table></div></section><section className="panel section-gap registry-rule"><ShieldCheck/><div><b>Factory truth rule</b><span>Provider completion never equals Factory completion. Missing capability becomes explicit configuration or STALLED state, never a false PASS.</span></div></section></div>}

function FactoryHealth(){
 const services=[['Orchestrator','HEALTHY','Sequencing + governance'],['Watchdog','ACTIVE','Progress + recovery'],['GitHub / CI','HEALTHY','Independent verification'],['Stitch','READY','Design adapter'],['Antigravity','ACTIVE','Build executor'],['Deployment','HEALTHY','Release evidence']];
 return <div className="operations-page"><section className="health-banner"><HeartPulse/><div><span className="kicker">FACTORY CORE</span><b>All critical systems responding</b><small>Watchdog is independently supervising execution and recovery.</small></div><Status value="HEALTHY"/></section><div className="service-grid section-gap">{services.map((x,i)=><div className="panel service-card" key={x[0]}><div><i className="status-dot green"/><b>{x[0]}</b></div><strong>{x[1]}</strong><small>{x[2]}</small><div className="heartbeat"><Activity/> heartbeat {12+i*7}s</div></div>)}</div><div className="control-grid section-gap"><section className="panel"><PanelTitle title="Watchdog Recovery Engine" sub="Autonomy before human escalation"/><div className="recovery-stack">{['Observe provider + repository evidence','Detect stalled or missing heartbeat','Re-check dependency state','Retry approved executor','Use approved fallback when capable','Escalate only if human authority is required'].map((x,i)=><div key={x}><span>{String(i+1).padStart(2,'0')}</span><b>{x}</b>{i<5&&<ChevronRight/>}</div>)}</div></section><section className="panel"><PanelTitle title="Operational Guardrails" sub="What Watchdog cannot silently bypass"/><div className="guardrail-list">{['Production release','Material architecture change','Auth / tenant security boundary','Payments and financial correctness','Destructive data operations'].map(x=><span key={x}><ShieldCheck/>{x}</span>)}</div></section></div></div>
}
function Attention({go}:{go:(s:Screen)=>void}){return <div className="attention-console"><section className="panel gate-hero"><div><span className="kicker">HUMAN DECISION QUEUE</span><h2>Needs My Attention</h2><p>Only decisions that genuinely require Product Owner authority appear here.</p></div><div className="attention-count"><strong>1</strong><small>DECISION</small></div></section><section className="panel section-gap"><div className="attention-item priority"><div className="amber"><ShieldCheck/></div><div className="grow"><span className="kicker">DESIGN APPROVAL · HUMAN GATE</span><b>AI Factory Dashboard</b><p>Reviewed Stitch design is ready for Product Owner decision. Approval authorizes autonomous execution through staging.</p><small>Factory execution is not blocked by routine repair work.</small></div><Status value="WAITING_HUMAN"/><button className="primary" onClick={()=>go('design')}>Review decision</button></div></section><section className="panel section-gap"><div className="empty-state"><CheckCircle2/><b>No engineering chores</b><span>CI retries, provider recovery, branches, PRs and routine failures remain Factory responsibilities.</span></div></section></div>}

function FactoryActivity(){
 const events=[['12:42','Build Agent','Started Dashboard application build','RUNNING'],['12:39','Watchdog','Recovered idle work and selected next runnable task','COMPLETED'],['12:34','Quality Gate','Engineering verification passed','COMPLETED'],['12:29','Orchestrator','Resolved target repository','COMPLETED'],['12:24','Design Review','Approved 9/9 Stitch screens','COMPLETED']];
 return <div className="operations-page"><section className="panel gate-hero"><div><span className="kicker">AUDIT TRAIL · HUMAN READABLE</span><h2>Factory Activity</h2><p>Meaningful autonomous events first. Raw engineering telemetry remains available as drill-down evidence.</p></div><button className="ghost"><Search size={14}/> Filter activity</button></section><section className="panel section-gap"><div className="activity-stream">{events.map((e,i)=><div className="activity-row rich" key={i}><time>{e[0]}<small>TODAY</small></time><div className="activity-icon"><Activity size={16}/></div><div className="grow"><span className="kicker">{e[1]}</span><b>{e[2]}</b><small>Evidence attached · Factory run</small></div><Status value={e[3]}/><button className="ghost icon-button"><ChevronRight size={14}/></button></div>)}</div></section></div>
}
function Pipeline({current,names=stages}:{current:number;names?:string[]}){return <div className="timeline">{names.map((x,i)=><div className={'stage-step '+(i<current?'done':i===current?'current':'')} key={x}><span className="step-marker">{i<current?'✓':i+1}</span><b>{x}</b></div>)}</div>}
function Metric({icon:Icon,label,value,note}:{icon:React.ElementType;label:string;value:string;note:string}){return <div className="metric"><div className="metricicon"><Icon size={20}/></div><div><span>{label}</span><strong>{value}</strong><small>{note}</small></div></div>}
function PanelTitle({title,sub}:{title:string;sub:string}){return <div className="panelhead"><div><h2>{title}</h2><p>{sub}</p></div></div>}
function Status({value}:{value:string}){const k=value.toLowerCase().replace('_','-');return <span className={'status '+k}><i/>{value}</span>}
function Info({title,value,sub}:{title:string;value:string;sub:string}){return <div className="panel info"><small>{title}</small><b>{value}</b><span>{sub}</span></div>}
function EvidenceTable(){return <div className="table-wrap"><table><thead><tr><th>Gate</th><th>Evidence</th><th>Result</th></tr></thead><tbody><tr><td>Build</td><td>TypeScript + Vite production build</td><td><Status value="COMPLETED"/></td></tr><tr><td>QA</td><td>Automated tests and exact-head verification</td><td><Status value="COMPLETED"/></td></tr><tr><td>Security</td><td>Policy and dependency checks</td><td><Status value="COMPLETED"/></td></tr><tr><td>Deployment</td><td>Staging artifact + heartbeat</td><td><Status value="VERIFYING"/></td></tr></tbody></table></div>}
