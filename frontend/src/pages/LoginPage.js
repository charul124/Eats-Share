import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../components/AuthContext';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [token, setToken] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const redirectTo = location.state?.redirectTo || '/';
  const { handleLogin: handleLoginContext } = useContext(AuthContext);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      console.log('Login form submitted');
      if (!email || !password) {
        console.log('Invalid input: missing fields');
        setError('Please fill out all fields');
        return;
      }

      console.log('Sending request to server');
      const response = await axios.post(`${process.env.REACT_APP_API_BASE_URL}/api/auth/login`, { email, password });
      console.log('Response received:', response.data);

      localStorage.setItem('token', response.data.token);
      console.log('Token stored in local storage:', localStorage.getItem('token'));
      setToken(response.data.token);
      axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;

      handleLoginContext(response.data.token);

      axios.post(`${process.env.REACT_APP_API_BASE_URL}/api/verify-token`, {}, {
        headers: {
          Authorization: `Bearer ${response.data.token}`,
        },
      })
        .then((response) => {
          if (response.data.message === 'Token is valid') {
            console.log('Token is valid');
            console.log('Redirecting to:', redirectTo);
            navigate(redirectTo, { replace: true });
            console.log('Navigated to:', redirectTo);
          } else {
            console.log('Token is invalid');
            localStorage.removeItem('token');
            setError('Invalid token');
          }
        })
        .catch((error) => {
          console.error('Error verifying token:', error);
          localStorage.removeItem('token');
          setError('Error verifying token');
        });
    } catch (error) {
      console.error('Error logging in:', error);
      setError('Error logging in. Please try again.');
    }
  };

  useEffect(() => {
    if (token) {
      console.log('Token is set, navigating to:', redirectTo);
      navigate(redirectTo);
      console.log('Navigated to:', redirectTo);
    }
  }, [token, navigate, redirectTo]);

  return (
    <div className="flex justify-center items-center w-full h-full mt-10">
      <div className="bg-white p-16 mb-20 flex w-full">
        <div className='w-1/2 h-16'>
          <img className='object-cover' src="/images/loginbg.jpg" alt="" />
        </div>
        <div className='w-1/2 px-12'>
        <h2 className="text-bg-rose-950 text-center mb-5 font-bold">Login to Share Recipes</h2>
        {error && <p className="text-red-500 text-center">{error}</p>}
        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <label className="block mb-2 text-gray-700">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full p-2 rounded border border-gray-300 text-sm"
              autoComplete="username"
            />
          </div>
          <div className="mb-6">
            <label className="block mb-2 text-gray-700">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full p-2 rounded border border-gray-300 text-sm"
              autoComplete="current-password"
            />
          </div>
          <button
            type="submit"
            className="bg-rose-950 text-white py-2 px-4 rounded text-lg w-full hover:bg-green-500"
          >
            Login
          </button>
        </form>
        </div>
        
      </div>
    </div>
  );
};

export default LoginPage;