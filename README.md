# EventPilot AI – Autonomous Event Management Platform

An enterprise-grade, full-stack event operations platform powered by **Next.js 14**, **n8n Cloud Automation Workflows**, **Google Workspace APIs** (Sheets, Drive, Slides, Gmail), and **Groq Llama 3.1 LLM Intelligence**.

EventPilot AI eliminates manual event logistics by automating attendee registration, dynamic QR passes, live camera check-ins with audio chimes, personalized PDF certificate dispatch, and automated executive sentiment analysis.

---

## ⚡ Key Highlights & Capabilities

- **Autonomous Multi-Pipeline Automation**: 4 synchronized n8n pipelines processing registrations, attendance check-ins, certificate rendering, and survey AI analysis.
- **Dynamic Identification & Routing**: Instant sequential Participant ID (`EVT-XXXXXX`) and auto-assigned Team ID (`TEAM-XXXX`).
- **Live Camera QR Attendance Scanner**: Browser-based QR reader (`html5-qrcode`) with real-time sheet synchronization and Web Audio API success/error sound chimes.
- **Dynamic Slide-to-PDF Certificate Dispatch**: Clones official Google Slides templates, injects student details, compiles vector PDFs, and delivers via Gmail.
- **Groq Llama 3.1 Feedback Intelligence**: Aggregates attendee survey responses, evaluates sentiment distribution, and delivers executive HTML briefing reports.
- **Disciplined Architectural UI**: Clean, high-contrast typography (Plus Jakarta Sans + JetBrains Mono), responsive design, and dark/light modes.

---

## 📁 Repository Architecture

```
ai-event-management-system/
│
├── website/                               # Full-Stack Next.js 14 Web Application
│   ├── src/
│   │   ├── app/
│   │   │   ├── layout.jsx                 # Root layout with Plus Jakarta Sans & JetBrains Mono
│   │   │   ├── globals.css                # High-contrast design tokens, buttons, tables
│   │   │   ├── page.jsx                   # Landing page, metrics strip, event matrix & filters
│   │   │   ├── login/page.jsx             # Auth & 1-Click presentation demo shortcuts
│   │   │   ├── portal/page.jsx            # Student dashboard, QR badge, & feedback modal
│   │   │   ├── staff/page.jsx             # Staff operations console with camera QR reader
│   │   │   ├── admin/page.jsx             # Admin command center & Groq AI sentiment analytics
│   │   │   └── api/                       # Next.js Serverless API endpoints
│   │   │       ├── auth/                  # JWT auth, Bcrypt hashing, session cookies
│   │   │       ├── events/                # Event catalogue CRUD & registration sync
│   │   │       ├── register-event/        # n8n webhook registration dispatch
│   │   │       ├── checkin/               # Real-time QR attendance validation
│   │   │       ├── certificates/          # Google Slides PDF trigger
│   │   │       └── feedback/              # Survey & Groq LLM intelligence trigger
│   │   ├── components/                    # Modular UI components & Modals
│   │   │   ├── Navigation.js              # Sticky navigation header
│   │   │   ├── Footer.js                  # Operational system footer
│   │   │   ├── QrCodeBadge.js             # High-res Canvas / PNG pass generator
│   │   │   ├── QrScannerModal.js          # Web camera QR decoder with audio chimes
│   │   │   ├── RegistrationModal.js       # Live registration modal with n8n bridge
│   │   │   ├── FeedbackModal.js           # 5-star rating & feedback survey modal
│   │   │   └── StatusBadge.js             # Color-coded attendance status pills
│   │   └── lib/                           # Database & Auth helpers
│   ├── package.json
│   └── vercel.json
│
├── workflows/                             # Production n8n Workflow Definitions
│   └── eventpilot-all-in-one-master-workflow.json   # Unified master workflow (36 nodes)
│
├── apps-script/                           # Google Apps Script Bridges
│   ├── registration.gs
│   └── feedback.gs
│
├── vercel.json                            # Root Vercel Monorepo build config
└── README.md
```

---

## 🔄 Four-Stage Automation Pipelines

```
Stage 1: Student Registration & ID Dispatch
[ Next.js Portal / Modal ] ──► [ n8n Webhook ] ──► [ Generate EVT & TEAM IDs ] ──► [ Google Sheets & Drive QR ] ──► [ Confirmation Email ]

Stage 2: Real-Time Camera QR Check-In
[ Staff Scanner Camera ] ──► [ Decode QR ] ──► [ n8n Webhook ] ──► [ Update Google Sheet ] ──► [ Audio Chime Feedback ]

Stage 3: Automated PDF Certificate Dispatch
[ Admin Trigger / Check-In ] ──► [ Clone Google Slides ] ──► [ Replace Text Placeholders ] ──► [ Download PDF ] ──► [ Email Attendee ]

Stage 4: Groq AI Feedback & Sentiment Intelligence
[ Attendee Feedback Modal ] ──► [ n8n Webhook ] ──► [ Groq Llama 3.1 LLM ] ──► [ Generate HTML Report ] ──► [ Email Executive Brief ]
```

---

## 🚀 Getting Started Locally

### 1. Clone the repository
```bash
git clone https://github.com/Heemanshu-stack/ai-event-management-system.git
cd ai-event-management-system/website
```

### 2. Install dependencies
```bash
npm install
```

### 3. Configure environment variables
Create a `.env.local` file inside the `website/` directory:
```env
NEXT_PUBLIC_N8N_WEBHOOK_URL=https://rock05.app.n8n.cloud/webhook
JWT_SECRET=eventpilot_jwt_super_secure_key_2026
STAFF_PASSKEY=staff2026
ADMIN_PASSKEY=admin2026
```

### 4. Start the development server
```bash
npm run dev
```
Open **[http://localhost:3000](http://localhost:3000)** in your browser.

---

## 🌐 Deploy to Vercel

1. Go to **[vercel.com/new](https://vercel.com/new)** and import `Heemanshu-stack/ai-event-management-system`.
2. In Project Settings, set Root Directory to `website` (or leave default with root `vercel.json`).
3. Add the Environment Variables:
   - `NEXT_PUBLIC_N8N_WEBHOOK_URL`
   - `JWT_SECRET`
   - `STAFF_PASSKEY`
   - `ADMIN_PASSKEY`
4. Click **Deploy**.

---

## 🔑 System Credentials & Access

| Role | Access Route | Username | Password / Passkey |
| :--- | :--- | :--- | :--- |
| **Admin Command** | `/admin` or `/login` | `admin` | `admin2026` |
| **Staff Scanner** | `/staff` or `/login` | `staff` | `staff2026` |
| **Student** | `/portal` or `/login` | *(Create Account)* | *Set by student during registration* |

---

## 📜 License

Licensed under the [MIT License](LICENSE).
