// src/components/OnboardingWizard.jsx — Step-by-step profile completion wizard
import { useState } from "react";
import { useAuth } from "../contexts/AuthContext.jsx";

const STEPS = [
  { key: "basic", title: "Basic Info", icon: "👤", fields: ["name", "gender", "state"] },
  { key: "academic", title: "Academics", icon: "📚", fields: ["level", "field", "specialisation", "college", "marks_percent"] },
  { key: "financial", title: "Financial", icon: "💰", fields: ["annual_income_lpa", "category", "is_first_gen"] },
  { key: "goals", title: "Goals", icon: "🎯", fields: ["goals"] },
];

const STATES = [
  "Andhra Pradesh","Arunachal Pradesh","Assam","Bihar","Chhattisgarh","Delhi","Goa",
  "Gujarat","Haryana","Himachal Pradesh","Jharkhand","Karnataka","Kerala",
  "Madhya Pradesh","Maharashtra","Manipur","Meghalaya","Mizoram","Nagaland",
  "Odisha","Punjab","Rajasthan","Sikkim","Tamil Nadu","Telangana","Tripura",
  "Uttar Pradesh","Uttarakhand","West Bengal",
];

export default function OnboardingWizard({ onComplete }) {
  const { profile, updateProfile } = useAuth();
  const [step, setStep] = useState(0);
  const [form, setForm] = useState({
    name: profile?.name || "",
    gender: profile?.gender || "",
    state: profile?.state || "",
    level: profile?.level || "",
    field: profile?.field || "",
    specialisation: profile?.specialisation || "",
    college: profile?.college || "",
    marks_percent: profile?.marks_percent || "",
    annual_income_lpa: profile?.annual_income_lpa || "",
    category: profile?.category || "",
    is_first_gen: profile?.is_first_gen || false,
    goals: profile?.goals || "",
  });
  const [saving, setSaving] = useState(false);

  const update = (k, v) => setForm(prev => ({ ...prev, [k]: v }));
  const currentStep = STEPS[step];
  const isLast = step === STEPS.length - 1;

  const handleNext = async () => {
    if (isLast) {
      setSaving(true);
      try {
        await updateProfile(form);
        onComplete?.();
      } catch (err) {
        console.error("Profile update error:", err);
      } finally {
        setSaving(false);
      }
    } else {
      setStep(s => s + 1);
    }
  };

  const selectStyle = {
    width: "100%", padding: "12px 14px", border: "1.5px solid var(--gray-200)",
    borderRadius: "12px", fontSize: 14, background: "var(--bg-card)",
    color: "var(--gray-900)", fontFamily: "var(--font)", outline: "none",
    cursor: "pointer", transition: "border-color 0.2s",
  };

  const inputStyle = {
    ...selectStyle, cursor: "text",
  };

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 300, background: "rgba(15,23,42,0.6)",
      backdropFilter: "blur(8px)", display: "flex", alignItems: "center", justifyContent: "center",
      padding: "16px 12px", overflowY: "auto",
    }}>
      <div style={{
        background: "var(--bg-card, #fff)", borderRadius: 24, maxWidth: 520, width: "100%",
        overflow: "hidden", boxShadow: "0 25px 60px rgba(0,0,0,0.25)",
        animation: "fadeIn 0.3s ease", maxHeight: "90vh", display: "flex", flexDirection: "column",
      }}>
        {/* Progress bar */}
        <div style={{
          height: 4, background: "var(--gray-200)",
        }}>
          <div style={{
            height: "100%", width: `${((step + 1) / STEPS.length) * 100}%`,
            background: "linear-gradient(90deg, var(--primary), var(--accent))",
            borderRadius: 2, transition: "width 0.4s ease",
          }} />
        </div>

        {/* Header */}
        <div style={{ padding: "20px 20px 0", flex: "none" }}>
          <div style={{ display: "flex", gap: 8, marginBottom: 24 }}>
            {STEPS.map((s, i) => (
              <div key={s.key} style={{
                flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 6,
              }}>
                <div style={{
                  width: 40, height: 40, borderRadius: 12, display: "flex",
                  alignItems: "center", justifyContent: "center", fontSize: 18,
                  background: i <= step ? "var(--primary-pale)" : "var(--gray-100)",
                  border: `2px solid ${i === step ? "var(--primary)" : i < step ? "var(--success)" : "transparent"}`,
                  transition: "all 0.3s",
                }}>
                  {i < step ? "✓" : s.icon}
                </div>
                <span style={{
                  fontSize: 10, fontWeight: 700,
                  color: i <= step ? "var(--primary)" : "var(--gray-500)",
                }}>{s.title}</span>
              </div>
            ))}
          </div>

          <h2 style={{
            fontFamily: "var(--font-display)", fontSize: 22, fontWeight: 800,
            color: "var(--navy)", marginBottom: 4,
          }}>
            {currentStep.icon} {currentStep.title}
          </h2>
          <p style={{ color: "var(--gray-500)", fontSize: 14, marginBottom: 24 }}>
            {step === 0 && "Let's start with your basic information."}
            {step === 1 && "Tell us about your academic background."}
            {step === 2 && "This helps match you with need-based scholarships."}
            {step === 3 && "What are you working towards?"}
          </p>
        </div>

        {/* Form fields */}
        <div style={{ padding: "0 20px 24px", display: "flex", flexDirection: "column", gap: 14, overflowY: "auto", flex: 1 }}>
          {step === 0 && (<>
            <div>
              <label style={{ display: "block", fontSize: 13, fontWeight: 600, marginBottom: 6, color: "var(--gray-700)" }}>Full Name</label>
              <input style={inputStyle} value={form.name} onChange={e => update("name", e.target.value)} placeholder="Your full name" />
            </div>
            <div>
              <label style={{ display: "block", fontSize: 13, fontWeight: 600, marginBottom: 6, color: "var(--gray-700)" }}>Gender</label>
              <select style={selectStyle} value={form.gender} onChange={e => update("gender", e.target.value)}>
                <option value="">Select gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div>
              <label style={{ display: "block", fontSize: 13, fontWeight: 600, marginBottom: 6, color: "var(--gray-700)" }}>State</label>
              <select style={selectStyle} value={form.state} onChange={e => update("state", e.target.value)}>
                <option value="">Select state</option>
                {STATES.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          </>)}

          {step === 1 && (<>
            <div>
              <label style={{ display: "block", fontSize: 13, fontWeight: 600, marginBottom: 6, color: "var(--gray-700)" }}>Study Level</label>
              <select style={selectStyle} value={form.level} onChange={e => update("level", e.target.value)}>
                <option value="">Select level</option>
                <option value="undergraduate">Undergraduate</option>
                <option value="postgraduate">Postgraduate</option>
                <option value="doctoral">Doctoral</option>
                <option value="diploma">Diploma</option>
              </select>
            </div>
            <div>
              <label style={{ display: "block", fontSize: 13, fontWeight: 600, marginBottom: 6, color: "var(--gray-700)" }}>Field of Study</label>
              <select style={selectStyle} value={form.field} onChange={e => update("field", e.target.value)}>
                <option value="">Select field</option>
                {["engineering","medical","science","arts","commerce","law","management"].map(f =>
                  <option key={f} value={f}>{f.charAt(0).toUpperCase()+f.slice(1)}</option>
                )}
              </select>
            </div>
            <div>
              <label style={{ display: "block", fontSize: 13, fontWeight: 600, marginBottom: 6, color: "var(--gray-700)" }}>Specialisation</label>
              <input style={inputStyle} value={form.specialisation} onChange={e => update("specialisation", e.target.value)} placeholder="e.g. Computer Science" />
            </div>
            <div>
              <label style={{ display: "block", fontSize: 13, fontWeight: 600, marginBottom: 6, color: "var(--gray-700)" }}>College / University</label>
              <input style={inputStyle} value={form.college} onChange={e => update("college", e.target.value)} placeholder="Your institution name" />
            </div>
            <div>
              <label style={{ display: "block", fontSize: 13, fontWeight: 600, marginBottom: 6, color: "var(--gray-700)" }}>Marks (%)</label>
              <input type="number" style={inputStyle} value={form.marks_percent} onChange={e => update("marks_percent", Number(e.target.value))} placeholder="e.g. 85" min="0" max="100" />
            </div>
          </>)}

          {step === 2 && (<>
            <div>
              <label style={{ display: "block", fontSize: 13, fontWeight: 600, marginBottom: 6, color: "var(--gray-700)" }}>Annual Family Income (LPA)</label>
              <select style={selectStyle} value={form.annual_income_lpa} onChange={e => update("annual_income_lpa", Number(e.target.value))}>
                <option value="">Select range</option>
                <option value="1">Below ₹1 LPA</option>
                <option value="2.5">₹1 - 2.5 LPA</option>
                <option value="5">₹2.5 - 5 LPA</option>
                <option value="8">₹5 - 8 LPA</option>
                <option value="12">₹8 - 12 LPA</option>
                <option value="20">Above ₹12 LPA</option>
              </select>
            </div>
            <div>
              <label style={{ display: "block", fontSize: 13, fontWeight: 600, marginBottom: 6, color: "var(--gray-700)" }}>Category</label>
              <select style={selectStyle} value={form.category} onChange={e => update("category", e.target.value)}>
                <option value="">Select category</option>
                {["General","OBC","SC","ST","EWS","Minority"].map(c =>
                  <option key={c} value={c}>{c}</option>
                )}
              </select>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 0" }}>
              <label className="toggle-switch">
                <input type="checkbox" checked={form.is_first_gen} onChange={e => update("is_first_gen", e.target.checked)} />
                <span className="toggle-slider" />
              </label>
              <span style={{ fontSize: 14, fontWeight: 600, color: "var(--gray-700)" }}>First generation college student</span>
            </div>
          </>)}

          {step === 3 && (<>
            <div>
              <label style={{ display: "block", fontSize: 13, fontWeight: 600, marginBottom: 6, color: "var(--gray-700)" }}>Career Goals & Aspirations</label>
              <textarea
                style={{ ...inputStyle, minHeight: 140, resize: "vertical", lineHeight: 1.7 }}
                value={form.goals}
                onChange={e => update("goals", e.target.value)}
                placeholder="Where do you see yourself in 5 years? What impact do you want to make?"
              />
            </div>
          </>)}

          {/* Navigation */}
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 12, gap: 12 }}>
            {step > 0 ? (
              <button className="btn btn-ghost" onClick={() => setStep(s => s - 1)}>← Back</button>
            ) : (
              <button className="btn btn-ghost" onClick={onComplete} style={{ color: "var(--gray-500)" }}>Skip for now</button>
            )}
            <button
              className="btn btn-primary"
              onClick={handleNext}
              disabled={saving}
              style={{ minWidth: 140 }}
            >
              {saving ? (
                <><span className="ap-spinner" style={{ width: 16, height: 16 }} /> Saving...</>
              ) : isLast ? (
                "Complete Profile ✨"
              ) : (
                "Next Step →"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
