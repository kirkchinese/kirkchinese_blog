#!/bin/bash
# Blog 本地构建测试脚本

set -e

echo "🧪 开始本地构建测试..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# 进入 Blog 目录
cd "$(dirname "$0")"

# 检查 description 长度
echo "📝 检查文章 description 长度..."
for file in src/content/blog/*.md; do
    if [ -f "$file" ]; then
        desc=$(grep "^description:" "$file" | cut -d'"' -f2)
        len=${#desc}
        if [ $len -lt 50 ]; then
            echo "❌ $(basename $file): description 太短 ($len 字符)"
            echo "   当前: $desc"
            exit 1
        else
            echo "✅ $(basename $file): $len 字符"
        fi
    fi
done
echo ""

# 尝试构建
echo "🏗️  开始构建..."
unset NODE_OPTIONS  # 避免 --disable-warning 错误

if npm run build; then
    echo ""
    echo "✅ 构建成功！"
    echo ""
    echo "📦 输出目录: dist/"
    ls -lh dist/ | head -5
    echo ""
    echo "🚀 可以安全推送了！"
    echo ""
    echo "推送命令:"
    echo "  git add -A"
    echo "  git commit -m 'message'"
    echo "  git push origin main"
else
    echo ""
    echo "❌ 构建失败！"
    echo "请修复错误后再推送。"
    exit 1
fi
