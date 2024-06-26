<p align="center">
  <img src="/icon.svg" height="200" alt="logo" />
</p>
<h1 align="center">ChromeOS LivePaper</h1>
<h2 align="center">A live wallpaper engine for Chrome OS</h2>

## Features
- Set a live wallpaper for your Chromebook
- Will stop automatically when a window is maximized/focused for performance concern (not working for Android/Linux apps currently)

## Why not just use CrosPaper?
There are some ridiculous restrictions in free version of CrosPaper:
- Only =< 720p video can be applied
- You can only set a live wallpaper up to 10 seconds

So I decided to make an alternative for it.

### Comparing to CrosPaper
- Free
- No extra features (Google Photos, etc.)

## Installation

- Download [archive](https://github.com/supechicken/ChromeOS-LivePaper/archive/refs/heads/main.zip) of this repository and unzip it
- Unpack the zip file by:
  - Double click the zip file in the file manager. The zip file will show contents in what looks like a flash drive
  - Drag the folder within the zip file into the Downloads folder
  - Optionally delete the zip file
- Go to [chrome://extensions](chrome://extensions) and enable Developer Mode
- Click "Pack Extension", click "Browse" under "Extension Root Directory", then click on the folder named `ChromeOS-LivePaper-main`, and click "Open"
- Click "Pack Extension", then click "Okay"
- Open the file manager, go to Downloads and drag the `.crx` file into the chrome://extensions window.
- Click "Add Extension"
- Optionally delete the generated `.crx` packaged file and `.pem` key file

## How does it works?

This extension uses `chrome.wallpaper.setWallpaper` to change the wallpaper in Chrome OS. However, it only works with images.

As a workaround, this extension split the video (live wallpaper) into serval frames and feed them to `chrome.wallpaper.setWallpaper` one by one to make the wallpaper "move"

## FAQ
Q: Why it doesn't work?

A: Check the settings on browser popup

---

Q: It is laggy!

A: Try reducing the resolution in the wallpaper settings page (you will need to reset the live wallpaper in `Browser popup > Set a new wallpaper` for this).

---

Q: How to set a new live wallpaper?

A: `Browser popup > Set a new wallpaper`

## Known issues
- Poor performance (due to the way how this extension works)
