const { spawn } = require('child_process');
const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

let PORT = 8899;

// 寻找可用端口
function findAvailablePort(startPort) {
  return new Promise((resolve) => {
    const testServer = http.createServer();
    testServer.listen(startPort, () => {
      const port = testServer.address().port;
      testServer.close(() => resolve(port));
    });
    testServer.on('error', () => {
      findAvailablePort(startPort + 1).then(resolve);
    });
  });
}

async function startProductionServer() {
  // 寻找可用端口
  PORT = await findAvailablePort(PORT);
  
  const server = http.createServer((req, res) => {
    let pathname = url.parse(req.url).pathname;
    if (pathname === '/') pathname = '/index.html';
    
    const filePath = path.join(__dirname, 'squoosh-static', pathname);
    
    // 生产级别的HTTP头部设置
    res.setHeader('Cross-Origin-Embedder-Policy', 'require-corp');
    res.setHeader('Cross-Origin-Opener-Policy', 'same-origin');
    res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
    res.setHeader('Cache-Control', 'public, max-age=31536000');
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
      
      const fileStream = fs.createReadStream(filePath);
      fileStream.pipe(res);
      
      fileStream.on('error', (err) => {
        console.log('文件读取错误:', err);
        res.writeHead(404);
        res.end('File not found');
      });
    } else {
      res.writeHead(404);
      res.end('File not found: ' + pathname);
    }
  });

  server.listen(PORT, 'localhost', () => {
    console.log(`🚀 Squoosh Desktop 生产服务器启动成功!`);
    console.log(`📱 访问地址: http://localhost:${PORT}`);
    console.log(`✨ 完整功能的Google Squoosh现已可用!`);
    console.log(`🔧 包含完整的WASM支持和跨域策略`);
    
    // 自动打开浏览器
    const command = process.platform === 'win32' ? 'start' : process.platform === 'darwin' ? 'open' : 'xdg-open';
    spawn(command, [`http://localhost:${PORT}`], { stdio: 'ignore', detached: true });
    
    console.log(`\n🌟 享受完整的Squoosh Desktop体验!`);
  });

  server.on('error', (err) => {
    console.log(`❌ 服务器启动失败: ${err.message}`);
    if (err.code === 'EADDRINUSE') {
      console.log(`⚠️ 端口 ${PORT} 被占用，尝试下一个端口...`);
      startProductionServer();
    }
  });
}

console.log('🎯 启动Squoosh Desktop生产服务器...');
startProductionServer();
