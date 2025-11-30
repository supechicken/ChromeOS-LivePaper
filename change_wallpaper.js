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

function drawFace(ctx, radius) {
  const grad = ctx.createRadialGradient(0,0,radius*0.95, 0,0,radius*1.05);
  grad.addColorStop(0, '#333');
  grad.addColorStop(0.5, 'white');
  grad.addColorStop(1, '#333');
  ctx.beginPath();
  ctx.arc(0, 0, radius, 0, 2*Math.PI);
  ctx.fillStyle = 'white';
  ctx.fill();
  ctx.strokeStyle = grad;
  ctx.lineWidth = radius*0.1;
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(0, 0, radius*0.1, 0, 2*Math.PI);
  ctx.fillStyle = '#333';
  ctx.fill();
}

function drawNumbers(ctx, radius) {
  ctx.font = radius*0.15 + "px arial";
  ctx.textBaseline="middle";
  ctx.textAlign="center";
  for(let num = 1; num < 13; num++){
    let ang = num * Math.PI / 6;
    ctx.rotate(ang);
    ctx.translate(0, -radius*0.85);
    ctx.rotate(-ang);
    ctx.fillText(num.toString(), 0, 0);
    ctx.rotate(ang);
    ctx.translate(0, radius*0.85);
    ctx.rotate(-ang);
  }
}

function drawTime(ctx, radius){
    const now = new Date();
    let hour = now.getHours();
    let minute = now.getMinutes();
    let second = now.getSeconds();
    //hour
    hour=hour%12;
    hour=(hour*Math.PI/6)+
    (minute*Math.PI/(6*60))+
    (second*Math.PI/(360*60));
    drawHand(ctx, hour, radius*0.5, radius*0.07);
    //minute
    minute=(minute*Math.PI/30)+(second*Math.PI/(30*60));
    drawHand(ctx, minute, radius*0.8, radius*0.07);
    // second
    second=(second*Math.PI/30);
    drawHand(ctx, second, radius*0.9, radius*0.02);
}

function drawHand(ctx, pos, length, width) {
    ctx.beginPath();
    ctx.lineWidth = width;
    ctx.lineCap = "round";
    ctx.moveTo(0,0);
    ctx.rotate(pos);
    ctx.lineTo(0, -length);
    ctx.stroke();
    ctx.rotate(-pos);
}

videoPlayer.onplay = () => {
  const endTimeValue = endTime.value;
  canvas.width       = resWidth.value;
  canvas.height      = resHeight.value;
  window.stopRender  = false;

  chrome.runtime.sendMessage({message: 'stopLiveWallpaper'});

  const ctx = canvas.getContext("2d");
let radius = canvas.height / 2;
ctx.translate(radius, radius);
radius = radius * 0.90
setInterval(drawClock, 1000);

  const updateCanvas = () => {
    if (!window.stopRender) videoPlayer.requestVideoFrameCallback(updateCanvas);
    if (videoPlayer.currentTime > endTime.value) videoPlayer.pause();

    statusText.innerText = `Extracting frames from video... (${videoPlayer.currentTime.toFixed(1)}/${endTimeValue} seconds)`
    canvasContext.drawImage(videoPlayer, 0, 0, canvas.width, canvas.height);

    function drawClock() {
  drawFace(ctx, radius);
  drawNumbers(ctx, radius);
  drawTime(ctx, radius);
}
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