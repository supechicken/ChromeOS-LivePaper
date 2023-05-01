'use strict';
let liveWallpaperRunning = true,
    stopFlag             = false,
    errorExit            = false,
    currentFrame         = 0;

async function anyMax() {
  const allWindows = await chrome.windows.getAll();
  return allWindows.some(window => window.state == 'maximized');
}

async function checkFocus() {
  const currentWindow = await chrome.windows.getCurrent();
  return currentWindow.focused;
}

// Tricks for making service worker persistent
chrome.offscreen.createDocument({
  url: 'offscreen/offscreen.html',
  reasons: ['BLOBS'],
  justification: 'keep service worker running',
});

self.onmessage = () => {}; // keepAlive

chrome.runtime.onInstalled.addListener(details => {
  if (details.reason === chrome.runtime.OnInstalledReason.INSTALL) {
    chrome.tabs.create({url: 'create.html'});
  }
});

chrome.runtime.onMessage.addListener(async (request, _, responseTo) => {
  console.log('[debug]', 'message received: ', request.message);

  switch (request.message) {
    case 'startLiveWallpaper':
      liveWallpaperRunning = true;
      break;
    case 'stopLiveWallpaper':
      liveWallpaperRunning = false;
      break;
    case 'restartEngine':
      if (!errorExit) {
        console.log('[debug]', 'stop engine')
        stopFlag = true;
        await new Promise((resolve, _) => {
          const interval = setInterval(() => {
            if (!stopFlag) {
              clearInterval(interval);
              resolve();
            }
          }, 100);
        });
      }

      liveWallpaperRunning = true;
      console.log('[debug]', 'start engine')
      main();
      break;
    case 'getStatus':
      responseTo(JSON.stringify(liveWallpaperRunning));
      break;
  }
});

async function main() {
  errorExit = false;
  const storage = await chrome.storage.local.get('frames');

  if (!storage.frames) {
    console.log('[error]', 'empty local storage! (import a video in create.html?)');
    errorExit = true;
    return;
  }

  const frames = storage.frames;

  async function setWallpaper() {
    if (stopFlag) {
      stopFlag = false;
      return;
    } else if (currentFrame == frames.length) {
      currentFrame = 0;
    }

    if (await checkFocus() || await anyMax() || !liveWallpaperRunning) {
      setTimeout(setWallpaper, 1000);
    } else {
      console.log('[debug]', 'showing frame', currentFrame);
      const frame = await fetch(frames[currentFrame++]).then(response => response.arrayBuffer());
      chrome.wallpaper.setWallpaper({ data: frame, filename: 'livewallpaper', layout: 'CENTER_CROPPED' }, setWallpaper);
    }
  }

  setWallpaper();
}

main();