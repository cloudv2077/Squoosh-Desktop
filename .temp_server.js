const http = require('http');
const fs = require('fs');
const path = require('path');
const net = require('net');

// 检查端口是否可用
function isPortAvailable(port) {
    return new Promise((resolve) => {
        const server = net.createServer();
        server.listen(port, () => {
            server.close(() => resolve(true));
        });
        server.on('error', () => resolve(false));
    });
}

// 查找可用端口
async function findAvailablePort(startPort = 8899) {
    console.log(`🔍 检查端口可用性，从 ${startPort} 开始...`);
    for (let port = startPort; port < startPort + 100; port++) {
        if (await isPortAvailable(port)) {
            console.log(`✅ 找到可用端口: ${port}`);
            return port;
        } else if (port === startPort) {
            console.log(`⚠️ 端口 ${port} 被占用，尝试 ${port + 1}`);
        }
    }
    throw new Error('无法找到可用端口');
}

// MIME类型映射
const mimeTypes = {
    '.html': 'text/html',
    '.js': 'application/javascript',
    '.css': 'text/css',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.gif': 'image/gif',
    '.ico': 'image/x-icon',
    '.svg': 'image/svg+xml',
    '.wasm': 'application/wasm',
    '.woff': 'font/woff',
    '.woff2': 'font/woff2'
};

function getMimeType(filePath) {
    const ext = path.extname(filePath);
    return mimeTypes[ext] || 'application/octet-stream';
}

async function startServer() {
    try {
        console.log('🎯 启动图小小生产服务器...');
        
        const staticPath = path.join(__dirname, 'squoosh-static');
        
        const server = http.createServer((req, res) => {
            // 设置WASM所需的安全头部
            res.setHeader('Cross-Origin-Embedder-Policy', 'require-corp');
            res.setHeader('Cross-Origin-Opener-Policy', 'same-origin');
            res.setHeader('Access-Control-Allow-Origin', '*');
            res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
            res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
            
            if (req.method === 'OPTIONS') {
                res.writeHead(200);
                res.end();
                return;
            }
            
            let filePath = req.url === '/' ? '/index.html' : req.url;
            filePath = path.join(staticPath, filePath);
            
            // 安全检查：防止目录遍历攻击
            if (!filePath.startsWith(staticPath)) {
                res.writeHead(403);
                res.end('Forbidden');
                return;
            }
            
            fs.readFile(filePath, (err, data) => {
                if (err) {
                    if (err.code === 'ENOENT') {
                        res.writeHead(404);
                        res.end('Not Found');
                    } else {
                        res.writeHead(500);
                        res.end('Server Error');
                    }
                } else {
                    const mimeType = getMimeType(filePath);
                    res.setHeader('Content-Type', mimeType);
                    res.writeHead(200);
                    res.end(data);
                }
            });
        });
        
        // 查找可用端口并启动服务器
        const port = await findAvailablePort();
        
        server.listen(port, () => {
            console.log('🚀 图小小 生产服务器启动成功!');
            console.log(`📱 访问地址: http://localhost:${port}`);
            console.log('✨ 完整功能的图小小现已可用!');
            console.log('🔧 包含完整的WASM支持和跨域策略');
            console.log('');
            console.log('🌟 享受完整的图小小体验!');
        });
        
    } catch (error) {
        console.error('❌ 服务器启动失败:', error.message);
        process.exit(1);
    }
}

startServer();
