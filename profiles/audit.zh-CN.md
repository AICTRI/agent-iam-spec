# Profile：审计与安全事件

- Profile 标识：`agent-iam-profile-audit`
- 适用：第 6 部分 `agent-iam-6-audit`
- 系列版本：`0.3.0-draft`
- 状态：草案（发布后具规范性）
- 语言：英文为规范性主文本；本文件为等价翻译。

本 Profile 收窄第 6 部分第 3–6 节，不得放宽第 6 部分任何 `MUST`/`MUST NOT`。

## 1. 范围

定义最小安全事件、Security Event Record 的最小字段、数据最小化，以及事务/outbox 一致性。Security Event Record 为全部部分共用的唯一 envelope。

## 2. 最小事件

合规部署 MUST 至少为以下产生 evidence：

- 登记与证明结果（含拒绝）；
- 凭据签发、轮换、取代与撤销；
- 生命周期与 instance 状态迁移；
- 身份 Token 签发、exchange 与 introspection；
- Policy Decision、Approval、Grant 与 PEP 结果；
- Federation Trust 变更与联邦验证；
- 撤销与关键运维操作。

拒绝事件 SHOULD 在限速与脱敏后持久化，MUST NOT 仅以进程内计数器存在。

## 3. 最小字段

Security Event Record MUST 至少包含：

```text
eventId, eventType, timestamp
namespace
agentId 与 instanceId（适用时）
subject/actor/client/workload 引用（适用时）
agentEpoch（适用时）
action 与 resource digest（适用时）
policyVersion（适用时）
decision/grant/approval 标识（适用时）
traceId
outcome 与 reasonCode
evidence 引用
```

`tenant` MUST NOT 作为必需字段（RFC-0003）。关联使用 `namespace` 与 `traceId`。

## 4. 数据最小化

Evidence 与 outbox MUST NOT 存储：

- 私钥；
- 完整 bearer Token、PoP proof 或下游凭据；
- 不受限的提示词、工具参数或业务载荷；
- 可通过引用或摘要满足审计目的的敏感明文。

敏感 subject、resource 与 reason SHOULD 使用域分隔摘要。携带禁止字段的记录 MUST 在入库前拒绝或脱敏。

## 5. 一致性与 outbox

权威状态变更、evidence 与 outbox SHOULD 在同一事务提交。outbox MUST 定义至少一次投递、幂等消费者、重试、死信与重投语义。持久化失败 MUST 回滚状态变更。

## 6. 一致性

- `../conformance/part-06-audit/reject-event-persisted.positive.json`
- `../conformance/part-06-audit/event-redaction.negative.json`
- `../conformance/part-06-audit/transaction-consistency.positive.json`
- `../conformance/cross-repo/part-06-audit/p6-security-event-persisted.json`
- `../conformance/cross-repo/part-06-audit/p6-event-redaction.json`
- `../conformance/cross-repo/part-06-audit/p6-transaction-consistency.json`

声明本 Profile 的实现 MUST 通过以上全部向量。

## 7. 引用

- 第 1 部分 §6.2 canonical 化（域分隔摘要）。
- 第 6 部分 `schemas/security-event.schema.json`。
- `../conformance/cross-repo/part-06-audit/`。
