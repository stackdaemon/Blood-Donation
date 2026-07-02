const jwt = require('jsonwebtoken');
const User = require('../models/User');

const verifyToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'No token provided, authorization denied.' });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret_key');
    
    const user = await User.findById(decoded.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error('Auth verification error:', error);
    res.status(401).json({ message: 'Token is invalid or expired.' });
  }
};

const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Unauthorized. Access is denied for your role.' });
    }
    next();
  };
};

const checkNotBlocked = (req, res, next) => {
  if (req.user && req.user.status === 'blocked') {
    return res.status(403).json({ message: 'Your account is blocked. You cannot perform this action.' });
  }
  next();
};

module.exports = {
  verifyToken,
  authorizeRoles,
  checkNotBlocked,
};
