@echo off
chcp 65001 >nul
echo 🎯 Squoosh Desktop - 智能启动脚本 (Windows)
echo 自动选择最佳启动方式
echo.

REM 检查Node.js
node --version >nul 2>&1
if errorlevel 1 (
    echo ❌ 需要Node.js
    pause
    exit /b 1
)

for /f "tokens=*" %%i in ('node --version') do set NODE_VERSION=%%i
echo ✅ Node.js版本: %NODE_VERSION%
echo 📦 准备应用...

REM 确保静态文件存在
if not exist "squoosh-static" (
    echo 🔄 获取Squoosh静态文件...
    npm run prebuild >nul 2>&1
) else if not exist "squoosh-static\index.html" (
    echo 🔄 获取Squoosh静态文件...
    npm run prebuild >nul 2>&1
)

echo 🚀 启动应用...
echo.

REM 检查Electron是否可用
set ELECTRON_AVAILABLE=false

REM 检查本地安装的Electron
if exist ".\node_modules\.bin\electron.cmd" (
    echo 🔍 检测到本地Electron安装
    .\node_modules\.bin\electron.cmd --version >nul 2>&1
    if not errorlevel 1 (
        set ELECTRON_AVAILABLE=true
    ) else (
        echo ⚠️ Electron安装不完整
    )
) else (
    REM 检查全局Electron
    where electron >nul 2>&1
    if not errorlevel 1 (
        echo 🔍 检测到全局Electron安装
        electron --version >nul 2>&1
        if not errorlevel 1 (
            set ELECTRON_AVAILABLE=true
        ) else (
            echo ⚠️ 全局Electron安装不完整
        )
    )
)

if "%ELECTRON_AVAILABLE%"=="true" (
    echo ✅ 使用Electron桌面应用启动 ^(最佳体验^)
    echo 🖥️ 启动桌面窗口...
    
    if exist ".\node_modules\.bin\electron.cmd" (
        .\node_modules\.bin\electron.cmd .
    ) else (
        electron .
    )
) else (
    echo ✅ 使用生产级HTTP服务器启动 ^(桌面体验^)
    echo 🌐 启动HTTP服务器...
    
    REM 创建临时服务器文件
    echo const http = require^('http'^); > .temp_server.js
    echo const fs = require^('fs'^); >> .temp_server.js
    echo const path = require^('path'^); >> .temp_server.js
    echo const net = require^('net'^); >> .temp_server.js
    echo. >> .temp_server.js
    echo function isPortAvailable^(port^) { >> .temp_server.js
    echo     return new Promise^(^(resolve^) =^> { >> .temp_server.js
    echo         const server = net.createServer^(^); >> .temp_server.js
    echo         server.listen^(port, ^(^) =^> { >> .temp_server.js
    echo             server.close^(^(^) =^> resolve^(true^)^); >> .temp_server.js
    echo         }^); >> .temp_server.js
    echo         server.on^('error', ^(^) =^> resolve^(false^)^); >> .temp_server.js
    echo     }^); >> .temp_server.js
    echo } >> .temp_server.js
    echo. >> .temp_server.js
    echo async function findAvailablePort^(startPort = 8899^) { >> .temp_server.js
    echo     console.log^(`检查端口可用性，从 ${startPort} 开始...`^); >> .temp_server.js
    echo     for ^(let port = startPort; port ^< startPort + 100; port++^) { >> .temp_server.js
    echo         if ^(await isPortAvailable^(port^)^) { >> .temp_server.js
    echo             console.log^(`找到可用端口: ${port}`^); >> .temp_server.js
    echo             return port; >> .temp_server.js
    echo         } >> .temp_server.js
    echo     } >> .temp_server.js
    echo } >> .temp_server.js
    echo. >> .temp_server.js
    echo const mimeTypes = { >> .temp_server.js
    echo     '.html': 'text/html', >> .temp_server.js
    echo     '.js': 'application/javascript', >> .temp_server.js
    echo     '.wasm': 'application/wasm' >> .temp_server.js
    echo }; >> .temp_server.js
    echo. >> .temp_server.js
    echo async function startServer^(^) { >> .temp_server.js
    echo     const port = await findAvailablePort^(^); >> .temp_server.js
    echo     const staticPath = path.join^(__dirname, 'squoosh-static'^); >> .temp_server.js
    echo     const server = http.createServer^(^(req, res^) =^> { >> .temp_server.js
    echo         res.setHeader^('Cross-Origin-Embedder-Policy', 'require-corp'^); >> .temp_server.js
    echo         res.setHeader^('Cross-Origin-Opener-Policy', 'same-origin'^); >> .temp_server.js
    echo         let filePath = req.url === '/' ? '/index.html' : req.url; >> .temp_server.js
    echo         filePath = path.join^(staticPath, filePath^); >> .temp_server.js
    echo         fs.readFile^(filePath, ^(err, data^) =^> { >> .temp_server.js
    echo             if ^(err^) { >> .temp_server.js
    echo                 res.writeHead^(404^); res.end^('Not Found'^); >> .temp_server.js
    echo             } else { >> .temp_server.js
    echo                 res.writeHead^(200^); res.end^(data^); >> .temp_server.js
    echo             } >> .temp_server.js
    echo         }^); >> .temp_server.js
    echo     }^); >> .temp_server.js
    echo     server.listen^(port, ^(^) =^> { >> .temp_server.js
    echo         console.log^(`Squoosh Desktop 启动成功: http://localhost:${port}`^); >> .temp_server.js
    echo     }^); >> .temp_server.js
    echo } >> .temp_server.js
    echo. >> .temp_server.js
    echo startServer^(^); >> .temp_server.js
    
    start /B node .temp_server.js
    
    timeout /t 3 /nobreak >nul
    
    echo 🖥️ 启动桌面应用模式...
    
    REM 尝试使用Chrome应用模式
    if exist "%ProgramFiles%\Google\Chrome\Application\chrome.exe" (
        start "" "%ProgramFiles%\Google\Chrome\Application\chrome.exe" --app=http://localhost:8899 --new-window
        echo 📱 已在Chrome桌面应用模式中打开
    ) else if exist "%ProgramFiles(x86)%\Google\Chrome\Application\chrome.exe" (
        start "" "%ProgramFiles(x86)%\Google\Chrome\Application\chrome.exe" --app=http://localhost:8899 --new-window
        echo 📱 已在Chrome桌面应用模式中打开
    ) else if exist "%ProgramFiles%\Microsoft\Edge\Application\msedge.exe" (
        start "" "%ProgramFiles%\Microsoft\Edge\Application\msedge.exe" --app=http://localhost:8899 --new-window
        echo 📱 已在Edge桌面应用模式中打开
    ) else (
        start http://localhost:8899
        echo 📱 已在默认浏览器中打开
    )
    
    echo.
    echo 🌟 Squoosh Desktop 现在运行在桌面模式!
    echo 💡 关闭此窗口将停止服务器
    echo.
    pause
    
    REM 清理
    taskkill /f /im node.exe 2>nul
    del .temp_server.js 2>nul
)
