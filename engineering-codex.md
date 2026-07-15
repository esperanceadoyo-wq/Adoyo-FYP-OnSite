# OnSite Repository Rules & Engineering Codex

## Purpose
This repository follows a principled, disciplined engineering approach tailored to building OnSite, a real-time third-space recommendation system for international students.

---

## Tech Stack Maintenance
* **Framework:** Next.js 16.x (App Router, PWA-configured)
* **UI:** React 19.x
* **Language:** TypeScript 5.x
* **Styling:** Tailwind CSS (Extended Theme Layer)
* **Authentication:** Firebase Authentication
* **Database:** Cloud Firestore

---

## Design Tokens
* **Primary:** `#2ab8cb`
* **Surface Tint:** `#2ab8cb`
* **Primary Container:** `#e0f7fa`
* **Primary Fixed Dim:** `#a5f3fc`
* **Primary Fixed:** `#cffafe`
* **Tertiary:** `#f97316`
* **Tertiary Fixed:** `#ffedd5`
* **Error:** `#ef4444`
* **On-Primary:** `#ffffff`

---

## Core Principles
1. **Root Cause Over Surface Fixes:** Fix the data model or state synchronization over adding arbitrary timeouts or guards.
2. **Mobile-First Simplicity First:** Keep layout rendering lightweight for smooth performance on mobile network connections.
3. **Clear Architectural Layer Separation:**
   * **Presentation Layer:** Next.js pages and client-side React UI components.
   * **Application Layer:** State management and custom hook processing.
   * **Data Layer:** Firestore queries and Firebase configuration rules.
