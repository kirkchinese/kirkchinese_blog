---
title: "自链接神经网络：一个实验性的LLM架构探索"
description: "尝试在标准Transformer架构上引入自链接机制，增强神经元间局部连接。1.2亿参数，混合注意力设计，记录实验过程和踩到的坑。"
pubDate: 2025-05-04
category: "research"
tags: ["神经网络", "LLM", "Transformer", "自注意力", "实验性"]
author: "Arnold Kirk"
draft: false
featured: false
summary: "将自链接机制引入Transformer的实验性探索。混合注意力层结合标准自注意力与自链接机制，1.2亿参数，RoPE位置编码，记录优缺点与踩坑经历。"
readingTime: 6
complexity: "advanced"
repo: "https://github.com/kirkchinese/self-link-network"
---

> **注：** 本文由 AI 助手（夜河阳）协助整理，基于项目 README 和代码生成。

## 这是什么

一个实验性项目。核心想法是：在标准 Transformer 里，注意力机制擅长捕捉全局依赖；但神经元之间的**局部连接**是不是也有价值？

所以在自注意力的基础上加了一个「自链接层」，让神经元可以对自己的历史激活保持一定的记忆。

## 架构设计

### 混合注意力层（HybridAttentionLayer）

```python
output = (1 - self_link_ratio) * self_attention(x) + self_link_ratio * self_link(x)
```

两个机制加权混合：
- **标准自注意力**：负责全局上下文
- **自链接机制**：负责神经元级别的局部依赖

`self_link_ratio` 是可调参数，控制两者比重。

### 增强版自链接层（EnhancedSelfLinkLayer）

多头设计，每个头有独立的前馈网络。每个头学不同粒度的局部连接模式。

### 其他配置

- 12 层 Transformer 结构
- 768 维隐藏层
- 1.2 亿参数
- RoPE（旋转位置编码）
- 最大序列长度 1024

## 训练流程

先预训练，用 minimind 项目提供的高质量中文数据集：

```bash
python pretrain.py \
  --train_data_path minimind/dataset/pretrain_hq.jsonl \
  --self_link_ratio 0.1
```

然后在下游任务上微调。

## 结果和问题

坦白说，结果比较混：

**有用的地方：**
- 训练稳定性比纯 Transformer 略好（自链接的残差连接效果）
- 在某些续写任务上主观感觉更「连贯」

**没有验证的地方：**
- 没有实现量化评估（困惑度等），只做了交互式测试
- 不知道性能提升是来自自链接机制本身，还是模型规模变化

**没解决的问题：**
- 训练收敛比标准 Transformer 慢
- `self_link_ratio` 需要精细调优，0.1 是拍的，不知道最优值
- 评估时偶发卡死，原因没查出来
- 显存占用大，全精度训练对小 GPU 不友好

## 反思

这个项目做到一半发现，自链接的想法和 LSTM/GRU 的门控机制有点像，只是实现方式不同。如果当初先做文献调研，可能会选一个更有区分度的方向。

不过作为一次「先做再想」的实验，学到了不少关于如何构建和训练自定义网络结构的经验。

下次做类似的实验，会先把评估指标写完，再开始训练。没有量化指标的实验，事后很难说清楚到底有没有效果。

---

*项目地址：[github.com/kirkchinese/self-link-network](https://github.com/kirkchinese/self-link-network)*
