import { useState } from "react";

const MOCK_MENTORS = [
  {
    id: "m1", name: "Arjun Mehta", college: "IIT Bombay", field: "Computer Science", year: "4th Year",
    avatar: "🧑‍💻", bg: "#dbeafe",
    scholarships_won: [
      { name: "Reliance Foundation Scholarship", year: 2022, amount: "₹2,00,000" },
      { name: "KVPY Fellowship", year: 2021, amount: "₹84,000/year" }
    ],
    bio: "First-gen student from Nagpur. Won the Reliance Foundation scholarship by focusing on my research work on sustainable computing. Happy to share the essay strategies that worked for me.",
    availability: "async_only", response_time_days: 2,
    total_students_helped: 34, rating: 4.8, is_verified: true,
    tags: ["Engineering","Reliance","KVPY","IIT"],
  },
  {
    id: "m2", name: "Prarthana Iyer", college: "AIIMS Delhi", field: "Medical Sciences", year: "3rd Year MBBS",
    avatar: "👩‍⚕️", bg: "#d1fae5",
    scholarships_won: [
      { name: "AICTE Pragati Scholarship", year: 2021, amount: "₹50,000" },
      { name: "INSPIRE Scholarship", year: 2021, amount: "₹80,000/year" }
    ],
    bio: "Tamil Nadu domicile, general category. I navigated INSPIRE and Pragati simultaneously — happy to explain timelines, documents, and what evaluators actually look for.",
    availability: "both", response_time_days: 1,
    total_students_helped: 61, rating: 4.9, is_verified: true,
    tags: ["Medical","AIIMS","INSPIRE","Women"],
  },
  {
    id: "m3", name: "Rohan Patil", college: "VJTI Mumbai", field: "Electronics Engineering", year: "Final Year",
    avatar: "👨‍🔧", bg: "#ede9fe",
    scholarships_won: [
      { name: "Tata Capital Pankh Scholarship", year: 2022, amount: "₹50,000" },
      { name: "Bahujan Welfare Scholarship Maharashtra", year: 2021, amount: "₹80,000" }
    ],
    bio: "SC category, Maharashtra. I cracked the Tata Pankh interview on my second attempt. Can tell you exactly what the panel asked and how to frame your answers authentically.",
    availability: "calendar",
    response_time_days: 3, total_students_helped: 18, rating: 4.6, is_verified: true,
    tags: ["Maharashtra","Tata","SC","Interview Prep"],
  },
  {
    id: "m4", name: "Sneha Krishnan", college: "IIM Ahmedabad", field: "Management", year: "2nd Year MBA",
    avatar: "👩‍💼", bg: "#fef3c7",
    scholarships_won: [
      { name: "NSP Central Sector Scholarship", year: 2019, amount: "₹12,000" },
      { name: "Buddy4Study Shiksha Scholarship", year: 2020, amount: "₹40,000" }
    ],
    bio: "First-gen student from Kerala. Wrote 12 scholarship SOPs before my MBA — won 3 of them. My advice: one specific story beats ten general claims every time.",
    availability: "async_only", response_time_days: 2,
    total_students_helped: 45, rating: 4.7, is_verified: true,
    tags: ["MBA","SOP Writing","First-Gen","NSP"],
  },
];

