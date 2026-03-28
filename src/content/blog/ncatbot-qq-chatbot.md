---
title: "NCatBot：一个会主动找事的QQ聊天机器人"
description: "基于NapCat QQ协议和本地Ollama大模型的聊天机器人框架，支持私聊群聊、用户跟踪、消息队列，以及主动发消息找事的功能。"
pubDate: 2025-05-04
category: "project"
tags: ["QQ机器人", "NapCat", "Ollama", "聊天机器人", "Python"]
author: "Arnold Kirk"
draft: false
featured: false
summary: "用NapCat+Ollama搭建的QQ机器人，核心功能是多用户上下文感知对话和主动暖场，基于本地大模型运行，不依赖云端API。"
readingTime: 5
complexity: "beginner"
repo: "https://github.com/kirkchinese/chatbot"
---

> **注：** 本文由 AI 助手（夜河阳）协助整理，基于项目 README 和代码生成。

## 想法来源

想在QQ里跑一个能聊天的机器人，但不想依赖云端 API（费钱，而且对话记录上传到第三方服务器）。本地跑 Ollama，然后用 NapCat 接 QQ 协议，两者拼在一起。

「主动找事」是指：不只是被动回复，而是会在一段时间无人说话后主动发消息，像真实聊天里有人「冒泡」。

## 技术栈

- **NapCat**：QQ 协议实现，提供 WebSocket API
- **Ollama**：本地运行大语言模型，支持各种开源模型
- **Python**：胶水，把两者粘在一起

## 主要功能

### 多用户上下文感知对话

群聊里多个人说话，机器人会维护每个人的对话历史，回复时考虑这个人之前说过的话。

不是简单的单轮问答，有一定的上下文记忆。

### 用户跟踪模式

群聊里可以开启「跟踪用户」模式：

```
用户A: 跟踪用户
机器人: 已开启跟踪，优先响应你的消息
```

开启后，机器人会优先处理该用户的消息，适合需要深入对话的场景。

### 消息队列管理

群聊消息量大时，不会丢消息。所有消息进队列，按顺序处理，避免模型被同时多条消息冲击。

### 主动暖场（找事功能）

一段时间没人说话，机器人会主动发消息。话题从对话历史里提取，尽量和当前聊天内容相关，而不是随机发。

## 配置

核心配置在 `bot-init.py`：

```python
config.set_bot_uin("你的机器人QQ号")
config.set_ws_uri("ws://localhost:3001")  # NapCat WebSocket
config.set_token("your_token")

# 模型选择
modelstr = 'deepseek-r1-14b'  # 或者任何 Ollama 支持的模型
```

模型建议用 14B 参数以上的，太小的模型群聊回复质量很差。

## 运行方式

```bash
# 1. 启动 NapCat
# 2. 在 Ollama 里拉取模型
ollama pull deepseek-r1:14b

# 3. 启动机器人
python src/ncatbot/bot-init.py
```

## 局限性

这是一个「能跑的最小实现」，不是生产级的框架：

- 上下文管理比较简陋，长对话会超出模型 context window
- 没有持久化存储，重启后对话历史清空
- 「主动找事」的触发时机是固定间隔，不够智能
- 错误处理比较基础，NapCat 断连需要手动重启

后续如果有精力，可能会把记忆部分换成向量数据库，让机器人真的能「记住」之前的事。

---

*项目地址：[github.com/kirkchinese/chatbot](https://github.com/kirkchinese/chatbot)*
