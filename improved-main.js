const { app, BrowserWindow, shell } = require('electron');
const path = require('path');
const fs = require('fs');
const http = require('http');

let httpServer = null;
const PORT = 8899;

function startEmbeddedServer() {
  return new Promise((resolve, reject) => {
    // 检查端口是否已被占用
    const testServer = http.createServer();
    testServer.listen(PORT, 'localhost', () => {
      testServer.close(() => {
        // 端口可用，启动真正的服务器
        const server = http.createServer((req, res) => {
          let pathname = require('url').parse(req.url).pathname;
          if (pathname === '/') pathname = '/index.html';
          
          const filePath = path.join(__dirname, 'squoosh-static', pathname);
          
          // 设置完整的CORS和安全头部
          res.setHeader('Cross-Origin-Embedder-Policy', 'require-corp');
          res.setHeader('Cross-Origin-Opener-Policy', 'same-origin');
          res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
          res.setHeader('Access-Control-Allow-Origin', '*');
          res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
          res.setHeader('Access-Control-Allow-Headers', '*');
          
          if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
            const ext = path.extname(filePath).toLowerCase();
            const mimeTypes = {
              '.html': 'text/html; charset=utf-8',
              '.js': 'application/javascript; charset=utf-8',
              '.wasm': 'application/wasm',
              '.css': 'text/css; charset=utf-8',
              '.json': 'application/json; charset=utf-8',
              '.svg': 'image/svg+xml',
              '.png': 'image/png',
              '.jpg': 'image/jpeg',
              '.ico': 'image/x-icon',
              '.map': 'application/json'
            };
            
            res.setHeader('Content-Type', mimeTypes[ext] || 'application/octet-stream');
            fs.createReadStream(filePath).pipe(res);
          } else {
            res.writeHead(404, {'Content-Type': 'text/plain'});
            res.end('File not found: ' + pathname);
          }
        });

        server.listen(PORT, 'localhost', () => {
          console.log(`🚀 融合架构HTTP服务器启动成功: http://localhost:${PORT}`);
          httpServer = server;
          resolve(server);
        });

        server.on('error', reject);
      });
    });
    
    testServer.on('error', (err) => {
      if (err.code === 'EADDRINUSE') {
        console.log(`⚠️ 端口${PORT}已被占用，尝试连接现有服务器`);
        resolve(null); // 返回null表示使用现有服务器
      } else {
        reject(err);
      }
    });
  });
}

function createWindow() {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      webSecurity: false,
      allowRunningInsecureContent: true
    },
    title: '🚀 Squoosh Desktop - 融合架构版',
    icon: path.join(__dirname, 'assets', 'icon.png'),
    show: false // 先不显示，等加载完成后再显示
  });

  console.log('🎯 Squoosh Desktop - 融合架构启动中...');

  // 首先尝试启动内嵌HTTP服务器
  startEmbeddedServer()
    .then((server) => {
      if (server || httpServer) {
        console.log('✅ HTTP服务器就绪，加载HTTP内容');
      } else {
        console.log('✅ 使用现有HTTP服务器');
      }
      
      // 加载HTTP内容
      win.loadURL(`http://localhost:${PORT}`)
        .then(() => {
          console.log('✅ HTTP内容加载请求已发送');
        })
        .catch((err) => {
          console.log('❌ HTTP加载失败:', err.message);
          fallbackToFileMode(win);
        });
    })
    .catch((err) => {
      console.log('⚠️ HTTP服务器启动失败:', err.message);
      fallbackToFileMode(win);
    });

  // 加载完成后显示窗口
  win.once('ready-to-show', () => {
    console.log('✅ 融合架构窗口准备就绪，显示应用');
    win.show();
  });

  win.webContents.on('did-finish-load', () => {
    console.log('✅ 融合架构内容加载完成');
  });

  win.webContents.on('did-fail-load', (event, errorCode, errorDescription) => {
    console.log('❌ 融合架构加载失败:', errorCode, errorDescription);
    console.log('🔄 切换到文件模式...');
    fallbackToFileMode(win);
  });

  return win;
}

function fallbackToFileMode(win) {
  const localSquoosh = path.join(__dirname, 'squoosh-static', 'index.html');
  if (fs.existsSync(localSquoosh) && fs.statSync(localSquoosh).size > 10000) {
    console.log('✅ 切换到本地文件模式');
    win.loadFile(localSquoosh);
  } else {
    console.log('❌ 本地文件也不存在，显示错误页面');
    win.loadURL('data:text/html;charset=utf-8,' + encodeURIComponent(`
      <div style="text-align:center; padding:50px; font-family:Arial;">
        <h1>🚀 Squoosh Desktop - 融合架构</h1>
        <h2>❌ 启动失败</h2>
        <p>HTTP服务器启动失败，且本地文件不存在</p>
        <p>请运行: <code>npm run prebuild</code></p>
        <p>然后重新启动应用</p>
      </div>
    `));
  }
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (httpServer) {
    console.log('🔻 关闭融合架构HTTP服务器');
    httpServer.close();
    httpServer = null;
  }
  
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

app.on('before-quit', () => {
  if (httpServer) {
    console.log('🔻 应用退出，清理融合架构HTTP服务器');
    httpServer.close();
    httpServer = null;
  }
});
