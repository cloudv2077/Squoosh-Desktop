const { app, BrowserWindow } = require('electron');
const path = require('path');
const http = require('http');
const fs = require('fs');
const net = require('net');

let mainWindow;
let server;

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
    for (let port = startPort; port < startPort + 100; port++) {
        if (await isPortAvailable(port)) {
            return port;
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

// 启动HTTP服务器（使用Node.js内置模块）
function startServer() {
    return new Promise(async (resolve, reject) => {
        try {
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
            
            const port = await findAvailablePort();
            
            server.listen(port, () => {
                console.log(`🚀 Squoosh服务器启动在端口 ${port}`);
                resolve(port);
            });
            
        } catch (error) {
            reject(error);
        }
    });
}

async function createWindow() {
    try {
        const port = await startServer();
        
        mainWindow = new BrowserWindow({
            width: 1200,
            height: 800,
            webPreferences: {
                nodeIntegration: false,
                contextIsolation: true,
                webSecurity: true
            },
            title: 'Squoosh Desktop',
            icon: path.join(__dirname, 'assets', 'icon.png'),
            show: false // 先不显示，等加载完成
        });

        // 等待页面加载完成再显示窗口
        mainWindow.once('ready-to-show', () => {
            mainWindow.show();
        });

        await mainWindow.loadURL(`http://localhost:${port}`);
        
        // 可选：打开开发者工具
        // mainWindow.webContents.openDevTools();
        
    } catch (error) {
        console.error('启动失败:', error);
        app.quit();
    }
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
    if (server) {
        server.close();
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
    if (server) {
        server.close();
    }
});
