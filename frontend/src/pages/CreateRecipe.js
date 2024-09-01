import React from 'react';
import axios from 'axios';
import RecipeForm from '../components/RecipeForm';
import { useNavigate } from 'react-router-dom';
import useToken from '../pages/useToken';

const CreateRecipe = () => {
  const navigate = useNavigate();
  const { token, isValid } = useToken();

  const handleSubmit = async (recipe) => {
    if (!isValid) {
      alert('You must be logged in to create a recipe.');
      navigate('/login');
      return;
    }

    try {
      const headers = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      };
      const response = await axios.post(`${process.env.REACT_APP_API_BASE_URL}/api/recipes/`, recipe, { headers });
      navigate(`/recipe/${response.data._id}`);
    } catch (error) {
      console.error('There was an error creating the recipe!', error);
      alert('Failed to create the recipe. Please try again.');
    }
  };

  if (!isValid) {
    return <div>You must be logged in to create a recipe. <a href="/login">Login</a></div>;
  }

  return (
    <div>
      <h1 className="text-center text-3xl font-bold mt-8">Create a New Recipe</h1>
      <RecipeForm onSubmit={handleSubmit} />
    </div>
  );
};

export default CreateRecipe;