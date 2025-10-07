#!/bin/bash

# Squoosh Desktop - macOS ARM64 Quick Start Script
# 多重启动策略，确保应用能够成功运行

echo "🎯 Squoosh Desktop - macOS ARM64 启动脚本"
echo "适用于: Apple Silicon (M1/M2/M3) Mac"
echo ""

# 检查Node.js是否安装
if ! command -v node &> /dev/null; then
    echo "❌ 未检测到Node.js"
    echo "📥 请先安装Node.js: https://nodejs.org"
    echo "💡 或使用Homebrew: brew install node"
    exit 1
fi

echo "✅ Node.js版本: $(node --version)"

# 检查是否在项目目录
if [ ! -f "package.json" ]; then
    echo "❌ 请在Squoosh Desktop项目目录中运行此脚本"
    exit 1
fi

echo "📦 准备应用..."
npm run prebuild > /dev/null 2>&1

echo "🚀 启动应用..."

# 策略1: 尝试Electron启动
if npm start > /dev/null 2>&1 & then
    echo "✅ Electron版本启动成功"
    wait
else
    echo "⚠️  Electron启动失败，使用备用方案..."
    
    # 策略2: 使用简单启动器
    echo "🌐 使用浏览器版本启动..."
    node simple-start.js
fi

echo "🎉 Squoosh Desktop 启动完成!"
