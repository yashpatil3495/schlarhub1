import { useState, useMemo, useEffect } from "react";
import { calcMatchScore, deadlineClass, deadlineLabel, matchColor, typeBadge, difficultyBadge, daysUntil } from "../utils/helpers.js";

// Debounce hook for search performance
function useDebouncedValue(value, delay = 300) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);
  return debounced;
}

export default function ScholarshipsPage({ scholarships, saved, onToggleSave, onView, user }) {
  const [rawQuery, setRawQuery]   = useState("");
  const query = useDebouncedValue(rawQuery, 300);
  const [filterType, setFT]     = useState("all");
  const [filterField, setFF]    = useState("all");
  const [filterCat, setFC]      = useState("all");
  const [filterState, setFS]    = useState("all");
  const [filterDeadline, setFD] = useState("all");
  const [sortBy, setSortBy]     = useState("match");
  const [activeTab, setTab]     = useState("all");

  const scored = useMemo(() =>
    scholarships.map(s => ({ ...s, score: calcMatchScore(s, user) })),
    [scholarships, user]
  );

  const applyFilters = (list) => {
    if (query) {
      const q = query.toLowerCase();
      list = list.filter(s =>
        s.name.toLowerCase().includes(q) ||
        s.provider.toLowerCase().includes(q) ||
        s.eligibility_summary.toLowerCase().includes(q) ||
        s.tags.some(t => t.includes(q))
      );
    }
    if (filterType  !== "all") list = list.filter(s => s.type === filterType);
    if (filterField !== "all") list = list.filter(s => s.field.includes(filterField));
    if (filterCat   !== "all") list = list.filter(s => s.categories.includes(filterCat));
    if (filterState !== "all") list = list.filter(s => s.states.includes("all") || s.states.includes(filterState));
    if (filterDeadline !== "all") {
      const days = parseInt(filterDeadline);
      list = list.filter(s => daysUntil(s.deadline) <= days && daysUntil(s.deadline) >= 0);
    }
    list.sort((a, b) => {
      if (sortBy === "match")    return b.score - a.score;
      if (sortBy === "deadline") return daysUntil(a.deadline) - daysUntil(b.deadline);
      if (sortBy === "amount")   return b.amount_value - a.amount_value;
      if (sortBy === "success")  return b.success_rate_estimate - a.success_rate_estimate;
      return 0;
    });
    return list;
  };

  const govtSchemes  = useMemo(() => applyFilters(scored.filter(s => s.type === "government")),
    [scored, query, filterField, filterCat, filterState, filterDeadline, sortBy]);
  const otherSchols  = useMemo(() => applyFilters(scored.filter(s => s.type !== "government")),
    [scored, query, filterField, filterCat, filterState, filterDeadline, sortBy]);
  const allFiltered  = useMemo(() => applyFilters(scored),
    [scored, query, filterType, filterField, filterCat, filterState, filterDeadline, sortBy]);

  const liveGovt   = govtSchemes.filter(s => daysUntil(s.deadline) >= 0).length;
  const hasFilters = query || filterType !== "all" || filterField !== "all" || filterCat !== "all" || filterState !== "all" || filterDeadline !== "all";

  const selectStyle = { padding: "10px 14px", border: "1.5px solid var(--gray-200)", borderRadius: "12px", fontSize: 13, cursor: "pointer", background: "#fff", outline: "none", transition: "all 0.2s" };

  return (
    <div className="fade-in">
      <div className="flex items-center justify-between mb-6 scholars-header">
        <div>
          <h1 className="dash-section-title" style={{ fontSize: 24, marginBottom: 4 }}>
            <div className="icon-badge" style={{ background: "#eff6ff", color: "#3b82f6", width: 36, height: 36 }}>🎓</div>
            Scholarships & Govt Schemes
          </h1>
          <p style={{ color: "var(--gray-500)", fontSize: 14 }}>
            Explore {govtSchemes.length} government schemes and {otherSchols.length} private opportunities
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs font-bold text-muted uppercase">Sort By</span>
          <select style={selectStyle} value={sortBy} onChange={e => setSortBy(e.target.value)}>
            <option value="match">Best Match</option>
            <option value="deadline">Soonest Deadline</option>
            <option value="amount">Highest Amount</option>
            <option value="success">Success Rate</option>
          </select>
        </div>
      </div>

      {/* Pill switcher */}
      <div className="pill-tabs">
        <button className={`pill-tab ${activeTab === "all" ? "active" : ""}`} onClick={() => setTab("all")}>All Opportunities</button>
        <button className={`pill-tab ${activeTab === "govt" ? "active" : ""}`} onClick={() => setTab("govt")}>🏛️ Govt Schemes</button>
        <button className={`pill-tab ${activeTab === "private" ? "active" : ""}`} onClick={() => setTab("private")}>🏢 Private & NGOs</button>
      </div>

      {/* Filters */}
      <div className="filter-glass">
        <div className="search-box" style={{ flex: "1 1 300px" }}>
          <span className="search-icon">🔍</span>
          <input className="input" value={rawQuery} onChange={e => setRawQuery(e.target.value)} placeholder="Search name, provider, or eligibility…" style={{ borderRadius: 12 }} />
        </div>
        
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap", flex: 1 }}>
          {activeTab === "all" && (
            <select style={selectStyle} value={filterType} onChange={e => setFT(e.target.value)}>
              <option value="all">All Types</option>
              <option value="government">Government</option>
              <option value="private">Private</option>
              <option value="ngo">NGO</option>
            </select>
          )}
          <select style={selectStyle} value={filterField} onChange={e => setFF(e.target.value)}>
            <option value="all">Field: All</option>
            {["engineering","medical","science","arts","commerce","law","management"].map(f =>
              <option key={f} value={f}>{f.charAt(0).toUpperCase()+f.slice(1)}</option>
            )}
          </select>
          <select style={selectStyle} value={filterCat} onChange={e => setFC(e.target.value)}>
            <option value="all">Category: All</option>
            {["general","obc","sc","st","ews","minority","women","disabled","sports"].map(c =>
              <option key={c} value={c}>{c.toUpperCase()}</option>
            )}
          </select>
          <select style={selectStyle} value={filterState} onChange={e => setFS(e.target.value)}>
            <option value="all">State: All</option>
            {["Maharashtra","Delhi","Karnataka","Tamil Nadu","Uttar Pradesh","Gujarat","Rajasthan","West Bengal"].map(s =>
              <option key={s} value={s}>{s}</option>
            )}
          </select>
          <select style={selectStyle} value={filterDeadline} onChange={e => setFD(e.target.value)}>
            <option value="all">Any Deadline</option>
            <option value="7">Within 7 days</option>
            <option value="30">Within 30 days</option>
          </select>
        </div>

        {hasFilters && (
          <button className="btn btn-ghost btn-sm" style={{ color: "var(--danger)", fontWeight: 700 }} onClick={() => { setQuery(""); setFT("all"); setFF("all"); setFC("all"); setFS("all"); setFD("all"); }}>
            ✕ Clear
          </button>
        )}
      </div>

      {/* Content Rendering */}
      <div className="mt-6">
        {activeTab === "all" && (
          allFiltered.length === 0 ? <EmptyState /> : (
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {allFiltered.map(s => <ScholarCard key={s.id} s={s} saved={saved} onToggleSave={onToggleSave} onView={onView} />)}
            </div>
          )
        )}

        {activeTab === "govt" && (
          govtSchemes.length === 0 ? <EmptyState /> : (
            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
              <div style={{ background: "linear-gradient(135deg,#ecfdf5 0%,#d1fae5 100%)", border: "1px solid #6ee7b7", borderRadius: 16, padding: "20px 24px", display: "flex", alignItems: "center", gap: 16 }}>
                <div style={{ fontSize: 32 }}>🇮🇳</div>
                <div>
                  <div style={{ fontWeight: 800, fontSize: 16, color: "#065f46" }}>{liveGovt} Government Schemes Open Now</div>
                  <p style={{ fontSize: 13, color: "#047857", marginTop: 4, opacity: 0.85 }}>
                    Most state and central schemes disburse directly via DBT to your linked bank account.
                  </p>
                </div>
              </div>
              
              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                {govtSchemes.map(s => <ScholarCard key={s.id} s={s} saved={saved} onToggleSave={onToggleSave} onView={onView} govtStyle />)}
              </div>
            </div>
          )
        )}

        {activeTab === "private" && (
          otherSchols.length === 0 ? <EmptyState /> : (
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {otherSchols.map(s => <ScholarCard key={s.id} s={s} saved={saved} onToggleSave={onToggleSave} onView={onView} />)}
            </div>
          )
        )}
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="dash-card" style={{ textAlign: "center", padding: "60px 20px" }}>
      <div style={{ fontSize: 48, marginBottom: 16 }}>🔍</div>
      <h3 style={{ fontWeight: 800, fontSize: 18, color: "var(--navy)" }}>No results found</h3>
      <p style={{ color: "var(--gray-500)", marginTop: 8 }}>Try adjusting your filters or search criteria.</p>
    </div>
  );
}

