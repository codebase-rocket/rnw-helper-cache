// Info: Cache/Download url based resources. Support ios, android and web
'use strict';


// React Native Base component (Private Scope)
import { Platform } from 'react-native';

// React-Native-File-System (Private Scope)
import RNFS from 'react-native-fs';


// Shared Dependencies (Managed by Loader)
var Lib = {};


// Exclusive Dependencies
var CONFIG = require('./config'); // Loader can override it with Custom-Config


/////////////////////////// Module-Loader START ////////////////////////////////
/********************************************************************
Load dependencies and configurations

@param {Set} shared_libs - Reference to libraries already loaded in memory by other modules
@param {Set} config - Custom configuration in key-value pairs

@return nothing
*********************************************************************/
const loader = function(shared_libs, config){

  // Shared Dependencies (Must be loaded in memory already)
  Lib.Utils = shared_libs.Utils;
  Lib.Debug = shared_libs.Debug;

  // Override default configuration
  if( !Lib.Utils.isNullOrUndefined(config) ){
    Object.assign(CONFIG, config); // Merge custom configuration with defaults
  }

  // Shared Local Dependencies
  Lib.Storage = require('./storageNative')(Lib, CONFIG);  // Async Storage
  Lib.CacheService = require('./cacheWeb')(Lib, CONFIG);  // Cache Service for native  
  Lib.CacheData = require('./cacheData')(Lib, CONFIG) // Cache data

};

//////////////////////////// Module-Loader END /////////////////////////////////

///////////////////////////// Module Exports START /////////////////////////////
// Export Public Funtions of this module
module.exports = function (shared_libs, config){

  // Run Loader
  loader(shared_libs, config);


  // Return Public Funtions of this module
  return Cache;

};//////////////////////////// Module Exports END //////////////////////////////



///////////////////////////Public Functions START//////////////////////////////
const Cache = { // Public functions accessible by other modules

  /********************************************************************
  Downloads files from cache_item_list and saves resource information in storage.

  @param {String} cache_namespace - The namespace used for partitioning the cache
  @param {String[]} url_list - List of URLs
  @param {Function} cb - Callback function to be called after all files are downloaded

  @return none
  *********************************************************************/
  processResourceList: function(cache_namespace, url_list, cb, cb_download_progress){

    // Convert new url list to cache data list
    const new_cache_data_list = Cache.createCacheDataListFromUrlList(url_list);

    Lib.Storage.getAllResourceInfoFromStorage(cache_namespace, function(err, existing_cache_items_data){

       // TODO: error handling
      if(err){
        return cb(err);
      }

      // Iterate new resources list and determine which are not already downloaded, and which are already downloaded but not needed anymore
      let unavailable_cache_data_list = new_cache_data_list.filter(function(cache_data){

        // Get storage cache key for this resource
        const cache_item_key = Lib.CacheData.constructStorageKey(cache_namespace, cache_data.filename);

        // Mark this resource as unavailable if it is not in existing cache list or failed to download
        return !(
          !Lib.Utils.isNullOrUndefined(existing_cache_items_data[cache_item_key]) && // Cache Record Exists
          existing_cache_items_data[cache_item_key]['downloaded'] // Resource is Downloaded
        );

      });

      // Get list of resources that are already downloaded but not in use anymore
      // Items in cache_data_list but not in new_cache_data_list
      let unused_cache_data_list = Object.values(existing_cache_items_data).filter(function(existing_cache_data){

        return !new_cache_data_list.some(function(new_cache_data){
          return (new_cache_data['filename'] === existing_cache_data['filename']);
        });

      });

      // Download new files from the unavailable_cache_data_list
      Lib.CacheService.downloadFiles(cache_namespace, unavailable_cache_data_list, cb_download_progress, function(err){

        // Remove unused files from the unused_cache_data_list
        // Lib.CacheService.removeFiles(cache_namespace, unused_cache_data_list, function(err){

        //   if(err){
        //     return cb(err);
        //   }

        // })

         // TODO: error handling
        if(err){
          return cb(err);
        }

      })

    });


  },


  /********************************************************************
  Create Cache-Data list fron url list
  Generates a filename based on the URL hash with the appropriate resource extension

  @param {Set[]} url_list - Source Url list

  @return {Set[]} - Cache-Data object
  *********************************************************************/
  createCacheDataListFromUrlList: function(url_list){

     // Iterate and Return the new URL list with cache objects
    return url_list.map(function(url){

      // Create cache data object
      return Lib.CacheData.createCacheData(
        url,
        _Cache.getFilenameHashWithExtensionFromUrl(url), // Generate a filename based on the URL hash with resource extension
      );

    });

  },


  /********************************************************************
  check available storage space.

  @param {function} cb - Callback function

  Return - none
  *********************************************************************/
  checkAvailableSpace: function(cb){

    RNFS.getFSInfo()
    .then((info) => {

      console.log('Available info:', info);
      const availableSpace = info.freeSpace;

      console.log('Available space:', availableSpace);

      if (availableSpace < downloadFileOptions.expectedFileSize) {
        const err = {
          status_code: 500,
          message: 'Insufficient storage space',
        };
        cb(err); // Call the provided callback with an error to indicate insufficient space
        return; // Stop further execution
      }

      // Call the provided callback with available space (no error)
      cb(null, availableSpace);
    })
    .catch((err) => {
      console.log('Error checking available space:', err);
      cb(err);
    });

  },


  /********************************************************************
  clearCache - Removes the cache directory and associated cache items.

    @param {string} cache_namespace - The namespace for the cache items.
    @param {function} cb - Callback function called upon completion or error.

   Return - none
   *********************************************************************/
  clearCache: function(cache_namespace, cb){

    // Remove the cache directory
    Lib.CacheService.clearCache(cache_namespace, function(err){

      // Check if an error occurred while removing the cache directory
      if(err){
        return cb(err); // Call the provided callback with the error
      }

      // Remove all resources' information from storage
      Lib.Storage.removeAllResourcesInfoFromStorage(cache_namespace, existing_cache_items_data, function(err){
        // The callback function for removing all resources' information
      });


    });

  },


};
////////////////////////////Public Functions END///////////////////////////////



