# Technical Architecture Document (ARCHITECTURE.md) — Routine

**Application Name:** Routine  
**Architecture Direction:** PERN Stack (PostgreSQL, Express, React, Node)  
**Prototype Phase:** Front-End Centric Interactive Demo with Service Abstraction  

---

## 1. Architectural Philosophy & Strategy

Routine is architected with a **clean separation of concerns** that allows the application to run immediately in any modern browser without an external database server, while adhering strictly to PERN-compatible domain models and service contracts.

```
┌────────────────────────────────────────────────────────┐
│                   React 18 / 19 UI                     │
│  (Pages, Mobile Simulation Shell, Design System, Modals)│
└───────────────────────────┬────────────────────────────┘
                            │
                            ▼
┌────────────────────────────────────────────────────────┐
│                  State & Context Layer                 │
│      (ProjectContext, RoleContext, ViewportContext)    │
└───────────────────────────┬────────────────────────────┘
                            │
                            ▼
┌────────────────────────────────────────────────────────┐
│               Service Abstraction Layer                │
│    (IProjectService, IBOQService, ITaskService, etc.)   │
└─────────────┬────────────────────────────┬─────────────┘
              │ (Current Demo Provider)    │ (Future PERN Backend)
              ▼                            ▼
┌───────────────────────────┐    ┌──────────────────────────┐
│ LocalStorage / Mock Repo  │    │  Express REST API Server │
│ (Instant client execution)│    │  (PostgreSQL Database)   │
└───────────────────────────┘    └──────────────────────────┘
```

By decoupling UI components from direct storage calls through clean TypeScript interfaces (`contracts/`), replacing the mock repository with HTTP `fetch`/`axios` calls to an Express backend requires **zero changes to the UI layer**.

---

## 2. Directory Structure

```
routine/
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
├── PRD.md
├── LOGIC.md
├── ARCHITECTURE.md
├── DESIGN.md
├── TESTS.md
├── AGENTS.md
└── src/
    ├── main.tsx                       # React application root
    ├── App.tsx                        # Root layout & view routing
    ├── config/                        # App constants (name, currency, versions)
    │   └── appConfig.ts
    ├── types/                         # Shared TypeScript domain models
    │   ├── project.ts
    │   ├── boq.ts
    │   ├── task.ts
    │   ├── timesheet.ts
    │   ├── dailyProgress.ts
    │   ├── changeLog.ts
    │   ├── guideline.ts
    │   └── userRole.ts
    ├── services/                      # Service abstraction layer
    │   ├── projectService.ts
    │   ├── boqService.ts
    │   ├── taskService.ts
    │   ├── timesheetService.ts
    │   ├── dailyProgressService.ts
    │   ├── changeLogService.ts
    │   ├── guidelineService.ts
    │   └── storage/                   # LocalStorage repository & initial seeds
    │       ├── initialSeedData.ts
    │       └── localStorageAdapter.ts
    ├── context/                       # Global state providers
    │   ├── ProjectContext.tsx         # Active project & data synchronization
    │   └── RoleContext.tsx            # PM, Client, Admin view toggles
    ├── components/
    │   ├── common/                    # Core UI design primitives
    │   │   ├── Button.tsx
    │   │   ├── Badge.tsx
    │   │   ├── Card.tsx
    │   │   ├── Modal.tsx
    │   │   ├── Input.tsx
    │   │   ├── Select.tsx
    │   │   ├── Textarea.tsx
    │   │   ├── ProgressBar.tsx
    │   │   └── EmptyState.tsx
    │   ├── layout/                    # Layout shells
    │   │   ├── Header.tsx             # Project name, role switcher, device toggle
    │   │   ├── MobileSimulatorShell.tsx # Phone frame / fluid viewport switch
    │   │   ├── NavigationBar.tsx      # Mobile bottom bar / top tab bar
    │   │   └── ProjectHeader.tsx      # Active project metadata and metrics
    │   └── modules/                   # Feature-specific components
    │       ├── boq/
    │       │   ├── BOQList.tsx
    │       │   ├── BOQItemModal.tsx
    │       │   └── BOQCategorySummary.tsx
    │       ├── tasks/
    │       │   ├── TaskList.tsx
    │       │   └── TaskModal.tsx
    │       ├── timesheets/
    │       │   ├── TimesheetList.tsx
    │       │   └── TimesheetModal.tsx
    │       ├── dailyProgress/
    │       │   ├── DailyProgressTimeline.tsx
    │       │   └── DailyProgressModal.tsx
    │       ├── changeLog/
    │       │   ├── ChangeLogList.tsx
    │       │   └── ChangeModal.tsx
    │       ├── guidelines/
    │       │   ├── GuidelineList.tsx
    │       │   └── GuidelineUploadModal.tsx
    │       └── clientView/
    │           └── ClientProjectPortal.tsx
    ├── styles/
    │   └── index.css                  # Design tokens, typography, CSS resets
    └── test/                          # Unit and integration test suites
        ├── projects.test.ts
        ├── boq.test.ts
        ├── tasks.test.ts
        ├── timesheets.test.ts
        ├── dailyProgress.test.ts
        ├── changeLog.test.ts
        └── guidelines.test.ts
```

