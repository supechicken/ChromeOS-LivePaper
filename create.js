// create.js: video frame extracter
const videoUpload     = document.getElementById('videoUpload'),
      videoPlayer     = document.getElementById('videoPlayer'),
      canvas          = document.getElementById('render'),
      statusText      = document.getElementById('status'),
      videoSpeed      = document.getElementById('videoSpeed'),
      resWidth        = document.getElementById('resWidth'),
      resHeight       = document.getElementById('resHeight'),
      nextBtn         = document.getElementById('nextBtn'),
      options         = document.getElementById('options'),
      canvasContext   = canvas.getContext('2d'),
      extractedFrames = [];

videoPlayer.onplay = () => {
  const videoDuration = Math.round(videoPlayer.duration);
  canvas.width        = resWidth.value;
  canvas.height       = resHeight.value;
  window.stopRender   = false;

  chrome.runtime.sendMessage({message: 'stopLiveWallpaper'});

  const updateCanvas = () => {
    if (!window.stopRender) videoPlayer.requestVideoFrameCallback(updateCanvas);
    statusText.innerText = `Extracting frames from video, please wait.. (${Math.round(videoPlayer.currentTime)}/${videoDuration})`
    canvasContext.drawImage(videoPlayer, 0, 0, canvas.width, canvas.height);
    extractedFrames.push(canvas.toDataURL('image/jpeg'));
  };

  updateCanvas();

  videoPlayer.onpause = async () => {
    window.stopRender = true;
    await chrome.storage.local.set({frames: extractedFrames});
    await chrome.runtime.sendMessage({message: 'restartEngine'});
    alert(`Done. (${extractedFrames.length} frames extracted)`)
  };
}

videoUpload.onchange = () => {
  videoPlayer.src          = URL.createObjectURL(videoUpload.files[0]);
  videoPlayer.onloadeddata = () => {
    videoPlayer.playbackRate = parseInt(videoSpeed.value) / 100;
    options.style.visibility = 'visible';
    resWidth.value           = videoPlayer.videoWidth;
    resHeight.value          = videoPlayer.videoHeight;
  }
};

nextBtn.onclick = () => {
  if (videoPlayer.src) {
    videoPlayer.play();
  } else {
    alert('No video selected!');
  }
}