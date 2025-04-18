// authMiddleware.js

const jwt = require('jsonwebtoken');
const { JWT_SECRET } = process.env;

module.exports = {
  authenticate: (req, res, next) => {
    const token = req.headers['authorization']; // Langsung ambil token tanpa split
    
    if (!token) {
      return res.status(401).json({ message: 'Unauthorized - Token required' });
    }

    jwt.verify(token, JWT_SECRET, (err, user) => {
      if (err) {
        return res.status(403).json({ message: 'Forbidden - Invalid token' });
      }
      req.user = user;
      next();
    });
  },

  authorize: (roles = []) => {
    if (typeof roles === 'string') {
      roles = [roles];
    }

    return (req, res, next) => {
      if (roles.length && !roles.includes(req.user.role)) {
        return res.status(403).json({ message: 'Forbidden - Insufficient privileges' });
      }
      next();
    };
  }
};