//////////////////////////Private Functions START//////////////////////////////
const _Cache = { // Private functions accessible within this modules only

  /********************************************************************
  Generate a filename based on url hash with resource extension

  @param {String} url - Source Url

  @return {String} - Filename with extension
  *********************************************************************/
  getFilenameHashWithExtensionFromUrl: function(url){

    // Use url hash for filename
    const filename_without_extension = _Cache.generateHashFromString(url);

    // Use url to get file extension
    const file_extension = _Cache.getFileExtensionFromUrl(url);

    // Filename with extension
    return (filename_without_extension + '.' + file_extension);

  },


  /********************************************************************
  A simple not cryptographically secure function to generate 64bit hash equivalent of a string

  'https://media.example.com/foo/bar/badfile?q=123.56' -> af11fef7c32f5077
  'https://media.example.com' -> bbff9504b898a164
  '2' -> 0000003200000032
  '' -> 0000000000000000

  @param {String} - Any string

  @return {String} - Hexadecimal hash equivalent of string
  *********************************************************************/
  generateHashFromString: function(str){

    // Initialize two hash values to 0
    let hash1 = 0, hash2 = 0;

    // Iterate over each character in the string
    for(let i = 0; i < str.length; i++){

      // Get the character code of the current character
      let charCode = str.charCodeAt(i);

      // Update hash1 and hash2 by shifting their current values and adding the charCode
      // Different constants are used in the shift for hash1 and hash2, which increases the difference between them and reduces the chance of collision
      hash1 = ((hash1 << 5) - hash1) + charCode;
      hash2 = ((hash2 << 7) - hash2) + charCode;

      // The "| 0" operation converts the hashes to 32bit integers
      hash1 |= 0;
      hash2 |= 0;

    }

    // Convert each hash to an 8-character hexadecimal string
    // If the hash is a small number, padStart will add leading zeros to ensure it's always 8 characters long
    // Then, concatenate the two hash strings together to form the final 64-bit hash
    return ((hash1 >>> 0).toString(16)).padStart(8, '0') + ((hash2 >>> 0).toString(16)).padStart(8, '0');

  },


  /********************************************************************
  Get file extension from url
  Ref: Chatgpt v4

  https://media.example.com/foo/bar/badfile?q=123.56 -> null
  https://media.example.com/foo/bar/myfile.jpg?q=123.56 -> jpg
  https://media.example.com/foo/bar/abc.myfile.jpg?q=123.56 -> jpg
  https://media.example.com/foo/bar/-> null
  https://media.example.com -> null
  https://example.com/.jpg -> jpg

  @param {String} url - source url

  @return {String} extension - file extension
  *********************************************************************/
  getFileExtensionFromUrl: function(url){

    // Remove query string if present
    const url_without_query = url.split('?')[0];

    // Split the path by '/' and take the last part
    const last_part_of_path = url_without_query.split('/').pop();

    // Split by '.' and take the last part which should be the extension
    const parts = last_part_of_path.split('.');

    // If there is no '.' in the last part of path, then there is no extension
    if(parts.length < 2){
      return null;
    }

    // Return the file extension
    return parts.pop();

  },

};/////////////////////////Private Functions END///////////////////////////////