---

## 3. Relational Schema Blueprint (PostgreSQL Migration Target)

The mock domain data directly reflects this standard relational schema:

```sql
-- Projects
CREATE TABLE projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  code VARCHAR(50) NOT NULL UNIQUE,
  client_name VARCHAR(255) NOT NULL,
  status VARCHAR(50) NOT NULL,
  current_phase VARCHAR(100) NOT NULL,
  start_date DATE NOT NULL,
  target_end_date DATE NOT NULL,
  overall_progress INTEGER CHECK (overall_progress BETWEEN 0 AND 100),
  location VARCHAR(255),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- BOQ Items
CREATE TABLE boq_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  item_number VARCHAR(50) NOT NULL,
  category VARCHAR(100) NOT NULL,
  description TEXT NOT NULL,
  unit VARCHAR(50) NOT NULL,
  quantity NUMERIC(12, 2) NOT NULL DEFAULT 0,
  rate NUMERIC(12, 2) NOT NULL DEFAULT 0,
  amount NUMERIC(14, 2) GENERATED ALWAYS AS (quantity * rate) STORED,
  notes TEXT
);

-- Tasks
CREATE TABLE tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  assignee VARCHAR(255),
  status VARCHAR(50) NOT NULL,
  priority VARCHAR(50) NOT NULL,
  progress INTEGER CHECK (progress BETWEEN 0 AND 100) DEFAULT 0,
  due_date DATE,
  boq_reference_id UUID REFERENCES boq_items(id) ON DELETE SET NULL
);

-- Timesheets
CREATE TABLE timesheets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  task_id UUID REFERENCES tasks(id) ON DELETE SET NULL,
  date DATE NOT NULL,
  worker_name VARCHAR(255) NOT NULL,
  hours NUMERIC(4, 2) NOT NULL CHECK (hours > 0 AND hours <= 24),
  description TEXT
);

-- Daily Progress Updates
CREATE TABLE daily_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  overall_progress INTEGER CHECK (overall_progress BETWEEN 0 AND 100),
  completed_work TEXT NOT NULL,
  work_in_progress TEXT NOT NULL,
  blockers TEXT,
  weather_conditions VARCHAR(100),
  reported_by VARCHAR(255) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Change Review Log
CREATE TABLE change_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  change_number VARCHAR(50) NOT NULL,
  title VARCHAR(255) NOT NULL,
  date_requested DATE NOT NULL,
  requested_by VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  reason TEXT NOT NULL,
  cost_impact NUMERIC(12, 2) DEFAULT 0,
  schedule_impact_days INTEGER DEFAULT 0,
  status VARCHAR(50) NOT NULL DEFAULT 'Pending Review',
  review_notes TEXT,
  reviewed_date DATE
);

-- Project Guidelines
CREATE TABLE project_guidelines (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  file_name VARCHAR(255) NOT NULL,
  file_size_bytes INTEGER NOT NULL,
  file_extension VARCHAR(20) NOT NULL,
  category VARCHAR(100) NOT NULL,
  upload_date DATE NOT NULL,
  description TEXT,
  uploaded_by VARCHAR(255) NOT NULL
);
```

---

## 4. State Management Strategy
1. **Synchronous React Context (`ProjectContext`):**
   * Manages current selected project, list of projects, and handles CRUD calls via our `services` layer.
   * On any modification, updates React state and immediately triggers idempotent sync to `localStorage`.
2. **Role Context (`RoleContext`):**
   * Tracks current active perspective: `'project_manager' | 'client' | 'admin'`.
   * Influences view rendering (read-only vs full editing) without hard page redirects.
3. **Viewport Mode:**
   * Allows the desktop reviewer to test the app in **Mobile Simulation Device Frame** (simulating an iPhone/Android screen at 390px with notch/device bezel) or **Fluid Responsive Mode** (flowing cleanly across desktop widths with mobile ergonomics).

---

## 5. Security & Build Considerations
* No credentials or sensitive data are stored.
* All inputs are sanitized against cross-site scripting (React automatically escapes rendered strings).
* Zero third-party heavyweight component libraries (e.g. no huge Material UI or bloated dependencies).
* Fast bundling via Vite with clean TypeScript compilation (`tsc --noEmit`).
