import { useState, useEffect } from "react";
import { calcMatchScore, daysUntil, deadlineLabel, deadlineClass, matchColor } from "../utils/helpers.js";

// ── Skeleton Loader ──────────────────────────────────────────
function DashboardSkeleton() {
  return (
    <div className="fade-in">
      <div className="skeleton" style={{ height: 180, borderRadius: 20, marginBottom: 28 }} />
      <div className="dash-stats">
        {[1,2,3,4].map(i => <div key={i} className="skeleton" style={{ height: 120, borderRadius: 16 }} />)}
      </div>
      <div className="grid-3 gap-4 mb-6">
        {[1,2,3].map(i => <div key={i} className="skeleton" style={{ height: 240, borderRadius: 16 }} />)}
      </div>
    </div>
  );
}

// ── Application Pipeline Chart ───────────────────────────────
function PipelineChart({ tracker }) {
  const stages = [
    { key: "Drafting", label: "Drafting", color: "#94a3b8" },
    { key: "Applied", label: "Applied", color: "#3b82f6" },
    { key: "Under Review", label: "Under Review", color: "#f59e0b" },
    { key: "Won", label: "Won", color: "#10b981" },
    { key: "Rejected", label: "Rejected", color: "#ef4444" },
  ];
  const total = Math.max(tracker.length, 1);
  const [animate, setAnimate] = useState(false);
  useEffect(() => { const t = setTimeout(() => setAnimate(true), 100); return () => clearTimeout(t); }, []);

  return (
    <div className="chart-bar-wrap">
      {stages.map(s => {
        const count = tracker.filter(t => t.stage === s.key).length;
        const pct = (count / total) * 100;
        return (
          <div key={s.key} className="chart-bar-row">
            <span className="chart-bar-label">{s.label}</span>
            <div className="chart-bar-track">
              <div className="chart-bar-fill" style={{
                width: animate ? `${Math.max(pct, count > 0 ? 12 : 0)}%` : "0%",
                background: s.color,
              }}>
                {count > 0 && count}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ── Match Distribution Donut ─────────────────────────────────
function MatchDonut({ scholarships, user }) {
  const scored = scholarships.map(s => calcMatchScore(s, user));
  const high = scored.filter(s => s >= 80).length;
  const mid = scored.filter(s => s >= 60 && s < 80).length;
  const low = scored.filter(s => s < 60).length;
  const total = Math.max(scored.length, 1);

  const segments = [
    { label: "80%+ match", count: high, color: "#10b981", pct: (high / total) * 100 },
    { label: "60-79%", count: mid, color: "#f59e0b", pct: (mid / total) * 100 },
    { label: "Below 60%", count: low, color: "#94a3b8", pct: (low / total) * 100 },
  ];

  let acc = 0;
  const stops = segments.map(s => {
    const start = acc;
    acc += s.pct;
    return `${s.color} ${start}% ${acc}%`;
  }).join(", ");

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
      <div className="chart-donut" style={{ background: `conic-gradient(${stops})`, width: 100, height: 100 }}>
        <div className="chart-donut-center" style={{ fontSize: 24, fontWeight: 900 }}>{scored.length}</div>
      </div>
      <div className="chart-legend">
        {segments.map(s => (
          <div key={s.label} className="chart-legend-item">
            <div className="chart-legend-dot" style={{ background: s.color }} />
            <span style={{ fontSize: 12 }}><strong>{s.count}</strong> {s.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Deadline Timeline ────────────────────────────────────────
function DeadlineTimeline({ scholarships, saved }) {
  const upcoming = scholarships
    .filter(s => saved.has(s.id) && daysUntil(s.deadline) >= 0)
    .sort((a, b) => daysUntil(a.deadline) - daysUntil(b.deadline))
    .slice(0, 4);

  if (!upcoming.length) return <p className="text-sm text-muted" style={{ textAlign: "center", padding: 24 }}>No upcoming deadlines</p>;

  return (
    <div className="timeline-vis">
      {upcoming.map(s => {
        const d = daysUntil(s.deadline);
        const color = d <= 7 ? "#ef4444" : d <= 30 ? "#f59e0b" : "#10b981";
        return (
          <div key={s.id} className="timeline-vis-item">
            <div className="timeline-vis-dot" style={{ background: color }} />
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: "var(--navy)" }}>{s.name}</div>
              <div style={{ fontSize: 11, color: "var(--gray-500)", marginTop: 2 }}>
                {deadlineLabel(s.deadline)} · {s.amount}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ── Main Dashboard ───────────────────────────────────────────
export default function Dashboard({ scholarships, saved, tracker, user, onViewScholar, navigate, isLoading }) {
  if (isLoading) return <DashboardSkeleton />;

  const interactionHistory = getInteractionHistory();
  const recommended = scholarships
    .map(s => {
      let score = calcMatchScore(s, user);
      if (user.profile_complete >= 80) score = Math.min(score + 5, 100);
      if (saved.size > 0) {
        const savedSchols = scholarships.filter(x => saved.has(x.id));
        const sameField = savedSchols.some(x => x.field === s.field);
        const sameCategory = savedSchols.some(x => x.categories?.some?.(c => s.categories?.includes?.(c)));
        if (sameField) score = Math.min(score + 5, 100);
        if (sameCategory) score = Math.min(score + 3, 100);
      }
      if (interactionHistory.dismissed?.includes(s.id)) score = Math.max(score - 15, 0);
      return { ...s, score };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, 5);

  const urgent = scholarships
    .filter(s => saved.has(s.id) && daysUntil(s.deadline) <= 30 && daysUntil(s.deadline) >= 0)
    .sort((a, b) => daysUntil(a.deadline) - daysUntil(b.deadline))
    .slice(0, 3);

  const stats = [
    { icon: "🔖", label: "Saved",    value: saved.size,            color: "var(--primary)", bg: "var(--primary-pale)" },
    { icon: "📋", label: "Tracking", value: tracker.length,        color: "var(--primary-dark)", bg: "var(--primary-pale)" },
    { icon: "✅", label: "Applied",  value: tracker.filter(t => ["Applied","Under Review","Result Pending","Won","Rejected"].includes(t.stage)).length, color: "var(--primary)", bg: "var(--primary-pale)" },
    { icon: "🏆", label: "Won",      value: tracker.filter(t => t.stage === "Won").length, color: "var(--accent)", bg: "var(--accent-pale)" },
  ];

  const QUICK_ACTIONS = [
    { icon: "✍️", label: "Generate SOP",     desc: "AI-powered in 30s",   tab: "ai_tools",     sub: "sop",        color: "var(--primary)", bg: "var(--primary-pale)" },
    { icon: "🎤", label: "Interview Prep",   desc: "Practice with AI",     tab: "ai_tools",     sub: "interview",  color: "var(--accent)",  bg: "var(--accent-pale)" },
    { icon: "🔍", label: "Browse All",       desc: "Explore listings",     tab: "scholarships", sub: null,         color: "var(--primary)", bg: "var(--primary-pale)" },
    { icon: "💰", label: "Aid Calculator",   desc: "Stack funds",          tab: "tools",        sub: "calculator", color: "var(--accent)",  bg: "var(--accent-pale)" },
    { icon: "🗺️", label: "Explore Map",      desc: "State-wise view",      tab: "tools",        sub: "map",        color: "var(--primary)", bg: "var(--primary-pale)" },
    { icon: "🤖", label: "ScholarBot",       desc: "AI Assistant",         tab: "ai_tools",     sub: "scholarbot", color: "var(--primary)", bg: "var(--primary-pale)" },
  ];

  return (
    <div className="fade-in">
      {/* Hero */}
      <div className="dash-hero">
        <div className="dash-hero-content">
          <div className="dash-hero-greeting">👋 Welcome back, {user.name?.split(" ")[0] || "Scholar"}</div>
          <h1 className="dash-hero-title">Your Future Starts Here.</h1>
          <p className="dash-hero-desc">
            Manage your applications, generate SOPs with AI, and track upcoming deadlines all in one place.
          </p>
          <div className="dash-hero-chips">
            <div className="dash-hero-chip">🔖 <strong>{saved.size}</strong> Saved</div>
            <div className="dash-hero-chip">🔥 <strong>{urgent.length}</strong> Urgent</div>
          </div>
          {user.profile_complete < 100 && (
            <div className="dash-hero-progress">
              <span>Profile <strong>{user.profile_complete}%</strong> Complete</span>
              <div className="dash-hero-progress-bar">
                <div className="dash-hero-progress-fill" style={{ width: `${user.profile_complete}%` }} />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Stats */}
      <div className="dash-stats">
        {stats.map(s => (
          <div key={s.label} className="dash-stat">
            <div className="dash-stat-icon" style={{ background: s.bg }}>{s.icon}</div>
            <div className="dash-stat-value" style={{ color: s.color }}>{s.value}</div>
            <div className="dash-stat-label">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid-3 mb-6 gap-4">
        <div className="dash-card">
          <h2 className="dash-section-title">
            <div className="icon-badge" style={{ background: "#eff6ff", color: "#3b82f6" }}>📊</div>
            Pipeline
          </h2>
          <PipelineChart tracker={tracker} />
        </div>
        <div className="dash-card">
          <h2 className="dash-section-title">
            <div className="icon-badge" style={{ background: "#ecfdf5", color: "#10b981" }}>🎯</div>
            Matches
          </h2>
          <MatchDonut scholarships={scholarships} user={user} />
        </div>
        <div className="dash-card">
          <h2 className="dash-section-title">
            <div className="icon-badge" style={{ background: "#fff7ed", color: "#f59e0b" }}>📅</div>
            Deadlines
          </h2>
          <DeadlineTimeline scholarships={scholarships} saved={saved} />
        </div>
      </div>

      {/* Bottom Grid */}
      <div className="grid-2 gap-6">
        {/* Urgent Deadlines */}
        <section>
          <div className="dash-section-title">
            <div className="icon-badge" style={{ background: "#fef2f2", color: "#ef4444" }}>⏰</div>
            Urgent Deadlines
            <span className="badge badge-red">{urgent.length}</span>
          </div>
          {urgent.length === 0 ? (
            <div className="dash-card" style={{ textAlign: "center", padding: "40px 20px" }}>
              <div style={{ fontSize: 32, marginBottom: 8 }}>🎉</div>
              <p className="text-sm text-muted">No urgent deadlines. Good job!</p>
            </div>
          ) : (
            urgent.map(s => (
              <div key={s.id} className="dash-deadline" onClick={() => onViewScholar(s)}>
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-sm" style={{ color: "var(--navy)" }}>{s.name}</span>
                  <span className={deadlineClass(s.deadline)} style={{ fontSize: 10, padding: "2px 8px" }}>
                    {deadlineLabel(s.deadline)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted">{s.provider}</span>
                  <span style={{ fontWeight: 800, color: "#059669", fontSize: 13 }}>{s.amount}</span>
                </div>
              </div>
            ))
          )}
        </section>

        {/* Top Recommendations */}
        <section>
          <div className="dash-section-title">
            <div className="icon-badge" style={{ background: "#eff6ff", color: "#3b82f6" }}>🎯</div>
            Top Recommendations
            <span className="badge badge-blue">AI Choice</span>
          </div>
          {recommended.map(s => {
            const mc = matchColor(s.score);
            return (
              <div key={s.id} className="dash-match" onClick={() => onViewScholar(s)}>
                <div className="flex items-center gap-3">
                  <div className="match-ring" style={{ borderColor: mc.border, color: mc.color, width: 36, height: 36, fontSize: 11, fontWeight: 800 }}>
                    {s.score}%
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div className="font-bold text-sm" style={{ color: "var(--navy)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{s.name}</div>
                    <div className="text-xs text-muted">{s.provider}</div>
                  </div>
                  <div style={{ fontWeight: 800, color: "#059669", fontSize: 13, flexShrink: 0 }}>{s.amount?.split("–")?.[0]}</div>
                </div>
              </div>
            );
          })}
        </section>
      </div>

      {/* Quick Actions */}
      <section className="mt-8 mb-8">
        <h2 className="dash-section-title">
          <div className="icon-badge" style={{ background: "#f5f3ff", color: "#7c3aed" }}>⚡</div>
          Quick Actions
        </h2>
        <div className="dash-actions">
          {QUICK_ACTIONS.map(a => (
            <div key={a.label} className="dash-action" onClick={() => navigate && navigate(a.tab, a.sub)}>
              <div className="dash-action-icon" style={{ background: a.bg }}>{a.icon}</div>
              <div className="dash-action-title">{a.label}</div>
              <div className="dash-action-desc">{a.desc}</div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

function getInteractionHistory() {
  try {
    return JSON.parse(localStorage.getItem("scholarhub_interactions") || '{"viewed":[],"dismissed":[]}');
  } catch {
    return { viewed: [], dismissed: [] };
  }
}
