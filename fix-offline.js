const fs = require('fs');
const path = require('path');

console.log('🔧 修复Squoosh离线依赖...');

// 修复index.html中的外部URL
const indexPath = path.join(__dirname, 'squoosh-static', 'index.html');
let indexContent = fs.readFileSync(indexPath, 'utf8');

// 替换所有https://squoosh.app/c/为相对路径./c/
const originalContent = indexContent;
indexContent = indexContent.replace(/https:\/\/squoosh\.app\/c\//g, './c/');

if (indexContent !== originalContent) {
  fs.writeFileSync(indexPath, indexContent);
  console.log('✅ index.html外部URL已修复为相对路径');
} else {
  console.log('ℹ️ index.html无需修复');
}

// 检查修复结果
const externalUrls = (indexContent.match(/https:\/\/[^"'\s]+/g) || []).length;
console.log(`📊 剩余外部URL数量: ${externalUrls}`);
