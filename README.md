# ⚡ TaskFlow — Modern Task Management Frontend

A sleek, high-performance task management web application built with **React**, **Vite**, and custom **Vanilla CSS**, seamlessly integrated with a **FastAPI** backend.

![TaskFlow Screenshot Placeholder](https://raw.githubusercontent.com/kathirkamadurai29/Task_management-Frontend/main/public/preview.png)

---

## 🌟 Key Features

- **📋 Dynamic Kanban Board**:
  - 3 workflow columns: **Pending**, **In Progress**, and **Completed**.
  - HTML5 Drag-and-Drop support with optimistic UI updates and instant backend synchronization.
  - One-click quick advance actions directly from task cards.
  - Column-specific task creation.

- **📜 Structured List View**:
  - Tabular layout with inline task completion checkoffs and strikethrough animations.
  - Status filter pills (`All`, `Pending`, `In Progress`, `Completed`).
  - Multi-criteria sorting (Newest, Oldest, Title A-Z, Status).
  - Quick inline status modification dropdowns.

- **📊 Real-Time Analytics Dashboard**:
  - Live KPI cards consuming `GET /dashboard/` (`Total Workload`, `Pending Review`, `Active Sprints`, `Completed Tasks`, `Registered Users`).
  - Circular SVG radial velocity ring calculating efficiency percentage.
  - Segmented status breakdown progress bar.
  - One-click live synchronization.

- **🔐 FastAPI Authentication & Profile**:
  - OAuth2 Bearer JWT login (`POST /auth/login`).
  - User registration (`POST /auth/register`).
  - Profile retrieval (`GET /auth/me`) and session management.
  - One-click demo login helper (`testdev`).

- **🎨 Bespoke Vanilla CSS Design System**:
  - Dark mode by default with glowing accent borders, glassmorphic cards, and smooth micro-animations.
  - Light mode toggle.
  - Modern typography using Google Fonts (**Outfit** & **Plus Jakarta Sans**).
  - Zero heavy utility CSS frameworks (pure native CSS).

- **⚙️ Backend Health & Configuration**:
  - Real-time backend connectivity badge in the navigation bar.
  - Built-in settings modal to configure the API base URL and test connectivity to `/health`.

---

## 🛠️ Tech Stack

- **Frontend**: React 19, Vite, Vanilla CSS
- **Icons**: Lucide React
- **Backend Compatibility**: FastAPI (Python), Uvicorn, SQLite/PostgreSQL
- **Authentication**: OAuth2 Password Flow with Bearer JWT

---

## 🚀 Getting Started

### 1. Prerequisites
- **Node.js** (v18 or higher recommended)
- **FastAPI Backend** running at `http://127.0.0.1:8000` (or configured via settings)

### 2. Installation

Clone the repository and install dependencies:

```bash
git clone https://github.com/kathirkamadurai29/Task_management-Frontend.git
cd Task_management-Frontend
npm install
```

### 3. Running the Development Server

```bash
npm run dev
```

Open [http://localhost:5173/](http://localhost:5173/) in your browser.

### 4. Building for Production

```bash
npm run build
```

The production assets will be built in the `dist/` directory.

---

## 📁 Project Structure

```text
├── public/              # Static assets & favicon
├── src/
│   ├── components/      # UI components
│   │   ├── AuthModal.jsx / .css        # Login & Register modal
│   │   ├── DashboardView.jsx / .css    # Analytics & KPI dashboard
│   │   ├── KanbanBoard.jsx / .css      # 3-column Drag & Drop Kanban
│   │   ├── ListView.jsx / .css         # Filterable tabular task list
│   │   ├── Navbar.jsx / .css           # Top header & navigation
│   │   ├── SettingsModal.jsx / .css    # API URL & health check modal
│   │   ├── TaskCard.jsx / .css         # Individual task cards
│   │   ├── TaskModal.jsx / .css        # Task create & edit modal
│   │   └── Toast.jsx / .css            # Global notification toasts
│   ├── services/        # Backend communication layer
│   │   ├── api.js                      # Central HTTP client & JWT handling
│   │   ├── authService.js              # FastAPI auth endpoints
│   │   └── taskService.js              # FastAPI task CRUD & stats
│   ├── App.jsx / .css   # Main app coordinator & layout
│   ├── index.css        # Global CSS design tokens & reset
│   └── main.jsx         # React application entry point
├── index.html           # HTML template with Google Fonts
├── vite.config.js       # Vite configuration with backend proxy
└── package.json
```

---

## 🔗 Backend API Endpoints Expected

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/auth/login` | Form data login returning `{ access_token }` |
| `POST` | `/auth/register` | JSON registration `{ username, email, password }` |
| `GET` | `/auth/me` | Current user profile |
| `GET` | `/tasks/` | Fetch user task list |
| `POST` | `/tasks/` | Create task `{ title, description, assigned_to }` |
| `PUT` | `/tasks/{id}` | Update task `{ title, description, status, assigned_to }` |
| `DELETE` | `/tasks/{id}` | Delete task |
| `GET` | `/dashboard/` | KPI counts (`total_tasks`, `pending_tasks`, etc.) |
| `GET` | `/health` | Health check |
