// authMiddleware.js

const jwt = require('jsonwebtoken');
const { JWT_SECRET } = process.env;

module.exports = {
  authenticate: (req, res, next) => {
    const token = req.headers['authorization'];
    
    if (!token) {
      return res.status(401).json({ message: 'Unauthorized - Token required' });
    }

    jwt.verify(token, JWT_SECRET, (err, decoded) => {
      if (err) {
        return res.status(403).json({ message: 'Forbidden - Invalid token' });
      }
      req.user = {
        user_id: decoded.user_id,
        email: decoded.email,
        role: decoded.role
      };
      next();
    });
  },

  authorize: (roles = []) => {
    if (typeof roles === 'string') {
      roles = [roles];
    }

    return (req, res, next) => {
      if (!req.user) {
        return res.status(401).json({ message: 'Unauthorized' });
      }
      
      if (roles.length && !roles.includes(req.user.role)) {
        return res.status(403).json({ 
          message: 'Forbidden - Insufficient privileges'
        });
      }
      next();
    };
  }
};