import React, { useEffect, useMemo, useState } from 'react';
import {
  Activity, AlertTriangle, ArrowRight, Bot, Box, CheckCircle2, ChevronRight, CircleDot,
  ClipboardCheck, Code2, Factory, FileCheck2, Gauge, Globe, HeartPulse, LayoutDashboard,
  Menu, Plus, Rocket, Search, ShieldCheck, Sparkles, X, Zap
} from 'lucide-react';

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
 const t=copy[lang]; const rtl=lang==='ar'; const stageNames=rtl?arStages:stages;
 useEffect(()=>{document.documentElement.dir=rtl?'rtl':'ltr';document.documentElement.lang=lang},[rtl,lang]);
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
   <Topbar title={screen==='home'?t.title:nav.find(n=>n[0]===screen)?.[1]||t.title} subtitle={screen==='home'?t.desc:'AI Factory · Product Owner Control Plane'} lang={lang} setLang={setLang} onCreate={()=>go('create')}/>
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

function Topbar({title,subtitle,lang,setLang,onCreate}:{title:string;subtitle:string;lang:Lang;setLang:(x:Lang)=>void;onCreate:()=>void}){
 return <header className="page-header"><div><p className="eyebrow">PRODUCT OWNER CONTROL PLANE</p><h1>{title}</h1><span className="header-subtitle">{subtitle}</span></div><div className="header-actions"><div className="lang-toggle-group"><button className={'lang-btn '+(lang==='en'?'active':'')} onClick={()=>setLang('en')}>English</button><button className={'lang-btn '+(lang==='ar'?'active':'')} onClick={()=>setLang('ar')}>العربية</button></div><button className="primary" onClick={onCreate}><Plus size={17}/>Build New Product</button></div></header>
}
function Home({go,rtl}:{go:(s:Screen)=>void;rtl:boolean}){
 return <><section className="metrics"><Metric icon={CircleDot} label="Running jobs" value="3" note="2 agents active"/><Metric icon={AlertTriangle} label="Needs attention" value="1" note="Human decision"/><Metric icon={CheckCircle2} label="Completed today" value="7" note="All verified"/><Metric icon={HeartPulse} label="Factory health" value="Healthy" note="Heartbeat live"/></section>
 <div className="grid"><section className="panel span"><PanelTitle title="Active Products" sub="Products moving through the Factory"/>{projects.map(p=><button className="project-row" key={p.name} onClick={()=>go('control')}><div className="product-avatar"><Box size={18}/></div><div className="grow"><b>{p.name}</b><small>{p.agent}</small><div className="progress"><i style={{width:p.progress+'%'}}/></div></div><Status value={p.status}/><div className="stage-label"><small>CURRENT STAGE</small><b>{(rtl?arStages:stages)[p.stage]}</b></div><ChevronRight size={17}/></button>)}</section>
 <section className="panel"><PanelTitle title="Needs My Attention" sub="Only decisions that require you"/><div className="decision-card"><div className="amber"><ShieldCheck size={19}/></div><span className="kicker">DESIGN APPROVAL</span><h3>AI Factory Dashboard</h3><p>9 screens reviewed. Design is ready for Product Owner decision.</p><div className="mini-checks"><span>✓ Design review passed</span><span>✓ RTL checked</span><span>✓ Responsive checked</span></div><button className="primary full" onClick={()=>go('design')}>Review Design <ArrowRight size={16}/></button></div></section></div>
 <section className="panel section-gap"><PanelTitle title="Live Factory Path" sub="Evidence-based progress, not decorative percentages"/><Pipeline current={4}/></section></>
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
 return <><section className="control-hero panel"><div><span className="kicker">FACTORY-WORK:135</span><h2>AI Factory Dashboard</h2><p>Autonomous execution with evidence at every gate.</p></div><div className="hero-stat"><small>FACTORY STATE</small><Status value="RUNNING"/><b>Build</b></div></section><section className="panel section-gap"><PanelTitle title="Execution Pipeline" sub="Current stage: Build"/><Pipeline current={4} names={stageNames}/></section><div className="three-col section-gap"><Info title="Current job" value="Dashboard application build" sub="Antigravity Build Agent"/><Info title="Last heartbeat" value="Active" sub="Watchdog observing"/><Info title="Recovery" value="Armed" sub="Retry → fallback → escalate"/></div><section className="panel section-gap"><PanelTitle title="Evidence" sub="Machine-verifiable execution record"/><EvidenceTable/></section></>
}
function DesignApproval({notify,t}:{notify:(s:string)=>void;t:any}){
 return <div className="two-col"><section className="panel"><div className="approval-head"><div className="hero-icon"><ShieldCheck/></div><div><span className="kicker">HUMAN GATE</span><h2>AI Factory Dashboard · Design V1</h2><p>Google Stitch · 9 screens · Review score 100/100</p></div></div><div className="preview-grid">{['Factory Home','Create Product','Control Room','Design Approval','Product Review','Agent Registry','Factory Health','Needs My Attention','Factory Activity'].map((x,i)=><div className="screen-preview" key={x}><div className="preview-window"><LayoutDashboard/><span>{i+1}</span></div><b>{x}</b><small>Responsive · RTL ready</small></div>)}</div></section><section className="panel decision-panel"><PanelTitle title="Decision" sub="Only you can cross this gate"/><div className="score"><strong>100</strong><span>/100<br/>Design review</span></div><div className="mini-checks large"><span>✓ 9/9 screens generated</span><span>✓ Arabic 9/9</span><span>✓ RTL 9/9</span><span>✓ Interactive 9/9</span><span>✓ Responsive 9/9</span></div><button className="primary full" onClick={()=>notify('Design approved. Factory may continue.')}>{t.approve}</button><button className="secondary full" onClick={()=>notify('Change request opened')}>{t.reject}</button></section></div>
}
function ProductReview({notify,t}:{notify:(s:string)=>void;t:any}){
 return <><section className="panel review-hero"><div><span className="kicker">PRODUCT REVIEW</span><h2>AI Factory Dashboard · Staging</h2><p>Build, QA and security evidence are ready for your final product decision.</p></div><Status value="WAITING_HUMAN"/></section><div className="four-col section-gap"><Info title="Build" value="Passed" sub="Production bundle"/><Info title="Tests" value="42 / 42" sub="All passing"/><Info title="Security" value="Passed" sub="No blockers"/><Info title="Deployment" value="Staging" sub="Verified"/></div><section className="panel section-gap"><PanelTitle title="Release evidence" sub="What the Factory proved before asking you"/><EvidenceTable/><div className="review-actions"><button className="secondary" onClick={()=>notify('Product returned with requested changes')}>{t.reject}</button><button className="primary" onClick={()=>notify('Production approval recorded')}><Rocket size={17}/>{t.approve} Production</button></div></section></>
}
function AgentRegistry(){return <section className="panel"><PanelTitle title="Agent Registry" sub="Capabilities available to the Factory"/><div className="table-wrap"><table><thead><tr><th>Agent</th><th>Role</th><th>Provider</th><th>Status</th></tr></thead><tbody>{agents.map(a=><tr key={a[0]}><td><b>{a[0]}</b></td><td>{a[1]}</td><td>{a[2]}</td><td><Status value={a[3]}/></td></tr>)}</tbody></table></div></section>}
function FactoryHealth(){
 const services=[['Orchestrator','Healthy','18s'],['Watchdog','Healthy','12s'],['GitHub / CI','Healthy','31s'],['Stitch','Ready','2m'],['Antigravity','Active','8s'],['Deployment','Healthy','46s']];
 return <><section className="health-banner"><HeartPulse/><div><b>Factory healthy</b><span>All critical execution services are responding.</span></div><Status value="HEALTHY"/></section><div className="service-grid section-gap">{services.map(s=><div className="panel service-card" key={s[0]}><div><i className="status-dot green"/><b>{s[0]}</b></div><strong>{s[1]}</strong><small>Last heartbeat {s[2]}</small></div>)}</div><section className="panel section-gap"><PanelTitle title="Watchdog recovery policy" sub="Autonomy before escalation"/><div className="policy">Unexpected idle <ArrowRight/> Resolve next work <ArrowRight/> Start executor <ArrowRight/> Verify heartbeat <ArrowRight/> Retry / fallback <ArrowRight/> Human only if blocked</div></section></>
}
function Attention({go}:{go:(s:Screen)=>void}){return <section className="panel"><PanelTitle title="Needs My Attention" sub="Routine failures are deliberately hidden from this queue"/><div className="attention-item"><div className="amber"><ShieldCheck/></div><div className="grow"><span className="kicker">DESIGN APPROVAL</span><b>AI Factory Dashboard</b><p>Reviewed design is waiting for Product Owner approval.</p></div><Status value="WAITING_HUMAN"/><button className="primary" onClick={()=>go('design')}>Review</button></div><div className="empty-state"><CheckCircle2/><b>Nothing else needs you</b><span>The Factory is handling routine execution and recovery.</span></div></section>}
function FactoryActivity(){
 const events=[['12:42','Build Agent','Started Dashboard application build','RUNNING'],['12:39','Watchdog','Recovered idle work and selected next runnable task','COMPLETED'],['12:34','Quality Gate','Engineering verification passed','COMPLETED'],['12:29','Orchestrator','Resolved target repository','COMPLETED'],['12:24','Design Review','Approved 9/9 Stitch screens','COMPLETED']];
 return <section className="panel"><PanelTitle title="Factory Activity" sub="A readable audit trail of autonomous work"/><div className="activity-list">{events.map((e,i)=><div className="activity-row" key={i}><time>{e[0]}</time><div className="activity-icon"><Activity size={16}/></div><div className="grow"><b>{e[1]}</b><span>{e[2]}</span></div><Status value={e[3]}/></div>)}</div></section>
}
function Pipeline({current,names=stages}:{current:number;names?:string[]}){return <div className="timeline">{names.map((x,i)=><div className={'stage-step '+(i<current?'done':i===current?'current':'')} key={x}><span className="step-marker">{i<current?'✓':i+1}</span><b>{x}</b></div>)}</div>}
function Metric({icon:Icon,label,value,note}:{icon:React.ElementType;label:string;value:string;note:string}){return <div className="metric"><div className="metricicon"><Icon size={20}/></div><div><span>{label}</span><strong>{value}</strong><small>{note}</small></div></div>}
function PanelTitle({title,sub}:{title:string;sub:string}){return <div className="panelhead"><div><h2>{title}</h2><p>{sub}</p></div></div>}
function Status({value}:{value:string}){const k=value.toLowerCase().replace('_','-');return <span className={'status '+k}><i/>{value}</span>}
function Info({title,value,sub}:{title:string;value:string;sub:string}){return <div className="panel info"><small>{title}</small><b>{value}</b><span>{sub}</span></div>}
function EvidenceTable(){return <div className="table-wrap"><table><thead><tr><th>Gate</th><th>Evidence</th><th>Result</th></tr></thead><tbody><tr><td>Build</td><td>TypeScript + Vite production build</td><td><Status value="COMPLETED"/></td></tr><tr><td>QA</td><td>Automated tests and exact-head verification</td><td><Status value="COMPLETED"/></td></tr><tr><td>Security</td><td>Policy and dependency checks</td><td><Status value="COMPLETED"/></td></tr><tr><td>Deployment</td><td>Staging artifact + heartbeat</td><td><Status value="VERIFYING"/></td></tr></tbody></table></div>}
