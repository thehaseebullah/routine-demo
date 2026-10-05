# Testing Contract & Specifications (TESTS.md) — Routine

**Application Name:** Routine  
**Methodology:** Ultimate Coding Dev Guide (Revision 2) — Understand → Test-plan → Build → Prove → Document  
**Test Categories:** Happy Path, Edge Cases, Error Handling, Security, Regression  

---

## 1. Test Matrix Overview

| Module | Unit Tests (`src/test/`) | Component / Integration Tests | Manual Verification Checklist |
| :--- | :--- | :--- | :--- |
| **Projects CRUD** | `projects.test.ts` | ProjectModal & ProjectHeader | Create, update, switch, safe delete |
| **BOQ Calculations** | `boq.test.ts` | BOQList rendering & sum | Qty × Rate update in DOM |
| **Tasks & Status** | `tasks.test.ts` | TaskModal & status transition | Progress slider & completion sync |
| **Timesheets** | `timesheets.test.ts` | TimesheetList & date grouping | Daily total hours sum |
| **Daily Progress** | `dailyProgress.test.ts` | Timeline & project progress sync | Latest update prominence |
| **Change Review Log**| `changeLog.test.ts` | Status toggle & cost aggregation | Client view read-only guard |
| **Guidelines Upload** | `guidelines.test.ts` | File simulation, edit & delete | Modal preview & download |
| **UI & Responsive** | Snapshot/Layout test | MobileSimulatorShell & Header | 320px, 390px, 768px, 1280px widths |

---

## 2. Test Specifications by Module

### 2.1. Bill of Quantities (BOQ) Module
* **TC-BOQ-01 [Happy]:** Add valid item (`quantity = 150`, `rate = 45.00`).
  * *Expected:* `amount` equals `6750.00`. Project total increments by `6750.00`.
* **TC-BOQ-02 [Happy]:** Edit existing item (`rate` updated from `45.00` to `50.00`).
  * *Expected:* `amount` updates to `7500.00`. Project total updates reactively.
* **TC-BOQ-03 [Happy]:** Delete an item.
  * *Expected:* Item removed from list. Project total decrements accordingly.
* **TC-BOQ-04 [Edge]:** Zero quantity (`quantity = 0`, `rate = 100.00`).
  * *Expected:* `amount = 0.00`. No `NaN` or runtime error.
* **TC-BOQ-05 [Edge]:** Large numbers (`quantity = 1,000,000`, `rate = 250.50`).
  * *Expected:* Precise two-decimal float calculation without scientific notation overflow.
* **TC-BOQ-06 [Error]:** Negative quantity or negative rate (`quantity = -5`).
  * *Expected:* Inline validation triggers: *"Quantity must be zero or positive"*. Form submission blocked.
* **TC-BOQ-07 [Error]:** Non-numeric string inputs (`rate = "abc"`).
  * *Expected:* Sanitized to 0; user notified of invalid numeric format.
* **TC-BOQ-08 [Regression]:** Deleting all BOQ items.
  * *Expected:* Module displays dignified empty state: *"No BOQ items have been added to this project"* with button to add item.

### 2.2. Tasks Module
* **TC-TSK-01 [Happy]:** Create new task with priority, due date, and assignee.
  * *Expected:* Task appears in active project list with `Not Started` badge.
* **TC-TSK-02 [Happy]:** Progress sync: Slide progress to `100%`.
  * *Expected:* Status badge automatically updates to `Completed`.
* **TC-TSK-03 [Happy]:** Status sync: Change status to `In Progress`.
  * *Expected:* Progress sets to `50%` if previously `0%`, or preserves existing non-zero percentage.
* **TC-TSK-04 [Edge]:** Empty description and optional BOQ reference.
  * *Expected:* Task creates cleanly without breaking layout.
* **TC-TSK-05 [Error]:** Submitting task with whitespace or empty title.
  * *Expected:* Validation error: *"Task title is required"*.
* **TC-TSK-06 [Regression]:** Filtering tasks by `Completed` status.
  * *Expected:* Only completed tasks render; count indicator reflects filtered subset.

