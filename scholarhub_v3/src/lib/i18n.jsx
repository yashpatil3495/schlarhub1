// src/lib/i18n.js — Lightweight internationalization
import { createContext, useContext, useState, useCallback } from "react";

const LANG_KEY = "scholarhub_lang";

// ── Translation dictionaries ─────────────────────────────────
const translations = {
  en: {
    // Nav
    "nav.dashboard": "Dashboard",
    "nav.scholarships": "Scholarships",
    "nav.applications": "My Applications",
    "nav.ai_tools": "AI Tools",
    "nav.community": "Community",
    "nav.tools": "Tools",
    // Dashboard
    "dash.welcome": "Welcome back",
    "dash.namaste": "Namaste",
    "dash.saved": "Saved",
    "dash.tracking": "Tracking",
    "dash.applied": "Applied",
    "dash.won": "Won",
    "dash.urgent": "Urgent Deadlines",
    "dash.top_matches": "Top Matches for You",
    "dash.ai_scored": "AI-scored",
    "dash.quick_actions": "Quick Actions",
    "dash.pipeline": "Application Pipeline",
    "dash.match_dist": "Match Distribution",
    "dash.timeline": "Upcoming Deadlines",
    "dash.no_urgent": "No urgent deadlines from your saved scholarships.",
    "dash.saved_schol": "saved scholarships",
    "dash.deadlines": "deadlines",
    "dash.in_30_days": "in the next 30 days",
    "dash.complete_profile": "Complete your profile to unlock better matches.",
    "dash.profile_pct": "Profile",
    "dash.complete": "complete",
    // Quick actions
    "qa.generate_sop": "Generate SOP",
    "qa.sop_desc": "AI-powered in 30 seconds",
    "qa.interview": "Interview Prep",
    "qa.interview_desc": "Practice with AI questions",
    "qa.find": "Find Scholarships",
    "qa.find_desc": "Browse all opportunities",
    "qa.calculator": "Aid Calculator",
    "qa.calculator_desc": "Stack your scholarships",
    "qa.peer": "Peer Review",
    "qa.peer_desc": "Get SOP feedback",
    "qa.map": "Explore Map",
    "qa.map_desc": "State-wise scholarships",
    // Auth
    "auth.login": "Login",
    "auth.create": "Create Account",
    "auth.welcome_back": "Welcome back!",
    "auth.sign_in_sub": "Sign in with your email and password to continue",
    "auth.join": "Join ScholarHub",
    "auth.join_sub": "Enter your email to get a verification code",
    "auth.email": "EMAIL ADDRESS",
    "auth.password": "PASSWORD",
    "auth.confirm_pw": "CONFIRM PASSWORD",
    "auth.full_name": "FULL NAME",
    "auth.sign_in": "Sign In",
    "auth.create_account": "Create My Account",
    "auth.send_code": "Send Verification Code",
    "auth.verify": "Verify Code",
    "auth.google": "Continue with Google",
    "auth.google_signup": "Sign up with Google",
    "auth.no_account": "Don't have an account?",
    "auth.have_account": "Already have an account?",
    "auth.create_one": "Create one →",
    "auth.sign_in_link": "Sign in →",
    "auth.forgot": "Forgot password?",
    "auth.back_home": "← Back to home",
    "auth.email_verified": "Email verified!",
    "auth.set_details": "Now set up your name and password",
    "auth.check_inbox": "Check your inbox",
    "auth.reset_pw": "Reset Password",
    "auth.new_pw": "NEW PASSWORD",
    "auth.reset_btn": "Reset & Sign In",
    // Notifications
    "notif.title": "Notifications",
    "notif.deadline_soon": "Deadline approaching",
    "notif.days_left": "days left",
    "notif.enable": "Enable browser notifications",
    "notif.enabled": "Notifications enabled",
    // General
    "general.loading": "Loading...",
    "general.save": "Save",
    "general.cancel": "Cancel",
    "general.close": "Close",
    "general.search": "Search",
    "general.filter": "Filter",
    "general.all": "All",
    "general.or": "OR",
    "general.verify_email": "OR VERIFY WITH EMAIL",
    // Profile
    "profile.title": "Profile",
    "profile.settings": "Settings",
    "profile.sign_out": "Sign Out",
    // Alerts
    "alerts.title": "Scholarship Alerts",
    "alerts.sub": "Get notified about new matching scholarships",
    "alerts.email_alerts": "Email Alerts",
    "alerts.frequency": "Frequency",
    "alerts.daily": "Daily",
    "alerts.weekly": "Weekly",
    "alerts.send_test": "Send Test Alert",
    "alerts.last_sent": "Last sent",
    "alerts.never": "Never",
  },
  hi: {
    // Nav
    "nav.dashboard": "डैशबोर्ड",
    "nav.scholarships": "छात्रवृत्तियाँ",
    "nav.applications": "मेरे आवेदन",
    "nav.ai_tools": "AI टूल्स",
    "nav.community": "समुदाय",
    "nav.tools": "उपकरण",
    // Dashboard
    "dash.welcome": "वापसी पर स्वागत है",
    "dash.namaste": "नमस्ते",
    "dash.saved": "सहेजे गए",
    "dash.tracking": "ट्रैकिंग",
    "dash.applied": "आवेदन किया",
    "dash.won": "जीते",
    "dash.urgent": "जरूरी समय सीमा",
    "dash.top_matches": "आपके लिए शीर्ष मैच",
    "dash.ai_scored": "AI-स्कोर",
    "dash.quick_actions": "त्वरित कार्य",
    "dash.pipeline": "आवेदन पाइपलाइन",
    "dash.match_dist": "मैच वितरण",
    "dash.timeline": "आगामी समय सीमा",
    "dash.no_urgent": "आपकी सहेजी गई छात्रवृत्तियों से कोई जरूरी समय सीमा नहीं।",
    "dash.saved_schol": "सहेजी गई छात्रवृत्तियाँ",
    "dash.deadlines": "समय सीमाएँ",
    "dash.in_30_days": "अगले 30 दिनों में",
    "dash.complete_profile": "बेहतर मैच के लिए अपनी प्रोफ़ाइल पूरी करें।",
    "dash.profile_pct": "प्रोफ़ाइल",
    "dash.complete": "पूर्ण",
    // Quick actions
    "qa.generate_sop": "SOP बनाएं",
    "qa.sop_desc": "AI से 30 सेकंड में",
    "qa.interview": "साक्षात्कार तैयारी",
    "qa.interview_desc": "AI प्रश्नों से अभ्यास करें",
    "qa.find": "छात्रवृत्ति खोजें",
    "qa.find_desc": "सभी अवसर ब्राउज़ करें",
    "qa.calculator": "सहायता कैलकुलेटर",
    "qa.calculator_desc": "अपनी छात्रवृत्तियाँ जोड़ें",
    "qa.peer": "पीयर रिव्यू",
    "qa.peer_desc": "SOP पर प्रतिक्रिया पाएं",
    "qa.map": "नक्शा देखें",
    "qa.map_desc": "राज्यवार छात्रवृत्तियाँ",
    // Auth
    "auth.login": "लॉगिन",
    "auth.create": "खाता बनाएं",
    "auth.welcome_back": "वापसी पर स्वागत है!",
    "auth.sign_in_sub": "जारी रखने के लिए अपने ईमेल और पासवर्ड से साइन इन करें",
    "auth.join": "ScholarHub से जुड़ें",
    "auth.join_sub": "सत्यापन कोड पाने के लिए अपना ईमेल दर्ज करें",
    "auth.email": "ईमेल पता",
    "auth.password": "पासवर्ड",
    "auth.confirm_pw": "पासवर्ड पुष्टि",
    "auth.full_name": "पूरा नाम",
    "auth.sign_in": "साइन इन",
    "auth.create_account": "मेरा खाता बनाएं",
    "auth.send_code": "सत्यापन कोड भेजें",
    "auth.verify": "कोड सत्यापित करें",
    "auth.google": "Google से जारी रखें",
    "auth.google_signup": "Google से साइन अप करें",
    "auth.no_account": "खाता नहीं है?",
    "auth.have_account": "पहले से खाता है?",
    "auth.create_one": "बनाएं →",
    "auth.sign_in_link": "साइन इन →",
    "auth.forgot": "पासवर्ड भूल गए?",
    "auth.back_home": "← होम पर वापस",
    "auth.email_verified": "ईमेल सत्यापित!",
    "auth.set_details": "अब अपना नाम और पासवर्ड सेट करें",
    "auth.check_inbox": "अपना इनबॉक्स चेक करें",
    "auth.reset_pw": "पासवर्ड रीसेट",
    "auth.new_pw": "नया पासवर्ड",
    "auth.reset_btn": "रीसेट करें और साइन इन करें",
    // Notifications
    "notif.title": "सूचनाएँ",
    "notif.deadline_soon": "समय सीमा निकट है",
    "notif.days_left": "दिन शेष",
    "notif.enable": "ब्राउज़र सूचनाएँ सक्षम करें",
    "notif.enabled": "सूचनाएँ सक्षम हैं",
    // General
    "general.loading": "लोड हो रहा है...",
    "general.save": "सहेजें",
    "general.cancel": "रद्द करें",
    "general.close": "बंद करें",
    "general.search": "खोजें",
    "general.filter": "फ़िल्टर",
    "general.all": "सभी",
    "general.or": "या",
    "general.verify_email": "या ईमेल से सत्यापित करें",
    // Profile
    "profile.title": "प्रोफ़ाइल",
    "profile.settings": "सेटिंग्स",
    "profile.sign_out": "साइन आउट",
    // Alerts
    "alerts.title": "छात्रवृत्ति अलर्ट",
    "alerts.sub": "नई मिलती-जुलती छात्रवृत्तियों की सूचना पाएं",
    "alerts.email_alerts": "ईमेल अलर्ट",
    "alerts.frequency": "आवृत्ति",
    "alerts.daily": "दैनिक",
    "alerts.weekly": "साप्ताहिक",
    "alerts.send_test": "टेस्ट अलर्ट भेजें",
    "alerts.last_sent": "अंतिम बार भेजा",
    "alerts.never": "कभी नहीं",
  },
};

// ── Context ──────────────────────────────────────────────────
const I18nContext = createContext(null);

export function I18nProvider({ children }) {
  const [lang, setLang] = useState(() => {
    try { return localStorage.getItem(LANG_KEY) || "en"; } catch { return "en"; }
  });

  const switchLang = useCallback((newLang) => {
    setLang(newLang);
    try { localStorage.setItem(LANG_KEY, newLang); } catch {}
  }, []);

  const t = useCallback((key) => {
    return translations[lang]?.[key] || translations.en?.[key] || key;
  }, [lang]);

  return (
    <I18nContext.Provider value={{ lang, switchLang, t }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useTranslation() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useTranslation must be used inside <I18nProvider>");
  return ctx;
}
