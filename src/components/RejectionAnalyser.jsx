import { useState } from "react";
import { callClaude } from "../utils/claude.js";

export default function RejectionAnalyser({ scholarships }) {
  const [form, setForm] = useState({
    scholarship: scholarships[0].id,
    marks: "78",
    income: "3.5",
    category: "General",
    sop: "",
  });
  const [issues, setIssues]     = useState([]);
  const [readiness, setReadiness] = useState(null);
  const [summary, setSummary]   = useState("");
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState("");
  const [streaming, setStreaming] = useState(false);

  const schol = scholarships.find(s => s.id === form.scholarship);

  const analyse = async () => {
    if (!form.sop.trim()) { setError("Please paste your SOP or application text."); return; }
    setError(""); setLoading(true); setIssues([]); setReadiness(null); setSummary(""); setStreaming(true);

    const prompt = `You are a strict scholarship application evaluator reviewing an application before submission.

Scholarship: ${schol.name}
Provider: ${schol.provider}
Selection criteria: ${schol.eligibility_summary}

Student's application:
- Marks: ${form.marks}%
- Family income: ₹${form.income} LPA
- Category: ${form.category}
- SOP/Application text: ${form.sop}

Analyse this application and identify every reason it could be rejected. Be honest and specific.

For each issue output a JSON object:
{"severity":"critical|warning|suggestion","issue":"One clear sentence naming the problem","explanation":"Why this matters (1-2 sentences)","fix":"One specific actionable fix"}

Output as a JSON array of issue objects, then on a NEW line output ONLY this JSON:
{"severity":"score","readiness":NUMBER_0_TO_100,"summary":"One honest sentence"}

No markdown, no backticks, no extra text.`;

    let rawText = "";
    try {
      await callClaude(prompt, (full) => { rawText = full; }, "", 1000);
      parseResults(rawText);
    } catch (e) {
      setError(e.message || "Analysis failed. Check your API key and try again.");
    }
    setLoading(false);
    setStreaming(false);
  };

  const parseResults = (raw) => {
    try {
      const lines = raw.trim().split("\n");
      let issueJson = "";
      let scoreJson = "";
      let inIssues   = false;

      for (const line of lines) {
        const trimmed = line.trim();
        if (trimmed.startsWith("[")) { inIssues = true; issueJson = trimmed; }
        else if (inIssues && !trimmed.startsWith('{"severity":"score"')) { issueJson += trimmed; }
        else if (trimmed.startsWith('{"severity":"score"')) { scoreJson = trimmed; inIssues = false; }
      }

      const issueArr  = JSON.parse(issueJson || "[]");
      const scoreObj  = JSON.parse(scoreJson || '{"readiness":70,"summary":"Analysis complete."}');
      setIssues(issueArr);
      setReadiness(scoreObj.readiness);
      setSummary(scoreObj.summary);
    } catch {
      // Fallback parse
      const criticals   = (raw.match(/"severity":"critical"/g) || []).length;
      const warnings    = (raw.match(/"severity":"warning"/g) || []).length;
      const readinessM  = raw.match(/"readiness":(\d+)/);
      const summaryM    = raw.match(/"summary":"([^"]+)"/);
      setReadiness(readinessM ? parseInt(readinessM[1]) : 65);
      setSummary(summaryM ? summaryM[1] : "Review your application carefully.");
      setIssues([
        { severity: "warning", issue: "Unable to fully parse AI response.", explanation: "Try again for a detailed analysis.", fix: "Click Analyse again." }
      ]);
    }
  };

  const severityConfig = {
    critical:   { cls: "issue-critical",   icon: "🚨", label: "Critical",   color: "var(--danger)"  },
    warning:    { cls: "issue-warning",     icon: "⚠️", label: "Warning",    color: "var(--warning)" },
    suggestion: { cls: "issue-suggestion",  icon: "💡", label: "Suggestion", color: "var(--primary)" },
  };

  const criticalCount  = issues.filter(i => i.severity === "critical").length;
  const warningCount   = issues.filter(i => i.severity === "warning").length;
  const suggCount      = issues.filter(i => i.severity === "suggestion").length;

  return (
    <div className="grid-2 gap-4 fade-in">
      {/* Left: Input */}
      <div className="card-lg">
        <h3 style={{ fontFamily: "'Sora', sans-serif", fontSize: 17, fontWeight: 700, marginBottom: 4 }}>🔍 Pre-Submit Check</h3>
        <p className="text-sm text-muted mb-4">AI scans your application for every possible rejection reason before you submit.</p>

        <div className="form-group">
          <label className="label">Scholarship</label>
          <select className="input" value={form.scholarship} onChange={e => setForm(f => ({ ...f, scholarship: e.target.value }))}>
            {scholarships.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
          </select>
        </div>

        <div className="grid-2">
          <div className="form-group">
            <label className="label">Your Marks (%)</label>
            <input className="input" value={form.marks} onChange={e => setForm(f => ({ ...f, marks: e.target.value }))} placeholder="78" />
          </div>
          <div className="form-group">
            <label className="label">Family Income (LPA)</label>
            <input className="input" value={form.income} onChange={e => setForm(f => ({ ...f, income: e.target.value }))} placeholder="3.5" />
          </div>
        </div>

        <div className="form-group">
          <label className="label">Category</label>
          <select className="input" value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))}>
            {["General","OBC","SC","ST","EWS","Minority","Women","Disabled"].map(c => <option key={c}>{c}</option>)}
          </select>
        </div>

        <div className="form-group">
          <label className="label">Your SOP / Application Text</label>
          <textarea className="input" rows={10} value={form.sop} onChange={e => setForm(f => ({ ...f, sop: e.target.value }))}
            placeholder="Paste your Statement of Purpose or application essay here for analysis…" />
          <div className="form-hint">{form.sop.trim().split(/\s+/).filter(Boolean).length} words</div>
        </div>

        {error && <div className="text-danger text-sm mb-3">⚠️ {error}</div>}

        <button className="btn btn-primary btn-full" onClick={analyse} disabled={loading}>
          {loading ? <><span className="loading-dots"><span className="dot"/><span className="dot"/><span className="dot"/></span> Analysing…</> : "🔍 Analyse My Application"}
        </button>
      </div>

      {/* Right: Results */}
      <div className="card-lg">
        <h3 style={{ fontFamily: "'Sora', sans-serif", fontSize: 17, fontWeight: 700, marginBottom: 16 }}>Analysis Results</h3>

        {!loading && readiness === null && (
          <div className="empty-state">
            <div className="empty-icon">🔍</div>
            <p className="font-semibold">Analysis will appear here</p>
            <p className="text-sm text-muted mt-2">Paste your SOP and click Analyse to get detailed feedback</p>
          </div>
        )}

        {loading && (
          <div style={{ textAlign: "center", padding: "40px 0" }}>
            <div className="loading-dots" style={{ justifyContent: "center", marginBottom: 16 }}>
              <span className="dot"/><span className="dot"/><span className="dot"/>
            </div>
            <p className="text-muted text-sm">Evaluating your application…</p>
          </div>
        )}

        {readiness !== null && !loading && (
          <>
            {/* Readiness Score */}
            <div className="flex items-center gap-4 mb-6">
              <div className="readiness-ring" style={{ borderColor: readiness >= 80 ? "var(--success)" : readiness >= 60 ? "var(--warning)" : "var(--danger)", color: readiness >= 80 ? "var(--success)" : readiness >= 60 ? "var(--warning)" : "var(--danger)" }}>
                {readiness}
              </div>
              <div>
                <div style={{ fontWeight: 700, fontSize: 15 }}>
                  {readiness >= 80 ? "🟢 Ready to Apply!" : readiness >= 60 ? "🟡 Needs Some Work" : "🔴 Significant Issues Found"}
                </div>
                <p className="text-sm text-muted mt-1">{summary}</p>
              </div>
            </div>

            {/* Issue Count Summary */}
            {issues.length > 0 && (
              <div className="grid-3 gap-2 mb-4">
                {[
                  { label: "Critical",   count: criticalCount, color: "var(--danger)",  bg: "#fee2e2" },
                  { label: "Warnings",   count: warningCount,  color: "var(--warning)", bg: "#fef3c7" },
                  { label: "Suggestions",count: suggCount,     color: "var(--primary)", bg: "#dbeafe" },
                ].map(s => (
                  <div key={s.label} style={{ background: s.bg, borderRadius: 8, padding: "10px", textAlign: "center" }}>
                    <div style={{ fontFamily: "'Sora', sans-serif", fontSize: 22, fontWeight: 800, color: s.color }}>{s.count}</div>
                    <div style={{ fontSize: 12, fontWeight: 600, color: s.color }}>{s.label}</div>
                  </div>
                ))}
              </div>
            )}

            {/* Issues List */}
            {issues.length === 0 && (
              <div className="card" style={{ background: "#f0fdf4", border: "1.5px solid #86efac", textAlign: "center", padding: "24px" }}>
                <div style={{ fontSize: 32, marginBottom: 8 }}>🎉</div>
                <div style={{ fontWeight: 700, color: "var(--success)" }}>Excellent Application!</div>
                <p className="text-sm text-muted mt-2">No significant issues found. Your application looks strong.</p>
              </div>
            )}

            {issues.map((issue, i) => {
              const cfg = severityConfig[issue.severity] || severityConfig.suggestion;
              return (
                <div key={i} className={`issue-item ${cfg.cls}`}>
                  <span style={{ fontSize: 18, flexShrink: 0 }}>{cfg.icon}</span>
                  <div style={{ flex: 1 }}>
                    <div className="flex items-center gap-2 mb-1">
                      <span style={{ background: cfg.cls === "issue-critical" ? "#fee2e2" : cfg.cls === "issue-warning" ? "#fef3c7" : "#dbeafe", color: cfg.color, fontSize: 10, fontWeight: 700, padding: "2px 7px", borderRadius: 4 }}>
                        {cfg.label.toUpperCase()}
                      </span>
                      <span style={{ fontWeight: 700, fontSize: 14 }}>{issue.issue}</span>
                    </div>
                    <p className="text-sm text-muted mb-2">{issue.explanation}</p>
                    <div style={{ background: "rgba(255,255,255,0.6)", borderRadius: 6, padding: "6px 10px" }}>
                      <span style={{ fontSize: 12, fontWeight: 700, color: cfg.color }}>Fix: </span>
                      <span style={{ fontSize: 12 }}>{issue.fix}</span>
                    </div>
                  </div>
                </div>
              );
            })}

            {readiness >= 80 && (
              <div className="card mt-4" style={{ background: "#f0fdf4", border: "1.5px solid #86efac", textAlign: "center" }}>
                <div style={{ fontWeight: 700, color: "var(--success)", fontSize: 15 }}>✅ Ready to Apply!</div>
                <p className="text-sm text-muted mt-1">Your application looks strong. Go ahead and submit.</p>
              </div>
            )}

            {/* Improvement Checklist */}
            {issues.length > 0 && (
              <div className="card mt-4" style={{ background: "var(--gray-50)", border: "1px solid var(--gray-200)" }}>
                <h4 style={{ fontWeight: 800, fontSize: 15, color: "var(--navy)", marginBottom: 12, display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ fontSize: 18 }}>📋</span> Improvement Checklist
                </h4>
                <p className="text-sm text-muted mb-4">Fix these items before resubmitting your application:</p>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {issues.map((issue, i) => {
                    const cfg = severityConfig[issue.severity] || severityConfig.suggestion;
                    return (
                      <label key={i} style={{
                        display: "flex", alignItems: "flex-start", gap: 10, padding: "10px 12px",
                        background: "var(--bg-card)", borderRadius: 10, border: "1px solid var(--gray-200)",
                        cursor: "pointer", transition: "all 0.2s",
                      }}>
                        <input type="checkbox" style={{ marginTop: 3, accentColor: "var(--success)", width: 16, height: 16 }} />
                        <div>
                          <span style={{ fontSize: 13, fontWeight: 700, color: "var(--navy)" }}>{issue.fix}</span>
                          <div style={{ fontSize: 11, color: "var(--gray-500)", marginTop: 2 }}>
                            {cfg.icon} {cfg.label} — {issue.issue}
                          </div>
                        </div>
                      </label>
                    );
                  })}
                </div>
                <div style={{ marginTop: 16, padding: "10px 14px", background: "var(--primary-pale)", borderRadius: 10, fontSize: 12, color: "var(--primary)", fontWeight: 600 }}>
                  💡 Tip: Fix all critical issues first, then warnings, then suggestions for the best results.
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
