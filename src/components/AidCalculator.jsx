import { useState } from "react";

export default function AidCalculator({ scholarships, calcSelected, setCalcSelected }) {
  const [showConflictInfo, setShowConflictInfo] = useState(false);

  const toggle = (id) => setCalcSelected(s => {
    const n = new Set(s);
    n.has(id) ? n.delete(id) : n.add(id);
    return n;
  });

  const selectedSchols = scholarships.filter(s => calcSelected.has(s.id));
  const govSelected    = selectedSchols.filter(s => s.type === "government");
  const hasConflict    = govSelected.length > 1;

  const totalPotential  = selectedSchols.reduce((a, s) => a + s.amount_value, 0);
  const stackableAmount = hasConflict
    ? selectedSchols.filter(s => s.type !== "government").reduce((a, s) => a + s.amount_value, 0) +
      (govSelected.length > 0 ? Math.max(...govSelected.map(s => s.amount_value)) : 0)
    : totalPotential;

  const fmt = (n) => n >= 100000 ? `₹${(n / 100000).toFixed(1)}L` : n >= 1000 ? `₹${(n / 1000).toFixed(0)}K` : `₹${n}`;

  return (
    <div className="fade-in">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="dash-section-title" style={{ fontSize: 24, marginBottom: 4 }}>
            <div className="icon-badge" style={{ background: "#fef3c7", color: "#d97706", width: 36, height: 36 }}>💰</div>
            Financial Aid Stack Calculator
          </h1>
          <p style={{ color: "var(--gray-500)", fontSize: 14 }}>Select multiple scholarships to calculate total potential aid and detect stacking conflicts.</p>
        </div>
        {calcSelected.size > 0 && (
          <button className="btn btn-ghost btn-sm" style={{ fontWeight: 700, color: "var(--danger)" }} onClick={() => setCalcSelected(new Set())}>✕ Clear Selection</button>
        )}
      </div>

      <div className="grid-2 gap-8">
        <div>
          <h3 style={{ fontWeight: 800, fontSize: 16, color: "var(--navy)", marginBottom: 16 }}>Select Scholarships</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {scholarships.slice(0, 15).map(s => {
              const selected = calcSelected.has(s.id);
              return (
                <div key={s.id} className="premium-card" style={{ padding: 16, cursor: "pointer", border: selected ? "1px solid var(--primary)" : "1px solid var(--gray-200)", background: selected ? "#eff6ff" : "#fff" }}
                  onClick={() => toggle(s.id)}>
                  <div className="flex items-center gap-4">
                    <div style={{ width: 20, height: 20, borderRadius: 6, border: `2px solid ${selected ? "var(--primary)" : "var(--gray-300)"}`, background: selected ? "var(--primary)" : "#fff", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      {selected && <span style={{ color: "#fff", fontSize: 12, fontWeight: 800 }}>✓</span>}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 800, fontSize: 13, color: "var(--navy)" }}>{s.name}</div>
                      <div style={{ fontSize: 11, color: "var(--gray-500)", marginTop: 2 }}>{s.provider}</div>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <div style={{ fontWeight: 800, fontSize: 14, color: "#059669" }}>{fmt(s.amount_value)}</div>
                      <span className={`badge ${s.type === "government" ? "badge-blue" : "badge-purple"}`} style={{ fontSize: 9 }}>{s.type}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div>
          <h3 style={{ fontWeight: 800, fontSize: 16, color: "var(--navy)", marginBottom: 16 }}>Aid Summary</h3>
          {calcSelected.size === 0 ? (
            <div className="dash-card" style={{ textAlign: "center", padding: "60px 20px" }}>
              <div style={{ fontSize: 40, marginBottom: 16 }}>📈</div>
              <p style={{ fontWeight: 800, fontSize: 16, color: "var(--navy)" }}>Nothing selected yet</p>
              <p style={{ color: "var(--gray-500)", fontSize: 13, marginTop: 8 }}>Choose scholarships from the list to see your total potential funding.</p>
            </div>
          ) : (
            <>
              <div className="grid-2 gap-4 mb-6">
                {[
                  { label: "Total If All Won",    value: fmt(totalPotential),   color: "#059669", icon: "💵" },
                  { label: "Stackable Maximum",   value: fmt(stackableAmount),  color: "var(--primary)", icon: "📊" },
                ].map(s => (
                  <div key={s.label} className="dash-card" style={{ padding: 24, borderTop: `4px solid ${s.color}` }}>
                    <div style={{ fontSize: 24, marginBottom: 8 }}>{s.icon}</div>
                    <div style={{ fontSize: 28, fontWeight: 900, color: s.color }}>{s.value}</div>
                    <div style={{ fontSize: 12, color: "var(--gray-500)", fontWeight: 700, marginTop: 4 }}>{s.label}</div>
                  </div>
                ))}
              </div>

              {hasConflict && (
                <div className="dash-card mb-6" style={{ background: "#fef2f2", border: "1px solid #fca5a5", padding: 20 }}>
                  <div className="flex gap-3">
                    <span style={{ fontSize: 20 }}>⚠️</span>
                    <div>
                      <div style={{ fontWeight: 800, color: "#991b1b", fontSize: 14 }}>Stacking Conflict Detected</div>
                      <p style={{ fontSize: 13, color: "#7f1d1d", marginTop: 4, lineHeight: 1.5 }}>
                        Government schemes usually don't allow "double dipping". We've adjusted your total by only including the highest-value govt scholarship.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <div className="premium-card" style={{ padding: 24 }}>
                <div style={{ fontWeight: 800, fontSize: 14, color: "var(--navy)", marginBottom: 16 }}>Breakdown</div>
                {selectedSchols.map((s, i) => {
                  const isConflicting = hasConflict && s.type === "government" && s.amount_value !== Math.max(...govSelected.map(g => g.amount_value));
                  return (
                    <div key={s.id} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
                      <div>
                        <div style={{ fontWeight: 700, fontSize: 13, color: isConflicting ? "var(--gray-300)" : "var(--navy)", textDecoration: isConflicting ? "line-through" : "none" }}>{s.name.slice(0, 30)}...</div>
                        <span className={`badge ${isConflicting ? "badge-gray" : "badge-blue"}`} style={{ fontSize: 9, marginTop: 4 }}>{s.type}</span>
                      </div>
                      <div style={{ textAlign: "right" }}>
                        <div style={{ fontWeight: 800, fontSize: 14, color: isConflicting ? "var(--gray-300)" : "#059669" }}>{fmt(s.amount_value)}</div>
                        <div style={{ fontSize: 10, fontWeight: 800, color: isConflicting ? "var(--danger)" : "var(--success)" }}>{isConflicting ? "CONFLICT" : "STACKABLE"}</div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="mt-8 flex gap-3">
                <button className="btn btn-primary w-full" style={{ borderRadius: 12, fontWeight: 800 }}>📥 Download Report</button>
                <button className="btn btn-ghost w-full" style={{ fontWeight: 800, color: "var(--primary)" }}>📋 Save to Tracker</button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
