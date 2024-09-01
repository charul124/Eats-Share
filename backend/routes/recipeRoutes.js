const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const Recipe = require('../models/Recipe');
const authMiddleware = require('../middleware/authMiddleware');
const recipeRouter = express.Router();

// Create a new recipe
router.post('/', authMiddleware, async (req, res) => {
  console.log('Creating a new recipe...');
  try {
    const { title, description, image, steps, cuisine, type, mealType, ingredients } = req.body;
    console.log('Req body:', req.body);

    // Validate required fields
    if (!title || !Array.isArray(steps) || steps.length === 0) {
      console.log('Error: Title and steps are required, and steps should be an array.');
      return res.status(400).json({ message: 'Title and steps are required, and steps should be an array.' });
    }
    if (!cuisine || !type || !mealType) {
      console.log('Error: Cuisine, type, and meal type are required.');
      return res.status(400).json({ message: 'Cuisine, type, and meal type are required.' });
    }
    if (!Array.isArray(ingredients) || ingredients.some(ing => !ing.heading || !Array.isArray(ing.items))) {
      console.log('Error: Ingredients must be structured with headings and items.');
      return res.status(400).json({ message: 'Ingredients must be structured with headings and items.' });
    }

    // Validate req.user
    if (!req.user) {
      console.log('Error: Unauthorized');
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const newRecipe = new Recipe({
      title,
      description,
      image,
      steps,
      cuisine,
      type,
      mealType,
      ingredients,
      createdBy: req.user._id
    });
    console.log('New recipe:', newRecipe);

    await newRecipe.save();
    console.log('Recipe saved successfully!');
    res.status(201).json(newRecipe);
  } catch (error) {
    console.error('Error creating recipe:', error);
    res.status(500).json({ message: 'Error creating recipe', error });
  }
});

// Get all recipes with optional filters
router.get('/get', async (req, res) => {
  console.log('Getting all recipes...');
  try {
    const filters = req.query;
    console.log('Filters:', filters);
    const recipes = Object.keys(filters).length === 0
      ? await Recipe.find()
      : await Recipe.find(filters);
    console.log('Recipes:', recipes);

    res.status(200).json(recipes);
  } catch (error) {
    console.error('Error fetching recipes:', error);
    res.status(500).json({ message: 'Error fetching recipes', error });
  }
});

// Get a recipe by ID
router.get('/:id', async (req, res) => {
  console.log('Getting a recipe by ID...');
  const recipeId = req.params.id;
  console.log('Recipe ID:', recipeId);

  // Validate recipeId
  if (!mongoose.Types.ObjectId.isValid(recipeId)) {
    console.log('Error: Invalid recipe ID format');
    return res.status(400).json({ message: 'Invalid recipe ID format' });
  }

  // Additional validation for recipeId
  if (!/^[0-9a-fA-F]{24}$/.test(recipeId)) {
    console.log('Error: Invalid recipe ID format');
    return res.status(400).json({ message: 'Invalid recipe ID format' });
  }

  try {
    const recipe = await Recipe.findById(recipeId);
    console.log('Recipe:', recipe);
    if (!recipe) {
      console.log('Error: Recipe not found');
      return res.status(404).json({ message: 'Recipe not found' });
    }
    res.status(200).json(recipe);
  } catch (error) {
    console.error('Error fetching recipe:', error);
    res.status(500).json({ message: 'Error fetching recipe', error });
  }
});

// Update a recipe by ID
router.put('/:id', authMiddleware, async (req, res) => {
  const recipeId = req.params.id;
  const { title, description, image, steps, cuisine, type, mealType, ingredients } = req.body;

  if (!mongoose.Types.ObjectId.isValid(recipeId)) {
    return res.status(400).json({ message: 'Invalid recipe ID format' });
  }

  try {
    const recipe = await Recipe.findById(recipeId);
    if (!recipe) {
      return res.status(404).json({ message: 'Recipe not found' });
    }

    // Check if the user attempting to edit the recipe is the same user who created it
    if (recipe.createdBy.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'You are not authorized to edit this recipe' });
    }

    recipe.title = title;
    recipe.description = description;
    recipe.image = image;
    recipe.steps = steps;
    recipe.cuisine = cuisine;
    recipe.type = type;
    recipe.mealType = mealType;
    recipe.ingredients = ingredients;

    await recipe.save();
    res.status(200).json(recipe);
  } catch (error) {
    console.error('Error updating recipe:', error);
    res.status(500).json({ message: 'Error updating recipe', error });
  }
});


// Delete a recipe by ID
// Delete a recipe by ID
router.delete('/:id', authMiddleware, async (req, res) => {
  const recipeId = req.params.id;

  if (!mongoose.Types.ObjectId.isValid(recipeId)) {
    return res.status(400).json({ message: 'Invalid recipe ID format' });
  }

  try {
    const recipe = await Recipe.findById(recipeId);
    if (!recipe) {
      return res.status(404).json({ message: 'Recipe not found' });
    }

    // Check if the user attempting to delete the recipe is the same user who created it
    if (recipe.createdBy.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'You are not authorized to delete this recipe' });
    }

    await Recipe.deleteOne({ _id: recipeId });
    res.status(200).json({ message: 'Recipe deleted successfully' });
  } catch (error) {
    console.error('Error deleting recipe:', error);
    res.status(500).json({ message: 'Error deleting recipe', error });
  }
});

module.exports = router;
