// offscreen.js: tricks for making service worker persistent
setInterval(async () => {
  (await navigator.serviceWorker.ready).active.postMessage('keepAlive');
}, 20e3);