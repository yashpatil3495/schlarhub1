import { useState } from "react";
import { callClaudeChat } from "../utils/claude.js";

const SOP_STYLES = [
  { id: "professional", label: "Professional", desc: "Formal, achievement-focused", icon: "🎯" },
  { id: "narrative", label: "Narrative", desc: "Story-driven, personal touch", icon: "📖" },
  { id: "passionate", label: "Passionate", desc: "Emotionally engaging, heartfelt", icon: "❤️" },
  { id: "concise", label: "Concise", desc: "Brief, punchy, no fluff", icon: "⚡" },
];

const WORD_COUNTS = [
  { value: 300, label: "300 words (Short)" },
  { value: 500, label: "500 words (Standard)" },
  { value: 750, label: "750 words (Detailed)" },
  { value: 1000, label: "1000 words (Comprehensive)" },
];

export default function SOPGenerator({ user, scholarships, saved }) {
  const [step, setStep] = useState(1);
  const [selectedSchol, setSelectedSchol] = useState("");
  const [reason, setReason] = useState("");
  const [goals, setGoals] = useState("");
  const [achievements, setAchievements] = useState("");
  const [style, setStyle] = useState("professional");
  const [wordCount, setWordCount] = useState(500);
  const [sop, setSop] = useState("");
  const [loading, setLoading] = useState(false);
  const [wordCountActual, setWordCountActual] = useState(0);
  const [showCopied, setShowCopied] = useState(false);

  const savedSchols = scholarships.filter(s => saved.has(s.id));

  const generate = async () => {
    setLoading(true);
    setStep(4);
    
    const schol = scholarships.find(s => s.id === selectedSchol);
    const styleName = SOP_STYLES.find(s => s.id === style)?.label || "Professional";
    
    const system = `You are a professional academic advisor helping Indian students write compelling Statements of Purpose (SOP). 
Write in a ${styleName.toLowerCase()} style. The SOP must be approximately ${wordCount} words.
Structure the SOP with these clear sections (use markdown headers):
## Introduction — Hook + who they are
## Academic Journey — Background, achievements
## Why This Scholarship — Specific reasons for this scholarship
## Future Goals — Career aspirations and how scholarship helps
## Conclusion — Compelling closing statement`;

    const prompt = `Write a ${wordCount}-word SOP for ${user.name || "the student"} for the scholarship "${schol?.name || "General Purpose"}".

Student Profile:
- Field: ${user.field || "Not specified"} (${user.specialisation || "General"})
- Level: ${user.level || "Undergraduate"}
- College: ${user.college || "Not specified"}
- Marks: ${user.marks_percent || "N/A"}%
- Category: ${user.category || "General"}
- State: ${user.state || "India"}
- First-gen student: ${user.is_first_gen ? "Yes" : "No"}

Personal Story/Motivation: ${reason || "Student is passionate about their field"}
Key Achievements: ${achievements || "Strong academic record"}
Future Goals: ${goals || "Excel in their chosen field and contribute to society"}

${schol ? `Scholarship Details:
- Provider: ${schol.provider}
- Amount: ${schol.amount}
- Focus: ${schol.field}
- Eligibility: ${schol.eligibility_summary}` : ""}

Style: ${styleName} — ${SOP_STYLES.find(s => s.id === style)?.desc}
Target Word Count: ${wordCount} words

Write a compelling, authentic SOP that stands out. Use specific details from the student's profile. Do NOT use generic phrases like "I am writing to express my interest." Start with a hook.`;

    try {
      await callClaudeChat([{ role: "user", content: prompt }], system, (full) => {
        setSop(full);
        setWordCountActual(full.trim().split(/\s+/).length);
      });
    } catch (e) {
      setSop("⚠️ Failed to generate SOP. Please check your API key or try again later.\n\nError: " + e.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(sop);
    setShowCopied(true);
    setTimeout(() => setShowCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([sop], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `SOP_${selectedSchol || "general"}_${new Date().toISOString().slice(0, 10)}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fade-in">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="dash-section-title" style={{ fontSize: 24, marginBottom: 4 }}>
            <div className="icon-badge" style={{ background: "#dbeafe", color: "#1a56db", width: 36, height: 36 }}>✍️</div>
            AI SOP Generator
          </h1>
          <p style={{ color: "var(--gray-500)", fontSize: 14 }}>Create professional, multi-section SOPs with AI. Choose style and length.</p>
        </div>
      </div>

      <div className="step-track">
        {[1,2,3,4].map(i => (
          <div key={i} className={`step-item ${step >= i ? "active" : ""} ${step > i ? "done" : ""}`} />
        ))}
      </div>

      <div className="dash-card" style={{ maxWidth: 750, margin: "0 auto", padding: "clamp(16px, 4vw, 40px)" }}>
        {/* Step 1: Select Scholarship */}
        {step === 1 && (
          <div>
            <h2 style={{ fontWeight: 800, fontSize: 18, marginBottom: 8, color: "var(--navy)" }}>Select Scholarship</h2>
            <p style={{ color: "var(--gray-500)", fontSize: 14, marginBottom: 24 }}>Which scholarship are you applying for? This helps tailor the SOP.</p>
            
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {savedSchols.length === 0 ? (
                <p className="text-sm italic p-4 bg-gray-50 rounded-lg">No saved scholarships found. Save some first to use them here.</p>
              ) : (
                savedSchols.map(s => (
                  <div 
                    key={s.id} 
                    className={`dash-match ${selectedSchol === s.id ? "active" : ""}`} 
                    style={{ borderColor: selectedSchol === s.id ? "var(--primary)" : "var(--gray-200)", background: selectedSchol === s.id ? "var(--primary-pale)" : "var(--bg-card)" }}
                    onClick={() => setSelectedSchol(s.id)}
                  >
                    <div className="font-bold text-sm">{s.name}</div>
                    <div className="text-xs text-muted mt-1">{s.provider}</div>
                  </div>
                ))
              )}
              <div 
                className={`dash-match ${selectedSchol === "general" ? "active" : ""}`}
                style={{ borderColor: selectedSchol === "general" ? "var(--primary)" : "var(--gray-200)", background: selectedSchol === "general" ? "var(--primary-pale)" : "var(--bg-card)" }}
                onClick={() => setSelectedSchol("general")}
              >
                <div className="font-bold text-sm">General Purpose SOP</div>
                <div className="text-xs text-muted mt-1">Not specific to any scholarship</div>
              </div>
            </div>

            <div className="mt-8 flex justify-end">
              <button className="btn btn-primary" disabled={!selectedSchol} onClick={() => setStep(2)}>Next Step →</button>
            </div>
          </div>
        )}

        {/* Step 2: Personalize */}
        {step === 2 && (
          <div>
            <h2 style={{ fontWeight: 800, fontSize: 18, marginBottom: 8, color: "var(--navy)" }}>Personalize Your SOP</h2>
            <p style={{ color: "var(--gray-500)", fontSize: 14, marginBottom: 24 }}>Tell the AI about your motivation and achievements.</p>
            
            <div className="mb-6">
              <label style={{ display: "block", fontSize: 13, fontWeight: 700, marginBottom: 8, color: "var(--navy)" }}>Why do you need this scholarship?</label>
              <textarea 
                className="input" 
                style={{ height: 100, borderRadius: 12, padding: 16 }}
                placeholder="Mention your financial need, family background, or personal challenges..."
                value={reason}
                onChange={e => setReason(e.target.value)}
              />
            </div>

            <div className="mb-6">
              <label style={{ display: "block", fontSize: 13, fontWeight: 700, marginBottom: 8, color: "var(--navy)" }}>Key Achievements & Activities</label>
              <textarea 
                className="input" 
                style={{ height: 80, borderRadius: 12, padding: 16 }}
                placeholder="Awards, internships, projects, extracurriculars, research..."
                value={achievements}
                onChange={e => setAchievements(e.target.value)}
              />
            </div>

            <div className="mb-6">
              <label style={{ display: "block", fontSize: 13, fontWeight: 700, marginBottom: 8, color: "var(--navy)" }}>Future career goals?</label>
              <textarea 
                className="input" 
                style={{ height: 80, borderRadius: 12, padding: 16 }}
                placeholder="Where do you see yourself in 5 years? How will this scholarship help?"
                value={goals}
                onChange={e => setGoals(e.target.value)}
              />
            </div>

            <div className="flex justify-between mt-8">
              <button className="btn btn-ghost" onClick={() => setStep(1)}>Back</button>
              <button className="btn btn-primary" onClick={() => setStep(3)}>Choose Style →</button>
            </div>
          </div>
        )}

        {/* Step 3: Style & Word Count */}
        {step === 3 && (
          <div>
            <h2 style={{ fontWeight: 800, fontSize: 18, marginBottom: 8, color: "var(--navy)" }}>Choose Style & Length</h2>
            <p style={{ color: "var(--gray-500)", fontSize: 14, marginBottom: 24 }}>Pick a writing style and target word count for your SOP.</p>
            
            <label style={{ display: "block", fontSize: 13, fontWeight: 700, marginBottom: 12, color: "var(--navy)" }}>Writing Style</label>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 28 }}>
              {SOP_STYLES.map(s => (
                <div
                  key={s.id}
                  onClick={() => setStyle(s.id)}
                  style={{
                    padding: "16px 18px", borderRadius: 14, cursor: "pointer",
                    border: `2px solid ${style === s.id ? "var(--primary)" : "var(--gray-200)"}`,
                    background: style === s.id ? "var(--primary-pale)" : "var(--bg-card)",
                    transition: "all 0.2s",
                  }}
                >
                  <div style={{ fontSize: 22, marginBottom: 6 }}>{s.icon}</div>
                  <div style={{ fontWeight: 800, fontSize: 14, color: "var(--navy)", marginBottom: 2 }}>{s.label}</div>
                  <div style={{ fontSize: 12, color: "var(--gray-500)" }}>{s.desc}</div>
                </div>
              ))}
            </div>

            <label style={{ display: "block", fontSize: 13, fontWeight: 700, marginBottom: 12, color: "var(--navy)" }}>Word Count</label>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 28 }}>
              {WORD_COUNTS.map(wc => (
                <button
                  key={wc.value}
                  className={`pill-tab ${wordCount === wc.value ? "active" : ""}`}
                  onClick={() => setWordCount(wc.value)}
                  style={{ fontSize: 13 }}
                >
                  {wc.label}
                </button>
              ))}
            </div>

            <div className="flex justify-between mt-8">
              <button className="btn btn-ghost" onClick={() => setStep(2)}>Back</button>
              <button className="btn btn-primary" onClick={generate}>Generate SOP ✨</button>
            </div>
          </div>
        )}

        {/* Step 4: Result */}
        {step === 4 && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 style={{ fontWeight: 800, fontSize: 18, color: "var(--navy)" }}>Your Generated SOP</h2>
                {!loading && (
                  <p style={{ fontSize: 13, color: "var(--gray-500)", marginTop: 4 }}>
                    {wordCountActual} words · {SOP_STYLES.find(s => s.id === style)?.label} style
                  </p>
                )}
              </div>
              {!loading && (
                <div className="flex gap-2">
                  <button className="btn btn-ghost btn-sm" onClick={handleCopy}>
                    {showCopied ? "✓ Copied!" : "📋 Copy"}
                  </button>
                  <button className="btn btn-ghost btn-sm" onClick={handleDownload}>💾 Download</button>
                  <button className="btn btn-primary btn-sm" onClick={() => setStep(3)}>🔄 Regenerate</button>
                </div>
              )}
            </div>

            <div style={{
              background: "var(--gray-50, #f8fafc)", padding: 32, borderRadius: 16,
              border: "1px solid var(--gray-200)", minHeight: 400,
              whiteSpace: "pre-wrap", fontSize: 15, lineHeight: 1.8, color: "var(--gray-700)",
            }}>
              {loading ? (
                <div style={{ textAlign: "center", paddingTop: 100 }}>
                  <div style={{ fontSize: 32, marginBottom: 16 }} className="pulse">✍️</div>
                  <p style={{ fontWeight: 700, color: "var(--primary)" }}>AI is writing your SOP...</p>
                  <p style={{ fontSize: 13, color: "var(--gray-500)", marginTop: 8 }}>
                    Generating a {wordCount}-word {SOP_STYLES.find(s => s.id === style)?.label.toLowerCase()} SOP with {4} sections.
                  </p>
                  <div className="loading-dots" style={{ justifyContent: "center", marginTop: 16 }}>
                    <span className="dot" /><span className="dot" /><span className="dot" />
                  </div>
                </div>
              ) : (
                <>
                  {sop}
                  {sop && <span className="streaming-cursor" />}
                </>
              )}
            </div>

            {!loading && (
              <div className="mt-8 flex justify-center gap-4">
                <button className="btn btn-ghost" onClick={() => setStep(1)}>Start New Draft</button>
                <button className="btn btn-primary" style={{ background: "var(--navy)" }} onClick={() => {
                  // Submit for peer review
                  navigate?.("community", "peer_review");
                }}>
                  Submit for Peer Review 👥
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
