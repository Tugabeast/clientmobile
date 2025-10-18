import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';

import UserHomePage from './pages/user/UserHomePage';
import UserProfilePage from './pages/user/UserProfilePage';
import UserStatisticsPage from './pages/user/UserStatisticsPage';
import UserPostClassificationPage from './pages/user/UserPostClassificationPage';

import NotAllowedPage from './pages/system/NotAllowedPage';
import NotFoundPage from './pages/system/NotFoundPage';

import './styles/AuthBackground.css';
import { AuthContext } from './context/AuthContext';

/**
 * - Se não autenticado → redireciona para "/"
 * - Se autenticado mas sem permissão → "/not-allowed"
 */
const ProtectedRoute = ({ children, onlyFor }) => {
  const { userType, loading } = useContext(AuthContext);

  if (loading) {
    return <div style={{ textAlign: 'center', paddingTop: 100 }}>A carregar...</div>;
  }

  // não autenticado
  if (!userType) return <Navigate to="/" replace />;

  // autenticado mas sem permissão
  if (Array.isArray(onlyFor) && !onlyFor.includes(userType)) {
    return <Navigate to="/not-allowed" replace />;
  }

  return children;
};

const App = () => {
  return (
    <Router>
      <Routes>
        {/* Auth */}
        <Route path="/" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Utilizador (mobile) */}
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

        {/* Bloqueio para perfis não suportados na app mobile */}
        <Route path="/not-allowed" element={<NotAllowedPage />} />

        {/* 404 */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Router>
  );
};

export default App;
