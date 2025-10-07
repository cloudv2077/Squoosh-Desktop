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

# 方法1: 检查本地安装的Electron
if [ -f "./node_modules/.bin/electron" ]; then
    echo "🔍 检测到本地Electron安装"
    ELECTRON_AVAILABLE=true
# 方法2: 检查全局Electron
elif command -v electron &> /dev/null; then
    echo "🔍 检测到全局Electron安装"
    ELECTRON_AVAILABLE=true
# 方法3: 检查是否可以通过npm运行
elif npm list electron --depth=0 &> /dev/null; then
    echo "🔍 检测到npm中的Electron"
    ELECTRON_AVAILABLE=true
else
    echo "⚠️ 未检测到Electron安装"
fi

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
    echo "✅ 使用生产级HTTP服务器启动（Web体验）"
    echo "🌐 启动HTTP服务器..."
    
    if [ -f "start-production.js" ]; then
        node start-production.js
    else
        echo "❌ start-production.js 不存在"
        echo "🔄 使用简单启动器..."
        node simple-start.js
    fi
fi
