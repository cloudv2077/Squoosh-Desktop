const { app, BrowserWindow, shell } = require('electron');
const path = require('path');
const fs = require('fs');
const http = require('http');

let httpServer = null;
const PORT = 8899;

// HTTP服务器实现（内嵌到Electron中）
function startEmbeddedServer() {
  return new Promise((resolve, reject) => {
    const server = http.createServer((req, res) => {
      let pathname = require('url').parse(req.url).pathname;
      if (pathname === '/') pathname = '/index.html';
      
      const filePath = path.join(__dirname, 'squoosh-static', pathname);
      
      // 完整的HTTP头部设置
      res.setHeader('Cross-Origin-Embedder-Policy', 'require-corp');
      res.setHeader('Cross-Origin-Opener-Policy', 'same-origin');
      res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
      res.setHeader('Cache-Control', 'public, max-age=31536000');
      
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
          '.ico': 'image/x-icon'
        };
        
        res.setHeader('Content-Type', mimeTypes[ext] || 'application/octet-stream');
        
        const fileStream = fs.createReadStream(filePath);
        fileStream.pipe(res);
        
        fileStream.on('error', () => {
          res.writeHead(404);
          res.end('File not found');
        });
      } else {
        res.writeHead(404);
        res.end('File not found');
      }
    });

    server.listen(PORT, 'localhost', () => {
      console.log(`✅ 内嵌HTTP服务器启动成功: http://localhost:${PORT}`);
      httpServer = server;
      resolve(server);
    });

    server.on('error', (err) => {
      console.log(`❌ HTTP服务器启动失败:`, err.message);
      reject(err);
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
    title: 'Squoosh Desktop - 融合架构版'
  });

  console.log('🎯 Squoosh Desktop - 融合架构启动');
  console.log('🔧 启动内嵌HTTP服务器...');

  // 启动内嵌HTTP服务器
  startEmbeddedServer()
    .then(() => {
      console.log('✅ 内嵌服务器就绪，切换到HTTP模式');
      // 加载HTTP服务器内容而不是本地文件
      win.loadURL(`http://localhost:${PORT}`);
      
      win.webContents.on('did-finish-load', () => {
        console.log('✅ HTTP内容加载完成');
      });
      
      win.webContents.on('did-fail-load', (event, errorCode, errorDescription) => {
        console.log('❌ HTTP内容加载失败，降级到文件模式:', errorCode, errorDescription);
        // 降级到原来的文件加载方式
        const localSquoosh = path.join(__dirname, 'squoosh-static', 'index.html');
        if (fs.existsSync(localSquoosh)) {
          win.loadFile(localSquoosh);
        }
      });
    })
    .catch((err) => {
      console.log('⚠️ HTTP服务器启动失败，使用文件模式:', err.message);
      // 降级到原来的文件加载方式
      const localSquoosh = path.join(__dirname, 'squoosh-static', 'index.html');
      if (fs.existsSync(localSquoosh) && fs.statSync(localSquoosh).size > 10000) {
        console.log('✅ 降级到本地文件模式');
        win.loadFile(localSquoosh);
      } else {
        win.loadURL('data:text/html;charset=utf-8,' + encodeURIComponent(`
          <h1>❌ 启动失败</h1>
          <p>HTTP服务器启动失败，且本地文件不存在</p>
          <p>请运行 npm run prebuild</p>
        `));
      }
    });

  // 监听外部链接点击
  win.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url);
    return { action: 'deny' };
  });
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  // 关闭HTTP服务器
  if (httpServer) {
    console.log('🔻 关闭内嵌HTTP服务器');
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

// 应用退出时清理服务器
app.on('before-quit', () => {
  if (httpServer) {
    console.log('🔻 应用退出，清理HTTP服务器');
    httpServer.close();
    httpServer = null;
  }
});
