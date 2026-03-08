# TrackMint — Personal Finance Tracker

> 🌐 **Live App:** _[Add hosted URL here]_

A full-stack personal finance tracking application to manage daily transactions, credit bills, and spending analytics — all in one place.

---

## Features

### 💸 Transactions

- Log daily cash transactions with amount, date, description, and category
- View transactions in a sortable, paginated data grid
- Add, edit, and delete transaction records

### 💳 Credits

- Track credit card bills and recurring dues
- Record billed date, payment date, last payment date, and paid status
- Toggle between transaction and credit views across the app

### 📊 Analytics

- Visualize spending trends with interactive charts (powered by Recharts)
- Toggle between transaction-based and credit-based analytics
- Filter and explore data by time periods

### 🗄️ Archive / Vault

- Access historical records of past transactions and credits
- Browse archived data organized by time

### 🏷️ Categories

- Create and manage custom categories for transactions and credits
- Assign color codes to categories for visual identification
- Categories are typed (`Cash` / `Credit`) to separate concerns

### 📧 Email Notifications (Automated)

- **Monthly summary email** — sent at the end of each month with a full table of transactions and total spend
- **Mid-month credit reminder** — sent on the 15th of each month listing upcoming credit bills due for payment
- Powered by `nodemailer` with configurable SMTP settings (Gmail, Mailtrap, etc.)

### ⚙️ Settings

- Manage categories from a dedicated settings page
- App-wide configuration accessible from the sidebar

---

## Tech Stack

| Layer                     | Technology                               |
| ------------------------- | ---------------------------------------- |
| **Frontend**              | React 19, TypeScript, Vite               |
| **UI Library**            | Material UI (MUI) v7, MUI X Data Grid    |
| **State / Data Fetching** | TanStack Query (React Query) v5, Zustand |
| **Forms**                 | React Hook Form, Zod validation          |
| **Charts**                | Recharts                                 |
| **Routing**               | React Router v7                          |
| **Backend**               | Fastify v4, TypeScript, Node.js          |
| **ORM**                   | Prisma v7                                |
| **Database**              | PostgreSQL (Supabase)                    |
| **Email**                 | Nodemailer (SMTP)                        |
| **Scheduler**             | node-cron                                |
| **API Docs**              | Swagger UI (`/docs`)                     |
| **Code Quality**          | Husky, lint-staged, Prettier             |

---

## Project Structure

```
finance_tracker/
├── backend/               # Fastify API server
│   ├── src/
│   │   ├── modules/
│   │   │   ├── transactions/   # Transaction CRUD
│   │   │   ├── credits/        # Credit CRUD
│   │   │   ├── analytics/      # Analytics endpoints
│   │   │   ├── archive/        # Archive / historical data
│   │   │   ├── categories/     # Category management
│   │   │   └── notifications/  # Email notification routes (dev only)
│   │   ├── config/         # Environment & logger config
│   │   └── plugins/        # Prisma plugin, error handler
│   └── prisma/
│       └── schema.prisma   # Database schema
├── frontend/              # React + Vite app ("TrackMint")
│   └── src/
│       ├── features/       # Feature-based modules (transactions, credits, analytics, etc.)
│       ├── api/            # Axios API clients
│       ├── components/     # Shared layout components
│       ├── store/          # Zustand global state
│       └── config/         # Theme, constants
├── seed.sql               # Database seed data
└── scripts/               # Pre-commit check utilities
```

---

## Getting Started

### Prerequisites

- Node.js ≥ 18
- PostgreSQL database (local or [Supabase](https://supabase.com))
- SMTP credentials for email notifications

### 1. Clone the repository

```bash
git clone https://github.com/Jayakrishna20/finance_tracker.git
cd finance_tracker
```

### 2. Install dependencies

```bash
# Root (husky / lint-staged)
npm install

# Backend
cd backend && npm install

# Frontend
cd ../frontend && npm install
```

### 3. Configure environment variables

Copy the example env file and fill in your values:

```bash
cp backend/.env.example backend/.env
```

```env
# Application
NODE_ENV=development
PORT=3000
HOST=0.0.0.0

# Database
DATABASE_URL="postgresql://user:password@host:5432/dbname"

# Email (SMTP)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your@gmail.com
SMTP_PASS=your_app_password
EMAIL_TO=recipient@email.com
```

### 4. Set up the database

```bash
cd backend
npm run db:push       # Push Prisma schema to the database
npm run db:generate   # Generate Prisma client
```

Optionally seed the database:

```bash
psql -d your_database -f seed.sql
```

### 5. Run locally

```bash
# In backend/
npm run dev

# In frontend/ (separate terminal)
npm run dev
```

- **Frontend:** http://localhost:5173
- **Backend API:** http://localhost:3000
- **API Docs (Swagger):** http://localhost:3000/docs

---

## API Endpoints

| Prefix                              | Description                            |
| ----------------------------------- | -------------------------------------- |
| `GET/POST/PUT/DELETE /transactions` | Manage daily transactions              |
| `GET/POST/PUT/DELETE /credits`      | Manage credit records                  |
| `GET /analytics`                    | Spending analytics data                |
| `GET /archive`                      | Historical / archived records          |
| `GET/POST/PUT/DELETE /categories`   | Category management                    |
| `POST /notifications/*`             | Trigger email notifications (dev only) |

> 📖 Full interactive API docs available at `/docs` when the backend is running.

---

## Email Notification Schedule

| Trigger            | Description                                        |
| ------------------ | -------------------------------------------------- |
| End of month       | Monthly transaction summary email with total spend |
| 15th of each month | Reminder email listing upcoming credit bills       |

---

## License

ISC
