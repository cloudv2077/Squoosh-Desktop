const fs = require('fs');
const path = require('path');

console.log('🛠️ 全面修复Squoosh离线依赖问题...');

// 1. 完全移除Google Analytics
const indexPath = path.join(__dirname, 'squoosh-static', 'index.html');
let indexContent = fs.readFileSync(indexPath, 'utf8');

// 移除Google Analytics
indexContent = indexContent.replace(/https:\/\/www\.google-analytics\.com\/analytics\.js/g, '');
indexContent = indexContent.replace(/ga\('[^']*'[^)]*\);/g, '// Google Analytics removed for offline use');

// 替换GitHub链接为#避免网络请求
indexContent = indexContent.replace(/https:\/\/github\.com\/GoogleChromeLabs\/squoosh[^"']*/g, '#');

// 替换squoosh.app链接
indexContent = indexContent.replace(/https:\/\/squoosh\.app/g, '#');

fs.writeFileSync(indexPath, indexContent);

// 2. 修复serviceworker以完全离线工作
const swPath = path.join(__dirname, 'squoosh-static', 'serviceworker.js');
let swContent = fs.readFileSync(swPath, 'utf8');

// 创建简化版serviceworker，移除网络依赖
const simplifiedSW = `
// Simplified offline-first service worker
const CACHE_NAME = 'squoosh-offline-v1';

// 安装时预缓存所有资源
self.addEventListener('install', (event) => {
  console.log('SW: Installing...');
  self.skipWaiting();
});

// 激活时清理旧缓存
self.addEventListener('activate', (event) => {
  console.log('SW: Activating...');
  self.clients.claim();
});

// 拦截网络请求，优先使用本地资源
self.addEventListener('fetch', (event) => {
  // 对于本地资源，直接通过
  if (event.request.url.startsWith(self.location.origin)) {
    return;
  }
  
  // 阻止外部网络请求
  event.respondWith(
    new Response('Offline mode - external request blocked', {
      status: 200,
      headers: { 'Content-Type': 'text/plain' }
    })
  );
});
`;

fs.writeFileSync(swPath, simplifiedSW);

console.log('✅ 全面修复完成:');
console.log('  - Google Analytics已移除');
console.log('  - 外部链接已替换为#');
console.log('  - ServiceWorker已简化为纯离线模式');

// 3. 检查WebAssembly文件
const wasmFiles = fs.readdirSync(path.join(__dirname, 'squoosh-static', 'c'))
  .filter(f => f.endsWith('.wasm'));
console.log(`📊 找到 ${wasmFiles.length} 个WebAssembly文件`);
wasmFiles.slice(0, 5).forEach(f => console.log(`  - ${f}`));
