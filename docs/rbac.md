# RBAC (Role-Based Access Control) — CampusConnect

This document describes the simple RBAC model used by CampusConnect and how the admin role is expected to manage site data.

Roles
- admin — single or multiple users with privileged access. Admins can create/update/delete site-wide resources such as Events, News, Opportunities, Clubs, and Achievements. Admins also manage registrations and applications.
- student — regular site users who can view content, register for events, apply to opportunities, and join clubs.

Frontend expectations
- The UI shows admin-only features (e.g., the `Admin` nav item and `AdminPanel`) only when `user.role === 'admin'` and the user is authenticated. The `Navbar` component contains logic to show the `Admin` item for admin users.
- Admin forms in `js/components/AdminPanel.js` are scaffolds that call placeholder endpoints (e.g., `POST /api/admin/events`). Replace these endpoints with your backend routes.

Backend enforcement (required)
Frontend visibility is not sufficient — the backend must enforce RBAC for all protected endpoints. Examples:

1. Protect admin-only routes

Example middleware (Node/Express):

```js
function requireAdmin(req, res, next) {
  const user = req.user; // set by auth middleware
  if (!user || user.role !== 'admin') return res.status(403).json({ error: 'Forbidden' });
  next();
}
```

Use this middleware for routes that modify resources:

```js
app.post('/api/admin/events', requireAuth, requireAdmin, createEventHandler);
app.put('/api/admin/news/:id', requireAuth, requireAdmin, updateNewsHandler);
app.delete('/api/admin/opportunities/:id', requireAuth, requireAdmin, deleteOpportunityHandler);
```

2. Principle of least privilege
- Admins should only get the privileges they need. If you later add more roles (e.g., `moderator`, `organizer`), consider a `roles` table and a permissions model, or use an RBAC library.

3. Audit & logging
- Log admin actions (create/update/delete) with timestamps and actor id for auditability.

4. DB constraints & FK
- Use DB-level constraints and FK relationships to protect referential integrity (see `sql/schema_mysql.sql`). Enforce constraints that prevent unintended deletions (ON DELETE SET NULL or RESTRICT as appropriate).

Typical admin responsibilities (recommended)
- Create / edit / delete Events, News, Opportunities, Clubs, Achievements
- Manage EventRegistrations and OpportunityApplications (view, update status)
- Manage users (promote/demote, suspend, reset password)

Security notes
- Never trust client-provided role data. Always authenticate (sessions, JWT, etc.) and authorize on the server.
- Use HTTPS in production and a secure method to store DB credentials (env vars, secrets manager).
