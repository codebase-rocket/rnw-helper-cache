// Info: Cache Web - Utility functions related to service worker registration
'use strict';

// Shared Dependencies (Managed by Loader)
var Lib

  // Exclusive Dependencies
var CONFIG;

var cb_add_file
var cb_add_files
var cb_remove_file
var cb_remove_files
var cb_clear_cache


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
  Downloads files from cache_item_list and saves resource information in storage.

  @param {Function} cb - Callback function to be called after all files are downloaded

  @return none
  *********************************************************************/
  downloadFiles: function(cache_namespace, cache_item_list, cb, cb_download_progress){

    cb_add_file = function(download_err, cache_item_data){
      console.log('cnsjcsd err', download_err);
      console.log('cnsjcsd', cache_item_data);
      
      // Save resource info in storage
      // Lib.Storage.addResourceInfoToStorage(
      //   data.cache_namespace, 
      //   data.url, 
      //   data.filename,
      //   Lib.Utils.isNullOrUndefined(download_err), // Download status is determine from error
      //   function(storage_err){ 

      //     if(storage_err){
      //       // Ignore async storage error. Log Error for research
      //       console.log(storage_err);
      //       //Lib.Debug.logErrorForResearch(storage_err, cache_item_list[count]['url'], true);
      //     }          

      //     // Call download progress 
      //    // cb_download_progress(count, cache_item_list.length)


      //   }
      // ); // Close: Save resource info in storage
             


    // Individual cb on success or fail
    },

    cb_add_files = function(){
      cb();
    }

    _CacheWeb.postMessageToServiceWorker(
      'CACHE_ADD_RESOURCES', 
      cache_namespace, 
      cache_item_list, 
      cb_add_file
    )

  },


  /********************************************************************
  Downloads files from cache_item_list and saves resource information in storage.

  @param {Function} cb - Callback function to be called after all files are downloaded

  @return none
  *********************************************************************/
  removeFiles: function(cache_namespace, cache_item_list, cb){

    console.log('cache_item_list', cache_item_list);


    // filter which url_list (unavailable_cache_data_list) needs to be downloaded

    _CacheWeb.postMessageToServiceWorker(
      'CACHE_REMOVE_RESOURCES',
      cache_namespace, 
      cache_item_list, 
      function(download_err, data){        
        // Save resource info in storage
       
      // Individual cb on success or fail
      },
      cb
    )

  },


  /********************************************************************
  Downloads files from cache_item_list and saves resource information in storage.

  @param {Function} cb - Callback function to be called after all files are downloaded

  @return none
  *********************************************************************/
  clearCache: function(cache_namespace, cache_item_list, cb){

    console.log('cache_item_list', cache_item_list);


    // filter which url_list (unavailable_cache_data_list) needs to be downloaded

    _CacheWeb.postMessageToServiceWorker(
      'CACHE_ADD_RESOURCES',
      cache_namespace, 
      cache_item_list, 
      function(download_err, data){
        console.log('cnsjcsd err', err);
        console.log('cnsjcsd', data);
        
        // Save resource info in storage
        Lib.Storage.addResourceInfoToStorage(
          data.cache_namespace, 
          data.url, 
          data.filename,
          Lib.Utils.isNullOrUndefined(download_err), // Download status is determine from error
          function(storage_err){ 

            if(storage_err){
              // Ignore async storage error. Log Error for research
              console.log(storage_err);
              //Lib.Debug.logErrorForResearch(storage_err, cache_item_list[count]['url'], true);
            }          

            // Call download progress 
            cb_download_progress(count, cache_item_list.length)

            // Increment Counter
            count++;  

          }
        ); // Close: Save resource info in storage
               


      // Individual cb on success or fail
      },
      function(){
      // cb on task completion

      // delete cache data which is not is being used (unused_cache_data_list)
      // _CacheWeb.postMessageToDeleteItemFromCache(
      //   namespace,
      //   url_list, // unused_cache_data_list
      //   function(){

      //   },
      //   function(){

      //   }
      // )

      }
    )

  },



  /********************************************************************
  Register the service worker

  @param {Function} cb - Callback function to be called after succesfull registration

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
          // Call the callback function to signal completion
          cb(null, registration);
        })
        .catch(function(err){
          cb(err)
          console.error('Error during service worker registration:', err);
        });
    });

  }

  },


  /********************************************************************
  Downloads files from cache_item_list and saves resource information in storage.

  @param {Function} cb - Callback function to be called after all files are downloaded

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

};
////////////////////////////Public Functions END///////////////////////////////



//////////////////////////Private Functions START//////////////////////////////
const _CacheWeb = { // Private functions accessible within this modules only


  /********************************************************************
  Send the message with the data payload

  @param {Set} data - Resource Information

  @return none
  *********************************************************************/
  postMessageToServiceWorker: function(action, cache_namespace, cache_item_list, individual_cb, cb){

    if('serviceWorker' in navigator){
      // Send the message with the data payload
      navigator.serviceWorker.controller.postMessage(
        {
          action: action,
          cache_namespace: cache_namespace,
          cache_item_list: cache_item_list,
        }
      );

      // Register the callback function to be executed in the client script
      navigator.serviceWorker.addEventListener('message', function(event){

        if(event.data && event.data.action === action){

          if(event.data.success){
            individual_cb(null, event.data.data);
          }
          else{
            individual_cb(event.data.error, null);
          }
       
        }
       
      });
    }

  },


  /********************************************************************
  Execute this function to pass message  TODO - improve comment

  @param {Set} event - Message event

  @return none
  *********************************************************************/
  clientEventListenerOnMessage: function(event, individual_cb){

    if(event.data && event.data.action === 'CB_CACHE_ADD_RESOURCES'){
      return _serviceWorker.onMessageAddResourceToCache(event)
    }
    else if( event.data && event.data.type === 'SKIP_WAITING' ){
      return _serviceWorker.onMessageSkipWaiting(event);
    } 
    else if( event.data && event.data.type === 'DELETE_RESOURCE_FROM_CACHE' ){
      return _serviceWorker.onMessageDeleteResourceFromCache(event);
    }
   

  },


  //"cb_cache_add_resourses"
  // "cb_cache_add_resourse"


  /********************************************************************
  Send the message with the data payload

  @param {String} namespace - Namespace
  @param {Set[]} data - Resource Information

  @return none
  *********************************************************************/
  postMessageToDeleteItemFromCache: function(namespace, urls, individual_cb, cb){

    var data = _CacheData.createCacheDataToDeleteResource(namespace, urls, individual_cb, cb);

    if('serviceWorker' in navigator){
      // Send the message with the data payload
      navigator.serviceWorker.controller.postMessage(data);

    }

  },


  /********************************************************************
  Send the message with the data payload

  @param {String} namespace - Namespace
  @param {Set[]} data - Resource Information

  @return none
  *********************************************************************/
  postMessageToRmoveAllResource: function(namespace){

    var data = _CacheData.createCacheDataToRmoveAllResource(namespace);

    if('serviceWorker' in navigator){
      // Send the message with the data payload
      navigator.serviceWorker.controller.postMessage(data);

    }

  },

};/////////////////////////Private Functions END///////////////////////////////



