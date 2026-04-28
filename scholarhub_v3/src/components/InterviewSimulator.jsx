import { useState, useEffect, useRef, useCallback } from "react";
import { callClaudeSync } from "../utils/claude.js";

const DIFFICULTIES = [
  { id: "easy", label: "Easy", desc: "Basic questions, friendly tone", icon: "🟢", qCount: 3 },
  { id: "medium", label: "Medium", desc: "Standard panel-style questions", icon: "🟡", qCount: 5 },
  { id: "hard", label: "Hard", desc: "Tough, probing follow-ups", icon: "🔴", qCount: 7 },
];

export default function InterviewSimulator({ scholarships, initialSchol }) {
  const interviewSchols = scholarships.filter(s => s.selection_process.includes("interview"));
  const defSchol = initialSchol || interviewSchols[0] || scholarships[0];

  const [selSchol, setSelSchol]   = useState(defSchol.id);
  const [difficulty, setDifficulty] = useState("medium");
  const [phase, setPhase]         = useState("intro");
  const [questions, setQuestions] = useState([]);
  const [currentQ, setCurrentQ]   = useState(0);
  const [answer, setAnswer]       = useState("");
  const [scores, setScores]       = useState([]);
  const [loading, setLoading]     = useState(false);
  const [timer, setTimer]         = useState(180);
  const [timerActive, setTimerActive] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const intervalRef = useRef(null);
  const recognitionRef = useRef(null);
  const schol = scholarships.find(s => s.id === selSchol) || defSchol;

  // Timer
  useEffect(() => {
    if (timerActive && timer > 0) {
      intervalRef.current = setInterval(() => setTimer(t => t - 1), 1000);
    } else if (timer === 0) {
      clearInterval(intervalRef.current);
      setTimerActive(false);
    }
    return () => clearInterval(intervalRef.current);
  }, [timerActive, timer]);

  // Voice input (Web Speech API)
  const hasVoice = typeof window !== "undefined" && ("SpeechRecognition" in window || "webkitSpeechRecognition" in window);

  const startListening = useCallback(() => {
    if (!hasVoice) return;
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SR();
    recognition.lang = "en-IN";
    recognition.interimResults = true;
    recognition.continuous = true;

    let finalTranscript = answer;

    recognition.onresult = (event) => {
      let interim = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const txt = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalTranscript += txt + " ";
        } else {
          interim = txt;
        }
      }
      setAnswer(finalTranscript + interim);
    };

    recognition.onerror = () => setIsListening(false);
    recognition.onend = () => setIsListening(false);

    recognition.start();
    recognitionRef.current = recognition;
    setIsListening(true);
  }, [hasVoice, answer]);

  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      recognitionRef.current = null;
    }
    setIsListening(false);
  }, []);

  const toggleVoice = () => {
    if (isListening) stopListening();
    else startListening();
  };

  const diffConfig = DIFFICULTIES.find(d => d.id === difficulty) || DIFFICULTIES[1];

  const startSession = async () => {
    setLoading(true);
    setScores([]);
    setCurrentQ(0);
    setTimer(180);
    setTimerActive(true);
    
    const prompt = `Generate exactly ${diffConfig.qCount} ${difficulty}-level interview questions for the "${schol.name}" scholarship by ${schol.provider}.
Focus: ${schol.field}, ${schol.eligibility_summary}
Difficulty: ${difficulty} — ${diffConfig.desc}
Output as a JSON array of objects with "question" and "tips" keys. Tips should be 1 sentence of advice.`;
    
    try {
      const raw  = await callClaudeSync(prompt, "You are an interview panel expert. Generate realistic scholarship interview questions.", 800);
      const parsed = JSON.parse(raw.replace(/```json|```/g, "").trim());
      setQuestions(parsed);
      setPhase("question");
    } catch (e) {
      setQuestions([
        { question: "Tell me about yourself and why you chose your field of study.", tips: "Keep it under 2 minutes, focus on passion." },
        { question: `Why do you specifically want the ${schol.name}?`, tips: "Mention a specific aspect of the scholarship." },
        { question: "Where do you see yourself in 5 years?", tips: "Connect your goals to the scholarship mission." },
      ]);
      setPhase("question");
    } finally { setLoading(false); }
  };

  const submitAnswer = async () => {
    if (!answer.trim()) return;
    setLoading(true);
    
    try {
      const evalPrompt = `Rate this interview answer on a scholarship panel scale.
Question: "${questions[currentQ].question}"
Answer: "${answer}"
Difficulty: ${difficulty}

Rate on: Relevance (10), Specificity (10), Impact (10). 
Also give 1 strength and 1 area for improvement.
Return JSON: { "relevance": N, "specificity": N, "impact": N, "total": N, "strength": "...", "improvement": "..." }`;
      
      const raw = await callClaudeSync(evalPrompt, "You are a scholarship interview evaluator. Be constructive but honest.", 300);
      const parsed = JSON.parse(raw.replace(/```json|```/g, "").trim());
      setScores(s => [...s, { question: questions[currentQ].question, answer, ...parsed }]);
    } catch {
      setScores(s => [...s, {
        question: questions[currentQ].question, answer,
        relevance: 7, specificity: 7, impact: 7, total: 21,
        strength: "Clear communication.", improvement: "Add more specific examples."
      }]);
    }
    
    setAnswer("");
    setTimer(180);
    if (currentQ + 1 < questions.length) setCurrentQ(c => c + 1);
    else setPhase("report");
    setLoading(false);
  };

  const fmtTime = (s) => `${Math.floor(s/60)}:${String(s%60).padStart(2,"0")}`;
  const totalScore = scores.reduce((a, s) => a + (s.total || 0), 0);
  const maxScore = scores.length * 30;
  const overallPct = maxScore > 0 ? Math.round((totalScore / maxScore) * 100) : 0;

  return (
    <div className="fade-in">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="dash-section-title" style={{ fontSize: 24, marginBottom: 4 }}>
            <div className="icon-badge" style={{ background: "#fef3c7", color: "#d97706", width: 36, height: 36 }}>🎤</div>
            Interview Simulator
          </h1>
          <p style={{ color: "var(--gray-500)", fontSize: 14 }}>Practice with AI, get real-time feedback, and master your scholarship interviews.</p>
        </div>
      </div>

      {phase === "intro" && (
        <div className="dash-card" style={{ maxWidth: 700, margin: "0 auto", padding: 40, textAlign: "center" }}>
          <div style={{ fontSize: 60, marginBottom: 24 }}>🎙️</div>
          <h2 style={{ fontWeight: 800, fontSize: 20, color: "var(--navy)", marginBottom: 12 }}>Ready to Practice?</h2>
          <p style={{ color: "var(--gray-500)", fontSize: 14, marginBottom: 32 }}>Select a scholarship and difficulty level for your mock interview.</p>

          <div style={{ textAlign: "left", marginBottom: 24 }}>
            <label style={{ display: "block", fontSize: 13, fontWeight: 700, marginBottom: 8, color: "var(--navy)" }}>Choose Scholarship</label>
            <select className="input" value={selSchol} onChange={e => setSelSchol(e.target.value)} style={{ borderRadius: 12, height: 50 }}>
              {interviewSchols.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
            </select>
          </div>

          {/* Difficulty Selection */}
          <div style={{ textAlign: "left", marginBottom: 32 }}>
            <label style={{ display: "block", fontSize: 13, fontWeight: 700, marginBottom: 12, color: "var(--navy)" }}>Difficulty Level</label>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
              {DIFFICULTIES.map(d => (
                <div
                  key={d.id}
                  onClick={() => setDifficulty(d.id)}
                  style={{
                    padding: 16, borderRadius: 14, cursor: "pointer", textAlign: "center",
                    border: `2px solid ${difficulty === d.id ? "var(--primary)" : "var(--gray-200)"}`,
                    background: difficulty === d.id ? "var(--primary-pale)" : "var(--bg-card)",
                    transition: "all 0.2s",
                  }}
                >
                  <div style={{ fontSize: 24, marginBottom: 6 }}>{d.icon}</div>
                  <div style={{ fontWeight: 800, fontSize: 14, color: "var(--navy)" }}>{d.label}</div>
                  <div style={{ fontSize: 11, color: "var(--gray-500)" }}>{d.qCount} questions</div>
                </div>
              ))}
            </div>
          </div>

          <div className="grid-3 gap-4 mb-8">
            {[
              { icon: "❓", label: `${diffConfig.qCount} Custom Qs`, sub: "AI Generated" },
              { icon: "⏱️", label: "3 Min Limit", sub: "Per Question" },
              { icon: hasVoice ? "🎙️" : "⌨️", label: hasVoice ? "Voice Input" : "Type Input", sub: hasVoice ? "Speech-to-Text" : "Keyboard Only" }
            ].map(i => (
              <div key={i.label} style={{ padding: 16, background: "var(--gray-50)", borderRadius: 16 }}>
                <div style={{ fontSize: 24, marginBottom: 6 }}>{i.icon}</div>
                <div style={{ fontWeight: 800, fontSize: 13, color: "var(--navy)" }}>{i.label}</div>
                <div style={{ fontSize: 10, color: "var(--gray-400)", fontWeight: 700 }}>{i.sub}</div>
              </div>
            ))}
          </div>

          <button className="btn btn-primary btn-lg w-full" style={{ height: 56, borderRadius: 16, fontWeight: 800 }} onClick={startSession} disabled={loading}>
            {loading ? "Generating Session..." : "Start AI Interview"}
          </button>
        </div>
      )}

      {phase === "question" && questions[currentQ] && (
        <div style={{ maxWidth: 700, margin: "0 auto" }}>
          <div className="flex items-center justify-between mb-6">
            <div className="flex gap-2">
              {questions.map((_, i) => (
                <div key={i} style={{
                  width: 10, height: 10, borderRadius: "50%",
                  background: i < currentQ ? "#10b981" : i === currentQ ? "var(--primary)" : "var(--gray-200)",
                  transition: "background 0.3s",
                }} />
              ))}
            </div>
            <div style={{
              fontWeight: 800, fontSize: 16,
              color: timer < 30 ? "var(--danger)" : "var(--navy)",
              padding: "6px 16px", borderRadius: 10,
              background: timer < 30 ? "rgba(239,68,68,0.1)" : "var(--gray-50)",
            }}>
              {fmtTime(timer)}
            </div>
          </div>

          <div className="dash-card" style={{ padding: 32, borderLeft: "6px solid var(--primary)", marginBottom: 24 }}>
            <div style={{ fontSize: 11, fontWeight: 800, color: "var(--primary)", textTransform: "uppercase", letterSpacing: "1px", marginBottom: 8 }}>
              Question {currentQ + 1} of {questions.length} · {DIFFICULTIES.find(d => d.id === difficulty)?.icon} {difficulty}
            </div>
            <h2 style={{ fontWeight: 800, fontSize: 18, color: "var(--navy)", lineHeight: 1.5 }}>{questions[currentQ].question}</h2>
            {questions[currentQ].tips && (
              <div style={{ marginTop: 12, padding: 12, background: "var(--primary-pale)", borderRadius: 10, display: "flex", gap: 10, alignItems: "flex-start" }}>
                <span style={{ fontSize: 14 }}>💡</span>
                <p style={{ fontSize: 12, color: "var(--gray-600)", fontStyle: "italic", margin: 0 }}>{questions[currentQ].tips}</p>
              </div>
            )}
          </div>

          <div style={{ position: "relative" }}>
            <textarea 
              className="input mb-4" 
              style={{ minHeight: 200, borderRadius: 20, padding: 24, fontSize: 15, lineHeight: 1.6, paddingRight: 60 }}
              value={answer}
              onChange={e => setAnswer(e.target.value)}
              placeholder={isListening ? "🎙️ Listening... speak now" : "Type your answer here or use voice input..."}
            />
            {hasVoice && (
              <button
                onClick={toggleVoice}
                style={{
                  position: "absolute", right: 16, bottom: 32,
                  width: 44, height: 44, borderRadius: "50%", border: "none",
                  background: isListening ? "#ef4444" : "var(--primary)",
                  color: "#fff", fontSize: 18, cursor: "pointer",
                  boxShadow: isListening ? "0 0 0 4px rgba(239,68,68,0.3)" : "0 4px 12px rgba(26,86,219,0.3)",
                  transition: "all 0.2s",
                  animation: isListening ? "pulse 1.5s infinite" : "none",
                }}
                title={isListening ? "Stop listening" : "Start voice input"}
              >
                {isListening ? "⏹️" : "🎙️"}
              </button>
            )}
          </div>

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: 12, color: "var(--gray-500)" }}>
              {answer.trim().split(/\s+/).filter(Boolean).length} words
            </span>
            <button className="btn btn-primary btn-lg" style={{ minWidth: 180, borderRadius: 12 }} onClick={submitAnswer} disabled={loading || !answer.trim()}>
              {loading ? "Evaluating..." : currentQ + 1 < questions.length ? "Next Question →" : "Finish Interview 🏁"}
            </button>
          </div>
        </div>
      )}

      {phase === "report" && (
        <div style={{ maxWidth: 750, margin: "0 auto" }}>
          <div className="dash-card" style={{ textAlign: "center", padding: 40, marginBottom: 24, background: "linear-gradient(135deg, var(--primary-pale) 0%, var(--accent-pale) 100%)", border: "none" }}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>🏁</div>
            <h2 style={{ fontWeight: 800, fontSize: 24, color: "var(--navy)" }}>Session Complete</h2>
            <div style={{ fontSize: 48, fontWeight: 900, color: "var(--primary)", margin: "16px 0" }}>
              {totalScore}/{maxScore}
            </div>
            <div style={{
              display: "inline-block", padding: "6px 20px", borderRadius: 99,
              background: overallPct >= 80 ? "#dcfce7" : overallPct >= 60 ? "#fef3c7" : "#fee2e2",
              color: overallPct >= 80 ? "#14532d" : overallPct >= 60 ? "#92400e" : "#991b1b",
              fontWeight: 800, fontSize: 14,
            }}>
              {overallPct >= 80 ? "Excellent!" : overallPct >= 60 ? "Good Progress" : "Keep Practicing"} — {overallPct}%
            </div>
          </div>

          {/* Per-question scores */}
          <div style={{ display: "flex", flexDirection: "column", gap: 16, marginBottom: 24 }}>
            {scores.map((s, i) => (
              <div key={i} className="dash-card" style={{ padding: 20 }}>
                <div style={{ fontSize: 11, fontWeight: 800, color: "var(--primary)", textTransform: "uppercase", marginBottom: 6 }}>
                  Question {i + 1}
                </div>
                <p style={{ fontWeight: 700, fontSize: 14, color: "var(--navy)", marginBottom: 12 }}>{s.question}</p>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12, marginBottom: 12 }}>
                  {[
                    { label: "Relevance", val: s.relevance },
                    { label: "Specificity", val: s.specificity },
                    { label: "Impact", val: s.impact },
                  ].map(m => (
                    <div key={m.label} style={{ textAlign: "center", padding: 10, background: "var(--gray-50)", borderRadius: 10 }}>
                      <div style={{ fontWeight: 800, fontSize: 20, color: m.val >= 8 ? "var(--success)" : m.val >= 6 ? "var(--accent)" : "var(--danger)" }}>
                        {m.val}/10
                      </div>
                      <div style={{ fontSize: 11, color: "var(--gray-500)", fontWeight: 600 }}>{m.label}</div>
                    </div>
                  ))}
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                  <div style={{ padding: 10, background: "#dcfce7", borderRadius: 10, fontSize: 13 }}>
                    <strong style={{ color: "#14532d" }}>✅ Strength:</strong>
                    <p style={{ color: "#166534", margin: "4px 0 0", fontSize: 12 }}>{s.strength}</p>
                  </div>
                  <div style={{ padding: 10, background: "#fef3c7", borderRadius: 10, fontSize: 13 }}>
                    <strong style={{ color: "#92400e" }}>🔧 Improve:</strong>
                    <p style={{ color: "#92400e", margin: "4px 0 0", fontSize: 12 }}>{s.improvement}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <button className="btn btn-primary btn-lg w-full" style={{ borderRadius: 16 }} onClick={() => { setPhase("intro"); setScores([]); setCurrentQ(0); }}>Practice Again</button>
        </div>
      )}
    </div>
  );
}
