# Notes App — Setup Guide

This guide walks you through running the Notes App on your computer from scratch. No programming experience required.

---

## What you will need

Before you start, make sure the following tools are installed on your machine. Each item links to a free download.

| Tool                       | Why it's needed                                       | Download                                       |
| -------------------------- | ----------------------------------------------------- | ---------------------------------------------- |
| **Node.js** (v20 or later) | Runs the application code                             | https://nodejs.org                             |
| **pnpm**                   | Downloads and manages all the libraries the app needs | https://pnpm.io/installation                   |
| **Docker Desktop**         | Runs the database in an isolated container            | https://www.docker.com/products/docker-desktop |

> **How to check if a tool is already installed:** Open a Terminal (Mac/Linux) or Command Prompt (Windows), type the command below, and press Enter. If you see a version number, you're good.
>
> ```
> node --version
> pnpm --version
> docker --version
> ```

---

## Step 1 — Open a terminal in the right folder

1. Open **Terminal** (Mac/Linux) or **Command Prompt** (Windows).
2. Navigate to the `notes-app` folder inside this project:

```
cd path/to/full-stack-challenge/notes-app
```

Replace `path/to/` with the actual location where you saved the project. For example:

```
cd ~/Desktop/full-stack-challenge/notes-app
```

---

## Step 2 — Create your environment files

The app needs a few local config files. Templates are already included.

**1. Root file (used by Docker Compose)**

```
cp .env.example .env
```

This file defines the PostgreSQL credentials Docker will use:

| Variable            | Default value |
| ------------------- | ------------- |
| `POSTGRES_USER`     | `notes`       |
| `POSTGRES_PASSWORD` | `notes`       |
| `POSTGRES_DB`       | `notesdb`     |

**2. API file (used by the backend)**

```
cp apps/api/.env.example apps/api/.env
```

The default values work out of the box for a standard local setup — no editing required.

**3. Frontend file (used by the web app)**

```
cp apps/frontend/.env.example apps/frontend/.env.local
```

The default value also works out of the box (`NEXT_PUBLIC_API_URL=http://localhost:3001`).

---

## Step 3 — Start the database

1. **Open Docker Desktop** and wait until the menu bar whale icon says it is running:

```
open -a Docker
```

2. Confirm Docker and Compose are available:

```
docker --version
docker compose version
```

3. Start the database:

```
docker compose up -d
```

> **If you get `unknown shorthand flag: 'd' in -d`**, Docker Desktop is not running yet, or the Compose plugin is missing. Open Docker Desktop, wait 30 seconds, then try again. As a fallback you can use:
>
> ```
> docker-compose up -d
> ```

This downloads a PostgreSQL 16 image and starts it in the background. You should see output like:

```
✔ Container notes-app-db-1  Started
```

The database listens on **port 5432** and keeps its data between restarts (stored in a Docker volume called `pgdata`).

> You only need to run `docker compose up -d` once per session. Docker Desktop must be running whenever you use the app.

---

## Step 4 — Install all dependencies

Run the following command to download all the libraries the app needs:

```
pnpm install
```

This may take a minute or two the first time.

> **If you see `[ERR_PNPM_IGNORED_BUILDS]`**, pnpm is asking which packages are allowed to run install scripts. This project already pre-approves them in `pnpm-workspace.yaml`, so a normal `pnpm install` should work. If you are still prompted, run:
>
> ```
> pnpm approve-builds --all
> ```
>
> Then run `pnpm install` again.

---

## Step 5 — Set up the database tables

Run the database migration to create the tables the app uses:

```
pnpm --filter api exec prisma migrate deploy
```

You should see:

```
All migrations have been applied.
```

---

## Step 6 — Start the app

Start both the backend API and the frontend at the same time:

```
pnpm dev
```

You will see log lines from both services. When you see output like:

```
▲ Next.js ready on http://localhost:3000
```

the app is running.

---

## Step 7 — Open the app in your browser

Go to **http://localhost:3000** in any browser (Chrome, Firefox, Safari, Edge).

You should see the Notes App with a sidebar on the left and an editor on the right. You can now:

- **Create a note** — click the **New** button in the sidebar header.
- **Edit a note** — click any note in the sidebar to open it, then type in the editor.
- **Save a note** — click the **Save** button when you are done editing.
- **Search notes** — type in the search bar at the top of the sidebar.
- **Delete a note** — click **Delete** and confirm.

