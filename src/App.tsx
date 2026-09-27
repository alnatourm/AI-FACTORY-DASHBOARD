import React, { useState, useEffect } from 'react';
import {
  Activity,
  AlertTriangle,
  Bot,
  Box,
  CheckCircle2,
  ChevronRight,
  CircleDot,
  Factory,
  Globe,
  HeartPulse,
  LayoutDashboard,
  Menu,
  Plus,
  ShieldCheck,
  X
} from 'lucide-react';

type Lang = 'en' | 'ar';

interface TranslationStrings {
  brand: string;
  brandSub: string;
  factoryOnline: string;
  allSystemsOperational: string;
  navOverview: string;
  navProjects: string;
  navAgents: string;
  navHealth: string;
  navActivity: string;
  controlRoomTag: string;
  overviewTitle: string;
  overviewSubtitle: string;
  buildNewProduct: string;
  runningJobs: string;
  runningJobsNote: string;
  needsAttention: string;
  needsAttentionNote: string;
  completedToday: string;
  completedTodayNote: string;
  factoryHealth: string;
  healthy: string;
  heartbeat12s: string;
  activeProjectsTitle: string;
  activeProjectsSubtitle: string;
  viewAll: string;
  currentStage: string;
  lastActivity: string;
  running: string;
  verifying: string;
  justNow: string;
  minAgo4: string;
  minAgo8: string;
  stitchWorker: string;
  ciWorker: string;
  antigravityWorker: string;
  attentionTitle: string;
  attentionSubtitle: string;
  designApproval: string;
  dashboardName: string;
  decisionDesc: string;
  checkDesignPassed: string;
  checkRtlChecked: string;
  checkResponsiveChecked: string;
  reviewDesign: string;
  controlRoomTitle: string;
  controlRoomSubtitle: string;
  currentJobLabel: string;
  currentJobValue: string;
  executorLabel: string;
  executorValue: string;
  heartbeatLabel: string;
  heartbeatValue: string;
  recoveryLabel: string;
  recoveryValue: string;
  attentionQueueTitle: string;
  attentionQueueSubtitle: string;
  oneDecision: string;
  attentionRowTitle: string;
  attentionRowDesc: string;
  waitingHuman: string;
  reviewAction: string;
  factoryHealthTitle: string;
  factoryHealthSubtitle: string;
  watchdogPolicyTitle: string;
  watchdogPolicyDesc: string;
  serviceOrchestrator: string;
  serviceWatchdog: string;
  serviceGithub: string;
  serviceStitch: string;
  serviceAntigravity: string;
  serviceDeployment: string;
  statusActive: string;
  stages: string[];
}

