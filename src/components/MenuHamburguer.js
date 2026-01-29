import React, { useContext, useEffect, useState } from 'react';
import {
  Sidebar,
  Menu,
  MenuItem,
  useProSidebar,
} from 'react-pro-sidebar';

import {
  FaHome,
  FaChartBar,
  FaUser,
  FaSignOutAlt,
  FaBars,
  FaTimes,
  FaClipboardCheck,
} from 'react-icons/fa';

import { useNavigate } from 'react-router-dom';
import '../styles/MenuHamburguer.css';
import { AuthContext } from '../context/AuthContext';

const MenuHamburguer = () => {
  const { collapseSidebar, collapsed } = useProSidebar();
  const navigate = useNavigate();
  const { logout } = useContext(AuthContext);

  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // Inicia fechado no mobile

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleResize = () => {
    const mobile = window.innerWidth <= 768;
    setIsMobile(mobile);
    setIsSidebarOpen(!mobile); // true se desktop, false se mobile
  };

  useEffect(() => {
    window.addEventListener('resize', handleResize);
    handleResize(); // chama na inicialização também
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleSidebar = () => {
    if (isMobile) {
      setIsSidebarOpen(!isSidebarOpen);
    } else {
      collapseSidebar();
    }
  };

  return (
    <>
      {isMobile && (
        <button
          className={`hamburger-button fixed`}
          onClick={toggleSidebar}
          style={{ left: isSidebarOpen ? 260 : 15 }}
        >
          {isSidebarOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
        </button>
      )}

      <Sidebar
        collapsed={!isMobile && collapsed}
        width="250px"
        collapsedWidth="80px"
        className={`custom-sidebar ${isMobile ? (isSidebarOpen ? 'open' : 'closed') : ''}`}
      >
      {!isMobile && (
        <button
          className={`hamburger-button ${collapsed ? 'closed-desktop' : 'open-desktop'}`}
          onClick={toggleSidebar}
        >
          {collapsed ? <FaBars size={20} /> : <FaTimes size={20} />}
        </button>
      )}


        <Menu>
          <MenuItem icon={<FaHome size={18} />} onClick={() => navigate('/home')}>
            Home
          </MenuItem>

          <MenuItem icon={<FaClipboardCheck size={18} />} onClick={() => navigate('/classify')}>
            Classificar
          </MenuItem>

          <MenuItem icon={<FaChartBar size={18} />} onClick={() => navigate('/statistics')}>
            Estatísticas
          </MenuItem>

          <MenuItem icon={<FaUser size={18} />} onClick={() => navigate('/profile')}>
            Perfil
          </MenuItem>

          <MenuItem icon={<FaSignOutAlt size={18} />} onClick={handleLogout}>
            Sair
          </MenuItem>
        </Menu>
      </Sidebar>
    </>
  );
};

export default MenuHamburguer;
