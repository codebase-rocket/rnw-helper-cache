// Info: AsyncStorage is backed by native code that stores small values in a serialized dictionary and larger values in separate files.
'use strict';

import AsyncStorage from '@react-native-async-storage/async-storage';

var Lib;

var CONFIG



///////////////////////////// Module Exports START /////////////////////////////
module.exports = function(shared_libs, config){

  // Shared Dependencies (Managed my Main Entry Module)
  Lib = shared_libs;

  // Configuration (Managed my Main Entry Module)
  CONFIG = config;

  // Return Public Funtions of this module
  return StorageNative;

};//////////////////////////// Module Exports END //////////////////////////////



////////////////////////////Public Functions START//////////////////////////////
const StorageNative = { // Public functions accessible by other modules

  /********************************************************************
  Add resources in async storage

  @param {String} cache_namespace - The namespace used for partitioning the cache
  @param {String} url -  The URL of the resource to be cached.
  @param {String} filename - The filename associated with the cached resource.
  @param {Boolean} is_downloaded - A boolean value indicating whether the resource has been successfully downloaded (determined from an error condition).
  @param {Function} cb - Callback function

  @return - None
  *********************************************************************/
  addResourceInfoToStorage: function(cache_namespace, url, filename, is_downloaded, cb){

    // Create cache data object
    var cache_data = Lib.CacheData.createCacheData(
      url, 
      filename,
      Lib.Utils.getUnixTime(), // Get current unixtime 
      is_downloaded,
      )

      console.log('cache_data', cache_data);

    // Construct Storage Key
    var key = Lib.CacheData.constructStorageKey(cache_namespace, filename);

    // Set key value in async storage
    AsyncStorage.setItem(key, JSON.stringify(cache_data), function(err){
      cb(err)
    });

  },


  /********************************************************************
  Get all resources from async storage

  @param {String} cache_namespace - The namespace used for partitioning the cache
  @param {Function} cb - Callback function

  @return - None
  *********************************************************************/
  getAllResourceInfoFromStorage: function(cache_namespace, cb){

    // Construct the partition key using the cache_namespace
    const partition_key = Lib.CacheData.constructPartitionKey(cache_namespace);

    // Retrieve all keys from AsyncStorage
    AsyncStorage.getAllKeys(function(err, keys){

      // If error do not proceed
      if(err){       
        return cb(err); // Return callback with error. Do not proceed     
      }
      
      // Filter keys that start with the specified partition key
      const partition_only_keys = keys.filter(key => key.startsWith(partition_key));

      console.log('partition_only_keys', partition_only_keys);

      // Retrieve the data associated with the partition-only-keys
      StorageNative.getResourceAllValue(partition_only_keys, function(err, cache_items_data){

        console.log('cache_items_data', cache_items_data);

        // Invoke the callback function with the error and retrieved cache list
        cb(err, cache_items_data);
      });

    });

  },


  /********************************************************************
  Get All resource from async storage

  @param {String} keys -  Storage keys to get value from storage
  @param {Function} cb - Callback function

  @return - None
  *********************************************************************/
  getResourceAllValue: function(keys, cb){

    AsyncStorage.multiGet(keys, function(err, data){

      // If error do not proceed
      if(err){       
        return cb(err); // Return callback with error. Do not proceed     
      }

      // If no resource is found
      if(Lib.Utils.isEmpty(data)){
        return cb(false, {}); // Return callback with empty obj. Do not proceed  
      }

      // Convert data into key value. 
      // [ ['key1', 'value1'], ['key2', 'value2'] ] --> {key1: value1, key2: value2}

      // Initialize an empty object to store the key-value pairs.
      var cache_items_data = {};

      // Use the forEach function to loop through the array.
      data.forEach(function(item) {
        // For each sub-array, use the first element as the key  and the second element as the corresponding value.
        let key = item[0];
        let value = Lib.Utils.stringToJSON(item[1]); // Convert value back into json

        // Add the key-value pair to the object.
        cache_items_data[key] = value;
      });

      // Return callback with cache items data       
      cb(false, cache_items_data)

    })
  },


  /********************************************************************
  Deleting specified cache items from storage 

  @param {Set[]} cache_data_list -  The array of cache data objects representing the unused cache items to be deleted from the storage
  @param {String} cache_namespace - The namespace or identifier for the cache items in the storage
  @param {Function} cb - Callback function

  Return None
  *********************************************************************/
  removeAllResourcesInfoFromStorage: function(cache_namespace, cache_data_list, cb){

    // Check if the cache data list is not empty
    if(Lib.Utils.isEmpty(cache_data_list)){
      return;
    }

    // Create an array of cache item keys from the cache data list
    var keys = Object.values(cache_data_list).map(function(cache_data){
      // Get the cache item key for the unused cache data
      return Lib.CacheData.constructStorageKey(cache_namespace, cache_data.filename);
    })
 
    // Delete the cache item from the storage
    AsyncStorage.multiRemove(keys, function(err){        
      cb(err); // Forward response to callback function as it is.
    });
    
  },


  /********************************************************************
  Remove specified cache item from storage 

  @param {String} cache_namespace - The namespace or identifier for the cache items in the storage
  @param {Set} cache_data -  Cache data object to be removed
  @param {Function} cb - Callback function

  Return None
  *********************************************************************/
  removeResourceInfoFromStorage: function(cache_namespace, cache_data, cb){

    // Check if the cache data list is not empty
    if(Lib.Utils.isNullOrUndefined(cache_data)){
      return;
    }

    // Get the cache item key for the cache data
    var key = Lib.CacheData.constructStorageKey(cache_namespace, cache_data.filename);
    
    // Delete the cache item from the storage
    AsyncStorage.removeItem(key, function(err){        
      cb(err); // Forward response to callback function as it is.
    });
    
  },

  
};////////////////////////////Public Functions END//////////////////////////////



//////////////////////////Private Functions START///////////////////////////////
const _StorageNative = { // Private functions accessible within this modules only

}; //////////////////////////Private Functions END///////////////////////////////