const translations: Record<Lang, TranslationStrings> = {
  en: {
    brand: 'OGROUP',
    brandSub: 'AI FACTORY',
    factoryOnline: 'Factory online',
    allSystemsOperational: 'All systems operational',
    navOverview: 'Overview',
    navProjects: 'Projects',
    navAgents: 'Agents',
    navHealth: 'Factory Health',
    navActivity: 'Activity',
    controlRoomTag: 'CONTROL ROOM',
    overviewTitle: 'Factory Overview',
    overviewSubtitle: 'Everything the Factory is building, in one place.',
    buildNewProduct: 'Build New Product',
    runningJobs: 'Running jobs',
    runningJobsNote: '2 agents active',
    needsAttention: 'Needs attention',
    needsAttentionNote: 'Design approval',
    completedToday: 'Completed today',
    completedTodayNote: 'All verified',
    factoryHealth: 'Factory health',
    healthy: 'Healthy',
    heartbeat12s: 'Last heartbeat 12s',
    activeProjectsTitle: 'Active Projects',
    activeProjectsSubtitle: 'Current products moving through the Factory',
    viewAll: 'View all',
    currentStage: 'CURRENT STAGE',
    lastActivity: 'LAST ACTIVITY',
    running: 'RUNNING',
    verifying: 'VERIFYING',
    justNow: 'just now',
    minAgo4: '4 min ago',
    minAgo8: '8 min ago',
    stitchWorker: 'Stitch Design Agent',
    ciWorker: 'CI + Review',
    antigravityWorker: 'Antigravity',
    attentionTitle: 'Needs My Attention',
    attentionSubtitle: 'Only decisions that require you',
    designApproval: 'DESIGN APPROVAL',
    dashboardName: 'AI Factory Dashboard',
    decisionDesc: '9 screens generated and reviewed. The design is ready for your decision.',
    checkDesignPassed: 'Design review passed',
    checkRtlChecked: 'RTL checked',
    checkResponsiveChecked: 'Responsive checked',
    reviewDesign: 'Review Design',
    controlRoomTitle: 'Project Control Room',
    controlRoomSubtitle: 'AI Factory Dashboard · live execution path',
    currentJobLabel: 'CURRENT JOB',
    currentJobValue: 'Dashboard control-room build',
    executorLabel: 'ASSIGNED EXECUTOR',
    executorValue: 'Factory build worker',
    heartbeatLabel: 'LAST HEARTBEAT',
    heartbeatValue: 'Active',
    recoveryLabel: 'RECOVERY',
    recoveryValue: 'Watchdog armed',
    attentionQueueTitle: 'Attention Queue',
    attentionQueueSubtitle: 'Human gates only. Routine failures stay inside automatic recovery.',
    oneDecision: '1 DECISION',
    attentionRowTitle: 'Design approval · AI Factory Dashboard',
    attentionRowDesc: 'Reviewed design is ready for Product Owner decision.',
    waitingHuman: 'WAITING_HUMAN',
    reviewAction: 'Review',
    factoryHealthTitle: 'Factory Health',
    factoryHealthSubtitle: 'Live services and execution infrastructure',
    watchdogPolicyTitle: 'Watchdog recovery policy',
    watchdogPolicyDesc: 'Unexpected idle → resolve next work → start executor → verify heartbeat → retry/fallback → escalate only if blocked.',
    serviceOrchestrator: 'Orchestrator',
    serviceWatchdog: 'Watchdog',
    serviceGithub: 'GitHub / CI',
    serviceStitch: 'Stitch',
    serviceAntigravity: 'Antigravity',
    serviceDeployment: 'Deployment',
    statusActive: 'Active',
    stages: ['Idea', 'Product', 'Architecture', 'Design', 'Build', 'QA', 'Security', 'Staging', 'Review', 'Production']
  },
  ar: {
    brand: 'أو جروب',
    brandSub: 'مصنع الذكاء الاصطناعي',
    factoryOnline: 'المصنع متصل بالإنترنت',
    allSystemsOperational: 'جميع الأنظمة تعمل بكفاءة',
    navOverview: 'نظرة عامة',
    navProjects: 'المشاريع',
    navAgents: 'الوكلاء',
    navHealth: 'صحة المصنع',
    navActivity: 'النشاط',
    controlRoomTag: 'غرفة التحكم',
    overviewTitle: 'نظرة عامة على المصنع',
    overviewSubtitle: 'كل ما يبنيه المصنع، في مكان واحد.',
    buildNewProduct: 'بناء منتج جديد',
    runningJobs: 'المهام الجارية',
    runningJobsNote: 'وكيلان نشطان',
    needsAttention: 'تتطلب الاهتمام',
    needsAttentionNote: 'اعتماد التصميم',
    completedToday: 'المكتمل اليوم',
    completedTodayNote: 'تم التحقق بالكامل',
    factoryHealth: 'صحة المصنع',
    healthy: 'سليم',
    heartbeat12s: 'آخر نبض قبل 12 ثانية',
    activeProjectsTitle: 'المشاريع النشطة',
    activeProjectsSubtitle: 'المنتجات الحالية التي تمر عبر المصنع',
    viewAll: 'عرض الكل',
    currentStage: 'المرحلة الحالية',
    lastActivity: 'آخر نشاط',
    running: 'قيد التشغيل',
    verifying: 'قيد التحقق',
    justNow: 'الآن',
    minAgo4: 'منذ 4 دقائق',
    minAgo8: 'منذ 8 دقائق',
    stitchWorker: 'وكيل التصميم Stitch',
    ciWorker: 'التكامل المستمر والمراجعة',
    antigravityWorker: 'أنتيجرافيتي',
    attentionTitle: 'تتطلب انتباهي',
    attentionSubtitle: 'القرارات التي تتطلب تدخلك فقط',
    designApproval: 'اعتماد التصميم',
    dashboardName: 'لوحة تحكم مصنع الذكاء الاصطناعي',
    decisionDesc: 'تم إنشاء 9 شاشات ومراجعتها. التصميم جاهز لاتخاذ قرارك.',
    checkDesignPassed: 'اجتاز مراجعة التصميم',
    checkRtlChecked: 'تم فحص دعم اللغة العربية (RTL)',
    checkResponsiveChecked: 'تم فحص التجاوب مع الشاشات',
    reviewDesign: 'مراجعة التصميم',
    controlRoomTitle: 'غرفة التحكم بالمشروع',
    controlRoomSubtitle: 'لوحة تحكم مصنع الذكاء الاصطناعي · مسار التنفيذ المباشر',
    currentJobLabel: 'المهمة الحالية',
    currentJobValue: 'بناء غرفة التحكم للوحة القيادة',
    executorLabel: 'المنفذ المعين',
    executorValue: 'عامل بناء المصنع',
    heartbeatLabel: 'آخر نبض',
    heartbeatValue: 'نشط',
    recoveryLabel: 'التعافي التلقائي',
    recoveryValue: 'المراقب جاهز',
    attentionQueueTitle: 'طابور الاهتمام',
    attentionQueueSubtitle: 'البوابات البشرية فقط. حالات الفشل الروتينية تبقى داخل التعافي التلقائي.',
    oneDecision: 'قرار واحد',
    attentionRowTitle: 'اعتماد التصميم · لوحة تحكم مصنع الذكاء الاصطناعي',
    attentionRowDesc: 'التصميم المراجع جاهز لقرار مالك المنتج.',
    waitingHuman: 'بانتظار موافقة بشرية',
    reviewAction: 'مراجعة',
    factoryHealthTitle: 'صحة المصنع',
    factoryHealthSubtitle: 'الخدمات المباشرة والبنية التحتية للتنفيذ',
    watchdogPolicyTitle: 'سياسة تعافي المراقب الذكي',
    watchdogPolicyDesc: 'خمول غير متوقع ← تحديد العمل التالي ← تشغيل المنفذ ← التحقق من النبض ← إعادة المحاولة/البديل ← التصعيد فقط عند التعثر.',
    serviceOrchestrator: 'المنسق',
    serviceWatchdog: 'المراقب',
    serviceGithub: 'GitHub / التكامل المستمر',
    serviceStitch: 'ستيتش',
    serviceAntigravity: 'أنتيجرافيتي',
    serviceDeployment: 'النشر',
    statusActive: 'نشط',
    stages: ['الفكرة', 'المنتج', 'الهندسة المعمارية', 'التصميم', 'البناء', 'ضمان الجودة', 'الأمان', 'التجهيز', 'المراجعة', 'الإنتاج']
  }
};

