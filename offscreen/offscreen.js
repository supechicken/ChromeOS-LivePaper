// offscreen.js: trick for making service worker persistent
'use strict';

setInterval(async () => {
  (await navigator.serviceWorker.ready).active.postMessage('keepAlive');
}, 20e3);