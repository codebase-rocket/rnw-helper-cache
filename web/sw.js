///////////////////////////Public Functions START//////////////////////////////
const service_worker = {

  /********************************************************************
   Event is fired when an installation is successfully completed

  @param {Set} event - Install event

  @return none
  *********************************************************************/
  onInstall: function(event){

    event.waitUntil(
      caches.open('jquery').then(function(cache) {
        return cache.addAll([
          'https://cdnjs.cloudflare.com/ajax/libs/jquery/3.4.1/jquery.min.js',
          // Add other URLs to cache as needed
        ]);
      })
    );

    self.skipWaiting()

  },


  /********************************************************************
  Execute this function to activate service worker

  @param {Set} event - Activate event

  @return none
  *********************************************************************/
  onActivate: function(event){

    event.waitUntil(
      Promise.all([
        self.clients.claim(),
        //caches.open(cache_namespace)
      ])
    );
  },


  /********************************************************************
  Execute this function to fetch url

  @param {Set} event - Activate event

  @return none
  *********************************************************************/
  onFetch: function(event){

    if(navigator.onLine){
      // Check if the request is an image request
      if (service_worker.isNotModifiableRequest(event.request)) {
        event.respondWith(service_worker.fetchNotModifiableRequest(event.request));
      } else {
        //event.respondWith(fetch(event.request));
      }
    }



  },



  /********************************************************************
  Execute this function to check not modifiable requesr

  @param {Set} request -Network request

  @return none
  *********************************************************************/
  isNotModifiableRequest: function(request) {

    // Check if the URL ends with common image js and css extensions
    const url_ext = ['.jpg', '.jpeg', '.png', '.gif', '.js', '.css', '.mp4 '];
    // Check if url extextion match above extension
    if (url_ext.some(ext => request.url.endsWith(ext))) {
      return true;
    }

    return false;
  },


  /********************************************************************
  Execute this function to fetch network request

  @param {Set} request -Network request

  @return none
  *********************************************************************/
  fetchNotModifiableRequest: function(request) {

      return caches.match(request).then(function (response) {
        if (response) {
          return response; // Return the cached image response
        }

        return fetch(request)
      });
    },


};////////////////////////////Public Functions END///////////////////////////////


//////////////////////////Private Functions START//////////////////////////////
const _service_worker = {


  /********************************************************************
  Perform the action to skip waiting and activate the service worker

  Params - none

  @return none
  *********************************************************************/
  SkipWaiting: function(){

    // Perform the action to skip waiting and activate the service worker
    self.skipWaiting();

  },

};/////////////////////////Private Functions END///////////////////////////////

  // Install event listener
  self.addEventListener('install', service_worker.onInstall);

  // Activate event listener
  self.addEventListener('activate', service_worker.onActivate);

  // Fetch event listener
  self.addEventListener('fetch', service_worker.onFetch);
