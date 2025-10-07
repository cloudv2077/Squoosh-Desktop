#!/bin/bash

echo "🎯 Squoosh Desktop - 智能启动脚本"
echo "自动选择最佳启动方式"
echo ""

# 检查Node.js
if ! command -v node &> /dev/null; then
    echo "❌ 需要Node.js"
    exit 1
fi

echo "✅ Node.js版本: $(node --version)"
echo "📦 准备应用..."

# 确保静态文件存在
if [ ! -d "squoosh-static" ] || [ ! -f "squoosh-static/index.html" ]; then
    echo "🔄 获取Squoosh静态文件..."
    npm run prebuild > /dev/null 2>&1
fi

echo "🚀 启动应用..."
echo ""

# 检查Electron是否可用
ELECTRON_AVAILABLE=false

# 检查本地安装的Electron
if [ -f "./node_modules/.bin/electron" ]; then
    echo "🔍 检测到本地Electron安装"
    if ./node_modules/.bin/electron --version > /dev/null 2>&1; then
        ELECTRON_AVAILABLE=true
    else
        echo "⚠️ Electron安装不完整"
    fi
# 检查全局Electron
elif command -v electron &> /dev/null; then
    echo "🔍 检测到全局Electron安装"
    if electron --version > /dev/null 2>&1; then
        ELECTRON_AVAILABLE=true
    else
        echo "⚠️ 全局Electron安装不完整"
    fi
fi

# 内置HTTP服务器函数
start_http_server() {
    echo "✅ 使用生产级HTTP服务器启动（桌面体验）"
    echo "🌐 启动HTTP服务器..."
    
    # 创建内联的HTTP服务器（使用Node.js内置模块）
    cat > .temp_server.js << 'SERVEREOF'
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
        console.log('🎯 启动Squoosh Desktop生产服务器...');
        
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
            console.log('🚀 Squoosh Desktop 生产服务器启动成功!');
            console.log(`📱 访问地址: http://localhost:${port}`);
            console.log('✨ 完整功能的Google Squoosh现已可用!');
            console.log('🔧 包含完整的WASM支持和跨域策略');
            console.log('');
            console.log('🌟 享受完整的Squoosh Desktop体验!');
        });
        
    } catch (error) {
        console.error('❌ 服务器启动失败:', error.message);
        process.exit(1);
    }
}

startServer();
SERVEREOF
    
    # 启动服务器（后台运行）
    node .temp_server.js &
    SERVER_PID=$!
    
    # 等待服务器启动
    sleep 4
    
    # 获取服务器端口（默认8899，如果被占用会自动递增）
    PORT=8899
    
    # 检查端口是否被占用，如果是则尝试下一个
    while ! nc -z localhost $PORT 2>/dev/null; do
        PORT=$((PORT + 1))
        if [ $PORT -gt 8999 ]; then
            echo "❌ 无法找到服务器端口"
            exit 1
        fi
    done
    
    echo "🖥️ 启动桌面应用模式..."
    
    # 使用系统浏览器的应用模式打开
    if command -v open &> /dev/null; then
        # macOS - 使用应用模式打开Chrome/Edge
        if [ -d "/Applications/Google Chrome.app" ]; then
            open -na "Google Chrome" --args --app="http://localhost:$PORT" --new-window
            echo "📱 已在Chrome桌面应用模式中打开"
        elif [ -d "/Applications/Microsoft Edge.app" ]; then
            open -na "Microsoft Edge" --args --app="http://localhost:$PORT" --new-window  
            echo "📱 已在Edge桌面应用模式中打开"
        else
            open "http://localhost:$PORT"
            echo "📱 已在默认浏览器中打开"
        fi
    else
        echo "📱 请手动打开: http://localhost:$PORT"
    fi
    
    echo ""
    echo "🌟 Squoosh Desktop 现在运行在桌面模式!"
    echo "💡 提示: 关闭浏览器窗口时，服务器仍在后台运行"
    echo "🛑 要完全停止服务器，请运行: kill $SERVER_PID"
    echo ""
    
    # 清理临时文件
    cleanup() {
        echo ""
        echo "🧹 清理临时文件..."
        kill $SERVER_PID 2>/dev/null
        rm -f .temp_server.js
        echo "👋 Squoosh Desktop 已停止"
        exit 0
    }
    
    # 设置信号处理
    trap cleanup SIGINT SIGTERM
    
    echo "按 Ctrl+C 停止服务器..."
    
    # 等待用户中断
    wait $SERVER_PID
}

# 根据Electron可用性选择启动方式
if [ "$ELECTRON_AVAILABLE" = true ]; then
    echo "✅ 使用Electron桌面应用启动（最佳体验）"
    echo "🖥️ 启动桌面窗口..."
    
    # 尝试不同的Electron启动方式
    if [ -f "./node_modules/.bin/electron" ]; then
        ./node_modules/.bin/electron .
    elif command -v electron &> /dev/null; then
        electron .
    else
        npm start
    fi
else
    start_http_server
fi
