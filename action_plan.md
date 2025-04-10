# Project Action Plan & Security Review

This document outlines identified issues and a proposed action plan based on a review of the StudyGemini AI project codebase, incorporating deployment and future platform goals.

## 0. Prerequisites: Backup & Version Control (MANDATORY FIRST STEP)

Before implementing any code changes, it is crucial to establish version control.

*   **Action:**
    1.  Initialize a Git repository in the project root (`git init`).
    2.  Create a `.gitignore` file suitable for Next.js/Node.js projects to exclude unnecessary files (e.g., `node_modules/`, `.env*`, `.next/`).
    3.  Stage all current project files (`git add .`).
    4.  Create an initial commit to save the current state (`git commit -m "Initial commit (pre-refactor)"`).
    5.  **(Highly Recommended)** Create a private repository on GitHub and push the initial commit (`git remote add origin <repo_url>`, `git push -u origin main` or `master`).
*   **Rationale:** Provides a safety net, tracks changes, enables collaboration, and integrates with deployment platforms.

## 1. Critical Security Vulnerabilities (Address Before MVP Deployment)

These issues pose significant security risks and must be addressed before deploying the application publicly.

*   **Unauthenticated API Routes:**
    *   **Issue:** API routes `/api/flashcards` and `/api/quiz` currently have their authentication checks commented out. This allows unauthenticated users to potentially access and consume resources meant for logged-in users.
    *   **Action:** Reinstate and verify authentication checks (e.g., using Firebase Auth server-side verification) for these routes immediately. Ensure only authorized users can access them.
    *   **Files:** `studygemini-ai/src/app/api/flashcards/route.ts`, `studygemini-ai/src/app/api/quiz/route.ts`

*   **Insecure Client-Side State Management:**
    *   **Issue:** User tier (`isPro`, `founder`), trial status (`hadTrial`, `isInTrial`), and potentially usage limits rely heavily on `localStorage`. Client-side storage is easily manipulated, allowing users to bypass restrictions or gain unauthorized access to premium features.
    *   **Action:**
        *   Refactor authentication and state management (`AuthContext`, `PromptLimitWrapper`, `UpgradePopup`, etc.) to rely *solely* on server-verified information.
        *   Use Firebase Auth custom claims to store user roles/tiers securely. Fetch these claims upon login and use them as the source of truth.
        *   Verify user status and limits on the server-side within API routes *before* performing actions or returning data. Do not trust client-sent tier/status information.
    *   **Files:** `studygemini-ai/src/lib/contexts/AuthContext.tsx`, `studygemini-ai/src/app/components/dashboard/PromptLimitWrapper.tsx`, `studygemini-ai/src/app/components/dashboard/UpgradePopup.tsx`, potentially related API routes.

*   **Hardcoded Privileged Account:**
    *   **Issue:** The email `axel@funnel-profits.com` is hardcoded in `AuthContext` to grant 'founder' privileges. This is inflexible and insecure.
    *   **Action:** Remove the hardcoded email check. Implement a role-based access control (RBAC) system using Firebase Auth custom claims (e.g., set a `role: 'founder'` claim) or a database field to manage special privileges.
    *   **Files:** `studygemini-ai/src/lib/contexts/AuthContext.tsx`

*   **Missing/Insecure Usage Limit Enforcement:**
    *   **Issue:** API usage limits (e.g., Perplexity research) are noted as `TODO` or rely on insecure client-side state. Users can bypass these limits.
    *   **Action:** Implement robust, server-side usage tracking (e.g., using Firestore counters) for all limited features. Check and increment usage counts within the respective API routes *before* processing the request.
    *   **Files:** `studygemini-ai/src/app/api/perplexity/route.ts`, `studygemini-ai/src/lib/contexts/AuthContext.tsx` (remove client-side limit logic if redundant), `studygemini-ai/src/app/components/dashboard/PromptLimitWrapper.tsx` (rely on server state).

*   **Weak Password Complexity Enforcement:**
    *   **Issue:** While password requirements are mentioned in the UI, there doesn't appear to be strong client-side validation preventing submission of weak passwords, nor confirmation of server-side enforcement beyond Firebase defaults.
    *   **Action:** Implement client-side validation in the signup/password change forms (`AuthModal.tsx`, `settings/page.tsx`) to match the described requirements and provide immediate feedback. Ensure Firebase Auth password policies are configured appropriately in the Firebase console if stricter server-side rules are needed.
    *   **Files:** `studygemini-ai/src/app/components/auth/AuthModal.tsx`, `studygemini-ai/src/app/dashboard/settings/page.tsx`

