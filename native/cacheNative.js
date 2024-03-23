// Info: Cache Native - Initialize global hooks and load shared data
'use strict';

// React-Native (Private Scope)
import { Platform } from 'react-native';
import RNFS from 'react-native-fs';


// Shared Dependencies (Managed by Loader)
var Lib


  // Exclusive Dependencies
var CONFIG;


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

  console.log('Lib', Lib.Debug);

};

//////////////////////////// Module-Loader END /////////////////////////////////

///////////////////////////// Module Exports START /////////////////////////////
// Export Public Funtions of this module
module.exports = function (shared_libs, config){

  // Run Loader
  loader(shared_libs, config);


  // Return Public Funtions of this module
  return CacheNative

};//////////////////////////// Module Exports END //////////////////////////////



///////////////////////////Public Functions START//////////////////////////////
const CacheNative = { // Public functions accessible by other modules

  /********************************************************************
  Downloads files from cache_item_list and saves resource information in storage.

  @param {String} cache_namespace - The namespace used for partitioning the cache
  @param {Set[]} cache_item_list - List of cache items containing URLs and filenames
  @param {Function} cb - Callback function to be called after all files are downloaded

  @return none
  *********************************************************************/
  downloadFiles: function(cb, cb_download_progress, cache_namespace, cache_item_list){

    // Determine the directory on the basis of platform and cache namespace
    const cache_directory = Platform.select({
      android: RNFS.CachesDirectoryPath + '/' + cache_namespace,
      ios: RNFS.LibraryDirectoryPath + '/Caches' + '/' + cache_namespace,
    });

    // Create the directory asynchronously using RNFS.mkdir
    RNFS.mkdir(cache_directory)
    .then(function(){
      console.log('Directory created successfully:', cache_directory);

      // Proceed to download files and save resource information
      _CacheNative.downloadFiles(cb, cb_download_progress, cache_namespace, cache_item_list, cache_directory);

    })
    .catch(function(err){
      console.error('Error creating directory:', err);
      // Handle the error
      cb(err);
    });

  },



  /********************************************************************
  Remove files from the cache directory associated with the given cache namespace.

  @param {String} cache_namespace - The namespace used for partitioning the cache
  @param {Set[]} cache_data_list - List of cache data containing filenames of files to be removed
  @param {function} cb - Callback function to be called after all files are removed or encounters an error

  @return none
  *********************************************************************/
  removeFiles: function(cb, cache_namespace, cache_data_list){

     // If the cache_data_list is empty, skip remove file and call the callback function
     if(Lib.Utils.isEmpty(cache_data_list)){
      return cb()
    }


    // Determine the directory on the basis of platform and cache namespace
    const cache_directory = Platform.select({
      android: RNFS.CachesDirectoryPath + '/' + cache_namespace,
      ios: RNFS.LibraryDirectoryPath + '/Caches' + '/' + cache_namespace,
    });

    // Remove files from the cache directory
    _CacheNative.removeFiles(
      cb,
      cache_namespace,
      cache_data_list,
      cache_directory,

    )

  },


  /********************************************************************
  Remove all files from the cache directory associated with the given cache namespace.

  @param {String} cache_namespace - The namespace used for partitioning the cache
  @param {function} cb - Callback function to be called after all files are removed or encounters an error

  @return none
  *********************************************************************/
  clearCache: function(cb, cache_namespace){ // Remove all files

    // Create a directory specific to the cache_namespace
    const cache_directory = Platform.select({
      android: RNFS.CachesDirectoryPath + '/' + cache_namespace,
      ios: RNFS.LibraryDirectoryPath + '/Caches' + '/' + cache_namespace,
    });

    // Remove files from the cache directory
    _CacheNative.removeDirectory(
      cb,
      cache_directory
    )

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

    // Get file path using the cache namespace and filename
    const file_path = _CacheNative.getCacheFilePath(cache_namespace, cache_data.filename);

    // Check if the file exists in the cache directory
    RNFS.exists(file_path)
      .then(function(exists){

        // If File does not exist
        if(!exists){
          return cb(null); // return null
        }

        // Check if file is JSON
        if(is_json){

          // Read the file content as JSON
          RNFS.readFile(file_path, 'utf8')
            .then(function(jsonString){
              cb(Lib.stringToJSON(jsonString)); // Return JSON to callback
            })

            // handle catch error
            .catch(function(error){
              cb(null); // Return null to the callback.
            });

        }

        // For other files except JSON
        else {

          // Read file as base64 string
          RNFS.readFile(file_path, 'base64') // TODO: Handle it later
            .then(function(data){
              cb(data); // Pass the Non JSON data to the callback.
            })
            .catch(function(error){
              cb(null); // Handle read error, and pass null to the callback.
            });

        }

      })

      // Handle existence check error
      .catch(function(error){
        cb(null); // return null to the callback.
      });

  },


};
////////////////////////////Public Functions END///////////////////////////////



