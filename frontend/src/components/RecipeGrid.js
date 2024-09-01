import React from 'react';
import RecipeCard from './RecipeCard';

const RecipeGrid = ({ recipes }) => {
    return (
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '16px' }}>
            <div 
                style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                    gap: '24px'
                }}
            >
                {recipes && recipes.length > 0 ? (
                    recipes.map((recipe) => (
                        <RecipeCard key={recipe._id} recipe={recipe} />
                    ))
                ) : (
                    <p style={{ textAlign: 'center', fontSize: '18px', color: '#666' }}>No recipes found.</p>
                )}
            </div>
        </div>
    );
};

export default RecipeGrid;
