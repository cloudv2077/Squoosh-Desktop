# 🎯 Squoosh Desktop

基于Google Squoosh的桌面图片压缩工具，提供完整的图片优化功能和真正的桌面应用体验。

## ✨ 特性

- 🖼️ **完整的图片压缩功能** - 包含Google Squoosh的所有编解码器
- 🖥️ **真正的桌面体验** - Electron应用或浏览器应用模式
- 🛡️ **智能降级机制** - 自动选择最佳启动方式
- 🌐 **离线可用** - 无需网络连接即可使用
- 🔧 **零配置** - 开箱即用，自动处理所有依赖

## 🚀 快速开始

### 开发环境运行

```bash
# 克隆项目
git clone https://github.com/cloudv2077/Squoosh-Desktop.git
cd Squoosh-Desktop

# 安装依赖
npm install

# 启动应用 (推荐方式 - 智能启动)
./start.sh          # macOS/Linux
start.bat            # Windows

# 或直接使用Electron
npm start
```

### 📦 打包分发

```bash
# 构建所有平台
npm run build

# 特定平台构建
npm run build:win    # Windows
npm run build:mac    # macOS  
npm run build:linux  # Linux
```

## 🎯 启动方式说明

本项目提供智能启动系统，会自动选择最佳运行方式：

### 1. Electron模式 (最佳体验)
- ✅ 真正的桌面应用窗口
- ✅ 系统级菜单和快捷键
- ✅ 完整的桌面集成

### 2. HTTP服务器模式 (降级方案)
当Electron不可用时自动启动：
- 🌐 本地HTTP服务器 + Chrome应用模式
- 📱 无边框窗口，接近原生体验
- 🔧 使用Node.js内置模块，无外部依赖

## 🛠️ 技术架构

### 前端
- **Google Squoosh** - 完整的Web应用
- **WebAssembly** - 高性能图片编解码器
- **Service Worker** - 离线支持

### 后端  
- **Electron** - 桌面应用框架 (主要方式)
- **Node.js HTTP** - 内置服务器 (降级方案)

### 构建系统
- **electron-builder** - 跨平台打包
- **npm scripts** - 自动化工具链

## 📁 项目结构

```
squoosh-desktop/
├── main.js                 # Electron主进程 (无外部依赖)
├── start.sh                # macOS/Linux智能启动脚本
├── start.bat               # Windows智能启动脚本  
├── package.json            # 项目配置和构建设置
├── squoosh-static/         # 完整Squoosh应用静态文件
│   ├── index.html          # 主页面
│   ├── *.wasm              # WebAssembly编解码器
│   └── *.js                # 应用逻辑
├── scripts/
│   └── fetch-squoosh.js    # 获取Squoosh静态文件脚本
└── dist/                   # 构建输出目录
```

## 🔧 故障排除

### Electron安装问题
如果遇到Electron下载失败：
```bash
# 使用智能启动脚本，会自动降级到HTTP模式
./start.sh
```

### 端口冲突
应用会自动检测可用端口（8899-8998范围）

### WASM加载问题
确保使用HTTPS或localhost，应用已自动配置所需的安全头部。

## 🌟 核心优势

1. **网络问题解决** - 绕过Electron二进制下载问题
2. **架构兼容** - 支持ARM64和x64架构
3. **零外部依赖** - 使用Node.js内置模块
4. **智能降级** - 始终能提供可用的桌面体验
5. **完整功能** - 保持所有Squoosh功能不受影响

## 📄 许可证

Apache-2.0 License

---

🎉 享受完整的Squoosh Desktop体验！

## 🔄 版本更新指南

### 发布新版本前需要修改的文件

#### 1. 必须修改
```
📄 package.json          # 更新 "version": "x.x.x"
```

#### 2. 功能更新时修改
```
📄 main.js               # 核心功能代码
📄 scripts/fetch-squoosh.js  # 静态文件获取脚本
📄 start.sh / start.bat  # 启动脚本（如有变化）
```

#### 3. 文档更新
```
📄 README.md             # 功能说明和使用文档
📄 RELEASE_NOTES.md      # 版本更新日志（可选）
```

### 🚀 快速发布流程

```bash
# 1. 更新版本号
npm version patch        # 或 minor/major

# 2. 提交更改
git push origin main

# 3. 创建标签（触发自动构建）
git tag -a v1.x.x -m "版本说明"
git push origin v1.x.x
```

### 📋 版本类型说明
- `patch`: Bug修复 (1.1.0 → 1.1.1)
- `minor`: 新功能 (1.1.0 → 1.2.0)  
- `major`: 重大更改 (1.1.0 → 2.0.0)

> 💡 推送标签后，GitHub Actions会自动构建所有平台的安装包并发布到Release页面
