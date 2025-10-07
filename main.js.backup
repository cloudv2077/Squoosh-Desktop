const { app, BrowserWindow } = require('electron');
const path = require('path');
const fs = require('fs');
const { spawn } = require('child_process');

let mainWindow;
const staticDir = path.join(__dirname, 'squoosh-static');

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true
    },
    show: false
  });

  loadApp();
  mainWindow.once('ready-to-show', () => mainWindow.show());
}

function loadApp() {
  const indexPath = path.join(staticDir, 'index.html');
  
  if (fs.existsSync(indexPath)) {
    mainWindow.loadFile(indexPath);
  } else {
    showBuilding();
    buildSquoosh();
  }
}

function showBuilding() {
  const html = `<!DOCTYPE html>
<html><head><title>Building...</title></head>
<body><h1>🚀 Building Squoosh...</h1><p>First run, please wait...</p></body></html>`;
  mainWindow.loadURL(`data:text/html,${encodeURIComponent(html)}`);
}

function buildSquoosh() {
  spawn('node', ['scripts/fetch-squoosh.js'], { stdio: 'pipe' })
    .on('close', () => {
      setTimeout(() => {
        if (fs.existsSync(path.join(staticDir, 'index.html'))) {
          mainWindow.reload();
        }
      }, 2000);
    });
}

app.whenReady().then(createWindow);
app.on('window-all-closed', () => process.platform !== 'darwin' && app.quit());
app.on('activate', () => !mainWindow && createWindow());