## 2. Code Quality & Refactoring (Address after Security)

*   **Duplicate Firebase Initialization:**
    *   **Issue:** Two files (`src/lib/firebase.ts` and `src/lib/firebase/firebase.ts`) seem to handle Firebase initialization.
    *   **Action:** Consolidate Firebase initialization into a single, correctly located file (e.g., `src/lib/firebase/clientApp.ts` for client-side, potentially separate admin setup if needed) and update all imports. Delete the redundant file.
    *   **Files:** `studygemini-ai/src/lib/firebase.ts`, `studygemini-ai/src/lib/firebase/firebase.ts`

*   **Excessive CSS `!important` Usage:**
    *   **Issue:** `globals.css` uses `!important` multiple times. This overrides specificity rules and can make CSS harder to manage and debug.
    *   **Action:** Review instances of `!important`. Attempt to refactor the CSS by increasing specificity of selectors or reorganizing styles to avoid the need for `!important`.
    *   **Files:** `studygemini-ai/src/app/globals.css`

*   **Incomplete Features (TODOs):**
    *   **Issue:** `TODO` comments indicate unfinished work, like the Gemini API integration and usage tracking.
    *   **Action:** Prioritize and complete the implementations marked with `TODO`. Replace placeholder logic (like using OpenAI for Gemini) with the intended functionality.
    *   **Files:** `studygemini-ai/src/app/api/chat/route.ts`, `studygemini-ai/src/app/api/perplexity/route.ts`

## 3. Potential Redundancy (Lower Priority)

*   **Root `.bat` Scripts:**
    *   **Issue:** Several `.bat` scripts exist in the project root.
    *   **Action:** Verify if these scripts (`run-local-next.bat`, `start-dev-server.bat`, etc.) are still required for the development or deployment workflow. If not, remove them to simplify the project structure.
    *   **Files:** Root directory `.bat` files.

## 4. Configuration & Environment (Ongoing)

*   **Environment Variables:**
    *   **Issue:** The project relies on numerous API keys and configuration variables stored in environment variables. Lack of documentation can hinder setup and deployment.
    *   **Action:** Create and maintain a `.env.example` file listing all required environment variables (e.g., `NEXT_PUBLIC_FIREBASE_API_KEY`, `STRIPE_SECRET_KEY`, `OPENAI_API_KEY`, etc.) with placeholder values or descriptions. Ensure sensitive keys (`.env*` files) are listed in `.gitignore` and never committed.

## 5. Deployment Strategy (MVP)

*   **Goal:** Deploy the Minimum Viable Product (MVP) quickly and reliably with a custom domain.
*   **Recommended Platform:** Vercel.
*   **Workflow:**
    1.  Complete **Section 0 (Prerequisites: Git Setup)**.
    2.  Complete **Section 1 (Critical Security Vulnerabilities)**.
    3.  Sign up for Vercel and connect your GitHub account.
    4.  Import the GitHub repository into Vercel.
    5.  Configure Vercel project settings (ensure necessary environment variables from `.env` are added to Vercel's environment variable settings).
    6.  Vercel will automatically deploy upon pushes to the main branch.
    7.  Configure your custom domain within Vercel's settings.
*   **Rationale:** Vercel offers the most seamless deployment for Next.js, handles infrastructure automatically, and integrates perfectly with GitHub for CI/CD.

## 6. Future Platform Considerations (Chrome Extension, Mobile Apps)

*   **Goal:** Expand functionality to a Chrome Extension and native iOS/Android apps.
*   **Strategy:**
    1.  **Prioritize Web App & API:** Focus on stabilizing and securing the web application and its underlying API first (Sections 1 & 2).
    2.  **API as Foundation:** Design and build the API routes (`/api/*`) to be robust, well-documented, and securely authenticated, anticipating their use by other clients (extension, mobile).
    3.  **Consistent Authentication:** Plan for a unified authentication experience across platforms, likely leveraging Firebase Authentication's multi-platform capabilities.
    4.  **Sequential Development:** Recommend completing the web app MVP deployment before dedicating significant resources to the extension or mobile apps to avoid fragmentation and ensure a solid foundation.

## Next Steps

1.  Confirm agreement with the updated plan, particularly the Git/GitHub + Vercel approach.
2.  Proceed with **Section 0: Prerequisites: Backup & Version Control**.

Review this action plan and prioritize the tasks, starting with the critical security vulnerabilities. 