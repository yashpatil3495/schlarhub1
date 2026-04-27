import { useState } from "react";
import { callClaudeChat } from "../utils/claude.js";

export default function SOPGenerator({ user, scholarships, saved }) {
  const [step, setStep] = useState(1);
  const [selectedSchol, setSelectedSchol] = useState("");
  const [reason, setReason] = useState("");
  const [goals, setGoals] = useState("");
  const [sop, setSop] = useState("");
  const [loading, setLoading] = useState(false);

  const savedSchols = scholarships.filter(s => saved.has(s.id));

  const generate = async () => {
    setLoading(true);
    setStep(3);
    
    const schol = scholarships.find(s => s.id === selectedSchol);
    const system = "You are a professional academic advisor helping a student write a Statement of Purpose (SOP).";
    const prompt = `Write a professional 500-word SOP for ${user.name} for the scholarship "${schol?.name}".
Student Info:
- Field: ${user.field} (${user.specialisation})
- Level: ${user.level}
- Achievement: ${user.marks_percent}% marks
- Personal Story/Reason: ${reason}
- Future Goals: ${goals}
The SOP should be humble, ambitious, and clearly explain why the student deserves this specific scholarship.`;

    try {
      await callClaudeChat([{ role: "user", content: prompt }], system, (full) => {
        setSop(full);
      });
    } catch (e) {
      setSop("⚠️ Failed to generate SOP. Please check your API key or try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fade-in">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="dash-section-title" style={{ fontSize: 24, marginBottom: 4 }}>
            <div className="icon-badge" style={{ background: "#dbeafe", color: "#1a56db", width: 36, height: 36 }}>✍️</div>
            AI SOP Generator
          </h1>
          <p style={{ color: "var(--gray-500)", fontSize: 14 }}>Create professional statements of purpose in seconds using AI.</p>
        </div>
      </div>

      <div className="step-track">
        <div className={`step-item ${step >= 1 ? "active" : ""} ${step > 1 ? "done" : ""}`} />
        <div className={`step-item ${step >= 2 ? "active" : ""} ${step > 2 ? "done" : ""}`} />
        <div className={`step-item ${step >= 3 ? "active" : ""} ${step > 3 ? "done" : ""}`} />
      </div>

      <div className="dash-card" style={{ maxWidth: 700, margin: "0 auto", padding: 40 }}>
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
                    style={{ borderColor: selectedSchol === s.id ? "var(--primary)" : "var(--gray-200)", background: selectedSchol === s.id ? "#eff6ff" : "#fff" }}
                    onClick={() => setSelectedSchol(s.id)}
                  >
                    <div className="font-bold text-sm">{s.name}</div>
                    <div className="text-xs text-muted mt-1">{s.provider}</div>
                  </div>
                ))
              )}
              <div 
                className={`dash-match ${selectedSchol === "general" ? "active" : ""}`}
                style={{ borderColor: selectedSchol === "general" ? "var(--primary)" : "var(--gray-200)", background: selectedSchol === "general" ? "#eff6ff" : "#fff" }}
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

        {step === 2 && (
          <div>
            <h2 style={{ fontWeight: 800, fontSize: 18, marginBottom: 8, color: "var(--navy)" }}>Personalize Your SOP</h2>
            <p style={{ color: "var(--gray-500)", fontSize: 14, marginBottom: 24 }}>Tell the AI about your motivation and future plans.</p>
            
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
              <label style={{ display: "block", fontSize: 13, fontWeight: 700, marginBottom: 8, color: "var(--navy)" }}>What are your future career goals?</label>
              <textarea 
                className="input" 
                style={{ height: 100, borderRadius: 12, padding: 16 }}
                placeholder="Where do you see yourself in 5 years? How will this scholarship help?"
                value={goals}
                onChange={e => setGoals(e.target.value)}
              />
            </div>

            <div className="flex justify-between mt-8">
              <button className="btn btn-ghost" onClick={() => setStep(1)}>Back</button>
              <button className="btn btn-primary" onClick={generate}>Generate SOP ✨</button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 style={{ fontWeight: 800, fontSize: 18, color: "var(--navy)" }}>Your Generated SOP</h2>
              {!loading && (
                <div className="flex gap-2">
                  <button className="btn btn-ghost btn-sm" onClick={() => { navigator.clipboard.writeText(sop); alert("Copied!"); }}>📋 Copy</button>
                  <button className="btn btn-primary btn-sm" onClick={() => setStep(2)}>🔄 Regenerate</button>
                </div>
              )}
            </div>

            <div style={{ background: "#f8fafc", padding: 32, borderRadius: 16, border: "1px solid var(--gray-200)", minHeight: 400, whiteSpace: "pre-wrap", fontSize: 15, lineHeight: 1.8, color: "var(--gray-700)" }}>
              {loading ? (
                <div style={{ textAlign: "center", paddingTop: 100 }}>
                  <div style={{ fontSize: 32, marginBottom: 16 }} className="pulse">✍️</div>
                  <p style={{ fontWeight: 700, color: "var(--primary)" }}>AI is writing your SOP...</p>
                  <p style={{ fontSize: 13, color: "var(--gray-500)", marginTop: 8 }}>This usually takes 15-20 seconds.</p>
                </div>
              ) : (
                sop
              )}
            </div>

            {!loading && (
              <div className="mt-8 flex justify-center">
                <button className="btn btn-primary" style={{ background: "var(--navy)", borderColor: "var(--navy)" }} onClick={() => setStep(1)}>Start New Draft</button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
