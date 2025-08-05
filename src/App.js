import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';

import UserHomePage from './pages/user/UserHomePage';
import UserProfilePage from './pages/user/UserProfilePage';
import UserStatisticsPage from './pages/user/UserStatisticsPage';
import UserPostClassificationPage from './pages/user/UserPostClassificationPage';


import './styles/AuthBackground.css';
import { AuthContext } from './context/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { userType, loading } = useContext(AuthContext);

  if (loading) {
    return <div style={{ textAlign: 'center', paddingTop: '100px' }}>A carregar...</div>;
  }

  if (!userType) return <Navigate to="/" />;
  if (userType !== 'user') return <Navigate to="/home" />;
  return children;
};

const App = () => {
  return (
    <Router>
      <Routes>
        {/* Login / Registo */}
        <Route path="/" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Páginas do Utilizador */}
        <Route
          path="/home"
          element={
            <ProtectedRoute onlyFor={['user']}>
              <UserHomePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute onlyFor={['user']}>
              <UserProfilePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/statistics"
          element={
            <ProtectedRoute onlyFor={['user']}>
              <UserStatisticsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/classify"
          element={
            <ProtectedRoute onlyFor={['user']}>
              <UserPostClassificationPage />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
};

export default App;
