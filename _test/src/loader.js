// Info: Dependency Manager. Configuration Loader
'use strict';

// Initialize Lib and Config
var Lib = {};
var Config = {};


//////////////////////////// Module Exports START //////////////////////////////
module.exports = function(platform){

  /* Load Configuration */
  //Config = require('../config.js')();

  // Helper Library of basic utility functions
  Lib.Utils = require('js-helper-utils');

  Config['APP_PLATFORM'] = platform

  // Helper Library to debug
  Lib.Debug = require('js-helper-debug')(Lib, Config);

  // Asset cache library
  //Lib.Cache = require('rnw-helper-cache')(Lib, Config);

  Lib.Cache = require('rnw-helper-cache')(Lib, Config);

   
  // Set App platform for this project (IOS, ANDROID, BROWSER)
  Config['APP_PLATFORM'] = platform;
  
  /* Return */
  return [Lib, Config];

};//////////////////////////// Module Exports END //////////////////////////////
