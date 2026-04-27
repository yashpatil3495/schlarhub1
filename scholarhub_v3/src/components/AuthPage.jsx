// src/components/AuthPage.jsx
// ── Premium split-panel Auth — redesigned layout
import { useState, useEffect, useRef } from "react";
import { useAuth } from "../contexts/AuthContext.jsx";
import { sendOTP, verifyOTP, clearOTP, otpTTL } from "../lib/otpService.js";

// ── OTP Input — 6 individual digit boxes
function OTPInput({ value, onChange, disabled }) {
  const inputs = useRef([]);
  const digits = value.padEnd(6, "").split("").slice(0, 6);

  const handleKey = (i, e) => {
    if (e.key === "Backspace") {
      e.preventDefault();
      const next = value.slice(0, i > 0 && digits[i] === " " ? i - 1 : i);
      onChange(next.replace(/ /g, ""));
      if (i > 0 && !digits[i].trim()) inputs.current[i - 1]?.focus();
    } else if (e.key === "ArrowLeft" && i > 0) {
      inputs.current[i - 1]?.focus();
    } else if (e.key === "ArrowRight" && i < 5) {
      inputs.current[i + 1]?.focus();
    }
  };

  const handleChange = (i, e) => {
    const char = e.target.value.replace(/\D/g, "").slice(-1);
    if (!char) return;
    const arr = digits.map((d) => (d === " " ? "" : d));
    arr[i] = char;
    const newVal = arr.join("").slice(0, 6);
    onChange(newVal);
    if (i < 5) inputs.current[i + 1]?.focus();
  };

  const handlePaste = (e) => {
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (pasted) { onChange(pasted); inputs.current[Math.min(pasted.length, 5)]?.focus(); }
    e.preventDefault();
  };

  return (
    <div className="ap-otp-row">
      {Array.from({ length: 6 }).map((_, i) => (
        <input
          key={i}
          ref={(el) => (inputs.current[i] = el)}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={digits[i]?.trim() || ""}
          onChange={(e) => handleChange(i, e)}
          onKeyDown={(e) => handleKey(i, e)}
          onPaste={handlePaste}
          disabled={disabled}
          autoFocus={i === 0}
          className="ap-otp-digit"
        />
      ))}
    </div>
  );
}

