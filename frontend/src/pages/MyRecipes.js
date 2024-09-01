import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import RecipeGrid from '../components/RecipeGrid';

const MyRecipes = () => {
  const [recipes, setRecipes] = useState([]);

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const token = localStorage.getItem('token'); // Replace with your token storage mechanism
        const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/my-recipes`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setRecipes(response.data);
      } catch (error) {
        console.error('Error fetching recipes:', error);
      }
    };

    fetchRecipes();
  }, []);

  return (
    <div>
      <h1 className="text-center text-3xl font-bold my-8">My Recipes</h1>
      <RecipeGrid recipes={recipes} />
    </div>
  );
};

export default MyRecipes;