self.addEventListener('install', event => {
  console.log('Service worker installed.');
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  clients.claim();
});