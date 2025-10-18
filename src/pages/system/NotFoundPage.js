import React from 'react';
import { Link } from 'react-router-dom';

const wrap = {
  minHeight: '100vh',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: 24,
  textAlign: 'center',
};
const card = {
  maxWidth: 520,
  width: '100%',
  background: '#fff',
  borderRadius: 12,
  boxShadow: '0 10px 30px rgba(0,0,0,.08)',
  padding: '28px 24px',
};

const NotFoundPage = () => (
  <div style={wrap}>
    <div style={card}>
      <h2 style={{ marginTop: 0 }}>404</h2>
      <p>Página não encontrada.</p>
      <Link
        to="/"
        style={{
          display: 'inline-block',
          padding: '10px 16px',
          background: '#0d6efd',
          color: '#fff',
          borderRadius: 8,
          textDecoration: 'none',
        }}
      >
        Ir para o início
      </Link>
    </div>
  </div>
);

export default NotFoundPage;
