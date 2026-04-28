import { useState, useRef, useEffect } from "react";
import { callClaudeChat } from "../utils/claude.js";

const STORAGE_KEY = "scholarbot_history";
const MAX_STORED_MESSAGES = 100;
const MAX_CONTEXT_MESSAGES = 20;

const QUICK_ACTIONS = [
  "What scholarships can I apply for right now?",
  "Which of my saved scholarships closes soonest?",
  "Help me write a document request letter",
  "What's the easiest scholarship I qualify for?",
  "Explain the NSP portal step by step",
  "What documents do I typically need?",
];

const WELCOME = (count) => ({
  role: "bot",
  text: `Namaste! 👋 I'm ScholarBot — your personal scholarship guide.\n\nI know your profile and all **${count} scholarships** in our database. I can help you find matches, check eligibility, and guide you through the application process.\n\nWhat would you like to know today?`,
  ts: Date.now(),
  suggestions: [
    "Show my best matches",
    "What deadlines are coming up?",
    "Help me prepare for interviews",
  ],
});

function loadHistory() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : null;
  } catch { return null; }
}

function saveHistory(messages) {
  try {
    const clean = messages
      .filter(m => !m.streaming && m.text)
      .slice(-MAX_STORED_MESSAGES)
      .map(({ role, text, ts, suggestions }) => ({ role, text, ts: ts || Date.now(), suggestions }));
    localStorage.setItem(STORAGE_KEY, JSON.stringify(clean));
  } catch {}
}

function renderMarkdown(text) {
  return text.split("\n").map((line, i) => {
    if (!line) return <div key={i} style={{ height: 8 }} />;
    const parts = line.split(/\*\*([^*]+)\*\*/g);
    return (
      <div key={i} style={{ paddingLeft: line.startsWith("• ") || line.startsWith("- ") ? 12 : 0, marginTop: i === 0 ? 0 : 2 }}>
        {parts.map((p, j) => j % 2 === 1 ? <strong key={j} style={{ fontWeight: 800 }}>{p}</strong> : p)}
      </div>
    );
  });
}

