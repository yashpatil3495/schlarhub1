import { useState, useRef } from "react";

const DOC_TYPES = [
  { key: "aadhaar",       label: "Aadhaar Card",                icon: "🪪", required: true  },
  { key: "marksheet_12",  label: "Class 12 Marksheet",           icon: "📊", required: true  },
  { key: "marksheet_10",  label: "Class 10 Marksheet",           icon: "📊", required: false },
  { key: "income_cert",   label: "Income Certificate",           icon: "💰", required: true  },
  { key: "caste_cert",    label: "Caste Certificate (SC/ST/OBC)",icon: "📋", required: false },
  { key: "domicile",      label: "Domicile Certificate",         icon: "🏠", required: false },
  { key: "admission",     label: "Admission / Bonafide Letter",  icon: "🎓", required: true  },
  { key: "bank_passbook", label: "Bank Passbook / Cheque",       icon: "🏦", required: true  },
  { key: "photo",         label: "Passport-size Photograph",     icon: "📷", required: true  },
  { key: "minority_cert", label: "Minority Certificate",         icon: "📜", required: false },
  { key: "disability",    label: "Disability Certificate",       icon: "♿", required: false },
  { key: "college_id",    label: "College / Student ID",         icon: "🪪", required: false },
];

const TEMPLATES = [
  { id: "income_letter",   title: "Income Certificate Request",   lang: ["English","Hindi","Marathi"], icon: "💰", desc: "Letter to Tehsildar/SDM requesting income certificate" },
  { id: "bonafide",        title: "Bonafide Certificate Request", lang: ["English"],                   icon: "🎓", desc: "Request letter to college principal/registrar" },
  { id: "recommendation",  title: "Recommendation Letter",        lang: ["English"],                   icon: "📝", desc: "Template for teachers/professors to fill" },
  { id: "cover_letter",    title: "Scholarship Cover Letter",     lang: ["English","Hindi"],            icon: "📧", desc: "Generic cover letter for scholarship applications" },
  { id: "declaration",     title: "Student Declaration",          lang: ["English","Hindi","Marathi"],  icon: "✍️", desc: "Self-declaration regarding family income and documents" },
];

const TEMPLATE_CONTENT = {
  income_letter: `To,\nThe Tehsildar / Revenue Officer,\n[District Name] District,\n[State]\n\nSubject: Request for Income Certificate for Scholarship Application...`,
  bonafide: `To,\nThe Principal / Registrar,\n[Institution Name]\n\nSubject: Request for Bonafide Certificate for Scholarship Application...`,
  declaration: `STUDENT DECLARATION\n\nI, [Full Name], son/daughter of [Father's Name]...`,
};

