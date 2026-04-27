import { useState } from "react";
import { callClaudeSync } from "../utils/claude.js";

const MOCK_CHALLENGES = [
  {
    id: "ch1", title: "Write a 500-word essay on climate solutions for rural India",
    sponsor: "GreenFuture Foundation", sponsorLogo: "🌱",
    type: "essay", prize_amount: 2000, total_slots: 5,
    deadline: "2025-09-15", status: "active",
    description: "We're looking for creative, evidence-based essays from students about specific, actionable climate solutions that can be implemented in rural Indian villages. Focus on water conservation, sustainable agriculture, or renewable energy.",
    rubric: [{ criterion: "Originality",   weight: 30 }, { criterion: "Evidence",     weight: 25 }, { criterion: "Practicality", weight: 25 }, { criterion: "Writing Quality", weight: 20 }],
    word_limit: 500, submissions_count: 23, spots_left: 5 - 2
  },
  {
    id: "ch2", title: "Design a 2-minute pitch for a social enterprise idea",
    sponsor: "StartupIndia Foundation", sponsorLogo: "🚀",
    type: "project_brief", prize_amount: 5000, total_slots: 3,
    deadline: "2025-10-01", status: "active",
    description: "Submit a written pitch (500–700 words) for a social enterprise that addresses a real problem in education, healthcare, or agriculture in India. Include: problem statement, proposed solution, business model, and 1-year plan.",
    rubric: [{ criterion: "Problem Clarity",   weight: 25 }, { criterion: "Innovation",     weight: 30 }, { criterion: "Feasibility", weight: 25 }, { criterion: "Impact Potential", weight: 20 }],
    word_limit: 700, submissions_count: 11, spots_left: 3
  },
  {
    id: "ch3", title: "Explain a complex scientific concept to a 10-year-old",
    sponsor: "ScienceTales NGO", sponsorLogo: "🔬",
    type: "creative", prize_amount: 1500, total_slots: 8,
    deadline: "2025-09-25", status: "active",
    description: "Choose any concept from Physics, Chemistry, Biology, or Mathematics and write an explanation that a curious 10-year-old could understand and enjoy. No jargon allowed. Use analogies, stories, and examples from everyday Indian life.",
    rubric: [{ criterion: "Clarity",       weight: 35 }, { criterion: "Creativity",    weight: 30 }, { criterion: "Accuracy",   weight: 20 }, { criterion: "Engagement", weight: 15 }],
    word_limit: 400, submissions_count: 34, spots_left: 8
  },
  {
    id: "ch4", title: "Research report: Impact of digital payments on Indian MSMEs",
    sponsor: "PayTech Inclusion Trust", sponsorLogo: "💳",
    type: "research", prize_amount: 3500, total_slots: 4,
    deadline: "2025-10-20", status: "active",
    description: "Write a data-backed research brief (600–800 words) examining how UPI and digital payment adoption has affected Micro, Small and Medium Enterprises in India. Include at least 3 cited statistics and a personal interview or observation.",
    rubric: [{ criterion: "Data Quality",  weight: 30 }, { criterion: "Analysis",    weight: 30 }, { criterion: "Originality", weight: 20 }, { criterion: "Writing", weight: 20 }],
    word_limit: 800, submissions_count: 7, spots_left: 4
  },
];

