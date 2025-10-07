# 🖼️ Squoosh Desktop

跨平台桌面版图片压缩工具，基于Google Squoosh构建的智能启动系统。

## ✨ 特性

- 🚀 **智能启动** - 自动检测Electron，优雅降级到浏览器模式
- 🌍 **跨平台** - Windows、macOS、Linux全支持
- 💾 **零依赖** - 纯Node.js实现，无第三方依赖
- 📱 **多架构** - x64、ARM64、ia32原生支持
- 🎯 **一键启动** - 下载即用，无需复杂配置

## 🚀 快速开始

### 方式1：下载安装包（推荐）
前往 [Releases页面](https://github.com/cloudv2077/Squoosh-Desktop/releases) 下载对应平台的安装包：
- Windows: `.exe`安装程序
- macOS: `.dmg`安装包
- Linux: `.AppImage`文件

### 方式2：源码运行
```bash
git clone https://github.com/cloudv2077/Squoosh-Desktop.git
cd Squoosh-Desktop

# Linux/macOS
./start.sh

# Windows  
start.bat
```

## 🛠️ 开发

### 本地构建
```bash
npm install
npm run build          # 构建所有平台
npm run build:win      # 仅Windows
npm run build:mac      # 仅macOS
npm run build:linux    # 仅Linux
```

### 版本发布
```bash
# 1. 修改版本号
npm version patch       # bug修复 (1.1.0→1.1.1)
npm version minor       # 新功能 (1.1.0→1.2.0)
npm version major       # 重大更新 (1.1.0→2.0.0)

# 2. 推送更改
git push origin main

# 3. 创建标签（触发自动构建发布）
git tag -a v1.x.x -m "版本说明"
git push origin v1.x.x
```

#### 需要修改的文件
- **必须**: `package.json` (版本号)
- **功能更新**: `main.js`, `scripts/fetch-squoosh.js`, 启动脚本
- **文档**: `README.md`, `RELEASE_NOTES.md`

## 🔧 工作原理

1. **智能检测** - 尝试启动Electron桌面应用
2. **优雅降级** - 失败时自动启动HTTP服务器
3. **浏览器模式** - 以Chrome应用模式打开
4. **完整体验** - 提供接近原生应用的用户体验

## 📁 项目结构

```
├── main.js                    # 核心应用入口
├── start.sh / start.bat      # 跨平台启动脚本
├── scripts/
│   └── fetch-squoosh.js      # 静态文件获取脚本
├── squoosh-static/           # Squoosh静态文件
└── .github/workflows/        # 自动构建配置
```

## 🤝 贡献

欢迎提交Issue和Pull Request来改进这个项目！

## 📄 许可证

Apache-2.0 License