export function App() {
  const [lang, setLang] = useState<Lang>('en');
  const [activeNav, setActiveNav] = useState<number>(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);

  const t = translations[lang];
  const isRtl = lang === 'ar';

  useEffect(() => {
    document.documentElement.dir = isRtl ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
  }, [lang, isRtl]);

  const toggleLanguage = () => {
    setLang((prev) => (prev === 'en' ? 'ar' : 'en'));
  };

  const navItems = [
    { name: t.navOverview, icon: LayoutDashboard },
    { name: t.navProjects, icon: Box },
    { name: t.navAgents, icon: Bot },
    { name: t.navHealth, icon: HeartPulse },
    { name: t.navActivity, icon: Activity }
  ];

  const projects = [
    {
      name: t.dashboardName,
      stage: t.stages[3],
      status: t.running,
      statusKey: 'running',
      worker: t.stitchWorker,
      activity: t.justNow,
      iconClass: 'p0'
    },
    { 
      name: 'Wasl',
      stage: t.stages[8],
      status: t.verifying,
      statusKey: 'verifying',
      worker: t.ciWorker,
      activity: t.minAgo4,
      iconClass: 'p1'
    },
    { 
      name: 'CVIDEO',
      stage: t.stages[4],
      status: t.running,
      statusKey: 'running',
      worker: t.antigravityWorker,
      activity: t.minAgo8,
      iconClass: 'p2'
    }
  ];

  const services = [
    { name: t.serviceOrchestrator, status: t.healthy, active: false },
    { name: t.serviceWatchdog, status: t.healthy, active: false },
    { name: t.serviceGithub, status: t.healthy, active: false },
    { name: t.serviceStitch, status: t.statusActive, active: true },
    { name: t.serviceAntigravity, status: t.statusActive, active: true },
    { name: t.serviceDeployment, status: t.healthy, active: false }
  ];

  return (
    <div className={`shell ${isRtl ? 'rtl' : 'ltr'}`}>
      {/* Mobile top bar */}
      <div className="mobile-header">
        <button
          type="button"
          className="menu-toggle"
          aria-label="Toggle navigation menu"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
        <div className="mobile-brand">
          <div className="mark">
            <Factory size={18} />
          </div>
          <span className="brand-text">{t.brand}</span>
        </div>
        <button
          type="button"
          className="lang-switcher-compact"
          onClick={toggleLanguage}
          aria-label={isRtl ? 'Switch to English' : 'التحويل إلى العربية'}
        >
          <Globe size={16} />
          <span>{isRtl ? 'EN' : 'العربية'}</span>
        </button>
      </div>

      {/* Backdrop for mobile drawer */}
      {mobileMenuOpen && (
        <div
          className="mobile-backdrop"
          onClick={() => setMobileMenuOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Sidebar Navigation */}
      <aside className={`sidebar ${mobileMenuOpen ? 'open' : ''}`}>
        <div className="brand">
          <div className="mark">
            <Factory size={21} />
          </div>
          <div>
            <b>{t.brand}</b>
            <span>{t.brandSub}</span>
          </div>
        </div>

        <nav aria-label="Main Navigation">
          {navItems.map((item, i) => {
            const Icon = item.icon;
            const isActive = activeNav === i;
            return (
              <button
                key={item.name}
                type="button"
                className={`nav-btn ${isActive ? 'active' : ''}`}
                onClick={() => {
                  setActiveNav(i);
                  setMobileMenuOpen(false);
                }}
              >
                <Icon size={18} />
                <span>{item.name}</span>
              </button>
            );
          })}
        </nav>

        <div className="sidebar-footer">
          <div className="system">
            <span>
              <i className="status-dot green" />
              {t.factoryOnline}
            </span>
            <small>{t.allSystemsOperational}</small>
          </div>
        </div>
      </aside>

      {/* Main Content Area: Factory Home Screen */}
      <main className="content">
        <header className="page-header">
          <div className="header-meta">
            <p className="eyebrow">{t.controlRoomTag}</p>
            <h1>{t.overviewTitle}</h1>
            <span className="header-subtitle">{t.overviewSubtitle}</span>
          </div>
          <div className="header-actions">
            {/* Language / RTL controls */}
            <div className="lang-toggle-group" role="group" aria-label="Language selection">
              <button
                type="button"
                className={`lang-btn ${lang === 'en' ? 'active' : ''}`}
                onClick={() => setLang('en')}
                aria-pressed={lang === 'en'}
              >
                English
              </button>
              <button
                type="button"
                className={`lang-btn ${lang === 'ar' ? 'active' : ''}`}
                onClick={() => setLang('ar')}
                aria-pressed={lang === 'ar'}
              >
                العربية
              </button>
            </div>

            <button type="button" className="primary btn-build">
              <Plus size={18} />
              <span>{t.buildNewProduct}</span>
            </button>
          </div>
        </header>

        {/* 4 Metric Cards */}
        <section className="metrics" aria-label="Overview Metrics">
          <Metric
            icon={CircleDot}
            label={t.runningJobs}
            value="3"
            note={t.runningJobsNote}
          />
          <Metric
            icon={AlertTriangle}
            label={t.needsAttention}
            value="1"
            note={t.needsAttentionNote}
          />
          <Metric
            icon={CheckCircle2}
            label={t.completedToday}
            value="7"
            note={t.completedTodayNote}
          />
          <Metric
            icon={HeartPulse}
            label={t.factoryHealth}
            value={t.healthy}
            note={t.heartbeat12s}
          />
        </section>

        {/* 2-Column Grid: Active Projects & Needs My Attention */}
        <div className="grid">
          {/* Active Projects Panel */}
          <section className="panel projects">
            <div className="panelhead">
              <div>
                <h2>{t.activeProjectsTitle}</h2>
                <p>{t.activeProjectsSubtitle}</p>
              </div>
              <button type="button" className="link-action">
                <span>{t.viewAll}</span>
                <ChevronRight size={15} className="chevron-forward" />
              </button>
            </div>
            <div className="projects-list">
              {projects.map((p) => (
                <div className="project" key={p.name}>
                  <div className={`projecticon ${p.iconClass}`}>
                    <Box size={19} />
                  </div>
                  <div className="pname">
                    <b>{p.name}</b>
                    <span>{p.worker}</span>
                  </div>
                  <span className={`pill ${p.statusKey}`}>{p.status}</span>
                  <div className="stage">
                    <small>{t.currentStage}</small>
                    <b>{p.stage}</b>
                  </div>
                  <div className="last">
                    <small>{t.lastActivity}</small>
                    <b>{p.activity}</b>
                  </div>
                  <ChevronRight size={17} className="chevron-forward project-chevron" />
                </div>
              ))}
            </div>
          </section>

          {/* Needs My Attention Panel */}
          <section className="panel attention">
            <div className="panelhead">
              <div>
                <h2>{t.attentionTitle}</h2>
                <p>{t.attentionSubtitle}</p>
              </div>
            </div>
            <div className="decision">
              <div className="decisiontop">
                <div className="amber">
                  <ShieldCheck size={19} />
                </div>
                <span>{t.designApproval}</span>
              </div>
              <h3>{t.dashboardName}</h3>
              <p>{t.decisionDesc}</p>
              <div className="checks">
                <span>
                  <CheckCircle2 size={15} />
                  {t.checkDesignPassed}
                </span>
                <span>
                  <CheckCircle2 size={15} />
                  {t.checkRtlChecked}
                </span>
                <span>
                  <CheckCircle2 size={15} />
                  {t.checkResponsiveChecked}
                </span>
              </div>
              <button type="button" className="review">
                <span>{t.reviewDesign}</span>
                <ChevronRight size={16} className="chevron-forward" />
              </button>
            </div>
          </section>
        </div>

        {/* Project Control Room Panel */}
        <section className="panel control">
          <div className="panelhead">
            <div>
              <h2>{t.controlRoomTitle}</h2>
              <p>{t.controlRoomSubtitle}</p>
            </div>
            <span className="healthy-pill">
              <i className="status-dot green" />
              {t.running}
            </span>
          </div>

          {/* Timeline of stages */}
          <div className="timeline" role="list">
            {t.stages.map((stageName, i) => {
              const isDone = i < 3;
              const isCurrent = i === 3;
              const stateClass = isDone ? 'done' : isCurrent ? 'current' : '';
              return (
                <div key={stageName} className={`stage-step ${stateClass}`} role="listitem">
                  <span className="step-marker">{isDone ? '✓' : i + 1}</span>
                  <b>{stageName}</b>
                </div>
              );
            })}
          </div>

          {/* Evidence metadata strip */}
          <div className="evidence">
            <div>
              <small>{t.currentJobLabel}</small>
              <b>{t.currentJobValue}</b>
            </div>
            <div>
              <small>{t.executorLabel}</small>
              <b>{t.executorValue}</b>
            </div>
            <div>
              <small>{t.heartbeatLabel}</small>
              <b>{t.heartbeatValue}</b>
            </div>
            <div>
              <small>{t.recoveryLabel}</small>
              <b>{t.recoveryValue}</b>
            </div>
          </div>
        </section>

        {/* Attention Queue Panel */}
        <section className="panel attentionqueue">
          <div className="panelhead">
            <div>
              <h2>{t.attentionQueueTitle}</h2>
              <p>{t.attentionQueueSubtitle}</p>
            </div>
            <span className="pill verifying">{t.oneDecision}</span>
          </div>
          <div className="attentionrow">
            <div className="amber">
              <ShieldCheck size={19} />
            </div>
            <div className="attention-text">
              <b>{t.attentionRowTitle}</b>
              <p>{t.attentionRowDesc}</p>
            </div>
            <span className="pill verifying">{t.waitingHuman}</span>
            <button type="button" className="btn-outline">
              <span>{t.reviewAction}</span>
              <ChevronRight size={15} className="chevron-forward" />
            </button>
          </div>
        </section>

        {/* Factory Health Panel */}
        <section className="panel health">
          <div className="panelhead">
            <div>
              <h2>{t.factoryHealthTitle}</h2>
              <p>{t.factoryHealthSubtitle}</p>
            </div>
            <span className="healthy-pill">
              <i className="status-dot green" />
              {t.healthy}
            </span>
          </div>

          <div className="recovery">
            <b>{t.watchdogPolicyTitle}</b>
            <span>{t.watchdogPolicyDesc}</span>
          </div>

          <div className="services">
            {services.map((s) => (
              <div key={s.name} className="service-item">
                <span>
                  <i className={`status-dot ${s.active ? 'blue' : 'green'}`} />
                  {s.name}
                </span>
                <b>{s.status}</b>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}

interface MetricProps {
  icon: React.ElementType;
  label: string;
  value: string;
  note: string;
}

function Metric({ icon: Icon, label, value, note }: MetricProps) {
  return (
    <div className="metric">
      <div className="metricicon">
        <Icon size={20} />
      </div>
      <div className="metric-content">
        <span className="metric-label">{label}</span>
        <strong className="metric-value">{value}</strong>
        <small className="metric-note">{note}</small>
      </div>
    </div>
  );
}
