// Info: Configuration file
'use strict';

// Export configration as key-value Map
module.exports = {

  // HTTP Limits
  STORAGE_PREFIX: 'cache', // In milliseconds. 0 means no timeout

 // HTTP Limits
  TIMEOUT: 0, // In milliseconds. 0 means no timeout

  // Error Codes
  NETWORK_ERROR: {
    code: 'NETWORK_ERROR',
    message: 'Something wrong in Network connection'
  }

}
