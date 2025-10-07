const { spawn } = require('child_process');
const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

const PORT = 8899;

function startProductionServer() {
  const server = http.createServer((req, res) => {
    let pathname = url.parse(req.url).pathname;
    if (pathname === '/') pathname = '/index.html';
    
    const filePath = path.join(__dirname, 'squoosh-static', pathname);
    
    // 生产级别的HTTP头部设置
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
        '.jpeg': 'image/jpeg',
        '.ico': 'image/x-icon'
      };
      
      const contentType = mimeTypes[ext] || 'application/octet-stream';
      res.writeHead(200, { 'Content-Type': contentType });
      fs.createReadStream(filePath).pipe(res);
      
    } else {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('File not found');
    }
  });

  server.listen(PORT, () => {
    console.log(`🚀 Squoosh Desktop 生产服务器启动成功!`);
    console.log(`📱 访问地址: http://localhost:${PORT}`);
    console.log(`✨ 完整功能的Google Squoosh现已可用!`);
    console.log(`🔧 包含完整的WASM支持和跨域策略`);
    
    // 自动打开浏览器
    const platform = process.platform;
    const cmd = platform === 'darwin' ? 'open' : 
                platform === 'win32' ? 'start' : 'xdg-open';
    
    spawn(cmd, [`http://localhost:${PORT}`], {
      stdio: 'ignore',
      detached: true
    }).unref();
  });
  
  // 优雅关闭
  process.on('SIGINT', () => {
    console.log('\n✅ Squoosh Desktop 服务器已关闭');
    process.exit(0);
  });
}

startProductionServer();
