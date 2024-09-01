import React, { useEffect, useState } from 'react';
import axios from 'axios';
import RecipeForm from '../components/RecipeForm';
import { useParams, useNavigate } from 'react-router-dom';
import useToken from '../pages/useToken';

const EditRecipe = () => {
  const { id } = useParams();
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { token, isValid } = useToken();

  useEffect(() => {
    const fetchRecipe = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/recipes/${id}`);
        setRecipe(response.data);
      } catch (error) {
        setError('There was an error fetching the recipe.');
      } finally {
        setLoading(false);
      }
    };
    fetchRecipe();
  }, [id]);

  const handleSubmit = async (updatedRecipe) => {
    if (!isValid) {
      setError('You must be logged in to edit a recipe.');
      navigate('/login');
      return;
    }

    try {
      const headers = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      };
      const response = await axios.put(`${process.env.REACT_APP_API_BASE_URL}/api/recipes/${id}`, updatedRecipe, { headers });
      navigate(`/recipe/${id}`);
    } catch (error) {
      if (error.response.status === 401) {
        alert("Sorry, you cannot edit this recipe as you are not the author.");
      } else {
        console.error('Error updating recipe:', error);
        alert('Error updating recipe. Please try again later.');
      }
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!isValid) {
    return <div>You must be logged in to edit a recipe. <a href="/login">Login</a></div>;
  }

  return (
    <div>
      <h1 className="text-center text-3xl font-bold mt-8">Edit Recipe</h1>
      {recipe && <RecipeForm onSubmit={handleSubmit} recipe={recipe} />}
    </div>
  );
};

export default EditRecipe;