const CACHE_NAME = 'voxlink-v1';

self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('fetch', (event) => {
  // Mantém o app funcionando mesmo com oscilações de rede
  event.respondWith(fetch(event.request));
});
