const { app, BrowserWindow, shell } = require('electron');
const path = require('path');
const fs = require('fs');

function createWindow() {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      webSecurity: false,  // 禁用web安全策略帮助本地文件加载
      allowRunningInsecureContent: true
    },
    title: 'Squoosh Desktop'
  });

  const localSquoosh = path.join(__dirname, 'squoosh-static', 'index.html');
  
  if (fs.existsSync(localSquoosh) && fs.statSync(localSquoosh).size > 10000) {
    console.log('✅ 使用本地Squoosh版本');
    console.log('📂 文件路径:', localSquoosh);
    console.log('📏 文件大小:', fs.statSync(localSquoosh).size, 'bytes');
    
    win.loadFile(localSquoosh);
    
    // 添加调试信息
    win.webContents.on('did-finish-load', () => {
      console.log('✅ 页面加载完成');
    });
    
    win.webContents.on('did-fail-load', (event, errorCode, errorDescription) => {
      console.log('❌ 页面加载失败:', errorCode, errorDescription);
    });
    
    // 监听控制台日志
    win.webContents.on('console-message', (event, level, message, line, sourceId) => {
      console.log(`🖥️ Browser Console [${level}]:`, message);
    });
    
    // 打开开发者工具方便调试
    // win.webContents.openDevTools();
    
  } else {
    console.log('❌ 本地Squoosh文件不存在或太小');
    win.loadURL('data:text/html;charset=utf-8,' + encodeURIComponent(`
      <h1>❌ 文件不存在</h1>
      <p>squoosh-static/index.html 不存在或文件过小</p>
      <p>请运行 npm run prebuild</p>
    `));
  }

  // 监听外部链接点击
  win.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url);
    return { action: 'deny' };
  });
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
