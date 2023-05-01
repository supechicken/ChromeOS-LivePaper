// popup.js: browser popup
'use strict';

const switchElement    = document.getElementById('enableSwitch'),
      windowMaxCheck   = document.getElementById('windowMaxCheck'),
      windowFocusCheck = document.getElementById('windowFocusCheck'),
      newPaperBtn      = document.getElementById('newPaper');

chrome.runtime.sendMessage({message: 'getStatus'}, response => {
  switchElement.checked = JSON.parse(response);
});

chrome.storage.local.get(['windowMaxCheck', 'windowFocusCheck']).then(storage => {
  windowMaxCheck.checked   = !!storage.windowMaxCheck;
  windowFocusCheck.checked = !!storage.windowFocusCheck;
});

switchElement.onchange = () => {
  console.log('[debug]', 'telling background.js about the changes...')
  if (switchElement.checked) {
    chrome.runtime.sendMessage({ message: 'startLiveWallpaper' });
  } else {
    chrome.runtime.sendMessage({ message: 'stopLiveWallpaper' });
  }
}

windowMaxCheck.onchange = windowFocusCheck.onchange = () => {
  console.log('[debug]', 'saving changes...');
  chrome.storage.local.set({ windowMaxCheck: windowMaxCheck.checked, windowFocusCheck: windowFocusCheck.checked });

  console.log('[debug]', 'restart engine...');
  chrome.runtime.sendMessage({ message: 'restartEngine' });
}

newPaperBtn.onclick = () => {
  chrome.windows.create({ url: 'change_wallpaper.html', type: 'popup' });
}