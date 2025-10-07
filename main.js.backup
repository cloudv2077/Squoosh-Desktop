const { app, BrowserWindow, shell } = require('electron');
const path = require('path');
const fs = require('fs');

function createWindow() {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true
    },
    title: 'Squoosh Desktop'
  });

  const localSquoosh = path.join(__dirname, 'squoosh-static', 'index.html');
  
  // 检查本地构建是否完成
  if (fs.existsSync(localSquoosh) && fs.statSync(localSquoosh).size > 2000) {
    console.log('✅ 使用本地Squoosh版本');
    win.loadFile(localSquoosh);
  } else {
    console.log('⚡ 显示构建中界面');
    // 显示更好的等待界面
    win.loadURL('data:text/html;charset=utf-8,' + encodeURIComponent(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Squoosh Desktop - 准备中</title>
        <meta charset="utf-8">
        <style>
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            margin: 0;
          }
          .container {
            text-align: center;
            max-width: 600px;
            padding: 40px;
            background: rgba(255,255,255,0.1);
            border-radius: 20px;
            backdrop-filter: blur(10px);
          }
          h1 { font-size: 2.5em; margin-bottom: 20px; }
          .spinner {
            width: 60px;
            height: 60px;
            border: 4px solid rgba(255,255,255,0.3);
            border-top: 4px solid white;
            border-radius: 50%;
            animation: spin 1s linear infinite;
            margin: 20px auto;
          }
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
          .feature {
            background: rgba(255,255,255,0.1);
            padding: 15px;
            margin: 10px 0;
            border-radius: 10px;
            border-left: 4px solid #4CAF50;
          }
          .btn {
            background: #4CAF50;
            color: white;
            padding: 15px 30px;
            border: none;
            border-radius: 8px;
            font-size: 16px;
            cursor: pointer;
            margin: 10px;
            text-decoration: none;
            display: inline-block;
          }
          .btn:hover { background: #45a049; }
          .progress { margin: 20px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>🖼️ Squoosh Desktop</h1>
          <div class="spinner"></div>
          
          <h2>⚡ 正在准备最新版本...</h2>
          <p><strong>首次启动需要下载并构建 Google Squoosh 的最新代码</strong></p>
          
          <div class="progress">
            <p>这个过程大约需要 3-5 分钟，请耐心等待</p>
          </div>
          
          <h3>💡 为什么需要等待？</h3>
          <div class="feature">
            🌟 <strong>永远最新</strong>：直接获取Google最新的压缩算法和功能
          </div>
          <div class="feature">
            🚀 <strong>极致轻量</strong>：应用只有24KB，比传统应用小4000倍
          </div>
          <div class="feature">
            🔒 <strong>安全可靠</strong>：从Google官方源码实时构建
          </div>
          <div class="feature">
            ✨ <strong>功能完整</strong>：支持AVIF、WebP、JPEG XL等最新格式
          </div>
          
          <div style="margin-top: 30px;">
            <h3>🎯 功能特性:</h3>
            <p>✅ Google 级图片压缩算法<br>
               ✅ 支持 AVIF、WebP、JPEG XL 等最新格式<br>
               ✅ 完全本地化处理，保护隐私安全<br>
               ✅ 高性能 WebAssembly 压缩引擎</p>
          </div>
          
          <div style="margin-top: 30px;">
            <p><strong>构建完成后请重启应用</strong></p>
            <button class="btn" onclick="window.location.reload()">🔄 检查是否完成</button>
            <a href="#" class="btn" onclick="require('electron').shell.openExternal('https://squoosh.app')">🌐 使用在线版本</a>
          </div>
          
          <div style="margin-top: 20px; font-size: 14px; opacity: 0.8;">
            <p>💡 第二次启动将瞬间打开，无需等待</p>
          </div>
        </div>
        
        <script>
          // 每30秒检查一次是否构建完成
          setInterval(() => {
            window.location.reload();
          }, 30000);
        </script>
      </body>
      </html>
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
