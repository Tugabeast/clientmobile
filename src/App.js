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
 * 🔒 Rota Protegida
 * - Espera o loading terminar.
 * - Se não autenticado -> Login.
 * - Se sem permissão -> Not Allowed.
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

/**
 * 🔓 Rota Pública (NOVO)
 * - Se o utilizador JÁ estiver logado e tentar ir ao Login ("/"),
 * nós mandamo-lo diretamente para a Home.
 */
const PublicRoute = ({ children }) => {
  const { userType, loading } = useContext(AuthContext);

  if (loading) {
    return <div></div>; // Ou um spinner simples
  }

  if (userType === 'user') {
    return <Navigate to="/home" replace />;
  }
  

  return children;
};

const App = () => {
  return (
    <Router basename='/mobile'>
      <Routes>
        {/* Auth - Agora protegidas para não deixar entrar quem já está logado */}
        <Route 
          path="/" 
          element={
            <PublicRoute>
              <LoginPage />
            </PublicRoute>
          } 
        />
        <Route 
          path="/register" 
          element={
            <PublicRoute>
              <RegisterPage />
            </PublicRoute>
          } 
        />

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