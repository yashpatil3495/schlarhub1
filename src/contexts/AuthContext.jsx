// src/contexts/AuthContext.jsx
// ─────────────────────────────────────────────────────────────
// Auth context — password-based signup/login with localStorage
// sessions. Database operations (profiles, scholarships) still
// use Supabase as normal.
// ─────────────────────────────────────────────────────────────
import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { supabase, calcProfileComplete } from "../lib/supabase.js";

const AuthContext = createContext(null);

// ── Password hashing (SHA-256, client-side) ──────────────────
async function hashPassword(password) {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hash = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(hash))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

// ── User storage (localStorage) ──────────────────────────────
const USERS_KEY = "scholarhub_users";

function getUsers() {
  try {
    return JSON.parse(localStorage.getItem(USERS_KEY) || "{}");
  } catch {
    return {};
  }
}

function saveUsers(users) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

function findUserByEmail(email) {
  const users = getUsers();
  return users[email.trim().toLowerCase()] || null;
}

async function createUser(name, email, password) {
  const users = getUsers();
  const key = email.trim().toLowerCase();
  if (users[key]) throw new Error("An account with this email already exists.");
  const passwordHash = await hashPassword(password);
  users[key] = {
    name: name.trim(),
    email: key,
    passwordHash,
    createdAt: new Date().toISOString(),
  };
  saveUsers(users);
  return users[key];
}

async function resetUserPassword(email, newPassword) {
  const users = getUsers();
  const key = email.trim().toLowerCase();
  if (!users[key]) throw new Error("No account found with this email.");
  users[key].passwordHash = await hashPassword(newPassword);
  saveUsers(users);
  return users[key];
}

async function verifyPassword(email, password) {
  const user = findUserByEmail(email);
  if (!user) throw new Error("No account found with this email. Please create one first.");
  const hash = await hashPassword(password);
  if (hash !== user.passwordHash) throw new Error("Incorrect password. Please try again.");
  return user;
}

// ── Session helpers (localStorage) ───────────────────────────
const SESSION_KEY = "scholarhub_session";

function buildUser(email, name) {
  return {
    id: emailToUUID(email.trim().toLowerCase()),
    email: email.trim().toLowerCase(),
    name: name || "",
    created_at: new Date().toISOString(),
    app_metadata: {},
    user_metadata: {},
  };
}

function saveSession(user) {
  localStorage.setItem(SESSION_KEY, JSON.stringify({ user, savedAt: Date.now() }));
}

const SESSION_MAX_AGE_MS = 30 * 24 * 60 * 60 * 1000; // 30 days

function loadSession() {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    const session = JSON.parse(raw);
    // Expire sessions older than 30 days
    if (!session.savedAt || Date.now() - session.savedAt > SESSION_MAX_AGE_MS) {
      localStorage.removeItem(SESSION_KEY);
      return null;
    }
    return session;
  } catch {
    return null;
  }
}

function dropSession() {
  localStorage.removeItem(SESSION_KEY);
}

