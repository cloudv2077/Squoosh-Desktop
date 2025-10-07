const http = require('http');
const path = require('path');
const fs = require('fs');

const PORT = 3000;

const server = http.createServer((req, res) => {
  console.log(`请求: ${req.url}`);
  
  if (req.url === '/' || req.url === '/index.html') {
    // 检查本地Squoosh文件是否存在
    const localSquoosh = path.join(__dirname, 'squoosh-static', 'index.html');
    
    if (fs.existsSync(localSquoosh)) {
      // 返回本地Squoosh
      const content = fs.readFileSync(localSquoosh);
      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.end(content);
    } else {
      // 返回重定向到在线版本的页面
      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.end(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>Squoosh Desktop - Web Test</title>
          <style>
            body { font-family: Arial, sans-serif; text-align: center; padding: 50px; }
            .container { max-width: 600px; margin: 0 auto; }
            .btn { background: #4CAF50; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; }
          </style>
        </head>
        <body>
          <div class="container">
            <h1>🎯 Squoosh Desktop</h1>
            <p>本地Squoosh文件未找到，正在连接到在线版本...</p>
            <p><a href="https://squoosh.app" class="btn" target="_blank">打开 Squoosh</a></p>
            <script>
              setTimeout(() => {
                window.location.href = 'https://squoosh.app';
              }, 2000);
            </script>
          </div>
        </body>
        </html>
      `);
    }
  } else {
    res.writeHead(404);
    res.end('Not Found');
  }
});

server.listen(PORT, () => {
  console.log(`🚀 Squoosh Desktop Web测试版启动成功!`);
  console.log(`📱 访问地址: http://localhost:${PORT}`);
  console.log(`🔧 这是Electron应用的Web版本预览`);
  console.log(`⭐ 功能: 自动重定向到Squoosh在线版本`);
});
