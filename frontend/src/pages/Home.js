import React, { useState, useEffect } from 'react';
import axios from 'axios';
import RecipeGrid from '../components/RecipeGrid';
import { useNavigate } from 'react-router-dom';
import useToken from '../pages/useToken';

const Home = () => {
  const [recipes, setRecipes] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredRecipes, setFilteredRecipes] = useState([]);
  const [cuisineFilter, setCuisineFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [mealTypeFilter, setMealTypeFilter] = useState('');
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const token = useToken();
  const isLoggedIn = token !== null && token !== undefined;

  const fetchRecipes = async () => {
    console.log('Fetching recipes...');
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/recipes/get`);
      console.log('Response:', response);
      setRecipes(response.data);
      setFilteredRecipes(response.data);
    } catch (error) {
      console.error('Error fetching recipes:', error);
      setError('Error fetching recipes');
    }
  };

  useEffect(() => {
    fetchRecipes();
    setFilteredRecipes(recipes);
  }, []);

  const handleSearch = (event) => {
    const term = event.target.value.toLowerCase();
    setSearchTerm(term);
    filterRecipes(term, cuisineFilter, typeFilter, mealTypeFilter);
  };

  const handleCuisineFilterChange = (event) => {
    const selectedCuisine = event.target.value;
    setCuisineFilter(selectedCuisine);
    filterRecipes(searchTerm, selectedCuisine, typeFilter, mealTypeFilter);
  };

  const handleTypeFilterChange = (event) => {
    const selectedType = event.target.value;
    setTypeFilter(selectedType);
    filterRecipes(searchTerm, cuisineFilter, selectedType, mealTypeFilter);
  };

  const handleMealTypeFilterChange = (event) => {
    const selectedMealType = event.target.value;
    setMealTypeFilter(selectedMealType);
    filterRecipes(searchTerm, cuisineFilter, typeFilter, selectedMealType);
  };

  const filterRecipes = (searchTerm, cuisine, type, mealType) => {
    const filtered = recipes.filter((recipe) => 
      (recipe.title.toLowerCase().includes(searchTerm) || 
      recipe.description.toLowerCase().includes(searchTerm)) &&
      (cuisine === '' || recipe.cuisine === cuisine) &&
      (type === '' || recipe.type === type) &&
      (mealType === '' || recipe.mealType === mealType)
    );
    setFilteredRecipes(filtered);
  };

  const handleCreateRecipeClick = () => {
    if (!isLoggedIn) {
      localStorage.setItem('redirectTo', '/create');
      navigate('/login');
    } else {
      navigate('/create');
    }
  };

  return (
    <div className="p-0">
      <div className='static'>
        <img className='' src="images/homebg.jpg" alt="HomeBG" />
        <div className='absolute drop-shadow-2xl top-32 w-96 font-semibold text-white left-44'>
          <p className='text-3xl font-extrabold mb-4'>Eat's&Share's: Where Your Cravings Meet Creativity!</p>
          <p className='text-md mb-4 text-black'>Dive into a world of mouth-watering recipes, whip up your favorites, and share the love (and flavors) with fellow foodies!</p>
          <button 
        onClick={handleCreateRecipeClick} 
        className={`${
          isLoggedIn ? 'block' : 'hidden'
        } bg-rose-950 text-white w-full py-2 px-4 rounded-md mx-auto mb-5`}
      >
        Create/Generate a Recipe
      </button>
        </div>
      </div>
      

      <h1 className="text-center text-3xl font-bold my-10">Discover Recipes You Like</h1>
      <div className="text-center my-5">
        <input
          type="text"
          value={searchTerm}
          onChange={handleSearch}
          placeholder="Search recipes..."
          className="p-2 w-1/2 rounded-md border border-gray-300 text-lg"
          autoComplete='search'
        />
        <select
          value={cuisineFilter}
          onChange={handleCuisineFilterChange}
          className="p-2 ml-3 rounded-md border border-gray-300 text-lg"
        >
          <option value="">All Cuisines</option>
          <option value="Indian">Indian</option>
          <option value="Chinese">Chinese</option>
          <option value="Italian">Italian</option>
          <option value="French">French</option>
          <option value="Mexican">Mexican</option>
        </select>
        <select
          value={typeFilter}
          onChange={handleTypeFilterChange}
          className="p-2 ml-3 rounded-md border border-gray-300 text-lg"
        >
          <option value="">All Types</option>
          <option value="Veg">Veg</option>
          <option value="Non-Veg">Non-Veg</option>
          <option value="Vegan">Vegan</option>
        </select>
        <select
          value={mealTypeFilter}
          onChange={handleMealTypeFilterChange}
          className="p-2 ml-3 rounded-md border border-gray-300 text-lg"
        >
          <option value="">All Meal Types</option>
          <option value="Breakfast">Breakfast</option>
          <option value="Lunch">Lunch</option>
          <option value="Dinner">Dinner</option>
          <option value="Dessert">Dessert</option>
          <option value="Snacks">Snacks</option>
        </select>
      </div>
      <RecipeGrid recipes={filteredRecipes} />
    </div>
  );
};

export default Home;
