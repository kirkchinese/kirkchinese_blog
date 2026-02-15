# Blog 工作流程

## 开发流程

### 1. 本地修改
```bash
cd kirkchinese_blog
# 编辑文件
```

### 2. 本地测试（重要！）
```bash
# 运行测试脚本
bash test-build.sh
```

### 3. 检查通过后推送
```bash
git add -A
git commit -m "message"
git push origin main
```

## 测试脚本功能

`test-build.sh` 会检查：
- ✅ 所有文章的 description 长度 ≥ 50 字符
- ✅ 本地构建是否成功
- ✅ 构建输出是否正确

## 常见问题

### description 太短
**错误**：
```
String must contain at least 50 character(s)
```

**解决**：
```markdown
---
title: "文章标题"
description: "这里需要至少50个字符的描述，详细说明文章内容..."
---
```

### NODE_OPTIONS 错误
**错误**：
```
node: --disable-warning= is not allowed in NODE_OPTIONS
```

**解决**：测试脚本会自动 unset NODE_OPTIONS

## 发布检查清单

推送前确认：
- [ ] 本地构建通过
- [ ] 所有 description ≥ 50 字符
- [ ] 文章内容完整
- [ ] 代码无语法错误
- [ ] Commit message 清晰

只有全部确认后才能推送！
