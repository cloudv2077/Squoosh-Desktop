const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const tempDir = '.tmp';
const staticDir = 'squoosh-static';
const squooshDir = path.join(tempDir, 'squoosh');

function run() {
  // Skip if already exists and is substantial (not just a placeholder)
  const existingIndex = path.join(staticDir, 'index.html');
  if (fs.existsSync(existingIndex) && fs.statSync(existingIndex).size > 10000) {
    console.log('✅ Squoosh already built');
    return;
  }

  try {
    console.log('📥 Cloning Squoosh...');
    
    // Cleanup
    if (fs.existsSync(tempDir)) fs.rmSync(tempDir, { recursive: true });
    fs.mkdirSync(tempDir);
    
    // Clone
    execSync(`git clone --depth 1 https://github.com/GoogleChromeLabs/squoosh.git ${squooshDir}`, { stdio: 'pipe' });
    
    // Install & Build
    console.log('🔧 Building...');
    execSync('npm install', { cwd: squooshDir, stdio: 'pipe' });
    execSync('npm run build', { cwd: squooshDir, stdio: 'pipe', env: { ...process.env, NODE_ENV: 'production' } });
    
    // Try multiple possible build output paths
    const possibleBuildPaths = [
      path.join(squooshDir, 'build'),
      path.join(squooshDir, '.tmp', 'build', 'static'),
      path.join(squooshDir, 'dist'),
      path.join(squooshDir, 'static')
    ];
    
    let buildFound = false;
    for (const buildPath of possibleBuildPaths) {
      console.log(`🔍 Checking build path: ${buildPath}`);
      if (fs.existsSync(buildPath) && fs.existsSync(path.join(buildPath, 'index.html'))) {
        console.log(`✅ Found build at: ${buildPath}`);
        copyDir(buildPath, staticDir);
        buildFound = true;
        break;
      }
    }
    
    if (buildFound) {
      console.log('✅ Build complete - Squoosh copied successfully');
    } else {
      throw new Error('No valid build directory found');
    }
    
    // Cleanup
    fs.rmSync(tempDir, { recursive: true });
    
  } catch (error) {
    console.error('❌ Build failed:', error.message);
    // Create fallback
    if (!fs.existsSync(staticDir)) fs.mkdirSync(staticDir);
    fs.writeFileSync(path.join(staticDir, 'index.html'), 
      '<html><body><h1>❌ Build Failed</h1><p>Check network and try again</p></body></html>');
  }
}

function copyDir(src, dest) {
  if (!fs.existsSync(dest)) fs.mkdirSync(dest, { recursive: true });
  
  fs.readdirSync(src).forEach(item => {
    const srcPath = path.join(src, item);
    const destPath = path.join(dest, item);
    
    if (fs.statSync(srcPath).isDirectory()) {
      copyDir(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  });
}

if (require.main === module) run();
module.exports = run;

// 图小小汉化处理函数
async function applyTuXiaoXiaoLocalization() {
    const fs = require('fs');
    const path = require('path');
    
    console.log('🎨 应用图小小汉化...');
    
    const staticDir = 'squoosh-static';
    
    // 修改manifest.json
    const manifestPath = path.join(staticDir, 'manifest.json');
    if (fs.existsSync(manifestPath)) {
        let manifest = fs.readFileSync(manifestPath, 'utf8');
        manifest = manifest.replace(/"name":"Squoosh"/g, '"name":"图小小"');
        manifest = manifest.replace(/"short_name":"Squoosh"/g, '"short_name":"图小小"');
        manifest = manifest.replace(/Compress and compare images with different codecs, right in your browser\./g, '图小小 - 压缩和比较不同编码格式的图片，强大的图片优化工具');
        fs.writeFileSync(manifestPath, manifest);
    }
    
    // 修改index.html
    const htmlPath = path.join(staticDir, 'index.html');
    if (fs.existsSync(htmlPath)) {
        let html = fs.readFileSync(htmlPath, 'utf8');
        html = html.replace(/<title>Squoosh<\/title>/g, '<title>图小小</title>');
        html = html.replace(/content="Squoosh is the ultimate image optimizer[^"]*"/g, 'content="图小小是终极图片优化工具，让您可以使用不同编解码器压缩和比较图片。"');
        html = html.replace(/property="og:title" content="Squoosh"/g, 'property="og:title" content="图小小"');
        
        // 注入汉化脚本
        if (!html.includes('customize-ui.js')) {
            html = html.replace('</body>', '<script src="./customize-ui.js"></script></body>');
        }
        
        fs.writeFileSync(htmlPath, html);
    }
    
    // 复制汉化脚本
    const scriptSource = 'customize-ui.js';
    const scriptDest = path.join(staticDir, 'customize-ui.js');
    if (fs.existsSync(scriptSource)) {
        fs.copyFileSync(scriptSource, scriptDest);
    }
    
    console.log('✅ 图小小汉化应用完成！');
}

// 修改主函数，在构建完成后应用汉化
const originalRun = run;
run = async function() {
    await originalRun();
    await applyTuXiaoXiaoLocalization();
};
