import { useState } from "react";

export default function ApplicationTracker({ tracker, onUpdateStage, onRemove, onViewScholar, scholarships, onExportCSV }) {
  const STAGES = ["Drafting", "Applied", "Under Review", "Result Pending", "Won", "Rejected"];
  
  const getStageColor = (stage) => {
    switch(stage) {
      case "Won": return "#10b981";
      case "Rejected": return "#ef4444";
      case "Applied": return "#3b82f6";
      case "Under Review": return "#f59e0b";
      default: return "#94a3b8";
    }
  };

  const getStageBg = (stage) => {
    switch(stage) {
      case "Won": return "#ecfdf5";
      case "Rejected": return "#fef2f2";
      case "Applied": return "#eff6ff";
      case "Under Review": return "#fffbeb";
      default: return "#f8fafc";
    }
  };

  return (
    <div className="fade-in">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="dash-section-title" style={{ fontSize: 24, marginBottom: 4 }}>
            <div className="icon-badge" style={{ background: "#ede9fe", color: "#7c3aed", width: 36, height: 36 }}>📋</div>
            Application Tracker
          </h1>
          <p style={{ color: "var(--gray-500)", fontSize: 14 }}>Track your progress and stay on top of your scholarship applications.</p>
        </div>
        <div className="flex gap-4">
          {onExportCSV && tracker.length > 0 && (
            <button className="btn btn-ghost btn-sm" onClick={onExportCSV} style={{ fontWeight: 700 }}>
              📥 Export CSV
            </button>
          )}
          <div className="dash-card" style={{ padding: "12px 20px", display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ color: "var(--primary)", fontWeight: 800, fontSize: 20 }}>{tracker.length}</div>
            <div style={{ fontSize: 12, fontWeight: 700, color: "var(--gray-500)", textTransform: "uppercase" }}>Total</div>
          </div>
          <div className="dash-card" style={{ padding: "12px 20px", display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ color: "#10b981", fontWeight: 800, fontSize: 20 }}>{tracker.filter(t => t.stage === "Won").length}</div>
            <div style={{ fontSize: 12, fontWeight: 700, color: "var(--gray-500)", textTransform: "uppercase" }}>Won</div>
          </div>
        </div>
      </div>

      <div className="tracker-grid">
        {STAGES.map(stage => {
          const items = tracker.filter(t => t.stage === stage);
          return (
            <div key={stage} className="tracker-col">
              <div className="tracker-col-header">
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <div style={{ width: 8, height: 8, borderRadius: "50%", background: getStageColor(stage) }} />
                  <span style={{ fontWeight: 800, fontSize: 14, color: "var(--navy)" }}>{stage}</span>
                </div>
                <span className="badge badge-gray" style={{ fontSize: 10, fontWeight: 800 }}>{items.length}</span>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {items.length === 0 ? (
                  <div style={{ padding: "32px 16px", textAlign: "center", border: "2px dashed var(--gray-200)", borderRadius: 12, opacity: 0.5 }}>
                    <div style={{ fontSize: 20, marginBottom: 4 }}>🍃</div>
                    <p style={{ fontSize: 11, fontWeight: 600 }}>Empty</p>
                  </div>
                ) : (
                  items.map(item => {
                    const schol = scholarships.find(s => s.id === item.scholarshipId);
                    return (
                      <div key={item.id} className="tracker-card">
                        <div style={{ fontSize: 13, fontWeight: 800, color: "var(--navy)", marginBottom: 4, cursor: "pointer" }} onClick={() => schol && onViewScholar(schol)}>
                          {item.name}
                        </div>
                        <div style={{ fontSize: 11, color: "var(--gray-500)", marginBottom: 12 }}>{schol?.provider || "Provider unknown"}</div>
                        
                        <div className="flex items-center justify-between mt-4 pt-4 border-t">
                          <select 
                            style={{ border: "none", background: "transparent", fontSize: 11, fontWeight: 800, color: "var(--primary)", outline: "none", cursor: "pointer" }}
                            value={item.stage}
                            onChange={(e) => onUpdateStage(item.id, e.target.value)}
                          >
                            {STAGES.map(s => <option key={s} value={s}>{s}</option>)}
                          </select>
                          <button 
                            className="btn btn-ghost btn-sm" 
                            style={{ color: "var(--danger)", padding: 4 }}
                            onClick={() => onRemove(item.id)}
                          >
                            🗑️
                          </button>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
