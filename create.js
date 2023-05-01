// create.js: video frame extracter
const videoUpload     = document.getElementById('videoUpload'),
      videoPlayer     = document.getElementById('videoPlayer'),
      canvas          = document.getElementById('render'),
      statusText      = document.getElementById('status'),
      canvasContext   = canvas.getContext('2d'),
      extractedFrames = [];

videoPlayer.onplay = () => {
  const videoDuration = Math.round(videoPlayer.duration);
  canvas.height       = videoPlayer.videoHeight;
  canvas.width        = videoPlayer.videoWidth;
  window.stopRender   = false;

  chrome.runtime.sendMessage({message: 'stopLiveWallpaper'});

  const updateCanvas = () => {
    statusText.innerText = `Extracting frames from video, please wait.. (${Math.round(videoPlayer.currentTime)}/${videoDuration})`
    canvasContext.drawImage(videoPlayer, 0, 0, canvas.width, canvas.height);
    extractedFrames.push(canvas.toDataURL('image/jpeg'));
    if (!window.stopRender) requestAnimationFrame(updateCanvas);
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
  videoPlayer.src = URL.createObjectURL(videoUpload.files[0]);
};