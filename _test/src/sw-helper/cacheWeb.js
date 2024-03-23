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

  Lib.Storage = require('./storageNative')(Lib, CONFIG);  // Async Storage
  Lib.CacheData = require('./cacheData')(Lib, CONFIG) // Cache data


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

  /********************************************************************
  Download files and add them to the cache.
  
  @param {String} cache_namespace - The namespace of the cache to add the files.
  @param {Set[]} cache_item_list - The list of cache items to be downloaded and added.
  @param {Function} cb - The callback function to be called after downloading and adding the files.
  @param {Function} cb_download_progress - The callback function to track the download progress (not implemented in the code).

  @return none
   *********************************************************************/
  downloadFiles: function(cache_namespace, cache_item_list, cb, cb_download_progress){

    // Callback function for individual file addition
    cb_add_file = function(download_err, cache_namespace, cache_item_data){

      // Check if error occurred during download
      if(download_err){

        cb(download_err);

        // If an error occurred, set the 'download' flag to false
        cache_item_data['download'] = false;

      }  

       // Save resource info in storage
       Lib.Storage.addResourceInfoToStorage(
        cache_namespace, 
        cache_item_data['url'], 
        cache_item_data['filename'],
        Lib.Utils.isNullOrUndefined(download_err), // Download status is determine from error
        function(storage_err){ 

          if(storage_err){
            // Ignore async storage error. Log Error for research
            Lib.Debug.logErrorForResearch(storage_err, cache_item_list[count]['url'], true);
          }          

          // Call download progress 
          // cb_download_progress(count, cache_item_list.length)

        }
      ); // Close: Save resource info in storage

    };

    // Callback function after adding all cache files
    cb_add_files = function(download_err, cache_namespace){
      cb(); // Call the provided callback function to indicate the completion of file download and addition
    };

    // Send a message to the service worker to add the cache resources
    _CacheWeb.postMessageToSeviceWorkerAddResources(cache_namespace, cache_item_list);

  },


  /********************************************************************
   Remove files from the cache.
  
   @param {String} cache_namespace - The namespace of the cache from which files should be removed.
   @param {Set[]} cache_item_list - The list of cache items to be removed.
   @param {Function} cb - The callback function to be called after removing the files.
  
   @return none
   *********************************************************************/
  removeFiles: function(cache_namespace, cache_item_list, cb){

    // Callback function for individual file removal
    cb_remove_file = function(cache_namespace, cache_item, err){

      // Remove resource info from storage
      Lib.Storage.removeResourceInfoFromStorage(
        cache_namespace,
        cache_item,
        function(storage_err){
          
          // Check if there is an error
          if(storage_err){

            //console.log('storage_err demo 2', storage_err);
            // Ignore async storage error. Log Error for research
            //Lib.Debug.logErrorForResearch(storage_err, cache_data_list[count]['url'], true);
          }
        
        }
      ); // Close: Remove resource info from storage 
      
     
    };
    
    // Callback function after removing all cache files
    cb_remove_files = function(cache_namespace){
      cb(); // Call the provided callback function to indicate the completion of file removal
    };

    // Send a message to the service worker to remove the cache resources
    _CacheWeb.postMessageToSeviceWorkerRemoveResources(cache_namespace, cache_item_list);

  },


  /********************************************************************
  Clear the cache for a given cache namespace.

  @param {String} cache_namespace - The namespace of the cache to be cleared.
  @param {Function} cb - The callback function to be called after clearing the cache.

  @return none
  *********************************************************************/
  clearCache: function(cache_namespace, cb){

    // Callback function to clear cache
    cb_clear_cache = function(cache_namespace, err){

      // Retrieve all existing cache items' data from storage 
      Lib.Storage.removeAllResourseInfoFromStorage(cache_namespace, function(err, existing_cache_items_data){
        // Handle any additional logic after removing all resources' information from storage

        cb(); // Call the provided callback function to indicate the completion of cache clearing

      });

    };

    // Send a message to the service worker to clear the cache resources
    _CacheWeb.postMessageToSeviceWorkerClearCache(cache_namespace);

  },


  /********************************************************************
  Register the client event listener for messages from the service worker.
  
  @param none

  @return none
  *********************************************************************/
  clientEventListenerOnMessage: function(){

    // Register the callback function to be executed in the client script
    navigator.serviceWorker.addEventListener('message', _CacheWeb.clientEventListenerHandler);

  },


  /********************************************************************
  Register the service worker.
  
  @param {String} sw_url - The URL of the service worker script.
  @param {Function} cb - The callback function to be called after registering the service worker.
  
  @return none
  *********************************************************************/
  registerServiceWorker: function(sw_url, cb){

    // Register the service worker if the browser supports it
    if ('serviceWorker' in navigator){

      // When the window loads, register the service worker
      window.addEventListener('load', function(){
        navigator.serviceWorker.register(sw_url) // Register the service worker
          .then(function(registration){
            console.log('Service worker registration successful:', registration);

            // Perform additional tasks after successful registration, if needed
            CacheWeb.clientEventListenerOnMessage();

            // Call the callback function to signal completion
            cb(null, registration);
          })
          .catch(function(err){
            cb(err);
            console.error('Error during service worker registration:', err);
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
          console.error(err.message);
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


};
////////////////////////////Public Functions END///////////////////////////////



//////////////////////////Private Functions START//////////////////////////////
const _CacheWeb = { // Private functions accessible within this modules only

  /********************************************************************
  Send a message to the service worker to add resources to the cache.

  @param {String} cache_namespace - The namespace of the cache for adding resources.
  @param {Array} cache_item_list - The list of cache items to be added.

  @return none
  *********************************************************************/
  postMessageToSeviceWorkerAddResources: function(cache_namespace, cache_item_list){

    // Post Message with payload data object
    navigator.serviceWorker.controller.postMessage({
      'action': 'CACHE_ADD_RESOURCES',
      'cache_namespace': cache_namespace,
      'cache_item_list': cache_item_list
    });

  },


  /********************************************************************
  Send a message to the service worker to remove resources from the cache.
  
  @param {String} cache_namespace - The namespace of the cache for the message.
  @param {Set[]} cache_item_list - The list of cache items to be downloaded.
  
  @return none
  *********************************************************************/
   postMessageToSeviceWorkerRemoveResources: function(cache_namespace, cache_item_list){
 
    // Post Message with payload data object
    navigator.serviceWorker.controller.postMessage({
      'action': 'CACHE_REMOVE_RESOURCES',
      'cache_namespace': cache_namespace,
      'cache_item_list': cache_item_list,
    });
   
  },


  /********************************************************************
  Send a message to the service worker to clear cache .
  
  @param {String} cache_namespace - The namespace of the cache for the message.
  
  @return none
  *********************************************************************/
  postMessageToSeviceWorkerClearCache: function(cache_namespace){
 
    // Post Message with payload data object
    navigator.serviceWorker.controller.postMessage({
      'action': 'CACHE_CLEAR_RESOURCES',
      'cache_namespace': cache_namespace
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
  Event handler for messages received from the service worker in the client.

  @param {Object} event - The event object containing the received message.

  @return none
  *********************************************************************/
  clientEventListenerHandler: function(event){

    // check if event have received message
    if (event.data){

      if (event.data.action === 'CB_CACHE_ADD_FILE'){
        // Handle the callback for adding a single file to the cache
        cb_add_file(event.data.error, event.data.cache_namespace, event.data.cache_item);
      }
      else if (event.data.action === 'CB_CACHE_ADD_FILES'){
        // Handle the callback for adding multiple files to the cache
        cb_add_files(event.data.cache_namespace, event.data.cache_item);
      }
      else if (event.data.action === 'CB_CACHE_REMOVE_FILE'){
        // Handle the callback for removing a file from the cache
        cb_remove_file(event.data.cache_namespace, event.data.cache_item, event.data.error);
      }
      else if (event.data.action === 'CB_CACHE_REMOVE_FILES'){
         // Handle the callback for removing all files from the cache
        cb_remove_file(event.data.cache_namespace)
      }
      else if (event.data.action === 'CB_CACHE_CLEAR'){
        // Handle the callback for cache clearing
        cb_clear_cache(event.data.cache_namespace, event.data.error);
      }

    }
    
  },

};/////////////////////////Private Functions END///////////////////////////////