function formatTs(ts) {
  if (!ts) return "";
  const d = new Date(ts);
  return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

// Extract follow-up suggestions from AI response
function extractSuggestions(text) {
  const suggestions = [];
  // Look for common patterns in AI responses that suggest follow-up
  if (text.includes("deadline") || text.includes("apply")) suggestions.push("What documents do I need?");
  if (text.includes("scholarship") && text.includes("match")) suggestions.push("Compare my top 3 matches");
  if (text.includes("SOP") || text.includes("statement")) suggestions.push("Help me draft an SOP");
  if (text.includes("interview")) suggestions.push("Practice interview questions");
  if (text.includes("eligibility") || text.includes("qualify")) suggestions.push("Show scholarships I qualify for");
  if (text.includes("income") || text.includes("financial")) suggestions.push("Calculate my total aid potential");
  
  // Always add a generic follow-up
  if (suggestions.length === 0) {
    suggestions.push("Tell me more about this");
    suggestions.push("What else should I know?");
  }
  
  return suggestions.slice(0, 3);
}

export default function ScholarBot({ scholarships, saved, user }) {
  const stored = loadHistory();
  const [messages, setMessages] = useState(stored && stored.length > 0 ? stored : [WELCOME(scholarships.length)]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [showClearDlg, setShowClearDlg] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    const t = setTimeout(() => saveHistory(messages), 300);
    return () => clearTimeout(t);
  }, [messages]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Conversation summary for context (memory)
  const getConversationSummary = () => {
    const topics = new Set();
    messages.forEach(m => {
      if (m.role === "user" && m.text) {
        if (m.text.toLowerCase().includes("sop")) topics.add("SOP writing");
        if (m.text.toLowerCase().includes("deadline")) topics.add("deadlines");
        if (m.text.toLowerCase().includes("interview")) topics.add("interview prep");
        if (m.text.toLowerCase().includes("document")) topics.add("documents");
        if (m.text.toLowerCase().includes("match")) topics.add("scholarship matching");
      }
    });
    return topics.size > 0 ? `Previous topics discussed: ${[...topics].join(", ")}.` : "";
  };

  const send = async (text) => {
    const msg = text || input;
    if (!msg.trim() || loading) return;
    setInput("");

    const userMsg = { role: "user", text: msg, ts: Date.now() };
    setMessages(m => [...m, userMsg]);
    setLoading(true);

    const savedScholNames = scholarships.filter(s => saved.has(s.id)).map(s => s.name).join(", ");
    const scholarData = scholarships.slice(0, 50).map(s => `• ${s.name}: ${s.amount}, ${s.eligibility_summary}`).join("\n");
    const memorySummary = getConversationSummary();
    
    const system = `You are ScholarBot for ScholarHub India. Help ${user.name} find scholarships. Be concise, warm, and accurate. Use data provided.
Profile: ${user.level}, ${user.field}, ${user.marks_percent}%, ₹${user.annual_income_lpa}L income, ${user.category}, ${user.state}.
Saved scholarships: ${savedScholNames || "None yet"}.
${memorySummary}
Available scholarships:\n${scholarData}

Rules:
- Be specific with names and amounts
- Use ** for emphasis
- Keep responses under 200 words unless asked for details
- End with a natural follow-up question when relevant`;

    const recentMessages = messages.slice(-MAX_CONTEXT_MESSAGES);
    const history = recentMessages.filter(m => m.text).map(m => ({ role: m.role === "bot" ? "assistant" : "user", content: m.text })).concat([{ role: "user", content: msg }]);

    const botMsg = { role: "bot", text: "", streaming: true, ts: Date.now() };
    setMessages(m => [...m, botMsg]);

    try {
      let fullText = "";
      await callClaudeChat(history, system, (full) => {
        fullText = full;
        setMessages(m => m.map((msg, i) => i === m.length - 1 ? { ...msg, text: full } : msg));
      });
      // Add follow-up suggestions
      const suggestions = extractSuggestions(fullText);
      setMessages(m => m.map((msg, i) => i === m.length - 1 ? { ...msg, streaming: false, suggestions } : msg));
    } catch (e) {
      const errText = "⚠️ Connection error. Please try again in a moment!";
      setMessages(m => m.map((msg, i) => i === m.length - 1 ? { ...msg, text: errText, streaming: false } : msg));
    } finally {
      setLoading(false);
    }
  };

  const lastBotSuggestions = [...messages].reverse().find(m => m.role === "bot" && m.suggestions)?.suggestions || [];

  return (
    <div className="fade-in">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="dash-section-title" style={{ fontSize: 24, marginBottom: 4 }}>
            <div className="icon-badge" style={{ background: "#ede9fe", color: "#7c3aed", width: 36, height: 36 }}>🤖</div>
            ScholarBot
          </h1>
          <p style={{ color: "var(--gray-500)", fontSize: 14 }}>
            Your AI Advisor • {messages.length} messages • Online & Ready to Help
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="card" style={{ padding: "8px 16px", borderRadius: 12, display: "flex", alignItems: "center", gap: 10 }}>
            <div className="online-dot" />
            <span style={{ fontSize: 13, fontWeight: 700, color: "#059669" }}>Live</span>
          </div>
          <button className="btn btn-ghost btn-sm" style={{ fontWeight: 700, color: "var(--danger)" }} onClick={() => setShowClearDlg(true)}>🗑️ Clear</button>
        </div>
      </div>

      {showClearDlg && (
        <div className="modal-overlay" onClick={() => setShowClearDlg(false)}>
          <div className="dash-card" style={{ maxWidth: 400, textAlign: "center", padding: 32 }} onClick={e => e.stopPropagation()}>
            <div style={{ fontSize: 40, marginBottom: 16 }}>🗑️</div>
            <h3 style={{ fontWeight: 800, fontSize: 18, marginBottom: 8 }}>Clear conversation?</h3>
            <p style={{ color: "var(--gray-500)", fontSize: 14, marginBottom: 24 }}>This will permanently delete your chat history with ScholarBot in this browser.</p>
            <div className="flex gap-3 justify-center">
              <button className="btn btn-ghost" onClick={() => setShowClearDlg(false)}>Cancel</button>
              <button className="btn btn-primary" style={{ background: "var(--danger)", borderColor: "var(--danger)" }} onClick={() => { localStorage.removeItem(STORAGE_KEY); setMessages([WELCOME(scholarships.length)]); setShowClearDlg(false); }}>Yes, Clear it</button>
            </div>
          </div>
        </div>
      )}

      <div className="chat-container" style={{ height: 600 }}>
        <div className="chat-messages">
          {messages.map((msg, i) => (
            <div key={i}>
              <div className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                <div className={`chat-bubble ${msg.role}`}>
                  {msg.role === "bot" && (
                    <div style={{ fontWeight: 800, fontSize: 11, color: "var(--primary)", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 6 }}>ScholarBot</div>
                  )}
                  {renderMarkdown(msg.text)}
                  {msg.streaming && <span className="streaming-cursor" />}
                  <div style={{ fontSize: 10, marginTop: 6, opacity: 0.6, textAlign: msg.role === "user" ? "right" : "left" }}>
                    {formatTs(msg.ts)}
                  </div>
                </div>
              </div>
              {/* Follow-up suggestions after bot messages */}
              {msg.role === "bot" && msg.suggestions && msg.suggestions.length > 0 && !msg.streaming && i === messages.length - 1 && (
                <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginTop: 8, marginLeft: 8 }}>
                  {msg.suggestions.map((s, j) => (
                    <button
                      key={j}
                      onClick={() => send(s)}
                      style={{
                        padding: "6px 14px", borderRadius: 20, fontSize: 12, fontWeight: 600,
                        background: "var(--primary-pale)", color: "var(--primary)",
                        border: "1px solid var(--primary-light)", cursor: "pointer",
                        transition: "all 0.2s",
                      }}
                      onMouseOver={e => { e.target.style.background = "var(--primary)"; e.target.style.color = "#fff"; }}
                      onMouseOut={e => { e.target.style.background = "var(--primary-pale)"; e.target.style.color = "var(--primary)"; }}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
          <div ref={bottomRef} />
        </div>

        <div style={{ padding: 16, background: "var(--bg-card)", borderTop: "1px solid var(--gray-200)" }}>
          <div className="pill-tabs" style={{ marginBottom: 12, overflowX: "auto", flexWrap: "nowrap" }}>
            {QUICK_ACTIONS.map(q => (
              <button key={q} className="pill-tab" style={{ fontSize: 11, padding: "6px 14px", whiteSpace: "nowrap" }} onClick={() => send(q)}>{q}</button>
            ))}
          </div>
          <div className="chat-input-area" style={{ padding: 0, border: "none" }}>
            <input
              className="input"
              style={{ borderRadius: 16, height: 50, padding: "0 20px" }}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === "Enter" && send()}
              placeholder="Ask anything about scholarships, eligibility, or procedures..."
              disabled={loading}
            />
            <button className="btn btn-primary" style={{ width: 50, height: 50, borderRadius: 16, padding: 0 }} onClick={() => send()} disabled={loading || !input.trim()}>
              {loading ? "..." : "→"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
