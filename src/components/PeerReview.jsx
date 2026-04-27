import { useState } from "react";

const MOCK_QUEUE = [
  {
    id: "pr1", scholarshipName: "Tata Capital Pankh Scholarship", wordCount: 312,
    submittedAt: "2 days ago", status: "pending_review",
    sop: `My journey into engineering began not in a classroom, but in the narrow lanes of Dharavi, where I watched my father repair mobile phones using salvaged components. That workshop taught me more about circuits than any textbook—it showed me that technology becomes meaningful only when it solves real problems for real people.

I am currently in my third year of B.E. Electronics Engineering at VJTI Mumbai, maintaining a 7.8 CGPA. My research project on low-power IoT sensors for crop monitoring has been selected for presentation at IEEE INDICON 2024. This work grew from a direct conversation with farmers in our college's rural outreach program, who described losing 30% of yield to pests they couldn't detect early.

The Tata Capital Pankh Scholarship would allow me to complete my final year without the financial pressure that has forced me to tutor 15 hours weekly—time I would redirect entirely to my research. Tata Capital's specific focus on enabling the "next generation of entrepreneurs" aligns with my plan to commercialize my sensor system through a student startup within 18 months of graduation. I intend to give back by offering free workshops on IoT prototyping in government ITI colleges, beginning in my home district of Raigad.`
  },
  {
    id: "pr2", scholarshipName: "Reliance Foundation Scholarship", wordCount: 285,
    submittedAt: "1 day ago", status: "pending_review",
    sop: `Growing up in Nashik, I was the first in my family to pursue engineering. My father works as a security guard; my mother is a domestic worker. Every rupee of my education has been a collective family sacrifice, and I have carried that weight by ensuring I am among the top 5% of my batch at COEP Pune.

My academic focus is renewable energy systems. My final year project—a hybrid solar-wind charge controller for rural off-grid homes—is being piloted in three villages in Marathwada through an NGO partnership. I chose this because 40% of Maharashtra's rural population still faces unreliable power, which directly impacts children's study hours and small business productivity.

The Reliance Foundation Scholarship represents more than financial support to me. Reliance Industries' commitment to the New Energy business signals a future where India leads global clean energy transitions—and I want to be an engineer who contributes to that transition from within. This scholarship would fund my master's degree in Sustainable Energy at IIT Bombay. Upon completion, I commit to spending two years at a rural energy access organization before joining industry.`
  }
];

const MOCK_MY_SOPS = [
  { id: "my1", scholarshipName: "HDFC Education Crisis Scholarship", wordCount: 320, status: "reviewed", reviews_received: 2, karma_earned: 2 }
];

const MOCK_REVIEWS_RECEIVED = [
  {
    id: "rev1", reviewerAlias: "Anonymous Reviewer #1", clarity: 4, relevance: 5, impact: 4, overall: 4,
    strengths: "The opening anecdote about your father's repair shop is vivid and original. It immediately differentiates you from generic SOPs.",
    improvements: "Paragraph 2 lists achievements without connecting them emotionally to your stated goal. Show how the IEEE project changed your thinking, not just what it accomplished.",
    helpful: null
  },
  {
    id: "rev2", reviewerAlias: "Anonymous Reviewer #2", clarity: 5, relevance: 4, impact: 4, overall: 4,
    strengths: "Your specificity is excellent — you mention actual numbers (30% yield loss, 15 tutoring hours). This builds credibility.",
    improvements: "The closing pledge feels generic. Instead of 'workshops at ITI colleges,' name one specific ITI and one specific curriculum change you'd introduce.",
    helpful: null
  }
];

