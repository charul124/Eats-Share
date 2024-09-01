import { useState, useEffect } from 'react';
import axios from 'axios';

const useToken = () => {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [isValid, setIsValid] = useState(false);

  useEffect(() => {
    if (token) {
      console.log('Verifying token:', token);
      axios.post(`${process.env.REACT_APP_API_BASE_URL}/api/verify-token`, {}, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((response) => {
          console.log('Token verification response:', response);
          setIsValid(response.data.message === 'Token is valid');
        })
        .catch((error) => {
          console.error('Error verifying token:', error);
          setIsValid(false);
        });
    }
  }, [token]);

  const updateToken = (newToken) => {
    setToken(newToken);
    localStorage.setItem('token', newToken);
  };

  return { token, isValid, updateToken };
};

export default useToken;