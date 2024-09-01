import React, { useState } from 'react';
import axios from 'axios';

const RecipeForm = ({ onSubmit, recipe }) => {
    const [title, setTitle] = useState(recipe?.title || '');
    const [description, setDescription] = useState(recipe?.description || '');
    const [image, setImage] = useState(recipe?.image || '');
    const [cuisine, setCuisine] = useState(recipe?.cuisine || 'Indian');
    const [type, setType] = useState(recipe?.type || 'Veg');
    const [mealType, setMealType] = useState(recipe?.mealType || 'Breakfast');
    const [steps, setSteps] = useState(recipe?.steps || ['']);
    const [ingredients, setIngredients] = useState(recipe?.ingredients || []);
    const [query, setQuery] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

  const handleStepChange = (index, value) => {
    setSteps(steps => steps.map((step, i) => (i === index ? value : step)));
};

  const addStep = () => {
    setSteps([...steps, '']);
  };

  // Remove a step
  const removeStep = (index) => {
    const updatedSteps = steps.filter((_, stepIndex) => stepIndex !== index);
    setSteps(updatedSteps);
  };

  const handleAddIngredient = () => {
    setIngredients([...ingredients, { heading: '', items: [''] }]);
  };

  const handleIngredientChange = (index, field, value) => {
    setIngredients(ingredients =>
        ingredients.map((ingredient, i) =>
            i === index
                ? { ...ingredient, [field]: field === 'items' ? value.split(',').map(item => item.trim()) : value }
                : ingredient
        )
    );
};

  // Remove an ingredient group
  const removeIngredient = (index) => {
    const updatedIngredients = ingredients.filter((_, ingredientIndex) => ingredientIndex !== index);
    setIngredients(updatedIngredients);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newRecipe = {
      title,
      description,
      image,
      cuisine,
      type,
      mealType,
      steps,
      ingredients,
    };
    onSubmit(newRecipe);
  };

  const fetchRecipe = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/v1/recipe?query=${query}`, {
        headers: { 'X-Api-Key': 'fEG5Qr8UHLUCO27KieIkTQ==xC1w4hbRmwWrmiJ6' },
      });

      if (response.data.length > 0) {
        const fetchedRecipe = response.data[0];
        setTitle(fetchedRecipe.title);
        // setDescription(fetchedRecipe.instructions);
        setIngredients([{ heading: 'Main Ingredients', items: fetchedRecipe.ingredients.split('|') }]);
        setSteps(fetchedRecipe.instructions.split('. '));
      } else {
        setError('No recipe found for the given query.');
      }
    } catch (error) {
      setError('An error occurred while fetching the recipe. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: '768px', margin: '0 auto', marginTop: '64px' }}>
      {/* Recipe Query Input */}
      <div style={{ marginBottom: '24px' }}>
        <label style={{ display: 'block', color: '#333', fontSize: '14px', fontWeight: 'bold', marginBottom: '8px' }}>
          Generate a recipe
        </label>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Enter recipe name"
          style={{
            boxShadow: '0 0 10px rgba(0,0,0,0.1)',
            border: '1px solid #ccc',
            borderRadius: '4px',
            width: '100%',
            padding: '8px',
            fontSize: '14px',
            color: '#333',
          }}
        />
        <button
          type="button"
          onClick={fetchRecipe}
          style={{
            padding: '10px 20px',
            backgroundColor: '#4CAF50',
            color: '#fff',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            marginTop: '8px',
            width :  '100%',
          }}
        >
          Generate Recipe
        </button>
        {loading && <p>Loading...</p>}
        {error && <p style={{ color: 'red' }}>{error}</p>}
      </div>

      <div class="relative flex py-5 items-center">
    <div class="flex-grow border-t border-gray-400"></div>
    <span class="flex-shrink mx-4 text-gray-400">or Add recipe manually</span>
    <div class="flex-grow border-t border-gray-400"></div>
    </div>

      {/* Title Field */}
      <div style={{ marginBottom: '24px' }}>
        <label style={{ display: 'block', color: '#333', fontSize: '14px', fontWeight: 'bold', marginBottom: '8px' }}>Name of the Recipe</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          style={{ boxShadow: '0 0 10px rgba(0,0,0,0.1)', border: '1px solid #ccc', borderRadius: '4px', width: '100%', padding: '8px', fontSize: '14px', color: '#333' }}
          required
        />
      </div>

      {/* Description Field */}
      <div style={{ marginBottom: '24px' }}>
        <label style={{ display: 'block', color: '#333', fontSize: '14px', fontWeight: 'bold', marginBottom: '8px' }}>Something about the Recipe !</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          style={{ boxShadow: '0 0 10px rgba(0,0,0,0.1)', border: '1px solid #ccc', borderRadius: '4px', width: '100%', padding: '8px', fontSize: '14px', color: '#333' }}
        ></textarea>
      </div>

      {/* Image URL Field */}
      <div style={{ marginBottom: '24px' }}>
        <label style={{ display: 'block', color: '#333', fontSize: '14px', fontWeight: 'bold', marginBottom: '8px' }}>Recipe Image</label>
        <input
          type="text"
          value={image}
          onChange={(e) => setImage(e.target.value)}
          style={{ boxShadow: '0 0 10px rgba(0,0,0,0.1)', border: '1px solid #ccc', borderRadius: '4px', width: '100%', padding: '8px', fontSize: '14px', color: '#333' }}
        />
      </div>
        
      <div className='flex mb-7 w-full gap-5'>
          {/* Cuisine Selector */}
      <div className='w-1/2'>
        <label style={{ display: 'block', color: '#333', fontSize: '14px', fontWeight: 'bold', marginBottom: '8px' }}>Cuisine</label>
        <select
          value={cuisine}
          onChange={(e) => setCuisine(e.target.value)}
          style={{ boxShadow: '0 0 10px rgba(0,0,0,0.1)', border: '1px solid #ccc', borderRadius: '4px', width: '100%', padding: '8px', fontSize: '14px', color: '#333' }}
        >
          <option value="Indian">Indian</option>
          <option value="Chinese">Chinese</option>
          <option value="Italian">Italian</option>
          <option value="French">French</option>
          <option value="Mexican">Mexican</option>
        </select>
      </div>

      {/* Type Selector */}
      <div className='w-1/2'>
        <label style={{ display: 'block', color: '#333', fontSize: '14px', fontWeight: 'bold', marginBottom: '8px' }}>Type</label>
        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
          style={{ boxShadow: '0 0 10px rgba(0,0,0,0.1)', border: '1px solid #ccc', borderRadius: '4px', width: '100%', padding: '8px', fontSize: '14px', color: '#333' }}
        >
          <option value="Veg">Veg</option>
          <option value="Non-Veg">Non-Veg</option>
          <option value="Vegan">Vegan</option>
        </select>
      </div>
      </div>
      

      {/* Meal Type Selector */}
      <div style={{ marginBottom: '24px' }}>
        <label style={{ display: 'block', color: '#333', fontSize: '14px', fontWeight: 'bold', marginBottom: '8px' }}>Meal Type</label>
        <select
          value={mealType}
          onChange={(e) => setMealType(e.target.value)}
          style={{ boxShadow: '0 0 10px rgba(0,0,0,0.1)', border: '1px solid #ccc', borderRadius: '4px', width: '100%', padding: '8px', fontSize: '14px', color: '#333' }}
        >
          <option value="Breakfast">Breakfast</option>
          <option value="Lunch">Lunch</option>
          <option value="Dinner">Dinner</option>
          <option value="Dessert">Dessert</option>
          <option value="Snacks">Snacks</option>
        </select>
      </div>

      <div style={{ marginBottom: '24px' }}>
        <label style={{ display: 'block', color: '#333', fontSize: '14px', fontWeight: 'bold', marginBottom: '8px' }}>
          Steps :
        </label>
        {steps.map((step, index) => (
          <div key={index} style={{ marginBottom: '10px', display: 'flex', alignItems: 'center' }}>
            <input
              type="text"
              value={step}
              onChange={(e) => handleStepChange(index, e.target.value)}
              placeholder={`Step ${index + 1}`}
              style={{
                boxShadow: '0 0 10px rgba(0,0,0,0.1)',
                border: '1px solid #ccc',
                borderRadius: '4px',
                width: '100%',
                padding: '8px',
                fontSize: '14px',
                color: '#333',
                marginRight: '8px',
              }}
              required
            />
            <button
              type="button"
              onClick={() => removeStep(index)}
              style={{
                backgroundColor: 'red',
                color: '#fff',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                padding: '6px 12px',
              }}
            >
              X
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={addStep}
          style={{
            padding: '10px 20px',
            backgroundColor: '#4CAF50',
            color: '#fff',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            width : '100%',
          }}
        >
          Add Custom Steps to make the Recipe
        </button>
      </div>

      {/* Ingredients Section */}
      <div style={{ marginBottom: '24px' }}>
        <h3 style={{ fontSize: '16px', fontWeight: 'bold', color: '#333', marginBottom: '8px' }}>Ingredients:</h3>
        {ingredients.map((ingredient, index) => (
          <div key={index} style={{ marginBottom: '10px' }}>
            <input
              type="text"
              placeholder="Heading"
              value={ingredient.heading}
              onChange={(e) => handleIngredientChange(index, 'heading', e.target.value)}
              style={{
                boxShadow: '0 0 10px rgba(0,0,0,0.1)',
                border: '1px solid #ccc',
                borderRadius: '4px',
                width: '100%',
                padding: '8px',
                fontSize: '14px',
                color: '#333',
                marginBottom: '4px',
              }}
            />
            <textarea
              placeholder="Items (comma-separated)"
              value={ingredient.items.join(', ')}
              onChange={(e) => handleIngredientChange(index, 'items', e.target.value)}
              style={{
                boxShadow: '0 0 10px rgba(0,0,0,0.1)',
                border: '1px solid #ccc',
                borderRadius: '4px',
                width: '100%',
                padding: '8px',
                fontSize: '14px',
                color: '#333',
                marginBottom: '4px',
              }}
            ></textarea>
            <button
              type="button"
              onClick={() => removeIngredient(index)}
              style={{
                backgroundColor: 'red',
                color: '#fff',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                padding: '6px 12px',
              }}
            >
              X
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={handleAddIngredient}
          style={{
            padding: '10px 20px',
            backgroundColor: '#4CAF50',
            color: '#fff',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            width : '100%',
          }}
        >
          Add Ingredient Group
        </button>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        style={{
          padding: '10px 20px',
          backgroundColor: '#008CBA',
          color: '#fff',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
          width : '100%',
        }}
      >
        Submit Your Recipe
      </button>
    </form>
  );
};

export default RecipeForm;