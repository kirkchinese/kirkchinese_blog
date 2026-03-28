---
title: "毕设记录：那些让我痛苦的梯度爆炸问题"
description: "记录在可微分无人机仿真训练中遭遇的三类梯度NaN问题：normalize零向量、acos边界、PyTorch3D反向传播缺陷，以及对应的修复方案。"
pubDate: 2026-03-28
category: "debugging"
tags: ["梯度爆炸", "PyTorch", "PyTorch3D", "调试", "深度学习"]
author: "Arnold Kirk"
draft: false
featured: false
summary: "可微分物理训练中的三个梯度NaN源头：F.normalize零向量、acos精度边界、PyTorch3D投影除法。问题分析与解决方案完整记录。"
readingTime: 6
complexity: "intermediate"
repo: "https://github.com/kirkchinese/-"
---

> **注：** 本文由 AI 助手（夜河阳）协助整理，基于项目实际代码和调试日志生成。

## 背景

可微分物理训练有个天然的风险：梯度要从损失函数一路反传穿越物理模拟器，路径很长，任何一处数值不稳定都会导致 NaN 扩散。

我在训练过程中遇到了三类梯度爆炸问题，这里完整记录一下根因和修复方案，以后自己翻查也方便。

## 问题一：F.normalize 零向量梯度爆炸

**现象：** 训练早期随机触发 NaN，难以复现。

**根因：**

```python
# 旧代码 - 有问题
direction = F.normalize(thrust_vec, dim=-1)
```

`F.normalize` 在输入向量接近零时，梯度计算涉及除以范数，范数趋近于 0 导致梯度爆炸。

无人机刚初始化时，推力向量可能恰好很小，这个边界条件完全合法但会触发 bug。

**修复：**

```python
# 新代码 - 安全归一化
def safe_normalize(x, eps=1e-8):
    norm = x.norm(dim=-1, keepdim=True).clamp(min=eps)
    return x / norm
```

用 `clamp(min=eps)` 保证分母不为零，梯度保持有限。

## 问题二：acos 边界梯度爆炸

**现象：** 训练中期偶发 NaN，且难以通过梯度截断消除。

**根因：**

```python
# 旧代码 - 有问题
angle = torch.acos(cos_theta)
```

`acos(x)` 在 `x = ±1` 时导数是无穷大。当 `cos_theta` 精确等于 1.0（两向量完全平行）时，反向传播直接爆。

**修复：**

```python
# 新代码 - 输入 clamp
cos_theta_safe = cos_theta.clamp(-1 + 1e-6, 1 - 1e-6)
angle = torch.acos(cos_theta_safe)
```

把输入限制在导数有限的区域内。`1e-6` 的余量足够小，对角度计算精度几乎没影响。

## 问题三：PyTorch3D 透视投影反向传播

**现象：** 只有在某些相机位置下才出现 NaN，随机性强，复现困难。

**根因：**

PyTorch3D 的 `transform_points` 函数在做透视投影时，最后一步是除以 z 坐标。当相机位于特定位置时，z 坐标可能接近零，导致除法产生极大值，反向传播梯度爆炸。

这是 PyTorch3D 本身的问题。

**修复：**

渲染调用切断梯度——渲染器只提供视觉观测，不参与反向传播：

```python
with torch.no_grad():
    depth_image = renderer(mesh, camera)
```

神经网络从深度图里提取信息，梯度从策略网络 → 动作 → 物理模拟器这条路反传，绕过渲染器。

这个设计是合理的：渲染器的作用是生成观测，不是优化目标的一部分。

## 修复后的梯度流

```
深度图（no_grad，阻断）
    ↓（输入，无梯度）
神经网络（CNN → GRU → FC）
    ↓（梯度从这里开始）
动作 → 物理模拟器 → 新状态
    ↓
损失函数 → backward()
```

修完这三个问题之后，训练稳定了很多，NaN 基本消失。

## 一个想法

PyTorch3D 的透视投影梯度问题值得单独开一个 issue 给他们。目前的修复（切断梯度）是绕过，不是根治。如果以后有时间，可以提一个 PR：在 `transform_points` 里对 z 坐标做 `clamp`，让反向传播更健壮。

---

*上一篇：[毕设记录：用CMA-ES进化算法自动优化损失函数](/blog/diffable-drone-cmaes)*
