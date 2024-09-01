const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { connectDB } = require('./config/db');
const authMiddleware = require('./middleware/authMiddleware');
const User = require('./models/User');
const Recipe = require('./models/Recipe');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Load environment variables
dotenv.config();

// Initialize express app
const app = express();

// Use cors middleware
app.use(cors()); // Enables CORS for all routes and origins by default

// Middleware setup
app.use(express.json());
app.use(authMiddleware);

// Database connection
connectDB()
  .then(() => {
    console.log('Connected to database');
  })
  .catch((err) => {
    console.error('Error connecting to database:', err);
    process.exit(1);
  });

// User Signup
app.post('/api/auth/signup', async (req, res) => {
  try {
    console.log('Signup request received');
    const { name, email, password } = req.body;

    // Validate user input
    if (!email || !password || !name) {
      console.log('Invalid request: missing fields');
      return res.status(400).json({ message: 'Name, email, and password are required' });
    }

    console.log('Checking for existing user');
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.log('Email already in use');
      return res.status(400).json({ message: 'Email already in use' });
    }

    console.log('Hashing password');
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({
      name,
      email,
      password: hashedPassword,
      savedRecipes: [],
      createdRecipes: [],
    });

    console.log('Saving user to database');
    await user.save();

    console.log('Generating JWT token');
    const payload = { userId: user.id };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });
    console.log('Token generated:', token);

    res.status(201).json({ token });
  } catch (error) {
    console.error('Error signing up:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// User Login
app.post('/api/auth/login', async (req, res) => {
  try {
    console.log('Login request received');
    const { email, password } = req.body;

    // Validate user input
    if (!email || !password) {
      console.log('Invalid request: missing fields');
      return res.status(400).json({ message: 'Email and password are required' });
    }

    console.log('Finding user by email');
    const user = await User.findOne({ email: { $regex: `^${email}$`, $options: 'i' } });
    if (!user) {
      console.log('User not found');
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    console.log('Comparing passwords');
    const isMatch = bcrypt.compareSync(password, user.password);    
    if (!isMatch) {
      console.log('Passwords do not match');
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    console.log('Generating JWT token');
    const payload = { userId: user.id };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });
    console.log('Token generated:', token);

    res.status(200).json({ token });
  } catch (error) {
    console.error('Error logging in:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Token Verification
app.post('/api/verify-token', async (req, res) => {
  try {
    console.log('Verifying token...');
    const token = req.header('Authorization')?.replace('Bearer ', '');
    console.log('Token:', token);

    if (!token) {
      console.log('No token provided');
      return res.status(401).json({ message: 'No token provided' });
    }

    console.log('Verifying token with JWT secret...');
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('Decoded token:', decoded);

    if (!decoded) {
      console.log('Invalid token');
      return res.status(401).json({ message: 'Invalid token' });
    }

    console.log('Token is valid!');
    res.status(200).json({ message: 'Token is valid' });
  } catch (error) {
    console.error('Error verifying token:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Fetch User's Recipes
app.get('/api/my-recipes', authMiddleware, async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    const recipes = await Recipe.find({ createdBy: req.user._id });
    res.status(200).json(recipes);
  } catch (error) {
    console.error('Error fetching user recipes:', error);
    res.status(500).json({ message: 'Error fetching user recipes' });
  }
});

// Check User Authentication Status
app.get('/api/auth/check', authMiddleware, async (req, res) => {
  console.log('Request received at /api/auth/check');
  try {
    if (req.user) {
      res.json({ isLoggedIn: true });
    } else {
      res.json({ isLoggedIn: false });
    }
  } catch (error) {
    console.error('Error checking authentication:', error);
    res.status(401).json({ isLoggedIn: false });
  }
});

// User Logout
app.post('/api/logout', async (req, res) => {
  console.log('Logout request received');
  try {
    console.log('Attempting to log out...');
    res.json({ message: 'Logged out successfully' });
    console.log('Logout response sent');
  } catch (error) {
    console.error('Error logging out:', error);
    res.status(500).json({ message: 'Error logging out' });
  }
});

// Recipe Routes
const recipeRoutes = require('./routes/recipeRoutes');
app.use('/api/recipes', recipeRoutes);

// Server listening port
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Catch unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('Unhandled promise rejection:', err);
  process.exit(1);
});

module.exports = app;
