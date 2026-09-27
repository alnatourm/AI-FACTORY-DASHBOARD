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