// ── Countdown timer
function Countdown({ email, onExpire }) {
  const [secs, setSecs] = useState(() => otpTTL(email));
  useEffect(() => {
    if (secs <= 0) { onExpire?.(); return; }
    const t = setTimeout(() => setSecs((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [secs, onExpire]);
  const m = String(Math.floor(secs / 60)).padStart(2, "0");
  const s = String(secs % 60).padStart(2, "0");
  return (
    <span className={`ap-countdown ${secs < 60 ? "urgent" : ""}`}>
      {secs > 0 ? `${m}:${s}` : "Expired"}
    </span>
  );
}

// ── Feature items for the left panel
const LEFT_FEATURES = [
  { icon: "🤖", title: "AI-Powered Matching", desc: "Get matched with 500+ scholarships instantly" },
  { icon: "✍️", title: "SOP Generator", desc: "AI writes your Statement of Purpose in minutes" },
  { icon: "🎤", title: "Interview Simulator", desc: "Practice with AI and get real-time feedback" },
  { icon: "🗺️", title: "Scholarship Map", desc: "Explore state-wise scholarship opportunities" },
];

// ── Main AuthPage
export default function AuthPage({ onBack }) {
  const { signUpWithPassword, signInWithPassword, signInWithGoogle, resetPassword } = useAuth();

  const [mode, setMode] = useState("login");
  const [signupStep, setSignupStep] = useState("email");
  const [forgotStep, setForgotStep] = useState("email");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPw, setConfirmPw] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [code, setCode] = useState("");
  const [cooldown, setCooldown] = useState(0);
  const [devMode, setDevMode] = useState(false);
  const [devCode, setDevCode] = useState("");

  useEffect(() => {
    if (cooldown <= 0) return;
    const t = setTimeout(() => setCooldown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [cooldown]);

  const resetFields = () => {
    setEmail(""); setPassword(""); setConfirmPw(""); setName("");
    setError(""); setCode(""); setSignupStep("email"); setForgotStep("email");
    setDevMode(false); setDevCode(""); setCooldown(0);
  };

  const switchMode = (newMode) => { setMode(newMode); resetFields(); };

  const handleSendOTP = async (e) => {
    e?.preventDefault();
    if (!email.trim() || !email.includes("@")) { setError("Please enter a valid email address."); return; }
    setError(""); setLoading(true);
    clearOTP(email);
    const result = await sendOTP(email.trim());
    if (!result.ok) { setError(result.error || "Failed to send code."); }
    else { setSignupStep("otp"); setCooldown(60); if (result.devMode) { setDevMode(true); setDevCode(result._devCode); } }
    setLoading(false);
  };

  const handleVerifyOTP = async (e) => {
    e?.preventDefault();
    if (code.length !== 6) { setError("Please enter all 6 digits."); return; }
    setError(""); setLoading(true);
    const result = verifyOTP(email.trim(), code);
    if (!result.ok) { setError(result.reason); setLoading(false); return; }
    setSignupStep("details");
    setLoading(false);
  };

  useEffect(() => {
    if (code.length === 6 && signupStep === "otp" && !loading) { handleVerifyOTP(); }
  }, [code]);

  const handleCreateAccount = async (e) => {
    e.preventDefault(); setError("");
    if (!name.trim() || name.trim().length < 2) { setError("Please enter your full name."); return; }
    if (password.length < 6) { setError("Password must be at least 6 characters."); return; }
    if (password !== confirmPw) { setError("Passwords do not match."); return; }
    setLoading(true);
    try { await signUpWithPassword(name.trim(), email.trim(), password); }
    catch (err) { setError(err.message || "Sign-up failed."); }
    setLoading(false);
  };

  const handleSignIn = async (e) => {
    e.preventDefault(); setError("");
    if (!email.trim() || !email.includes("@")) { setError("Please enter a valid email."); return; }
    if (!password) { setError("Please enter your password."); return; }
    setLoading(true);
    try { await signInWithPassword(email.trim(), password); }
    catch (err) { setError(err.message || "Sign-in failed."); }
    setLoading(false);
  };

  const handleForgotSendOTP = async (e) => {
    e?.preventDefault();
    if (!email.trim() || !email.includes("@")) { setError("Please enter a valid email."); return; }
    setError(""); setLoading(true);
    clearOTP(email);
    const result = await sendOTP(email.trim());
    if (!result.ok) { setError(result.error || "Failed to send code."); }
    else { setForgotStep("otp"); setCooldown(60); if (result.devMode) { setDevMode(true); setDevCode(result._devCode); } }
    setLoading(false);
  };

  const handleForgotVerifyOTP = async (e) => {
    e?.preventDefault();
    if (code.length !== 6) { setError("Enter all 6 digits."); return; }
    setError(""); setLoading(true);
    const result = verifyOTP(email.trim(), code);
    if (!result.ok) { setError(result.reason); setLoading(false); return; }
    setForgotStep("newpw");
    setLoading(false);
  };

  const handleResetPassword = async (e) => {
    e.preventDefault(); setError("");
    if (password.length < 6) { setError("Password must be at least 6 characters."); return; }
    if (password !== confirmPw) { setError("Passwords do not match."); return; }
    setLoading(true);
    try { await resetPassword(email.trim(), password); }
    catch (err) { setError(err.message || "Reset failed."); }
    setLoading(false);
  };

  const handleGoogle = async () => {
    setError(""); setLoading(true);
    try { await signInWithGoogle(); }
    catch (err) { setError(err.message || "Google sign-in failed."); setLoading(false); }
  };

  const handleResend = () => { setCode(""); setError(""); setDevCode(""); setDevMode(false); handleSendOTP(); };

  return (
    <div className="ap-page">
      {/* ── LEFT PANEL — Branding ── */}
      <div className="ap-left">
        <div className="ap-left-mesh" />
        <div className="ap-left-content">
          <div className="ap-left-logo">
            <div className="ap-left-logo-icon">🎓</div>
            <div>
              <h1 className="ap-left-logo-text">ScholarHub</h1>
              <p className="ap-left-logo-sub">India's smartest scholarship platform</p>
            </div>
          </div>

          <div className="ap-left-hero">
            <h2 className="ap-left-title">Your journey to a<br /><span className="ap-left-accent">funded education</span><br />starts here.</h2>
            <p className="ap-left-desc">Join 10,000+ students who've found and won scholarships using AI-powered tools.</p>
          </div>

          <div className="ap-left-features">
            {LEFT_FEATURES.map(f => (
              <div key={f.title} className="ap-left-feature">
                <div className="ap-left-feature-icon">{f.icon}</div>
                <div>
                  <div className="ap-left-feature-title">{f.title}</div>
                  <div className="ap-left-feature-desc">{f.desc}</div>
                </div>
              </div>
            ))}
          </div>

          <div className="ap-left-trust">Trusted by students from IITs, NITs, and 200+ colleges across India</div>
        </div>
      </div>

      {/* ── RIGHT PANEL — Form ── */}
      <div className="ap-right">
        <div className="ap-form-container">

          {/* Back button */}
          {onBack && (
            <button className="ap-back" onClick={onBack} type="button">← Back to home</button>
          )}

          {/* Tab Switcher */}
          {mode !== "forgot" && (
            <div className="ap-tabs">
              <button className={`ap-tab ${mode === "login" ? "active" : ""}`} onClick={() => switchMode("login")} type="button">Sign In</button>
              <button className={`ap-tab ${mode === "signup" ? "active" : ""}`} onClick={() => switchMode("signup")} type="button">Create Account</button>
            </div>
          )}

          {/* ════════ LOGIN ════════ */}
          {mode === "login" && (
            <>
              <h2 className="ap-heading">Welcome back! 👋</h2>
              <p className="ap-sub">Sign in to continue to your dashboard</p>

              <button className="ap-google" onClick={handleGoogle} disabled={loading} type="button">
                <GoogleIcon /> Continue with Google
              </button>

              <div className="ap-divider"><span>or sign in with email</span></div>

              {error && <div className="ap-error">⚠️ {error}</div>}

              <form onSubmit={handleSignIn} className="ap-form">
                <div className="ap-field">
                  <label className="ap-label">Email</label>
                  <div className="ap-input-wrap">
                    <span className="ap-input-icon">✉️</span>
                    <input type="email" className="ap-input" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" disabled={loading} autoComplete="email" autoFocus />
                  </div>
                </div>
                <div className="ap-field">
                  <label className="ap-label">Password</label>
                  <div className="ap-input-wrap">
                    <span className="ap-input-icon">🔒</span>
                    <input type={showPw ? "text" : "password"} className="ap-input" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter your password" disabled={loading} autoComplete="current-password" />
                    <button type="button" className="ap-eye" onClick={() => setShowPw(!showPw)} tabIndex={-1}>{showPw ? "🙈" : "👁️"}</button>
                  </div>
                </div>
                <button type="submit" className="ap-submit" disabled={loading || !email.trim() || !password}>
                  {loading ? <span className="ap-spinner" /> : "Sign In →"}
                </button>
              </form>

              <div className="ap-links">
                <button className="ap-link" onClick={() => switchMode("forgot")} type="button">Forgot password?</button>
                <button className="ap-link" onClick={() => switchMode("signup")} type="button">Create an account →</button>
              </div>
            </>
          )}

          {/* ════════ SIGNUP Step 1: Email ════════ */}
          {mode === "signup" && signupStep === "email" && (
            <>
              <h2 className="ap-heading">Create your account ✨</h2>
              <p className="ap-sub">Start finding scholarships in under 2 minutes</p>

              <button className="ap-google" onClick={handleGoogle} disabled={loading} type="button">
                <GoogleIcon /> Sign up with Google
              </button>

              <div className="ap-divider"><span>or verify with email</span></div>

              {error && <div className="ap-error">⚠️ {error}</div>}

              <form onSubmit={handleSendOTP} className="ap-form">
                <div className="ap-field">
                  <label className="ap-label">Email Address</label>
                  <div className="ap-input-wrap">
                    <span className="ap-input-icon">✉️</span>
                    <input type="email" className="ap-input" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" disabled={loading} autoComplete="email" autoFocus />
                  </div>
                </div>
                <button type="submit" className="ap-submit" disabled={loading || !email.trim() || cooldown > 0}>
                  {loading ? <span className="ap-spinner" /> : cooldown > 0 ? `Wait ${cooldown}s` : "Send Verification Code →"}
                </button>
              </form>

              <p className="ap-hint">A 6-digit code will be sent to verify your email.</p>
              <div className="ap-links">
                <button className="ap-link" onClick={() => switchMode("login")} type="button">Already have an account? Sign in →</button>
              </div>
            </>
          )}

          {/* ════════ SIGNUP Step 2: OTP ════════ */}
          {mode === "signup" && signupStep === "otp" && (
            <>
              <div className="ap-otp-header">
                <span className="ap-otp-emoji">📬</span>
                <h2 className="ap-heading">Check your inbox</h2>
                <p className="ap-sub">We sent a 6-digit code to <strong>{email}</strong></p>
              </div>

              {devMode && devCode && (
                <div className="ap-dev-banner">
                  <p className="ap-dev-label">⚙️ DEV MODE — EmailJS not configured</p>
                  <span className="ap-dev-code">{devCode}</span>
                  <p className="ap-dev-hint">Copy code above · Add EmailJS keys to .env for real email</p>
                </div>
              )}

              {error && <div className="ap-error">⚠️ {error}</div>}

              <OTPInput value={code} onChange={setCode} disabled={loading} />

              <button className="ap-submit" onClick={handleVerifyOTP} disabled={loading || code.length !== 6}>
                {loading ? <span className="ap-spinner" /> : "Verify Code →"}
              </button>

              <div className="ap-otp-footer">
                <button onClick={() => { setSignupStep("email"); setCode(""); setError(""); }} className="ap-link">← Change email</button>
                <div className="ap-otp-timer">
                  <span className="ap-hint-inline">Expires in</span>
                  <Countdown email={email} onExpire={() => setError("Code expired. Request a new one.")} />
                  {cooldown <= 0 && <button onClick={handleResend} disabled={loading} className="ap-link accent">Resend</button>}
                </div>
              </div>
            </>
          )}

          {/* ════════ SIGNUP Step 3: Details ════════ */}
          {mode === "signup" && signupStep === "details" && (
            <>
              <div className="ap-otp-header">
                <span className="ap-otp-emoji">✅</span>
                <h2 className="ap-heading">Email verified!</h2>
                <p className="ap-sub">Set up your name and password for <strong>{email}</strong></p>
              </div>

              {error && <div className="ap-error">⚠️ {error}</div>}

              <form onSubmit={handleCreateAccount} className="ap-form">
                <div className="ap-field">
                  <label className="ap-label">Full Name</label>
                  <div className="ap-input-wrap">
                    <span className="ap-input-icon">👤</span>
                    <input type="text" className="ap-input" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Priya Sharma" disabled={loading} autoComplete="name" autoFocus />
                  </div>
                </div>
                <div className="ap-field">
                  <label className="ap-label">Password</label>
                  <div className="ap-input-wrap">
                    <span className="ap-input-icon">🔒</span>
                    <input type={showPw ? "text" : "password"} className="ap-input" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Min. 6 characters" disabled={loading} autoComplete="new-password" />
                    <button type="button" className="ap-eye" onClick={() => setShowPw(!showPw)} tabIndex={-1}>{showPw ? "🙈" : "👁️"}</button>
                  </div>
                </div>
                <div className="ap-field">
                  <label className="ap-label">Confirm Password</label>
                  <div className="ap-input-wrap">
                    <span className="ap-input-icon">🔒</span>
                    <input type={showPw ? "text" : "password"} className="ap-input" value={confirmPw} onChange={(e) => setConfirmPw(e.target.value)} placeholder="Re-enter your password" disabled={loading} autoComplete="new-password" />
                  </div>
                </div>
                <button type="submit" className="ap-submit" disabled={loading || !name.trim() || !password || !confirmPw}>
                  {loading ? <span className="ap-spinner" /> : "🚀 Create My Account"}
                </button>
              </form>
            </>
          )}

          {/* ════════ FORGOT PASSWORD ════════ */}
          {mode === "forgot" && forgotStep === "email" && (
            <>
              <span className="ap-otp-emoji">🔐</span>
              <h2 className="ap-heading">Reset Password</h2>
              <p className="ap-sub">Enter your email to receive a verification code</p>
              {error && <div className="ap-error">⚠️ {error}</div>}
              <form onSubmit={handleForgotSendOTP} className="ap-form">
                <div className="ap-field">
                  <label className="ap-label">Email Address</label>
                  <div className="ap-input-wrap">
                    <span className="ap-input-icon">✉️</span>
                    <input type="email" className="ap-input" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" disabled={loading} autoFocus />
                  </div>
                </div>
                <button type="submit" className="ap-submit" disabled={loading || !email.trim()}>
                  {loading ? <span className="ap-spinner" /> : "Send Reset Code →"}
                </button>
              </form>
              <div className="ap-links">
                <button className="ap-link" onClick={() => switchMode("login")} type="button">Remember your password? Sign in →</button>
              </div>
            </>
          )}

          {mode === "forgot" && forgotStep === "otp" && (
            <>
              <div className="ap-otp-header">
                <span className="ap-otp-emoji">📬</span>
                <h2 className="ap-heading">Enter Reset Code</h2>
                <p className="ap-sub">We sent a 6-digit code to <strong>{email}</strong></p>
              </div>
              {devMode && devCode && (
                <div className="ap-dev-banner">
                  <p className="ap-dev-label">⚙️ DEV MODE</p>
                  <span className="ap-dev-code">{devCode}</span>
                </div>
              )}
              {error && <div className="ap-error">⚠️ {error}</div>}
              <OTPInput value={code} onChange={setCode} disabled={loading} />
              <button className="ap-submit" onClick={handleForgotVerifyOTP} disabled={loading || code.length !== 6}>
                {loading ? <span className="ap-spinner" /> : "Verify Code →"}
              </button>
              <div className="ap-otp-footer">
                <button onClick={() => { setForgotStep("email"); setCode(""); setError(""); }} className="ap-link">← Change email</button>
                <Countdown email={email} onExpire={() => setError("Code expired.")} />
              </div>
            </>
          )}

          {mode === "forgot" && forgotStep === "newpw" && (
            <>
              <div className="ap-otp-header">
                <span className="ap-otp-emoji">✅</span>
                <h2 className="ap-heading">Set New Password</h2>
                <p className="ap-sub">Create a new password for <strong>{email}</strong></p>
              </div>
              {error && <div className="ap-error">⚠️ {error}</div>}
              <form onSubmit={handleResetPassword} className="ap-form">
                <div className="ap-field">
                  <label className="ap-label">New Password</label>
                  <div className="ap-input-wrap">
                    <span className="ap-input-icon">🔒</span>
                    <input type={showPw ? "text" : "password"} className="ap-input" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Min. 6 characters" disabled={loading} autoFocus />
                    <button type="button" className="ap-eye" onClick={() => setShowPw(!showPw)} tabIndex={-1}>{showPw ? "🙈" : "👁️"}</button>
                  </div>
                </div>
                <div className="ap-field">
                  <label className="ap-label">Confirm Password</label>
                  <div className="ap-input-wrap">
                    <span className="ap-input-icon">🔒</span>
                    <input type={showPw ? "text" : "password"} className="ap-input" value={confirmPw} onChange={(e) => setConfirmPw(e.target.value)} placeholder="Re-enter password" disabled={loading} />
                  </div>
                </div>
                <button type="submit" className="ap-submit" disabled={loading || !password || !confirmPw}>
                  {loading ? <span className="ap-spinner" /> : "🔐 Reset & Sign In"}
                </button>
              </form>
            </>
          )}

        </div>
      </div>
    </div>
  );
}

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
    </svg>
  );
}
