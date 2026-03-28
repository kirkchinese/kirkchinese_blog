---
title: "memu-plug-openclaw：给OpenClaw做了一个Windows友好的长期记忆插件"
description: "基于memU SDK为OpenClaw AI助手开发的长期记忆插件，解决Windows兼容性问题，新增Web管理面板、多语言记忆提取和文档变更检测等功能。"
pubDate: 2026-03-08
category: "project"
tags: ["OpenClaw", "AI助手", "记忆系统", "插件开发", "Python"]
author: "Arnold Kirk"
draft: false
featured: true
summary: "为OpenClaw开发的memU记忆插件Windows移植版，新增Web管理面板、身份感知记忆提取、文档变更检测，基于uv管理Python环境。"
readingTime: 7
complexity: "intermediate"
repo: "https://github.com/kirkchinese/memu-plug-openclaw"
---

> **注：** 本文由 AI 助手（夜河阳）协助整理，基于项目 README 和实际使用经验生成。

## 起因

用 OpenClaw 的时候，每次开新会话 AI 都是全新的，完全不记得之前说过什么。

memU 是一个语义记忆系统，可以给 AI 加上跨会话的长期记忆。原版 [memu-engine-for-OpenClaw](https://github.com/duxiaoxiong/memu-engine-for-OpenClaw) 在 Linux/macOS 上跑得不错，但 Windows 上有好几个地方会出问题：锁文件路径、信号处理、Python 环境管理都是 Unix 特有的写法。

所以做了这个移植版，顺手加了一些觉得有用的功能。

## 做了什么

### Windows 原生支持

主要改动：
- 锁文件改用 Windows 兼容的实现
- 信号处理适配（`SIGTERM` 在 Windows 上行为不同）
- 路径分隔符统一用 `pathlib.Path`

### uv 环境管理

原版需要手动创建 virtualenv。改成用 `uv run` 执行脚本：

```bash
# 不需要手动 pip install，uv 会自动处理
uv run scripts/search.py --query "上次的项目进度"
```

首次运行自动安装依赖，之后直接用。对不太熟悉 Python 环境管理的用户友好一些。

### Web 管理面板

加了一个本地 Web 面板（`http://127.0.0.1:8377`），可以直接在浏览器里：
- 查看记忆条目（按类型/时间筛选）
- 浏览已摄入的文档
- 搜索记忆
- 删除不需要的条目

不用再开终端敲命令来排查问题。

### 多语言身份感知记忆提取

原版的记忆提取在中文对话里，AI 的行为有时会被误归属给用户。配置 `userName` 和 `assistantName` 后，提取时会正确区分"AI做了什么"和"用户说了什么"。

```json
{
  "userName": "白泽",
  "assistantName": "夜河阳",
  "language": "zh"
}
```

### 文档变更检测

工作区文档（`AGENTS.md`、`MEMORY.md` 等）用 SHA-256 哈希追踪，只在内容变化时重新摄入，不会重复处理。文件删除时，关联的记忆条目会同步清理。

### 毫秒级时间戳 Sidecar

会话处理时，给每个对话 part 生成一个 `.session.meta.json` 时间戳文件。用于确保记忆条目的时间排序正确，在跨会话检索时更精准。

## 核心架构

```
OpenClaw Gateway
    ↓ (工具调用)
memu-plug-openclaw (TypeScript 入口)
    ↓ (子进程)
Python 脚本 (uv run)
    ↓
memU SDK → SQLite 数据库
```

工具暴露给 OpenClaw：
- `memory_search`：语义搜索
- `memory_get`：按路径获取
- `memory_flush`：立即同步当前会话

## 一些坑

**skills/ 目录误摄入**：原版会把工作区的 skills 文件夹也吃进去。这些是技能描述文件，不应该作为记忆存储。现在加了三层硬排除。

**`plugins install` 触发自启动**：安装插件时脚本不应该启动后台服务，但原版会。修了这个问题，现在只在 gateway 交互模式下启动。

## 使用方式

目前只支持本地安装（OpenClaw 的插件系统不支持 GitHub URL 直接安装）：

```bash
git clone https://github.com/kirkchinese/memu-plug-openclaw
cd memu-plug-openclaw
openclaw plugins install -l .
```

---

*项目地址：[github.com/kirkchinese/memu-plug-openclaw](https://github.com/kirkchinese/memu-plug-openclaw)*
