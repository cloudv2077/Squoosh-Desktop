const { spawn } = require('child_process');
const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

let PORT = 8899;

// 正确的端口检测函数
function findAvailablePort(startPort) {
  return new Promise((resolve) => {
    const testServer = http.createServer();
    
    testServer.listen(startPort, 'localhost', () => {
      const port = testServer.address().port;
      testServer.close(() => {
        console.log(`✅ 找到可用端口: ${port}`);
        resolve(port);
      });
    });
    
    testServer.on('error', (err) => {
      if (err.code === 'EADDRINUSE') {
        console.log(`⚠️ 端口 ${startPort} 被占用，尝试 ${startPort + 1}`);
        // 递归尝试下一个端口
        findAvailablePort(startPort + 1).then(resolve);
      } else {
        console.log(`❌ 端口检测错误: ${err.message}`);
        // 出现其他错误时，尝试下一个端口
        findAvailablePort(startPort + 1).then(resolve);
      }
    });
  });
}

async function startProductionServer() {
  console.log(`🔍 检查端口可用性，从 ${PORT} 开始...`);
  
  try {
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

    // 启动服务器
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
      console.log(`❌ 最终服务器启动失败: ${err.message}`);
      process.exit(1);
    });

  } catch (error) {
    console.log(`❌ 端口查找失败: ${error.message}`);
    console.log(`🔄 使用默认端口 8899 强制启动...`);
    PORT = 8899;
    startProductionServer();
  }
}

// 添加进程清理
process.on('SIGINT', () => {
  console.log('\n🔻 接收到退出信号，正在清理...');
  process.exit(0);
});

console.log('🎯 启动Squoosh Desktop生产服务器...');
startProductionServer();
