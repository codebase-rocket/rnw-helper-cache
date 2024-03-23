// Info: Main Entry File for Web Platforms
'use-strict'

// React (Private Scope)
import React from 'react';

// React Dom (Private Scope)
import ReactDOM from 'react-dom/client';

// Load Project Dependencies and Configuration
const [Lib, Config] = require('./loader')('BROWSER');

// var {BackgroundServiceProvider} = require('./rnw-helper-backgroundservice/backgroundservice')();


//const CacheWeb = require('./sw-helper/cacheWeb')(Lib, Config)


// Initialize project root
const Root = require('./root')(Lib, Config);

import '../web/public/css/style.css';

// const ASDF = function(){
//   return(
//     <BackgroundServiceProvider>
//       <Root />
//     </BackgroundServiceProvider>
//   )
// }


// Initialize DOM node and create Web app root
ReactDOM.createRoot( document.getElementById("root") ).render(
  <Root />
)

// Register Service worker
Lib.Cache.ServiceWorker.registerServiceWorker(function(){}, '/sw.js')
