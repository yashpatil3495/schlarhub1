// src/components/ScholarshipImporter.jsx
// AI-powered scholarship importer — paste a URL or raw text,
// Claude extracts structured fields and saves to Supabase.

import { useState } from "react";
import { callClaudeSync } from "../utils/claude.js";
import { supabase } from "../lib/supabase.js";
import { SCHOLARSHIPS as LOCAL_DATA } from "../data/scholarships.js";

const FIELDS_PROMPT = `Extract scholarship details from the text below and return ONLY a valid JSON object with these exact keys (no markdown, no explanation):
{
  "id": "kebab-case-unique-id",
  "name": "Full scholarship name",
  "provider": "Organisation name",
  "type": "government | private | ngo | international",
  "field": ["engineering","medical","science","arts","commerce","law","management","diploma","general"],
  "level": ["class9-10","class11-12","undergraduate","postgraduate","phd","diploma"],
  "categories": ["general","obc","sc","st","ews","minority","women","disabled","sports"],
  "states": ["all"] or ["Maharashtra","Delhi",...],
  "amount": "Human readable amount string e.g. ₹50,000/year",
  "amount_value": numeric value in INR,
  "deadline": "YYYY-MM-DD or null",
  "open_date": "YYYY-MM-DD or null",
  "renewable": true or false,
  "eligibility_summary": "2-3 sentence plain English summary",
  "min_marks_percent": numeric (0 if not specified),
  "max_family_income_lpa": numeric (999 if no limit),
  "difficulty": "easy | medium | hard",
  "success_rate_estimate": numeric percentage (guess based on selectivity),
  "selection_process": "merit | merit+interview | essay | exam",
  "interview_details": "string or null",
  "required_documents": ["list","of","documents"],
  "application_link": "URL or null",
  "official_portal": "URL or null",
  "apply_time_minutes": numeric estimate,
  "tags": ["relevant","tags"],
  "faq": [{"q":"Question?","a":"Answer."}]
}

Scholarship text:
`;

const EMPTY = {
  name:"",provider:"",type:"government",amount:"",deadline:"",
  eligibility_summary:"",min_marks_percent:0,max_family_income_lpa:999,
  application_link:"",difficulty:"medium",renewable:false
};

