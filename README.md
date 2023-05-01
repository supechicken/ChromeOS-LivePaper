<p align="center">
  <img src="/icon.svg" alt="logo" />
</p>
<h1 align="center">ChromeOS LivePaper</h1>

## A live wallpaper engine for Chrome OS

## Features
- Set a live wallpaper for your Chromebook
- Will stop automatically when a window is maximized for performance concern (not working for Android/Linux apps currently)

## Why not just use CrosPaper?
There are some ridiculous restrictions in free version of CrosPaper:
- Only =< 720p video can be applied
- You can only set a live wallpaper up to 10 seconds

So I decided to make an alternative for it.

### Comparing to CrosPaper
- Free
- No extra features (Google Photos, etc.)

## Installation

- Download [archive](https://github.com/supechicken/ChromeOS-LivePaper/archive/refs/tags/v1.0.zip) of this repository and unzip it
- Unpack the zip file by:
  - Double click the zip file in the file manager. The zip file will show contents in what looks like a flash drive
  - Drag the folder within the zip file into the Downloads folder
  - Optionally delete the zip file
- Go to [chrome://extensions](chrome://extensions) and enable Developer Mode
- Click "Pack Extension", click "Browse" under "Extension Root Directory", then click on the folder named `ChromeOS-AutoStart-main`, and click "Open"
- Click "Pack Extension", then click "Okay"
- Open the file manager, go to Downloads and drag the `.crx` file into the chrome://extensions window.
- Click "Add Extension"
- Optionally delete the generated `.crx` packaged file and `.pem` key file

## How does it works?

This extension uses `chrome.wallpaper.setWallpaper` to change the wallpaper in Chrome OS. However, it only works with images.

As a workaround, it split the video (live wallpaper) into serval frames and feed them to `chrome.wallpaper.setWallpaper` one by one to make the wallpaper "move"

## Known issues
- Poor performance (due to how this extension works)