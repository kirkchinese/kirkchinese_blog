# Windows 和 Linux Git 协作指南

## 📋 目录
- [环境设置](#环境设置)
- [克隆和同步](#克隆和同步)
- [路径问题解决](#路径问题解决)
- [日常使用流程](#日常使用流程)
- [故障排除](#故障排除)

---

## 环境设置

### Windows 设置

#### 安装 Git Bash（推荐）

1. **下载安装 Git Bash**
   - 访问 https://git-scm.com/download/win
   - 下载完整版安装程序
   - 运行安装程序

2. **配置 Git Bash**
   - 安装完成后，Git Bash 会自动添加到右键菜单
   - 设置 "默认配置文件" → 选择 "Git Bash"

3. **验证安装**
   ```bash
   # 打开 Git Bash
   git --version
   # 应该显示：git version 2.x.x.x.windows.x
   ```

#### Git Bash 优势
- ✅ 自动处理 Windows 和 Linux 路径转换
- ✅ 支持 Unix 风格命令（ls, nano, vim）
- ✅ 原生 SSH 支持
- ✅ 跨平台一致性

### Linux 设置

```bash
# 安装 Git
sudo apt-get update
sudo apt-get install git

# 验证安装
git --version
```

---

## 克隆和同步

### 首次克隆仓库

#### 在 Windows 上

```bash
# 使用 Git Bash（推荐）
git clone https://github.com/your-username/your-repo-name.git

# 或使用 Windows CMD
git clone https://github.com/your-username/your-repo-name.git
```

#### 在 Linux 上

```bash
git clone https://github.com/your-username/your-repo-name.git
```

### 后续同步

#### 从远程拉取更改

**Windows 和 Linux 都使用相同命令**：
```bash
# 进入项目目录
cd your-repo-name

# 拉取最新更改
git pull origin main
```

---

## 路径问题解决

### Windows 路径格式

#### 在 Git Bash 中使用 Unix 风格路径

```bash
# Git Bash 中使用正斜杠
cd e:/blog
# 或相对路径
cd blog

# 不要使用反斜杠
# ❌ 错误：cd E:\blog
# ✅ 正确：cd e:/blog 或 cd /e/blog
```

#### 在 Windows CMD 中使用 Windows 路径

```bash
# CMD 中使用反斜杠
cd E:\blog

# 或使用正斜杠（Git 自动转换）
cd E:/blog
```

### 项目位置

| 环境 | 路径格式 | 示例 |
|------|----------|------|
| **Git Bash** | Unix 风格 | `/e/blog` 或 `e:/blog` |
| **CMD** | Windows 风格 | `E:\blog` |
| **PowerShell** | 都可以 | `E:\blog` 或 `E:\blog\` |

---

## 日常使用流程

### 完整工作流程（跨平台一致）

#### 1. 进入项目目录

```bash
# Git Bash / Linux
cd e:/blog

# Windows CMD / PowerShell
cd E:\blog
```

#### 2. 检查状态

```bash
git status
```

#### 3. 更新内容

**创建新博客文章**：
```bash
# 在 src/content/blog/ 创建新文件
cd src/content/blog
nano my-new-post.md
```

**添加音频文件**：
```bash
# 将音频复制到 public/audio/
cp /path/to/audio.mp3 public/audio/
```

#### 4. 验证更改

```bash
# 构建项目验证是否有错误
npm run build

# 启动开发服务器预览
npm run dev
```

#### 5. 提交更改

```bash
# 添加所有更改
git add .

# 查看状态
git status

# 提交
git commit -m "Add: New blog post about X"
```

#### 6. 推送到远程

```bash
# 推送到 GitHub
git push origin main
```

---

## 故障排除

### 常见问题 1：路径错误

**问题**：
```bash
fatal: 'E:/blog' 不在工作目录中
```

**解决方案**：
```bash
# 方法 1：使用正确的路径格式
cd e:/blog

# 方法 2：使用相对路径
cd blog

# 方法 3：使用完整路径
cd /e/blog
```

### 常见问题 2：文件名包含空格

**问题**：
文件名或路径包含空格导致命令失败

**解决方案**：
```bash
# 使用引号包裹路径
cd "folder with spaces"

# 或使用转义
cd folder\ with\ spaces
```

### 常见问题 3：权限错误（Linux）

**问题**：
```bash
Permission denied (publickey)
```

**解决方案**：
```bash
# 1. 生成 SSH 密钥
ssh-keygen -t rsa -b 4096 -C "your_email@example.com"

# 2. 复制公钥到剪贴板
cat ~/.ssh/id_rsa.pub | clip

# 3. 添加到 GitHub
# GitHub → Settings → SSH Keys → New SSH key
# 粘贴公钥并保存

# 4. 测试连接
ssh -T git@github.com
```

### 常见问题 4：分支名称不匹配

**问题**：
```bash
error: src refspec main does not match any
```

**解决方案**：
```bash
# 查看默认分支
git branch

# 如果是 master，创建 main 分支
git branch -M main

# 推送到 main
git push -u origin main
```

---

## 最佳实践

### 统一使用 Git Bash

**优势**：
- ✅ 跨平台一致性好
- ✅ 支持 Unix 风格命令
- ✅ 避免路径格式问题
- ✅ 内置 SSH 支持

**设置 Git Bash 为默认**：
1. 右键点击文件夹 → "Git Bash Here"
2. 或在 Windows Terminal 设置中选择 Git Bash

### 避免混合使用路径格式

**始终使用**：
```bash
# 正斜杠（跨平台兼容）
e:/blog/src/content/blog

# 或相对路径
cd blog
```

**避免使用**：
```bash
# 反斜杠（仅 Windows）
E:\blog\src\content\blog
```

---

## 自动化脚本

### Windows 批处理脚本

创建 `sync.bat`：

```batch
@echo off
echo 正在同步博客仓库...

cd E:\blog

echo 拉取最新更改...
git pull origin main

echo 检查状态...
git status

echo.
echo 同步完成！
pause
```

### Linux Shell 脚本

创建 `sync.sh`：

```bash
#!/bin/bash
echo "正在同步博客仓库..."

cd ~/blog

echo "拉取最新更改..."
git pull origin main

echo "检查状态..."
git status

echo "同步完成！"
```

**使用**：
```bash
# Windows
sync.bat

# Linux
chmod +x sync.sh
./sync.sh
```

---

## 总结

### 关键要点

1. **使用 Git Bash** - 避免 Windows/Linux 路径问题
2. **统一路径格式** - 始终使用正斜杠或相对路径
3. **简化工作流** - 保持跨平台命令一致
4. **自动化重复任务** - 使用脚本简化同步

### 快速命令参考

```bash
# 克隆
git clone https://github.com/your-username/repo-name.git

# 同步
git pull origin main

# 状态
git status

# 提交
git add .
git commit -m "message"
git push origin main
```

---

**需要帮助？**

如果遇到问题：
1. 检查 [Git 官方文档](https://git-scm.com/doc)
2. 查看项目 README.md
3. 联系 Vercel 支持：https://vercel.com/support

---

**协作愉快！** 🎉
