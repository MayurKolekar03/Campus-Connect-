// db.js - comprehensive DB wrapper with CRUD for all tables
const fs = require('fs');
const path = require('path');
const initSqlJs = require('sql.js');

const DB_FILE = path.join(__dirname, 'database.sqlite');
const MIGRATION_FILE = path.join(__dirname, 'migrations', 'init.sql');

async function createDb() {
  const SQL = await initSqlJs();
  let db;

  if (fs.existsSync(DB_FILE)) {
    const data = fs.readFileSync(DB_FILE);
    db = new SQL.Database(new Uint8Array(data));
  } else {
    db = new SQL.Database();
    if (fs.existsSync(MIGRATION_FILE)) {
      const sql = fs.readFileSync(MIGRATION_FILE, 'utf8');
      const stmts = sql.split(/;\s*\n/).map(s => s.trim()).filter(Boolean);
      for (const s of stmts) db.run(s);
    }
    persist(db);
  }

  function persist(database) {
    const data = database.export();
    fs.writeFileSync(DB_FILE, Buffer.from(data));
  }

  function rowsToObjects(result) {
    if (!result || !result[0]) return [];
    const { values, columns } = result[0];
    return values.map(row => {
      const obj = {};
      row.forEach((val, i) => obj[columns[i]] = val);
      return obj;
    });
  }

  return {
    exec(sql) { return db.exec(sql); },
    run(sql, params) { db.run(sql, params); persist(db); },
    
    // Users
    createUser(user) {
      const stmt = db.prepare('INSERT INTO users (name, email, password, role, studentId, adminId, college, year, department) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)');
      stmt.run([user.name, user.email, user.password, user.role || 'student', user.studentId || null, user.adminId || null, user.college || null, user.year || null, user.department || null]);
      stmt.free();
      persist(db);
      const res = db.exec('SELECT last_insert_rowid() as id');
      const userId = res[0].values[0][0];
      console.log('📝 Created user with ID:', userId);
      return userId;
    },
    getUserByEmail(email) {
      const res = db.exec(`SELECT * FROM users WHERE email = '${email}'`);
      const rows = rowsToObjects(res);
      return rows[0] || null;
    },
    getUserById(id) {
      console.log('🔍 Looking for user with ID:', id);
      const res = db.exec(`SELECT * FROM users WHERE id = ${id}`);
      console.log('📊 Query result:', res);
      const rows = rowsToObjects(res);
      console.log('👤 Converted rows:', rows);
      return rows[0] || null;
    },
    updateUser(id, fields) {
      const sets = [];
      const vals = [];
      if (fields.name) { sets.push('name = ?'); vals.push(fields.name); }
      if (fields.college) { sets.push('college = ?'); vals.push(fields.college); }
      if (fields.year) { sets.push('year = ?'); vals.push(fields.year); }
      if (fields.department) { sets.push('department = ?'); vals.push(fields.department); }
      if (fields.skills) { sets.push('skills = ?'); vals.push(fields.skills); }
      if (fields.studentId) { sets.push('studentId = ?'); vals.push(fields.studentId); }
      if (sets.length === 0) return;
      const stmt = db.prepare(`UPDATE users SET ${sets.join(', ')} WHERE id = ?`);
      stmt.run([...vals, id]);
      stmt.free();
      persist(db);
    },

    // Events
    getAllEvents() {
      const res = db.exec('SELECT * FROM events ORDER BY id DESC');
      return rowsToObjects(res);
    },
    getEventById(id) {
      const res = db.exec(`SELECT * FROM events WHERE id = ${id}`);
      const rows = rowsToObjects(res);
      return rows[0] || null;
    },
    createEvent(event, userId) {
      const stmt = db.prepare('INSERT INTO events (title, description, date, location, category, college, image) VALUES (?, ?, ?, ?, ?, ?, ?)');
      stmt.run([event.title, event.description || null, event.date || null, event.location || null, event.category || null, event.college || null, event.image || null]);
      stmt.free();
      persist(db);
      const res = db.exec('SELECT last_insert_rowid() as id');
      return res[0].values[0][0];
    },
    updateEvent(id, fields) {
      const sets = [];
      const vals = [];
      if (fields.title) { sets.push('title = ?'); vals.push(fields.title); }
      if (fields.description !== undefined) { sets.push('description = ?'); vals.push(fields.description); }
      if (fields.date) { sets.push('date = ?'); vals.push(fields.date); }
      if (fields.location) { sets.push('location = ?'); vals.push(fields.location); }
      if (fields.category) { sets.push('category = ?'); vals.push(fields.category); }
      if (fields.college) { sets.push('college = ?'); vals.push(fields.college); }
      if (fields.image) { sets.push('image = ?'); vals.push(fields.image); }
      if (sets.length === 0) return;
      const stmt = db.prepare(`UPDATE events SET ${sets.join(', ')} WHERE id = ?`);
      stmt.run([...vals, id]);
      stmt.free();
      persist(db);
    },
    deleteEvent(id) {
      db.run(`DELETE FROM events WHERE id = ${id}`);
      persist(db);
    },

    // Event Registrations
    registerForEvent(eventId, registrationData) {
      const { userId, fullName, email, contact, collegeName, year, department, studentId, collegeIdImage } = registrationData;
      // Auto-approve if user is logged in, otherwise pending
      const status = userId ? 'approved' : 'pending';
      
      const stmt = db.prepare(`
        INSERT INTO event_registrations 
        (event_id, user_id, full_name, email, contact, college_name, year, department, student_id, college_id_image, status) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);
      stmt.run([
        eventId, 
        userId || null, 
        fullName, 
        email, 
        contact, 
        collegeName, 
        year, 
        department, 
        studentId || null, 
        collegeIdImage || null, 
        status
      ]);
      stmt.free();
      persist(db);
      const res = db.exec('SELECT last_insert_rowid() as id');
      return res[0].values[0][0];
    },
    getAllEventRegistrations() {
      const res = db.exec(`
        SELECT er.id, er.event_id, er.user_id, er.full_name, er.email, er.contact,
               er.college_name, er.year, er.department, er.student_id, er.college_id_image,
               er.status, er.registered_at,
               e.title as event_title, e.date as event_date, e.location as event_location
        FROM event_registrations er
        JOIN events e ON er.event_id = e.id
        ORDER BY er.id DESC
      `);
      return rowsToObjects(res);
    },
    getEventRegistrationsByEvent(eventId) {
      const res = db.exec(`
        SELECT er.*
        FROM event_registrations er
        WHERE er.event_id = ${eventId}
        ORDER BY er.id DESC
      `);
      return rowsToObjects(res);
    },
    getEventRegistrationsByUser(userId) {
      const res = db.exec(`
        SELECT er.id, er.event_id, er.user_id, er.status, er.registered_at,
               e.title as event_title, e.description as event_description, e.date as event_date, e.location as event_location, e.category as event_category
        FROM event_registrations er
        JOIN events e ON er.event_id = e.id
        WHERE er.user_id = ${userId}
        ORDER BY er.registered_at DESC
      `);
      return rowsToObjects(res);
    },
    updateRegistrationStatus(registrationId, status) {
      const stmt = db.prepare('UPDATE event_registrations SET status = ? WHERE id = ?');
      stmt.run([status, registrationId]);
      stmt.free();
      persist(db);
    },

    // Clubs
    getAllClubs() {
      const res = db.exec('SELECT * FROM clubs ORDER BY id DESC');
      return rowsToObjects(res);
    },
    createClub(club) {
      const stmt = db.prepare('INSERT INTO clubs (name, description, category, members_count, image) VALUES (?, ?, ?, ?, ?)');
      stmt.run([club.name, club.description || null, club.category || null, club.members_count || 0, club.image || null]);
      stmt.free();
      persist(db);
      const res = db.exec('SELECT last_insert_rowid() as id');
      return res[0].values[0][0];
    },
    updateClub(id, fields) {
      const { name, description, category, members_count, image } = fields;
      const stmt = db.prepare(`
        UPDATE clubs 
        SET name = ?, description = ?, category = ?, members_count = ?, image = ?
        WHERE id = ?
      `);
      stmt.run([name, description, category, members_count || 0, image || null, id]);
      stmt.free();
      persist(db);
    },
    deleteClub(id) {
      db.run(`DELETE FROM clubs WHERE id = ${id}`);
      persist(db);
    },

    // Club Applications
    applyToClub(clubId, userId, message) {
      const stmt = db.prepare('INSERT INTO club_applications (club_id, user_id, status, message) VALUES (?, ?, ?, ?)');
      stmt.run([clubId, userId, 'pending', message || null]);
      stmt.free();
      persist(db);
      const res = db.exec('SELECT last_insert_rowid() as id');
      return res[0].values[0][0];
    },
    getAllClubApplications() {
      const res = db.exec(`
        SELECT ca.id, ca.club_id, ca.user_id, ca.status, ca.message, ca.applied_at,
               c.name as club_name, c.category as club_category,
               u.name as user_name, u.email as user_email, u.studentId
        FROM club_applications ca
        JOIN clubs c ON ca.club_id = c.id
        JOIN users u ON ca.user_id = u.id
        ORDER BY ca.id DESC
      `);
      return rowsToObjects(res);
    },
    updateClubApplicationStatus(id, status) {
      const stmt = db.prepare('UPDATE club_applications SET status = ? WHERE id = ?');
      stmt.run([status, id]);
      stmt.free();
      persist(db);
    },

    // Achievements
    getAllAchievements() {
      const res = db.exec(`
        SELECT a.*, u.name as user_name FROM achievements a
        LEFT JOIN users u ON a.user_id = u.id
        ORDER BY a.id DESC
      `);
      return rowsToObjects(res);
    },
    createAchievement(ach, userId) {
      const stmt = db.prepare('INSERT INTO achievements (title, description, user_id, department, date, image, status) VALUES (?, ?, ?, ?, ?, ?, ?)');
      stmt.run([ach.title, ach.description || null, userId, ach.department || null, ach.date || null, ach.image || null, ach.status || 'pending']);
      stmt.free();
      persist(db);
      const res = db.exec('SELECT last_insert_rowid() as id');
      return res[0].values[0][0];
    },
    updateAchievementStatus(id, status) {
      const stmt = db.prepare('UPDATE achievements SET status = ? WHERE id = ?');
      stmt.run([status, id]);
      stmt.free();
      persist(db);
    },
    updateAchievementData(id, fields) {
      const { title, description, department, date, image } = fields;
      const stmt = db.prepare(`
        UPDATE achievements 
        SET title = ?, description = ?, department = ?, date = ?, image = ?
        WHERE id = ?
      `);
      stmt.run([title, description, department, date, image, id]);
      stmt.free();
      persist(db);
    },
    deleteAchievement(id) {
      db.run(`DELETE FROM achievements WHERE id = ${id}`);
      persist(db);
    },

    // News
    getAllNews() {
      const res = db.exec('SELECT * FROM news ORDER BY id DESC');
      return rowsToObjects(res);
    },
    createNews(news, userId) {
      const stmt = db.prepare('INSERT INTO news (title, content, category, date) VALUES (?, ?, ?, ?)');
      stmt.run([news.title, news.content || null, news.category || null, news.date || null]);
      stmt.free();
      persist(db);
      const res = db.exec('SELECT last_insert_rowid() as id');
      return res[0].values[0][0];
    },
    updateNews(id, fields) {
      const sets = [];
      const vals = [];
      if (fields.title) { sets.push('title = ?'); vals.push(fields.title); }
      if (fields.content !== undefined) { sets.push('content = ?'); vals.push(fields.content); }
      if (fields.category) { sets.push('category = ?'); vals.push(fields.category); }
      if (sets.length === 0) return;
      const stmt = db.prepare(`UPDATE news SET ${sets.join(', ')} WHERE id = ?`);
      stmt.run([...vals, id]);
      stmt.free();
      persist(db);
    },
    deleteNews(id) {
      db.run(`DELETE FROM news WHERE id = ${id}`);
      persist(db);
    },

    // Opportunities
    getAllOpportunities() {
      const res = db.exec('SELECT * FROM opportunities ORDER BY id DESC');
      return rowsToObjects(res);
    },
    createOpportunity(opp, userId) {
      const stmt = db.prepare('INSERT INTO opportunities (title, company, description, type, location, deadline) VALUES (?, ?, ?, ?, ?, ?)');
      stmt.run([opp.title, opp.company || null, opp.description || null, opp.type || null, opp.location || null, opp.deadline || null]);
      stmt.free();
      persist(db);
      const res = db.exec('SELECT last_insert_rowid() as id');
      return res[0].values[0][0];
    },
    updateOpportunity(id, fields) {
      const { title, company, description, type, location, deadline } = fields;
      const stmt = db.prepare(`
        UPDATE opportunities 
        SET title = ?, company = ?, description = ?, type = ?, location = ?, deadline = ?
        WHERE id = ?
      `);
      stmt.run([title, company, description, type, location, deadline, id]);
      stmt.free();
      persist(db);
    },
    deleteOpportunity(id) {
      db.run(`DELETE FROM opportunities WHERE id = ${id}`);
      persist(db);
    },

    // Saved Opportunities
    saveOpportunity(opportunityId, userId) {
      const stmt = db.prepare('INSERT OR IGNORE INTO saved_opportunities (opportunity_id, user_id) VALUES (?, ?)');
      stmt.run([opportunityId, userId]);
      stmt.free();
      persist(db);
      const res = db.exec('SELECT last_insert_rowid() as id');
      return res[0].values[0][0];
    },
    unsaveOpportunity(opportunityId, userId) {
      db.run(`DELETE FROM saved_opportunities WHERE opportunity_id = ${opportunityId} AND user_id = ${userId}`);
      persist(db);
    },
    getSavedOpportunitiesByUser(userId) {
      const res = db.exec(`
        SELECT so.id, so.opportunity_id, so.user_id, so.saved_at,
               o.title, o.company, o.description, o.type, o.location, o.deadline
        FROM saved_opportunities so
        JOIN opportunities o ON so.opportunity_id = o.id
        WHERE so.user_id = ${userId}
        ORDER BY so.saved_at DESC
      `);
      return rowsToObjects(res);
    },
    isOpportunitySaved(opportunityId, userId) {
      const res = db.exec(`SELECT id FROM saved_opportunities WHERE opportunity_id = ${opportunityId} AND user_id = ${userId}`);
      return rowsToObjects(res).length > 0;
    }
  };
}

module.exports = { createDb };
