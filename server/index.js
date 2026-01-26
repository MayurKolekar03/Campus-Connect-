require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const { createDb } = require('./db');
const { requireAdmin, optionalAuth } = require('./middleware/auth');

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
// Increase payload limit for image uploads (10MB)
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// Serve frontend static files from parent directory (project root)
const FRONTEND_ROOT = path.join(__dirname, '..');
app.use(express.static(FRONTEND_ROOT));

(async () => {
  const db = await createDb();
  console.log('Database initialized');

  // Mount admin routes
  const adminRoutes = require('./routes/admin')(db);
  app.use('/api/admin', requireAdmin, adminRoutes);

  // Health
  app.get('/api/health', (req, res) => res.json({ ok: true }));

  // Auth endpoints
  app.post('/api/auth/register', async (req, res) => {
    try {
      const { name, email, password, role, studentId, adminId, college, year, department } = req.body;
      
      console.log('Registration request received:', { name, email, role, studentId, adminId });
      
      if (!name || !email || !password) {
        console.log('Missing required fields:', { name: !!name, email: !!email, password: !!password });
        return res.status(400).json({ error: 'name, email, and password are required' });
      }

      // Check if user already exists
      const existingUser = db.getUserByEmail(email);
      if (existingUser) {
        console.log('User already exists:', email);
        return res.status(400).json({ error: 'User already exists with this email' });
      }

      const userId = db.createUser({
        name,
        email,
        password, // In production, hash this!
        role: role || 'student',
        studentId,
        adminId,
        college,
        year,
        department
      });

      console.log('User created with ID:', userId);

      const user = db.getUserById(userId);
      
      if (!user) {
        console.error('Failed to fetch created user with ID:', userId);
        return res.status(500).json({ error: 'User registered successfully' });
      }

      // Don't send password back
      delete user.password;
      
      console.log('User registered successfully:', user.email);
      res.status(201).json({ success: true, user });
    } catch (e) {
      console.error('Registration error:', e);
      res.status(500).json({ error: 'Server error. Please try again.' });
    }
  });

  app.post('/api/auth/login', async (req, res) => {
    try {
      const { email, password } = req.body;
      
      if (!email || !password) {
        return res.status(400).json({ error: 'email and password are required' });
      }

      const user = db.getUserByEmail(email);
      
      if (!user) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      // Simple password check (in production, use bcrypt!)
      if (user.password !== password) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      // Don't send password back
      delete user.password;
      
      res.json({ success: true, user });
    } catch (e) {
      console.error('Login error:', e);
      res.status(500).json({ error: 'server_error' });
    }
  });

  // Update user profile
  app.put('/api/users/:id', async (req, res) => {
    try {
      const userId = parseInt(req.params.id);
      const { name, studentId, contact, college, year, department, skills } = req.body;
      
      db.updateUser(userId, {
        name,
        studentId,
        college,
        year,
        department,
        skills
      });

      const updatedUser = db.getUserById(userId);
      delete updatedUser.password;
      
      res.json({ success: true, user: updatedUser });
    } catch (e) {
      console.error('Update user error:', e);
      res.status(500).json({ error: 'server_error' });
    }
  });

  // Events (public)
  app.get('/api/events', (req, res) => {
    try {
      const events = db.getAllEvents();
      res.json(events);
    } catch (e) {
      console.error(e);
      res.status(500).json({ error: 'server_error' });
    }
  });

  app.post('/api/events', optionalAuth, (req, res) => {
    try {
      const body = req.body;
      if (!body || !body.title) return res.status(400).json({ error: 'title_required' });
      const id = db.createEvent(body, req.user?.id);
      res.status(201).json({ id });
    } catch (e) {
      console.error(e);
      res.status(500).json({ error: 'server_error' });
    }
  });

  // Student event registration
  app.post('/api/event-registrations', optionalAuth, async (req, res) => {
    try {
      const { eventId, fullName, email, contact, collegeName, year, department, studentId, collegeIdImage } = req.body;
      const userId = req.user?.id || null;
      
      console.log('=== Event Registration ===');
      console.log('Event ID:', eventId);
      console.log('Full Name:', fullName);
      console.log('Email:', email);
      console.log('User ID:', userId);
      console.log('Has College ID Image:', !!collegeIdImage);
      
      if (!eventId || !fullName || !email || !contact || !collegeName || !year || !department) {
        return res.status(400).json({ error: 'All fields except studentId and collegeIdImage are required' });
      }
      
      const id = db.registerForEvent(eventId, {
        userId,
        fullName,
        email,
        contact,
        collegeName,
        year,
        department,
        studentId,
        collegeIdImage
      });
      
      console.log('✅ Registration created with ID:', id);
      res.json({ id, success: true });
    } catch (e) {
      console.error('❌ Registration error:', e);
      res.status(500).json({ error: 'server_error' });
    }
  });

  // Get user's event registrations
  app.get('/api/my-event-registrations', optionalAuth, (req, res) => {
    try {
      const userId = req.user?.id || req.query.userId;
      if (!userId) {
        return res.status(400).json({ error: 'userId required' });
      }
      const registrations = db.getEventRegistrationsByUser(userId);
      res.json(registrations);
    } catch (e) {
      console.error(e);
      res.status(500).json({ error: 'server_error' });
    }
  });

  // Student club application
  app.post('/api/club-applications', optionalAuth, (req, res) => {
    try {
      const { clubId, message } = req.body;
      const userId = req.user?.id || req.body.userId;
      if (!clubId || !userId) {
        return res.status(400).json({ error: 'clubId and userId required' });
      }
      const id = db.applyToClub(clubId, userId, message);
      res.json({ id, success: true });
    } catch (e) {
      console.error(e);
      res.status(500).json({ error: 'server_error' });
    }
  });

  // Public clubs/news/achievements/opportunities
  app.get('/api/clubs', (req, res) => {
    try {
      const clubs = db.getAllClubs();
      res.json(clubs);
    } catch (e) {
      console.error(e);
      res.status(500).json({ error: 'server_error' });
    }
  });

  // Club application endpoint
  app.post('/api/clubs/apply', optionalAuth, (req, res) => {
    try {
      const { clubId, clubName, name, email, studentId, department, year, message } = req.body;
      const userId = req.user?.id || req.body.userId || 1;
      
      if (!clubId || !name || !email || !studentId) {
        return res.status(400).json({ error: 'Missing required fields' });
      }

      const applicationId = db.applyToClub(clubId, userId, message || '', {
        clubName,
        userName: name,
        userEmail: email,
        studentId,
        department,
        year
      });

      res.status(201).json({ id: applicationId, success: true });
    } catch (e) {
      console.error('Club application error:', e);
      res.status(500).json({ error: 'server_error' });
    }
  });

  app.get('/api/news', (req, res) => {
    try {
      const news = db.getAllNews();
      res.json(news);
    } catch (e) {
      console.error(e);
      res.status(500).json({ error: 'server_error' });
    }
  });

  app.get('/api/achievements', (req, res) => {
    try {
      const achievements = db.getAllAchievements();
      // Filter to only show approved for public
      const approved = achievements.filter(a => a.status === 'approved');
      res.json(approved);
    } catch (e) {
      console.error(e);
      res.status(500).json({ error: 'server_error' });
    }
  });

  app.get('/api/opportunities', (req, res) => {
    try {
      const opportunities = db.getAllOpportunities();
      res.json(opportunities);
    } catch (e) {
      console.error(e);
      res.status(500).json({ error: 'server_error' });
    }
  });

  // Saved opportunities
  app.post('/api/saved-opportunities', optionalAuth, (req, res) => {
    try {
      const { opportunityId } = req.body;
      const userId = req.user?.id || req.body.userId;
      if (!opportunityId || !userId) {
        return res.status(400).json({ error: 'opportunityId and userId required' });
      }
      const id = db.saveOpportunity(opportunityId, userId);
      res.json({ id, success: true });
    } catch (e) {
      console.error(e);
      res.status(500).json({ error: 'server_error' });
    }
  });

  app.delete('/api/saved-opportunities', optionalAuth, (req, res) => {
    try {
      const { opportunityId } = req.body;
      const userId = req.user?.id || req.body.userId;
      if (!opportunityId || !userId) {
        return res.status(400).json({ error: 'opportunityId and userId required' });
      }
      db.unsaveOpportunity(opportunityId, userId);
      res.json({ success: true });
    } catch (e) {
      console.error(e);
      res.status(500).json({ error: 'server_error' });
    }
  });

  app.get('/api/my-saved-opportunities', optionalAuth, (req, res) => {
    try {
      const userId = req.user?.id || req.query.userId;
      if (!userId) {
        return res.status(400).json({ error: 'userId required' });
      }
      const savedOpportunities = db.getSavedOpportunitiesByUser(userId);
      res.json(savedOpportunities);
    } catch (e) {
      console.error(e);
      res.status(500).json({ error: 'server_error' });
    }
  });

  // Fallback to index.html for SPA routing
  app.get('*', (req, res) => {
    res.sendFile(path.join(FRONTEND_ROOT, 'index.html'));
  });

  app.listen(PORT, () => console.log(`Server listening on http://localhost:${PORT}`));
})();
