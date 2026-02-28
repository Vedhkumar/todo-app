# Todo App

A full-stack todo app: **React + Vite** frontend, **Node.js/Express** REST API backend, and **PostgreSQL** database.

## Project Structure

```
todo-app/
├── backend/          # Node.js + Express API (port 3001)
├── frontend/         # React + Vite app (port 5173)
└── docker-compose.yml  # PostgreSQL 16
```

## Requirements

- [Node.js](https://nodejs.org/) ≥ 18
- [Docker](https://www.docker.com/) (for PostgreSQL)

## Quick Start

### 1. Start the database

```bash
docker compose up -d
```

### 2. Start the backend

```bash
cd backend
npm run dev
# → http://localhost:3001
```

### 3. Start the frontend

```bash
cd frontend
npm run dev
# → http://localhost:5173
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## API Reference

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/todos` | List all todos |
| `POST` | `/api/todos` | Create a todo `{ title }` |
| `PUT` | `/api/todos/:id` | Update `{ title?, completed? }` |
| `DELETE` | `/api/todos/:id` | Delete a todo |

## Features

- ✅ Add todos
- ✅ Mark as complete (checkbox)
- ✅ Double-click to edit a todo inline
- ✅ Delete todos
- ✅ Persisted in PostgreSQL
