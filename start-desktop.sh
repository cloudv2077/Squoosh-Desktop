#!/bin/bash

echo "🎯 Squoosh Desktop - 桌面模式启动"
echo ""

# 启动HTTP服务器（后台运行）
echo "🚀 启动后台服务器..."
node start-production.js &
SERVER_PID=$!

# 等待服务器启动
sleep 3

# 获取服务器端口（默认8899）
PORT=8899

echo "✅ 服务器已启动 (PID: $SERVER_PID)"
echo "🖥️ 以应用模式打开浏览器..."

# 使用系统浏览器的应用模式打开
if command -v open &> /dev/null; then
    # macOS - 使用应用模式打开Chrome/Edge
    if [ -d "/Applications/Google Chrome.app" ]; then
        open -na "Google Chrome" --args --app="http://localhost:$PORT" --new-window
        echo "📱 已在Chrome应用模式中打开"
    elif [ -d "/Applications/Microsoft Edge.app" ]; then
        open -na "Microsoft Edge" --args --app="http://localhost:$PORT" --new-window  
        echo "📱 已在Edge应用模式中打开"
    else
        open "http://localhost:$PORT"
        echo "📱 已在默认浏览器中打开"
    fi
else
    echo "📱 请手动打开: http://localhost:$PORT"
fi

echo ""
echo "🌟 Squoosh Desktop 现在运行在桌面模式!"
echo "💡 提示: 关闭浏览器窗口时，服务器仍在后台运行"
echo "🛑 要完全停止服务器，请运行: kill $SERVER_PID"
echo ""
echo "按 Ctrl+C 停止服务器..."

# 等待用户中断
wait $SERVER_PID
