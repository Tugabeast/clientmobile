import React from 'react';
import { useNavigate } from 'react-router-dom';
import MenuHamburguer from '../../components/MenuHamburguer';
import '../../styles/UserHomePage.css';

const UserHomePage = () => {
  const navigate = useNavigate();

  return (
    <div className="app-container">
      <MenuHamburguer />
      
      <div className="main-content home-content-center">
        <div className="header-text">
          <h1>Bem-vindo à Aplicação Socialsfy</h1>
          <h3>Selecione uma opção para continuar:</h3>
        </div>

        <div className="cards-grid">
          {/* Card 1 */}
          <div className="nav-card" onClick={() => navigate('/classify')}>
            <div className="card-icon">📝</div>
            <h3>Classificar</h3>
            <p>Começar a classificar publicações.</p>
          </div>

          {/* Card 2 */}
          <div className="nav-card" onClick={() => navigate('/statistics')}>
            <div className="card-icon">📊</div>
            <h3>Estatísticas</h3>
            <p>Ver o meu desempenho.</p>
          </div>

          {/* Card 3 */}
          <div className="nav-card" onClick={() => navigate('/profile')}>
            <div className="card-icon">👤</div>
            <h3>Perfil</h3>
            <p>Gerir a minha conta.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserHomePage;