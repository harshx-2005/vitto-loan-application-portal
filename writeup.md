# Vitto Loan Application Portal — Project Write-Up

## 1. Project Overview & Features
The **Vitto Loan Application Portal** is a production-grade full-stack application built to facilitate seamless borrower applications and streamline underwriting workflows. The project consists of two core components:

*   **Borrower Application Form (`/`)**: A highly polished, responsive form supporting multilingual requests (Hindi, Tamil, Telugu, Marathi, English). It validates names, regional mobile formats, and loan ranges (Min ₹50,000 / Max ₹50 Lakh) client-side using React Hook Form + Zod, and registers them into the database. A unique transaction reference number (`VIT-YYYY-XXXXX`) is generated for each success.
*   **Operations Portal (`/dashboard`)**: An internal administrative dashboard protected by credentials (`admin@example.com` / `admin@vitto`) provided for evaluation and testing purposes (including a single-click "Autofill Credentials" shortcut button). It compiles real-time aggregate statistics (total volume, status breakdowns) and features a dynamic search and filter data grid for reviewing borrower purposes, language settings, and instantly approving/rejecting applications.

---

## 2. Technical Stack & Architectural Choices
*   **Frontend**: Built with **React** (orchestrated by **Vite** for fast HMR) and **Tailwind CSS** for styling. **TanStack Query (React Query)** handles server-state caching, enabling immediate client-side data synchronization and zero-reload updates when underwriters perform status transitions. **Lucide React** provides clean vector icons.
*   **Backend**: A structured **Node.js** and **Express** API layer. It enforces security headers via **Helmet**, implements CORS policies, utilizes **Zod** request validation middleware to shield backend endpoints, and uses centralized JSON error parsing for robust crash safety. **It implements a pre-configured credentials verification route and a custom route-gate middleware (`authMiddleware.js`) to restrict access to administrative endpoints.**
*   **Database & ORM**: **PostgreSQL** configured with **Prisma ORM**. Prisma handles database schemas and indexes on search-intensive columns (mobile, status, name) to ensure quick query executions.

---

## 3. Deployment Infrastructure Decisions
*   **Frontend Deployment (Vercel)**: Vercel was chosen for the React SPA client because of its global edge network, automated continuous deployments from GitHub, and seamless client-side single-page routing handling via custom URL rewrites.
*   **Backend Deployment (Render)**: Render runs the Express web server inside a Docker-equivalent container. It supports environment variable configurations and automatic redeployments on Git pushes. A custom `render.yaml` Blueprint was created to define the service builds orchestrations.
*   **Database (Supabase PostgreSQL)**: Supabase is selected to host the managed Postgres engine. To handle Render's IPv6 outbound limitations on the free tier, we routed connections through the **Supabase Transaction Pooler** (port `6543`) with `pgbouncer=true`. This enforces IPv4 resolution and prevents connection exhaustion.

---

## 4. Known Limitations & Cloud Behaviors
*   **Render Free Tier Cold Starts**: Since the backend is hosted on Render’s free tier, the web service automatically spins down after 15 minutes of inactivity. The first API request after a sleep period can experience a spin-up delay of 40-50 seconds.
*   **Mock Session Token**: Admin authentication uses a persistent session token stored in `localStorage`. While secure route gates are enforced on the backend via authorization headers, integrating a stateful token server like JWT/OAuth2 would be the next step for production deployments.

---

## 5. Future Scope & Improvements
If given more time, the following enhancements would be added:
1.  **Regional SMS Notifications**: Integrate Twilio or a local SMS gateway to alert borrowers immediately in their selected language when their application is Approved or Rejected.
2.  **KYC Document Parsing (OCR)**: Introduce an upload field for Aadhaar or PAN card documents and use OCR libraries (like Tesseract.js) to auto-fill the borrower name and verify legal identities.
3.  **Role-Based Access Control (RBAC)**: Support multiple admin levels (e.g. Viewer, Risk Underwriter, Senior Approver) with granular permissions.
4.  **Advanced Analytics Views**: Add interactive charts (Recharts) to show loan demand trends, distribution of loans by regional languages, and average processing times.
5.  **Production-Grade Login & Registration**: Replace the pre-configured static credentials with a database-backed user authentication system, incorporating user registration tables, secure password hashing (using `bcrypt` salting), and session token management (signed JSON Web Tokens stored in secure `HttpOnly` cookies to protect against XSS).