export default function PeerReview({ scholarships }) {
  const [tab,       setTab]       = useState("discover");
  const [reviewing, setReviewing] = useState(null);
  const [scores,    setScores]    = useState({ clarity: 0, relevance: 0, impact: 0, overall: 0 });
  const [feedback,  setFeedback]  = useState({ strengths: "", improvements: "" });
  const [submitted, setSubmitted] = useState(false);
  const [submitSOP, setSubmitSOP] = useState({ text: "", scholarshipId: "" });
  const [myReviews, setMyReviews] = useState(MOCK_REVIEWS_RECEIVED);
  const [karma,     setKarma]     = useState(4);
  const [showSubmitModal, setShowSubmitModal] = useState(false);

  const submitReview = () => {
    if (!scores.overall || !feedback.strengths || !feedback.improvements) return;
    setSubmitted(true);
    setKarma(k => k + 2);
    setTimeout(() => { setReviewing(null); setSubmitted(false); setScores({ clarity: 0, relevance: 0, impact: 0, overall: 0 }); setFeedback({ strengths: "", improvements: "" }); }, 1200);
  };

  const markHelpful = (id, val) => setMyReviews(rs => rs.map(r => r.id === id ? { ...r, helpful: val } : r));

  const StarRow = ({ label, key_, val }) => (
    <div className="flex items-center justify-between" style={{ padding: "8px 0", borderBottom: "1px solid var(--gray-100)" }}>
      <span style={{ fontWeight: 600, fontSize: 14, width: 120 }}>{label}</span>
      <div className="star-rating">
        {[1,2,3,4,5].map(n => (
          <span key={n} className="star" style={{ color: n <= val ? "#F59E0B" : "var(--gray-300)" }}
            onClick={() => setScores(s => ({ ...s, [key_]: n }))}>★</span>
        ))}
      </div>
      <span style={{ fontWeight: 700, width: 24, textAlign: "right" }}>{val || "–"}</span>
    </div>
  );

  return (
    <div className="fade-in">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="section-title">Peer Review Exchange</h1>
          <p className="section-sub">Review 2 SOPs → unlock human feedback on yours · Anonymous · Community-powered</p>
        </div>
        <div className="karma-badge">⭐ {karma} karma</div>
      </div>

      {/* How it works */}
      <div className="card mb-4" style={{ background: "linear-gradient(135deg, #eff6ff, #fff)", border: "1.5px solid #bfdbfe" }}>
        <div className="grid-3 gap-3">
          {[
            { step: "1", icon: "📤", label: "Submit Your SOP",   desc: "Share your SOP for any scholarship you're applying to" },
            { step: "2", icon: "👀", label: "Review 2 SOPs",     desc: "Give structured feedback to 2 anonymous peers" },
            { step: "3", icon: "🔓", label: "Unlock Your Reviews", desc: "Get your reviews once you've helped others" },
          ].map(s => (
            <div key={s.step} style={{ textAlign: "center" }}>
              <div style={{ fontSize: 28, marginBottom: 4 }}>{s.icon}</div>
              <div style={{ fontWeight: 700, fontSize: 13 }}>{s.label}</div>
              <p style={{ fontSize: 12, color: "var(--gray-500)", marginTop: 2 }}>{s.desc}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="tab-bar">
        {[
          { id: "discover", label: `📋 Review Queue (${MOCK_QUEUE.length})` },
          { id: "my_sops",  label: "📝 My Submissions" },
          { id: "received", label: `💬 Reviews Received (${myReviews.length})` },
        ].map(t => <button key={t.id} className={`tab-btn ${tab === t.id ? "active" : ""}`} onClick={() => setTab(t.id)}>{t.label}</button>)}
      </div>

      {/* Review Queue */}
      {tab === "discover" && !reviewing && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm text-muted">{MOCK_QUEUE.length} SOPs waiting for your review. Each review earns +2 karma.</p>
            <button className="btn btn-primary btn-sm" onClick={() => setShowSubmitModal(true)}>📤 Submit My SOP</button>
          </div>
          {MOCK_QUEUE.map(item => (
            <div key={item.id} className="review-card">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <div style={{ fontWeight: 700, fontSize: 15 }}>{item.scholarshipName}</div>
                  <div className="text-sm text-muted">{item.wordCount} words · submitted {item.submittedAt}</div>
                </div>
                <button className="btn btn-primary btn-sm" onClick={() => setReviewing(item)}>Review →</button>
              </div>
              <div style={{ background: "var(--gray-50)", border: "1px solid var(--gray-200)", borderRadius: 8, padding: "12px 14px", fontSize: 13, lineHeight: 1.7, maxHeight: 100, overflow: "hidden", position: "relative" }}>
                {item.sop.slice(0, 300)}…
                <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 40, background: "linear-gradient(transparent, var(--gray-50))" }} />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Review Interface */}
      {tab === "discover" && reviewing && (
        <div className="fade-in">
          <div className="flex items-center gap-3 mb-4">
            <button className="btn btn-ghost btn-sm" onClick={() => { setReviewing(null); setSubmitted(false); }}>← Back to Queue</button>
            <span style={{ fontWeight: 700 }}>Reviewing: {reviewing.scholarshipName}</span>
          </div>

          <div className="grid-2 gap-4">
            <div>
              <div className="card-lg" style={{ padding: 16, maxHeight: 500, overflowY: "auto" }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: "var(--gray-500)", marginBottom: 8 }}>ANONYMOUS SOP · {reviewing.wordCount} WORDS</div>
                <div style={{ fontSize: 14, lineHeight: 1.8, whiteSpace: "pre-wrap" }}>{reviewing.sop}</div>
              </div>
            </div>

            <div className="card-lg" style={{ padding: 16 }}>
              <div style={{ fontWeight: 700, fontSize: 16, fontFamily: "'Sora', sans-serif", marginBottom: 16 }}>Your Review</div>

              <StarRow label="Clarity"     key_="clarity"   val={scores.clarity}   />
              <StarRow label="Relevance"   key_="relevance" val={scores.relevance} />
              <StarRow label="Impact"      key_="impact"    val={scores.impact}    />
              <StarRow label="Overall"     key_="overall"   val={scores.overall}   />

              <div className="form-group mt-4">
                <label className="label">What's strongest about this SOP? *</label>
                <textarea className="input" rows={3} value={feedback.strengths}
                  onChange={e => setFeedback(f => ({ ...f, strengths: e.target.value }))}
                  placeholder="Be specific — point to a sentence, phrase, or approach that works well…" />
              </div>

              <div className="form-group">
                <label className="label">One specific improvement suggestion *</label>
                <textarea className="input" rows={3} value={feedback.improvements}
                  onChange={e => setFeedback(f => ({ ...f, improvements: e.target.value }))}
                  placeholder="What single change would most improve this SOP? Be constructive…" />
              </div>

              <button className="btn btn-primary btn-full"
                disabled={!scores.overall || !feedback.strengths || !feedback.improvements || submitted}
                onClick={submitReview}>
                {submitted ? "✅ Review Submitted! +2 karma" : "Submit Review →"}
              </button>

              <p className="text-xs text-muted text-center mt-2">Your identity is never revealed to the author</p>
            </div>
          </div>
        </div>
      )}

      {/* My Submissions */}
      {tab === "my_sops" && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm text-muted">SOPs you've submitted for peer review</p>
            <button className="btn btn-primary btn-sm" onClick={() => setShowSubmitModal(true)}>📤 Submit New SOP</button>
          </div>

          {MOCK_MY_SOPS.length === 0 ? (
            <div className="empty-state card-lg">
              <div className="empty-icon">📝</div>
              <p className="font-semibold">No SOPs submitted yet</p>
              <p className="text-sm text-muted mt-2">Submit your SOP to receive community feedback</p>
              <button className="btn btn-primary mt-4" onClick={() => setShowSubmitModal(true)}>Submit My First SOP</button>
            </div>
          ) : (
            MOCK_MY_SOPS.map(s => (
              <div key={s.id} className="review-card">
                <div className="flex items-center justify-between">
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 15 }}>{s.scholarshipName}</div>
                    <div className="text-sm text-muted">{s.wordCount} words</div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <span className={`badge ${s.status === "reviewed" ? "badge-green" : "badge-amber"}`}>
                      {s.status === "reviewed" ? `✅ ${s.reviews_received} reviews received` : "Pending review"}
                    </span>
                    <div className="text-xs text-muted mt-1">{s.karma_earned} karma earned</div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Reviews Received */}
      {tab === "received" && (
        <div>
          {myReviews.length === 0 ? (
            <div className="empty-state card-lg">
              <div className="empty-icon">💬</div>
              <p>No reviews received yet</p>
              <p className="text-sm text-muted mt-2">Review 2 SOPs first to unlock reviews on yours</p>
            </div>
          ) : (
            myReviews.map(r => (
              <div key={r.id} className="review-card mb-4">
                <div className="flex items-center justify-between mb-3">
                  <span style={{ fontWeight: 700, fontSize: 14 }}>{r.reviewerAlias}</span>
                  <div className="flex gap-1">
                    {["clarity","relevance","impact","overall"].map(dim => (
                      <div key={dim} style={{ textAlign: "center", padding: "4px 8px", background: "var(--gray-50)", borderRadius: 6 }}>
                        <div style={{ fontWeight: 800, fontSize: 14, color: "var(--primary)" }}>{r[dim]}</div>
                        <div style={{ fontSize: 10, color: "var(--gray-500)" }}>{dim}</div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="grid-2 gap-3">
                  <div style={{ background: "#f0fdf4", borderRadius: 8, padding: "10px 12px" }}>
                    <div style={{ fontSize: 11, fontWeight: 700, color: "var(--success)", marginBottom: 4 }}>✅ STRENGTH</div>
                    <p style={{ fontSize: 13 }}>{r.strengths}</p>
                  </div>
                  <div style={{ background: "#fffbeb", borderRadius: 8, padding: "10px 12px" }}>
                    <div style={{ fontSize: 11, fontWeight: 700, color: "var(--warning)", marginBottom: 4 }}>💡 IMPROVE</div>
                    <p style={{ fontSize: 13 }}>{r.improvements}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 mt-3">
                  <span style={{ fontSize: 13, color: "var(--gray-500)" }}>Was this review helpful?</span>
                  <button className={`btn btn-sm ${r.helpful === true ? "btn-success" : "btn-ghost"}`} onClick={() => markHelpful(r.id, true)}>👍</button>
                  <button className={`btn btn-sm ${r.helpful === false ? "btn-danger" : "btn-ghost"}`} onClick={() => markHelpful(r.id, false)}>👎</button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Submit SOP Modal */}
      {showSubmitModal && (
        <div className="modal-overlay" onClick={() => setShowSubmitModal(false)}>
          <div className="modal" style={{ maxWidth: 560 }} onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <div style={{ fontWeight: 700, fontSize: 16 }}>📤 Submit SOP for Peer Review</div>
              <button className="btn btn-ghost btn-sm" onClick={() => setShowSubmitModal(false)}>✕</button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label className="label">Scholarship</label>
                <select className="input" value={submitSOP.scholarshipId} onChange={e => setSubmitSOP(s => ({ ...s, scholarshipId: e.target.value }))}>
                  <option value="">Select scholarship…</option>
                  {scholarships.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label className="label">Your SOP</label>
                <textarea className="input" rows={10} value={submitSOP.text} onChange={e => setSubmitSOP(s => ({ ...s, text: e.target.value }))}
                  placeholder="Paste your Statement of Purpose here. It will be shown anonymously to reviewers." />
                <div className="form-hint">{submitSOP.text.trim().split(/\s+/).filter(Boolean).length} words</div>
              </div>
              <div className="card" style={{ background: "#eff6ff", border: "1px solid #bfdbfe", padding: "10px 14px" }}>
                <p className="text-xs" style={{ color: "var(--primary)" }}>
                  🔒 Your SOP is shared anonymously. Reviewers cannot see your name, college, or any identifying information.
                  You must review 2 SOPs before receiving feedback on yours.
                </p>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-ghost" onClick={() => setShowSubmitModal(false)}>Cancel</button>
              <button className="btn btn-primary" disabled={!submitSOP.scholarshipId || submitSOP.text.trim().split(/\s+/).filter(Boolean).length < 50}
                onClick={() => setShowSubmitModal(false)}>
                Submit for Review →
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
