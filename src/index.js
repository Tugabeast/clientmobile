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


// REGISTO DO SERVICE WORKER
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/mobile/service-worker.js')
      .then((registration) => {
        console.log('✅ SW registado com sucesso no scope:', registration.scope);
      })
      .catch((err) => {
        console.log('❌ Falha ao registar SW:', err);
      });
  });
}