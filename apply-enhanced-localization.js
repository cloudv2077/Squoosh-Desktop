const fs = require('fs');
const path = require('path');

console.log('🎨 应用增强版图小小汉化...');

// 修改index.html，确保汉化脚本被正确加载
const htmlPath = 'squoosh-static/index.html';
if (fs.existsSync(htmlPath)) {
    let html = fs.readFileSync(htmlPath, 'utf8');
    
    // 替换标题
    html = html.replace(/<title>.*?<\/title>/g, '<title>图小小</title>');
    
    // 替换meta描述
    html = html.replace(/content="Squoosh is the ultimate image optimizer[^"]*"/g, 
        'content="图小小是专业的图片压缩优化工具，支持多种格式，本地处理保护隐私。"');
    
    // 替换OpenGraph信息
    html = html.replace(/property="og:title" content="[^"]*"/g, 
        'property="og:title" content="图小小 - 专业图片压缩工具"');
    html = html.replace(/property="og:description" content="[^"]*"/g, 
        'property="og:description" content="图小小是专业的图片压缩优化工具，支持WebP、AVIF、JPEG、PNG等格式。"');
    
    // 移除现有的汉化脚本引用
    html = html.replace(/<script[^>]*customize-ui\.js[^>]*><\/script>/g, '');
    
    // 在</body>前添加汉化脚本，确保在所有内容加载后执行
    html = html.replace('</body>', `
    <!-- 图小小汉化脚本 -->
    <script>
        // 延迟加载汉化脚本，确保React应用完全渲染后再执行
        setTimeout(function() {
            var script = document.createElement('script');
            script.src = './customize-ui.js';
            script.onload = function() {
                console.log('🎨 图小小汉化脚本加载完成');
            };
            document.head.appendChild(script);
        }, 1000);
    </script>
    </body>`);
    
    fs.writeFileSync(htmlPath, html);
    console.log('✅ index.html 增强汉化完成');
} else {
    console.log('⚠️ index.html 文件不存在，跳过HTML汉化');
}

// 修改manifest.json
const manifestPath = 'squoosh-static/manifest.json';
if (fs.existsSync(manifestPath)) {
    try {
        let manifestContent = fs.readFileSync(manifestPath, 'utf8');
        let manifest = JSON.parse(manifestContent);
        
        manifest.name = "图小小";
        manifest.short_name = "图小小";
        manifest.description = "图小小 - 专业图片压缩优化工具，支持WebP、AVIF、JPEG、PNG等格式，本地处理保护隐私";
        
        fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));
        console.log('✅ manifest.json 汉化完成');
    } catch (error) {
        console.log('⚠️ manifest.json 解析失败，使用文本替换方式');
        let manifest = fs.readFileSync(manifestPath, 'utf8');
        manifest = manifest.replace(/"name":"[^"]*"/g, '"name":"图小小"');
        manifest = manifest.replace(/"short_name":"[^"]*"/g, '"short_name":"图小小"');
        manifest = manifest.replace(/"description":"[^"]*"/g, '"description":"图小小 - 专业图片压缩优化工具"');
        fs.writeFileSync(manifestPath, manifest);
        console.log('✅ manifest.json 文本替换汉化完成');
    }
} else {
    console.log('⚠️ manifest.json 文件不存在，跳过manifest汉化');
}

console.log('🎉 增强版图小小汉化应用完成！');
console.log('📝 汉化内容包括：');
console.log('   - HTML页面标题和元数据');
console.log('   - PWA应用配置信息'); 
console.log('   - 界面元素动态翻译脚本');
console.log('   - 品牌标识和自定义样式');
