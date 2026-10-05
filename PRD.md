# Product Requirements Document (PRD) — Routine

**Application Name:** Routine (Configurable working title)  
**Status:** Prototype / Demo  
**Target Release:** Front-End Interactive Prototype  
**Methodology:** Ultimate Coding Dev Guide (Revision 2) — Understand → Test-plan → Build → Prove → Document  

---

## 1. Product Overview
**Routine** is a focused, high-precision project management and Bill of Quantities (BOQ) creation web prototype. Built for project-driven environments (such as construction, fit-outs, engineering, and commercial renovation), Routine provides a unified workspace to track real-time project progress, manage cost breakdowns, coordinate site tasks, log labor timesheets, document project changes, and access project guidelines.

Routine is deployed as a responsive web application designed to **visually and ergonomically simulate a mobile-app experience**. It bridges field operations and client visibility without the cognitive overload or visual noise of legacy enterprise software.

---

## 2. Problem Statement
Small-to-medium project teams and field managers often struggle between two extremes:
1. **Bloated, generic enterprise SaaS dashboards:** Filled with decorative graphs, sprawling sidebars, steep learning curves, and desktop-locked interfaces that fail in mobile or on-site contexts.
2. **Disconnected spreadsheets and messaging apps:** Fragmented tracking of BOQ items, unrecorded site changes, and lack of real-time client-facing progress visibility.

Project managers need a nimble, tactile tool they can operate on the move, while clients and project-end stakeholders require transparent, clean overviews of progress and expenditure without internal administrative clutter.

---

## 3. Target Users & Personas

### 3.1. Project Manager (Internal Role)
* **Goal:** Monitor active projects, update daily site progress, manage BOQ line-items and cost summaries, assign and update tasks, review work timesheets, log scope changes, and review project guidelines.
* **Context:** Often on-site, using mobile devices or tablets, or back in the site office on a laptop. Needs fast, thumb-friendly inputs and instant clarity on project health.

### 3.2. Client / Project-End Stakeholder (External Role)
* **Goal:** Review project milestone status, observe daily field progress logs, inspect high-level BOQ category totals, and verify change logs.
* **Context:** Executive or client representative requiring an uncluttered, read-only, transparent summary without operational editing controls or internal employee timesheet minutiae.

### 3.3. Admin (Operational Support Role)
* **Goal:** Manage foundational project documents, upload technical specifications, site rules, safety standards, and project guidelines.
* **Context:** Focused exclusively on guideline provisioning and document governance.

---

## 4. Goals & Non-Goals

### 4.1. Core Goals
* Deliver an intuitive web prototype simulating a modern mobile-app experience with fluid responsive adaptation.
* Enable rapid creation, editing, and deletion of BOQ items with automatic line amount (`Qty × Rate`) and project total computation.
* Support task management with statuses (Not Started, In Progress, Completed), priorities, and progress percentages.
* Provide quick daily timesheet logging for project staff.
* Implement a chronological Daily Progress timeline allowing Project Managers to submit daily status updates (completed work, in-progress items, blockers, notes).
* Provide a clear role/view switcher allowing demonstration of Project Manager, Client / Project-End, and Admin views without authentication barriers.
* Provide a dedicated Change Review Log to track requested changes, impacts, and review statuses (Pending, Approved, Rejected).
* Support simulated upload and governance of Project Guidelines in the Admin module.
* Implement complete empty states and pre-populate realistic construction/renovation demo data.

### 4.2. Explicit Non-Goals
* **No Authentication / Registration:** No login, signup, forgot-password, or session tokens.
* **No Real Backend / Cloud Database:** No active cloud infrastructure; state persists in local browser memory (`localStorage` / reactive demo state).
* **No Real File Storage / S3:** File uploads are simulated via browser metadata and mock file blobs.
* **No Enterprise Feature Creep:** Strictly no live chat, real-time multi-cursor collaboration, payroll calculation, invoicing, CRM, HR management, email systems, or external payment gateways.

---

## 5. Core User Journeys

### Journey 1: Project Manager Site Walk & Progress Logging
1. Opens Routine on phone or desktop browser.
2. Selects active project (e.g., *"Apex Commercial Tower — Fit-Out"*).
3. Navigates to **Daily Progress** tab.
4. Taps **"Add Daily Update"**, enters current progress percentage (e.g., 68%), lists completed works (*"Level 4 HVAC ducting completed"*), active blockers (*"Awaiting ceiling tile shipment"*), and submits.
5. The project overall progress and latest activity immediately update across the project workspace.

### Journey 2: Estimator / PM Creating & Adjusting BOQ
1. Opens the **BOQ** module of the current project.
2. Reviews current items and total estimated cost.
3. Taps **"Add BOQ Item"**, enters Description (*"Porcelain Floor Tiles 600x600"*), Category (*"Finishes"*), Quantity (*180*), Unit (*"m²"*), and Rate (*$42.00*).
4. System automatically computes Amount (*$7,560.00*) and updates the Project Total BOQ Amount.
5. Edits or removes existing items with immediate reactive calculation.

### Journey 3: Client Inspecting Progress (Project-End View)
1. Toggles role selector to **"Client View"**.
2. Reviews high-level project summary: status, completion percentage, key milestone dates, and budget/BOQ summary.
3. Scrolls through the verified Daily Progress timeline to see recent milestones and photos/descriptions.
4. Checks the Change Review Log to review approved scope revisions. Internal management controls (Add/Delete/Edit) are hidden.

