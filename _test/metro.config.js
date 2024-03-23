const {getDefaultConfig, mergeConfig} = require('@react-native/metro-config');

/**
 * Metro configuration
 * https://facebook.github.io/metro/docs/configuration
 *
 * @type {import('metro-config').MetroConfig}
 */
//const config = {};

const path = require('path')

const myNodeModules = {
  'rnw-helper-cache': path.resolve(__dirname + '/../')
};


const config = {
    resolver: {
    extraNodeModules: new Proxy(myNodeModules, {
      get: (target, name) => 
      //redirects dependencies referenced from common/ to local node_modules
      name in target ? target[name] : path.join(process.cwd(), `node_modules/${name}`),
    }),
  },
  watchFolders: [
    path.resolve(__dirname, '../'),
  ],
};


module.exports = mergeConfig(getDefaultConfig(__dirname), config);
