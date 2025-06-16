// Der Name unseres Caches. Diesen ändern, wenn wir neue Assets cachen wollen,
// damit der Browser alte Caches "vergisst" und neue Assets lädt.
const CACHE_NAME = 'einkaufsliste-v1';

// Eine Liste von URLs, die wir beim Installieren des Service Workers cachen wollen.
// Das sind die Kerndateien unserer App.
const urlsToCache = [
  '/', // Der Root-Pfad (index.html)
  '/index.html',
  '/style.css',
  '/script.js',
  '/manifest.json',
  '/icons/icon-192x192.png', // Icons müssen auch gecacht werden!
  '/icons/icon-512x512.png'
  // Füge hier weitere statische Assets hinzu, die deine App benötigt (z.B. weitere Bilder, Fonts)
];

// Event-Listener für die 'install'-Phase des Service Workers
// Dies ist der Moment, in dem wir unsere App-Shell-Dateien in den Cache legen.
self.addEventListener('install', (event) => {
  console.log('[Service Worker] Installieren...');
  event.waitUntil(
    caches.open(CACHE_NAME) // Cache mit dem definierten Namen öffnen
      .then((cache) => {
        console.log('[Service Worker] Cache alle App-Shell-Inhalte');
        return cache.addAll(urlsToCache); // Alle definierten URLs in den Cache legen
      })
  );
});

// Event-Listener für die 'fetch'-Phase des Service Workers
// Dies ist der Moment, in dem der Service Worker jede Netzwerkanfrage abfängt.
self.addEventListener('fetch', (event) => {
  // Wir beantworten jede Anfrage mit einer Cache-First-Strategie:
  // Zuerst versuchen, die Ressource aus dem Cache zu holen.
  // Wenn nicht im Cache, dann aus dem Netzwerk laden.
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Wenn die Ressource im Cache gefunden wurde, gib sie zurück
        if (response) {
          console.log('[Service Worker] Ressource aus Cache geladen:', event.request.url);
          return response;
        }
        // Ansonsten, lade die Ressource aus dem Netzwerk
        console.log('[Service Worker] Ressource aus Netzwerk geladen:', event.request.url);
        return fetch(event.request);
      })
  );
});

// Event-Listener für die 'activate'-Phase des Service Workers
// Dies ist der Moment, in dem wir alte Caches aufräumen können.
self.addEventListener('activate', (event) => {
  console.log('[Service Worker] Aktivieren...');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('[Service Worker] Alten Cache löschen:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});