import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { AuthProvider } from './context/AuthContext';
import { ProSidebarProvider } from 'react-pro-sidebar';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <AuthProvider>
      <ProSidebarProvider>
        <App />
      </ProSidebarProvider>
    </AuthProvider>
  </React.StrictMode>
);

// --- CÓDIGO PARA REGISTAR O SERVICE WORKER (PWA) ---
// Isto verifica se o browser suporta Service Workers e carrega o ficheiro
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/service-worker.js')
      .then((registration) => {
        console.log('✅ Service Worker registado com sucesso:', registration.scope);
      })
      .catch((err) => {
        console.log('❌ Falha ao registar o Service Worker:', err);
      });
  });
}