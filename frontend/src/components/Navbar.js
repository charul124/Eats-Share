import React from 'react';
import { Link } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from './AuthContext';

const Navbar = () => {
  const { isLoggedIn, handleLogout } = useContext(AuthContext);

  return (
    <nav className="bg-rose-950 p-2">
      <div className="flex justify-between items-center">
        <Link to="/" className="text-white text-xl ml-3 font-bold">
          Eats's & Share's
        </Link>
        <div>
          {isLoggedIn ? (
            <>
              <Link to="/create" className="text-white mr-4">
                Create a Recipe
              </Link>
              <Link to="/my-recipes" className="text-white mr-4">
                My Recipes
              </Link>
              <a
                href="#"
                className="text-white mr-4 cursor-pointer"
                onClick={handleLogout}
              >
                Logout
              </a>
            </>
          ) : (
            <>
              <Link to="/login" className="text-white border px-2 py-1 rounded-md mr-4">
                Login
              </Link>
              <Link to="/signup" className="text-white mr-4">
                Signup
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;