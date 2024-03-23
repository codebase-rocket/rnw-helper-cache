

self.addEventListener('install', function(event) {

  var urls =[
    '/',
    '/index.html',
    'https://placehold.co/621x450/000000/FFFFFF.png',
    'https://placehold.co/621x487/222222/FFFFFF.png',
    'https://placehold.co/621x402/444444/FFFFFF.png',
    'https://placehold.co/621x401/666666/FFFFFF.png',
    'https://placehold.co/621x406/888888/FFFFFF.png',
    'https://placehold.co/600x400/888888/FFFFFF.png',
    'https://placehold.co/600x407/CCCCCC/FFFFFF.png',
    // 'https://placehold.co/600x400/EEEEEE/FFFFFF.png',
  ]
console.log('snclksncslkcnls cache-v2', event);


  event.waitUntil(
    caches.open('cache-v2')
      .then(function(cache) {
        console.log('cache', cache);
        return Promise.all(
          urls.map(function(url) {
            return cache.add(url).then(function() {
              console.log('Cached successfully: ' + url);
              // saveCacheInfo(url, true, function(err) {
              //   if(err) {
              //     console.log('Failed to save cache info: ', err);
              //   }
              // });
            }).catch(function(error) {
              console.log('Failed to cache: ' + url);
              console.log('Error was: ', error);
              // saveCacheInfo(url, false, function(err) {
              //   if(err) {
              //     console.log('Failed to save cache info: ', err);
              //   }
              // });
            });
          })
        );
      })
  );
});



self.addEventListener('activate', function(event) {
  event.waitUntil(
    Promise.all([
      self.clients.claim(),
      caches.open('cache-v2')
    ])
  );
});


self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request)
      .then(function(response) {
        // If the cache contains a match for the request, return the cached response
        if (response) {
          return response;
        }

        // If the cache does not contain a match, fetch the request from the network
        return fetch(event.request);
      })
      .catch(function(error) {
        // Handle any errors that occur during caching or network fetch
        console.error('Error:', error);
        // Optionally, you can provide a fallback response here
      })
  );
});