export default function DocumentCenter({ user }) {
  const [tab, setTab] = useState("vault");
  const [docs, setDocs] = useState({ aadhaar: true, marksheet_12: true, income_cert: true });
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [templateLang, setTemplateLang] = useState("English");
  const fileInputRef = useRef();

  const uploadedCount = Object.values(docs).filter(Boolean).length;
  const totalRequired = DOC_TYPES.filter(d => d.required).length;
  const readyPercent  = Math.round((Object.entries(docs).filter(([k, v]) => v && DOC_TYPES.find(d => d.key === k)?.required).length / totalRequired) * 100);

  return (
    <div className="fade-in">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="dash-section-title" style={{ fontSize: 24, marginBottom: 4 }}>
            <div className="icon-badge" style={{ background: "#fdf2f8", color: "#db2777", width: 36, height: 36 }}>📂</div>
            Document Center
          </h1>
          <p style={{ color: "var(--gray-500)", fontSize: 14 }}>Securely store and manage your scholarship documents.</p>
        </div>
        <div style={{ textAlign: "right" }}>
          <div style={{ fontWeight: 800, fontSize: 28, color: "var(--primary)" }}>{readyPercent}%</div>
          <div style={{ fontSize: 11, fontWeight: 700, color: "var(--gray-400)", textTransform: "uppercase" }}>Readiness Score</div>
        </div>
      </div>

      <div className="dash-card mb-8" style={{ padding: "24px 32px" }}>
        <div className="flex items-center justify-between mb-4">
          <div>
            <div style={{ fontWeight: 800, fontSize: 15, color: "var(--navy)" }}>Vault Status</div>
            <p style={{ fontSize: 13, color: "var(--gray-500)", marginTop: 2 }}>{uploadedCount} of {DOC_TYPES.length} documents uploaded</p>
          </div>
          <span className={`badge ${readyPercent === 100 ? "badge-green" : "badge-amber"}`} style={{ padding: "6px 12px", borderRadius: 8 }}>
            {readyPercent === 100 ? "✅ FULLY PREPARED" : "🛠️ IN PROGRESS"}
          </span>
        </div>
        <div className="match-bar-premium">
          <div className="match-bar-fill" style={{ width: `${readyPercent}%`, background: readyPercent === 100 ? "#10b981" : "var(--primary)" }} />
        </div>
      </div>

      <div className="pill-tabs">
        <button className={`pill-tab ${tab === "vault" ? "active" : ""}`} onClick={() => setTab("vault")}>📁 Document Vault</button>
        <button className={`pill-tab ${tab === "templates" ? "active" : ""}`} onClick={() => setTab("templates")}>📝 Request Templates</button>
        <button className={`pill-tab ${tab === "guides" ? "active" : ""}`} onClick={() => setTab("guides")}>📚 Portal Guides</button>
      </div>

      {tab === "vault" && (
        <div className="grid-2 gap-4">
          {DOC_TYPES.map(doc => (
            <div key={doc.key} className="premium-card" style={{ padding: 20, display: "flex", gap: 16, alignItems: "center", border: docs[doc.key] ? "1px solid #10b981" : "1px solid var(--gray-200)" }}>
              <div style={{ width: 44, height: 44, borderRadius: 12, background: docs[doc.key] ? "#ecfdf5" : "var(--gray-50)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, flexShrink: 0 }}>
                {docs[doc.key] ? "✅" : doc.icon}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 800, fontSize: 14, color: "var(--navy)" }}>{doc.label}</div>
                <div style={{ fontSize: 11, color: "var(--gray-500)", marginTop: 2 }}>{doc.required ? "Required" : "Optional"}</div>
              </div>
              <div className="flex items-center gap-3">
                <button className="btn btn-ghost btn-sm" onClick={() => fileInputRef.current?.click()} style={{ fontSize: 11, fontWeight: 700 }}>Upload</button>
                <input type="checkbox" checked={!!docs[doc.key]} onChange={e => setDocs(d => ({ ...d, [doc.key]: e.target.checked }))} style={{ width: 20, height: 20, accentColor: "var(--primary)" }} />
              </div>
            </div>
          ))}
          <input ref={fileInputRef} type="file" style={{ display: "none" }} />
        </div>
      )}

      {tab === "templates" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {TEMPLATES.map(t => (
            <div key={t.id} className="premium-card" style={{ padding: 20, cursor: "pointer" }} onClick={() => setSelectedTemplate(t)}>
              <div className="flex items-center gap-4">
                <div style={{ width: 50, height: 50, borderRadius: 12, background: "var(--primary-light)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24 }}>{t.icon}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 800, fontSize: 15, color: "var(--navy)" }}>{t.title}</div>
                  <p style={{ fontSize: 13, color: "var(--gray-500)", marginTop: 2 }}>{t.desc}</p>
                </div>
                <div className="flex gap-2">
                  {t.lang.map(l => <span key={l} className="badge badge-gray" style={{ fontSize: 10 }}>{l}</span>)}
                </div>
                <button className="btn btn-ghost btn-sm" style={{ fontWeight: 700, color: "var(--primary)" }}>View →</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {tab === "guides" && (
        <div className="grid-2 gap-6">
          {[
            { name: "National Scholarship Portal", icon: "🇮🇳", color: "#eff6ff" },
            { name: "AICTE Pragati / Saksham", icon: "⚙️", color: "#f5f3ff" },
            { name: "Mahadbf Maharashtra", icon: "🏛️", color: "#ecfdf5" },
            { name: "UP Scholarship Portal", icon: "🎓", color: "#fffbeb" },
          ].map(g => (
            <div key={g.name} className="premium-card" style={{ background: g.color, border: "none", padding: 24 }}>
              <div style={{ fontSize: 32, marginBottom: 16 }}>{g.icon}</div>
              <h3 style={{ fontWeight: 800, fontSize: 16, color: "var(--navy)", marginBottom: 12 }}>{g.name}</h3>
              <p style={{ fontSize: 13, color: "var(--gray-600)", lineHeight: 1.6 }}>Step-by-step registration and document verification guide updated for 2026 cycle.</p>
              <button className="btn btn-primary btn-sm mt-6" style={{ background: "rgba(0,0,0,0.1)", color: "var(--navy)", border: "none" }}>Read Guide →</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
