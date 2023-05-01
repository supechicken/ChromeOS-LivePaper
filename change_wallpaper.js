// change_wallpaper.js: video frame extracter
'use strict';

const videoUpload     = document.getElementById('videoUpload'),
      videoPlayer     = document.getElementById('videoPlayer'),
      canvas          = document.getElementById('render'),
      statusText      = document.getElementById('status'),
      videoSpeed      = document.getElementById('videoSpeed'),
      resWidth        = document.getElementById('resWidth'),
      resHeight       = document.getElementById('resHeight'),
      nextBtn         = document.getElementById('nextBtn'),
      options         = document.getElementById('options'),
      startTime       = document.getElementById('startTime'),
      endTime         = document.getElementById('endTime'),
      canvasContext   = canvas.getContext('2d'),
      extractedFrames = [];

videoPlayer.onplay = () => {
  const endTimeValue = endTime.value;
  canvas.width       = resWidth.value;
  canvas.height      = resHeight.value;
  window.stopRender  = false;

  chrome.runtime.sendMessage({message: 'stopLiveWallpaper'});

  const updateCanvas = () => {
    if (!window.stopRender) videoPlayer.requestVideoFrameCallback(updateCanvas);
    if (videoPlayer.currentTime > endTime.value) videoPlayer.pause();

    statusText.innerText = `Extracting frames from video... (${videoPlayer.currentTime.toFixed(1)}/${endTimeValue} seconds)`
    canvasContext.drawImage(videoPlayer, 0, 0, canvas.width, canvas.height);
    extractedFrames.push(canvas.toDataURL('image/jpeg'));
  };

  videoPlayer.requestVideoFrameCallback(updateCanvas);

  videoPlayer.onpause = async () => {
    window.stopRender = true;
    console.log('[debug]', `${extractedFrames.length} frames extracted`);

    statusText.innerText = 'Saving results to storage...';
    await chrome.storage.local.set({ frames: extractedFrames });
    await chrome.runtime.sendMessage({ message: 'restartEngine' });

    alert(`Wallpaper set successfully!\n\nHint: Check settings (inside browser popup) if live wallpaper does not work\n\nExtracted ${extractedFrames.length} frames.`);
  };
}

videoUpload.onchange = () => {
  videoPlayer.src          = URL.createObjectURL(videoUpload.files[0]);
  videoPlayer.onloadeddata = () => {
    videoPlayer.playbackRate = parseInt(videoSpeed.value) / 100;
    options.style.visibility = 'visible';
    resWidth.value           = videoPlayer.videoWidth;
    resHeight.value          = videoPlayer.videoHeight;
    startTime.value          = 0;
    endTime.value            = videoPlayer.duration.toFixed(1);
  }
};

nextBtn.onclick = () => {
  if (videoPlayer.src) {
    videoPlayer.play();
  } else {
    alert('No video selected!');
  }
}