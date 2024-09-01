const mongoose = require('mongoose');

const IngredientSchema = new mongoose.Schema({
  heading: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  items: [
    {
      type: String,
      required: true,
      trim: true,
    },
  ],
});

// RecipeSchema
const RecipeSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  description: {
    type: String,
    trim: true,
  },
  image: {
    type: String,
    trim: true,
  },
  steps: [
    {
      type: String,
      required: true,
      trim: true,
    },
  ],
  cuisine: {
    type: String,
    enum: ['Indian', 'Chinese', 'Italian', 'French', 'Mexican'],
    required: true,
  },
  type: {
    type: String,
    enum: ['Veg', 'Non-Veg', 'Vegan'],
    required: true,
  },
  
  mealType: {
    type: String,
    enum: ['Breakfast', 'Lunch', 'Dinner', 'Dessert', 'Snacks'],
    required: true,
  },
  ingredients: [IngredientSchema],
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
});


module.exports = mongoose.model('Recipe', RecipeSchema);