function ScholarCard({ s, saved, onToggleSave, onView, govtStyle = false }) {
  const mc     = matchColor(s.score);
  const isSaved = saved.has(s.id);
  const isLive  = daysUntil(s.deadline) >= 0;

  return (
    <div className="premium-card" onClick={() => onView(s)} style={govtStyle ? { borderLeft: `5px solid ${isLive ? "#3b82f6" : "#d1d5db"}` } : {}}>
      <div className="flex items-start gap-4">
        <div className="match-ring" style={{ borderColor: mc.border, color: mc.color, width: 44, height: 44, fontSize: 13, fontWeight: 800, flexShrink: 0 }}>
          {s.score}%
        </div>

        <div style={{ flex: 1, minWidth: 0 }}>
          <div className="flex items-center gap-2 mb-2 flex-wrap">
            <h3 style={{ fontSize: 16, fontWeight: 800, color: "var(--navy)", fontFamily: "var(--font-display)" }}>{s.name}</h3>
            <span className={typeBadge(s.type)} style={{ fontSize: 10, padding: "2px 8px" }}>{s.type}</span>
            {isLive && govtStyle && <span className="badge badge-green">LIVE</span>}
          </div>
          
          <div style={{ fontSize: 13, color: "var(--gray-500)", fontWeight: 600, marginBottom: 8 }}>{s.provider}</div>
          
          <p style={{ fontSize: 14, color: "var(--gray-600)", lineHeight: 1.6, marginBottom: 12 }}>
            {s.eligibility_summary}
          </p>

          <div className="flex items-center gap-3 flex-wrap">
            <div className="amount-pill">{s.amount}</div>
            <div style={{
              padding: "4px 10px", borderRadius: 6, fontSize: 12, fontWeight: 700,
              display: "inline-flex", alignItems: "center", gap: 4,
              background: daysUntil(s.deadline) <= 7 ? "#fee2e2" : daysUntil(s.deadline) <= 30 ? "#fff7ed" : "#dcfce7",
              color: daysUntil(s.deadline) <= 7 ? "#991b1b" : daysUntil(s.deadline) <= 30 ? "#854d0e" : "#14532d",
              border: `1px solid ${daysUntil(s.deadline) <= 7 ? "#fca5a5" : daysUntil(s.deadline) <= 30 ? "#fdba74" : "#86efac"}`,
            }}>
              <span>📅</span> {deadlineLabel(s.deadline)}
              {daysUntil(s.deadline) <= 3 && daysUntil(s.deadline) >= 0 && <span style={{ animation: "pulse 1.5s infinite" }}>🔥</span>}
            </div>
            {/* Match score badge */}
            <div style={{
              padding: "3px 10px", borderRadius: 6, fontSize: 11, fontWeight: 800,
              background: s.score >= 80 ? "#dcfce7" : s.score >= 60 ? "#fef3c7" : "#f1f5f9",
              color: s.score >= 80 ? "#14532d" : s.score >= 60 ? "#92400e" : "#64748b",
              border: `1px solid ${s.score >= 80 ? "#86efac" : s.score >= 60 ? "#fde68a" : "#e2e8f0"}`,
            }}>
              {s.score >= 80 ? "🎯 Great Match" : s.score >= 60 ? "👍 Good Match" : "📊 Partial Match"}
            </div>
            <div className="flex gap-1">
              {s.categories.slice(0, 2).map(c => (
                <span key={c} style={{ fontSize: 10, padding: "2px 8px", borderRadius: 6, background: "var(--gray-100)", color: "var(--gray-600)", fontWeight: 700, textTransform: "uppercase" }}>{c}</span>
              ))}
            </div>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 10, alignItems: "flex-end" }}>
          <button
            className={`btn btn-sm ${isSaved ? "btn-primary" : "btn-ghost"}`}
            style={{ borderRadius: 10, minWidth: 90 }}
            onClick={e => { e.stopPropagation(); onToggleSave(s.id); }}
          >
            {isSaved ? "✓ Saved" : "🔖 Save"}
          </button>
          <button className="btn btn-ghost btn-sm" style={{ fontWeight: 700, color: "var(--primary)" }}>
            Details →
          </button>
        </div>
      </div>
    </div>
  );
}
