-- Users table
CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'student',
    studentId TEXT,
    adminId TEXT,
    college TEXT,
    year TEXT,
    department TEXT,
    skills TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Events table
CREATE TABLE IF NOT EXISTS events (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    description TEXT,
    date TEXT,
    location TEXT,
    category TEXT,
    college TEXT,
    image TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Event registrations (when student registers for an event)
CREATE TABLE IF NOT EXISTS event_registrations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    event_id INTEGER NOT NULL,
    user_id INTEGER,
    full_name TEXT NOT NULL,
    email TEXT NOT NULL,
    contact TEXT NOT NULL,
    college_name TEXT NOT NULL,
    year TEXT NOT NULL,
    department TEXT NOT NULL,
    student_id TEXT,
    college_id_image TEXT,
    status TEXT DEFAULT 'pending',
    registered_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (event_id) REFERENCES events(id),
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Clubs table
CREATE TABLE IF NOT EXISTS clubs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    description TEXT,
    category TEXT,
    members_count INTEGER DEFAULT 0,
    image TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Club applications (when student applies to join a club)
CREATE TABLE IF NOT EXISTS club_applications (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    club_id INTEGER NOT NULL,
    user_id INTEGER NOT NULL,
    status TEXT DEFAULT 'pending',
    message TEXT,
    applied_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (club_id) REFERENCES clubs(id),
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Achievements table
CREATE TABLE IF NOT EXISTS achievements (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    description TEXT,
    user_id INTEGER NOT NULL,
    department TEXT,
    date TEXT,
    image TEXT,
    status TEXT DEFAULT 'pending',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- News table
CREATE TABLE IF NOT EXISTS news (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    content TEXT,
    category TEXT,
    date TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Opportunities table
CREATE TABLE IF NOT EXISTS opportunities (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    company TEXT,
    description TEXT,
    type TEXT,
    location TEXT,
    deadline TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Saved opportunities (when student saves an opportunity)
CREATE TABLE IF NOT EXISTS saved_opportunities (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    opportunity_id INTEGER NOT NULL,
    user_id INTEGER NOT NULL,
    saved_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (opportunity_id) REFERENCES opportunities(id),
    FOREIGN KEY (user_id) REFERENCES users(id),
    UNIQUE(opportunity_id, user_id)
);
