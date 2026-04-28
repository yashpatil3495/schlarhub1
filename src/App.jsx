// src/App.jsx — ScholarHub v4 with all upgrades
// Error Boundaries · Lazy Loading · Dark Mode · Onboarding · Page Transitions
import { useState, useEffect, lazy, Suspense } from "react";
import { SCHOLARSHIPS as LOCAL_SCHOLARSHIPS } from "./data/scholarships.js";
import { I18nProvider, useTranslation } from "./lib/i18n.jsx";
import { scheduleDeadlineNotifications, requestNotifPermission, getNotifPermission } from "./lib/notifications.js";
import { ThemeProvider, useTheme } from "./contexts/ThemeContext.jsx";

// Auth
import { AuthProvider, useAuth } from "./contexts/AuthContext.jsx";
import AuthPage from "./components/AuthPage.jsx";
import LandingPage from "./components/LandingPage.jsx";
import ErrorBoundary from "./components/ErrorBoundary.jsx";
import OnboardingWizard from "./components/OnboardingWizard.jsx";

// Supabase hooks
import { useScholarships, useSaved, useTracker, useNotifications } from "./hooks/useSupabase.js";

// Core pages (always loaded)
import Dashboard          from "./components/Dashboard.jsx";
import ScholarshipsPage   from "./components/ScholarshipsPage.jsx";
import ScholarshipDetail  from "./components/ScholarshipDetail.jsx";

// Lazy-loaded pages (code splitting for performance)
const ApplicationTracker = lazy(() => import("./components/ApplicationTracker.jsx"));
const DeadlineCalendar   = lazy(() => import("./components/DeadlineCalendar.jsx"));
const DocumentCenter     = lazy(() => import("./components/DocumentCenter.jsx"));
const ProfilePage        = lazy(() => import("./components/ProfilePage.jsx"));
const NotificationsPage  = lazy(() => import("./components/NotificationsPage.jsx"));
const SOPGenerator       = lazy(() => import("./components/SOPGenerator.jsx"));
const InterviewSimulator = lazy(() => import("./components/InterviewSimulator.jsx"));
const RejectionAnalyser  = lazy(() => import("./components/RejectionAnalyser.jsx"));
const DocumentOCR        = lazy(() => import("./components/DocumentOCR.jsx"));
const ScholarBot         = lazy(() => import("./components/ScholarBot.jsx"));
const AidCalculator      = lazy(() => import("./components/AidCalculator.jsx"));
const ScholarshipMap     = lazy(() => import("./components/ScholarshipMap.jsx"));
const PeerReview         = lazy(() => import("./components/PeerReview.jsx"));
const WhatsAppReminders  = lazy(() => import("./components/WhatsAppReminders.jsx"));
const MicroChallenges    = lazy(() => import("./components/MicroChallenges.jsx"));
const MentorNetwork      = lazy(() => import("./components/MentorNetwork.jsx"));
const ScholarshipImporter = lazy(() => import("./components/ScholarshipImporter.jsx"));

const NAV = [
  { id: "dashboard",    label: "Dashboard",        icon: "🏠" },
  { id: "scholarships", label: "Scholarships",      icon: "🎓" },
  { id: "tracker",      label: "My Applications",  icon: "📋" },
  { id: "ai_tools",     label: "AI Tools",         icon: "✨" },
  { id: "community",    label: "Community",        icon: "👥" },
  { id: "tools",        label: "Tools",            icon: "🛠️" },
];

const AI_SUB   = ["sop","interview","analyser","ocr","scholarbot"];
const COM_SUB  = ["peer_review","mentors","challenges"];
const TOOL_SUB = ["calculator","map","calendar","documents","whatsapp","importer"];

// ── Loading fallback for lazy components ─────────────────────
function LazyFallback() {
  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", padding: "60px 20px" }}>
      <div style={{ textAlign: "center" }}>
        <div className="loading-dots" style={{ justifyContent: "center", marginBottom: 16 }}>
          <span className="dot" /><span className="dot" /><span className="dot" />
        </div>
        <p style={{ color: "var(--gray-500)", fontSize: 14, fontWeight: 500 }}>Loading...</p>
      </div>
    </div>
  );
}