### Journey 4: Admin Publishing Project Guidelines
1. Toggles role selector to **"Admin View"** or opens **Project Guidelines**.
2. Selects a local document (e.g., *"Site Safety & Evacuation Plan Rev-C.pdf"*).
3. Selects category (*"Safety Protocols"*), specifies title, and submits.
4. The guideline appears in the project repository with simulated download and view triggers.

---

## 6. Functional Requirements

### 6.1. Project Overview & Selection
* **FR-1.1:** System shall display a list of projects with name, client, status (`In Progress`, `On Track`, `Delayed`, `Completed`), overall completion %, start/end dates, and current phase.
* **FR-1.2:** System shall allow switching between projects effortlessly.
* **FR-1.3:** System shall provide quick metrics: Total BOQ Value, Open Tasks, Latest Progress Update, and Active Changes.

### 6.2. BOQ (Bill of Quantities) Module
* **FR-2.1:** Display BOQ items grouped or tagged by category (e.g., Demolition, Structural, MEP, Finishes).
* **FR-2.2:** Each line item must capture: Category, Item Description, Quantity, Unit, Unit Rate, and Total Amount.
* **FR-2.3:** System shall automatically compute `Amount = Quantity * Rate` upon input.
* **FR-2.4:** System shall display a prominent, aggregate Total Project BOQ amount.
* **FR-2.5:** PM role can add new items, edit existing items, and delete items.
* **FR-2.6:** Client view shall display read-only BOQ breakdown and category summaries.

### 6.3. Task Management Module
* **FR-3.1:** Display tasks with Title, Description, Assigned Person/Team, Priority (`Low`, `Medium`, `High`, `Urgent`), Status (`Not Started`, `In Progress`, `Completed`), Progress % (0-100), Due Date, and optional BOQ Item reference.
* **FR-3.2:** Support adding new tasks, editing details, toggling status, and updating progress sliders/inputs.
* **FR-3.3:** Filter or group tasks by status or priority.

### 6.4. Timesheets Module
* **FR-4.1:** Log timesheet entries: Date, Personnel Name, Associated Task, Hours Logged, and Work Description.
* **FR-4.2:** Calculate cumulative hours logged per project and per day.
* **FR-4.3:** Support adding new timesheet entries and deleting invalid entries.

### 6.5. Daily Progress Module
* **FR-5.1:** Dedicated chronological timeline of site updates.
* **FR-5.2:** Each entry includes: Date, Updated Overall Progress %, Completed Works summary, In-Progress Works, Issues/Blockers, Site Notes.
* **FR-5.3:** Adding a daily progress entry updates the project’s high-level completion percentage and last active timestamp.

### 6.6. Change Review Log
* **FR-6.1:** Log project scope changes: Change Title, Date, Requested By, Description, Reason, Schedule/Cost Impact, Status (`Pending Review`, `Approved`, `Rejected`), and Review Notes.
* **FR-6.2:** PM role can submit new change entries and update review statuses.
* **FR-6.3:** Client view provides clear visibility into approved and pending scope adjustments.

### 6.7. Project Guidelines (Admin Section)
* **FR-7.1:** Admin can upload simulated guidelines: Document Title, Filename, Category (`Safety Protocols`, `Quality Standards`, `Site Logistics`, `Contract Guidelines`), Description, and Upload Date.
* **FR-7.2:** File picker simulation captures real file metadata (name, size, type) and simulates upload state without backend storage.
* **FR-7.3:** Provide simulated download/view modal and deletion action.

### 6.8. Role & Experience Switcher
* **FR-8.1:** Top header switcher allows switching between **Project Manager**, **Client / Project-End**, and **Admin** views instantly.
* **FR-8.2:** Optional **Device Simulation Toggle** allows switching between a realistic mobile device frame (390px viewport simulation) and full-width responsive layout for testing.

---

## 7. Non-Functional Requirements
* **NFR-1 (Aesthetic & Style):** Strict palette: Clean White background (`#FFFFFF`, `#F8FAFC`), Deep Black text and structure (`#0F172A`, `#09090B`), Intentional Blue accents (`#0B57D0` / `#2563EB`). No generic dashboard templates, no neon gradients, no bloated cards.
* **NFR-2 (Mobile Simulation & Responsiveness):** Touch targets ≥ 44px height. Seamless operation from 320px smartphones to 4K displays. Bottom navigation bar on mobile viewports.
* **NFR-3 (Performance):** Zero runtime latency; zero bundle bloat; initial load < 1 second.
* **NFR-4 (Accessibility):** WCAG 2.1 AA compliant color contrast, ARIA landmarks, semantic HTML elements, keyboard navigation for modals and forms.
* **NFR-5 (Resilience):** Robust handling of empty datasets, negative numbers, division by zero, and invalid strings.

---

## 8. Assumptions & Open Questions
1. **Assumption:** All mock data will be stored in browser `localStorage` with a fallback "Reset Demo Data" capability.
2. **Assumption:** Currency defaults to USD ($) or standard decimal formatting with standard 2-decimal precision.
3. **Open Question:** In future iterations with a real backend, will BOQ changes automatically spawn Change Review entries? (For the demo, they are managed independently to allow clean demonstration).
