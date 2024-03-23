// Info: Main Entry File for Native Platforms
'use strict';

// React Native APIs (Private Scope)
import { AppRegistry, Platform } from 'react-native';


// Determine Platform (IOS | ANDROID)
var platform;
if(Platform.OS == 'ios'){ // IOS
  platform = 'IOS';
}
if(Platform.OS == 'android'){ // Android
  platform = 'ANDROID';
}


// Load Project Dependencies and Configuration
const [Lib, Config] = require('./loader')(platform);

// Load main Root on the basis of screen size
const Root = require('./root')(Lib, Config);

// Initialize entry point and Register Native app root
AppRegistry.registerComponent('test', () => Root);