// ── Streak Tracker ───────────────────────────────────────────
function useStreak() {
  const STREAK_KEY = "scholarhub_streak";
  const [streak, setStreak] = useState(0);

  useEffect(() => {
    try {
      const data = JSON.parse(localStorage.getItem(STREAK_KEY) || '{}');
      const today = new Date().toDateString();
      const yesterday = new Date(Date.now() - 86400000).toDateString();

      if (data.lastVisit === today) {
        setStreak(data.streak || 1);
      } else if (data.lastVisit === yesterday) {
        const newStreak = (data.streak || 0) + 1;
        localStorage.setItem(STREAK_KEY, JSON.stringify({ lastVisit: today, streak: newStreak }));
        setStreak(newStreak);
      } else {
        localStorage.setItem(STREAK_KEY, JSON.stringify({ lastVisit: today, streak: 1 }));
        setStreak(1);
      }
    } catch {
      setStreak(1);
    }
  }, []);

  return streak;
}

// ── CSV Export Helper ────────────────────────────────────────
function exportTrackerCSV(tracker, scholarships) {
  const headers = ["Scholarship", "Provider", "Stage", "Amount", "Deadline", "Note"];
  const rows = tracker.map(t => {
    const s = scholarships.find(x => x.id === t.scholarshipId);
    return [
      s?.name || "Unknown",
      s?.provider || "",
      t.stage,
      s?.amount || "",
      s?.deadline || "",
      (t.note || "").replace(/"/g, '""'),
    ].map(v => `"${v}"`).join(",");
  });
  const csv = [headers.join(","), ...rows].join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `scholarhub_applications_${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}


// ── Inner app — only rendered when user is logged in ─────────
function AppShell() {
  const { user, profile, signOut } = useAuth();
  const { lang, switchLang, t } = useTranslation();
  const { isDark, toggleTheme } = useTheme();
  const streak = useStreak();

  // Real data from Supabase (falls back to local data if DB not configured)
  const { scholarships, loading: scholLoading } = useScholarships(LOCAL_SCHOLARSHIPS);
  const { saved, toggleSave }               = useSaved();
  const { tracker, setTracker, addToTracker, updateTracker, removeFromTracker } = useTracker();
  const { unreadCount }                     = useNotifications();

  // Onboarding wizard
  const [showOnboarding, setShowOnboarding] = useState(false);

  useEffect(() => {
    if (profile && (profile.profile_complete || 0) < 30 && !localStorage.getItem("scholarhub_onboarding_skipped")) {
      setShowOnboarding(true);
    }
  }, [profile]);

  // Schedule deadline notifications
  useEffect(() => {
    if (scholarships.length && saved.size) {
      scheduleDeadlineNotifications(scholarships, saved);
    }
  }, [scholarships, saved]);

  // UI state
  const [activeTab,    setActiveTab]    = useState("dashboard");
  const [subTab,       setSubTab]       = useState("sop");
  const [viewSchol,    setViewSchol]    = useState(null);
  const [calcSelected, setCalcSelected] = useState(new Set());
  const [sopSchol,     setSopSchol]     = useState(null);
  const [intSchol,     setIntSchol]     = useState(null);

  // Derive display name: saved name → email prefix → "there"
  const emailPrefix = user?.email
    ? user.email.split("@")[0].replace(/[._\-]/g, " ").replace(/\b\w/g, c => c.toUpperCase())
    : "";

  const userForAI = {
    name:              profile?.name             || emailPrefix || "",
    email:             user?.email               || "",
    state:             profile?.state            || "",
    category:          profile?.category         || "",
    level:             profile?.level            || "",
    field:             profile?.field            || "",
    specialisation:    profile?.specialisation   || "",
    college:           profile?.college          || "",
    marks_percent:     profile?.marks_percent    || 0,
    annual_income_lpa: profile?.annual_income_lpa|| 0,
    is_first_gen:      profile?.is_first_gen     ?? false,
    gender:            profile?.gender           || "",
    profile_complete:  profile?.profile_complete || 0,
    goals:             profile?.goals            || "",
    mobile:            profile?.mobile           || "",
    whatsapp_opted_in: profile?.whatsapp_opted_in|| false,
    streak,
  };

  const openSOP = (schol) => {
    setSopSchol(schol); setActiveTab("ai_tools"); setSubTab("sop"); setViewSchol(null);
  };
  const openInterview = (schol) => {
    setIntSchol(schol); setActiveTab("ai_tools"); setSubTab("interview"); setViewSchol(null);
  };
  const handleTrack = async (schol) => {
    await addToTracker(schol.id);
    setViewSchol(null);
    setActiveTab("tracker");
  };

  const navigate = (tab, sub) => { setActiveTab(tab); if (sub) setSubTab(sub); };

  const getSubNav = () => {
    if (activeTab === "ai_tools")  return [
      { id:"sop",        label:"✍️ SOP Generator"      },
      { id:"interview",  label:"🎤 Interview Simulator" },
      { id:"analyser",   label:"🔍 Rejection Analyser"  },
      { id:"ocr",        label:"📷 Document OCR"        },
      { id:"scholarbot", label:"🤖 ScholarBot"          },
    ];
    if (activeTab === "community") return [
      { id:"peer_review", label:"👥 Peer Review"    },
      { id:"mentors",     label:"🏅 Mentor Network" },
      { id:"challenges",  label:"🏆 Micro-Challenges" },
    ];
    if (activeTab === "tools") return [
      { id:"calculator", label:"💰 Aid Calculator"   },
      { id:"map",        label:"🗺️ Scholarship Map"   },
      { id:"calendar",   label:"📅 Calendar"          },
      { id:"documents",  label:"📁 Document Center"  },
      { id:"whatsapp",   label:"📱 WhatsApp Reminders"},
      { id:"importer",   label:"📥 Add Scholarship"   },
    ];
    return null;
  };

  const subNav = getSubNav();
  const safeSubTab = () => {
    if (activeTab === "ai_tools"  && !AI_SUB.includes(subTab))   return "sop";
    if (activeTab === "community" && !COM_SUB.includes(subTab))  return "peer_review";
    if (activeTab === "tools"     && !TOOL_SUB.includes(subTab)) return "calculator";
    return subTab;
  };
  const currentSub = safeSubTab();

  return (
    <div className="app">
      <a href="#main-content" className="skip-link" style={{
        position: "absolute", top: -40, left: 0, background: "var(--primary)", color: "#fff",
        padding: "8px 16px", zIndex: 9999, borderRadius: "0 0 8px 0", fontSize: 14, fontWeight: 600,
        transition: "top 0.2s",
      }}
      onFocus={e => e.target.style.top = "0"}
      onBlur={e => e.target.style.top = "-40px"}>
        Skip to main content
      </a>

      {/* Onboarding Wizard */}
      {showOnboarding && (
        <OnboardingWizard onComplete={() => {
          setShowOnboarding(false);
          localStorage.setItem("scholarhub_onboarding_skipped", "1");
        }} />
      )}

      {/* Topbar */}
      <header className="topbar" role="banner" aria-label="ScholarHub navigation">
        <div className="logo">
          <div className="logo-icon">🎓</div>
          ScholarHub
        </div>

        <nav className="nav-tabs" role="navigation" aria-label="Main navigation">
          {NAV.map(n => {
            const labelKey = `nav.${n.id === "tracker" ? "applications" : n.id}`;
            return (
              <button key={n.id} className={`nav-tab ${activeTab === n.id ? "active" : ""}`}
                aria-current={activeTab === n.id ? "page" : undefined}
                onClick={() => {
                  setActiveTab(n.id);
                  if (n.id === "ai_tools"  && !AI_SUB.includes(subTab))   setSubTab("sop");
                  if (n.id === "community" && !COM_SUB.includes(subTab))  setSubTab("peer_review");
                  if (n.id === "tools"     && !TOOL_SUB.includes(subTab)) setSubTab("calculator");
                }}>
                {n.icon} {t(labelKey)}
              </button>
            );
          })}
        </nav>

        <div className="topbar-right">
          {/* Streak badge */}
          {streak > 1 && (
            <div style={{
              display: "flex", alignItems: "center", gap: 4,
              padding: "4px 10px", borderRadius: 8,
              background: "rgba(249,115,22,0.15)", border: "1px solid rgba(249,115,22,0.25)",
              fontSize: 12, fontWeight: 700, color: "#fb923c",
            }}>
              🔥 {streak}
            </div>
          )}

          {/* Dark mode toggle */}
          <button className="theme-toggle" onClick={toggleTheme} aria-label="Toggle dark mode">
            {isDark ? "☀️" : "🌙"}
          </button>

          {/* Language toggle */}
          <div className="lang-toggle">
            <button className={`lang-btn ${lang === "en" ? "active" : ""}`} onClick={() => switchLang("en")}>EN</button>
            <button className={`lang-btn ${lang === "hi" ? "active" : ""}`} onClick={() => switchLang("hi")}>हिं</button>
          </div>
          <button
            className={`btn btn-ghost btn-sm ${unreadCount > 0 ? "notif-dot" : ""}`}
            style={{ background:"rgba(255,255,255,0.1)", color:"#fff", border:"none", padding:"6px 10px" }}
            aria-label={`Notifications${unreadCount > 0 ? ` — ${unreadCount} unread` : ""}`}
            onClick={() => setActiveTab("notifications")}>
            <span aria-hidden="true">🔔</span>
          </button>
          <div className="user-chip" role="button" tabIndex={0} aria-label="Go to your profile" onClick={() => setActiveTab("profile")} onKeyDown={e => (e.key === "Enter" || e.key === " ") && setActiveTab("profile")}>
            <div className="avatar">{(userForAI.name || "U")[0]}</div>
            <span style={{ maxWidth:100, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>
              {userForAI.name?.split(" ")[0] || t("profile.title")}
            </span>
          </div>
        </div>
      </header>

      {/* Sub-nav */}
      {subNav && (
        <div className="sub-nav">
          <div className="sub-nav-inner" role="tablist">
            {subNav.map(s => (
              <button key={s.id}
                role="tab"
                aria-selected={currentSub === s.id}
                className={`sub-nav-tab ${currentSub === s.id ? "active" : ""}`}
                onClick={() => setSubTab(s.id)}>
                {s.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Pages — wrapped in Error Boundaries + Suspense */}
      <main className="page page-transition" role="main" id="main-content" aria-label="Main content" key={activeTab + currentSub}>
        <ErrorBoundary fallbackMessage="This page encountered an error. Try refreshing or switching to another tab.">
          <Suspense fallback={<LazyFallback />}>
            {activeTab === "dashboard" && (
              <Dashboard scholarships={scholarships} saved={saved} tracker={tracker} user={userForAI} onViewScholar={s => setViewSchol(s)} navigate={navigate} isLoading={scholLoading} onExportCSV={() => exportTrackerCSV(tracker, scholarships)} />
            )}
            {activeTab === "scholarships" && (
              <ScholarshipsPage scholarships={scholarships} saved={saved} user={userForAI} onToggleSave={toggleSave} onView={s => setViewSchol(s)} />
            )}
            {activeTab === "tracker" && (
              <ApplicationTracker tracker={tracker} setTracker={setTracker} scholarships={scholarships}
                onUpdateStage={updateTracker} onRemove={removeFromTracker} onExportCSV={() => exportTrackerCSV(tracker, scholarships)} />
            )}
            {activeTab === "profile"        && <ProfilePage />}
            {activeTab === "notifications"  && <NotificationsPage />}

            {/* AI Tools */}
            {activeTab === "ai_tools" && currentSub === "sop"        && <SOPGenerator       scholarships={scholarships} user={userForAI} saved={saved} initialSchol={sopSchol} />}
            {activeTab === "ai_tools" && currentSub === "interview"  && <InterviewSimulator  scholarships={scholarships} user={userForAI} initialSchol={intSchol} />}
            {activeTab === "ai_tools" && currentSub === "analyser"   && <RejectionAnalyser   scholarships={scholarships} user={userForAI} />}
            {activeTab === "ai_tools" && currentSub === "ocr"        && <DocumentOCR onProfileUpdate={() => {}} />}
            {activeTab === "ai_tools" && currentSub === "scholarbot" && <ScholarBot scholarships={scholarships} saved={saved} user={userForAI} />}

            {/* Community */}
            {activeTab === "community" && currentSub === "peer_review" && <PeerReview    scholarships={scholarships} />}
            {activeTab === "community" && currentSub === "mentors"     && <MentorNetwork scholarships={scholarships} />}
            {activeTab === "community" && currentSub === "challenges"  && <MicroChallenges />}

            {/* Tools */}
            {activeTab === "tools" && currentSub === "calculator" && <AidCalculator    scholarships={scholarships} calcSelected={calcSelected} setCalcSelected={setCalcSelected} />}
            {activeTab === "tools" && currentSub === "map"        && <ScholarshipMap   scholarships={scholarships} saved={saved} onViewScholar={s => setViewSchol(s)} />}
            {activeTab === "tools" && currentSub === "calendar"   && <DeadlineCalendar scholarships={scholarships} saved={saved} />}
            {activeTab === "tools" && currentSub === "documents"  && <DocumentCenter   user={userForAI} />}
            {activeTab === "tools" && currentSub === "whatsapp"   && <WhatsAppReminders scholarships={scholarships} saved={saved} user={userForAI} />}
            {activeTab === "tools" && currentSub === "importer"   && <ScholarshipImporter />}
          </Suspense>
        </ErrorBoundary>
      </main>

      {/* Scholarship detail modal */}
      {viewSchol && (
        <ScholarshipDetail
          schol={viewSchol} onClose={() => setViewSchol(null)}
          saved={saved} onToggleSave={toggleSave}
          onGenerateSOP={openSOP} onInterviewPrep={openInterview}
          onTrack={handleTrack} user={userForAI}
        />
      )}

      <footer className="app-footer">
        <div className="app-footer-brand">
          <div className="app-footer-logo">🎓</div>
          <span className="app-footer-name">ScholarHub</span>
        </div>
        © 2026 ScholarHub · Built with React + Supabase + Gemini AI · Helping every Indian student find the scholarship they deserve
      </footer>

      {/* Mobile Bottom Navigation */}
      <nav className="mobile-nav" role="navigation" aria-label="Mobile navigation">
        {NAV.map(n => (
          <button key={n.id}
            className={`mobile-nav-btn ${activeTab === n.id ? "active" : ""}`}
            onClick={() => {
              setActiveTab(n.id);
              if (n.id === "ai_tools"  && !AI_SUB.includes(subTab))   setSubTab("sop");
              if (n.id === "community" && !COM_SUB.includes(subTab))  setSubTab("peer_review");
              if (n.id === "tools"     && !TOOL_SUB.includes(subTab)) setSubTab("calculator");
            }}>
            <span>{n.icon}</span>
            <span>{t(`nav.${n.id === "tracker" ? "applications" : n.id}`)}</span>
          </button>
        ))}
      </nav>
    </div>
  );
}

// ── Root with auth gate ────────────────────────────────────────
function AuthGate() {
  const { isLoggedIn, loading } = useAuth();
  const [showAuth, setShowAuth] = useState(false);

  if (loading) {
    return (
      <div style={{ minHeight:"100vh", background:"linear-gradient(135deg,#0f172a,#1e3a8a)", display:"flex", alignItems:"center", justifyContent:"center" }}>
        <div style={{ textAlign:"center", color:"#fff" }}>
          <div style={{ fontSize:48, marginBottom:16 }}>🎓</div>
          <p style={{ fontFamily:"'DM Sans','Inter',sans-serif", fontSize:18, fontWeight:600 }}>ScholarHub</p>
          <div className="loading-dots" style={{ justifyContent:"center", marginTop:12 }}>
            <span className="dot"/><span className="dot"/><span className="dot"/>
          </div>
        </div>
      </div>
    );
  }

  if (isLoggedIn) return <AppShell />;
  if (showAuth) return <AuthPage onBack={() => setShowAuth(false)} />;
  return <LandingPage onGetStarted={() => setShowAuth(true)} />;
}

export default function App() {
  return (
    <ThemeProvider>
      <I18nProvider>
        <AuthProvider>
          <ErrorBoundary fallbackMessage="ScholarHub encountered a critical error. Please refresh the page.">
            <AuthGate />
          </ErrorBoundary>
        </AuthProvider>
      </I18nProvider>
    </ThemeProvider>
  );
}
