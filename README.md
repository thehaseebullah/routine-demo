# routine-demo

> **Routine** — Configurable Project Management & Bill of Quantities (BOQ) Web Prototype with Mobile App Simulation.

Built with **React**, **TypeScript**, and **Vite**, designed to simulate an authentic mobile app experience on the web with role-based perspectives (Project Manager, Client / Project-End, and Admin).

---

## 🚀 Key Features

* **Project Management & Switcher:** Multi-project workspace with real-time budget, phase, and progress metrics. Full Create, Read, Update, and Delete (CRUD).
* **Bill of Quantities (BOQ):** Reactive line item calculation ($\text{Quantity} \times \text{Rate} = \text{Amount}$), category cost breakdowns, and live total estimates.
* **Tasks & Field Operations:** Activity schedule with status/progress synchronization (0% Not Started, 100% Completed), priority badges, assignees, and BOQ linkage.
* **Timesheets:** Daily labor and subcontractor hour tracking grouped by date with cumulative project hour summaries.
* **Daily Progress Timeline:** Verified site progress log with weather conditions, active blockers, crew headcounts, and automatic project overall completion % calculation.
* **Change Review Log:** Scope variations and cost impact tracking with formal review workflow (Approve / Reject with notes).
* **Project Guidelines (Admin):** Compliance manuals, safety standards, and drawing specifications with simulated upload, view/preview, download, and edit capabilities.
* **Multi-Role Perspectives:** Instant switching between **Project Manager**, **Client / Stakeholder**, and **Admin** views.
* **Dual Display Modes:** Standard fluid responsive view or authentic **Mobile Frame** simulator (390px smartphone bezel with status bar and bottom navigation).
* **Interactive User Guide:** Built-in modal walkthrough explaining every feature.

---

## 🛠️ Tech Stack

* **Frontend:** React 18, TypeScript, Vite
* **Styling:** Vanilla CSS with custom tokens (White, Slate/Black, Precision Blue)
* **Icons:** Lucide React
* **Testing:** Vitest, Testing Library
* **Deployment:** Pre-configured for Vercel via [`vercel.json`](./vercel.json)

---

## 💻 Local Development

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start the local dev server:**
   ```bash
   npm run dev
   ```
   Open `http://localhost:3000` in your browser.

3. **Run unit tests:**
   ```bash
   npm test
   ```

4. **Build for production:**
   ```bash
   npm run build
   ```

---

## 🌐 Deploy to Vercel

The repository includes a ready-to-use [`vercel.json`](./vercel.json) with SPA rewrites and edge asset caching:
1. Push this repo to GitHub.
2. Import the project into [Vercel](https://vercel.com).
3. Vercel will automatically build and deploy the app.
