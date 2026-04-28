// src/components/LandingPage.jsx
import { useState, useEffect, useRef } from "react";
import "../styles/landing.css";

const FEATURES = [
  { icon: "🤖", title: "ScholarBot AI",       desc: "Chat with an AI that knows every scholarship in India. Get instant, personalised eligibility answers.",    badge: "AI Powered" },
  { icon: "✍️", title: "SOP Generator",       desc: "Generate a tailored Statement of Purpose for any scholarship — refined, personal, and ready to submit.",   badge: "Save Hours" },
  { icon: "🎤", title: "Interview Simulator",  desc: "Practice scholarship interviews with real-time AI feedback. Walk in prepared, walk out selected.",         badge: "Get Ready" },
  { icon: "💰", title: "Aid Calculator",       desc: "Calculate your total eligible scholarship value across all central and state schemes instantly.",          badge: "Know More" },
  { icon: "🗺️", title: "Scholarship Map",      desc: "Explore scholarships across India on an interactive map — filtered by your state, field, and eligibility.", badge: "Explore" },
  { icon: "📋", title: "Application Tracker",  desc: "Kanban-style tracker for every application, deadline, and document. Never miss a submission date.",        badge: "Stay Sharp" },
];

const STATS = [
  { value: "500+",    label: "Scholarships Listed", icon: "🎓", num: 500 },
  { value: "₹50Cr+",  label: "Total Funding",       icon: "💰", num: 50 },
  { value: "10,000+", label: "Students Helped",      icon: "👥", num: 10000 },
  { value: "95%",     label: "Success Rate",         icon: "✅", num: 95 },
];

const TESTIMONIALS = [
  { name: "Priya Sharma",  state: "Maharashtra",   text: "Got the NSP scholarship worth ₹48,000 using ScholarHub. The AI SOP writer saved me hours of writing and stress!", avatar: "P" },
  { name: "Rahul Verma",   state: "Uttar Pradesh",  text: "Found 12 scholarships I had no idea existed. The tracker kept me on top of every single deadline. Truly life-changing.", avatar: "R" },
  { name: "Ananya Nair",   state: "Kerala",          text: "The Interview Simulator prepared me perfectly. Got the AICTE Pragati scholarship on my first try!", avatar: "A" },
];

const STEPS = [
  { step: "01", icon: "👤", title: "Create your profile",  desc: "Tell us your state, category, course, and income. Takes just 2 minutes." },
  { step: "02", icon: "🔍", title: "Discover matches",     desc: "Our AI scans 500+ scholarships and ranks them by your eligibility score." },
  { step: "03", icon: "🏆", title: "Apply & win",          desc: "Use SOP Generator, Interview Sim and Tracker to apply confidently." },
];

const TYPEWRITER_WORDS = ["Scholarship", "Fellowship", "Grant", "Stipend"];

const scrollTo = (id) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });

/* ── IntersectionObserver hook ── */
function useScrollReveal(threshold = 0.12) {
  const ref = useRef(null);
  const [isVisible, setIsVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setIsVisible(true); obs.unobserve(e.target); } }, { threshold });
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, isVisible];
}

/* ── Count-up stat card ── */
function StatCard({ stat, index, isVisible }) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!isVisible) return;
    const dur = 2000;
    let start;
    const step = (ts) => {
      if (!start) start = ts;
      const p = Math.min((ts - start) / dur, 1);
      const eased = 1 - Math.pow(1 - p, 4);
      setCount(Math.floor(eased * stat.num));
      if (p < 1) requestAnimationFrame(step);
    };
    const delay = setTimeout(() => requestAnimationFrame(step), index * 150);
    return () => clearTimeout(delay);
  }, [isVisible, stat.num, index]);

  const fmt = () => {
    if (stat.value.includes("₹")) return `₹${count}Cr+`;
    if (stat.value.includes("%")) return `${count}%`;
    if (stat.value.includes(",")) return `${count.toLocaleString()}+`;
    return `${count}+`;
  };

  return (
    <div className="l-stat-card" style={{ animationDelay: `${index * 150}ms` }}>
      <div className="l-stat-icon">{stat.icon}</div>
      <div className="l-stat-value">{isVisible ? fmt() : "0"}</div>
      <div className="l-stat-label">{stat.label}</div>
    </div>
  );
}

