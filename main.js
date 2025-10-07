const { app, BrowserWindow } = require('electron');
const path = require('path');

function createWindow() {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true
    }
  });

  // 先尝试本地文件，如果不存在则显示简单页面
  const localSquoosh = path.join(__dirname, 'squoosh-static', 'index.html');
  
  try {
    win.loadFile(localSquoosh);
  } catch (err) {
    // 如果本地文件不存在，直接加载在线版本
    win.loadURL('https://squoosh.app');
  }
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
