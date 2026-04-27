import { useState } from "react";
import { useAuth } from "../contexts/AuthContext.jsx";

const SECTIONS = [
  {
    id: "personal", title: "Personal Details", icon: "👤",
    fields: [
      { key: "name",     label: "Full Name",     type: "text",   placeholder: "Your full name" },
      { key: "dob",      label: "Date of Birth", type: "date"  },
      { key: "gender",   label: "Gender",        type: "select", options: ["Female","Male","Non-binary","Prefer not to say"] },
      { key: "mobile",   label: "Mobile Number", type: "tel",    placeholder: "10-digit number" },
      { key: "state",    label: "State / UT",    type: "select", options: ["Maharashtra","Delhi","Karnataka","Tamil Nadu","Uttar Pradesh","Gujarat","Rajasthan","West Bengal"] },
      { key: "city",     label: "City",          type: "text",   placeholder: "Your city" },
      { key: "category", label: "Category",      type: "select", options: ["General","OBC","SC","ST","EWS","Minority","Women","Disabled","Sports"] },
    ]
  },
  {
    id: "academic", title: "Academic Details", icon: "🎓",
    fields: [
      { key: "level",             label: "Current Level",       type: "select", options: ["class9-10","class11-12","undergraduate","postgraduate","phd","diploma"] },
      { key: "field",             label: "Field of Study",      type: "select", options: ["engineering","medical","science","arts","commerce","law","management","general"] },
      { key: "specialisation",    label: "Specialisation",      type: "text",   placeholder: "e.g. Electronics Engineering" },
      { key: "college",           label: "College / School",    type: "text",   placeholder: "Institution name" },
      { key: "marks_percent",     label: "Last Exam Marks (%)", type: "number", placeholder: "e.g. 78" },
      { key: "cgpa",              label: "Current CGPA",        type: "number", placeholder: "e.g. 7.8" },
    ]
  },
  {
    id: "financial", title: "Financial Details", icon: "💰",
    fields: [
      { key: "annual_income_lpa", label: "Annual Family Income (LPA)",  type: "number", placeholder: "e.g. 3.5" },
      { key: "is_first_gen",      label: "First-Generation Student?",   type: "select", options: ["true","false"] },
    ]
  }
];

export default function ProfilePage() {
  const { profile, updateProfile, signOut, user } = useAuth();
  const [form, setForm] = useState(profile || {});
  const [saving, setSaving] = useState(false);
  const [ok, setOk] = useState(false);
  const [tab, setTab] = useState("personal");

  const handleChange = (key, val) => { setForm(f => ({ ...f, [key]: val })); setOk(false); };

  const handleSave = async () => {
    setSaving(true);
    try {
      await updateProfile(form);
      setOk(true);
    } catch (e) { console.error(e); }
    setSaving(false);
  };

  const pct = profile?.profile_complete || 0;
  const cur = SECTIONS.find(s => s.id === tab);

  return (
    <div className="fade-in" style={{ maxWidth: 840, margin: "0 auto" }}>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="dash-section-title" style={{ fontSize: 24, marginBottom: 4 }}>
            <div className="icon-badge" style={{ background: "#f0fdf4", color: "#166534", width: 36, height: 36 }}>👤</div>
            Your Profile
          </h1>
          <p style={{ color: "var(--gray-500)", fontSize: 14 }}>Complete your profile to unlock more scholarship matches.</p>
        </div>
        <button className="btn btn-ghost" style={{ fontWeight: 700, color: "var(--danger)" }} onClick={signOut}>Sign Out</button>
      </div>

      <div className="premium-card mb-8" style={{ padding: "32px 40px" }}>
        <div className="flex items-center gap-8">
          <div style={{
            width: 90, height: 90, borderRadius: "50%",
            background: "linear-gradient(135deg, var(--primary) 0%, #6366f1 100%)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 36, fontWeight: 800, color: "#fff",
            boxShadow: "0 10px 25px rgba(26,86,219,0.3)",
            flexShrink: 0, border: "4px solid #fff"
          }}>
            {(profile?.name || user?.email || "?")[0]?.toUpperCase()}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <h2 style={{ fontWeight: 800, fontSize: 24, color: "var(--navy)", marginBottom: 4 }}>{profile?.name || "Scholar Hub User"}</h2>
            <p style={{ fontSize: 15, color: "var(--gray-500)", fontWeight: 500 }}>{user?.email}</p>
            <div className="mt-6" style={{ maxWidth: 400 }}>
              <div className="flex justify-between mb-2">
                <span style={{ fontSize: 11, fontWeight: 800, color: "var(--gray-400)", textTransform: "uppercase", letterSpacing: "0.5px" }}>Profile Strength</span>
                <span style={{ fontSize: 13, fontWeight: 800, color: "var(--primary)" }}>{pct}%</span>
              </div>
              <div className="match-bar-premium" style={{ height: 10, background: "var(--gray-100)" }}>
                <div className="match-bar-fill" style={{ width: `${pct}%`, borderRadius: 10 }} />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-center mb-8">
        <div className="pill-tabs" style={{ background: "rgba(0,0,0,0.03)", padding: 6, borderRadius: 16, display: "flex", gap: 4 }}>
          {SECTIONS.map(s => (
            <button key={s.id} className={`pill-tab ${tab === s.id ? "active" : ""}`} onClick={() => setTab(s.id)} style={{ padding: "10px 24px", fontSize: 14, borderRadius: 12, border: "none" }}>
              <span style={{ marginRight: 8 }}>{s.icon}</span>
              {s.title}
            </button>
          ))}
        </div>
      </div>

      {cur && (
        <div className="dash-card" style={{ padding: 40 }}>
          <div className="grid-2 gap-x-8 gap-y-6">
            {cur.fields.map(field => (
              <div key={field.key} className="form-group">
                <label style={{ display: "block", fontSize: 13, fontWeight: 700, marginBottom: 8, color: "var(--navy)" }}>{field.label}</label>
                {field.type === "select" ? (
                  <select className="input" value={form[field.key] ?? ""} onChange={e => handleChange(field.key, e.target.value)} style={{ borderRadius: 12, height: 48 }}>
                    <option value="">Select option</option>
                    {field.options?.map(o => <option key={o} value={o}>{o}</option>)}
                  </select>
                ) : (
                  <input className="input" type={field.type} value={form[field.key] ?? ""} onChange={e => handleChange(field.key, e.target.value)} placeholder={field.placeholder} style={{ borderRadius: 12, height: 48, padding: "0 16px" }} />
                )}
              </div>
            ))}
          </div>
          
          <div className="mt-10 flex items-center justify-between">
            <button className="btn btn-primary" style={{ padding: "12px 32px", borderRadius: 12, fontWeight: 800 }} onClick={handleSave} disabled={saving}>
              {saving ? "Saving Changes..." : "💾 Save Profile"}
            </button>
            {ok && <span style={{ color: "var(--success)", fontWeight: 700, fontSize: 14 }}>✅ Changes saved successfully!</span>}
          </div>
        </div>
      )}
    </div>
  );
}
