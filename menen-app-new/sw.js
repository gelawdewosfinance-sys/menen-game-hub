const CACHE_NAME = 'menen-cache-v1';
const urlsToCache = [
  './',
  './index.html'
];

// ዌብሳይቱ ሲከፈት ፋይሎቹን በካሽ (Cache) መያዝ
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        return cache.addAll(urlsToCache);
      })
  );
});

// ኢንተርኔት በሌለ ጊዜ የተያዘውን ፋይል ማሳየት
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        if (response) {
          return response;
        }
        return fetch(event.request).catch(() => {
          // ኢንተርኔት ሲጠፋ የ index.html ገጹን በመመለስ ቀዩ ስክሪን እንዲሰራ ማድረግ
          return caches.match('./index.html');
        });
      })
  );
});
