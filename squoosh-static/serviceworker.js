
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
