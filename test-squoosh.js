const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

const PORT = 8899;

const server = http.createServer((req, res) => {
  let pathname = url.parse(req.url).pathname;
  if (pathname === '/') pathname = '/index.html';
  
  const filePath = path.join(__dirname, 'squoosh-static', pathname);
  console.log(`请求: ${pathname}`);
  
  // 关键的CORS头部，支持WebAssembly
  res.setHeader('Cross-Origin-Embedder-Policy', 'require-corp');
  res.setHeader('Cross-Origin-Opener-Policy', 'same-origin');
  
  if (fs.existsSync(filePath)) {
    const ext = path.extname(filePath);
    const types = {
      '.html': 'text/html',
      '.js': 'application/javascript', 
      '.wasm': 'application/wasm',
      '.css': 'text/css',
      '.svg': 'image/svg+xml',
      '.png': 'image/png',
      '.jpg': 'image/jpeg'
    };
    
    res.writeHead(200, { 'Content-Type': types[ext] || 'application/octet-stream' });
    fs.createReadStream(filePath).pipe(res);
  } else {
    res.writeHead(404);
    res.end('Not found');
  }
});

server.listen(PORT, () => {
  console.log(`🚀 Squoosh服务器: http://localhost:${PORT}`);
  console.log('💡 测试图片上传，观察是否还会转圈');
});