//////////////////////////Private Functions START//////////////////////////////
const _CacheNative = { // Private functions accessible within this modules only

  /********************************************************************
  Download files from cache_item_list and saves resource information in storage.

  @param {Set[]} cache_item_list - List of cache items containing URLs and filenames
  @param {String} cache_directory - Directory where the files will be downloaded
  @param {String} cache_namespace - The namespace used for partitioning the cache
  @param {Function} cb - Callback function to be called after all files are downloaded
  @param {Number} count - Optional parameter indicating the current index in cache_item_list

  Return none
 *********************************************************************/
  downloadFiles: function(cb, cb_download_progress, cache_namespace, cache_item_list, cache_directory, count = 0){

    // If the cache_item_list is empty, call the callback function to indicate successful completion
    if(Lib.Utils.isEmpty(cache_item_list)){
      return cb();
    }

    // Download a file
    _CacheNative.downloadFile(
      function(download_err, status_code, last_modified){

        // If there is an error
        if(download_err){
          // Ignore async storage error. Log Error for research
          Lib.Debug.logErrorForResearch(download_err, cache_item_list[count]['url'], true);
          // if error accured set dounload false
          cache_item_list[count]['download'] = false;
        }

        // Save resource info in storage
        Lib.Storage.addResourceInfoToStorage(
          function(storage_err){

            if(storage_err){
              // Ignore async storage error. Log Error for research
              Lib.Debug.logErrorForResearch(storage_err, cache_item_list[count]['url'], true);
            }

            // Call download progress
            cb_download_progress(count, cache_item_list.length)

            // Increment Counter
            count++;

            // Recursivly download next file until end of list is reached
            if( count < cache_item_list.length ){
              _CacheNative.downloadFiles(
                cb,
                cb_download_progress,
                cache_namespace,
                cache_item_list,
                cache_directory,
                count
              );
            }
            else{ // No item to be downloaded
              return cb(null);
            }

          },
          cache_namespace,
          cache_item_list[count]['url'],
          cache_item_list[count]['filename'],
          last_modified, // Get last-modified from item header
          Lib.Utils.isNullOrUndefined(download_err), // Download status is determine from error

        ); // Close: Save resource info in storage

      }, // Close: Download resource
      cache_item_list[count]['url'],
      cache_directory,
      cache_item_list[count]['filename'],
      cache_item_list[count]['last_modified'],
    );

  },


  /********************************************************************
  Download a file from a given URL and save it to a destination directory

  @param {string} source_url - The URL of the file to be downloaded
  @param {string} destination_dir - The destination directory where the downloaded file will be saved
  @param {string} destination_filename - The filename for the downloaded file
  @param {function} cb - Callback function to be called after the download is completed or encounters an error

  Return - none
  *********************************************************************/
  downloadFile: function(cb, source_url, destination_dir, destination_filename, last_modified){

    // Create the file path using the provided destination directory and filename
    const file_path = `${destination_dir}/${destination_filename}`;

    // Build headers for this request
    let headers = {};

    if(!Lib.Utils.isNullOrUndefined(last_modified)){
      // insert headers if modified (if-modified-since)
      headers['If-Modified-Since'] = last_modified
    }

    // Set up the download options
    const downloadFileOptions = {
      'fromUrl': source_url, // The URL of the asset you want to download
      'toFile': file_path, // The destination path where the downloaded asset will be saved
      //'headers': headers, // Optional headers to include in the request
      // background: false, // Whether the download should continue in the background (iOS only)
      // discretionary: false, // Whether the download can be discretionary (iOS only)
      // progress: (data) => {
      //   // Progress callback to track the download progress
      //   const percentage = (data.bytesWritten / data.contentLength) * 100;
      //   console.log(`Download progress: ${percentage.toFixed(2)}%`);
      // },
      // begin: (res) => {
      //   // Callback when the download begins
      //   console.log('Download started');
      // },
      // progressDivider: 1,
      // connectionTimeout: 5000,
      // readTimeout: 10000,
      // expectedFileSize:  1024 * 2
    };

    // Start the file download using RNFS (React Native File System) with the specified options
    RNFS.downloadFile(downloadFileOptions).promise
      .then(function(download_result){

        console.log('download_resultdownload_result', download_result);

        // Check if the download was successful (status code 200)
        if(
          download_result.statusCode >= 200  &&
          download_result.statusCode < 400
        ){
          cb(null, download_result.statusCode, 'last_modified'); // Call the provided callback with no error to indicate successful download
        }

      }
    )
    .catch(function(err){

      cb(err)

    });

  },



  /********************************************************************
  Remove files from the cache directory.

  @param {Set[]} cache_data_list - List of cache data containing filenames of files to be removed
  @param {string} cache_directory - The destination directory from where files will be removed
  @param {function} cb - Callback function to be called after all files are removed or encounters an error
  @param {number} count - Optional parameter indicating the current index in cache_data_list

  Return - none
  *********************************************************************/
  removeFiles: function(cb, cache_namespace, cache_data_list, cache_directory, count = 0){

    // Remove a specific file from the cache
    _CacheNative.removeFile(

      function(file_err){

        if(file_err){
          //Ignore async storage error. Log Error for research
          Lib.Debug.logErrorForResearch(file_err, cache_data_list[count]['url'], true);
        }

        // Remove resource info from storage
        Lib.Storage.removeResourceInfoFromStorage(

          function(storage_err){

            // Check if there is an error
            if(storage_err){

              //console.log('storage_err demo 2', storage_err);
              // Ignore async storage error. Log Error for research
              Lib.Debug.logErrorForResearch(storage_err, cache_data_list[count]['url'], true);
            }

            // Increment Counter
            count++;

            // Recursivly remove next file until end of list is reached
            if( count < cache_data_list.length ){
              _CacheNative.removeFiles(
                cb,
                cache_namespace,
                cache_data_list,
                cache_directory,
                count
              );
            }
            // If Reached end of list
            else{
              return cb();
            }

          },
          cache_namespace,
          cache_data_list[count]

        ); // Close: Remove resource info from storage


      },
      cache_directory,
      cache_data_list[count]['filename'],
      cache_data_list[count]['downloaded'],

    );  // Close: Remove file

  },


  /********************************************************************
  Remove files from the cache directory associated with the given filename.

  @param {string} destination_dir - The destination directory from where file to be removed
  @param {string} destination_filename - The file to be removed
  @param {function} cb - Callback function to be called after the download is completed or encounters an error

  Return - none
  *********************************************************************/
  removeFile: function(cb, destination_dir, destination_filename, is_downloaded){

    // Check if file is not downloaded in destination directory, do not proceed
    if(!is_downloaded){
      // Return callback
      return cb()
    }

    // Create the file path using the provided destination directory and filename
    const file_path = `${destination_dir}/${destination_filename}`;

    // Remove the file at the specified file path
    RNFS.unlink(file_path)
      .then(function(){
        // File removal succeeded
        console.log(`File at path ${file_path} successfully removed.`);
        cb(null) // Call the provided callback with null to indicate success
      })
      .catch(function(err){
        // An error occurred while removing the file
        Lib.Debug.logErrorForResearch(err, `Error removing file at path ${file_path}`, true);
        cb(err) // Call the provided callback with the error

      });

  },


  /********************************************************************
  Remove all files from the cache directory associated with the given namespace.

  @param {string} destination_dir - The destination directory from where file to be removed
  @param {function} cb - Callback function to be called after the download is completed or encounters an error

  Return - none
  *********************************************************************/
  removeDirectory: function(cb, destination_dir){

    // Remove the file at the specified file path
    RNFS.unlink(destination_dir)
      .then(function(){
        // File removal succeeded
        console.log(`File at path ${destination_dir} successfully removed.`);
        cb(null) // Call the provided callback with null to indicate success
      })
      .catch(function(err){
        // An error occurred while removing the file

        console.log('jhgfghjvb', err);
        //Lib.Debug.logErrorForResearch(err, `Error removing file at path ${destination_dir}`, true);

        cb(err) // Call the provided callback with the error

      });

  },


  /********************************************************************
  check available storage space.

  @param {function} cb - Callback function

  Return - none
  *********************************************************************/
  checkAvailableSpace: function(cb){

    RNFS.getFSInfo()
    .then(function(info){

      console.log('Available info:', info);

      // Extract the available space and total space from the retrieved information
      const available_space = info.freeSpace;
      const total_space = info.totalSpace;

      // Call the provided callback with the available space and total space (no error)
      cb(null, available_space, total_space);
    })
    .catch(function(err){

      Lib.Debug.logErrorForResearch(err, 'device-space-err', true);

      // Call the provided callback with the error
      cb(err);
    });


  },


  /********************************************************************
  Get cache directory path with the given cache namespace.

  @param {String} cache_namespace - The namespace used for partitioning the cache

  @return {Sting} cache_directory -  Cache directory path where file will be or is being saved
  *********************************************************************/
  getCacheDirectory: function(cache_namespace){

    // Determine the directory on the basis of platform and cache namespace
    const cache_directory = Platform.select({
      android: RNFS.CachesDirectoryPath + '/' + cache_namespace,
      ios: RNFS.LibraryDirectoryPath + '/Caches' + '/' + cache_namespace,
    });

    // Return cache directory path
    return cache_directory;

  },


  /********************************************************************
  Get cache file path with the given cache namespace and filename.

  @param {String} cache_namespace - The namespace used for partitioning the cache
  @param {string} filename - The filename of the downloaded file

  @return {Sting} cache_directory -  Cache directory path where fill will be or is being saved
  *********************************************************************/
  getCacheFilePath: function(cache_namespace, filename){

    // Determine the directory on the basis of platform and cache namespace
    const cache_directory = _CacheNative.getCacheDirectory(cache_namespace);

    // Create the file path using the provided cache directory and filename
    const cache_file_path = `${cache_directory}/${filename}`;

    // Return cache directory file path
    return cache_file_path;

  },

};/////////////////////////Private Functions END///////////////////////////////
