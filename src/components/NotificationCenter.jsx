// src/components/NotificationCenter.jsx — In-app notification bell with categories
import { useState, useEffect, useMemo } from "react";
import { daysUntil } from "../utils/helpers.js";

const CATEGORIES = [
  { id: "all", label: "All", icon: "📬" },
  { id: "deadline", label: "Deadlines", icon: "⏰" },
  { id: "match", label: "New Matches", icon: "🎯" },
  { id: "system", label: "System", icon: "⚙️" },
];

function generateNotifications(scholarships, saved, tracker) {
  const notifs = [];
  const now = Date.now();

  // Deadline warnings for saved/tracked scholarships
  scholarships.forEach(s => {
    const isSaved = saved.has?.(s.id) || saved.includes?.(s.id);
    const isTracked = tracker.some?.(t => t.scholarshipId === s.id);
    if (!isSaved && !isTracked) return;

    const days = daysUntil(s.deadline);
    if (days <= 0) {
      notifs.push({
        id: `expired_${s.id}`, type: "deadline", priority: "low",
        title: `${s.name} — Expired`,
        message: `This scholarship's deadline has passed.`,
        time: now - 86400000, icon: "⏳", read: true,
      });
    } else if (days <= 3) {
      notifs.push({
        id: `urgent_${s.id}`, type: "deadline", priority: "urgent",
        title: `⚠️ ${s.name} — ${days} day${days > 1 ? "s" : ""} left!`,
        message: `Apply NOW! Deadline: ${s.deadline}. Don't miss this opportunity.`,
        time: now, icon: "🔴", read: false,
      });
    } else if (days <= 7) {
      notifs.push({
        id: `soon_${s.id}`, type: "deadline", priority: "high",
        title: `${s.name} — ${days} days left`,
        message: `Deadline approaching: ${s.deadline}. Start your application soon.`,
        time: now - 3600000, icon: "🟡", read: false,
      });
    } else if (days <= 30) {
      notifs.push({
        id: `month_${s.id}`, type: "deadline", priority: "medium",
        title: `${s.name} — ${days} days remaining`,
        message: `You have time but start gathering documents.`,
        time: now - 86400000 * 2, icon: "🟢", read: true,
      });
    }
  });

  // New high-match scholarships
  scholarships
    .filter(s => daysUntil(s.deadline) > 0)
    .slice(0, 5)
    .forEach((s, i) => {
      notifs.push({
        id: `match_${s.id}`, type: "match", priority: "medium",
        title: `New Match: ${s.name}`,
        message: `${s.provider} — ${s.amount}. Check your eligibility!`,
        time: now - 86400000 * (i + 1), icon: "✨", read: i > 1,
      });
    });

  // System notifications
  notifs.push({
    id: "welcome", type: "system", priority: "low",
    title: "Welcome to ScholarHub v5! 🎉",
    message: "New features: AI Comparison Tool, Debounced Search, Toast Notifications, and more.",
    time: now - 86400000 * 3, icon: "🚀", read: true,
  });

  return notifs.sort((a, b) => b.time - a.time);
}