//////////////////////////Private Functions START//////////////////////////////
const _CacheData = { // Private functions accessible within this modules only

  /********************************************************************
  Create Cache Data Object to be added in cache.
  Constructs and returns an object with properties for cache data.

  @param {String} url - The URL of the resource 
  @param {String} namespace - Namespace
 
  @return {Object} - Cache data object 
  *********************************************************************/
  createCacheDataToAddResource: function(cache_namespace, cache_item_list, individual_cb, cb){
 
    // Return cache data
    return  {
      action: 'ADD_RESOURCE_TO_CACHE',
      cache_item_list: cache_item_list,
      cache_namespace: cache_namespace,
    };

  },


  /********************************************************************
  Create Cache Data Object to be removed from cache.
  Constructs and returns an object with properties for cache data.

  @param {String} url - The URL of the resource 
  @param {String} namespace - Namespace
 
  @return {Object} - Cache data object 
  *********************************************************************/
  createCacheDataToDeleteResource: function(namespace, urls, individual_cb, cb){
   
    // Return cache data
    return  {
      action: 'DELETE_ITEM_FROM_CASHE',
      urls: urls,
      namespace: namespace,
      individual_cb: individual_cb,
      cb: cb 
    };

  },


  /********************************************************************
  Create Cache Data Object to be removed  from cache.
  Constructs and returns an object with properties for cache data.

  @param {String} namespace - Namespace
 
  @return {Object} - Cache data object 
  *********************************************************************/
  createCacheDataToRmoveAllResource: function(namespace, cb){
   
    // Return cache data
    return  {
      action: 'REMOVE_ALL_RESOURCE_FROM_CASHE',
      namespace: namespace,
      cb: cb
    };

  },


};/////////////////////////Private Functions END///////////////////////////////