export default function MicroChallenges() {
  const [selected, setSelected]   = useState(null);
  const [submission, setSubmission] = useState("");
  const [aiScore,   setAiScore]   = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitted,  setSubmitted] = useState(new Set());
  const [tab,        setTab]       = useState("browse");

  const fmtPrize = (n) => `₹${n.toLocaleString("en-IN")}`;
  const getDaysLeft = (d) => Math.max(0, Math.ceil((new Date(d) - new Date()) / 86400000));

  const runAIScreen = async () => {
    if (!submission.trim() || !selected) return;
    setSubmitting(true);
    const rubricStr = selected.rubric.map(r => `${r.criterion} (${r.weight}%)`).join(", ");
    const prompt = `Score this submission for the following micro-challenge.

Challenge: ${selected.title}
Rubric criteria: ${rubricStr}
Word limit: ${selected.word_limit}
Submission:
${submission}

Score against each rubric criterion (0–10 each). Output JSON ONLY, no markdown:
{
  "criterion_scores": [{"name": "string", "score": number, "comment": "string"}],
  "total_score": number,
  "recommendation": "shortlist | review | reject",
  "ai_summary": "2 sentences for the sponsor",
  "student_feedback": "1 sentence of improvement advice for the student"
}`;

    let result = { criterion_scores: [], total_score: 72, recommendation: "shortlist", ai_summary: "Strong entry with clear writing and relevant examples.", student_feedback: "Add more specific data points to strengthen your argument." };
    try {
      const raw    = await callClaudeSync(prompt, "", 600);
      const clean  = raw.replace(/```json|```/g, "").trim();
      result       = JSON.parse(clean);
    } catch {}

    setAiScore(result);
    setSubmitting(false);
  };

  const finalSubmit = () => {
    setSubmitted(s => new Set([...s, selected.id]));
    setSelected(null);
    setSubmission("");
    setAiScore(null);
    setTab("mine");
  };

  return (
    <div className="fade-in">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="section-title">Micro-Scholarship Challenges</h1>
          <p className="section-sub">Complete short tasks from companies & NGOs · Win ₹500–₹5,000 · AI pre-screened</p>
        </div>
      </div>

      <div className="tab-bar">
        <button className={`tab-btn ${tab === "browse" ? "active" : ""}`} onClick={() => { setTab("browse"); setSelected(null); }}>🏆 Active Challenges</button>
        <button className={`tab-btn ${tab === "mine" ? "active" : ""}`} onClick={() => { setTab("mine"); setSelected(null); }}>📋 My Submissions</button>
      </div>

      {tab === "browse" && !selected && (
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {MOCK_CHALLENGES.map(ch => (
            <div key={ch.id} className="challenge-card" onClick={() => setSelected(ch)}>
              <div className="flex items-start gap-4">
                <div style={{ fontSize: 36, width: 52, height: 52, background: "var(--primary-pale)", borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  {ch.sponsorLogo}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 4 }}>{ch.title}</div>
                  <div className="text-sm text-muted mb-2">{ch.sponsor}</div>
                  <p style={{ fontSize: 13, color: "var(--gray-700)", lineHeight: 1.5 }}>{ch.description.slice(0, 120)}…</p>
                  <div className="flex gap-2 mt-3" style={{ flexWrap: "wrap" }}>
                    <span className="badge badge-blue">{ch.type}</span>
                    <span className="badge badge-gray">📝 {ch.word_limit} words</span>
                    <span className="badge badge-gray">👥 {ch.spots_left} spots left</span>
                    <span className="badge badge-amber">⏰ {getDaysLeft(ch.deadline)} days left</span>
                    {submitted.has(ch.id) && <span className="badge badge-green">✅ Submitted</span>}
                  </div>
                </div>
                <div style={{ flexShrink: 0, textAlign: "right" }}>
                  <div className="prize-badge">{fmtPrize(ch.prize_amount)}</div>
                  <div className="text-xs text-muted mt-1">{ch.total_slots} winners</div>
                  <button className="btn btn-primary btn-sm mt-3" disabled={submitted.has(ch.id)}>
                    {submitted.has(ch.id) ? "✓ Entered" : "Enter →"}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {tab === "browse" && selected && (
        <div className="fade-in">
          <button className="btn btn-ghost btn-sm mb-4" onClick={() => { setSelected(null); setAiScore(null); setSubmission(""); }}>← Back to Challenges</button>

          <div className="grid-2 gap-4">
            {/* Challenge Details */}
            <div className="card-lg">
              <div className="flex items-center gap-3 mb-4">
                <div style={{ fontSize: 36 }}>{selected.sponsorLogo}</div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 16 }}>{selected.title}</div>
                  <div className="text-sm text-muted">{selected.sponsor}</div>
                </div>
              </div>

              <div className="grid-2 gap-2 mb-4">
                {[
                  { label: "Prize",      value: fmtPrize(selected.prize_amount), color: "#059669" },
                  { label: "Winners",    value: `${selected.total_slots} students`, color: "#1A56DB" },
                  { label: "Word limit", value: `${selected.word_limit} words`, color: "#7c3aed" },
                  { label: "Deadline",   value: `${getDaysLeft(selected.deadline)} days`, color: "#f59e0b" },
                ].map(s => (
                  <div key={s.label} style={{ background: "var(--gray-50)", borderRadius: 8, padding: "10px 12px" }}>
                    <div style={{ fontWeight: 800, fontSize: 16, color: s.color }}>{s.value}</div>
                    <div style={{ fontSize: 12, color: "var(--gray-500)" }}>{s.label}</div>
                  </div>
                ))}
              </div>

              <p style={{ fontSize: 14, lineHeight: 1.7, marginBottom: 16 }}>{selected.description}</p>

              <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 8 }}>Scoring Rubric:</div>
              {selected.rubric.map(r => (
                <div key={r.criterion} className="flex items-center gap-2 mb-2">
                  <span style={{ fontSize: 13, flex: 1 }}>{r.criterion}</span>
                  <div style={{ width: 80, height: 6, background: "var(--gray-200)", borderRadius: 3, overflow: "hidden" }}>
                    <div style={{ width: `${r.weight}%`, height: "100%", background: "var(--primary)", borderRadius: 3 }} />
                  </div>
                  <span style={{ fontSize: 12, fontWeight: 700, color: "var(--primary)", width: 30, textAlign: "right" }}>{r.weight}%</span>
                </div>
              ))}
            </div>

            {/* Submission */}
            <div className="card-lg">
              <div style={{ fontWeight: 700, fontSize: 16, fontFamily: "'Sora', sans-serif", marginBottom: 16 }}>Your Submission</div>

              <div className="form-group">
                <label className="label">Your Response</label>
                <textarea className="input" rows={10} value={submission}
                  onChange={e => setSubmission(e.target.value)}
                  placeholder={`Write your ${selected.word_limit}-word response here…`}
                  disabled={!!aiScore} />
                <div className="form-hint">{submission.trim().split(/\s+/).filter(Boolean).length} / {selected.word_limit} words</div>
              </div>

              {!aiScore ? (
                <button className="btn btn-primary btn-full" onClick={runAIScreen}
                  disabled={submitting || submission.trim().split(/\s+/).filter(Boolean).length < 50}>
                  {submitting ? <><span className="loading-dots"><span className="dot"/><span className="dot"/><span className="dot"/></span> AI Screening…</> : "🤖 AI Pre-Screen & Submit"}
                </button>
              ) : (
                <div className="fade-in">
                  <div className="card mb-3" style={{ background: aiScore.recommendation === "shortlist" ? "#f0fdf4" : aiScore.recommendation === "review" ? "#fffbeb" : "#fef2f2" }}>
                    <div className="flex items-center justify-between mb-2">
                      <span style={{ fontWeight: 700, fontSize: 15 }}>AI Score: {aiScore.total_score}/100</span>
                      <span className={`badge ${aiScore.recommendation === "shortlist" ? "badge-green" : aiScore.recommendation === "review" ? "badge-amber" : "badge-red"}`}>
                        {aiScore.recommendation}
                      </span>
                    </div>
                    {aiScore.criterion_scores?.map(c => (
                      <div key={c.name} className="flex items-center gap-2 mb-1">
                        <span style={{ fontSize: 12, width: 100, flexShrink: 0 }}>{c.name}</span>
                        <div style={{ flex: 1, height: 6, background: "rgba(0,0,0,0.1)", borderRadius: 3, overflow: "hidden" }}>
                          <div style={{ width: `${c.score * 10}%`, height: "100%", background: "var(--primary)", borderRadius: 3 }} />
                        </div>
                        <span style={{ fontSize: 12, fontWeight: 700, width: 20 }}>{c.score}</span>
                      </div>
                    ))}
                    <div style={{ marginTop: 8, fontSize: 13, color: "var(--gray-700)" }}>
                      💡 {aiScore.student_feedback}
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button className="btn btn-ghost btn-sm" onClick={() => setAiScore(null)} style={{ flex: 1 }}>✏️ Revise</button>
                    <button className="btn btn-primary" onClick={finalSubmit} style={{ flex: 1 }}>Submit Entry →</button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {tab === "mine" && (
        <div>
          {submitted.size === 0 ? (
            <div className="empty-state card-lg">
              <div className="empty-icon">🏆</div>
              <p className="font-semibold">No submissions yet</p>
              <p className="text-sm text-muted mt-2">Browse challenges and submit your entry to win micro-scholarships</p>
              <button className="btn btn-primary mt-4" onClick={() => setTab("browse")}>Browse Challenges →</button>
            </div>
          ) : (
            MOCK_CHALLENGES.filter(ch => submitted.has(ch.id)).map(ch => (
              <div key={ch.id} className="card mb-3">
                <div className="flex items-center gap-3">
                  <div style={{ fontSize: 32 }}>{ch.sponsorLogo}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 700 }}>{ch.title}</div>
                    <div className="text-sm text-muted">{ch.sponsor}</div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div className="prize-badge">{fmtPrize(ch.prize_amount)}</div>
                    <span className="badge badge-green mt-1">✅ Submitted</span>
                    <div className="text-xs text-muted mt-1">Results on {new Date(ch.deadline).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}</div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