// ── Provider ──────────────────────────────────────────────────
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [profileLoad, setProfileLoad] = useState(false);

  const fetchProfile = useCallback(async (userId) => {
    setProfileLoad(true);
    try {
      const { data } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .maybeSingle();
      if (data) {
        setProfile({ ...data, profile_complete: calcProfileComplete(data) });
      } else {
        setProfile(null);
      }
    } catch {
      // Supabase not configured — continue with null profile
    } finally {
      setProfileLoad(false);
    }
  }, []);

  // Restore session: check localStorage first, then listen for Supabase OAuth callbacks
  useEffect(() => {
    // 1. Check existing local session
    const localSession = loadSession();
    if (localSession?.user) {
      setUser(localSession.user);
      fetchProfile(localSession.user.id).finally(() => setLoading(false));
    } else {
      setLoading(false);
    }

    // 2. Listen for Supabase auth events (Google OAuth redirect, token refresh, etc.)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user && !loadSession()) {
        // Google (or other OAuth) just logged in — build a local session from Supabase session
        const supaUser = session.user;
        const name = supaUser.user_metadata?.full_name || supaUser.user_metadata?.name || supaUser.email?.split("@")[0] || "";
        const sessionUser = {
          id: supaUser.id,
          email: supaUser.email,
          name,
          created_at: supaUser.created_at,
          app_metadata: supaUser.app_metadata || {},
          user_metadata: supaUser.user_metadata || {},
          provider: "google",
        };
        saveSession(sessionUser);
        setUser(sessionUser);
        setLoading(false);

        // Upsert profile in DB
        try {
          await supabase.from("profiles").upsert(
            { id: sessionUser.id, email: sessionUser.email, name, updated_at: new Date().toISOString() },
            { onConflict: "id" }
          );
          await fetchProfile(sessionUser.id);
        } catch (err) {
          console.warn("Could not upsert Google profile:", err.message);
          setProfile({ id: sessionUser.id, email: sessionUser.email, name, profile_complete: 10 });
        }
      } else if (event === "SIGNED_OUT") {
        dropSession();
        setUser(null);
        setProfile(null);
      }
    });

    return () => subscription?.unsubscribe();
  }, [fetchProfile]);

  // ── Sign up with name + email + password ───────────────────
  const signUpWithPassword = useCallback(
    async (name, email, password) => {
      // Create local user record
      await createUser(name, email, password);

      // Build session
      const sessionUser = buildUser(email, name);
      saveSession(sessionUser);
      setUser(sessionUser);

      // Create profile in Supabase
      try {
        await supabase.from("profiles").upsert(
          {
            id: sessionUser.id,
            email: sessionUser.email,
            name: name.trim(),
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
          { onConflict: "id" }
        );
        await fetchProfile(sessionUser.id);
      } catch (err) {
        console.warn("Could not create profile in Supabase:", err.message);
        // Set a local profile so the user can proceed
        setProfile({
          id: sessionUser.id,
          email: sessionUser.email,
          name: name.trim(),
          profile_complete: 10,
        });
      }
    },
    [fetchProfile]
  );

  // ── Sign in with email + password ──────────────────────────
  const signInWithPassword = useCallback(
    async (email, password) => {
      // Verify credentials
      const localUser = await verifyPassword(email, password);

      // Build session
      const sessionUser = buildUser(email, localUser.name);
      saveSession(sessionUser);
      setUser(sessionUser);

      // Fetch existing profile
      await fetchProfile(sessionUser.id);
    },
    [fetchProfile]
  );

  // Google OAuth still uses Supabase if configured
  const signInWithGoogle = useCallback(async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: window.location.origin },
    });
    if (error) throw error;
  }, []);

  const signOut = useCallback(async () => {
    dropSession();
    setUser(null);
    setProfile(null);
    await supabase.auth.signOut().catch(() => {});
  }, []);

  const updateProfile = useCallback(
    async (updates) => {
      if (!user) return;
      const payload = {
        id: user.id,
        email: user.email,
        updated_at: new Date().toISOString(),
        ...updates,
      };
      try {
        const { data, error } = await supabase
          .from("profiles")
          .upsert(payload, { onConflict: "id" })
          .select()
          .single();
        if (error) throw error;
        setProfile({ ...data, profile_complete: calcProfileComplete(data) });
        return data;
      } catch (err) {
        // Supabase unavailable — save profile locally so user can proceed
        console.warn("Could not save profile to Supabase, using local fallback:", err.message);
        const localProfile = { ...(profile || {}), ...payload };
        localProfile.profile_complete = calcProfileComplete(localProfile);
        setProfile(localProfile);
        // Persist to localStorage as backup
        try { localStorage.setItem("scholarhub_local_profile", JSON.stringify(localProfile)); } catch {}
        return localProfile;
      }
    },
    [user, profile]
  );

  const refreshProfile = useCallback(() => {
    if (user) fetchProfile(user.id);
  }, [user, fetchProfile]);

  // Reset password (after OTP verified on forgot-password flow)
  const resetPassword = useCallback(
    async (email, newPassword) => {
      const localUser = await resetUserPassword(email, newPassword);
      const sessionUser = buildUser(email, localUser.name);
      saveSession(sessionUser);
      setUser(sessionUser);
      await fetchProfile(sessionUser.id);
    },
    [fetchProfile]
  );

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        loading,
        profileLoad,
        signUpWithPassword,
        signInWithPassword,
        signInWithGoogle,
        resetPassword,
        signOut,
        updateProfile,
        refreshProfile,
        isLoggedIn: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
};

// ── Deterministic UUID from email ─────────────────────────────
function emailToUUID(email) {
  const h = djb2(email);
  const h2 = djb2(email + "_2");
  const h3 = djb2(email + "_3");
  const hex = (n) => Math.abs(n).toString(16).padStart(8, "0");
  const a = hex(h);
  const b = hex(h2).slice(0, 4);
  const c = "4" + hex(h3).slice(0, 3);
  const d = (8 + (Math.abs(h2) & 3)).toString(16) + hex(h3).slice(0, 3);
  const e = hex(h).slice(0, 4) + hex(h2).slice(0, 8);
  return `${a}-${b}-${c}-${d}-${e}`;
}

function djb2(str) {
  let h = 5381;
  for (let i = 0; i < str.length; i++) {
    h = ((h << 5) + h) ^ str.charCodeAt(i);
    h = h | 0;
  }
  return h;
}
