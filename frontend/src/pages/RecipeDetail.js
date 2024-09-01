import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

const RecipeDetail = () => {
  const { id } = useParams();
  const [recipe, setRecipe] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showSharePopup, setShowSharePopup] = useState(false); // State for share popup
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRecipe = async () => {
      if (!id) return setError('No recipe ID provided');

      try {
        const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/recipes/${id}`);
        setRecipe(response.data);
      } catch (error) {
        console.error('Error fetching recipe:', error);
        setError(error.response?.data?.message || 'Error fetching recipe');
      } finally {
        setLoading(false);
      }
    };

    fetchRecipe();
  }, [id]);

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this recipe? This action cannot be undone.')) {
      setLoading(true);
      try {
        const token = localStorage.getItem('token');
        console.log('Token:', token);
        const headers = {
          Authorization: `Bearer ${token}`,
        };
        console.log('Headers:', headers);
        const response = await axios.delete(`${process.env.REACT_APP_API_BASE_URL}/api/recipes/${id}`, { headers });
        console.log('Response:', response);
        alert('Recipe deleted successfully.');
        navigate('/');
      } catch (error) {
        if (error.response && error.response.status === 401) {
          setError(error.response.data.message);
        } else {
          console.error('Error deleting recipe:', error);
          setError('There was an error deleting the recipe.');
        }
      } finally {
        setLoading(false);
      }
    }
  };

  const handleShare = () => {
    setShowSharePopup(true); // Show the share popup
  };

  const closeSharePopup = () => {
    setShowSharePopup(false); // Close the share popup
  };

  const shareOptions = [
    {
      name: 'Facebook',
      url: `https://www.facebook.com/sharer/sharer.php?u=${window.location.href}`,
      icon: 'fab fa-facebook-f'
    },
    {
      name: 'Twitter',
      url: `https://twitter.com/intent/tweet?url=${window.location.href}&text=Check out this recipe: ${recipe?.title}`,
      icon: 'fab fa-twitter'
    },
    {
      name: 'Pinterest',
      url: `https://pinterest.com/pin/create/button/?url=${window.location.href}&media=${recipe?.image}&description=Check out this recipe: ${recipe?.title}`,
      icon: 'fab fa-pinterest'
    },
    {
      name: 'LinkedIn',
      url: `https://www.linkedin.com/sharing/share?url=${window.location.href}`,
      icon: 'fab fa-linkedin-in'
    },
    {
      name: 'WhatsApp',
      url: `https://wa.me/?text=Check out this recipe: ${recipe?.title} ${window.location.href}`,
      icon: 'fab fa-whatsapp'
    }
  ];

  if (loading) {
    return <div className="text-center py-20">Loading...</div>;
  }

  if (error) {
    return (
      <div className="text-red-600 font-semibold text-xl text-center py-20">
        {error}
        <div className="flex justify-center mt-4">
          <button
            onClick={() => navigate('/')}
            className="bg-rose-950 text-white py-2 px-4 rounded hover:bg-blue-600 flex items-center"
          >
            <i className="fas fa-home mr-2"></i> Move back to home page
          </button>
        </div>
      </div>
    );
  }

  if (!recipe) {
    return <div className="text-red-500 text-center py-20">Recipe not found</div>;
  }

  return (
    <div className="mx-32 my-10 p-5 bg-white shadow-lg rounded-lg">
      <div className="flex gap-6 flex-col md:flex-row">
        {/* Image Section */}
        <div className="md:w-1/2 p-3">
          <img
            src={recipe.image}
            alt={recipe.title}
            className="w-full object-contain mb-7 rounded-lg shadow-md"
            loading="lazy"
          />
          <p className='mb-2 font-semibold '>Know More about the recipe !</p>
          <p className="text-gray-700 p-4 border mb-6">{recipe.description}</p>
        </div>

        {/* Recipe Details */}
        <div className="md:w-1/2 p-5 flex flex-col justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-4">{recipe.title}</h1>

            {/* Tags Section */}
            <div className="flex flex-wrap gap-2 mb-6">
              <span className="bg-yellow-400 text-white px-3 py-1 rounded-full">{recipe.cuisine}</span>
              <span className="bg-blue-400 text-white px-3 py-1 rounded-full">{recipe.type}</span>
              <span className="bg-red-500 text-white px-3 py-1 rounded-full">{recipe.mealType}</span>
            </div>

            {/* Ingredients Section */}
            {recipe.ingredients && recipe.ingredients.length > 0 && (
              <div className="mb-6">
                <h2 className="text-xl font-semibold mb-3">Ingredients:</h2>
                {recipe.ingredients.map((ingredient, index) => (
                  <div key={index} className="mb-3">
                    <h3 className="text-lg font-semibold mb-1">{ingredient.heading}</h3>
                    <ul className="list-disc list-inside">
                      {ingredient.items.map((item, idx) => (
                        <li key={idx} className="text-sm">{item}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            )}

            {/* Steps Section */}
            {recipe.steps && recipe.steps.length > 0 && (
              <div>
                <h2 className="text-xl font-semibold mb-3">Start Cooking:</h2>
                <ol className="space-y-2">
                  {recipe.steps.map((step, index) => (
                    <li key={index} className="text-sm">
                      <b>Step {index + 1}</b>: {step}
                    </li>
                  ))}
                </ol>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-4 mt-6">
            <button
              onClick={handleShare}
              className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 flex items-center"
            >
              <i className="fas fa-share-alt mr-2"></i> Share
            </button>
            <a
              href={`/edit/${recipe._id}`}
              className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600 flex items-center"
            >
              <i className="fas fa-edit mr-2"></i> Edit
            </a>
            <button
              onClick={handleDelete}
              className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600 flex items-center"
            >
              <i className="fas fa-trash-alt mr-2"></i> Delete
            </button>
          </div>
        </div>
      </div>

      {/* Share Popup */}
      {showSharePopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full relative">
            <button
              className="absolute top-2 right-2 text-gray-700 hover:text-gray-900"
              onClick={closeSharePopup}
            >
              &times;
            </button>
            <h2 className="text-lg font-bold mb-4 text-center">Share this recipe</h2>
            <div className="flex justify-center space-x-4">
              {shareOptions.map((option) => (
                <a
                  key={option.name}
                  href={option.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-2xl text-gray-700 hover:text-gray-900"
                  aria-label={`Share on ${option.name}`}
                >
                  <i className={option.icon}></i>
                </a>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RecipeDetail;
