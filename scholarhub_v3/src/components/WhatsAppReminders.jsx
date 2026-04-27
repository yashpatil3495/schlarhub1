import { useState } from "react";
import { daysUntil, deadlineLabel } from "../utils/helpers.js";

export default function WhatsAppReminders({ scholarships, saved, user }) {
  const [phone,     setPhone]     = useState(user.mobile || "");
  const [optedIn,   setOptedIn]   = useState(user.whatsapp_opted_in || false);
  const [otpSent,   setOtpSent]   = useState(false);
  const [otp,       setOtp]       = useState("");
  const [verified,  setVerified]  = useState(false);
  const [sending,   setSending]   = useState(false);
  const [remDays,   setRemDays]   = useState([30, 7, 3, 1]);

  const savedSchols = scholarships
    .filter(s => saved.has(s.id) && daysUntil(s.deadline) >= 0)
    .sort((a, b) => daysUntil(a.deadline) - daysUntil(b.deadline));

  // DEMO MODE: Real WhatsApp Business API (Twilio/WATI) is needed for production.
  // This simulates the OTP flow so the UI can be evaluated without credentials.
  const DEMO_OTP = "123456";
  const sendOTP = async () => {
    if (!phone || phone.length !== 10) return;
    setSending(true);
    await new Promise(r => setTimeout(r, 900));
    setOtpSent(true);
    setSending(false);
  };

  const [otpError, setOtpError] = useState("");
  const verifyOTP = async () => {
    if (!otp) return;
    setSending(true);
    setOtpError("");
    await new Promise(r => setTimeout(r, 800));
    if (otp === DEMO_OTP) {
      setVerified(true);
      setOptedIn(true);
    } else {
      setOtpError("Incorrect code. (Demo OTP: 123456)");
    }
    setSending(false);
  };

  const toggleDay = (d) => setRemDays(days => days.includes(d) ? days.filter(x => x !== d) : [...days, d]);

  const buildPreview = (schol) => {
    const days = daysUntil(schol.deadline);
    const urgency = days <= 1 ? "🚨 LAST DAY" : days <= 3 ? "⏰ Urgent" : "📢 Reminder";
    return `${urgency} — ScholarHub\n\n*${schol.name}* deadline is in *${days} day${days !== 1 ? "s" : ""}*.\n\n💰 Amount: ${schol.amount}\n📅 Deadline: ${new Date(schol.deadline).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}\n\nApply here: ${schol.application_link || "https://scholarships.gov.in"}\n\nReply STOP to unsubscribe.`;
  };

  return (
    <div className="fade-in" style={{ maxWidth: 760, margin: "0 auto" }}>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="section-title">WhatsApp Deadline Reminders</h1>
          <p className="section-sub">Get timely scholarship deadline reminders directly on WhatsApp — never miss an opportunity</p>
        </div>
        <div style={{ fontSize: 40 }}>📱</div>
      </div>

      <div className="grid-2 gap-4">
        {/* Setup */}
        <div>
          {!optedIn ? (
            <div className="card-lg">
              <h3 style={{ fontFamily: "'Sora', sans-serif", fontSize: 16, fontWeight: 700, marginBottom: 8 }}>Setup WhatsApp Reminders</h3>
              <div style={{ background: "#fffbeb", border: "1px solid #fde68a", borderRadius: 8, padding: "8px 12px", marginBottom: 16 }}>
                <span style={{ fontSize: 12, color: "#92400e" }}>⚠️ <strong>Demo mode</strong> — real SMS/WhatsApp delivery requires a Business API integration. Use OTP <strong>123456</strong> to test the flow.</span>
              </div>

              {/* Steps */}
              {[
                { step: 1, label: "Enter your WhatsApp number", done: phone.length === 10 },
                { step: 2, label: "Verify with OTP",            done: verified },
                { step: 3, label: "Save scholarships to receive reminders", done: saved.size > 0 },
              ].map(s => (
                <div key={s.step} className="flex items-center gap-3 mb-3">
                  <div style={{ width: 28, height: 28, borderRadius: "50%", background: s.done ? "var(--success)" : "var(--primary)", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 700, flexShrink: 0 }}>
                    {s.done ? "✓" : s.step}
                  </div>
                  <span style={{ fontSize: 14, fontWeight: s.done ? 400 : 600, textDecoration: s.done ? "line-through" : "none", color: s.done ? "var(--gray-500)" : "var(--gray-900)" }}>{s.label}</span>
                </div>
              ))}

              <div className="divider" />

              <div className="form-group">
                <label className="label">WhatsApp Number (India)</label>
                <div className="flex gap-2">
                  <div style={{ padding: "10px 12px", background: "var(--gray-50)", border: "1.5px solid var(--gray-200)", borderRadius: "var(--radius-sm)", fontSize: 14, fontWeight: 600 }}>+91</div>
                  <input className="input" type="tel" maxLength={10} value={phone}
                    onChange={e => setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
                    placeholder="9876543210" disabled={otpSent} style={{ flex: 1 }}
                    aria-label="WhatsApp mobile number, 10 digits"
                    autoComplete="tel-national" />
                </div>
              </div>

              {!otpSent ? (
                <button className="btn btn-full" style={{ background: "#25d366", color: "#fff", border: "none" }}
                  onClick={sendOTP} disabled={phone.length !== 10 || sending}>
                  {sending ? "Sending OTP…" : "📱 Send Verification OTP"}
                </button>
              ) : !verified ? (
                <>
                  <div className="card mb-3" style={{ background: "#f0fdf4", border: "1px solid #86efac", textAlign: "center" }}>
                    <p style={{ fontSize: 13, color: "#065f46" }}>⚙️ <strong>Demo mode</strong> — Real WhatsApp delivery requires a Business API key.<br/>Use demo OTP: <strong>123456</strong></p>
                  </div>
                  <div className="flex gap-2">
                    <input className="input" type="text" maxLength={6} value={otp} onChange={e => setOtp(e.target.value.replace(/\D/g,""))} placeholder="Enter 6-digit OTP" style={{ flex: 1, letterSpacing: 4, fontSize: 18, textAlign: "center" }} aria-label="6-digit verification code" inputMode="numeric" autoComplete="one-time-code" />
                    <button className="btn btn-primary" onClick={verifyOTP} disabled={!otp || sending}>{sending ? "Verifying…" : "Verify"}</button>
                  </div>
                  {otpError && <div style={{ color: "var(--danger)", fontSize: 13, marginTop: 6 }} role="alert">⚠️ {otpError}</div>}
                </>
              ) : (
                <div className="card" style={{ background: "#f0fdf4", border: "1px solid #86efac", textAlign: "center", padding: "20px" }}>
                  <div style={{ fontSize: 32, marginBottom: 8 }}>✅</div>
                  <div style={{ fontWeight: 700, color: "var(--success)" }}>WhatsApp verified!</div>
                  <p className="text-sm text-muted mt-1">Setting up reminders…</p>
                </div>
              )}

              <p className="text-xs text-muted text-center mt-3">Reply STOP to any message to unsubscribe instantly</p>
            </div>
          ) : (
            <div className="card-lg">
              <div style={{ textAlign: "center", marginBottom: 20 }}>
                <div style={{ fontSize: 40, marginBottom: 8 }}>✅</div>
                <h3 style={{ fontFamily: "'Sora', sans-serif", fontSize: 17, fontWeight: 700 }}>WhatsApp Reminders Active</h3>
                <p className="text-sm text-muted">+91 {phone}</p>
              </div>

              <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 10 }}>Remind me before deadline:</div>
              <div className="flex gap-2" style={{ flexWrap: "wrap", marginBottom: 16 }}>
                {[1, 3, 7, 15, 30].map(d => (
                  <button key={d} className={`btn btn-sm ${remDays.includes(d) ? "btn-primary" : "btn-ghost"}`}
                    onClick={() => toggleDay(d)}>
                    {d} {d === 1 ? "day" : "days"}
                  </button>
                ))}
              </div>

              <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 6 }}>Upcoming reminders ({savedSchols.length} scholarships):</div>
              {savedSchols.slice(0, 5).map(s => {
                const days = daysUntil(s.deadline);
                const nextRem = remDays.filter(d => d <= days).sort((a, b) => b - a)[0];
                return (
                  <div key={s.id} className="flex items-center justify-between" style={{ padding: "8px 0", borderBottom: "1px solid var(--gray-100)", fontSize: 13 }}>
                    <span style={{ flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{s.name}</span>
                    <span style={{ fontSize: 12, color: "var(--gray-500)", marginLeft: 8 }}>
                      {nextRem ? `Next reminder in ${days - nextRem} days` : "Deadline soon!"}
                    </span>
                  </div>
                );
              })}

              <button className="btn btn-danger btn-sm btn-full mt-4" onClick={() => { setOptedIn(false); setVerified(false); setOtpSent(false); setOtp(""); }}>
                Disable WhatsApp Reminders
              </button>
            </div>
          )}
        </div>

        {/* Message Preview */}
        <div>
          <h3 style={{ fontFamily: "'Sora', sans-serif", fontSize: 16, fontWeight: 700, marginBottom: 12 }}>Message Preview</h3>

          <div className="wa-container">
            {savedSchols.length === 0 ? (
              <div style={{ textAlign: "center", color: "#7c7c7c", padding: "24px" }}>
                <p style={{ fontSize: 14 }}>Save scholarships to see what reminders will look like</p>
              </div>
            ) : (
              <div className="wa-preview">
                <div style={{ fontSize: 10, color: "#667781", marginBottom: 6, fontWeight: 600 }}>ScholarHub · Just now</div>
                <div style={{ whiteSpace: "pre-line", fontSize: 14, lineHeight: 1.6 }}>
                  {buildPreview(savedSchols[0]).split("\n").map((line, i) => {
                    const bold = line.replace(/\*([^*]+)\*/g, "<strong>$1</strong>");
                    return <div key={i} dangerouslySetInnerHTML={{ __html: bold }} />;
                  })}
                </div>
                <div style={{ fontSize: 11, color: "#667781", marginTop: 8, textAlign: "right" }}>✓✓ Delivered</div>
              </div>
            )}
          </div>

          <div className="card mt-4" style={{ background: "#eff6ff", border: "1px solid #bfdbfe" }}>
            <div style={{ fontWeight: 700, fontSize: 13, marginBottom: 8, color: "var(--primary)" }}>ℹ️ How it works</div>
            <div className="timeline-step">
              <div className="timeline-dot" />
              <div><div style={{ fontWeight: 600, fontSize: 13 }}>You save a scholarship</div><p className="text-xs text-muted">Reminders are automatically scheduled</p></div>
            </div>
            <div className="timeline-step">
              <div className="timeline-dot" />
              <div><div style={{ fontWeight: 600, fontSize: 13 }}>We send reminders at 8am IST</div><p className="text-xs text-muted">On your chosen days (30d, 7d, 3d, 1d)</p></div>
            </div>
            <div className="timeline-step">
              <div className="timeline-dot" />
              <div><div style={{ fontWeight: 600, fontSize: 13 }}>Reply STOP to unsubscribe</div><p className="text-xs text-muted">Instant opt-out at any time</p></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
