import { useState, useMemo } from "react";
import { daysUntil } from "../utils/helpers.js";

const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];
const DAYS   = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];

export default function DeadlineCalendar({ scholarships, saved }) {
  const today = new Date();
  const [year,  setYear]  = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());
  const [selectedDay, setSelectedDay] = useState(null);
  const [view, setView]   = useState("calendar");
  const [filter, setFilter] = useState("all");

  const displaySchols = filter === "saved"
    ? scholarships.filter(s => saved.has(s.id))
    : scholarships;

  const deadlineMap = useMemo(() => {
    const map = {};
    displaySchols.forEach(s => {
      if (!s.deadline) return;
      const key = s.deadline.slice(0, 10);
      if (!map[key]) map[key] = [];
      map[key].push(s);
    });
    return map;
  }, [displaySchols]);

  const calendarDays = useMemo(() => {
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const prevDays    = new Date(year, month, 0).getDate();
    const days = [];
    for (let i = firstDay - 1; i >= 0; i--) {
      days.push({ day: prevDays - i, current: false });
    }
    for (let d = 1; d <= daysInMonth; d++) {
      days.push({ day: d, current: true });
    }
    const remaining = 42 - days.length;
    for (let d = 1; d <= remaining; d++) {
      days.push({ day: d, current: false });
    }
    return days;
  }, [year, month]);

  const prevMonth = () => { if (month === 0) { setYear(y => y - 1); setMonth(11); } else setMonth(m => m - 1); };
  const nextMonth = () => { if (month === 11) { setYear(y => y + 1); setMonth(0);  } else setMonth(m => m + 1); };

  const getEventColor = (dateStr) => {
    const d = daysUntil(dateStr);
    if (d < 0) return "#fecaca";
    if (d <= 7) return "#fcd34d";
    return "#60a5fa";
  };

  const selectedDateStr = selectedDay ? `${year}-${String(month + 1).padStart(2,"0")}-${String(selectedDay).padStart(2,"0")}` : null;
  const selectedSchols  = selectedDateStr ? (deadlineMap[selectedDateStr] || []) : [];

  const upcomingDeadlines = useMemo(() => {
    return displaySchols
      .filter(s => s.deadline && daysUntil(s.deadline) >= 0)
      .sort((a, b) => new Date(a.deadline) - new Date(b.deadline))
      .slice(0, 15);
  }, [displaySchols]);

  return (
    <div className="fade-in">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="dash-section-title" style={{ fontSize: 24, marginBottom: 4 }}>
            <div className="icon-badge" style={{ background: "#dcfce7", color: "#166534", width: 36, height: 36 }}>📅</div>
            Deadline Calendar
          </h1>
          <p style={{ color: "var(--gray-500)", fontSize: 14 }}>Track upcoming scholarship deadlines and never miss a submission.</p>
        </div>
        <div className="pill-tabs" style={{ margin: 0 }}>
          <button className={`pill-tab ${view === "calendar" ? "active" : ""}`} onClick={() => setView("calendar")}>Calendar</button>
          <button className={`pill-tab ${view === "agenda" ? "active" : ""}`} onClick={() => setView("agenda")}>Agenda View</button>
        </div>
      </div>

      {view === "calendar" && (
        <div className="grid-2 gap-8" style={{ gridTemplateColumns: "1fr 340px" }}>
          <div className="dash-card" style={{ padding: 32 }}>
            <div className="flex items-center justify-between mb-8">
              <button className="btn btn-ghost" style={{ fontWeight: 800 }} onClick={prevMonth}>← Prev</button>
              <h2 style={{ fontWeight: 800, fontSize: 20, color: "var(--navy)" }}>{MONTHS[month]} {year}</h2>
              <button className="btn btn-ghost" style={{ fontWeight: 800 }} onClick={nextMonth}>Next →</button>
            </div>

            <div className="grid grid-cols-7 gap-2 mb-4">
              {DAYS.map(d => <div key={d} style={{ textAlign: "center", fontSize: 11, fontWeight: 800, color: "var(--gray-400)", textTransform: "uppercase" }}>{d}</div>)}
            </div>

            <div className="grid grid-cols-7 gap-2">
              {calendarDays.map((cell, i) => {
                const dateStr = cell.current ? `${year}-${String(month+1).padStart(2,"0")}-${String(cell.day).padStart(2,"0")}` : null;
                const events = dateStr ? (deadlineMap[dateStr] || []) : [];
                const isSelected = selectedDay === cell.day && cell.current;
                
                return (
                  <div key={i} 
                    className={`cal-day-box ${!cell.current ? "opacity-20" : ""}`}
                    style={{ 
                      aspectRatio: "1/1", borderRadius: 12, padding: 8, cursor: cell.current ? "pointer" : "default",
                      background: isSelected ? "var(--primary-light)" : "var(--gray-50)",
                      border: isSelected ? "2px solid var(--primary)" : "1px solid transparent",
                      display: "flex", flexDirection: "column", justifyContent: "space-between"
                    }}
                    onClick={() => cell.current && setSelectedDay(cell.day)}>
                    <span style={{ fontSize: 13, fontWeight: 800, color: isSelected ? "var(--primary)" : "var(--navy)" }}>{cell.day}</span>
                    <div className="flex gap-1">
                      {events.slice(0, 3).map((e, j) => (
                        <div key={j} style={{ width: 6, height: 6, borderRadius: "50%", background: getEventColor(e.deadline) }} />
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="dash-card" style={{ padding: 24 }}>
            <h3 style={{ fontWeight: 800, fontSize: 15, color: "var(--navy)", marginBottom: 16 }}>
              {selectedDay ? `${selectedDay} ${MONTHS[month]}` : "Select a date"}
            </h3>
            {selectedSchols.length === 0 ? (
              <div style={{ textAlign: "center", padding: 40, opacity: 0.5 }}>
                <div style={{ fontSize: 32, marginBottom: 8 }}>✅</div>
                <p style={{ fontSize: 13, fontWeight: 600 }}>No Deadlines</p>
              </div>
            ) : (
              <div className="flex flex-column gap-3">
                {selectedSchols.map(s => (
                  <div key={s.id} className="premium-card" style={{ padding: 16, borderLeft: `4px solid ${getEventColor(s.deadline)}` }}>
                    <div style={{ fontWeight: 800, fontSize: 13, color: "var(--navy)" }}>{s.name}</div>
                    <div style={{ fontSize: 11, color: "var(--gray-500)", marginTop: 4 }}>{s.provider}</div>
                    <div style={{ fontWeight: 800, fontSize: 12, color: "var(--primary)", marginTop: 8 }}>{s.amount}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {view === "agenda" && (
        <div className="dash-card" style={{ padding: 32 }}>
          <div className="flex flex-column gap-4">
            {upcomingDeadlines.map(s => (
              <div key={s.id} className="premium-card" style={{ padding: 24, display: "flex", alignItems: "center", gap: 24 }}>
                <div style={{ width: 60, textAlign: "center" }}>
                  <div style={{ fontSize: 24, fontWeight: 900, color: "var(--primary)" }}>{daysUntil(s.deadline)}</div>
                  <div style={{ fontSize: 10, fontWeight: 800, color: "var(--gray-400)", textTransform: "uppercase" }}>Days Left</div>
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 800, fontSize: 16, color: "var(--navy)" }}>{s.name}</div>
                  <div style={{ fontSize: 13, color: "var(--gray-500)", marginTop: 4 }}>{s.provider}</div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontWeight: 800, fontSize: 15, color: "#10b981" }}>{s.amount}</div>
                  <div style={{ fontSize: 12, color: "var(--gray-400)", marginTop: 4 }}>Deadline: {new Date(s.deadline).toLocaleDateString()}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
