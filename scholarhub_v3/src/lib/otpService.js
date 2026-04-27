// src/lib/otpService.js
// ─────────────────────────────────────────────────────────────
// OTP Service — Generation is fully local (no API needed).
// Delivery is via EmailJS (free tier: 200 emails/month).
//
// Setup (one-time, 5 minutes):
//   1. Create free account at https://emailjs.com
//   2. Add an Email Service (Gmail / Outlook / Yahoo etc.)
//   3. Create an Email Template with these variables:
//        {{to_name}}   — recipient name / email
//        {{otp_code}}  — the 6-digit code
//        {{expires_in}} — expiry info ("10 minutes")
//   4. Copy your Service ID, Template ID and Public Key into .env
// ─────────────────────────────────────────────────────────────

import emailjs from "@emailjs/browser";

const SERVICE_ID  = import.meta.env.VITE_EMAILJS_SERVICE_ID;
const TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
const PUBLIC_KEY  = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

const OTP_PREFIX    = "scholarhub_otp_";
const OTP_EXPIRY_MS = 10 * 60 * 1000; // 10 minutes
const OTP_MAX_TRIES = 5;

// ── Public API ────────────────────────────────────────────────

/**
 * Generate a 6-digit OTP and deliver it to the user's email.
 * Returns { ok: true } on success or { ok: false, error: string }.
 */
export async function sendOTP(email) {
  const code = _generateCode();

  // Persist locally for verification
  _storeOTP(email, code);

  // In dev mode (no EmailJS configured), just log to console
  if (!SERVICE_ID || !TEMPLATE_ID || !PUBLIC_KEY) {
    console.warn(
      `[ScholarHub OTP] EmailJS not configured.\n` +
      `Development OTP for ${email}: ${code}\n` +
      `See .env.example to enable real email delivery.`
    );
    return { ok: true, devMode: true, _devCode: code };
  }

  try {
    await emailjs.send(
      SERVICE_ID,
      TEMPLATE_ID,
      {
        to_email   : email,
        to_name    : email.split("@")[0],
        otp_code   : code,
        expires_in : "10 minutes",
        app_name   : "ScholarHub",
      },
      PUBLIC_KEY
    );
    return { ok: true, devMode: false };
  } catch (err) {
    // Roll back stored OTP so user must retry
    clearOTP(email);
    const msg = err?.text || err?.message || "Failed to send email";
    console.error("[ScholarHub OTP] EmailJS error:", err);
    return { ok: false, error: msg };
  }
}

/**
 * Verify a submitted OTP code for the given email.
 * Returns { ok: true } or { ok: false, reason: string }.
 * On success the stored OTP is consumed (one-time use).
 */
export function verifyOTP(email, submittedCode) {
  const entry = _loadOTP(email);

  if (!entry) {
    return { ok: false, reason: "No active code found. Please request a new one." };
  }
  if (Date.now() > entry.expiresAt) {
    clearOTP(email);
    return { ok: false, reason: "Code has expired. Please request a new one." };
  }
  if (entry.tries >= OTP_MAX_TRIES) {
    clearOTP(email);
    return { ok: false, reason: "Too many incorrect attempts. Please request a new code." };
  }
  if (entry.code !== submittedCode.trim()) {
    entry.tries++;
    _saveOTP(email, entry);
    const left = OTP_MAX_TRIES - entry.tries;
    return {
      ok: false,
      reason: `Incorrect code — ${left} attempt${left !== 1 ? "s" : ""} remaining.`,
    };
  }

  // ✅ Valid — consume the code
  clearOTP(email);
  return { ok: true };
}

/** Remove the stored OTP for an email */
export function clearOTP(email) {
  localStorage.removeItem(OTP_PREFIX + _norm(email));
}

/** Seconds until the current OTP expires (0 = expired / not found) */
export function otpTTL(email) {
  const entry = _loadOTP(email);
  if (!entry) return 0;
  const ms = entry.expiresAt - Date.now();
  return ms > 0 ? Math.ceil(ms / 1000) : 0;
}

// ── Internal helpers ──────────────────────────────────────────

function _generateCode() {
  if (typeof crypto !== "undefined" && crypto.getRandomValues) {
    const buf = new Uint32Array(1);
    crypto.getRandomValues(buf);
    return String(100000 + (buf[0] % 900000));
  }
  return String(Math.floor(100000 + Math.random() * 900000));
}

function _storeOTP(email, code) {
  _saveOTP(email, { code, expiresAt: Date.now() + OTP_EXPIRY_MS, tries: 0 });
}

function _saveOTP(email, entry) {
  localStorage.setItem(OTP_PREFIX + _norm(email), JSON.stringify(entry));
}

function _loadOTP(email) {
  try {
    const raw = localStorage.getItem(OTP_PREFIX + _norm(email));
    return raw ? JSON.parse(raw) : null;
  } catch { return null; }
}

function _norm(email) {
  return email.trim().toLowerCase();
}
