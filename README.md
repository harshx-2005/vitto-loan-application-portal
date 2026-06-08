# Vitto | Multilingual Loan Application Portal

Vitto is a modern full-stack multilingual Loan Application Portal built for a fintech company. It consists of an interactive borrower submission form and an enterprise-grade operations dashboard for underwriting management.

---

## ⚡ Live Deployments (Placeholders)
- **Frontend Client**: [https://vitto-loanapp.vercel.app](https://vitto-loanapp.vercel.app)
- **Backend API Service**: [https://vitto-loanapp.onrender.com](https://vitto-loanapp.onrender.com)

---

## 🔑 Evaluator Access (Admin Credentials)
To test and evaluate the administrative operations dashboard (`/dashboard`), please use the following pre-configured credentials:
*   **Email Address**: `admin@example.com`
*   **Secret Key / Password**: `admin@vitto`

*(Note: An "Autofill Credentials" helper button is also provided on the sign-in screen to populate these automatically).*

---

## 🛠️ Technology Stack

### Frontend
- **React.js & Vite**: Fast development server and static build output.
- **Tailwind CSS**: Utility-first CSS for premium responsive styling.
- **TanStack Query (React Query) v5**: Zero-reload client caching and instant cache invalidations.
- **Axios**: Standardized HTTP client.
- **React Hook Form**: Form state tracking and input event listeners.
- **Zod**: Declarative type-safe client-side forms schema validation.
- **Lucide React**: Clean vector icon pack.

### Backend
- **Node.js & Express**: Secure rest service routing and controllers.
- **Prisma ORM**: Modern database queries with type safety.
- **CORS**: Domain resource-sharing policy enforcement.
- **Helmet**: Multi-header security policy compliance.
- **Morgan**: HTTP developer logging.
- **Zod**: Reusable validation middleware.

### Database
- **PostgreSQL**: Managed server on Neon database cluster.

---

## 📁 Repository Directory Structure

```
vitto-loan-portal/
├── render.yaml                   # Render Blueprint blueprint specification
├── backend/
│   ├── migrations/
│   │   └── 001_init.sql          # Raw SQL DDL structure definitions
│   ├── prisma/
│   │   └── schema.prisma         # Prisma ORM schema models
│   ├── src/
│   │   ├── config/
│   │   │   └── db.js             # Prisma client connection manager
│   │   ├── controllers/
│   │   │   └── applicationController.js # Endpoint routing controller logic
│   │   ├── middleware/
│   │   │   ├── errorHandler.js   # Centralized JSON error formatting
│   │   │   └── validationMiddleware.js # Zod JSON payload validator
│   │   ├── routes/
│   │   │   └── applicationRoutes.js # Express router path definitions
│   │   ├── services/
│   │   │   └── applicationService.js # Database execution operations & Reference generator
│   │   ├── validators/
│   │   │   └── applicationValidator.js # Application status Zod schemas
│   │   ├── app.js                # App middleware config
│   │   └── server.js             # HTTP Server entry listener
│   ├── .env.example
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Badge.jsx         # Status and category pills
│   │   │   ├── Card.jsx          # Rounded container layouts
│   │   │   ├── EmptyState.jsx    # Custom drawing placeholder for lists
│   │   │   └── Skeleton.jsx      # Loading pulses for cards & tables
│   │   ├── constants/
│   │   │   └── languages.js      # Language configs and badge styles
│   │   ├── hooks/
│   │   │   ├── useRoute.jsx      # Lightweight SPA history tracker
│   │   │   └── useToast.jsx      # Floating feedback alerts provider
│   │   ├── layouts/
│   │   │   └── Navbar.jsx        # Navigation header
│   │   ├── pages/
│   │   │   ├── ApplyPage.jsx     # Loan application form
│   │   │   └── DashboardPage.jsx # Analytics metrics and applications list
│   │   ├── services/
│   │   │   └── api.js            # Axios endpoint integrations
│   │   ├── utils/
│   │   │   └── formatters.js     # Currency (₹) and Date formatting utilities
│   │   ├── App.jsx               # App layout controller
│   │   ├── index.css             # Main styling entry (Tailwind imports)
│   │   └── main.jsx              # React mounting logic
│   ├── .env.example
│   ├── index.html
│   ├── package.json
│   ├── postcss.config.js
│   ├── tailwind.config.js
│   ├── vercel.json
│   └── vite.config.js
└── README.md
```

---

## ⚙️ Environment Variables

### Backend Configuration (`backend/.env`)
Create a file named `.env` in the `backend/` directory:
```env
DATABASE_URL="postgresql://username:password@localhost:5432/vitto_loans?schema=public"
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
```

### Frontend Configuration (`frontend/.env`)
Create a file named `.env` in the `frontend/` directory:
```env
VITE_API_URL=http://localhost:5000/api
```

---

## 🛠️ Local Development Setup

### Prerequisites
- Node.js installed (v18.0.0 or higher recommended)
- A running PostgreSQL database instance (Neon or Local PostgreSQL)

### 1. Repository Setup & Dependency Installation
Open your terminal and install dependencies for both the backend and frontend:

**Backend Setup:**
```bash
cd backend
npm install
```

**Frontend Setup:**
```bash
cd ../frontend
npm install
```

### 2. Database Sync & Migrations
Ensure your PostgreSQL instance is running and your `DATABASE_URL` is set inside `backend/.env`.

Sync your schema model declarations directly to your PostgreSQL database:
```bash
cd ../backend
npx prisma db push
```
*(Optionally run raw SQL scripts from `backend/migrations/001_init.sql` directly on the database using psql or PgAdmin).*

Generate the internal Prisma Client client:
```bash
npx prisma generate
```

### 3. Running the Application locally

**Start the Backend Server (with hot reloading):**
```bash
# In backend/ directory
npm run dev
```
The API should now be running on [http://localhost:5000](http://localhost:5000).

**Start the Frontend Client Dev Server:**
```bash
# In frontend/ directory
npm run dev
```
The Client should now be running on [http://localhost:5173](http://localhost:5173). Open this URL in your web browser.

---

## 📈 REST API Documentation

### 1. Submit Loan Application
- **Path**: `POST /api/applications`
- **Headers**: `Content-Type: application/json`
- **Request Body**:
  ```json
  {
    "name": "Arjun Kumar",
    "mobile": "9876543210",
    "amount": 75000,
    "purpose": "Business expansion and digital payment integration",
    "language": "Tamil"
  }
  ```
- **Success Response (201 Created)**:
  ```json
  {
    "success": true,
    "message": "Loan application submitted successfully",
    "data": {
      "id": "270db1f8-9a4f-4d92-8051-40916a2b8e3a",
      "applicationReference": "VIT-2026-00001"
    }
  }
  ```

### 2. List All Applications (Latest first)
- **Path**: `GET /api/applications`
- **Query Filters**: `status` (optional: `pending`, `approved`, `rejected`)
- **Success Response (200 OK)**:
  ```json
  {
    "success": true,
    "message": "Applications retrieved successfully",
    "data": [
      {
        "id": "270db1f8-9a4f-4d92-8051-40916a2b8e3a",
        "applicationReference": "VIT-2026-00001",
        "name": "Arjun Kumar",
        "mobile": "9876543210",
        "amount": "75000.00",
        "purpose": "Business expansion and digital payment integration",
        "language": "Tamil",
        "status": "pending",
        "createdAt": "2026-06-08T20:29:01.000Z",
        "updatedAt": "2026-06-08T20:29:01.000Z"
      }
    ]
  }
  ```

### 3. Update Application Underwriting Status
- **Path**: `PATCH /api/applications/:id/status`
- **Headers**: `Content-Type: application/json`
- **Request Body**:
  ```json
  {
    "status": "approved"
  }
  ```
- **Success Response (200 OK)**:
  ```json
  {
    "success": true,
    "message": "Application status updated to 'approved' successfully",
    "data": {
      "id": "270db1f8-9a4f-4d92-8051-40916a2b8e3a",
      "applicationReference": "VIT-2026-00001",
      "name": "Arjun Kumar",
      "mobile": "9876543210",
      "amount": "75000.00",
      "purpose": "Business expansion and digital payment integration",
      "language": "Tamil",
      "status": "approved",
      "createdAt": "2026-06-08T20:29:01.000Z",
      "updatedAt": "2026-06-08T20:29:01.000Z"
    }
  }
  ```

### 4. Get Analytics Summary
- **Path**: `GET /api/summary`
- **Success Response (200 OK)**:
  ```json
  {
    "success": true,
    "message": "Analytics summary retrieved successfully",
    "data": {
      "totalApplications": 12,
      "totalLoanAmount": 1250000,
      "pendingCount": 4,
      "approvedCount": 6,
      "rejectedCount": 2
    }
  }
  ```

---

## 🚀 Deployment Instructions

### 1. Database Configuration (Supabase PostgreSQL)
Since you are using **Supabase** as your database backend:
1. Go to your **Supabase Dashboard** -> Project Settings -> Database.
2. Under the Connection String section, copy the **Transaction** connection URI (port `6543` for connection pooler or port `5432` for direct connection).
3. This URI should look like:
   `postgresql://postgres:[password]@db.[project-id].supabase.co:6543/postgres?pgbouncer=true`
4. You will paste this string as the `DATABASE_URL` environment variable on Render.

---

### 2. Backend Deployment (Render)
1. Sign up or log in at [Render.com](https://render.com).
2. Click **New +** -> **Blueprint**.
3. Connect your GitHub repository containing the codebase.
4. Render will automatically parse the `render.yaml` file in the root and configure the backend web service.
5. In the blueprint setup page:
   - Paste your copied Supabase Connection String for the **`DATABASE_URL`** variable.
   - Input your Vercel frontend URL for the **`FRONTEND_URL`** variable (e.g. `https://vitto-loanapp.vercel.app`).
   - Click **Apply**. Render will automatically build the service, install dependencies, compile the Prisma client (`npx prisma generate`), push changes to your Supabase instance, and launch the server.

---

### 3. Frontend Deployment (Vercel)
1. Sign up or log in at [Vercel.com](https://vercel.com).
2. Click **Add New** -> **Project** -> select your connected repository.
3. In the project configure settings:
   - Set **Framework Preset** to `Vite`.
   - Set **Root Directory** to `frontend`.
4. Open the **Environment Variables** section and add:
   - `VITE_API_URL` -> Set to your deployed Render API base URL (e.g. `https://vitto-backend.onrender.com/api`).
5. Click **Deploy**. Vercel will build your static SPA assets, and client-side page routing will be handled seamlessly via `vercel.json`.
