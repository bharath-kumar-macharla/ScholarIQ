# ScholarIQ Migration — React + Node.js/Express

Migrate ScholarIQ from vanilla HTML/CSS/JS to a full-stack application with a **React frontend** (Vite) and a **Node.js/Express backend** with REST API.

## User Review Required

> [!IMPORTANT]
> **Breaking Change**: This will restructure the entire project into two directories: `client/` (React) and `server/` (Express). The old vanilla files (`index.html`, `css/`, `js/`) will be replaced.

> [!IMPORTANT]
> **No Database**: The backend will keep scholarship data in-memory (JS arrays) — same as before, but server-side. This keeps the project simple and self-contained. A database can be added later.

## Proposed Changes

### Project Structure

```
ScholarIQ/
├── server/                    # Express.js Backend
│   ├── package.json
│   ├── index.js               # Express server entry point
│   ├── routes/
│   │   ├── scholarships.js    # /api/scholarships routes
│   │   ├── matcher.js         # /api/match routes
│   │   └── roadmap.js         # /api/roadmap routes
│   ├── data/
│   │   └── scholarships.js    # Scholarship database (migrated)
│   └── services/
│       ├── matcherService.js  # AI matching engine (migrated)
│       └── roadmapService.js  # Roadmap generator (migrated)
│
├── client/                    # React + Vite Frontend
│   ├── package.json
│   ├── vite.config.js
│   ├── index.html
│   ├── public/
│   └── src/
│       ├── main.jsx           # React entry point
│       ├── App.jsx            # Root component + routing
│       ├── App.css            # Global styles (migrated from styles.css)
│       ├── components/
│       │   ├── Navbar.jsx
│       │   ├── Hero.jsx
│       │   ├── ProfileBuilder/
│       │   │   ├── ProfileBuilder.jsx
│       │   │   ├── StepPersonal.jsx
│       │   │   ├── StepAcademics.jsx
│       │   │   ├── StepSkills.jsx
│       │   │   ├── StepExperience.jsx
│       │   │   ├── StepAchievements.jsx
│       │   │   └── StepCareer.jsx
│       │   ├── Dashboard.jsx
│       │   ├── ScholarshipList.jsx
│       │   ├── ScholarshipCard.jsx
│       │   ├── ScholarshipModal.jsx
│       │   ├── Roadmap.jsx
│       │   ├── Chat.jsx
│       │   ├── TagInput.jsx        # Reusable tag input
│       │   ├── ScoreRing.jsx       # Reusable score circle
│       │   └── ParticleCanvas.jsx  # Hero background
│       └── utils/
│           ├── api.js         # API client (fetch wrapper)
│           └── constants.js   # Skill/cert/career options
│
└── README.md
```

---

### Backend — `server/`

#### [NEW] server/package.json
Express server with `cors` and `nodemon` for development.

#### [NEW] server/index.js
- Express server on port `5000`
- CORS enabled for React dev server
- JSON body parser
- Mounts API routes under `/api`

#### [NEW] server/data/scholarships.js
- Migrated from existing `js/scholarships.js`
- Exported as CommonJS module with `SCHOLARSHIPS`, `FIELDS_OF_STUDY`, `SKILL_OPTIONS`, `CERTIFICATION_OPTIONS`, `CAREER_OPTIONS`

#### [NEW] server/services/matcherService.js
- Migrated from existing `js/matcher.js`
- All scoring functions preserved identically
- Exported: `scoreMatch()`, `matchAll()`, `getStats()`

#### [NEW] server/services/roadmapService.js
- Migrated from existing `js/roadmap.js`
- Exported: `generateRoadmap()`, `getAdvisorResponses()`

#### [NEW] server/routes/scholarships.js
| Endpoint | Method | Description |
|:--|:--|:--|
| `/api/scholarships` | GET | List all scholarships |
| `/api/scholarships/:id` | GET | Get single scholarship |
| `/api/scholarships/options` | GET | Get field/skill/cert/career options for forms |

