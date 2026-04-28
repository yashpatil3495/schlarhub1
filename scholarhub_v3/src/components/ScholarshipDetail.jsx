import { useState } from "react";
import { deadlineLabel, deadlineClass, typeBadge, difficultyBadge, daysUntil, calcMatchScore, toArr, toStr } from "../utils/helpers.js";

export default function ScholarshipDetail({ schol, onClose, saved, onToggleSave, onGenerateSOP, onInterviewPrep, onTrack, user }) {
  const [tab, setTab] = useState("overview");

  if (!schol) return null;

  const isSaved   = saved.has(schol.id);
  const matchScore = calcMatchScore(schol, user);
  const days       = daysUntil(schol.deadline);

  const sLevel  = toArr(schol.level);
  const sField  = toArr(schol.field);
  const sCats   = toArr(schol.categories);
  const sStates = toArr(schol.states);

  const eligChecks = [
    { label: "Academic Level", check: sLevel.includes(toStr(user.level)),                                                         detail: sLevel.join(", ") },
    { label: "Field of Study",  check: sField.includes(toStr(user.field)) || sField.includes("all"),                               detail: sField.join(", ") },
    { label: "Category",        check: sCats.includes(toStr(user.category).toLowerCase()) || sCats.includes("general"),             detail: sCats.join(", ") },
    { label: "Min. Marks",      check: user.marks_percent >= (schol.min_marks_percent || 0), detail: `Required: ${schol.min_marks_percent || 0}% · Yours: ${user.marks_percent}%` },
    { label: "Family Income",   check: user.annual_income_lpa <= (schol.max_family_income_lpa || 999), detail: `Limit: ₹${schol.max_family_income_lpa || "No limit"} LPA` },
    { label: "State/Region",    check: sStates.includes("all") || sStates.includes(toStr(user.state)), detail: sStates.includes("all") ? "All India" : sStates.join(", ") },
  ];
  const passCount = eligChecks.filter(c => c.check).length;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal modal-premium" style={{ maxWidth: 780 }} onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="modal-header modal-header-premium" style={{ flexWrap: "wrap", gap: 12 }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div className="flex items-center gap-2 mb-2" style={{ flexWrap: "wrap" }}>
              <span className={typeBadge(schol.type)} style={{ fontSize: 10, padding: "2px 8px" }}>{schol.type}</span>
              <span className={difficultyBadge(schol.difficulty)} style={{ fontSize: 10 }}>{schol.difficulty}</span>
              {schol.renewable && <span className="badge badge-green" style={{ fontSize: 10 }}>🔄 Renewable</span>}
            </div>
            <h2 style={{ fontSize: "clamp(16px, 4vw, 22px)", fontWeight: 800, color: "var(--navy)", fontFamily: "var(--font-display)", marginBottom: 4 }}>{schol.name}</h2>
            <p style={{ color: "var(--gray-500)", fontWeight: 600, fontSize: 14 }}>{schol.provider}</p>
          </div>
          <div className="flex items-center gap-4" style={{ flexWrap: "wrap" }}>
            <div>
              <div className="amount-pill" style={{ fontSize: "clamp(14px, 3vw, 18px)", padding: "8px 16px" }}>{schol.amount}</div>
              <div className={deadlineClass(schol.deadline) + " mt-2"} style={{ fontSize: 12, fontWeight: 700 }}>
                📅 {deadlineLabel(schol.deadline)}
              </div>
            </div>
            <button className="btn btn-ghost" onClick={onClose} style={{ fontSize: 20, padding: 8, borderRadius: "50%", width: 40, height: 40, display: "flex", alignItems: "center", justifyContent: "center" }}>✕</button>
          </div>
        </div>

        {/* Match Score Bar */}
        <div style={{ padding: "12px clamp(16px, 4vw, 32px)", background: "var(--gray-50)", borderBottom: "1px solid var(--gray-200)" }}>
          <div className="flex items-center gap-4" style={{ flexWrap: "wrap" }}>
            <span style={{ fontSize: 14, fontWeight: 700, color: "var(--navy)" }}>Match Analysis</span>
            <div className="match-bar-premium" style={{ flex: 1, minWidth: 80 }}>
              <div className="match-bar-fill" style={{ width: `${matchScore}%`, background: matchScore >= 80 ? "var(--success)" : matchScore >= 60 ? "var(--warning)" : "var(--gray-500)" }} />
            </div>
            <span style={{ fontWeight: 800, color: matchScore >= 80 ? "var(--success)" : "var(--warning)", fontSize: 18 }}>{matchScore}%</span>
            <span className="badge badge-gray" style={{ fontSize: 11 }}>{passCount}/{eligChecks.length} Criteria</span>
          </div>
        </div>

        {/* Tabs */}
        <div style={{ padding: "12px 32px 0", background: "#fff" }}>
          <div className="pill-tabs" style={{ marginBottom: 0 }}>
            {["overview","eligibility","documents","tips","faq"].map(t => (
              <button key={t} className={`pill-tab ${tab === t ? "active" : ""}`} onClick={() => setTab(t)} style={{ padding: "6px 16px", fontSize: 13 }}>
                {t.charAt(0).toUpperCase() + t.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div className="modal-body modal-body-premium" style={{ maxHeight: "60vh", overflowY: "auto" }}>
          {tab === "overview" && (
            <div>
              <h3 style={{ fontSize: 16, fontWeight: 800, marginBottom: 12, color: "var(--navy)" }}>About this Scholarship</h3>
              <p style={{ fontSize: 15, color: "var(--gray-600)", lineHeight: 1.7, marginBottom: 24 }}>{schol.eligibility_summary}</p>
              
              <div className="grid-2 gap-4 mb-6">
                {[
                  { icon: "💰", label: "Grant Amount", value: schol.amount },
                  { icon: "📅", label: "Deadline Date", value: new Date(schol.deadline).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" }) },
                  { icon: "⚙️", label: "Selection Mode", value: schol.selection_process },
                  { icon: "⏱️", label: "Apply Duration", value: `~${schol.apply_time_minutes || 45} minutes` },
                  { icon: "📈", label: "Success Odds", value: `${schol.success_rate_estimate}% (estimated)` },
                  { icon: "🔄", label: "Benefit Type", value: schol.renewable ? "Renewable Yearly" : "One-time Grant" },
                ].map(({ icon, label, value }) => (
                  <div key={label} style={{ padding: "16px", background: "var(--gray-50)", borderRadius: 12, border: "1px solid var(--gray-200)", display: "flex", gap: 12, alignItems: "center" }}>
                    <span style={{ fontSize: 20 }}>{icon}</span>
                    <div>
                      <div className="text-xs text-muted" style={{ fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.5px" }}>{label}</div>
                      <div style={{ fontWeight: 700, fontSize: 14, marginTop: 2, color: "var(--navy)" }}>{value}</div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex gap-2 flex-wrap">
                {schol.tags.map(t => <span key={t} className="tag" style={{ background: "var(--primary-light)", color: "var(--primary)", fontWeight: 700 }}>#{t}</span>)}
              </div>
            </div>
          )}

          {tab === "eligibility" && (
            <div>
              <h3 style={{ fontSize: 16, fontWeight: 800, marginBottom: 16, color: "var(--navy)" }}>Requirement Checklist</h3>
              {eligChecks.map((item, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 16, padding: "14px 18px", background: item.check ? "#f0fdf4" : "#fff7ed", borderRadius: 12, marginBottom: 10, border: `1px solid ${item.check ? "#bbf7d0" : "#fed7aa"}` }}>
                  <div style={{ width: 32, height: 32, borderRadius: "50%", background: item.check ? "#22c55e" : "#f97316", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 800, flexShrink: 0 }}>
                    {item.check ? "✓" : "!"}
                  </div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 15, color: item.check ? "#166534" : "#9a3412" }}>{item.label}</div>
                    <div style={{ fontSize: 13, color: item.check ? "#15803d" : "#c2410c", opacity: 0.8, marginTop: 2 }}>{item.detail}</div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {tab === "documents" && (
            <div>
              <h3 style={{ fontSize: 16, fontWeight: 800, marginBottom: 16, color: "var(--navy)" }}>Required Documents</h3>
              {(schol.required_documents || ["Aadhaar Card","Marksheet","Income Certificate","Admission Letter","Photograph"]).map((doc, i) => (
                <div key={i} className="flex items-center gap-4 mb-3" style={{ padding: "14px 20px", background: "#f9fafb", borderRadius: 12, border: "1px solid var(--gray-200)" }}>
                  <input type="checkbox" style={{ accentColor: "var(--primary)", width: 20, height: 20, cursor: "pointer" }} />
                  <span style={{ fontSize: 15, fontWeight: 600, color: "var(--navy)" }}>{doc}</span>
                </div>
              ))}
            </div>
          )}

          {tab === "tips" && (
            <div style={{ padding: "4px" }}>
              <h3 style={{ fontSize: 16, fontWeight: 800, marginBottom: 16, color: "var(--navy)" }}>Pro Tips for Success</h3>
              {[
                { title: "Early Bird Advantage", tip: "Apply at least 15 days before the deadline. Systems often slow down in the final 48 hours." },
                { title: "Personalize your SOP", tip: "Mention specific career goals. AI-generated SOPs work best when you add 2-3 personal stories." },
                { title: "Scan at High Quality", tip: "Ensure all documents are under 2MB but clearly legible. Use our 'Doc Compressor' if needed." },
                { title: "Verify Bank Details", tip: "Ensure your Aadhaar is linked to your bank account for seamless DBT (Direct Benefit Transfer)." },
              ].map((t, i) => (
                <div key={i} style={{ display: "flex", gap: 16, marginBottom: 20 }}>
                  <div style={{ width: 8, height: 8, borderRadius: "50%", background: "var(--primary)", marginTop: 6, flexShrink: 0 }} />
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 15, color: "var(--navy)" }}>{t.title}</div>
                    <p style={{ fontSize: 14, color: "var(--gray-600)", marginTop: 4, lineHeight: 1.5 }}>{t.tip}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {tab === "faq" && (
            <div>
              <h3 style={{ fontSize: 16, fontWeight: 800, marginBottom: 16, color: "var(--navy)" }}>Frequently Asked Questions</h3>
              {(schol.faq || []).length === 0 ? (
                <div style={{ textAlign: "center", padding: "40px 0" }}>
                  <div style={{ fontSize: 40, marginBottom: 12 }}>❓</div>
                  <p style={{ color: "var(--gray-500)" }}>No FAQs yet. Ask our AI Assistant for help!</p>
                </div>
              ) : (
                schol.faq.map((item, i) => (
                  <div key={i} className="dash-card" style={{ marginBottom: 12, padding: 20 }}>
                    <div style={{ fontWeight: 800, fontSize: 14, marginBottom: 8, color: "var(--primary)" }}>Q: {item.q}</div>
                    <p style={{ fontSize: 14, color: "var(--gray-600)", lineHeight: 1.6 }}>{item.a}</p>
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        <div className="modal-footer modal-footer-premium">
          <div style={{ display: "flex", gap: 8, width: "100%", justifyContent: "space-between", flexWrap: "wrap" }}>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              <button className="btn btn-primary" style={{ padding: "10px 16px", fontWeight: 700, fontSize: 13 }} onClick={() => onGenerateSOP(schol)}>✨ SOP</button>
              <button className={`btn ${isSaved ? "btn-secondary" : "btn-ghost"}`} style={{ fontSize: 13 }} onClick={() => onToggleSave(schol.id)}>
                {isSaved ? "✓ Saved" : "🔖 Save"}
              </button>
              <button className="btn btn-ghost" style={{ fontWeight: 700, fontSize: 13 }} onClick={() => onTrack(schol)}>📋 Track</button>
            </div>
            <button className="btn btn-primary" style={{ background: "var(--navy)", borderColor: "var(--navy)", fontSize: 13 }} onClick={() => window.open(schol.application_link || "https://scholarships.gov.in", "_blank")}>
              Apply →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
