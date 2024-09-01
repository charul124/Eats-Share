const jwt = require('jsonwebtoken');
const User = require('../models/User');

const authMiddleware = async (req, res, next) => {
  console.log('Auth Middleware: Request Path:', req.path);
  console.log('Auth Middleware: Request Headers:', req.headers);

  if (req.path === '/api/auth/login' || req.path === '/api/auth/signup') {
    console.log('Auth Middleware: Skipping token verification for login and signup endpoints');
    return next();
  }

  if (req.method === 'GET' && req.path !== '/api/my-recipes') {
    return next();
  }

  if (req.path === '/api/auth/signup' && req.method === 'POST') {
    console.log('Auth Middleware: Skipping token verification for signup endpoint');
    return next();
  }

  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    console.log('Auth Middleware: Token:', token);

    if (!token) {
      console.log('Auth Middleware: No token found');
      return res.status(401).json({ message: 'No token, authorization denied' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET, { expiresIn: 3600 });
    console.log('Auth Middleware: Decoded Token:', decoded);

    if (!decoded) {
      console.log('Auth Middleware: Invalid token');
      return res.status(401).json({ message: 'Invalid token' });
    }

    const userId = decoded.userId;
    const user = await User.findById(userId);
    if (!user) {
      console.log('Auth Middleware: User not found');
      return res.status(401).json({ message: 'User not found' });
    }

    req.user = user;
    console.log('Auth Middleware: User:', req.user);

    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      console.log('Auth Middleware: Token expired');
      return res.status(401).json({ message: 'Token expired' });
    } else {
      console.error('Auth Middleware: Error verifying token:', error);
      return res.status(401).json({ message: 'Invalid token' });
    }
  }
};
module.exports = authMiddleware;

