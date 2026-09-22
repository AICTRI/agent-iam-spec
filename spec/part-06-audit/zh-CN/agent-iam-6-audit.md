[English](../en/agent-iam-6-audit.md) · [简体中文](agent-iam-6-audit.md)

# 智能体身份与访问管理系列 — 第 6 部分：审计与安全事件

- 系列标识：`agent-iam-series`
- 部分标识：`agent-iam-6-audit`
- 版本：`0.1.0-draft`
- 日期：2026-09-22
- 状态：项目标准草案，非国际标准、国家标准或行业标准
- 许可证：CC BY 4.0（规范文本）

本部分规定全部部分共用的审计安全事件记录。

本中文文本是英文文本的等价翻译，供对照参考。两种语言文本冲突时，以英文文本为准。

## 1. 范围

本部分的安全事件记录用于审计，不同于 RFC 9334 中作为远程证明输入的 Attestation Evidence。字段名 `evidence_ref` 必须标识其引用的是证明证据、证明结果还是安全事件记录。

## 2. 规范性引用

- 第 1 部分定义术语与隐私原则。

## 3. 最小事件

下列操作必须产生安全 evidence：

- Agent 注册和 Authority Binding；
- Enrollment 成功和失败；
- Credential 签发、轮换、supersede 和撤销；
- 生命周期和实例状态转换；
- 身份 Token 签发、exchange 和 introspection；
- Policy Decision、Approval、Grant 和 PEP 结果；
- Federation Trust 变更和联邦验证；
- 撤销和关键运维操作。

## 4. 最小字段

安全事件记录必须至少包含：

```text
event_id, event_type, timestamp
namespace
agent_id and instance_id, when applicable
subject/actor/client/workload references, when applicable
lifecycle_epoch, when applicable
action and resource digest, when applicable
policy_version, when applicable
decision/grant/approval identifiers, when applicable
trace_id
outcome and reason_code
evidence references
```

## 5. 数据最小化

Evidence 和 outbox 不得保存：

- private key；
- 完整 bearer Token、PoP proof 或下游 credential；
- 未经限制的提示词、工具参数或业务 payload；
- 可由引用或摘要满足审计目的的敏感原文。

敏感 subject、resource 和 reason 应使用域分离摘要。拒绝事件应在限速、脱敏后持久化，不得只存在于进程内计数器。

## 6. 一致性与 Outbox

权威状态变化、evidence 和 outbox 应在同一事务提交。Outbox 必须定义至少一次投递、幂等消费者、重试、DLQ 和 redrive 语义。

## 附录 A. 迁移来源（参考）

| 现条款 | 映射到本部分 |
|---|---|
| §17.1 最小事件 | 第 3 节 |
| §17.2 最小字段 | 第 4 节 |
| §17.3 数据最小化 | 第 5 节 |
| §17.4 一致性与 outbox | 第 6 节 |
