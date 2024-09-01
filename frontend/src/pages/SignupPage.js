import React, { useState, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../components/AuthContext';

const SignupPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { handleLogin: handleLoginContext } = useContext(AuthContext);

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      console.log('Signup form submitted');
      if (!name || !email || !password) {
        console.log('Invalid input: missing fields');
        setError('Please fill out all fields');
        return;
      }

      console.log('Sending request to server');
      const response = await axios.post(`${process.env.REACT_APP_API_BASE_URL}/api/auth/signup`, { name, email, password });
      console.log('Response received:', response);

      if (response.status === 201) {
        console.log('Signup successful');
        handleLoginContext(response.data.token);
        navigate('/login');
      } else {
        console.log('Error signing up:', response.data.message);
        setError(response.data.message);
      }
    } catch (error) {
      console.error('Error signing up:', error);
      setError('Error signing up. Please try again.');
    }
  };

  return (
    <div className="flex justify-center items-center w-full h-full mt-10">
      <div className="bg-white p-16 flex w-full">
        <div className="w-1/2 h-16">
          <img className="object-cover" src="/images/loginbg.jpg" alt="Signup Background" />
        </div>
        <div className="w-1/2 px-12">
          <h2 className="text-bg-rose-950 text-center mb-5 font-bold">Signup to Share Recipes</h2>
          {error && <p className="text-red-500 text-center">{error}</p>}
          <form onSubmit={handleSignup}>
            <div className="mb-4">
              <label className="block mb-2 text-gray-700">Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full p-2 rounded border border-gray-300 text-sm"
              />
            </div>
            <div className="mb-4">
              <label className="block mb-2 text-gray-700">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full p-2 rounded border border-gray-300 text-sm"
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
              />
            </div>
            <button
              type="submit"
              className="bg-rose-950 text-white py-2 px-4 rounded text-lg w-full hover:bg-green-500"
            >
              Signup
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;