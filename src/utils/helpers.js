// ===== ScholarHub Utility Helpers =====

/** Format rupee amount from number */
export const fmtAmount = (n) => {
  if (!n || n === 999) return "No limit";
  if (n >= 100000) return `₹${(n / 100000).toFixed(1)}L`;
  if (n >= 1000)   return `₹${(n / 1000).toFixed(0)}K`;
  return `₹${n}`;
};

/** Days until a deadline string (YYYY-MM-DD) */
export const daysUntil = (dateStr) => {
  if (!dateStr) return 999;
  const diff = new Date(dateStr).setHours(0,0,0,0) - new Date().setHours(0,0,0,0);
  return Math.ceil(diff / 86400000);
};

/** Deadline chip class based on days remaining */
export const deadlineClass = (dateStr) => {
  const d = daysUntil(dateStr);
  if (d < 0)   return "deadline-chip deadline-urgent";
  if (d <= 7)  return "deadline-chip deadline-urgent";
  if (d <= 30) return "deadline-chip deadline-soon";
  return "deadline-chip deadline-ok";
};

/** Deadline label */
export const deadlineLabel = (dateStr) => {
  const d = daysUntil(dateStr);
  if (d < 0)  return `Closed ${Math.abs(d)}d ago`;
  if (d === 0) return "Closes today!";
  if (d === 1) return "1 day left";
  if (d <= 7)  return `${d} days left`;
  if (d <= 30) return `${d} days left`;
  return new Date(dateStr).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
};

/** Match score color */
export const matchColor = (score) => {
  if (score >= 80) return { border: "#10b981", color: "#10b981" };
  if (score >= 60) return { border: "#f59e0b", color: "#f59e0b" };
  return { border: "#6B7280", color: "#6B7280" };
};

/** Calculate match score against user profile */
export const calcMatchScore = (schol, user) => {
  let score = 0;
  if (schol.field.includes(user.field) || schol.field.includes("all"))           score += 30;
  if (schol.categories.includes(user.category.toLowerCase()) || schol.categories.includes("general")) score += 20;
  if (user.annual_income_lpa <= (schol.max_family_income_lpa || 999))            score += 15;
  if (user.marks_percent >= (schol.min_marks_percent || 0))                      score += 15;
  if (schol.states.includes("all") || schol.states.includes(user.state))         score += 10;
  if (schol.level.includes(user.level))                                           score += 10;
  if (schol.success_rate_estimate > 50)  score += 5;
  if (daysUntil(schol.deadline) > 30)    score += 3;
  return Math.min(score, 100);
};

/** Difficulty badge class */
export const difficultyBadge = (d) => {
  if (d === "easy")   return "badge badge-green";
  if (d === "medium") return "badge badge-amber";
  return "badge badge-red";
};

/** Format date to readable Indian format */
export const fmtDate = (dateStr) => {
  if (!dateStr) return "N/A";
  return new Date(dateStr).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
};

/** Truncate text */
export const truncate = (str, n = 100) => str && str.length > n ? str.slice(0, n) + "…" : str;

/** Type badge class */
export const typeBadge = (type) => {
  const map = { government: "badge-blue", private: "badge-purple", ngo: "badge-teal", international: "badge-amber" };
  return `badge ${map[type] || "badge-gray"}`;
};
