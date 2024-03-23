// Info: Contains Functions Related to Cache Data
'use strict';

// Shared Dependencies (Managed by Main Entry Module & Loader)
var Lib;

// Exclusive Dependencies
var CONFIG; // (Managed by Main Entry Module & Loader)


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
module.exports = function(shared_libs, config){

  // Run Loader
  loader(shared_libs, config);

  // Return Public Funtions of this module
  return CacheData;

};//////////////////////////// Module Exports END //////////////////////////////


///////////////////////////Public Functions START///////////////////////////////
const CacheData = { // Public functions accessible by other modules

  /********************************************************************
  Create Cache Data Object.
  Constructs and returns an object with properties for cache data.

  @param {String} url - The URL of the resource
  @param {String} filename - The filename of the cached resource
  @param {Boolean} is_modifiable - If true force fetch and cache
  @param {String} time_of_creation - Time of Creation of cached resource
  @param {String} last_modified - Last-Modified time
  @param {Boolean} downloaded - Indicates whether the resource has been downloaded

  @return {Object} - Cache data object
  *********************************************************************/
  createCacheData: function(url, filename, is_modifiable, time_of_creation, last_modified, downloaded){

    // Return cache data
    return {
      'url': url,
      'filename': filename,
      'is_modifiable': is_modifiable,
      'toc': time_of_creation,
      'last_modified': last_modified,
      'downloaded': downloaded
    };

  },


  /********************************************************************
  Construct partition-key by concatenating a storage prefix, namespace, separated by colons

  @param {String} cache_namespace - The namespace used for partitioning the cache

  @return {String} - The concatenated storage key, separated by colons
  *********************************************************************/
  constructPartitionKey: function(cache_namespace){

    // Construct the cache key by combining the storage prefix, cache namespace with colon (:)
    // The cache key will be used to uniquely identify the cached resource
    return CONFIG['STORAGE_PREFIX'] + ':' + cache_namespace ;

  },


  /********************************************************************
  Construct storage-key by concatenating partition key and filename, separated by colon (:)

  @param {String} cache_namespace - The namespace used for partitioning the cache
  @param {String} filename - The name of the file to be stored. Unique within a namespace

  @return {String} - The concatenated storage key, separated by colons
  *********************************************************************/
  constructStorageKey: function(cache_namespace, filename){

    // Construct the partition key using the cache_namespace
    const partition_key = CacheData.constructPartitionKey(cache_namespace);

    // Construct the cache key by combining the partition key and filename with colon (:)
    // The cache key will be used to uniquely identify the cached resource
    return partition_key + ':' + filename;

  },


  /********************************************************************
  Deconstruct Storage Key

  @param {String} key - Storage key

  @return {String, String} - [cache_namespace, filename]
  *********************************************************************/
  deconstructStorageKey: function(key){

    // Deconstruct the cache key by separating the storage prefix, cache namespace, and filename from colons (:)
    const [storage_prefix, cache_namespace, filename] = key.split(':');

    // Return deconstructed key
    return [cache_namespace, filename];

  },

}
