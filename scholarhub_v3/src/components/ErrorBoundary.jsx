// src/components/ErrorBoundary.jsx — Catches React rendering errors
import { Component } from "react";

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({ errorInfo });
    console.error("[ScholarHub Error Boundary]", error, errorInfo);
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          minHeight: "300px", display: "flex", alignItems: "center", justifyContent: "center",
          padding: "40px 20px", fontFamily: "'Inter', sans-serif",
        }}>
          <div style={{
            background: "var(--bg-card, #fff)", borderRadius: 20, padding: "48px 40px",
            border: "1px solid var(--gray-200, #e2e8f0)", maxWidth: 500, textAlign: "center",
            boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
          }}>
            <div style={{ fontSize: 56, marginBottom: 16 }}>⚠️</div>
            <h2 style={{
              fontFamily: "'DM Sans', sans-serif", fontSize: 22, fontWeight: 800,
              color: "var(--navy, #0f172a)", marginBottom: 8,
            }}>
              Something went wrong
            </h2>
            <p style={{ color: "var(--gray-500, #64748b)", fontSize: 14, marginBottom: 24, lineHeight: 1.6 }}>
              {this.props.fallbackMessage || "This section encountered an error. Your data is safe."}
            </p>
            {this.state.error && (
              <details style={{
                background: "var(--gray-50, #f8fafc)", borderRadius: 12, padding: "12px 16px",
                marginBottom: 24, textAlign: "left", fontSize: 12, color: "var(--gray-500)",
                border: "1px solid var(--gray-200, #e2e8f0)",
              }}>
                <summary style={{ cursor: "pointer", fontWeight: 600, marginBottom: 8 }}>Error Details</summary>
                <pre style={{ whiteSpace: "pre-wrap", wordBreak: "break-word", margin: 0 }}>
                  {this.state.error.toString()}
                </pre>
              </details>
            )}
            <button
              onClick={this.handleRetry}
              style={{
                background: "linear-gradient(135deg, #1a56db, #1e3a8a)", color: "#fff",
                border: "none", borderRadius: 12, padding: "12px 28px", fontSize: 14,
                fontWeight: 700, cursor: "pointer", fontFamily: "'DM Sans', sans-serif",
                boxShadow: "0 4px 12px rgba(26,86,219,0.3)",
                transition: "all 0.2s",
              }}
              onMouseOver={e => e.target.style.transform = "translateY(-2px)"}
              onMouseOut={e => e.target.style.transform = "translateY(0)"}
            >
              🔄 Try Again
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