export default function NotificationCenter({ scholarships = [], saved = new Set(), tracker = [], onClose }) {
  const [activeCategory, setActiveCategory] = useState("all");
  const [readIds, setReadIds] = useState(() => {
    try { return new Set(JSON.parse(localStorage.getItem("scholarhub_read_notifs") || "[]")); }
    catch { return new Set(); }
  });

  const allNotifs = useMemo(() => generateNotifications(scholarships, saved, tracker), [scholarships, saved, tracker]);

  const filtered = activeCategory === "all" ? allNotifs : allNotifs.filter(n => n.type === activeCategory);
  const unreadCount = allNotifs.filter(n => !n.read && !readIds.has(n.id)).length;

  const markRead = (id) => {
    setReadIds(prev => {
      const next = new Set(prev);
      next.add(id);
      localStorage.setItem("scholarhub_read_notifs", JSON.stringify([...next]));
      return next;
    });
  };

  const markAllRead = () => {
    const allIds = allNotifs.map(n => n.id);
    setReadIds(new Set(allIds));
    localStorage.setItem("scholarhub_read_notifs", JSON.stringify(allIds));
  };

  const formatTime = (ts) => {
    const diff = Date.now() - ts;
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
    return `${Math.floor(diff / 86400000)}d ago`;
  };

  return (
    <div style={{
      position: "fixed", top: 0, right: 0, bottom: 0, width: "min(420px, 100vw)",
      background: "var(--bg-card)", boxShadow: "-8px 0 40px rgba(0,0,0,0.15)",
      zIndex: 1000, display: "flex", flexDirection: "column",
      animation: "slideInRight 0.3s ease",
    }}>
      {/* Header */}
      <div style={{
        padding: "20px 20px 12px", borderBottom: "1.5px solid var(--gray-100)",
        display: "flex", alignItems: "center", justifyContent: "space-between",
      }}>
        <div>
          <h2 style={{ fontSize: 18, fontWeight: 700, color: "var(--navy)", margin: 0 }}>
            🔔 Notifications
          </h2>
          <p style={{ fontSize: 12, color: "var(--gray-500)", margin: "4px 0 0" }}>
            {unreadCount > 0 ? `${unreadCount} unread` : "All caught up! ✨"}
          </p>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          {unreadCount > 0 && (
            <button onClick={markAllRead} style={{
              background: "none", border: "1px solid var(--gray-200)", borderRadius: 8,
              padding: "6px 10px", fontSize: 11, cursor: "pointer", color: "var(--primary)", fontWeight: 600,
            }}>Mark all read</button>
          )}
          <button onClick={onClose} style={{
            background: "none", border: "1px solid var(--gray-200)", borderRadius: 8,
            width: 32, height: 32, cursor: "pointer", fontSize: 16,
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>✕</button>
        </div>
      </div>

      {/* Category Tabs */}
      <div style={{ padding: "12px 20px 0", display: "flex", gap: 6, overflowX: "auto" }}>
        {CATEGORIES.map(c => (
          <button key={c.id} onClick={() => setActiveCategory(c.id)} style={{
            padding: "6px 14px", borderRadius: 20, border: "none", fontSize: 12, fontWeight: 600,
            cursor: "pointer", whiteSpace: "nowrap",
            background: activeCategory === c.id ? "var(--primary)" : "var(--gray-100, #f1f5f9)",
            color: activeCategory === c.id ? "#fff" : "var(--gray-500)",
            transition: "all 0.2s",
          }}>{c.icon} {c.label}</button>
        ))}
      </div>

      {/* Notification List */}
      <div style={{ flex: 1, overflowY: "auto", padding: "12px 16px" }}>
        {filtered.length === 0 ? (
          <div style={{ textAlign: "center", padding: "60px 20px", color: "var(--gray-400)" }}>
            <div style={{ fontSize: 40, marginBottom: 8 }}>📭</div>
            <p style={{ fontSize: 14, fontWeight: 600 }}>No notifications here</p>
          </div>
        ) : filtered.map(n => {
          const isUnread = !n.read && !readIds.has(n.id);
          return (
            <div key={n.id} onClick={() => markRead(n.id)} style={{
              padding: "14px 16px", borderRadius: 14, marginBottom: 8, cursor: "pointer",
              background: isUnread ? "rgba(26,86,219,0.04)" : "transparent",
              border: `1px solid ${isUnread ? "rgba(26,86,219,0.12)" : "var(--gray-100)"}`,
              transition: "all 0.2s",
            }}>
              <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                <span style={{ fontSize: 18 }}>{n.icon}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontSize: 13, fontWeight: isUnread ? 700 : 600, color: "var(--navy)" }}>{n.title}</span>
                    {isUnread && <span style={{ width: 8, height: 8, borderRadius: "50%", background: "var(--primary)", flexShrink: 0 }} />}
                  </div>
                  <p style={{ fontSize: 12, color: "var(--gray-500)", margin: "4px 0 0", lineHeight: 1.5 }}>{n.message}</p>
                  <span style={{ fontSize: 11, color: "var(--gray-400)", marginTop: 4, display: "block" }}>{formatTime(n.time)}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
