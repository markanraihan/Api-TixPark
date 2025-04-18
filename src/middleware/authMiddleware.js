// authMiddleware.js

const jwt = require('jsonwebtoken');
const { JWT_SECRET } = process.env;

module.exports = {
  authenticate: (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    jwt.verify(token, JWT_SECRET, (err, user) => {
      if (err) {
        return res.status(403).json({ message: 'Forbidden' });
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
        return res.status(403).json({ message: 'Forbidden' });
      }
      next();
    };
  }
};