export default function LandingPage({ onGetStarted }) {
  const [scrolled, setScrolled]                   = useState(false);
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const [visible, setVisible]                     = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen]       = useState(false);

  // Typewriter
  const [twIndex, setTwIndex] = useState(0);
  const [twText, setTwText]   = useState("");
  const [twDel, setTwDel]     = useState(false);

  // Section observers (for child animations only)
  const [statsRef, statsVis]   = useScrollReveal();
  const [stepsRef, stepsVis]   = useScrollReveal();

  useEffect(() => {
    requestAnimationFrame(() => setVisible(true));
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    const t = setInterval(() => setActiveTestimonial(p => (p + 1) % TESTIMONIALS.length), 5000);
    return () => { window.removeEventListener("scroll", onScroll); clearInterval(t); };
  }, []);

  // Typewriter
  useEffect(() => {
    const word = TYPEWRITER_WORDS[twIndex];
    let timeout;
    if (!twDel && twText === word) {
      timeout = setTimeout(() => setTwDel(true), 2000);
    } else if (twDel && twText === "") {
      setTwDel(false);
      setTwIndex(p => (p + 1) % TYPEWRITER_WORDS.length);
    } else {
      timeout = setTimeout(() => {
        setTwText(prev => twDel ? prev.slice(0, -1) : word.slice(0, prev.length + 1));
      }, twDel ? 50 : 100);
    }
    return () => clearTimeout(timeout);
  }, [twText, twDel, twIndex]);

  // Lock body scroll when mobile menu open
  useEffect(() => {
    document.body.style.overflow = mobileMenuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileMenuOpen]);

  const closeMobile = () => setMobileMenuOpen(false);

  return (
    <div className="landing">

      {/* ── NAV ── */}
      <nav className={`l-nav${scrolled ? " scrolled" : ""}`} aria-label="Main navigation">
        <a className="l-nav-logo" href="#" onClick={e => e.preventDefault()}>
          <div className="l-nav-logo-icon">🎓</div>
          <span className="l-nav-logo-text">Scholar</span><span className="l-nav-logo-accent">Hub</span>
        </a>
        <div className="l-nav-links l-nav-desktop">
          <button className="l-nav-link" onClick={() => scrollTo("features")}>Features</button>
          <button className="l-nav-link" onClick={() => scrollTo("how-it-works")}>How It Works</button>
          <button className="l-nav-link" onClick={() => scrollTo("testimonials")}>Testimonials</button>
          <button className="l-nav-link" onClick={onGetStarted}>Sign In</button>
          <button className="l-nav-cta" onClick={onGetStarted}>
            <span className="l-nav-cta-text">Get Started Free</span>
            <span className="l-nav-cta-shimmer" />
          </button>
        </div>
        <button className={`l-nav-hamburger${mobileMenuOpen ? " open" : ""}`} onClick={() => setMobileMenuOpen(!mobileMenuOpen)} aria-label="Toggle menu" aria-expanded={mobileMenuOpen}>
          <span /><span /><span />
        </button>
      </nav>

      {/* Mobile overlay + drawer */}
      <div className={`l-mobile-overlay${mobileMenuOpen ? " open" : ""}`} onClick={closeMobile} />
      <div className={`l-mobile-drawer${mobileMenuOpen ? " open" : ""}`}>
        <div className="l-mobile-drawer-header">
          <div className="l-nav-logo"><div className="l-nav-logo-icon">🎓</div><span className="l-nav-logo-text">Scholar</span><span className="l-nav-logo-accent">Hub</span></div>
        </div>
        <div className="l-mobile-drawer-links">
          <button className="l-mobile-drawer-link" onClick={() => { scrollTo("features"); closeMobile(); }}><span className="l-mobile-link-icon">✨</span> Features</button>
          <button className="l-mobile-drawer-link" onClick={() => { scrollTo("how-it-works"); closeMobile(); }}><span className="l-mobile-link-icon">🛤️</span> How It Works</button>
          <button className="l-mobile-drawer-link" onClick={() => { scrollTo("testimonials"); closeMobile(); }}><span className="l-mobile-link-icon">⭐</span> Testimonials</button>
          <button className="l-mobile-drawer-link" onClick={() => { onGetStarted(); closeMobile(); }}><span className="l-mobile-link-icon">🔑</span> Sign In</button>
        </div>
        <button className="l-mobile-drawer-cta" onClick={() => { onGetStarted(); closeMobile(); }}>Get Started Free →</button>
      </div>

      {/* ── HERO ── */}
      <section className="l-hero">
        <div className="l-hero-mesh" />
        <div className="l-hero-shape l-hero-shape-1" />
        <div className="l-hero-shape l-hero-shape-2" />

        <div className="l-hero-content" style={{ opacity: visible ? 1 : 0, transform: visible ? "none" : "translateY(28px)", transition: "opacity .7s ease, transform .7s ease" }}>
          <div className="l-hero-badge">
            <span className="l-hero-badge-dot" />
            India's #1 AI Scholarship Platform
          </div>

          <h1 className="l-hero-title">
            Every Indian Student<br />
            Deserves a <span className="l-hero-title-accent l-hero-typewriter">{twText}<span className="l-hero-cursor">|</span></span>
          </h1>

          <p className="l-hero-sub">
            Find, apply, and win scholarships using AI. From SOP writing to interview prep — ScholarHub handles everything so you can focus on studying.
          </p>

          <div className="l-hero-actions">
            <button className="l-hero-btn-primary" onClick={onGetStarted}>
              🚀 Start Finding Scholarships
            </button>
            <button className="l-hero-btn-secondary" onClick={onGetStarted}>
              Sign in with Email →
            </button>
          </div>

          <p className="l-hero-trust">
            Free forever · No credit card · Trusted by <span>55+</span> students
          </p>

          <div className="l-trust-badges">
            {[{ label: "NSP Verified", icon: "🏛️" }, { label: "AICTE Listed", icon: "📋" }, { label: "UGC Approved", icon: "✅" }, { label: "Secure", icon: "🔒" }].map(b => (
              <div key={b.label} className="l-trust-badge">
                <span className="l-trust-badge-icon">{b.icon}</span>
                <span className="l-trust-badge-label">{b.label}</span>
              </div>
            ))}
          </div>
        </div>

        <button className="l-scroll-indicator" onClick={() => scrollTo("stats-section")} aria-label="Scroll down to explore" title="Explore More">
          <div className="l-scroll-mouse"><div className="l-scroll-wheel" /></div>
          <span className="l-scroll-text">Scroll to explore</span>
        </button>
      </section>

      {/* ── STATS ── */}
      <section className={`l-stats${statsVis ? " l-section-visible" : ""}`} ref={statsRef} id="stats-section">
        <div className="l-stats-grid">
          {STATS.map((s, i) => <StatCard key={s.label} stat={s} index={i} isVisible={statsVis} />)}
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section className="l-features" id="features">
        <div className="l-section-header">
          <div className="l-section-badge blue">✨ Features</div>
          <h2 className="l-section-title">Everything you need to win</h2>
          <p className="l-section-sub">AI-powered tools built specifically for Indian students applying to scholarships.</p>
        </div>
        <div className="l-bento">
          {FEATURES.map((f, i) => (
            <div key={f.title} className={`l-bento-card${i < 2 ? " l-bento-large" : ""}`}>
              <div className="l-bento-icon-wrap"><div className="l-bento-icon">{f.icon}</div></div>
              <span className="l-bento-badge">{f.badge}</span>
              <h3 className="l-bento-title">{f.title}</h3>
              <p className="l-bento-desc">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="l-steps" id="how-it-works">
        <div className="l-section-header">
          <div className="l-section-badge orange">🛤️ How It Works</div>
          <h2 className="l-section-title">From signup to scholarship in 3 steps</h2>
          <p className="l-section-sub">Simple, fast, and completely free.</p>
        </div>
        <div className="l-timeline" ref={stepsRef}>
          <div className="l-timeline-line"><div className={`l-timeline-progress${stepsVis ? " animate" : ""}`} /></div>
          {STEPS.map((s, i) => (
            <div key={s.step} className={`l-timeline-item${stepsVis ? " l-section-visible" : ""}`} style={{ transitionDelay: `${i * 200}ms` }}>
              <div className="l-timeline-circle"><span className="l-timeline-num">{s.step}</span></div>
              <div className="l-timeline-card">
                <div className="l-step-icon" style={{ margin: "0 0 12px", background: i === 0 ? "var(--blue)" : i === 1 ? "var(--orange)" : "var(--blue-d)", boxShadow: i === 1 ? "0 6px 20px rgba(249,115,22,.25)" : "0 6px 20px rgba(26,86,219,.25)" }}>{s.icon}</div>
                <h3 className="l-step-title">{s.title}</h3>
                <p className="l-step-desc">{s.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section className="l-testimonials" id="testimonials">
        <div className="l-section-header">
          <div className="l-section-badge orange">⭐ Success Stories</div>
          <h2 className="l-section-title">Students who won with ScholarHub</h2>
          <p className="l-section-sub">Real students, real scholarships, real results.</p>
        </div>
        <div className="l-testimonials-carousel">
          {TESTIMONIALS.map((t, i) => {
            let pos = "l-testimonial-next";
            if (i === activeTestimonial) pos = "l-testimonial-active";
            else if (i === (activeTestimonial - 1 + TESTIMONIALS.length) % TESTIMONIALS.length) pos = "l-testimonial-prev";
            return (
              <div key={t.name} className={`l-testimonial-card ${pos}`}>
                <div className="l-testimonial-quote">"</div>
                <p className="l-testimonial-text">{t.text}</p>
                <div className="l-testimonial-author">
                  <div className="l-testimonial-avatar">{t.avatar}</div>
                  <div>
                    <div className="l-testimonial-name">{t.name}</div>
                    <div className="l-testimonial-state">{t.state}</div>
                  </div>
                  <div className="l-testimonial-stars">★★★★★</div>
                </div>
              </div>
            );
          })}
        </div>
        <div className="l-dots">
          {TESTIMONIALS.map((_, i) => (
            <button key={i} className={`l-dot${activeTestimonial === i ? " active" : ""}`} onClick={() => setActiveTestimonial(i)} aria-label={`Testimonial ${i + 1}`} />
          ))}
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="l-cta">
        <div className="l-cta-mesh" />
        <div className="l-cta-content">
          <div className="l-cta-icon">🎓</div>
          <h2 className="l-cta-title">Your scholarship is waiting.</h2>
          <p className="l-cta-sub">Join thousands of Indian students already using ScholarHub to fund their education. It's free, forever.</p>
          <button className="l-cta-btn" onClick={onGetStarted}>
            Get Started for Free →
          </button>
          <p className="l-cta-trust">No credit card · Free forever · <span>10,000+</span> students trust us</p>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="l-footer-min">
        <div className="l-footer-container">
          <div className="l-footer-split">
            <div className="l-footer-brand-side">
              <div className="l-footer-logo">
                <div className="l-footer-logo-icon">🎓</div>
                <span className="l-footer-logo-text">ScholarHub</span>
              </div>
              <p className="l-footer-tag">India's #1 AI scholarship platform helping students find and win funding with ease.</p>
              <div className="l-footer-social">
                <a href="#" className="l-footer-social-link" onClick={e => e.preventDefault()}>𝕏</a>
                <a href="#" className="l-footer-social-link" onClick={e => e.preventDefault()}>in</a>
                <a href="#" className="l-footer-social-link" onClick={e => e.preventDefault()}>📷</a>
              </div>
            </div>
            
            <div className="l-footer-nav-side">
              <div className="l-footer-nav-group">
                <h4 className="l-footer-nav-title">Platform</h4>
                <div className="l-footer-nav-links">
                  <button onClick={() => scrollTo("features")}>Features</button>
                  <button onClick={() => scrollTo("how-it-works")}>How It Works</button>
                  <button onClick={() => scrollTo("testimonials")}>Stories</button>
                </div>
              </div>
              <div className="l-footer-nav-group">
                <h4 className="l-footer-nav-title">Join Us</h4>
                <div className="l-footer-newsletter-min">
                  <input type="email" placeholder="Your email" aria-label="Email" />
                  <button aria-label="Subscribe">→</button>
                </div>
              </div>
            </div>
          </div>
          
          <div className="l-footer-copyright">
            <p>© 2026 ScholarHub · Built with AI for Indian Students</p>
            <div className="l-footer-legal">
              <a href="#" onClick={e => e.preventDefault()}>Privacy</a>
              <a href="#" onClick={e => e.preventDefault()}>Terms</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
