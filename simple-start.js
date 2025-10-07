// 简单的Squoosh Desktop启动器
const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

console.log('🎯 Squoosh Desktop 简单启动器');
console.log('');

// 检查本地文件
const localSquoosh = path.join(__dirname, 'squoosh-static', 'index.html');

if (fs.existsSync(localSquoosh)) {
  console.log('✅ 本地Squoosh文件存在');
  console.log('📂 文件路径:', localSquoosh);
  
  // 尝试用默认浏览器打开
  console.log('🌐 使用默认浏览器打开Squoosh...');
  
  const command = process.platform === 'darwin' ? 'open' : 
                 process.platform === 'win32' ? 'start' : 'xdg-open';
  
  spawn(command, [localSquoosh], { stdio: 'inherit' });
  
  console.log('✅ Squoosh Desktop 启动成功!');
} else {
  console.log('❌ 本地文件不存在，打开在线版本...');
  const command = process.platform === 'darwin' ? 'open' : 
                 process.platform === 'win32' ? 'start' : 'xdg-open';
  
  spawn(command, ['https://squoosh.app'], { stdio: 'inherit' });
}
