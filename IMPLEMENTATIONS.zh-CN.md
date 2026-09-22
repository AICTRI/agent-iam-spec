[English](IMPLEMENTATIONS.md) · [简体中文](IMPLEMENTATIONS.zh-CN.md)

# 参考实现

本页面列出 Agent IAM 系列的实现。实现属于参考性内容：它不定义规范，其状态也不修改任何条款。

本页列出的实现均不被认定为完全符合规范。请查阅各实现的一致性声明，以及 [`mappings/`](mappings/) 中记录的当前差距。

## 组件

| 组件 | 系列部分 | 在规范中的角色 | 仓库 |
|---|---|---|---|
| EIDOVELA | 2、3、5 | Agent 身份提供商：Agent 注册、Authority Binding、工作负载登记、生命周期与 epoch、持钥证明凭据、身份 Token、权威 introspection、联邦 | 核心（私有）：<https://github.com/axisrobo/eidovela> · 公开契约与 SDK：<https://github.com/axisrobo/eidovela-open> |
| AEGIVELA | 4、6 | Agent 授权平面：Principal 解析、授权模式、策略决策、Execution Grant、委托、审批、撤销 | 核心（私有）：<https://github.com/axisrobo/aegivela> · 公开契约与 SDK：<https://github.com/axisrobo/aegivela-open> |

`-open` 仓库以 Apache-2.0 提供公开契约、SDK、示例与一致性 fixture。核心仓库承载实现，当前为私有，需要授权访问。

## 组件协作方式

```text
企业人类 IdP / 组织权威
          |
          v
EIDOVELA  Agent 身份提供商
          注册、Authority Binding、工作负载登记、
          生命周期与 epoch、PoP 身份凭据、联邦
          |
          v
AEGIVELA  Agent 授权平面
          Principal 解析、PDP、审批、委托、
          Execution Grant、撤销
          |
          v
PEP       API 网关、工具网关、模型入口、业务服务、执行器
```

身份凭据证明“谁在调用”以及当前身份状态，不构成对动作的授权。执行授权由授权平面决定，这是规范的要求。

## 映射与一致性状态

逐条映射以及进入一致性声明前必须解决的差距记录在：

- [`mappings/eidovela-aegivela.md`](mappings/eidovela-aegivela.md)

当前状态概要：

| 组件 | 状态 |
|---|---|
| EIDOVELA | 部分符合：身份对象模型、生命周期 epoch 与 PoP 登记已存在；请求级 PoP、实例与凭据在线撤销、attestor 接入以及 brokered token 撤销尚不完整 |
| AEGIVELA | 部分符合：授权模式、决策与 grant 已存在；token exchange 路径尚未满足 canonical allow lineage，部分契约与运行时行为存在偏差 |

## 一致性声明模板

发布一致性声明的实现应注明：

```text
实现名称：
版本 / commit：
支持的部分与等级：Part 2 | 3 | 4 | 5（分别列出）
声明的组合 profile：Identity | Authorization | Federated
支持的 proof Profile：
支持的 Token / artifact 版本：
撤销 SLO：
发现机制与缓存上限：
已知扩展：
未满足的条款：
```

## 添加实现

提交 Pull Request，在组件表中增加一行，并在可用时于 [`mappings/`](mappings/) 下提供映射文档。请包含：

- 组件名称及其实现的规范部分与角色；
- 仓库链接，以及访问受限时的说明；
- 声明的部分、等级、组合 profile 和未满足的条款；
- 引用规范部分与条款的映射文档。
