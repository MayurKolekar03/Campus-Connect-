// Authentication middleware
// For now, this is a simplified version that checks role from header
// In production, implement JWT verification

const requireAdmin = (req, res, next) => {
  // Temporary: check x-user-role header (will be replaced with JWT)
  const userRole = req.headers['x-user-role'];
  const userId = req.headers['x-user-id'];
  
  if (userRole !== 'admin') {
    return res.status(403).json({ error: 'Admin access required' });
  }
  
  // Attach user info to request
  req.user = {
    id: userId,
    role: userRole
  };
  
  next();
};

const optionalAuth = (req, res, next) => {
  const userRole = req.headers['x-user-role'];
  const userId = req.headers['x-user-id'];
  
  if (userId && userRole) {
    req.user = {
      id: userId,
      role: userRole
    };
  }
  
  next();
};

module.exports = { requireAdmin, optionalAuth };