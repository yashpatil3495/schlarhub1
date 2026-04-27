// src/components/NotificationsPage.jsx — wired to Supabase realtime
import { useNotifications } from "../hooks/useSupabase.js";

const ICON_BG = { deadline:"#fee2e2", match:"#eff6ff", reminder:"#fffbeb", community:"#f0fdf4", win:"#fef3c7", system:"#f9fafb" };

const MOCK = [
  { id:"m1", type:"deadline", icon:"🔔", title:"Deadline in 7 days", body:"AICTE Pragati Scholarship closes on Oct 20. Don\'t miss it!", created_at: new Date(Date.now()-7200000).toISOString(), is_read:false, color:"#fee2e2" },
  { id:"m2", type:"match",    icon:"🎯", title:"New scholarships match your profile", body:"HDFC Education Crisis Scholarship and UGC PG Scholarship were just added.", created_at: new Date(Date.now()-18000000).toISOString(), is_read:false, color:"#eff6ff" },
  { id:"m3", type:"reminder", icon:"📋", title:"Complete your profile", body:"You\'re 72% done. Add your CGPA to unlock 12 more matching scholarships.", created_at: new Date(Date.now()-86400000).toISOString(), is_read:false, color:"#fffbeb" },
  { id:"m4", type:"community",icon:"👥", title:"Your SOP received 2 peer reviews", body:"Average score: 4.2/5. Click to see detailed feedback.", created_at: new Date(Date.now()-259200000).toISOString(), is_read:true, color:"#f0fdf4" },
  { id:"m5", type:"win",      icon:"🏆", title:"Congratulations!", body:"Bahujan Welfare Scholarship marked Won — ₹80,000 added to your total.", created_at: new Date(Date.now()-604800000).toISOString(), is_read:true, color:"#fef3c7" },
];

export default function NotificationsPage() {
  const { notifications, loading, unreadCount, markRead, markAllRead } = useNotifications();
  const display = notifications.length > 0 ? notifications : MOCK;
  const unread  = notifications.length > 0 ? unreadCount : MOCK.filter(n => !n.is_read).length;

  const fmtTime = (iso) => {
    const h = (Date.now() - new Date(iso).getTime()) / 3600000;
    if (h < 1)  return "Just now";
    if (h < 24) return `${Math.floor(h)}h ago`;
    const d = Math.floor(h/24);
    if (d === 1) return "Yesterday";
    if (d < 7)  return `${d} days ago`;
    return new Date(iso).toLocaleDateString("en-IN",{day:"numeric",month:"short"});
  };

  return (
    <div className="fade-in" style={{ maxWidth: 680 }}>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="section-title">Notifications</h1>
          <p className="section-sub">{unread > 0 ? `${unread} unread` : "All caught up!"}</p>
        </div>
        {unread > 0 && <button className="btn btn-ghost btn-sm" onClick={markAllRead}>✓ Mark all read</button>}
      </div>

      <div className="card-lg" style={{ padding:0, marginBottom:24 }}>
        {loading ? (
          <div style={{ padding:"40px 24px", textAlign:"center" }}>
            <span className="loading-dots"><span className="dot"/><span className="dot"/><span className="dot"/></span>
          </div>
        ) : display.length === 0 ? (
          <div className="empty-state" style={{ padding:"48px 24px" }}>
            <div className="empty-icon">🔔</div>
            <p className="font-semibold">No notifications yet</p>
            <p className="text-sm text-muted mt-2">Save scholarships and we will remind you before deadlines</p>
          </div>
        ) : display.map((n, i) => (
          <div key={n.id} className={`notif-item ${!n.is_read ? "unread" : ""}`}
            style={{ borderBottom: i < display.length-1 ? "1px solid var(--gray-100)" : "none" }}
            onClick={() => markRead(n.id)}>
            <div className="notif-icon" style={{ background: n.color || ICON_BG[n.type] || "#f9fafb" }}>{n.icon || "🔔"}</div>
            <div style={{ flex:1, minWidth:0 }}>
              <div className="flex items-center justify-between gap-2">
                <span className="font-semibold text-sm">{n.title}</span>
                <span className="text-xs text-muted" style={{ flexShrink:0 }}>{fmtTime(n.created_at)}</span>
              </div>
              <p className="text-sm text-muted mt-1" style={{ lineHeight:1.5 }}>{n.body}</p>
            </div>
            {!n.is_read && <div style={{ width:8, height:8, borderRadius:"50%", background:"var(--primary)", flexShrink:0, marginTop:6 }} />}
          </div>
        ))}
      </div>

      <div className="card" style={{ background:"#eff6ff", border:"1px solid #bfdbfe", padding:"12px 16px" }}>
        <p className="text-sm" style={{ color:"var(--primary)" }}>
          📱 To enable <strong>WhatsApp reminders</strong>, go to <strong>Tools → WhatsApp Reminders</strong> and verify your phone number.
        </p>
      </div>
    </div>
  );
}
