# Campus Connect

Campus Connect is a React + TypeScript + Vite campus portal with an Express REST API and MySQL 8 database.

## Features

- Role-aware registration and login backed by MySQL; passwords are hashed with bcrypt and API sessions use signed JWTs.
- REST API for profiles, lost & found, notices, clubs, events and registrations, marketplace listings, notifications and admin statistics.
- Docker Compose setup for the web app, API and persistent MySQL database.
- Health endpoint: `/api/health`.

> **Important:** The existing UI still contains demo/static content in several dashboard modules. Authentication and registration use the API; use the documented API endpoints for database-backed module operations, or extend the UI integration before treating every screen as production-ready. The original `campus_connect_backup.sql` is a MySQL system-schema dump and is not used by this application. The clean application schema is `server/sql/init.sql`.

## Run with Docker (recommended)

Requirements: Docker Engine/Desktop with Compose v2.

1. Copy `.env.example` to `.env`.
2. Set unique, strong values for `DB_PASSWORD`, `MYSQL_ROOT_PASSWORD`, and `JWT_SECRET` (32+ random characters for the JWT secret). Do not commit `.env`.
3. Start the stack:

   ```bash
   docker compose up --build -d
   ```

4. Open `http://localhost:8080`.
5. Check API/database health at `http://localhost:8080/api/health`.
6. Stop services with `docker compose down`. Database data remains in the `campus_mysql_data` volume. To delete all database data, use `docker compose down -v` (destructive).

MySQL is not exposed publicly by default. The web container proxies `/api/*` to the API container.

## Local development

Requirements: Node.js 20+, npm, MySQL 8.4+.

1. Create the database and tables by running `server/sql/init.sql` as a MySQL administrator.
2. Create `server/.env` (or export environment variables): `DB_HOST=127.0.0.1`, `DB_PORT=3306`, `DB_NAME=campus_connect`, `DB_USER=campus_user`, `DB_PASSWORD=...`, `JWT_SECRET=...`, `PORT=3000`.
3. Install and start the API:

   ```bash
   cd server
   npm install
   npm run dev
   ```

4. In another terminal, at the repository root:

   ```bash
   npm ci
   npm run dev
   ```

Vite runs on port 5173. Set `VITE_API_BASE_URL=http://localhost:3000/api` in a root `.env.local` if you are not using the Docker/Nginx same-origin proxy. Set `CORS_ORIGIN=http://localhost:5173` for the API.

## API overview

- `POST /api/auth/register` — create student, co-admin or staff account
- `POST /api/auth/login` — authenticate with email/username (staff can use phone), password and role
- `GET /api/auth/me`, `PATCH /api/profile` — current user/profile (Bearer token)
- `GET/POST /api/items`, `PATCH /api/items/:id/status` — lost & found
- `GET/POST /api/notices`, `DELETE /api/notices/:id` — notices
- `GET /api/clubs`, `GET/POST /api/events`, `POST/DELETE /api/events/:id/register` — clubs/events
- `GET/POST /api/marketplace`, `DELETE /api/marketplace/:id` — marketplace
- `GET /api/notifications`, `PATCH /api/notifications/:id/read` — notifications
- `GET /api/admin/stats` — administrator statistics

Protected endpoints require `Authorization: Bearer <token>`. Public registration intentionally does not permit creating an admin account. To provision one locally after configuring the server environment, run `cd server && npm run create-admin -- "Admin Name" admin@example.edu adminuser "A-Strong-Password-12+"`. Keep the command and credentials private. Do not deploy with example/default secrets.

## Deployment notes

The supplied Dockerfiles build the frontend and API separately; Compose orchestrates MySQL. For a public deployment, use HTTPS through a reverse proxy or platform ingress, set strong secrets, configure a specific `CORS_ORIGIN`, set up automated database backups, and use managed secrets. Schema initialization scripts run only when MySQL initializes an empty data directory. For later schema changes, use migrations rather than expecting the init script to rerun.
