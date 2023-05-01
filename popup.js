// popup.js: browser popup
'use strict';
const switchElement = document.getElementById('enableSwitch');

chrome.runtime.sendMessage({message: 'getStatus'}, response => {
  switchElement.checked = JSON.parse(response);
});

switchElement.onchange = () => {
  console.log('[debug]', 'telling background.js about the changes...')
  if (switchElement.checked) {
    chrome.runtime.sendMessage({message: 'startLiveWallpaper'});
  } else {
    chrome.runtime.sendMessage({message: 'stopLiveWallpaper'});
  }
}