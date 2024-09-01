import React from 'react';
import { Link } from 'react-router-dom';

const RecipeCard = ({ recipe }) => {
    return (
        <div 
            style={{ 
                maxWidth: '320px', 
                borderRadius: '10px', 
                overflow: 'hidden', 
                boxShadow: '0 0 10px rgba(0,0,0,0.1)' 
            }} 
        >
            <img 
                style={{ width: '100%', height: '192px', objectFit: 'cover' }} 
                src={recipe.image || 'default-image-path.jpg'}
                alt={recipe.title || 'Recipe Image'} 
            />
            <div style={{ padding: '24px', paddingBottom: '12px' }}>
                <div style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '16px' }}>
                    {recipe.title || 'Untitled Recipe'}
                </div>
                <p style={{
                    color: '#666',
                    fontSize: '18px',
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis'
                }}>
                    {recipe.description || 'No description available.'}
                </p>
            </div>
            <div style={{ padding: '24px', paddingTop: '6px' }}>
            <Link to={`/recipe/${recipe._id}`} style={{ color: '#03a9f4', textDecoration: 'none' }}>
                View Recipe
            </Link>         
            </div>
        </div>
    );
};

export default RecipeCard;
