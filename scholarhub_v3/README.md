# 🎓 ScholarHub

**India's most intelligent scholarship companion** — AI-powered scholarship discovery, SOP generation, interview prep, peer review, and more.

![ScholarHub](https://img.shields.io/badge/Built%20with-React%2018-61dafb?logo=react) ![Claude](https://img.shields.io/badge/AI-Claude%20Sonnet-orange) ![Vite](https://img.shields.io/badge/Bundler-Vite-646cff?logo=vite)

---

## ✨ Features

### Core Platform
| Feature | Status |
|---------|--------|
| 🔍 Advanced scholarship search & filter | ✅ |
| 📋 Scholarship detail pages | ✅ |
| 🔖 Save & track applications | ✅ |
| 📅 Deadline Calendar | ✅ |
| 📁 Document Center & Vault | ✅ |
| 👤 User Profile | ✅ |
| 🔔 Notifications Center | ✅ |

### AI-Powered Tools (Claude API)
| Feature | Status |
|---------|--------|
| ✍️ SOP / Essay Generator (streaming) | ✅ |
| 🎤 Interview Simulator with scoring | ✅ |
| 🔍 Rejection Analyser (pre-submit check) | ✅ |
| 📷 Document OCR Auto-Fill | ✅ |
| 🤖 ScholarBot AI Chat Assistant | ✅ |

### Unique Features
| Feature | Status |
|---------|--------|
| 💰 Financial Aid Stack Calculator | ✅ |
| 🗺️ Interactive India Scholarship Map | ✅ |
| 👥 Anonymous SOP Peer Review Exchange | ✅ |
| 📱 WhatsApp Deadline Reminders (UI) | ✅ |
| 🏆 Micro-Scholarship Challenges | ✅ |
| 🎓 Winner Mentor Network | ✅ |

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- An [Anthropic API key](https://console.anthropic.com)

### Installation

```bash
git clone https://github.com/your-username/scholarhub.git
cd scholarhub
npm install
cp .env.example .env
# Edit .env and add your VITE_ANTHROPIC_API_KEY
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see it running.

---

## 🔑 API Key Setup

ScholarHub uses the Claude API for all AI features. You need to:

1. Go to [console.anthropic.com](https://console.anthropic.com)
2. Create an API key
3. Add it to your `.env` file:
   ```
   VITE_ANTHROPIC_API_KEY=sk-ant-your-key-here
   ```

> **Security Note:** In production, never expose your API key in the frontend. Use a backend proxy. For local development and demos, the key is passed via Vite's `import.meta.env`.

---

## 📁 Project Structure

```
scholarhub/
├── src/
│   ├── main.jsx                    # Entry point
│   ├── App.jsx                     # Root app + navigation
│   ├── styles/
│   │   └── globals.css             # Design system + global styles
│   ├── data/
│   │   └── scholarships.js         # Scholarship database (500+ records)
│   ├── utils/
│   │   ├── claude.js               # Claude API streaming helper
│   │   └── helpers.js              # Formatting & utility functions
│   └── components/
│       ├── Dashboard.jsx           # Home dashboard
│       ├── ScholarshipsPage.jsx    # Search & browse
│       ├── ScholarshipDetail.jsx   # Detail modal
│       ├── ApplicationTracker.jsx  # Kanban tracker
│       ├── DeadlineCalendar.jsx    # 📅 NEW: Calendar view
│       ├── DocumentCenter.jsx      # 📁 NEW: Document vault
│       ├── ProfilePage.jsx         # 👤 NEW: User profile
│       ├── NotificationsPage.jsx   # 🔔 NEW: Notifications
│       ├── AITools.jsx             # AI tools container
│       ├── SOPGenerator.jsx        # ✍️ SOP generator
│       ├── InterviewSimulator.jsx  # 🎤 Interview prep
│       ├── RejectionAnalyser.jsx   # 🔍 Pre-submit check
│       ├── DocumentOCR.jsx         # 📷 NEW: OCR auto-fill
│       ├── AidCalculator.jsx       # 💰 Financial calculator
│       ├── ScholarshipMap.jsx      # 🗺️ NEW: India map
│       ├── PeerReview.jsx          # 👥 NEW: Peer review
│       ├── WhatsAppReminders.jsx   # 📱 NEW: WA reminders
│       ├── MicroChallenges.jsx     # 🏆 NEW: Challenges
│       ├── MentorNetwork.jsx       # 🎓 NEW: Mentors
│       └── ScholarBot.jsx          # 🤖 AI chatbot
├── public/
│   └── india-states.json           # India GeoJSON (placeholder)
├── .env.example
├── index.html
├── package.json
└── vite.config.js
```

---

## 🛣️ Roadmap

### Phase 1 (Current) — Core + AI ✅
- Scholarship database and search
- All AI tools (SOP, Interview, Analyser, OCR, ScholarBot)
- Application tracker
- Financial calculator

### Phase 2 — Community + Visual ✅
- Peer review exchange
- India scholarship map
- Document vault
- Deadline calendar
- Notifications system

### Phase 3 — Production Backend
- [ ] Supabase auth (email OTP + Google OAuth)
- [ ] Supabase database + RLS policies
- [ ] Real document storage
- [ ] WhatsApp reminders via Twilio
- [ ] Micro-scholarship payment via Razorpay
- [ ] Mentor verification system
- [ ] PWA support

---

## 🏗️ Production Deployment

```bash
npm run build
# Deploy dist/ to Vercel, Netlify, or any static host
```

For production, set up a backend proxy to keep your Claude API key secure.

---

## 📜 License

MIT — free to use for educational and non-commercial projects.

---

*Built with ❤️ for every Indian student who deserves better scholarship access.*
