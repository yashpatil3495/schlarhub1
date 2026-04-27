// src/lib/notifications.js — Browser push notification service
const NOTIF_KEY = "scholarhub_notif_prefs";
const SCHEDULED_KEY = "scholarhub_notif_scheduled";

export function getNotifPrefs() {
  try { return JSON.parse(localStorage.getItem(NOTIF_KEY) || "{}"); }
  catch { return {}; }
}

export function saveNotifPrefs(prefs) {
  localStorage.setItem(NOTIF_KEY, JSON.stringify(prefs));
}

export function isNotifSupported() {
  return "Notification" in window;
}

export function getNotifPermission() {
  if (!isNotifSupported()) return "unsupported";
  return Notification.permission; // "granted" | "denied" | "default"
}

export async function requestNotifPermission() {
  if (!isNotifSupported()) return "unsupported";
  const result = await Notification.requestPermission();
  if (result === "granted") {
    saveNotifPrefs({ ...getNotifPrefs(), enabled: true, grantedAt: Date.now() });
  }
  return result;
}

export function sendBrowserNotification(title, body, icon = "🎓") {
  if (getNotifPermission() !== "granted") return;
  try {
    new Notification(title, {
      body,
      icon: `data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text y=".9em" font-size="90">${icon}</text></svg>`,
      badge: icon,
      tag: `scholarhub-${Date.now()}`,
    });
  } catch (e) {
    console.warn("Notification failed:", e);
  }
}

// Schedule deadline notifications for saved scholarships
export function scheduleDeadlineNotifications(scholarships, savedIds) {
  const scheduled = getScheduledNotifs();
  const now = Date.now();

  savedIds.forEach((id) => {
    const schol = scholarships.find((s) => s.id === id);
    if (!schol || !schol.deadline) return;

    const deadlineMs = new Date(schol.deadline).getTime();
    const daysLeft = Math.ceil((deadlineMs - now) / 86400000);

    // Notify at 7 days, 3 days, 1 day before deadline
    [7, 3, 1].forEach((d) => {
      const key = `${id}_${d}d`;
      if (scheduled[key]) return; // already notified
      if (daysLeft === d) {
        sendBrowserNotification(
          `⏰ ${schol.name}`,
          `Only ${d} day${d > 1 ? "s" : ""} left to apply! Deadline: ${schol.deadline}`,
          "⏰"
        );
        scheduled[key] = Date.now();
      }
    });
  });

  localStorage.setItem(SCHEDULED_KEY, JSON.stringify(scheduled));
}

function getScheduledNotifs() {
  try { return JSON.parse(localStorage.getItem(SCHEDULED_KEY) || "{}"); }
  catch { return {}; }
}