---

## Stopping the app

To stop everything:

1. Press **Ctrl + C** in the terminal where `pnpm dev` is running.
2. Stop the database container:

```
docker compose down
```

To also remove the stored database data:

```
docker compose down -v
```

---

## Deploying to production (Vercel + Render + Neon)

The app has three parts in production:

| Service               | Host                         | Free tier            |
| --------------------- | ---------------------------- | -------------------- |
| Frontend (Next.js)    | [Vercel](https://vercel.com) | Yes (`*.vercel.app`) |
| API (Express)         | [Render](https://render.com) | Yes                  |
| Database (PostgreSQL) | [Neon](https://neon.tech)    | Yes                  |

### 1 — Create a cloud database (Neon)

1. Create a free Neon project and copy the **connection string**.
2. It should look like: `postgresql://user:pass@host/db?sslmode=require`

### 2 — Deploy the API (Render)

1. Push this repo to GitHub.
2. In Render, create a **Blueprint** from `render.yaml` (or a **Web Service** manually).
3. Set the **Root Directory** to `notes-app` if your repo contains the monorepo root above it.
4. Add environment variables:

| Variable       | Value                                                       |
| -------------- | ----------------------------------------------------------- |
| `DATABASE_URL` | Your Neon connection string                                 |
| `CORS_ORIGIN`  | `https://your-app.vercel.app,https://your-app-*.vercel.app` |

Render runs `prisma migrate deploy` automatically on each deploy (see `releaseCommand` in `render.yaml`).

Copy your API URL when done (e.g. `https://notes-api.onrender.com`).

### 3 — Deploy the frontend (Vercel)

1. Import the repo in Vercel.
2. Set **Root Directory** to `notes-app/apps/frontend`.
3. Vercel reads `vercel.json` for monorepo install/build commands.
4. Add environment variable:

| Variable              | Value               |
| --------------------- | ------------------- |
| `NEXT_PUBLIC_API_URL` | Your Render API URL |

Deploy — you will get a `https://your-app.vercel.app` URL.

### 4 — Verify

1. Open `https://your-api.onrender.com/health` — should return `{"status":"ok"}`.
2. Open your Vercel URL — create, edit, search, and delete notes.

---

## Troubleshooting

| Problem                                     | Solution                                                                                                                                                                                       |
| ------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `pnpm: command not found`                   | Install pnpm: `npm install -g pnpm`                                                                                                                                                            |
| `docker: command not found`                 | Install and open Docker Desktop first                                                                                                                                                          |
| `unknown shorthand flag: 'd' in -d`         | Open Docker Desktop (`open -a Docker`), wait until it is running, then retry. Or use `docker-compose up -d`                                                                                    |
| `[ERR_PNPM_IGNORED_BUILDS]`                 | Run `pnpm approve-builds --all`, then `pnpm install` again                                                                                                                                     |
| `No migration found` or Prisma drift errors | Make sure Docker is running, then run `pnpm --filter api exec prisma migrate deploy`. If you previously used `db push`, reset with `pnpm --filter api exec prisma migrate reset` and try again |
| Database connection error                   | Make sure Docker Desktop is running, you ran `docker compose up -d`, and `apps/api/.env` has the correct `DATABASE_URL` (`postgresql://notes:notes@localhost:5432/notesdb`)                    |
| Port 3000 already in use                    | Kill the process using it or change the port in `apps/frontend/.env.local`                                                                                                                     |
| Blank page after opening the browser        | Wait 5 seconds and refresh — Next.js may still be compiling                                                                                                                                    |
| API requests fail in production             | Check `NEXT_PUBLIC_API_URL` on Vercel and `CORS_ORIGIN` on Render include your Vercel domain                                                                                                   |
| Render deploy fails on migrations           | Verify `DATABASE_URL` is correct and the Neon database is reachable                                                                                                                            |

---

## Project structure (for the curious)

```
notes-app/
├── apps/
│   ├── frontend/   ← Next.js web interface (deploy to Vercel)
│   └── api/        ← Express backend API (deploy to Render)
├── packages/
│   └── types/      ← Shared TypeScript types used by both apps
├── docker-compose.yml   ← Local PostgreSQL only
├── render.yaml          ← Render API deployment config
└── apps/frontend/vercel.json  ← Vercel monorepo config
```
