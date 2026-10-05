# Coding Agent Operating Manual (AGENTS.md) — Routine

**Application Name:** Routine (Configurable Project Management & BOQ Web Prototype)  
**Governing Document:** Ultimate Coding Dev Guide — Revision 2  
**Operating Philosophy:** Understand → Test-plan → Build → Prove → Document  

---

## 1. Project Context & Source of Truth

This repository hosts **Routine**, a professional web-based project management and Bill of Quantities (BOQ) prototype designed to visually simulate a mobile application.

The following documents represent the inviolable **Source of Truth** for all development:
1. `PRD.md`: Functional scope, user roles, acceptance criteria, non-goals.
2. `LOGIC.md`: Mathematical calculations, state transitions, validation, and role permissions.
3. `ARCHITECTURE.md`: PERN-oriented service abstractions, data structures, and schemas.
4. `DESIGN.md`: Visual tokens (White/Black/Blue), typography, mobile simulation rules, component patterns.
5. `TESTS.md`: Test matrix, assertions, and verification criteria.
6. `AGENTS.md`: This operational guide.

---

## 2. Core Engineering Principles (Ponytail Principles)

1. **Understand Before Changing:** Always inspect active code, tests, and documentation before modifying or introducing files.
2. **Reuse Before Creating:** Do not create duplicate components or parallel utility functions. Use existing primitives (`Button`, `Badge`, `Card`, `Modal`, `Input`).
3. **Smallest Correct Implementation:** Build only what satisfies the requirement. Avoid speculative enterprise complexity.
4. **No Invented Requirements:** Do NOT add features not requested by the client (strictly no login/auth, chat, CRM, accounting, HR, notifications, cloud storage, real-time sync).
5. **No Vibe/AI-Coded Aesthetics:** Strictly follow the White, Black, and Blue palette. Do not generate gradient-heavy, card-soup, generic SaaS dashboard layouts.
6. **Preserve Data Integrity & Accessibility:** Ensure all forms validate numeric boundaries (rates $\ge 0$, hours $\le 24$). Ensure WCAG contrast and keyboard accessibility.
7. **Prove Before Claiming Completion:** Never claim an implementation is complete or tests have passed without executing them and verifying output.

---

## 3. Tooling & Environment Constraints on Windows

* **PowerShell Execution Policy:** On this environment, running PowerShell scripts (`.ps1`) is restricted. Always invoke Node tools via `.cmd` wrappers:
  * Use `npm.cmd` instead of `npm`.
  * Use `npx.cmd` instead of `npx`.
* **Clean Code Structure:** Keep components focused, type-safe (TypeScript strict mode), and free of circular imports.

---

## 4. Source of Truth Maintenance Protocol

Whenever a change in implementation or user requirement occurs:
1. Update `LOGIC.md` if behavior, calculations, or permissions changed.
2. Update `ARCHITECTURE.md` if contracts, types, or services changed.
3. Update `DESIGN.md` if visual tokens or component styles changed.
4. Update `TESTS.md` with new test cases.
5. Execute tests (`npm.cmd test -- --run`) and production build (`npm.cmd run build`) to prove zero regressions.

---

## 5. Verification Checklist Before Hand-Off

* [ ] No login / signup screens exist.
* [ ] Projects list and switcher work seamlessly.
* [ ] BOQ: Line item calculation `Qty × Rate = Amount` is reactive, total is accurate, and empty state handles zero items.
* [ ] Tasks: Status and progress percentage synchronize correctly.
* [ ] Timesheets: Hours calculate per project and group by date.
* [ ] Daily Progress: Chronological timeline updates project overall completion percentage.
* [ ] Change Review Log: Changes can be recorded, approved, or rejected.
* [ ] Project Guidelines: Admin can simulate document upload, viewing, and deletion.
* [ ] Role switcher toggles between Project Manager, Client / Project-End, and Admin views.
* [ ] Mobile-app visual simulation looks authentic with bottom navigation, touch ergonomics, and responsive layout.
* [ ] Automated tests pass.
* [ ] Production build succeeds with 0 errors.
