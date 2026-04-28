// src/components/ScholarshipCompare.jsx — AI-powered side-by-side comparison
import { useState, useMemo } from "react";
import { calcMatchScore, daysUntil, deadlineLabel, matchColor } from "../utils/helpers.js";
import { askAI } from "../utils/claude.js";

export default function ScholarshipCompare({ scholarships, user, onView }) {
  const [selected, setSelected] = useState([]);
  const [aiAdvice, setAiAdvice] = useState("");
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const scored = useMemo(() =>
    scholarships.map(s => ({ ...s, score: calcMatchScore(s, user) }))
      .sort((a, b) => b.score - a.score),
    [scholarships, user]
  );

  const filtered = searchQuery
    ? scored.filter(s => s.name.toLowerCase().includes(searchQuery.toLowerCase()) || s.provider.toLowerCase().includes(searchQuery.toLowerCase()))
    : scored.slice(0, 20);

  const toggleSelect = (s) => {
    setSelected(prev => {
      if (prev.find(x => x.id === s.id)) return prev.filter(x => x.id !== s.id);
      if (prev.length >= 3) return prev;
      return [...prev, s];
    });
    setAiAdvice("");
  };

  const getAiRecommendation = async () => {
    if (selected.length < 2) return;
    setLoading(true);
    setAiAdvice("");
    try {
      const comparison = selected.map(s => ({
        name: s.name,
        provider: s.provider,
        amount: s.amount,
        deadline: s.deadline,
        matchScore: s.score,
        successRate: s.success_rate_estimate || "N/A",
        type: s.type,
        eligibility: s.eligibility_summary,
      }));

      const prompt = `Compare these ${selected.length} Indian scholarships and recommend which one the student should apply to FIRST. Consider effort-to-reward ratio, deadline proximity, match score, and success rate.

Student Profile:
- State: ${user.state || "Not specified"}
- Category: ${user.category || "Not specified"}
- Field: ${user.field || "Not specified"}
- Income: ${user.annual_income_lpa || "Not specified"} LPA

Scholarships to Compare:
${JSON.stringify(comparison, null, 2)}

Provide a brief but insightful comparison with:
1. A clear recommendation (which to apply first)
2. Effort-to-reward analysis for each
3. Key advantages/disadvantages of each
4. Strategic application order

Keep it concise (under 200 words). Use bullet points.`;

      const response = await askAI(prompt, "You are an expert Indian scholarship advisor. Give strategic, actionable advice.");
      setAiAdvice(response);
    } catch (err) {
      setAiAdvice("⚠️ Could not get AI recommendation. Please try again.");
    }
    setLoading(false);
  };

  const cardStyle = (isSelected) => ({
    background: isSelected ? "linear-gradient(135deg, rgba(26,86,219,0.08), rgba(124,58,237,0.08))" : "var(--bg-card)",
    border: `2px solid ${isSelected ? "var(--primary)" : "var(--gray-200)"}`,
    borderRadius: 16, padding: 16, cursor: "pointer",
    transition: "all 0.25s cubic-bezier(.4,0,.2,1)",
    position: "relative",
  });

  return (
    <div className="fade-in" style={{ maxWidth: 1100, margin: "0 auto" }}>
      <div style={{ marginBottom: 24 }}>
        <h1 className="dash-section-title" style={{ fontSize: 24, marginBottom: 4, display: "flex", alignItems: "center", gap: 10 }}>
          <div className="icon-badge" style={{ background: "#f0e6ff", color: "#7c3aed", width: 36, height: 36 }}>⚖️</div>
          Scholarship Comparison Tool
        </h1>
        <p style={{ color: "var(--gray-500)", fontSize: 14 }}>
          Select 2-3 scholarships to compare side-by-side with AI-powered recommendations.
        </p>
      </div>

      {/* Search + Selection Area */}
      <div style={{ display: "flex", gap: 12, marginBottom: 20, flexWrap: "wrap" }}>
        <div style={{ flex: "1 1 300px", position: "relative" }}>
          <span style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", fontSize: 16 }}>🔍</span>
          <input
            className="input"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search scholarships to compare..."
            style={{ paddingLeft: 36, borderRadius: 12, width: "100%", boxSizing: "border-box" }}
          />
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 13, color: "var(--gray-500)", fontWeight: 600 }}>
            {selected.length}/3 selected
          </span>
          {selected.length > 0 && (
            <button onClick={() => { setSelected([]); setAiAdvice(""); }} style={{
              background: "none", border: "1px solid var(--gray-300)", borderRadius: 8,
              padding: "6px 12px", fontSize: 12, cursor: "pointer", color: "var(--gray-500)",
            }}>Clear</button>
          )}
        </div>
      </div>

      {/* Quick Select Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 12, marginBottom: 24 }}>
        {filtered.map(s => {
          const isSelected = selected.find(x => x.id === s.id);
          return (
            <div key={s.id} style={cardStyle(isSelected)} onClick={() => toggleSelect(s)}
              onMouseEnter={e => { if (!isSelected) e.currentTarget.style.borderColor = "var(--primary)"; e.currentTarget.style.transform = "translateY(-2px)"; }}
              onMouseLeave={e => { if (!isSelected) e.currentTarget.style.borderColor = "var(--gray-200)"; e.currentTarget.style.transform = "none"; }}>
              {isSelected && (
                <div style={{
                  position: "absolute", top: 8, right: 8, width: 24, height: 24,
                  borderRadius: "50%", background: "var(--primary)", color: "#fff",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 12, fontWeight: 700,
                }}>{selected.indexOf(s) + 1}</div>
              )}
              <div style={{ fontSize: 14, fontWeight: 700, color: "var(--navy)", marginBottom: 4, paddingRight: 30 }}>{s.name}</div>
              <div style={{ fontSize: 12, color: "var(--gray-500)", marginBottom: 8 }}>{s.provider}</div>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                <span style={{ fontSize: 11, fontWeight: 700, background: matchColor(s.score).color + "18", color: matchColor(s.score).color, padding: "2px 8px", borderRadius: 6 }}>{s.score}% match</span>
                <span style={{ fontSize: 11, fontWeight: 600, color: "var(--gray-500)" }}>{s.amount}</span>
                <span style={{ fontSize: 11, fontWeight: 600, color: daysUntil(s.deadline) <= 7 ? "#dc2626" : "var(--gray-500)" }}>{deadlineLabel(s.deadline)}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Comparison Table */}
      {selected.length >= 2 && (
        <div style={{ background: "var(--bg-card)", borderRadius: 20, padding: 24, marginBottom: 24, border: "1.5px solid var(--gray-100)" }}>
          <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 16, color: "var(--navy)" }}>📊 Side-by-Side Comparison</h3>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
              <thead>
                <tr style={{ borderBottom: "2px solid var(--gray-200)" }}>
                  <th style={{ textAlign: "left", padding: "8px 12px", color: "var(--gray-500)", fontWeight: 600, fontSize: 12 }}>Criteria</th>
                  {selected.map(s => (
                    <th key={s.id} style={{ textAlign: "center", padding: "8px 12px", fontWeight: 700, color: "var(--navy)", fontSize: 13 }}>{s.name.length > 25 ? s.name.slice(0, 25) + "…" : s.name}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[
                  { label: "💰 Amount", key: s => s.amount },
                  { label: "🏛️ Provider", key: s => s.provider },
                  { label: "📊 Match Score", key: s => <span style={{ color: matchColor(s.score).color, fontWeight: 700 }}>{s.score}%</span> },
                  { label: "📅 Deadline", key: s => deadlineLabel(s.deadline) },
                  { label: "⏱️ Days Left", key: s => { const d = daysUntil(s.deadline); return <span style={{ color: d <= 7 ? "#dc2626" : d <= 30 ? "#f59e0b" : "#16a34a", fontWeight: 700 }}>{d > 0 ? d : "Expired"}</span>; } },
                  { label: "📈 Success Rate", key: s => `${s.success_rate_estimate || "N/A"}%` },
                  { label: "🏷️ Type", key: s => s.type?.charAt(0).toUpperCase() + s.type?.slice(1) },
                  { label: "📋 Eligibility", key: s => <span style={{ fontSize: 12 }}>{s.eligibility_summary?.slice(0, 60)}…</span> },
                ].map((row, i) => (
                  <tr key={i} style={{ borderBottom: "1px solid var(--gray-100)", background: i % 2 === 0 ? "transparent" : "var(--gray-50, #f9fafb)" }}>
                    <td style={{ padding: "10px 12px", fontWeight: 600, color: "var(--gray-500)", fontSize: 13, whiteSpace: "nowrap" }}>{row.label}</td>
                    {selected.map(s => (
                      <td key={s.id} style={{ padding: "10px 12px", textAlign: "center" }}>{row.key(s)}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* AI Recommendation Button */}
          <div style={{ marginTop: 20, textAlign: "center" }}>
            <button onClick={getAiRecommendation} disabled={loading} style={{
              background: loading ? "var(--gray-300)" : "linear-gradient(135deg, var(--primary), var(--accent))",
              color: "#fff", border: "none", borderRadius: 12, padding: "12px 28px",
              fontSize: 14, fontWeight: 700, cursor: loading ? "wait" : "pointer",
              boxShadow: "0 4px 16px rgba(26,86,219,0.3)", transition: "all 0.3s",
            }}>
              {loading ? "🤔 Analyzing..." : "✨ Get AI Recommendation"}
            </button>
          </div>

          {/* AI Advice */}
          {aiAdvice && (
            <div style={{
              marginTop: 16, padding: 20, borderRadius: 16,
              background: "linear-gradient(135deg, rgba(26,86,219,0.05), rgba(124,58,237,0.05))",
              border: "1.5px solid rgba(26,86,219,0.15)",
            }}>
              <h4 style={{ fontSize: 14, fontWeight: 700, color: "var(--primary)", marginBottom: 8 }}>🤖 AI Recommendation</h4>
              <div style={{ fontSize: 13, lineHeight: 1.7, color: "var(--navy)", whiteSpace: "pre-wrap" }}>{aiAdvice}</div>
            </div>
          )}
        </div>
      )}

      {selected.length < 2 && (
        <div style={{
          textAlign: "center", padding: "40px 20px", color: "var(--gray-400)",
          borderRadius: 16, border: "2px dashed var(--gray-200)", background: "var(--gray-50, #f9fafb)",
        }}>
          <div style={{ fontSize: 40, marginBottom: 8 }}>⚖️</div>
          <p style={{ fontSize: 14, fontWeight: 600 }}>Select at least 2 scholarships above to compare</p>
          <p style={{ fontSize: 12, marginTop: 4 }}>Click on any scholarship card to add it to comparison</p>
        </div>
      )}
    </div>
  );
}
