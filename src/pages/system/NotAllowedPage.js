import React from 'react';
import { Navigate, } from 'react-router-dom';

const container = {
  minHeight: '100vh',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '32px',
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

const NotAllowedPage = () => {

  const userType = localStorage.getItem('userType');
  if (userType === 'user') return <Navigate to="/home" replace />;

  return (
    <div style={container}>
      <div style={card}>
        <h2 style={{ marginTop: 0, marginBottom: 12 }}>Acesso não suportado</h2>
        <p style={{ margin: 0, color: '#555' }}>
          A aplicação móvel é apenas para <strong>utilizadores</strong> que fazem classificações de publicações.
          Perfis <strong>Administrador</strong> e <strong>Investigador</strong> devem usar a
          aplicação web para a gestão da aplicação e dos utilizadores.
        </p>

        <div style={{ marginTop: 20 }}>
          <a
            href="/mobile"
            style={{
              display: 'inline-block',
              padding: '10px 16px',
              background: '#0d6efd',
              color: '#fff',
              borderRadius: 8,
              textDecoration: 'none',
            }}
          >
            Terminar sessão e voltar ao início
          </a>
        </div>
      </div>
    </div>
  );
};

export default NotAllowedPage;
