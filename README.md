# Team Task Manager

A collaborative, full-stack web application that enables teams to create projects, manage tasks, assign work to team members, and track overall progress — all through a clean, role-aware interface.

## 🔗 Links

- **Live URL:** [Railway Deployment](https://your-app.railway.app)
- **GitHub:** [Repository](https://github.com/your-username/team-task-manager)

## ⚡ Tech Stack

| Layer | Technology |
|-------|-----------|
| Runtime | Node.js 20 LTS |
| Framework | Express 5 |
| ORM | Prisma 5 |
| Database | PostgreSQL 16 |
| Auth | JWT + bcrypt |
| Validation | Zod |
| Frontend | React 18 + Vite |
| Styling | Vanilla CSS (Premium Dark Theme) |
| HTTP Client | Axios |
| Server State | TanStack Query 5 |
| Deployment | Railway |

## 🚀 Local Setup

```bash
# 1. Clone the repo
git clone https://github.com/your-username/team-task-manager.git
cd team-task-manager

# 2. Setup backend
cd backend
npm install
cp .env.example .env
# Edit .env with your PostgreSQL connection string

# 3. Run migrations
npx prisma migrate dev

# 4. Seed demo data
npm run seed

# 5. Start backend
npm run dev

# 6. Setup frontend (new terminal)
cd ../frontend
npm install
npm run dev
```

## 🔐 Demo Credentials

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@teamtask.com | Admin@123 |
| Member | member@teamtask.com | Member@123 |
| Member | jane@teamtask.com | Member@123 |

## 📡 API Documentation

Base URL: `/api/v1`

### Auth
- `POST /auth/signup` — Register new user
- `POST /auth/login` — Login
- `GET /auth/me` — Get current user (requires auth)

### Projects
- `GET /projects` — List user's projects
- `POST /projects` — Create project (admin)
- `GET /projects/:id` — Project detail
- `PUT /projects/:id` — Update project (admin)
- `DELETE /projects/:id` — Delete project (admin)
- `GET /projects/:id/members` — List members
- `POST /projects/:id/members` — Invite member (admin)
- `DELETE /projects/:id/members/:uid` — Remove member (admin)

### Tasks
- `GET /projects/:id/tasks` — List tasks (supports filters)
- `POST /projects/:id/tasks` — Create task
- `GET /tasks/:taskId` — Get task detail
- `PUT /tasks/:taskId` — Update task
- `PATCH /tasks/:taskId/status` — Update status
- `DELETE /tasks/:taskId` — Delete task (admin)

### Dashboard
- `GET /dashboard` — Aggregated dashboard data

## 🏗️ Architecture

Three-tier architecture: React SPA → Node.js/Express REST API → PostgreSQL

### Roles
- **Admin:** Full CRUD on projects/tasks, member management
- **Member:** View projects, create/update own tasks

## ⚠️ Known Limitations

- No real-time WebSocket updates (polling/manual refresh)
- No email notifications for invites
- No file attachments on tasks
- Comments feature is P2 (schema ready, API pending)

## 🗺️ Future Roadmap

- [ ] WebSocket for real-time updates
- [ ] Email notifications
- [ ] Task comments
- [ ] File attachments
- [ ] Kanban board view
- [ ] Activity logs
