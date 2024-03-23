// Info: Cache Web - Utility functions related to service worker registration
'use strict';

// Shared Dependencies (Managed by Loader)
var Lib

// Exclusive Dependencies
var CONFIG;

// Callback
var cb_add_file;
var cb_add_files;
var cb_remove_file;
var cb_remove_files;
var cb_clear_cache;


/////////////////////////// Module-Loader START ////////////////////////////////

/********************************************************************
Load dependencies and configurations

@param {Set} shared_libs - Reference to libraries already loaded in memory by other modules
@param {Set} config - Custom configuration in key-value pairs

@return nothing
*********************************************************************/
const loader = function(shared_libs, config){

  // Shared Dependencies (Managed my Main Entry Module)
  Lib = shared_libs;

  // Configuration (Managed my Main Entry Module)
  CONFIG = config;

};

//////////////////////////// Module-Loader END /////////////////////////////////

///////////////////////////// Module Exports START /////////////////////////////
// Export Public Funtions of this module
module.exports = function (shared_libs, config){

  // Run Loader
  loader(shared_libs, config);

  // Return Public Funtions of this module
  return CacheWeb

};//////////////////////////// Module Exports END //////////////////////////////



///////////////////////////Public Functions START//////////////////////////////
const CacheWeb = { // Public functions accessible by other modules

  /**********************************************************************
  Download files from a list of URLs.

  @param {Function} cb - The callback function to be called after all files have been downloaded.
  @param {Function} cb_download_progress - The callback function to track the download progress (not implemented in the code).
  @param {String} cache_namespace - The cache namespace to use.
  @param {Set[]} cache_item_list - The list of URLs to be downloaded.

  @return none
**********************************************************************/
  downloadFiles: function(cb, cb_download_progress, cache_namespace, cache_item_list, is_auth_required){

    // Start downloading files using the provided options
    _CacheWeb.downloadFilesToCache(
      cb,
      cb_download_progress,
      cache_namespace,
      cache_item_list,
      is_auth_required
    );
  },


  /**********************************************************************
  Remove multiple files from the cache .

  @param {Function} cb - The callback function to be called after all files are removed.

  @param {String} cache_namespace - The cache namespace to use.
  @param {Set[]} cache_item_list - List of items to be removed from the cache.

  @return Through callback
  **********************************************************************/
  removeFiles: function(cb, cache_namespace, cache_item_list){

    // Remove Files from cache
    _CacheWeb.removeFileFromCache(
      cb,
      cache_namespace,
      cache_item_list
    );

  },


  /********************************************************************
  Clear the cache for a given cache namespace.

  @param {String} cache_namespace - The namespace of the cache to be cleared.
  @param {Function} cb - The callback function to be called after clearing the cache.

  @return none
  *********************************************************************/
  clearCache: function(cb, cache_namespace){

    // Get all cache keys
    caches.keys()
      .then(function(cache_names){
        return Promise.all(

          // Iterate all cache_namespace
          cache_names.map(function(cache_name){

            // Check if the cache name matches the target namespace
            if (cache_name === cache_namespace){
              // Delete the cache
              return caches.delete(cacheName);
            }

          })

        );
      })
      .then(function(){
        cb(null);
      })
      .catch(function(error){
        cb(null);
      });


  },


  /********************************************************************
  Clear the cache for a given cache namespace.

  @param {String} cache_namespace - The namespace of the cache to be cleared.
  @param {Function} cb - The callback function to be called after clearing the cache.

  @return none
  *********************************************************************/
  clearAllCache: function(cb, cache_namespace){

    // Retrieve all cache names
    caches.keys()
    .then(function(cache_names){

      // Iterate all cache names from cache storarge
      cache_names.forEach(function(cache_name){

        if(cache_name != 'jquery'){
          // Delete cache one by one
         caches.delete(cache_name);

        }

      });

    })
    .then(function(){
      // Callback to handle cache clearing completion
      cb(null);

    })
    .catch(function(err){

      // Callback to handle cache error
      cb(err);

    });


  },


  /********************************************************************
  Register the service worker.

  @param {String} sw_url - The URL of the service worker script.
  @param {Function} cb - The callback function to be called after registering the service worker.

  @return none
  *********************************************************************/
  registerServiceWorker: function(cb, sw_url){

    // Register the service worker if the browser supports it
    if ('serviceWorker' in navigator){

      // When the window loads, register the service worker
      window.addEventListener('load', function(){
        navigator.serviceWorker.register(sw_url) // Register the service worker
          .then(function(registration){
            // Perform additional tasks after successful registration, if needed
            _CacheWeb.postMessageToSeviceWorkerSkipWaiting()
            // Call the callback function to signal completion
            cb(null, registration);
          })
          .catch(function(err){
            cb(err);
          });
      });

    }

  },


  /********************************************************************
  Unregister the service worker.

  @param {Function} cb - The callback function to be called after unregistering the service worker.

  @return none
  *********************************************************************/
  unregisterServiceWorker: function(cb){

    // Register the service worker if the browser supports it
    if ('serviceWorker' in navigator){

      // Wait for the service worker to be ready
      navigator.serviceWorker.ready
        .then(function(registration){
          // Unregister the service worker
          registration.unregister();
          // Call the callback function to signal completion
          cb(null, registration);
        })
        .catch(function(err){

          // Call the callback function to signal error
          cb(err);
          // Handle any errors that occur during service worker unregistration
          //console.error(err.message);
        });

    }


  },


  /********************************************************************
  Request the service worker to skip waiting and activate the new version.

  @params - none

  @return none
  *********************************************************************/
  skipWaiting: function(){

    // Send a message to the service worker to skip waiting and activate the new version
    _CacheWeb.postMessageToSeviceWorkerSkipWaiting();

  },


  /********************************************************************
  Retrieve a json/binary file from a specific cache namespace and key.

  @param {Function} cb - Callback function to handle the result.

  @param {String} cache_namespace - The namespace of the cache where the file is stored.
  @param {String} url - The URL of the file you want to retrieve from the cache.
  @param {Boolean} is_json - Flag indicating whether the file is in JSON format.

  @return none
  *********************************************************************/
  getFileFromCache: function(cb, cache_namespace, cache_data, is_json){

    // Open the specified cache namespace to work with cache storage
    caches.open(cache_namespace).then(function(cache){

      // Try to retrieve data from the cache by its key (URL).
      cache.match(cache_data.url).then(function(response){

          // Check if the response is not found in the cache
          if(Lib.Utils.isNullOrUndefined(response)){

              // If data is not found in the cache, pass null to the callback function.
              return cb(null);

          }

          // Check if the file is expected to be in JSON format
          if (is_json && response){

              // Read the cached file data and return it in JSON format
              response.json()
                  .then(function(data){

                      cb(data);

                       // Return JSON data to the callback
                  })
                  .catch(function(err){
                      cb(null); // In case of an error, return JSON as null
                  });

          }
          // else {
          //     // For files other than JSON, use the cached data as-is (non-JSON).
          //     response.blob().then(function(data){
          //         console.log('Data retrieved from cache:', data);
          //         cb(data); // Return data as it is
          //     });
          // }
      });

    });


  },

};
////////////////////////////Public Functions END///////////////////////////////



