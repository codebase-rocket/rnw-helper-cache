# rnw-helper-cache

A caching library for React Native and Web applications supporting iOS, Android, and web platforms.

## Table of Contents
- [Introduction]
- [Installation]
- [LoadingLibrary]
- [Usage]
- [Configuration]
- [Dependencies]

## Overview

This library provides a caching solution for React Native and web applications, with platform-specific implementations for iOS, Android, and web platforms. It supports efficient downloading and storage of resources, making it suitable for applications with varying platform requirements.

## Installation

Install the library using npm:

  ``` json
  1. Put 
    "rnw-helper-cache": "npm:@codebase-rocket/rnw-helper-cache@^1.0.0",
    in dependecy in you 'package.json'
  2. Do npm install
  ```

## Loading in project

  1. Load library in you application
    // Import the caching module
    *const cache = require('rnw-helper-cache')(Lib, Config);

## Usage

  # DownloadFiles (web & Native)
  # RemoveFiles  (web & Native)
  # ClearCache (web & native)
  # RegisterServiceWorker (Web only)
  # UnRegisterServiceWorker (Web only)
  # GetFileFromCache (Web only)

  ```javascript

    CacheWeb.downloadFiles(cb, cb_download_progress, cache_namespace, cache_item_list);

    CacheWeb.removeFiles(cb, cache_namespace, cache_item_list);

    CacheWeb.clearCache(cb, cache_namespace);

    CacheWeb.registerServiceWorker(cb, sw_url); (Web Only)

    CacheWeb.unRegisterServiceWorker(cb, sw_url); (Web Only)

    CacheNative.getFileFromCache(cb, cache_namespace, cache_data, is_json);


## Configuration
  The library supports configuration of project it is running on and an optional configuration object. Customize it according to your project needs.

## Dependencies

  Ensure your project has the following dependencies:

  1. React
  1. React Native
  2. React Native File System (RNFS) (Native Only)


## Note

  If you are using `react-native-web`, please ensure to exclude the React Native library from webpack (through alias). This library is intended only for the React Native platform.

  ### Webpack Configuration for `react-native-web`

  When configuring your webpack, you can add an alias to exclude the React Native library. For example:

  ```javascript
  // webpack.config.js

  module.exports = {
    resolve: {
      alias: {
        'react-native': 'react-native-web',
        'react-native-fs': 'react-native-web',
      },
    },
    // other webpack configurations...
  };
