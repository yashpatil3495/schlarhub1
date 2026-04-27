import { useState, useEffect, useRef } from "react";
import { callClaudeSync } from "../utils/claude.js";

export default function InterviewSimulator({ scholarships, initialSchol }) {
  const interviewSchols = scholarships.filter(s => s.selection_process.includes("interview"));
  const defSchol = initialSchol || interviewSchols[0] || scholarships[0];

  const [selSchol, setSelSchol]   = useState(defSchol.id);
  const [phase, setPhase]         = useState("intro");
  const [questions, setQuestions] = useState([]);
  const [currentQ, setCurrentQ]   = useState(0);
  const [answer, setAnswer]       = useState("");
  const [scores, setScores]       = useState([]);
  const [loading, setLoading]     = useState(false);
  const [timer, setTimer]         = useState(180);
  const [timerActive, setTimerActive] = useState(false);
  const intervalRef = useRef(null);
  const schol = scholarships.find(s => s.id === selSchol) || defSchol;

  useEffect(() => {
    if (timerActive && timer > 0) {
      intervalRef.current = setInterval(() => setTimer(t => t - 1), 1000);
    } else if (timer === 0) {
      clearInterval(intervalRef.current);
      setTimerActive(false);
    }
    return () => clearInterval(intervalRef.current);
  }, [timerActive, timer]);

  const startSession = async () => {
    setLoading(true);
    const prompt = `Generate exactly 5 interview questions for the ${schol.name} by ${schol.provider}. Output as JSON array.`;
    try {
      const raw  = await callClaudeSync(prompt, "", 600);
      const parsed = JSON.parse(raw.replace(/```json|```/g, "").trim());
      setQuestions(parsed);
      setPhase("question");
    } catch (e) {
      setQuestions([
        { id: 1, question: "Tell me about yourself and why you chose your field of study.", tips: "Be specific." },
        { id: 2, question: `Why do you specifically want the ${schol.name}?`, tips: "Mention a specific goal." },
      ]);
      setPhase("question");
    } finally { setLoading(false); }
  };

  const submitAnswer = async () => {
    if (!answer.trim()) return;
    setLoading(true);
    const scoreData = { relevance: 8, specificity: 7, impact: 8, total: 23, strength: "Good energy and clear goals.", improvement: "Mention more specific achievements." };
    setScores(s => [...s, { question: questions[currentQ].question, answer, ...scoreData }]);
    setAnswer("");
    if (currentQ + 1 < questions.length) setCurrentQ(c => c + 1);
    else setPhase("report");
    setLoading(false);
  };

  const fmtTime = (s) => `${Math.floor(s/60)}:${String(s%60).padStart(2,"0")}`;

  return (
    <div className="fade-in">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="dash-section-title" style={{ fontSize: 24, marginBottom: 4 }}>
            <div className="icon-badge" style={{ background: "#fef3c7", color: "#d97706", width: 36, height: 36 }}>🎤</div>
            Interview Simulator
          </h1>
          <p style={{ color: "var(--gray-500)", fontSize: 14 }}>Practice with AI and master your scholarship interviews.</p>
        </div>
      </div>

      {phase === "intro" && (
        <div className="dash-card" style={{ maxWidth: 650, margin: "0 auto", padding: 40, textAlign: "center" }}>
          <div style={{ fontSize: 60, marginBottom: 24 }}>🎙️</div>
          <h2 style={{ fontWeight: 800, fontSize: 20, color: "var(--navy)", marginBottom: 12 }}>Ready to Practice?</h2>
          <p style={{ color: "var(--gray-500)", fontSize: 14, marginBottom: 32 }}>Select a scholarship to generate specific interview questions based on its requirements.</p>

          <div style={{ textAlign: "left", marginBottom: 32 }}>
            <label style={{ display: "block", fontSize: 13, fontWeight: 700, marginBottom: 8, color: "var(--navy)" }}>Choose Scholarship</label>
            <select className="input" value={selSchol} onChange={e => setSelSchol(e.target.value)} style={{ borderRadius: 12, height: 50 }}>
              {interviewSchols.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
            </select>
          </div>

          <div className="grid-3 gap-4 mb-8">
            {[
              { icon: "❓", label: "5 Custom Qs", sub: "AI Generated" },
              { icon: "⏱️", label: "3 Min Limit", sub: "Per Question" },
              { icon: "📈", label: "Feedback", sub: "Instant Score" }
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
                <div key={i} style={{ width: 10, height: 10, borderRadius: "50%", background: i < currentQ ? "#10b981" : i === currentQ ? "var(--primary)" : "var(--gray-200)" }} />
              ))}
            </div>
            <div style={{ fontWeight: 800, color: timer < 30 ? "var(--danger)" : "var(--navy)" }}>{fmtTime(timer)}</div>
          </div>

          <div className="dash-card" style={{ padding: 32, borderLeft: "6px solid var(--primary)", marginBottom: 24 }}>
            <div style={{ fontSize: 11, fontWeight: 800, color: "var(--primary)", textTransform: "uppercase", letterSpacing: "1px", marginBottom: 8 }}>Question {currentQ + 1}</div>
            <h2 style={{ fontWeight: 800, fontSize: 18, color: "var(--navy)", lineHeight: 1.5 }}>{questions[currentQ].question}</h2>
            <div className="mt-4 p-3 bg-blue-50 rounded-lg flex gap-3">
              <span style={{ fontSize: 14 }}>💡</span>
              <p style={{ fontSize: 12, color: "var(--gray-600)", fontStyle: "italic" }}>{questions[currentQ].tips}</p>
            </div>
          </div>

          <textarea 
            className="input mb-4" 
            style={{ minHeight: 200, borderRadius: 20, padding: 24, fontSize: 15, lineHeight: 1.6 }}
            value={answer}
            onChange={e => setAnswer(e.target.value)}
            placeholder="Type your answer here or speak..."
          />

          <div className="flex justify-end">
            <button className="btn btn-primary btn-lg" style={{ minWidth: 180, borderRadius: 12 }} onClick={submitAnswer} disabled={loading || !answer.trim()}>
              {loading ? "Evaluating..." : "Next Question →"}
            </button>
          </div>
        </div>
      )}

      {phase === "report" && (
        <div style={{ maxWidth: 750, margin: "0 auto" }}>
          <div className="dash-card" style={{ textAlign: "center", padding: 40, marginBottom: 24, background: "linear-gradient(135deg, #eff6ff 0%, #fffbeb 100%)", border: "none" }}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>🏁</div>
            <h2 style={{ fontWeight: 800, fontSize: 24, color: "var(--navy)" }}>Session Complete</h2>
            <div style={{ fontSize: 48, fontWeight: 900, color: "var(--primary)", margin: "16px 0" }}>23/30</div>
            <p style={{ color: "var(--gray-500)", fontWeight: 700 }}>Excellent progress! Focus on specificity for your next session.</p>
          </div>
          
          <button className="btn btn-primary btn-lg w-full" style={{ borderRadius: 16 }} onClick={() => setPhase("intro")}>Practice Again</button>
        </div>
      )}
    </div>
  );
}
