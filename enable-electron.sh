#!/bin/bash
echo "🔧 配置图小小Electron桌面模式"

# 创建简化的本地Electron安装脚本
echo "📦 准备轻量级Electron环境..."

# 创建本地package.json确保依赖正确
npm init -y > /dev/null 2>&1

# 安装最小化Electron依赖
echo "⚡ 安装Electron核心组件..."
npm install --save-dev electron@latest --no-optional --prefer-offline 2>/dev/null

if [ -f "./node_modules/.bin/electron" ]; then
    echo "✅ Electron桌面模式配置完成"
    echo "🎯 重新启动图小小将使用桌面窗口"
    echo ""
    echo "下次运行 npm start 将启动桌面应用"
else
    echo "⚠️ Electron安装可能失败，继续使用浏览器模式"
    echo "💡 浏览器模式同样提供完整功能"
fi
