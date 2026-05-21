# Campus Connect

Campus Connect is a lightweight full‑stack college management platform for students and administrators. It helps students discover and register for events, apply to clubs, save opportunities, and share achievements. Administrators can manage content and review applications through a role‑based admin panel.

Short summary: Events, Clubs, News & Opportunities portal — React frontend, Node.js + Express backend, SQLite for easy local development.

---

## Quick Start (local)

Prerequisites:
- Node.js v14+
- Python 3.x (for a simple static server) or any static file server

Commands:
```powershell
# Backend
cd server
npm install
node seed.js        # initialize and seed the database
$env:PORT=5000; node index.js

# Frontend (new terminal, project root)
cd ..
python -m http.server 8080
# Open http://localhost:8080 in your browser
```

Demo accounts (for testing):
- Admin: admin@college.edu  /  admin123
- Student: student@college.edu  /  student123

---

## What users can do

- Students: browse and register for events, apply to clubs, save opportunities, like achievements, view dashboard
- Admins: create/edit/delete content (events, clubs, news, opportunities, achievements), review applications and registrations, manage approvals

---

## Key Features

- Event listing and registrations
- Club applications and admin approval workflow
- Opportunities hub with save/unsave
- Achievements with like/unlike
- Role-based access control (RBAC) for admin routes
- Seed script for demo data and easy local testing

---

## Project Structure (important files)

- `index.html` — frontend entry
- `js/` — React components and app logic
- `server/index.js` — Express API server
- `server/db.js` — database helpers and schema
- `server/seed.js` — seed script with sample data
- `server/middleware/auth.js` — simple auth / RBAC checks

---

## API (overview)

Public endpoints: `GET /api/events`, `GET /api/clubs`, `GET /api/news`, `GET /api/opportunities`, `GET /api/achievements`

Authenticated (student) actions: register for events, apply to clubs, save opportunities, like achievements

Admin actions: CRUD for events, clubs, news, opportunities, achievements and endpoints to review/approve applications

Refer to server routes in `server/` for full list.

---

## Security notes (dev → prod)

This project uses simple development auth (client-side / header role checks). For production you should add:

- JWT authentication and HTTP‑only cookies
- Password hashing (bcrypt)
- HTTPS and environment secrets
- Input validation and rate limiting

See `docs/rbac.md` for guidance.

---

## More info (quick)

- Tech stack: React (frontend), Tailwind CSS, Node.js + Express (backend), sql.js / SQLite (database)
- Backend: runs on port `5000` (see `server/index.js`). Frontend: static files served on `8080` for local testing.
- Run `node seed.js` in `server/` to create demo data (users, events, clubs, opportunities, achievements).

---
## Contributing

Fork → branch (`feature/your-feature`) → PR. Follow the existing code style and update documentation for any breaking changes.

---

## License

MIT — see the `LICENSE` file.

---