### 2.3. Timesheets Module
* **TC-TIME-01 [Happy]:** Log timesheet entry (`hours = 8.5`, `worker = "David K."`).
  * *Expected:* Entry added to daily group; total project hours increases by 8.5.
* **TC-TIME-02 [Edge]:** Fraction hours (`hours = 0.25` / 15 minutes).
  * *Expected:* Correctly recorded and formatted as `0.25 hrs`.
* **TC-TIME-03 [Error]:** Invalid hours (`hours <= 0` or `hours > 24`).
  * *Expected:* Validation error: *"Hours must be between 0.1 and 24"*.
* **TC-TIME-04 [Regression]:** Empty timesheet list.
  * *Expected:* Displays empty state with total hours `0.0 hrs`.

### 2.4. Daily Progress Module
* **TC-PROG-01 [Happy]:** Add daily progress update with 72% overall completion.
  * *Expected:* Appears at top of timeline; updates parent project's `overallProgress` to `72%`.
* **TC-PROG-02 [Happy]:** Add update with active blocker (*"Tower Crane inspection pending"*).
  * *Expected:* Blocker callout renders with alert styling on the update and project card.
* **TC-PROG-03 [Edge]:** Multiple updates logged on the same calendar day.
  * *Expected:* Handled cleanly with timestamps, sorted with latest on top.
* **TC-PROG-04 [Regression]:** Empty daily progress list.
  * *Expected:* Displays empty state: *"No daily progress updates yet."*

### 2.5. Change Review Log Module
* **TC-CHG-01 [Happy]:** Project Manager logs scope change (`costImpact = +12500`, `status = "Pending Review"`).
  * *Expected:* Appears in Change Log with pending status badge.
* **TC-CHG-02 [Happy]:** Project Manager updates status to `Approved`.
  * *Expected:* Badge changes to green `Approved`; review date and notes saved.
* **TC-CHG-03 [Security/Role]:** Client / Project-End user opens Change Log.
  * *Expected:* Change log is visible for review; action buttons to edit/approve/reject are omitted.
* **TC-CHG-04 [Error]:** Missing change title or description.
  * *Expected:* Form alerts user that required fields are missing.

### 2.6. Project Guidelines (Admin Simulation)
* **TC-GUIDE-01 [Happy]:** Admin uploads simulated guideline (file selection, category, title).
  * *Expected:* Document is added to repository with file size, extension badge, and timestamp.
* **TC-GUIDE-02 [Happy]:** Click "Simulate Download" or "View Document".
  * *Expected:* Document details modal opens with simulated document inspection.
* **TC-GUIDE-03 [Happy]:** Admin edits a guideline (title, category, version).
  * *Expected:* Guideline changes persist in memory and active list updates.
* **TC-GUIDE-04 [Happy]:** Admin deletes a guideline.
  * *Expected:* Guideline removed; if none remain, empty state rendered.
* **TC-GUIDE-05 [Security/Role]:** Client or PM opens Guidelines.
  * *Expected:* Can view and download; "Upload Guideline" button is restricted to Admin role.

### 2.7. Project Management & Switcher
* **TC-PROJ-01 [Happy]:** Create a new project with name, code, client, dates, and budget.
  * *Expected:* Project is created, added to projects list, and becomes the active project.
* **TC-PROJ-02 [Happy]:** Edit active project details.
  * *Expected:* Name, budget, location, and phase update reactively across header and metric tiles.
* **TC-PROJ-03 [Edge/Safety]:** Attempt to delete the only remaining project.
  * *Expected:* Action blocked with protective alert: "Cannot delete the only existing project in the demo."

### 2.8. Responsive & UI Ergonomics
* **TC-UI-01 [Mobile Viewport 375px]:** Verify touch targets, bottom navigation bar, card stacking for BOQ and tasks.
* **TC-UI-02 [Desktop Viewport 1280px]:** Verify top tabs, full tabular BOQ alignment, device simulation frame toggle.
* **TC-UI-03 [Theme & Contrast]:** Verify strict adherence to White background, Black structure, and Blue interactive accents.

---

## 3. Automated Test Execution Plan
* Framework: **Vitest** with `@testing-library/react`.
* Execution Command: `npm.cmd test -- --run`
* Gate: All tests must execute and pass with zero failures before declaring completion.
