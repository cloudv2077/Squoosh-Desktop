const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const tempDir = '.tmp';
const staticDir = 'squoosh-static';
const squooshDir = path.join(tempDir, 'squoosh');

function run() {
  // Skip if already exists
  if (fs.existsSync(path.join(staticDir, 'index.html'))) {
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
    
    // Copy files
    const buildDir = path.join(squooshDir, '.tmp', 'build', 'static');
    if (fs.existsSync(buildDir)) {
      copyDir(buildDir, staticDir);
      console.log('✅ Build complete');
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
