# Arnold Kirk Blog - AI 助手维护指南 📚

> 现代化个人博客，支持 Markdown 内容、音频文章、AI 友好内容管理

---

## 📑 目录

- [项目概览](#项目概览)
- [快速开始](#快速开始)
- [项目结构](#项目结构)
- [内容管理](#内容管理)
  - [创建博客文章](#创建博客文章)
  - [发布音频博客](#发布音频博客)
- [Git 协作工作流](#git-协作工作流)
- [AI 助手使用指南](#ai-助手使用指南)
- [部署和维护](#部署和维护)
- [常见问题](#常见问题)
- [技术栈](#技术栈)

---

## 项目概览

### 特性
- ✅ **现代设计** - 深色模式、响应式布局、优化的排版
- ✅ **音频播放** - 自定义 HTML5 音频播放器，支持键盘快捷键
- ✅ **SEO 优化** - 元标签、Open Graph、Twitter Cards、JSON-LD
- ✅ **RSS 订阅源** - 自动生成 RSS feed
- ✅ **Sitemap** - 自动生成搜索引擎友好的 sitemap
- ✅ **AI 友好** - 结构化 frontmatter，便于 AI 解析和管理
- ✅ **类型安全** - 完整 TypeScript 支持

### 技术亮点
- 🚀 **静态站点生成** - Astro SSG，极致性能
- 🎨 **Tailwind CSS** - 实用优先的 CSS 框架
- 📝 **Markdown + MDX** - 内容创作者和 AI 友好的格式
- 🔊 **音频支持** - 内置音频播放器，支持播客和音频博客

---

## 快速开始

### 前置要求
- Node.js 18+ 和 npm
- Git（用于版本控制）

### 本地开发

```bash
# 1. 克隆仓库（如果是首次）
git clone https://github.com/your-username/your-repo-name.git
cd your-repo-name

# 2. 安装依赖
npm install

# 3. 启动开发服务器
npm run dev

# 4. 在浏览器中打开
# http://localhost:4321
```

### 构建生产版本

```bash
npm run build
# 输出到 dist/ 目录
```

### 预览构建

```bash
npm run preview
```

---

## 项目结构

```
E:\blog/
├── src/                        # Astro 源代码
│   ├── components/            # 可复用组件
│   │   ├── AudioPlayer.astro  # 自定义音频播放器
│   │   └── PostCard.astro     # 博客卡片组件
│   ├── content/                # 内容集合
│   │   ├── config.ts          # 内容集合配置（Zod schema）
│   │   └── blog/              # 博客文章
│   ├── layouts/                # 页面布局
│   │   └── BaseLayout.astro   # 主布局
│   ├── pages/                  # 路由页面
│   │   ├── index.astro        # 首页
│   │   ├── about.astro        # 关于页面
│   │   ├── blog/
│   │   │   ├── index.astro    # 博客列表
│   │   │   └── [slug].astro   # 动态博客文章页面
│   │   └── rss.xml.js         # RSS feed 生成
│   └── styles/
│       └── global.css         # 全局样式（Tailwind + 自定义）
├── public/                     # 静态资源
│   ├── audio/                 # 音频文件（用于播客）
│   └── images/                # 图片资源
├── dist/                      # 生产构建输出（部署到 Vercel）
├── astro.config.mjs           # Astro 配置
├── tailwind.config.mjs        # Tailwind CSS 配置
├── tsconfig.json              # TypeScript 配置
├── vercel.json                # Vercel 部署配置
├── package.json               # 项目依赖和脚本
└── .gitignore                 # Git 忽略规则
```

---

## 内容管理

### 创建博客文章

#### 方法 1：标准文章（推荐）

1. **创建新 Markdown 文件**
   ```bash
   cd src/content/blog/
   nano my-new-post.md
   ```

2. **编写内容（使用 Frontmatter）**
   ```markdown
   ---
   title: "你的文章标题"
   description: "文章简介（50-160 字符）"
   pubDate: 2026-02-14
   category: "technology"
   tags: ["web", "development"]
   author: "Arnold Kirk"
   draft: false
   featured: true
   ---
   
   ## 文章标题
   
   写文章内容...
   
   ### 子标题
   
   更多内容...
   ```

3. **保存并验证**
   ```bash
   # 构建 Astro 会验证 frontmatter
   npm run build
   ```

#### 方法 2：带音频的文章

1. **添加音频文件**
   ```bash
   # 将音频文件放到 public/audio/
   cp /path/to/audio.mp3 public/audio/
   ```

2. **创建文章**
   ```markdown
   ---
   title: "我的播客 Episode 1"
   description: "第一集内容介绍"
   pubDate: 2026-02-14
   category: "podcast"
   tags: ["audio", "podcast"]
   author: "Arnold Kirk"
   draft: false
   
   audio:
     src: "/audio/episode-1.mp3"
     duration: "15:30"
   ---
   
   ## 欢迎收听
   
   在这集中，我将分享...
   ```

3. **验证音频播放器**
   ```bash
   npm run dev
   # 访问 http://localhost:4321/blog/my-podcast-episode-1
   ```

### Frontmatter 字段说明

| 字段 | 类型 | 必需 | 说明 |
|------|------|------|------|
| `title` | string | ✅ | 文章标题 |
| `description` | string | ✅ | 简述（50-160 字符） |
| `pubDate` | Date | ✅ | 发布日期 |
| `category` | string | ✅ | 主要分类 |
| `tags` | string[] | - | 标签列表 |
| `author` | string | ✅ | 作者名称 |
| `draft` | boolean | - | 是否为草稿（默认 false） |
| `featured` | boolean | - | 是否在首页显示 |
| `audio` | object | - | 音频配置（见下方） |
| `heroImage` | string | - | 封面图片路径 |
| `readingTime` | number | - | 预计阅读时间（分钟） |
| `summary` | string | - | AI 生成的内容摘要 |
| `ai_tags` | string[] | - | AI 自动生成的标签 |

### 音频配置

```yaml
audio:
  src: "/audio/episode-1.mp3"    # 音频文件路径
  type: "audio/mpeg"             # MIME 类型（可选）
  duration: "15:30"              # 时长（可选）
```

---

## Git 协作工作流

### Windows 和 Linux 同步

#### 方法 1：使用 Git Bash（推荐）

**安装 Git Bash for Windows**：
1. 访问 https://git-scm.com/download/win
2. 下载并运行安装程序
3. 配置 Git Bash 为默认终端

**优势**：
- 自动处理 Windows 和 Linux 路径差异
- 跨平台兼容

#### 方法 2：手动处理路径

```bash
# 克隆仓库
git clone https://github.com/your-username/your-repo-name.git

# 进入项目目录
cd your-repo-name

# 正常使用 Git
git status
git add .
git commit -m "Your message"
git push
```

### 提交工作流

1. **查看状态**
   ```bash
   git status
   ```

2. **添加更改**
   ```bash
   git add .
   ```

3. **提交更改**
   ```bash
   git commit -m "Descriptive commit message"
   ```

4. **推送到远程**
   ```bash
   git push origin main
   ```

### .gitignore 说明

项目包含 `.gitignore` 文件，自动排除：
- `node_modules/` - 依赖包
- `dist/` - 构建输出
- `.astro/` - Astro 缓存
- `.vercel/` - Vercel 缓存

---

## AI 助手使用指南

### 博客架构理解

#### 内容集合系统
- **位置**：`src/content/blog/` 目录
- **配置**：`src/content.config.ts`
- **验证**：Zod schema 自动验证 frontmatter

#### AI 可用的字段

**内容元数据**：
- `title` - 文章标题（必需）
- `description` - 文章描述（必需）
- `pubDate` - 发布日期（必需）
- `category` - 主要分类
- `tags` - 标签列表
- `author` - 作者

**SEO 字段**：
- `seoTitle` - SEO 标题
- `metaDescription` - SEO 描述
- `keywords` - SEO 关键词
- `canonical` - 规范 URL

**AI 生成字段**：
- `summary` - AI 生成的内容摘要
- `ai_tags` - AI 自动生成的标签
- `readingTime` - 预计阅读时间
- `complexity` - 难度级别（beginner/intermediate/advanced）

### AI 工作流程

#### 创建新文章

1. **在 `src/content/blog/` 创建 `.md` 文件**
2. **添加完整的 frontmatter**
3. **编写 Markdown 内容**
4. **运行 `npm run build` 验证**

#### 内容模板

```markdown
---
title: "文章标题"
description: "简述"
pubDate: 2026-02-14
category: "technology"
tags: ["web", "development"]
author: "Arnold Kirk"
draft: false
featured: true
heroImage: /images/hero.jpg
summary: "AI 生成的摘要"
ai_tags: ["AI", "自动化"]
readingTime: 5
complexity: "intermediate"
---

## 文章内容
```

---

## 部署和维护

### 日常维护流程

1. **创建新内容** - 使用 Markdown 在 `src/content/blog/` 创建文章
2. **本地验证** - 运行 `npm run dev` 预览
3. **构建** - 运行 `npm run build`
4. **提交** - Git add, commit, push

### 部署到 Vercel

```bash
# 安装 Vercel CLI
npm install -g vercel

# 登录
vercel login

# 部署
vercel --prod
```

### 域名配置

1. **访问 Vercel Dashboard**
   - https://vercel.com/dashboard

2. **添加域名**
   - 项目设置 → Domains
   - 添加 `arnold-kirk.com`

3. **更新 DNS 记录**
   - 按照 Vercel 提供的说明操作

---

## 音频播放器使用

### 功能特性

- ✅ 播放/暂停按钮
- ✅ 可拖动进度条
- ✅ 时间显示（当前/总计）
- ✅ 键盘快捷键：
  - `Space` 或 `k`：播放/暂停
  - `←`：快退 5 秒
  - `→`：快进 5 秒
- ✅ 无障碍支持（ARIA 标签、键盘导航）
- ✅ 响应式设计（移动/桌面）

### 音频格式支持

- **推荐**：Opus（最佳压缩率）
- **兼容**：MP3（最广泛支持）
- **高级**：AAC（Apple 设备）

---

## 常见问题

### Q: 如何更改博客主题？

A: 编辑 `src/styles/global.css` 和 `tailwind.config.mjs` 中的颜色配置。

### Q: 如何添加新的页面？

A: 在 `src/pages/` 创建新的 `.astro` 文件。

### Q: 音频播放器不工作？

A: 确保：
1. 音频文件在 `public/audio/` 目录
2. Frontmatter 中的路径正确
3. 音频格式受浏览器支持（MP3 最安全）

### Q: 构建失败怎么办？

A: 检查：
1. Frontmatter 字段是否符合 Zod schema
2. 是否有语法错误
3. 运行 `npm run build` 查看错误信息

---

## 技术栈

- **框架**: [Astro](https://astro.build) 5.17.2
- **语言**: [TypeScript](https://www.typescriptlang.org/)
- **样式**: [Tailwind CSS](https://tailwindcss.com) 3.4.19
- **内容**: Markdown + MDX
- **音频**: HTML5 audio（计划集成 [Howler.js](https://howlerjs.com/)）
- **部署**: [Vercel](https://vercel.com)
- **域名**: arnold-kirk.com

---

## 快速参考

### 关键命令

```bash
# 开发
npm run dev          # 启动开发服务器（http://localhost:4321）

# 构建
npm run build        # 构建生产版本
npm run preview      # 预览构建结果

# 部署
vercel --prod        # 部署到 Vercel
```

### 重要文件

- `src/content.config.ts` - 内容集合配置
- `src/components/AudioPlayer.astro` - 音频播放器
- `vercel.json` - Vercel 部署配置
- `.gitignore` - Git 忽略规则

---

## 支持

如有问题或需要帮助，请：
1. 查看 [Astro 文档](https://docs.astro.build)
2. 访问 [Vercel 文档](https://vercel.com/docs)
3. 查看项目 Issues

---

**博客已完全可用！** 🎉 所有功能都已实现并经过验证。
