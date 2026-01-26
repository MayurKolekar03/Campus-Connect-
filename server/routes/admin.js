// Admin routes - protected endpoints for admin operations
const express = require('express');
const router = express.Router();

module.exports = (db) => {
  // Get all event registrations
  router.get('/event-registrations', async (req, res) => {
    try {
      const registrations = await db.getAllEventRegistrations();
      res.json(registrations);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  // Update event registration status (approve/reject)
  router.patch('/event-registrations/:id', async (req, res) => {
    try {
      const { status } = req.body;
      if (!['approved', 'rejected'].includes(status)) {
        return res.status(400).json({ error: 'Invalid status' });
      }
      await db.updateRegistrationStatus(req.params.id, status);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  // Get all club applications
  router.get('/club-applications', async (req, res) => {
    try {
      const applications = await db.getAllClubApplications();
      res.json(applications);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  // Update club application status (approve/reject)
  router.patch('/club-applications/:id', async (req, res) => {
    try {
      const { status } = req.body;
      if (!['approved', 'rejected', 'pending'].includes(status)) {
        return res.status(400).json({ error: 'Invalid status' });
      }
      await db.updateClubApplicationStatus(req.params.id, status);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  // Get all achievements (including pending)
  router.get('/achievements', async (req, res) => {
    try {
      const achievements = await db.getAllAchievements();
      res.json(achievements);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  // Create achievement (college achievement by admin)
  router.post('/achievements', async (req, res) => {
    try {
      const { title, description, department, date, image } = req.body;
      const userId = req.user?.id || 1; // Admin user ID
      
      console.log('=== Creating Achievement ===');
      console.log('Title:', title);
      console.log('Department:', department);
      console.log('Date:', date);
      console.log('Has Image:', !!image);
      console.log('Image size:', image ? image.length : 0, 'bytes');
      console.log('User ID:', userId);
      
      if (!title || !department || !date) {
        console.error('Validation failed: Missing required fields');
        return res.status(400).json({ error: 'Title, department, and date are required' });
      }

      const id = await db.createAchievement({
        title,
        description,
        department,
        date,
        image,
        status: 'approved' // Admin achievements are auto-approved
      }, userId);
      
      console.log('✅ Achievement created successfully with ID:', id);
      res.json({ id, success: true });
    } catch (error) {
      console.error('❌ Achievement creation error:', error.message);
      console.error('Stack:', error.stack);
      res.status(500).json({ error: error.message });
    }
  });

  // Update achievement status (approve/reject)
  router.patch('/achievements/:id', async (req, res) => {
    try {
      const { status } = req.body;
      if (!['approved', 'rejected', 'pending'].includes(status)) {
        return res.status(400).json({ error: 'Invalid status' });
      }
      await db.updateAchievementStatus(req.params.id, status);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  // Events CRUD
  router.post('/events', async (req, res) => {
    try {
      const id = await db.createEvent(req.body, req.user?.id);
      res.json({ id, success: true });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  router.put('/events/:id', async (req, res) => {
    try {
      await db.updateEvent(req.params.id, req.body);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  router.delete('/events/:id', async (req, res) => {
    try {
      await db.deleteEvent(req.params.id);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  // Clubs CRUD
  router.get('/clubs', async (req, res) => {
    try {
      const clubs = await db.getAllClubs();
      res.json(clubs);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  router.post('/clubs', async (req, res) => {
    try {
      const id = await db.createClub(req.body);
      res.json({ id, success: true });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  router.put('/clubs/:id', async (req, res) => {
    try {
      console.log('=== Updating Club ===');
      console.log('Club ID:', req.params.id);
      console.log('Update data:', req.body);
      
      await db.updateClub(req.params.id, req.body);
      console.log('✅ Club updated successfully');
      res.json({ success: true });
    } catch (error) {
      console.error('❌ Club update error:', error.message);
      res.status(500).json({ error: error.message });
    }
  });

  router.delete('/clubs/:id', async (req, res) => {
    try {
      await db.deleteClub(req.params.id);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  // News CRUD
  router.get('/news', async (req, res) => {
    try {
      const news = await db.getAllNews();
      res.json(news);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  router.post('/news', async (req, res) => {
    try {
      const id = await db.createNews(req.body, req.user?.id);
      res.json({ id, success: true });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  router.put('/news/:id', async (req, res) => {
    try {
      await db.updateNews(req.params.id, req.body);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  router.delete('/news/:id', async (req, res) => {
    try {
      await db.deleteNews(req.params.id);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  // Opportunities CRUD
  router.get('/opportunities', async (req, res) => {
    try {
      const opportunities = await db.getAllOpportunities();
      res.json(opportunities);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  router.post('/opportunities', async (req, res) => {
    try {
      const id = await db.createOpportunity(req.body, req.user?.id);
      res.json({ id, success: true });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  router.put('/opportunities/:id', async (req, res) => {
    try {
      await db.updateOpportunity(req.params.id, req.body);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  router.delete('/opportunities/:id', async (req, res) => {
    try {
      await db.deleteOpportunity(req.params.id);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  // Achievements delete/update
  router.put('/achievements/:id', async (req, res) => {
    try {
      await db.updateAchievementData(req.params.id, req.body);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  router.delete('/achievements/:id', async (req, res) => {
    try {
      await db.deleteAchievement(req.params.id);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  return router;
};