export default function MentorNetwork({ scholarships }) {
  const [selected, setSelected] = useState(null);
  const [question, setQuestion] = useState("");
  const [filter,   setFilter]   = useState("all");
  const [asked,    setAsked]    = useState(new Set());
  const [showAskModal, setShowAskModal] = useState(false);
  const [modalMentor,  setModalMentor]  = useState(null);

  const fields = ["all", ...new Set(MOCK_MENTORS.map(m => m.field))];

  const filtered = filter === "all" ? MOCK_MENTORS : MOCK_MENTORS.filter(m => m.field === filter);

  const openAsk = (mentor, e) => { e.stopPropagation(); setModalMentor(mentor); setQuestion(""); setShowAskModal(true); };
  const submitQuestion = () => { setAsked(a => new Set([...a, modalMentor.id])); setShowAskModal(false); };

  return (
    <div className="fade-in">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="section-title">Winner Mentor Network</h1>
          <p className="section-sub">Get guidance from verified scholarship winners who've been exactly where you are</p>
        </div>
        <div className="card" style={{ padding: "10px 16px", display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 18 }}>🏅</span>
          <div>
            <div style={{ fontWeight: 700, fontSize: 13 }}>{MOCK_MENTORS.length} verified mentors</div>
            <div style={{ fontSize: 11, color: "var(--gray-500)" }}>{MOCK_MENTORS.reduce((a, m) => a + m.total_students_helped, 0)} students helped</div>
          </div>
        </div>
      </div>

      {!selected ? (
        <>
          {/* Filters */}
          <div className="flex gap-2 mb-4" style={{ flexWrap: "wrap" }}>
            {fields.map(f => (
              <button key={f} className={`btn btn-sm ${filter === f ? "btn-primary" : "btn-ghost"}`} onClick={() => setFilter(f)}>
                {f === "all" ? "All Fields" : f}
              </button>
            ))}
          </div>

          <div className="grid-2 gap-4">
            {filtered.map(mentor => (
              <div key={mentor.id} className="mentor-card" onClick={() => setSelected(mentor)}>
                <div className="flex items-start gap-3 mb-3">
                  <div className="mentor-avatar" style={{ background: mentor.bg }}>{mentor.avatar}</div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div className="flex items-center gap-2">
                      <span style={{ fontWeight: 700, fontSize: 15 }}>{mentor.name}</span>
                      {mentor.is_verified && <span className="badge badge-blue" style={{ fontSize: 10 }}>✓ Verified</span>}
                    </div>
                    <div className="text-sm text-muted">{mentor.college} · {mentor.year}</div>
                    <div className="text-sm" style={{ color: "var(--primary)" }}>{mentor.field}</div>
                  </div>
                  <div style={{ textAlign: "right", flexShrink: 0 }}>
                    <div style={{ fontWeight: 700, fontSize: 14, color: "#F59E0B" }}>★ {mentor.rating}</div>
                    <div style={{ fontSize: 11, color: "var(--gray-500)" }}>{mentor.total_students_helped} helped</div>
                  </div>
                </div>

                <p className="text-sm" style={{ lineHeight: 1.5, marginBottom: 12, color: "var(--gray-700)" }}>{mentor.bio.slice(0, 130)}…</p>

                <div style={{ fontWeight: 700, fontSize: 12, color: "var(--gray-500)", marginBottom: 6 }}>SCHOLARSHIPS WON</div>
                {mentor.scholarships_won.slice(0, 2).map(s => (
                  <div key={s.name} className="flex items-center justify-between" style={{ fontSize: 12, padding: "3px 0" }}>
                    <span style={{ color: "var(--gray-700)" }}>🏆 {s.name.split(" ").slice(0, 4).join(" ")}…</span>
                    <span style={{ fontWeight: 700, color: "#059669" }}>{s.amount}</span>
                  </div>
                ))}

                <div className="flex gap-2 mt-3">
                  <div className="flex gap-1" style={{ flex: 1, flexWrap: "wrap" }}>
                    {mentor.tags.slice(0, 3).map(t => <span key={t} className="tag">{t}</span>)}
                  </div>
                  <button className="btn btn-primary btn-sm" onClick={e => openAsk(mentor, e)} disabled={asked.has(mentor.id)}>
                    {asked.has(mentor.id) ? "✓ Asked" : "Ask a Question"}
                  </button>
                </div>

                <div style={{ marginTop: 8, fontSize: 11, color: "var(--gray-500)" }}>
                  {mentor.availability === "async_only" ? "💬 Async replies only" : mentor.availability === "calendar" ? "📅 Video calls available" : "💬 Async + 📅 Video calls"}
                  · Responds in {mentor.response_time_days} day{mentor.response_time_days !== 1 ? "s" : ""}
                </div>
              </div>
            ))}
          </div>
        </>
      ) : (
        /* Mentor Detail */
        <div className="fade-in">
          <button className="btn btn-ghost btn-sm mb-4" onClick={() => setSelected(null)}>← Back to Mentors</button>

          <div className="grid-2 gap-4" style={{ alignItems: "start" }}>
            <div className="card-lg">
              <div className="flex items-start gap-4 mb-4">
                <div className="mentor-avatar" style={{ background: selected.bg, width: 72, height: 72, fontSize: 32 }}>{selected.avatar}</div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span style={{ fontFamily: "'Sora', sans-serif", fontSize: 20, fontWeight: 700 }}>{selected.name}</span>
                    {selected.is_verified && <span className="badge badge-blue">✓ Verified</span>}
                  </div>
                  <div className="text-muted">{selected.college} · {selected.year}</div>
                  <div style={{ color: "var(--primary)", fontWeight: 600 }}>{selected.field}</div>
                  <div className="flex gap-3 mt-2">
                    <span style={{ fontWeight: 700, color: "#F59E0B" }}>★ {selected.rating}</span>
                    <span className="text-sm text-muted">{selected.total_students_helped} students helped</span>
                  </div>
                </div>
              </div>

              <p style={{ fontSize: 14, lineHeight: 1.7, marginBottom: 16 }}>{selected.bio}</p>

              <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 10 }}>🏆 Scholarships Won</div>
              {selected.scholarships_won.map(s => (
                <div key={s.name} className="card mb-2" style={{ padding: "12px", background: "#fffbeb", border: "1px solid #fde68a" }}>
                  <div className="flex items-center justify-between">
                    <div>
                      <div style={{ fontWeight: 700, fontSize: 13 }}>{s.name}</div>
                      <div style={{ fontSize: 12, color: "var(--gray-500)" }}>Won in {s.year}</div>
                    </div>
                    <span style={{ fontWeight: 800, color: "#059669" }}>{s.amount}</span>
                  </div>
                </div>
              ))}

              <div className="card mt-4" style={{ padding: "12px", background: "var(--gray-50)" }}>
                <div style={{ fontWeight: 700, fontSize: 13, marginBottom: 6 }}>Availability</div>
                <div style={{ fontSize: 13, color: "var(--gray-700)" }}>
                  {selected.availability === "async_only" && "💬 Async Q&A only (no video calls)"}
                  {selected.availability === "calendar" && "📅 Video calls via Calendly"}
                  {selected.availability === "both" && "💬 Async Q&A + 📅 Video calls via Calendly"}
                </div>
                <div style={{ fontSize: 12, color: "var(--gray-500)", marginTop: 4 }}>Typical response time: {selected.response_time_days} day{selected.response_time_days !== 1 ? "s" : ""}</div>
              </div>
            </div>

            <div className="card-lg">
              <div style={{ fontFamily: "'Sora', sans-serif", fontSize: 16, fontWeight: 700, marginBottom: 16 }}>Ask {selected.name.split(" ")[0]} a Question</div>

              {asked.has(selected.id) ? (
                <div style={{ textAlign: "center", padding: "32px 16px" }}>
                  <div style={{ fontSize: 40, marginBottom: 8 }}>✅</div>
                  <div style={{ fontWeight: 700, fontSize: 16 }}>Question Sent!</div>
                  <p className="text-sm text-muted mt-2">
                    {selected.name.split(" ")[0]} will reply within {selected.response_time_days} day{selected.response_time_days !== 1 ? "s" : ""}.
                    You'll get a notification when they respond.
                  </p>
                </div>
              ) : (
                <>
                  <div className="mb-4">
                    <div style={{ fontWeight: 600, fontSize: 13, marginBottom: 8, color: "var(--gray-500)" }}>SUGGESTED QUESTIONS</div>
                    {[
                      `How did you structure your SOP for ${selected.scholarships_won[0]?.name.split(" ").slice(0,3).join(" ")}?`,
                      "What documents were most important in your application?",
                      "What would you do differently if you applied again?",
                      "How did you prepare for the interview?",
                    ].map(q => (
                      <button key={q} className="btn btn-ghost btn-sm" style={{ display: "block", width: "100%", textAlign: "left", marginBottom: 6, fontSize: 12, height: "auto", padding: "8px 12px" }}
                        onClick={() => setQuestion(q)}>
                        "{q}"
                      </button>
                    ))}
                  </div>

                  <div className="form-group">
                    <label className="label">Your Question</label>
                    <textarea className="input" rows={5} value={question} onChange={e => setQuestion(e.target.value)}
                      placeholder="Ask a specific question about their scholarship journey, application strategy, or tips…" />
                    <div className="form-hint">Be specific for the most useful answer</div>
                  </div>

                  <button className="btn btn-primary btn-full" onClick={() => { setAsked(a => new Set([...a, selected.id])); }} disabled={!question.trim()}>
                    Send Question →
                  </button>

                  {selected.availability !== "async_only" && (
                    <button className="btn btn-ghost btn-full mt-2" onClick={() => window.open("https://calendly.com", "_blank")}>
                      📅 Book a 20-min Video Call
                    </button>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Ask Modal (from card) */}
      {showAskModal && modalMentor && (
        <div className="modal-overlay" onClick={() => setShowAskModal(false)}>
          <div className="modal" style={{ maxWidth: 480 }} onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <div style={{ fontWeight: 700, fontSize: 16 }}>Ask {modalMentor.name.split(" ")[0]} a Question</div>
              <button className="btn btn-ghost btn-sm" onClick={() => setShowAskModal(false)}>✕</button>
            </div>
            <div className="modal-body">
              <textarea className="input" rows={5} value={question} onChange={e => setQuestion(e.target.value)}
                placeholder="Your question…" />
            </div>
            <div className="modal-footer">
              <button className="btn btn-ghost" onClick={() => setShowAskModal(false)}>Cancel</button>
              <button className="btn btn-primary" disabled={!question.trim()} onClick={submitQuestion}>Send →</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
