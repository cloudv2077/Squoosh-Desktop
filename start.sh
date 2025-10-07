#!/bin/bash

# Squoosh Desktop - macOS ARM64 Quick Start Script
# 简单启动脚本，适用于Apple Silicon (M1/M2/M3) Mac

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

echo "📦 安装依赖..."
npm install

echo "🏗️ 准备构建..."
npm run prebuild

echo "🚀 启动应用..."
npm start