#### [NEW] server/routes/matcher.js
| Endpoint | Method | Description |
|:--|:--|:--|
| `/api/match` | POST | Submit profile, returns all match results sorted by score |
| `/api/match/stats` | POST | Submit profile, returns quick stats |

#### [NEW] server/routes/roadmap.js
| Endpoint | Method | Description |
|:--|:--|:--|
| `/api/roadmap` | POST | Submit profile, returns roadmap & gap analysis |
| `/api/advisor` | POST | Submit profile + question type, returns AI advisor response |

---

### Frontend — `client/`

#### [NEW] client/ (Vite + React scaffold)
- Created via `npx create-vite@latest ./ --template react --no-interactive`
- Proxy to backend via `vite.config.js`

#### [NEW] src/App.jsx
- React Router for navigation between views
- Shared state via React Context (profile, match results)
- Layout with `<Navbar>` + route outlets

#### [NEW] src/App.css
- Migrated from existing `css/styles.css`
- Adapted for React (class selectors remain, no major changes needed)

#### [NEW] src/components/Navbar.jsx
- NavLink-based navigation with active state
- Mobile hamburger menu
- Brand logo

#### [NEW] src/components/Hero.jsx
- Particle canvas background (via useEffect + useRef)
- Animated stats counters
- CTA buttons

#### [NEW] src/components/ProfileBuilder/ProfileBuilder.jsx
- 6-step wizard managed with `useState` for step index
- Profile data in local state, synced to localStorage
- Progress bar component
- "Analyze My Profile" calls `POST /api/match` and navigates to dashboard

#### [NEW] src/components/Dashboard.jsx
- Fetches match results from context/API
- Animated ScoreRing component
- Stats cards, top scholarships, insights panel

#### [NEW] src/components/ScholarshipList.jsx
- Filter bar (search, tier chips, sort dropdown)
- Maps over match results → ScholarshipCard components
- Client-side filtering and sorting

#### [NEW] src/components/ScholarshipCard.jsx
- Reusable card with score circle, metadata, tags
- onClick opens ScholarshipModal

#### [NEW] src/components/ScholarshipModal.jsx
- Portal-based modal
- Eligibility checklist, match breakdown bars, explanations
- "Apply Now" and "View Roadmap" buttons

#### [NEW] src/components/Roadmap.jsx
- Fetches roadmap from API
- Strengths grid + timeline visualization
- Priority badges and unlock counts

#### [NEW] src/components/Chat.jsx
- Chat bubble UI with message state
- Suggestion chips call `POST /api/advisor`
- Typing indicator animation

#### [NEW] src/components/TagInput.jsx
- Reusable tag input with autocomplete dropdown
- Used across Skills, Certifications, and Career Interest steps

#### [NEW] src/components/ScoreRing.jsx
- SVG-based circular score indicator
- Animated stroke-dashoffset via CSS transition
- Color-coded by score tier

#### [NEW] src/components/ParticleCanvas.jsx
- Canvas-based particle animation
- Cleanup via useEffect return

#### [NEW] src/utils/api.js
- Centralized `fetch` wrapper for all API calls
- Base URL configurable
- Error handling

#### [NEW] src/utils/constants.js
- Skill, certification, career options fetched from backend on init
- Cached locally

---

## Verification Plan

### Automated Tests
```bash
# Start backend
cd server && npm start

# Start frontend (separate terminal)
cd client && npm run dev
```

### Manual Verification
1. Hero page loads with particle animation
2. Profile builder completes all 6 steps
3. "Analyze My Profile" calls the backend API and shows dashboard
4. Dashboard shows animated score ring and stats
5. Scholarship list filters, sorts, and searches correctly
6. Modal opens with full eligibility breakdown
7. Roadmap shows strengths and timeline
8. AI Advisor responds to suggestion chips and free text
9. Profile persists in localStorage across page reloads
10. Mobile responsive layout works
