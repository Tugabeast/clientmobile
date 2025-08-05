import React from 'react';
import MenuHamburguer from '../../components/MenuHamburguer';
import '../../styles/UserHomePage.module.css';

const UserHomePage = () => {
  return (
    <div className="app-container">
      <MenuHamburguer />
      <div className="main-content">
        <h1>Bem-vindo à Home do Utilizador<h5>Diriga-se a página de classificar para começar a classificar as publicações</h5></h1>
      </div>
    </div>
  );
};

export default UserHomePage;
