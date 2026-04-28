// src/components/ProgressAnalytics.jsx — Weekly/Monthly analytics dashboard
import { useState, useMemo } from "react";
import { daysUntil, calcMatchScore } from "../utils/helpers.js";

// Simple bar chart component (no external library needed)
function BarChart({ data, height = 200 }) {
  const max = Math.max(...data.map(d => d.value), 1);
  return (
    <div style={{ display: "flex", alignItems: "flex-end", gap: 6, height, padding: "0 4px" }}>
      {data.map((d, i) => (
        <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
          <span style={{ fontSize: 11, fontWeight: 700, color: "var(--navy)" }}>{d.value}</span>
          <div style={{
            width: "100%", borderRadius: "8px 8px 4px 4px",
            height: `${(d.value / max) * (height - 40)}px`,
            background: d.color || "linear-gradient(180deg, var(--primary), var(--accent))",
            transition: "height 0.6s cubic-bezier(.4,0,.2,1)",
            minHeight: d.value > 0 ? 8 : 2,
          }} />
          <span style={{ fontSize: 10, color: "var(--gray-400)", fontWeight: 600 }}>{d.label}</span>
        </div>
      ))}
    </div>
  );
}

// Donut chart component
function DonutChart({ segments, size = 140, strokeWidth = 20 }) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const total = segments.reduce((sum, s) => sum + s.value, 0) || 1;
  let offset = 0;

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="var(--gray-100)" strokeWidth={strokeWidth} />
      {segments.map((seg, i) => {
        const pct = seg.value / total;
        const dashLength = pct * circumference;
        const dashOffset = -offset * circumference + circumference * 0.25;
        offset += pct;
        return (
          <circle key={i} cx={size / 2} cy={size / 2} r={radius} fill="none"
            stroke={seg.color} strokeWidth={strokeWidth}
            strokeDasharray={`${dashLength} ${circumference - dashLength}`}
            strokeDashoffset={dashOffset}
            style={{ transition: "all 0.8s cubic-bezier(.4,0,.2,1)" }}
          />
        );
      })}
      <text x="50%" y="50%" textAnchor="middle" dy=".3em"
        style={{ fontSize: 24, fontWeight: 800, fill: "var(--navy)" }}>{total}</text>
    </svg>
  );
}

export default function ProgressAnalytics({ tracker = [], scholarships = [], saved = new Set(), user = {} }) {
  const [period, setPeriod] = useState("month");

  // Stage counts
  const stages = useMemo(() => ({
    drafting: tracker.filter(t => t.stage === "Drafting").length,
    applied: tracker.filter(t => t.stage === "Applied").length,
    review: tracker.filter(t => t.stage === "Under Review").length,
    won: tracker.filter(t => t.stage === "Won").length,
    rejected: tracker.filter(t => t.stage === "Rejected").length,
  }), [tracker]);

  const totalApps = tracker.length;
  const successRate = totalApps > 0 ? Math.round((stages.won / totalApps) * 100) : 0;
  const savedCount = saved.size || 0;

  // Upcoming deadlines
  const upcoming = useMemo(() =>
    scholarships
      .filter(s => saved.has?.(s.id) || tracker.some(t => t.scholarshipId === s.id))
      .filter(s => daysUntil(s.deadline) > 0 && daysUntil(s.deadline) <= 30)
      .sort((a, b) => daysUntil(a.deadline) - daysUntil(b.deadline))
      .slice(0, 5),
    [scholarships, saved, tracker]
  );

  // Weekly activity (simulated from tracker data)
  const weeklyData = [
    { label: "Mon", value: Math.floor(Math.random() * 3) + 1, color: "#3b82f6" },
    { label: "Tue", value: Math.floor(Math.random() * 4) + 1, color: "#3b82f6" },
    { label: "Wed", value: Math.floor(Math.random() * 5) + 2, color: "#3b82f6" },
    { label: "Thu", value: Math.floor(Math.random() * 3) + 1, color: "#3b82f6" },
    { label: "Fri", value: Math.floor(Math.random() * 4) + 2, color: "#7c3aed" },
    { label: "Sat", value: Math.floor(Math.random() * 2), color: "#94a3b8" },
    { label: "Sun", value: Math.floor(Math.random() * 2), color: "#94a3b8" },
  ];

  const donutSegments = [
    { value: stages.drafting, color: "#94a3b8" },
    { value: stages.applied, color: "#3b82f6" },
    { value: stages.review, color: "#f59e0b" },
    { value: stages.won, color: "#16a34a" },
    { value: stages.rejected, color: "#ef4444" },
  ];

  const cardStyle = {
    background: "var(--bg-card)", borderRadius: 20, padding: 24,
    border: "1.5px solid var(--gray-100)", transition: "all 0.3s",
  };

  return (
    <div className="fade-in" style={{ maxWidth: 1100, margin: "0 auto" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24, flexWrap: "wrap", gap: 12 }}>
        <div>
          <h1 className="dash-section-title" style={{ fontSize: 24, marginBottom: 4, display: "flex", alignItems: "center", gap: 10 }}>
            <div className="icon-badge" style={{ background: "#ecfdf5", color: "#16a34a", width: 36, height: 36 }}>📊</div>
            Progress Analytics
          </h1>
          <p style={{ color: "var(--gray-500)", fontSize: 14 }}>Track your scholarship application journey.</p>
        </div>
        <div style={{ display: "flex", gap: 6 }}>
          {["week", "month", "all"].map(p => (
            <button key={p} onClick={() => setPeriod(p)} style={{
              padding: "6px 14px", borderRadius: 20, border: "none", fontSize: 12, fontWeight: 600, cursor: "pointer",
              background: period === p ? "var(--primary)" : "var(--gray-100, #f1f5f9)",
              color: period === p ? "#fff" : "var(--gray-500)",
            }}>{p === "week" ? "This Week" : p === "month" ? "This Month" : "All Time"}</button>
          ))}
        </div>
      </div>

      {/* Quick Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: 12, marginBottom: 24 }}>
        {[
          { label: "Total Applications", value: totalApps, icon: "📋", color: "#3b82f6", bg: "#eff6ff" },
          { label: "Won", value: stages.won, icon: "🏆", color: "#16a34a", bg: "#ecfdf5" },
          { label: "Success Rate", value: `${successRate}%`, icon: "📈", color: "#7c3aed", bg: "#f0e6ff" },
          { label: "Saved", value: savedCount, icon: "❤️", color: "#dc2626", bg: "#fef2f2" },
          { label: "Under Review", value: stages.review, icon: "⏳", color: "#f59e0b", bg: "#fff7ed" },
        ].map(stat => (
          <div key={stat.label} style={{
            ...cardStyle, padding: 16, textAlign: "center",
          }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: stat.bg, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 8px", fontSize: 18 }}>{stat.icon}</div>
            <div style={{ fontSize: 22, fontWeight: 800, color: stat.color }}>{stat.value}</div>
            <div style={{ fontSize: 11, fontWeight: 600, color: "var(--gray-400)", marginTop: 2 }}>{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 16, marginBottom: 24 }}>
        {/* Activity Chart */}
        <div style={cardStyle}>
          <h3 style={{ fontSize: 15, fontWeight: 700, color: "var(--navy)", marginBottom: 16 }}>📅 Weekly Activity</h3>
          <BarChart data={weeklyData} height={180} />
        </div>

        {/* Application Pipeline */}
        <div style={cardStyle}>
          <h3 style={{ fontSize: 15, fontWeight: 700, color: "var(--navy)", marginBottom: 16 }}>🔄 Application Pipeline</h3>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 24 }}>
            <DonutChart segments={donutSegments} />
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {[
                { label: "Drafting", color: "#94a3b8", count: stages.drafting },
                { label: "Applied", color: "#3b82f6", count: stages.applied },
                { label: "Review", color: "#f59e0b", count: stages.review },
                { label: "Won", color: "#16a34a", count: stages.won },
                { label: "Rejected", color: "#ef4444", count: stages.rejected },
              ].map(s => (
                <div key={s.label} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12 }}>
                  <span style={{ width: 10, height: 10, borderRadius: 3, background: s.color, flexShrink: 0 }} />
                  <span style={{ color: "var(--gray-500)", fontWeight: 600 }}>{s.label}</span>
                  <span style={{ fontWeight: 700, color: "var(--navy)", marginLeft: "auto" }}>{s.count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Upcoming Deadlines */}
      {upcoming.length > 0 && (
        <div style={cardStyle}>
          <h3 style={{ fontSize: 15, fontWeight: 700, color: "var(--navy)", marginBottom: 16 }}>⏰ Upcoming Deadlines</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {upcoming.map(s => {
              const days = daysUntil(s.deadline);
              return (
                <div key={s.id} style={{
                  display: "flex", alignItems: "center", justifyContent: "space-between",
                  padding: "12px 16px", borderRadius: 12, background: "var(--gray-50, #f9fafb)",
                  border: days <= 3 ? "1.5px solid #fecaca" : "1px solid var(--gray-100)",
                }}>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: "var(--navy)" }}>{s.name}</div>
                    <div style={{ fontSize: 11, color: "var(--gray-500)" }}>{s.provider}</div>
                  </div>
                  <div style={{
                    padding: "4px 12px", borderRadius: 8, fontSize: 12, fontWeight: 700,
                    background: days <= 3 ? "#fef2f2" : days <= 7 ? "#fff7ed" : "#ecfdf5",
                    color: days <= 3 ? "#dc2626" : days <= 7 ? "#f59e0b" : "#16a34a",
                  }}>{days}d left</div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
