[English](../en/agent-iam-7-conformance.md) · [简体中文](agent-iam-7-conformance.md)

# 智能体身份与访问管理系列 — 第 7 部分：一致性与测试

- 系列标识：`agent-iam-series`
- 部分标识：`agent-iam-7-conformance`
- 版本：`0.1.0-draft`
- 日期：2026-09-22
- 状态：项目标准草案，非国际标准、国家标准或行业标准
- 许可证：CC BY 4.0（规范文本）

本部分定义各部分的一致性以及系列级组合 profile。它取代了原先假设单一文档的 Level 1/2/3 模型。

本中文文本是英文文本的等价翻译，供对照参考。两种语言文本冲突时，以英文文本为准。

## 1. 范围

本部分规定：

- 各部分一致性等级；
- 系列组合 profile；
- 一致性声明的内容；
- 测试向量与互操作测试事件；
- 与 `profiles/` 下 profile 的关系。

## 2. 规范性引用

全部部分。

## 3. 各部分一致性等级

各部分定义自身的一致性等级。至少包括：

### 3.1 第 2 部分：注册与发现

- namespace-scoped Agent ID 及 `namespace + agent_id` 唯一性；
- 不可变 Authority Binding；
- Agent/Instance 分离与单调 epoch 生命周期；
- discovery document 与解析规则；
- 注册与生命周期的基础 evidence。

### 3.2 第 3 部分：身份与认证

- Enrollment challenge 与工作负载证明；
- 持钥证明与短时身份 Token；
- Token 请求证明；
- 对 Agent、Instance 和 credential generation 状态的权威在线验证；
- 凭据撤销。

### 3.3 第 4 部分：授权与委托

- subject/actor/client/workload 分离；
- 授权模式与有效权限；
- 版本化 PDP Decision；
- audience/resource/task 绑定的 Execution Grant；
- PEP 与 namespace-scoped 撤销；
- 权限不可放大。

### 3.4 第 5 部分：联邦

- namespace-scoped Federation Trust；
- PoP 联邦验证；
- 本地/联邦主体隔离；
- trust disable 的在线撤销；
- 跨域 evidence correlation。

## 4. 系列组合 profile

系列定义以下组合 profile：

| Profile | 组成 |
|---|---|
| `Identity` | 第 2 部分 + 第 3 部分 |
| `Authorization` | `Identity` + 第 4 部分 |
| `Federated` | `Authorization` + 第 5 部分 |

第 6 部分的审计要求适用于任何声明的 profile。本部分适用于任何声明的 profile。

## 5. 一致性声明

一致性声明必须列出：

- 支持的部分与等级；
- 声明的组合 profile（如有）；
- 支持的 proof Profile；
- 支持的 Token/artifact 版本；
- 撤销 SLO；
- 发现机制与缓存上限；
- 已知扩展；
- 任何未满足的条款。

声明不得仅声称“兼容 Agent IAM”。

## 6. 测试向量与互操作测试事件

- 测试向量发布在 `conformance/` 下，必须包含正反用例。
- 每个反例必须说明其检验的部分与条款。
- 向量必须语言中立且可复现。
- 行为依赖 profile 时，向量必须声明 profile 与版本。

## 7. 与 Profile 的关系

`profiles/` 下的 profile 只能收窄或细化其所扩展的部分。Profile 必须声明其适用的部分标识与系列版本，且不得放宽该部分的 `MUST` 或 `MUST NOT`。

## 附录 A. 迁移来源（参考）

| 现条款 | 映射到本部分 |
|---|---|
| §20.1 Level 1 Agent Identity | 第 4 节（`Identity`） |
| §20.2 Level 2 Agent Authorization | 第 4 节（`Authorization`） |
| §20.3 Level 3 Federated Agent IAM | 第 4 节（`Federated`） |
| conformance/ 与 profiles/ | 第 3、6、7 节 |
