# 🚀 Team Task Manager — Enterprise-Grade Collaboration Platform

A sophisticated, production-ready full-stack application designed for seamless team collaboration. Manage projects, coordinate tasks, and track team performance through a premium, role-based dashboard.

[![Live Demo](https://img.shields.io/badge/Live%20Demo-Online-brightgreen)](https://team-task-manager.up.railway.app/)
[![GitHub Repo](https://img.shields.io/badge/GitHub-Repository-blue)](https://github.com/avinash-kumar-101/team-task-manager)

---

## 🌟 Core Features

- **🛡️ Secure Authentication:** Industrial-strength JWT & bcrypt security with role-aware session management.
- **🏗️ Workspace Management:** Create and manage multiple projects with granular member invitations.
- **✅ Task Lifecycle:** Full task management with priority levels (Low/Medium/High) and real-time status tracking (Todo/In Progress/Done).
- **📊 Intelligence Dashboard:** Aggregated data visualization showing task distribution, project health, and overdue warnings.
- **📱 Responsive UI:** Premium dark-themed interface built with glassmorphism, fully optimized for Desktop, Tablet, and Mobile.
- **🗄️ Real Data Persistence:** Integrated with a production-grade PostgreSQL database on Railway for persistent storage.

---

## 🔐 Reviewer Credentials (Demo Accounts)

To explore all role-based features, you can use the following pre-configured accounts:

| Role | Name | Email | Password |
|------|------|-------|----------|
| **Admin** | Avinash Admin | `avinash@admin.com` | `Password@123` |
| **Admin** | Team Lead | `lead@admin.com` | `Password@123` |
| **Member** | Rahul Dev | `rahul@member.com` | `Password@123` |
| **Member** | Sneha UI | `sneha@member.com` | `Password@123` |

> [!TIP]
> **Admin accounts** can create projects and invite members. **Member accounts** can manage tasks within assigned projects.

---

## ⚡ Technical Architecture

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Frontend** | React 18 + Vite | Blazing fast SPA with stateful navigation |
| **Styling** | Vanilla CSS | Custom "Premium Dark" design system (No bloat) |
| **Backend** | Express 5 | High-performance RESTful API architecture |
| **ORM** | Prisma 5 | Type-safe database interactions and migrations |
| **Database** | PostgreSQL | Enterprise-grade relational data storage |
| **Hosting** | Railway | Continuous deployment with auto-scaling |

---

## 📡 API Ecosystem

The backend exposes a comprehensive RESTful API at `/api/v1`:

### Authentication
- `POST /auth/signup` — Direct signup with role support
- `POST /auth/login` — Session creation
- `GET /auth/me` — Secure profile retrieval

### Project Operations
- `GET /projects` — Workspace listing
- `POST /projects` — Initialize new project (Admin Only)
- `POST /projects/:id/members` — Team invitation (Admin Only)

### Task Operations
- `GET /projects/:id/tasks` — Task board listing
- `POST /projects/:id/tasks` — New task assignment
- `PATCH /tasks/:taskId/status` — Instant status update

---

## 🛠️ Local Development

```bash
# 1. Clone & Install
git clone https://github.com/avinash-kumar-101/team-task-manager.git
cd team-task-manager

# 2. Environment Setup
# Create .env in /backend with DATABASE_URL="postgresql://..."

# 3. Database Sync
cd backend
npx prisma db push

# 4. Run Development Servers
# Start Backend: npm run dev (Port 5000)
# Start Frontend: cd ../frontend && npm run dev (Port 5173)
```

---

Designed and Developed by **Avinash Kumar** 💻
