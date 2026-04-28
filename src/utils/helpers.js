// ===== ScholarHub Utility Helpers =====

/** Safe string conversion — prevents .split() crash on numbers/arrays/null */
export const toStr = (val) => {
  if (val === null || val === undefined) return "";
  if (Array.isArray(val)) return val.join(", ");
  return String(val);
};

/** Safe array conversion — prevents crash when field/categories are not strings */
export const toArr = (val) => {
  if (val === null || val === undefined) return [];
  if (Array.isArray(val)) return val.map(v => String(v).trim()).filter(Boolean);
  if (typeof val !== "string") return [String(val)];
  return val.split(",").map(v => v.trim()).filter(Boolean);
};

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
  const diff = new Date(toStr(dateStr)).setHours(0,0,0,0) - new Date().setHours(0,0,0,0);
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
  if (d < 0)   return `Closed ${Math.abs(d)}d ago`;
  if (d === 0) return "Closes today!";
  if (d === 1) return "1 day left";
  if (d <= 7)  return `${d} days left`;
  if (d <= 30) return `${d} days left`;
  return new Date(toStr(dateStr)).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
};

/** Match score color */
export const matchColor = (score) => {
  if (score >= 80) return { border: "#10b981", color: "#10b981" };
  if (score >= 60) return { border: "#f59e0b", color: "#f59e0b" };
  return { border: "#6B7280", color: "#6B7280" };
};

/** Calculate match score against user profile — FIX: all fields guarded against non-string values */
export const calcMatchScore = (schol, user) => {
  let score = 0;
  const uField    = toStr(user?.field).toLowerCase();
  const uCategory = toStr(user?.category).toLowerCase();
  const uState    = toStr(user?.state);
  const uLevel    = toStr(user?.level).toLowerCase();
  const uIncome   = Number(user?.annual_income_lpa) || 0;
  const uMarks    = Number(user?.marks_percent) || 0;

  // FIX: use toArr so these never crash even if Supabase returns a number/null
  const sField  = toArr(schol.field);
  const sCats   = toArr(schol.categories);
  const sStates = toArr(schol.states);
  const sLevel  = toArr(schol.level);

  if (uField    && (sField.some(f => f.toLowerCase().includes(uField))    || sField.includes("all")))      score += 30;
  if (uCategory && (sCats.some(c  => c.toLowerCase().includes(uCategory)) || sCats.includes("general")))  score += 20;
  if (uIncome   <= (schol.max_family_income_lpa || 999))                                                    score += 15;
  if (uMarks    >= (schol.min_marks_percent || 0))                                                          score += 15;
  if (sStates.includes("all") || sStates.includes(uState))                                                  score += 10;
  if (uLevel    && sLevel.some(l => l.toLowerCase().includes(uLevel)))                                      score += 10;
  if (schol.success_rate_estimate > 50) score += 5;
  if (daysUntil(schol.deadline) > 30)   score += 3;

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
  return new Date(toStr(dateStr)).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
};

/** Truncate text */
export const truncate = (str, n = 100) => str && str.length > n ? str.slice(0, n) + "…" : str;

/** Type badge class */
export const typeBadge = (type) => {
  const map = { government: "badge-blue", private: "badge-purple", ngo: "badge-teal", international: "badge-amber" };
  return `badge ${map[type] || "badge-gray"}`;
};