export default function ScholarshipImporter() {
  const [mode,      setMode]      = useState("text"); // "text" | "url"
  const [input,     setInput]     = useState("");
  const [loading,   setLoading]   = useState(false);
  const [extracted, setExtracted] = useState(null);
  const [error,     setError]     = useState("");
  const [saved,     setSaved]     = useState(false);
  const [saving,    setSaving]    = useState(false);

  async function handleExtract() {
    setError(""); setExtracted(null); setSaved(false);
    if (!input.trim()) { setError("Paste some text or a URL first."); return; }
    setLoading(true);
    try {
      let text = input;
      // If URL — try to fetch via a CORS proxy for plain pages
      if (mode === "url") {
        try {
          const r = await fetch(`https://api.allorigins.win/get?url=${encodeURIComponent(input)}`);
          const j = await r.json();
          // Strip HTML tags
          text = j.contents.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").slice(0, 8000);
        } catch {
          text = `Scholarship URL: ${input}\n(Could not fetch page content — please paste the text instead)`;
        }
      }
      const raw = await callClaudeSync(FIELDS_PROMPT + text, "", 1500);
      // Strip markdown fences if present
      const clean = raw.replace(/```json|```/g,"").trim();
      const data  = JSON.parse(clean);
      setExtracted(data);
    } catch(e) {
      setError("Extraction failed: " + e.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleSave() {
    if (!extracted) return;
    setSaving(true); setError("");
    try {
      const { error } = await supabase
        .from("scholarships")
        .upsert(extracted, { onConflict: "id" });
      if (error) throw error;
      setSaved(true);
    } catch(e) {
      setError("Save failed: " + e.message + "\n(Make sure the scholarships table has matching columns)");
    } finally {
      setSaving(false);
    }
  }

  async function handleBulkSync() {
    if (!confirm(`This will push all ${LOCAL_DATA.length} scholarships from the local database to the portal. Continue?`)) return;
    setSaving(true); setError("");
    try {
      const { error } = await supabase
        .from("scholarships")
        .upsert(LOCAL_DATA, { onConflict: "id" });
      if (error) throw error;
      setSaved(true);
      alert("✅ Successfully synced all scholarships to the database!");
    } catch(e) {
      setError("Bulk sync failed: " + e.message);
    } finally {
      setSaving(false);
    }
  }

  function handleFieldChange(key, val) {
    setExtracted(prev => ({ ...prev, [key]: val }));
  }

  const fieldStyle = {
    width:"100%", padding:"8px 10px", borderRadius:8,
    border:"1.5px solid var(--border)", background:"var(--surface)",
    color:"var(--text)", fontSize:13, marginBottom:8, boxSizing:"border-box"
  };

  return (
    <div className="fade-in" style={{ maxWidth: 820, margin: "0 auto", padding: "0 4px" }}>
      <div style={{ marginBottom: 20 }}>
        <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 4 }}>📥 Scholarship Importer</h2>
        <p style={{ color: "var(--text-muted)", fontSize: 13 }}>
          Paste scholarship text from Buddy4Study, NSP, or any NGO site — AI extracts all fields and saves to your database.
        </p>
      </div>

      {/* Mode toggle */}
      <div style={{ display:"flex", gap:8, marginBottom:14 }}>
        {["text","url"].map(m => (
          <button key={m} onClick={() => setMode(m)}
            style={{ padding:"6px 18px", borderRadius:20, border:"1.5px solid var(--border)",
              background: mode===m ? "var(--primary)" : "var(--surface)",
              color: mode===m ? "#fff" : "var(--text)", cursor:"pointer", fontSize:13, fontWeight:600 }}>
            {m === "text" ? "📋 Paste Text" : "🔗 Paste URL"}
          </button>
        ))}
      </div>

      {/* Input */}
      <textarea
        value={input}
        onChange={e => setInput(e.target.value)}
        placeholder={mode === "url"
          ? "https://www.buddy4study.com/scholarship/..."
          : "Paste the full scholarship description here — eligibility, amount, deadline, documents, etc."}
        style={{ ...fieldStyle, height:150, resize:"vertical", marginBottom:12 }}
      />

      <button onClick={handleExtract} disabled={loading}
        style={{ width:"100%", padding:"12px", borderRadius:10, border:"none",
          background:"var(--primary)", color:"#fff", fontWeight:700, fontSize:15,
          cursor: loading ? "not-allowed" : "pointer", opacity: loading ? 0.7 : 1, marginBottom:16 }}>
        {loading ? "⏳ Extracting with AI…" : "✨ Extract Scholarship Fields"}
      </button>

      <button onClick={handleBulkSync} disabled={saving}
        style={{ width:"100%", padding:"12px", borderRadius:10, border:"2px solid var(--primary)",
          background:"transparent", color:"var(--primary)", fontWeight:700, fontSize:15,
          cursor: saving ? "not-allowed" : "pointer", opacity: saving ? 0.7 : 1, marginBottom:16 }}>
        {saving ? "⏳ Syncing Database…" : `🔄 Sync Database (${LOCAL_DATA.length} Scholarships)`}
      </button>

      {error && (
        <div style={{ padding:"10px 14px", borderRadius:8, background:"#fef2f2",
          border:"1.5px solid #fca5a5", color:"#dc2626", fontSize:13, marginBottom:14, whiteSpace:"pre-wrap" }}>
          ⚠️ {error}
        </div>
      )}

      {/* Extracted fields editor */}
      {extracted && (
        <div style={{ background:"var(--surface)", borderRadius:12, border:"1.5px solid var(--border)", padding:20 }}>
          <h3 style={{ fontSize:16, fontWeight:700, marginBottom:16 }}>✅ Review & Edit Before Saving</h3>

          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
            {[
              ["name","Scholarship Name","text"],
              ["provider","Provider / Organisation","text"],
              ["type","Type (government/private/ngo/international)","text"],
              ["amount","Amount (display)","text"],
              ["amount_value","Amount Value (₹ numeric)","number"],
              ["deadline","Deadline (YYYY-MM-DD)","text"],
              ["open_date","Open Date (YYYY-MM-DD)","text"],
              ["min_marks_percent","Min Marks %","number"],
              ["max_family_income_lpa","Max Family Income (LPA)","number"],
              ["difficulty","Difficulty (easy/medium/hard)","text"],
              ["success_rate_estimate","Success Rate %","number"],
              ["apply_time_minutes","Apply Time (minutes)","number"],
              ["application_link","Application Link","text"],
              ["official_portal","Official Portal URL","text"],
            ].map(([key, label, type]) => (
              <div key={key}>
                <label style={{ fontSize:11, color:"var(--text-muted)", fontWeight:600, display:"block", marginBottom:3 }}>{label}</label>
                <input type={type} value={extracted[key] ?? ""} onChange={e => handleFieldChange(key, type==="number" ? +e.target.value : e.target.value)}
                  style={fieldStyle} />
              </div>
            ))}
          </div>

          {/* Eligibility summary — full width */}
          <label style={{ fontSize:11, color:"var(--text-muted)", fontWeight:600, display:"block", marginBottom:3 }}>Eligibility Summary</label>
          <textarea value={extracted.eligibility_summary ?? ""} onChange={e => handleFieldChange("eligibility_summary", e.target.value)}
            style={{ ...fieldStyle, height:80, resize:"vertical" }} />

          {/* Arrays as comma-separated text */}
          {[["field","Fields (comma-separated)"],["level","Levels (comma-separated)"],
            ["categories","Categories (comma-separated)"],["states","States (comma-separated)"],
            ["tags","Tags (comma-separated)"]].map(([key,label]) => (
            <div key={key}>
              <label style={{ fontSize:11, color:"var(--text-muted)", fontWeight:600, display:"block", marginBottom:3 }}>{label}</label>
              <input value={Array.isArray(extracted[key]) ? extracted[key].join(", ") : (extracted[key]??"")}
                onChange={e => handleFieldChange(key, e.target.value.split(",").map(x=>x.trim()).filter(Boolean))}
                style={fieldStyle} />
            </div>
          ))}

          {/* Renewable */}
          <label style={{ display:"flex", alignItems:"center", gap:8, fontSize:14, cursor:"pointer", margin:"10px 0" }}>
            <input type="checkbox" checked={!!extracted.renewable}
              onChange={e => handleFieldChange("renewable", e.target.checked)}
              style={{ width:16, height:16 }} />
            Renewable annually
          </label>

          {saved ? (
            <div style={{ padding:"12px", borderRadius:10, background:"#f0fdf4",
              border:"1.5px solid #86efac", color:"#15803d", fontWeight:700, textAlign:"center", fontSize:15 }}>
              🎉 Saved to database! The scholarship will appear in ScholarHub within seconds.
            </div>
          ) : (
            <button onClick={handleSave} disabled={saving}
              style={{ width:"100%", padding:"12px", borderRadius:10, border:"none",
                background:"#16a34a", color:"#fff", fontWeight:700, fontSize:15,
                cursor: saving ? "not-allowed" : "pointer", opacity: saving ? 0.7 : 1, marginTop:8 }}>
              {saving ? "💾 Saving…" : "💾 Save to Database"}
            </button>
          )}
        </div>
      )}

      {/* Help */}
      <div style={{ marginTop:20, padding:"14px 16px", borderRadius:10,
        background:"var(--surface)", border:"1.5px solid var(--border)", fontSize:12, color:"var(--text-muted)" }}>
        <strong>💡 Tips:</strong> Works best with Buddy4Study, NSP, Vidyasaarathi, and NGO websites.
        Copy the entire scholarship page text (Ctrl+A → Ctrl+C on the page) and paste it here.
        Always review extracted fields before saving — AI can make mistakes with amounts and dates.
      </div>
    </div>
  );
}
