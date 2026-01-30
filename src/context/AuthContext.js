import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [userType, setUserType] = useState(null);
  const [token, setToken] = useState(null);
  const [username, setUsername] = useState(null);
  const [userId, setUserId] = useState(null);
  
  // O loading começa a true para impedir que a App mostre a página de Login antes de verificar a memória
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedToken = sessionStorage.getItem('token');
    const storedType = sessionStorage.getItem('userType');
    const storedUsername = sessionStorage.getItem('username');
    const storedUserId = sessionStorage.getItem('userId');

    if (storedToken && storedType && storedUsername && storedUserId) {
      setToken(storedToken);
      setUserType(storedType);
      setUsername(storedUsername);
      setUserId(storedUserId);
    }

    setLoading(false);
  }, []);

  const login = (newToken, newType, newUsername, newUserId) => {
    sessionStorage.setItem('token', newToken);
    sessionStorage.setItem('userType', newType);
    sessionStorage.setItem('username', newUsername);
    sessionStorage.setItem('userId', newUserId);

    setToken(newToken);
    setUserType(newType);
    setUsername(newUsername);
    setUserId(newUserId);
  };

  const logout = () => {
    sessionStorage.clear(); // Limpa apenas a aba atual
    setToken(null);
    setUserType(null);
    setUsername(null);
    setUserId(null);
  };

  return (
    <AuthContext.Provider value={{ userType, token, username, userId, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};