//////////////////////////Private Functions START//////////////////////////////
const _CacheWeb = { // Private functions accessible within this modules only

  /**********************************************************************
  Check if files are downloadable.

  @param {Function} cb - The callback function to be called after checking all the files.
  @param {Function} cb_download_progress - The callback function to track the download progress (not implemented in the code).

  @param {String} cache_namespace - This parameter will be ignored in this implementation since we're not using cache.
  @param {Set[]} cache_item_list - The list of URLs to be checked for download.

  @param {number} cache_item_index - The current index in the cache_item_list.

  @return none
  **********************************************************************/
  downloadFilesToCache: function(
    cb, cb_download_progress,
    cache_namespace, cache_item_list,
    is_auth_required,
    response_err = null,
    cache_item_index = 0
  ){

    //var response_err = null
    // Check if no item left to be cached
    if( cache_item_index >= cache_item_list.length ){
      return cb(response_err);
    }

    // Iterate and cache file using url
    _CacheWeb.downloadFileToCache(
      function(download_err){

        // Check if there is an error during fetch operation
        // if(download_err){
        //   cb(download_err);
        // }
        // Set response error so that error handling can be done on client side

        if(!_CacheWeb.isOnline()){
          response_err = [CONFIG['NETWORK_ERROR']]
        }
        else{
          response_err = download_err;
        }

        // Save resource info in storage
        Lib.Storage.addResourceInfoToStorage(
          function(storage_err){

            // if(storage_err){
            //   // Ignore async storage error. Log Error for research
            //   Lib.Debug.logErrorForResearch(storage_err, cache_item_list[cache_item_index]['url'], true);
            // }

            // Call download progress
            cb_download_progress(cache_item_index + 1);

            // Increment counter for cache item
            cache_item_index = cache_item_index + 1;

            // Recursively call when one file is being cached
            _CacheWeb.downloadFilesToCache(
              cb,
              cb_download_progress,
              cache_namespace,
              cache_item_list,
              is_auth_required,
              response_err,
              cache_item_index
            );

          },
          cache_namespace,
          cache_item_list[cache_item_index]['url'],
          cache_item_list[cache_item_index]['filename'],
          cache_item_list[cache_item_index]['is_modifiable'],
          null, // last-modified is automatically managed in browser
          Lib.Utils.isNullOrUndefined(download_err), // Download status is determine from error
        ); // Close: Save resource info in storage

      },
      cache_namespace,
      cache_item_list[cache_item_index]['url'],
      is_auth_required
    );

  },


  /********************************************************************
  Event handler for fetching resources.

  This function intercepts network requests. If the requested resource
  is available in the cache with a "Last-Modified" header, it checks
  with the server if an updated version is available. If not, or if
  the server confirms the cached version is still the latest, it returns
  the cached version. Otherwise, it fetches from the network.

  @param {FetchEvent} event - The fetch event triggered by a network request.

  @return {Response} - Returns the cached or network response.
  *********************************************************************/
  downloadFileToCache: function(cb, cache_namespace, url, is_auth_required ){

    // Define request options for fetch requests
    var request_options = {
      'method': 'GET' // Adjust the HTTP method if needed
    };

    if(is_auth_required){
      //request_options['method'] = 'GET', // Adjust the HTTP method if needed
      request_options['credentials'] = 'include' // Send cookies with the request
    }

    // Attempt to retrieve the requested resource from the cache.
    caches.match(url)
      .then(function(cached_response){

        // Check for a cached response and presence of 'Last-Modified' header.
        if( cached_response && cached_response.headers.has('Last-Modified') ){

          // Get previous 'Last-Modified' header value
          let last_modified = cached_response.headers.get('Last-Modified');

          // Merge 'If-Modified-Since' header with existing headers in options.
          let modified_options = {
            ...request_options,
            headers: {
              //...request_options.headers,
              'If-Modified-Since': last_modified
            }
          };

          // Fetch resource with the 'If-Modified-Since' header to check for updates.
          fetch(url, modified_options)
            .then(function(network_response){

              // 304 status indicates cached version is still latest.
              if( network_response.status === 304 ){

                cb(null, true); // Success: Use cached version.
              }

              else if(!_CacheWeb.isOnline()){
                cb([CONFIG['NETWORK_ERROR']])
              }

              // Cache the updated version for future use.
              else {

                // Check network-response and save in cache storage
                _CacheWeb.saveNetworkResponseToCache(cb, cache_namespace, url, network_response);

              }

            })
            .catch(function(error){

              // Check if window is running in offline mode
              if(!_CacheWeb.isOnline()){
                cb([CONFIG['NETWORK_ERROR']])
              }
              else{
                cb(error); // Error during fetch with 'If-Modified-Since'.
              }

            }); // Close fetch

        }

        // Directly fetch resource if not in cache or if it lacks 'Last-Modified' header.
        else {
          fetch(url, request_options)
            .then(function(network_response){

              // Check network-response and save in cache storage
              _CacheWeb.saveNetworkResponseToCache(cb, cache_namespace, url, network_response);

            })
            .catch(function(error){

              // Check if window is running in offline mode
              if(!_CacheWeb.isOnline()){
                cb([CONFIG['NETWORK_ERROR']])
              }
              else{
                cb(error); // Error during fetch with 'If-Modified-Since'.
              }

            }); // Close fetch

        }

      })
      .catch(function(error){

        // Check if window is running in offline mode
        if(!_CacheWeb.isOnline()){
          cb([CONFIG['NETWORK_ERROR']])
        }
        else{
          cb(error); // Error during fetch with 'If-Modified-Since'.
        }

      });

  },



  /**********************************************************************
  Save a network-response to the cache if it's a successful response (status code between 200 and 299).

  @param {Function} cb - The callback function to be called after the response is saved.
  @param {String} cache_namespace - The cache namespace to use.
  @param {Response} network_response - The network response to be saved.

  @return none
  **********************************************************************/
  saveNetworkResponseToCache: function(cb, cache_namespace, url, network_response){

    // Save a network-response to the cache if the network-response is in the 200-299 status code range
    if(network_response.ok){

      // Open cache with given namespace
      caches.open(cache_namespace)
        .then(function(cache){

          // Return response and put in cache against given cache namespace
          return cache.put(url, network_response.clone());

        })
        .then(function(){
          // Cache update successful
          cb(null);
        })
        .catch(function (error){
           // Check if window is running in offline mode
          if(!_CacheWeb.isOnline()){
            cb([CONFIG['NETWORK_ERROR']])
          }
          else{
            cb(error); // Error during fetch with 'If-Modified-Since'.
          }
          // cb(error); // Error during caching.
        });

    }
    else {

      if(!_CacheWeb.isOnline()){
        cb([CONFIG['NETWORK_ERROR']])
      }
      else{
        cb(network_response); // Error during fetch with 'If-Modified-Since'.
      }

    }

  },


  /**********************************************************************
  Remove multiple files from the cache.

  @param {Function} cb - The callback function to be called after all files are removed.
  @param {String} cache_namespace - The cache namespace to use.
  @param {Array} cache_item_list - List of items to be removed from the cache.
  @param {Number} cache_item_index - (Optional) Index of the item to start with (default is 0).

  @return none
  **********************************************************************/
  removeFilesFromCache: function(cb, cache_namespace, cache_item_list, cache_item_index = 0){

    // Check if all items have been removed from the cache
    if (cache_item_index >= cache_item_list.length){
      return cb(null);
    }

    _CacheWeb.removeFileFromCache(
      function (remove_err){

        // Remove resource info from storage
        Lib.Storage.removeResourceInfoFromStorage(
          function(storage_err){

            // Check if there is an error
            if(storage_err){

              //console.log('storage_err demo 2', storage_err);
              // Ignore async storage error. Log Error for research
              //Lib.Debug.logErrorForResearch(storage_err, cache_data_list[count]['url'], true);
            }

            // Increment the counter
            cache_item_index = cache_item_index + 1;

            // Recursively call  to process the next item
            _CacheWeb.removeFilesFromCache(
              cb,
              cache_namespace,
              cache_item_list,
              cache_item_index
            );

          },
          cache_namespace,
          cache_item_list['cache_item_index']
        ); // Close : Remove cache item form local storage

      },
      cache_namespace,
      cache_item_list[cache_item_index]['url']
    );

  },


  /**********************************************************************
  Save a network-response to the cache if it's a successful response (status code between 200 and 299).

  @param {Function} cb - The callback function to be called after the response is saved.

  @param {String} cache_namespace - The cache namespace to use.
  @param {Url} url - url which is to be removed.

  @return none
  **********************************************************************/
  removeFileFromCache: function(cb, cache_namespace, url){

    // Open the cache with a specific cache namespace
    caches.open(cache_namespace)
      .then(function (cache){

        // Remove the file from cache
        return cache.delete(url)
          .then(function (){
            cb(null);
          })
          .catch(function (err){
            cb(err);
          });

      });

  },


  /********************************************************************
  Send a message to the service worker to skip waiting.

  @param - none

  @return none
  *********************************************************************/
  postMessageToSeviceWorkerSkipWaiting: function(){

    // Return the payload data object for the message
    navigator.serviceWorker.controller.postMessage({
      action: 'SKIP_WAITING',
    });

  },


  /********************************************************************
  Check if there is an internet connection

  Param - none

  @return {Boolean}- true in case of there is an internet connection
  *********************************************************************/
  isOnline: function(){
    return window.navigator.onLine
  },
};/////////////////////////Private Functions END///////////////////////////////
