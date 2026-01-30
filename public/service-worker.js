/* eslint-disable no-restricted-globals */

const CACHE_NAME = 'socialsfy-v1';
const urlsToCache = [
  '/mobile/',
  '/mobile/index.html',
  '/mobile/manifest.json',
  '/mobile/logo192.png',
  '/mobile/logo512.png',
  '/mobile/favicon.ico'
];

// Instalação do Service Worker
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

// Cache e pedidos de rede
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Se encontrar na cache, devolve. Se não, vai à rede.
        if (response) {
          return response;
        }
        return fetch(event.request);
      })
  );
});

// Atualização do Service Worker
self.addEventListener('activate', (event) => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
          // O map precisa de retornar algo para o linter ficar feliz
          return null;
        })
      );
    })
  );
});