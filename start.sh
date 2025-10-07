#!/bin/bash

echo "🎯 Squoosh Desktop - 智能启动脚本"
echo "自动选择最佳启动方式"
echo ""

if ! command -v node &> /dev/null; then
    echo "❌ 需要Node.js"
    exit 1
fi

echo "✅ Node.js版本: $(node --version)"
echo "📦 准备应用..."
npm run prebuild > /dev/null 2>&1

echo "🚀 启动应用..."

# 优先使用已验证工作的方法
if [ -f "start-production.js" ]; then
    echo "✅ 使用生产级HTTP服务器启动（推荐）"
    node start-production.js
else
    echo "✅ 使用简单启动器"
    node simple-start.js
fi
