# System Logic & Behavior Specification (LOGIC.md) — Routine

**Application Name:** Routine  
**Document Purpose:** Detail runtime behaviors, state transitions, validation constraints, calculations, edge cases, and simulation mechanics.

---

## 1. Project Management & Selection Logic

### 1.1. Project State Model
Each project contains:
```typescript
interface Project {
  id: string;
  name: string;
  code: string; // e.g. "PRJ-2026-01"
  clientName: string;
  status: 'In Progress' | 'On Track' | 'Delayed' | 'Completed';
  currentPhase: string; // e.g., "MEP & Interior Rough-In"
  startDate: string; // ISO date
  targetEndDate: string; // ISO date
  overallProgress: number; // 0 - 100 integer
  location: string;
  budgetTotal: number;
}
```

### 1.2. Project Selection & Navigation
* The user can toggle between projects using a compact Project Picker dropdown or from the Projects Overview page.
* Selecting a project immediately updates the active project context in local state and persists the `activeProjectId` in `localStorage`.
* When an active project is set, all sub-modules (BOQ, Tasks, Timesheets, Daily Progress, Change Log, Guidelines) automatically filter and bind to the selected project ID.
* If a project has no items in any sub-module, that sub-module renders a dedicated **Empty State** with a direct call-to-action button (e.g., "Add First BOQ Item").

---

## 2. Bill of Quantities (BOQ) Logic

### 2.1. BOQ Item Model
```typescript
interface BOQItem {
  id: string;
  projectId: string;
  itemNumber: string; // e.g., "1.01", "2.04"
  category: string; // "Demolition", "Substructure", "MEP", "Finishes", "Exterior"
  description: string;
  unit: string; // "m²", "cu.m", "kg", "linear m", "pcs", "lots", "hrs"
  quantity: number;
  rate: number; // Unit price
  amount: number; // quantity * rate (derived/persisted)
  notes?: string;
}
```

### 2.2. Calculations & Reactivity
* **Line Calculation:** Whenever `quantity` or `rate` is modified in the modal/form:
  $$\text{Amount} = \text{round}_2(\text{Quantity} \times \text{Rate})$$
* **Negative Numbers & Zero:**
  * `quantity` must be $\ge 0$. If 0, `amount` is 0. Negative quantities are rejected with an inline validation alert.
  * `rate` must be $\ge 0$.
* **Project BOQ Total:**
  $$\text{BOQ Total} = \sum_{i=1}^{N} \text{item}_i.\text{amount}$$
  This total recalculates instantly whenever an item is added, edited, or deleted.
* **Category Summaries:**
  The BOQ module aggregates subtotals per category, enabling quick inspection of expenditure distribution (e.g., Finishes: $45,200 | MEP: $38,500).

---

## 3. Task Management Logic

### 3.1. Task Model
```typescript
interface Task {
  id: string;
  projectId: string;
  title: string;
  description: string;
  assignee: string; // Individual name or team (e.g. "Site Electrical Team")
  status: 'Not Started' | 'In Progress' | 'Completed';
  priority: 'Low' | 'Medium' | 'High' | 'Urgent';
  progress: number; // 0 - 100 %
  dueDate: string;
  boqReferenceId?: string; // Optional link to a BOQ line item
}
```

### 3.2. State Transitions & Rules
* **Status vs. Progress Sync:**
  * When a user marks status as `Completed`, `progress` automatically sets to `100%`.
  * When a user moves `progress` to `100%`, status automatically switches to `Completed`.
  * If a user sets `progress` between `1%` and `99%` while status is `Not Started`, status automatically transitions to `In Progress`.
  * If a user sets `progress` to `0%` while status is `In Progress` or `Completed`, status transitions to `Not Started`.
* **Filtering:** Tasks can be filtered by status (`All`, `Not Started`, `In Progress`, `Completed`) and priority.

---

## 4. Timesheets Logic

### 4.1. Timesheet Entry Model
```typescript
interface TimesheetEntry {
  id: string;
  projectId: string;
  date: string; // YYYY-MM-DD
  workerName: string;
  taskId: string;
  taskTitle: string;
  hours: number; // Decimal hours (e.g., 7.5)
  description: string;
}
```

### 4.2. Aggregation & Rules
* `hours` must be $> 0$ and $\le 24$ per entry. Validation error shown for negative or excessive values.
* **Cumulative Project Hours:** Computed as $\sum \text{hours}$ for all entries in the active project.
* **Daily Aggregation:** Entries are grouped by date descending, showing a daily sum header (e.g., *"October 5, 2026 — 22.5 Total Hours"*).

---

## 5. Daily Project Progress Logic

### 5.1. Daily Progress Model
```typescript
interface DailyProgressUpdate {
  id: string;
  projectId: string;
  date: string; // YYYY-MM-DD
  overallProgress: number; // Updated project progress (0 - 100)
  completedWork: string;
  workInProgress: string;
  blockers?: string;
  weatherConditions?: string; // e.g. "Clear, 22°C - Full site productivity"
  notes?: string;
  reportedBy: string;
}
```

