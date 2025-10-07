#!/usr/bin/env node

const { spawn } = require('child_process');
const http = require('http');
const path = require('path');

console.log('🎯 图小小 - Electron包装器');
console.log('📦 启动本地Electron应用...');

// 简单的Electron模拟器 - 使用系统浏览器但以应用模式启动
function launchAsApp() {
    const url = 'http://localhost:8899';
    
    // 检测操作系统并用应用模式启动Chrome
    const platform = process.platform;
    let command, args;
    
    if (platform === 'darwin') {
        // macOS - 使用Chrome应用模式
        command = 'open';
        args = ['-na', 'Google Chrome', '--args', '--app=' + url, '--new-window'];
    } else if (platform === 'win32') {
        // Windows
        command = 'start';
        args = ['chrome', '--app=' + url];
    } else {
        // Linux
        command = 'google-chrome';
        args = ['--app=' + url];
    }
    
    console.log('🚀 启动图小小桌面应用...');
    console.log(`📱 应用模式: ${url}`);
    
    const app = spawn(command, args, {
        detached: true,
        stdio: 'ignore'
    });
    
    app.unref();
    console.log('✅ 图小小桌面应用已启动!');
}

// 等待服务器启动后再启动应用
setTimeout(launchAsApp, 2000);
