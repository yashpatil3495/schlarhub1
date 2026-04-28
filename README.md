# 🎓 ScholarHub v5 — India's AI-Powered Scholarship Platform

> **Find, apply, and win scholarships using AI.** From SOP writing to interview prep — ScholarHub handles everything so you can focus on studying.

![React](https://img.shields.io/badge/React-18.3-61DAFB?logo=react)
![Vite](https://img.shields.io/badge/Vite-5.4-646CFF?logo=vite)
![AI](https://img.shields.io/badge/AI-Gemini_2.5-4285F4?logo=google)
![PWA](https://img.shields.io/badge/PWA-Ready-5A0FC8)
![License](https://img.shields.io/badge/License-MIT-green)

---

## ✨ Features

### 🤖 AI-Powered Tools
- **ScholarBot** — Chat with AI that knows every scholarship in India
- **SOP Generator** — AI-crafted Statements of Purpose tailored to each scholarship
- **Interview Simulator** — Practice with real-time AI feedback
- **Rejection Analyser** — Learn why and improve for next time
- **Document OCR** — Extract text from scanned documents
- **Scholarship Comparison** — Side-by-side AI analysis of multiple scholarships

### 📊 Smart Dashboard
- **Match Scoring** — AI ranks scholarships by your eligibility (0-100%)
- **Application Tracker** — Kanban-style pipeline (Drafting → Applied → Won)
- **Progress Analytics** — Charts, stats, and weekly activity tracking
- **Deadline Calendar** — Never miss an application deadline

### 🌟 Platform Features
- **500+ Scholarships** — Government schemes, private, NGOs across India
- **Dark Mode** — Beautiful dark theme with system preference detection
- **Mobile Responsive** — Fully optimized for phones and tablets
- **PWA Support** — Install as a native app, works offline
- **Multi-language** — English + Hindi support (more coming)
- **Toast Notifications** — Real-time feedback for all actions
- **Back-to-Top** — Floating button for easy navigation

### 👥 Community
- **Peer Review** — Get feedback on SOPs from other students
- **Mentor Network** — Connect with scholarship winners
- **Micro-Challenges** — Daily tasks to build your profile

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn

### Setup
```bash
# Clone the repository
git clone https://github.com/yashpatil3495/schlarhub1.git
cd schlarhub1

# Install dependencies
npm install

# Copy environment template and add your API keys
cp .env.example .env

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Environment Variables
| Variable | Required | Description |
|----------|----------|-------------|
| `GEMINI_API_KEY` | ✅ | Google Gemini API key ([Get one](https://aistudio.google.com/apikey)) |
| `GROQ_API_KEY` | ✅ | Groq API key ([Get one](https://console.groq.com)) |
| `VITE_SUPABASE_URL` | ✅ | Supabase project URL |
| `VITE_SUPABASE_ANON_KEY` | ✅ | Supabase anon key |

---

## 🏗️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React 18, Vite 5 |
| **AI** | Gemini 2.5 Flash → 2.0 Flash → Groq Llama 3.3 (fallback chain) |
| **Backend** | Supabase (Auth + PostgreSQL) |
| **Styling** | Vanilla CSS with design tokens |
| **State** | React hooks + localStorage (with 24h TTL cache) |
| **PWA** | Service Worker + Web App Manifest |
| **CI/CD** | GitHub Actions |
| **Email** | EmailJS |

---

## 📁 Project Structure

```
scholarhub/
├── public/
│   ├── manifest.json          # PWA manifest
│   └── sw.js                  # Service worker
├── src/
│   ├── components/            # 26 React components
│   │   ├── Dashboard.jsx      # Main dashboard
│   │   ├── ScholarshipsPage.jsx
│   │   ├── ScholarshipCompare.jsx  # v5: AI comparison
│   │   ├── ProgressAnalytics.jsx   # v5: Charts & stats
│   │   ├── NotificationCenter.jsx  # v5: Notification panel
│   │   ├── SOPGenerator.jsx
│   │   ├── InterviewSimulator.jsx
│   │   └── ...
│   ├── contexts/              # React contexts
│   ├── data/                  # Scholarship database
│   ├── hooks/                 # Custom hooks
│   ├── lib/                   # Utilities
│   ├── styles/                # CSS design system
│   │   ├── globals.css        # Core styles + responsive
│   │   └── landing.css        # Landing page styles
│   └── utils/                 # AI & helper functions
├── .github/workflows/         # CI/CD pipeline
├── .env.example               # Environment template
└── package.json
```

---

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License.

---

## 👨‍💻 Author

**Yash Patil** — [GitHub](https://github.com/yashpatil3495)

---

> Built with ❤️ for Indian students. Every student deserves a scholarship.