### 5.2. Chronological Timeline & Project Health Sync
* When a Project Manager submits a new Daily Progress update:
  1. The new update prepends to the timeline (latest date first).
  2. The parent Project's `overallProgress` field is automatically updated to match the update's `overallProgress`.
  3. If `blockers` is non-empty, a visual flag/pill *"Site Alert / Blocker Active"* appears on the project header.
* **Client Visibility:** Clients see these updates as a transparent, verified timeline with clear summaries of what was completed and what is currently being executed.

---

## 6. Change Review Log Logic

### 6.1. Change Item Model
```typescript
interface ChangeLogItem {
  id: string;
  projectId: string;
  changeNumber: string; // e.g. "CR-004"
  title: string;
  dateRequested: string;
  requestedBy: string; // Client, Consultant, Site PM, Subcontractor
  description: string;
  reason: string;
  costImpact: number; // Positive = added cost, Negative = deduction, 0 = neutral
  scheduleImpactDays: number; // Days added or removed
  status: 'Pending Review' | 'Approved' | 'Rejected';
  reviewNotes?: string;
  reviewedDate?: string;
}
```

### 6.2. Workflow & Permissions
* **Project Manager:** Can log new changes and toggle review status (`Pending Review` $\rightarrow$ `Approved` or `Rejected`) with review notes.
* **Client View:** Clients see the status badges clearly. Approved changes display their net cost and schedule variance directly.
* Changes are ordered chronologically by request date.

---

## 7. Project Guidelines (Admin Simulation) Logic

### 7.1. Guideline Model
```typescript
interface ProjectGuideline {
  id: string;
  projectId: string; // Or "ALL" for global site guidelines
  title: string;
  fileName: string;
  fileSizeBytes: number;
  fileExtension: string; // "pdf", "docx", "dwg", "xlsx"
  category: 'Safety Protocols' | 'Quality Standards' | 'Site Logistics' | 'Contractual Guidelines';
  uploadDate: string;
  description: string;
  uploadedBy: string;
}
```

### 7.2. Upload Simulation Mechanics
1. User clicks **"Upload Guideline"** in Admin or Guidelines tab.
2. A real HTML file input allows the user to select any local file (e.g. PDF/DOCX) OR choose from realistic mock presets.
3. System reads the filename, size, and type, and generates a structured `ProjectGuideline` object stored in local state.
4. UI displays upload progress simulation (instant or micro-progress) and shows a success toast.
5. Users can trigger a **"View Document"** action (which displays document metadata and simulated preview modal) or **"Simulate Download"** (which initiates a safe mock file download or opens preview).
6. Admin role can edit guideline metadata (title, category, version, description) or delete guidelines with confirmation.

---

## 8. Role-Based View Switching Logic

| Capability / Section | Project Manager Role | Client / Project-End Role | Admin Role |
| :--- | :---: | :---: | :---: |
| **Project CRUD** | **Create / Edit / Delete** | View project status | View summary |
| **BOQ Add / Edit / Delete** | **Yes** | **No** (Hidden) | **No** (Hidden) |
| **Task CRUD** | Full Create / Edit / Complete / Delete | Status & Progress view only | View only |
| **Timesheets CRUD** | Full Log / Edit / Delete | **Hidden** (Internal labor data) | View only |
| **Daily Progress CRUD** | **Add / Edit / Delete** Daily Updates | **Read-Only** Timeline View | Read-Only |
| **Change Review Log CRUD** | Log, Edit, Delete & Approve/Reject | Review status & impacts | View only |
| **Project Guidelines CRUD** | View & Download | View & Download | **Upload, Edit, Manage & Delete** |

* Switching roles is instant via the top bar navigation. No page reloads or auth tokens required.

---

## 9. Data Persistence & Reset Strategy
* **Storage Engine:** Browser `window.localStorage` under key `routine_app_state_v1`.
* **Seed Data:** If storage is empty or corrupted, the system automatically hydrates with rich, realistic commercial construction demo data (e.g., *"Apex Commercial Tower - Interior Fit-Out"* and *"Metro Line Sector 4 - Structural & MEP"*).
* **Reset Button:** A discreet utility in the header/footer allows instant "Reset to Initial Demo State", clearing custom modifications and restoring pristine sample data.

---

## 10. Edge Cases & Defensive Validation
1. **Empty States:** When all items in any list are removed, clear visual placeholders with contextual CTA buttons are shown.
2. **Invalid Numbers:** Any non-numeric string or `NaN` in rate/quantity/hours defaults to 0 and displays a validation hint.
3. **Extreme Screen Widths:**
   * 320px: Table columns collapse gracefully into structured mobile cards.
   * 4K: Content is centered with a max-width container (`1280px` or simulated mobile viewport) to prevent excessive stretching.
4. **Data Export/Backup:** Safe serialization avoids circular dependencies or broken state transitions.
