const fs = require('fs');
const path = require('path');

console.log('🎨 应用图小小汉化...');

// 修改manifest.json
const manifestPath = 'squoosh-static/manifest.json';
if (fs.existsSync(manifestPath)) {
    let manifest = fs.readFileSync(manifestPath, 'utf8');
    
    // 解析JSON
    let manifestObj = JSON.parse(manifest);
    
    // 修改字段
    manifestObj.name = "图小小";
    manifestObj.short_name = "图小小";
    manifestObj.description = "图小小 - 压缩和比较不同编码格式的图片，强大的图片优化工具";
    
    // 写回文件
    fs.writeFileSync(manifestPath, JSON.stringify(manifestObj));
    console.log('✅ manifest.json 汉化完成');
}

// 修改index.html
const htmlPath = 'squoosh-static/index.html';
if (fs.existsSync(htmlPath)) {
    let html = fs.readFileSync(htmlPath, 'utf8');
    
    // 替换标题
    html = html.replace(/<title>Squoosh<\/title>/g, '<title>图小小</title>');
    
    // 替换meta描述
    html = html.replace(/content="Squoosh is the ultimate image optimizer[^"]*"/g, 
        'content="图小小是终极图片优化工具，让您可以使用不同编解码器压缩和比较图片。"');
    
    // 替换OpenGraph标题
    html = html.replace(/property="og:title" content="Squoosh"/g, 
        'property="og:title" content="图小小"');
    
    // 注入汉化脚本
    if (!html.includes('customize-ui.js')) {
        html = html.replace('</body>', '<script src="./customize-ui.js"></script></body>');
    }
    
    fs.writeFileSync(htmlPath, html);
    console.log('✅ index.html 汉化完成');
}

// 确保汉化脚本存在
const scriptDest = 'squoosh-static/customize-ui.js';
const scriptSource = 'customize-ui.js';
if (fs.existsSync(scriptSource) && !fs.existsSync(scriptDest)) {
    fs.copyFileSync(scriptSource, scriptDest);
    console.log('✅ 汉化脚本已复制');
}

console.log('🎉 图小小汉化应用完成！');
