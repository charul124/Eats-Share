const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Recipe = require('../models/Recipe');
const authMiddleware = require('../middleware/authMiddleware');
const mongoose = require('mongoose');

const jwtSecret = process.env.JWT_SECRET;

// User Signup
router.post('api/auth/signup', async (req, res) => {
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
    const token = jwt.sign(payload, jwtSecret, { expiresIn: '1h' });
    console.log('Token generated:', token);

    res.status(201).json({ token });
  } catch (error) {
    console.error('Error signing up:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// User Login
router.post('/login', async (req, res) => {
  try {
    console.log('Login request received');
    const { email, password } = req.body;

    // Validate user input
    if (!email || !password) {
      console.log('Invalid request: missing fields');
      return res.status(400).json({ message: 'Email and password are required' });
    }

    console.log('Finding user by email');
    const user = await User.findOne({ email });
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
    const token = jwt.sign(payload, jwtSecret, { expiresIn: '1h' });
    console.log('Token generated:', token);

    res.status(200).json({ token });
  } catch (error) {
    console.error('Error logging in:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Fetch User's Recipes
router.get('/my-recipes', authMiddleware, async (req, res) => {
  try {
    console.log('Fetching user recipes');
    const recipes = await Recipe.find({ createdBy: req.user });
    console.log('Recipes found:', recipes);
    res.status(200).json(recipes);
  } catch (error) {
    console.error('Error fetching user recipes:', error);
    res.status(500).json({ message: 'Error fetching user recipes' });
  }
});

module.exports = router;