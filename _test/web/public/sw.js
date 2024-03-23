///////////////////////////Public Functions START//////////////////////////////
const service_worker = {

  /********************************************************************
   Event is fired when an installation is successfully completed

  @param {Set} event - Install event

  @return none
  *********************************************************************/
  onInstall: function(event){

    // Method to delay the completion of the installation until all the specified asynchronous tasks are completed
    // event.waitUntil(
    //   caches.open('CACHE_NAME_v_1') // Open the cache with a specific name ('CACHE_NAME4')
    //     .then(function(cache){
    //       console.log('cachecachecache', cache);
    //       cache.addAll([
    //       // "./",
    //       // "./index.html",
    //       // //"/root.js",
    //       ])
    //     })
    // );

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

    // Check if the request is an image request
    if (service_worker.isNotModifiableRequest(event.request)) {
      event.respondWith(service_worker.fetchNotModifiableRequest(event.request));
    } else {
      //event.respondWith(fetch(event.request));
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



  /********************************************************************
  Execute this function to fetch incoming urls

  @param {Set} event - Fetch event

  @return none
  *********************************************************************/
  // onFetch: function(event){

  //   event.respondWith(
  //     caches.match(event.request)
  //       .then(function(response){

  //         // If the cache contains a match for the request, return the cached response
  //         if (response){
  //           return response;
  //         }

  //         // If the cache does not contain a match, fetch the request from the network
  //         return fetch(event.request)

  //       })
  //       .catch(function(error){
  //         // Handle any errors that occur during caching or network fetch
  //         console.error('Error:', error);
  //         // Optionally, you can provide a fallback response here
  //       })
  //   );

  // },


  /********************************************************************
  Execute this function to handle service worker message events.

  @param {Set} event - The message event received by the service worker.

  @return none
 *********************************************************************/
  serviceWorkerEventListenerOnMessage: function(event){

    if(event.data && event.data.action === 'CACHE_ADD_RESOURCES'){
      // Call the function to download files with the provided cache namespace and cache item list
      _service_worker.downloadFiles(event.data.cache_namespace, event.data.cache_item_list);
    }

    else if( event.data && event.data.action === 'CACHE_REMOVE_RESOURCES' ){
      // Call the function to remove files with the provided cache namespace and cache item list
      _service_worker.removeFile(event.data.cache_namespace, event.data.cache_item_list);
    }

    else if( event.data && event.data.action === 'CACHE_CLEAR_RESOURCES' ){
      // Call the function to clear the cache with the provided cache namespace
      _service_worker.clearCache(event.data.cache_namespace);
    }

    else if( event.data && event.data.action === 'SKIP_WAITING' ){
      // Call the function to skip waiting and activate the service worker
      _service_worker.SkipWaiting();
    }

  }

};////////////////////////////Public Functions END///////////////////////////////


//////////////////////////Private Functions START//////////////////////////////
const _service_worker = {

  /********************************************************************
  Download files from a given URL and save it to browser cache

  @param {String} cache_namespace - Message event
  @param {Set} cache_item_list - Message event

  @return none
  *********************************************************************/
  downloadFiles: function(cache_namespace, cache_item_list){

    caches.open(cache_namespace) // Open the cache with a specific cache namespace (ex: 'CACHE_NAME4')
      .then(function(cache){

        // Wait for all the promises from the cache.add()
        Promise.all(

          // Iterates each cache item from cache_item_list
          cache_item_list.map(function(cache_item){

            // Download file to cache from urls
            return cache.add(cache_item.url)

              // URL is cached successfully
              .then(function(){
                console.log('Cached successfully: ' + cache_item);

                // TODO: // Post callback function to be executed in the client script
                // Post each url cache success callback to be executed in the client script
                _service_worker.postMessageCbDownloadFile(cache_namespace, cache_item, null)

              })
              .catch(function(err){
                console.log('err was: ', err);
                // Post each url cache err callback to be executed in the client script
                _service_worker.postMessageCbDownloadFile(cache_namespace, cache_item, err)

              });

          })
        )
        .then(function(){
          console.log('All URLs cached successfully.');
          // Post overall success callback to be executed in the client script
          _service_worker.postMessageCbDownloadFiles(cache_namespace, null)

        })
        .catch(function(err){
          console.err('Failed to cache one or more URLs:', err);
          // Post overall error callback to be executed in the client script
           _service_worker.postMessageCbDownloadFiles(cache_namespace, err)
        });

      })

  },


  /********************************************************************
  Callback function to execute on each file download.
  Execute this function to pass a message and perform an action.

  @param {String} cache_namespace - The namespace for the cache event
  @param {Set} cache_item - The cache item for the event
  @param {Set} err - The error message for the event

  @return none
  *********************************************************************/
  postMessageCbDownloadFile: function(cache_namespace, cache_item, err){

    // Get all clients
    self.clients.matchAll().then(function(clients){
      console.log('clients', clients);

      // Iterate over each client
      clients.forEach(function(client){
        client.postMessage({
          'action': 'CB_CACHE_ADD_FILE',
          'cache_namespace' : cache_namespace,
          'cache_item': cache_item,
          'error': err
        });
      });
    });

  },


  /********************************************************************
  Callback function to execute on all files download.
  Execute this function to pass a message and perform an action.

  @param {String} cache_namespace - Message event

  @return none
  *********************************************************************/
  postMessageCbDownloadFiles: function(cache_namespace){

    self.clients.matchAll().then(function(clients){
      console.log('clients', clients);
      clients.forEach(function(client){
        client.postMessage({
          'action': 'CB_CACHE_ADD_FILES',
          'cache_namespace' : cache_namespace,
        });
      });
    });

  },



  /********************************************************************
  Remove files browser cache

  @param {String} cache_namespace - The namespace for the cache event
  @param {Set} cache_item_list - The cache item list for the event
t

  @return none
  *********************************************************************/
  removeFile: function(cache_namespace, cache_item_list){

    // Open the cache with a specific cache namespace (ex: 'CACHE_NAME4')
    caches.open(cache_namespace)
      .then(function(cache){

        // Wait for all the promises from the cache.delete()
        Promise.all(

          // Iterates each cache item from cache_item_list
          cache_item_list.map(function(cache_item){

            // Remove file from cache
            return cache.delete(cache_item.url)

              // URL is removed successfully
              .then(function(){
                console.log('Removed successfully: ' + cache_item);

                // TODO: // Post callback function to be executed in the client script
                // Post each url cache success callback to be executed in the client script
                _service_worker.postMessageCbRemoveFile(cache_namespace, cache_item, null);

              })
              .catch(function(err){
                console.log('err was: ', err);
                // Post each url cache err callback to be executed in the client script
                _service_worker.postMessageCbRemoveFile(cache_namespace, cache_item, err);

              });

          })
        )
        .then(function(){
          console.log('All URLs cached successfully.');
          // Post overall success callback to be executed in the client script
          _service_worker.postMessageCbRemoveFiles(cache_namespace)
        })
        .catch(function(err){
          console.err('Failed to cache one or more URLs:', err);
          // Post overall error callback to be executed in the client script
          // No post message required
        });

      })

  },


  /********************************************************************
  Callback function to execute on each file removed.
  Send a message to clients to signal cache file removal completion.

  @param {String} cache_namespace - Message event
  @param {Set} cache_item - Message event
  @param {Set} err - Message event

  @return none
  *********************************************************************/
  postMessageCbRemoveFile: function(cache_namespace, cache_item, err){

    self.clients.matchAll().then(function(clients){
      clients.forEach(function(client){
        client.postMessage({
          'action': 'CB_CACHE_REMOVE_FILE',
          'cache_namespace' : cache_namespace,
          'cache_item': cache_item,
          'error': err
         });
      });
    });

  },


  /********************************************************************
  Callback function to execute when all files removed.
  Send a message to clients to signal cache file removal completion.

  @param {String} cache_namespace - Message event

  @return none
  *********************************************************************/
  postMessageCbRemoveFiles: function(cache_namespace){

    self.clients.matchAll().then(function(clients){
      clients.forEach(function(client){
        client.postMessage({
          'action': 'CB_CACHE_REMOVE_FILES',
          'cache_namespace' : cache_namespace,
         });
      });
    });

  },


  /********************************************************************
  Clear all cache.

  @param - none

  @return none
  *********************************************************************/
  clearCache: function(cache_namespace){

    // Retrieve all cache names
    caches.keys()
      .then(function(cache_names){
        var cache_deletion_promises = [];

        cache_names.forEach(function(cache_name){
          if (cache_name.startsWith(cache_namespace)){
            // Delete the cache with the matching namespace
            cache_deletion_promises.push(caches.delete(cache_name));
          }
        });

        return Promise.all(cache_deletion_promises);
      })
      .then(function(){
        console.log('Cache cleared successfully for namespace:', cache_namespace);
        // Callback to handle cache clearing completion
        _service_worker.postMessageCbClearCache(null, cache_namespace);
      })
      .catch(function(err){
        console.error('Cache clearing failed:', err);
        // Callback to handle cache error
        _service_worker.postMessageCbClearCache(err);
    });


  },


  /********************************************************************
  Send a message to clients to signal cache clearing completion.

  @param {Set} event - Message event

  @return none
  *********************************************************************/
  postMessageCbClearCache: function(err, cache_namespace){

    // Retrieve all clients.
    self.clients.matchAll().then(function(clients){
      console.log('clients', clients);
      // Send a message to each client.
      clients.forEach(function(client){
        client.postMessage({
          'action': 'CB_CACHE_CLEAR',
          'cache_namespace': cache_namespace,
          'error': err
        });
      });
    });

  },



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

  // Message event listener
  //self.addEventListener('message', service_worker.serviceWorkerEventListenerOnMessage);
