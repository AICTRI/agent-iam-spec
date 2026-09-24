# RFC-0001: Removal of `tenant_id` in Favor of Authority Namespace

- Status: Draft
- Authors: _（待填写）_
- Date: 2026-09-22
- Affected documents and clauses: `spec/en/agent-iam-spec.md` 与 `spec/zh-CN/agent-iam-spec.md` 第 4.14–4.16、5.2、6.1、6.2、6.3、6.6、7.1、7.5、7.6、9.2、10.1、10.2、10.3、10.4、12.2、13.1、13.3、14、15.1、16.1、16.2、17.2、18.3、20、24 节；`SECURITY.md`；`mappings/eidovela-aegivela.md`、`mappings/spiffe.md`
  - 注：这些条款随后由 RFC-0002 重组进 Agent IAM 系列的七个部分；单文档版本已删除。对应关系为 Part 1（4.14–4.16、5.2、24）、Part 2（6.1–6.3、6.6、7.1、7.5、7.6）、Part 3（9.2、10.1–10.4）、Part 4（12.2、13.1、13.3、14、18.3）、Part 5（15.1 的信任部分、16.1、16.2）、Part 6（17.2）、Part 7（20）；15.1 的凭据/实例选择器归入 Part 3，Decision/Grant/Approval 选择器归入 Part 4。
- Type: Normative

## Summary

从规范中彻底移除 `tenant_id`，改以可分层的 `Authority Namespace`（组织/合作方根命名空间 + 组织内划分子命名空间）作为命名、隔离与唯一性的基础。原先所有 “tenant-scoped” 或 `tenant_id` 字段改为 “namespace-scoped” 或 `namespace` 字段；逻辑 Agent 的唯一性由 `namespace + agent_id`（等价于 `(issuer, subject)`）确定。部署方仍可保留私有的本地分区键，但它不属于本规范，不得作为互操作声明字段。

## Motivation

现行草案把 `tenant_id` 用作几乎所有隔离与唯一性判断的作用域，但它既未在第 4 节定义，又同时承担三种互不相同的语义：

1. 多租户 SaaS 的数据隔离/运营/计费分区；
2. 信任与权威边界（Authority Root / 组织 / issuer）；
3. 标识命名空间（`agent_id` 的唯一性作用域）。

由此产生的问题：

- **命名空间过平。** 第 6.1、7.1 节只有 `tenant_id + agent_id` 一层，无法表达“组织 → 组织内划分 → 逻辑 Agent → Agent 实例”的层次；企业生态（客户、合作伙伴、供应商）交互缺少组织级命名锚点。
- **职责重叠。** 第 6.3 节已声明跨域唯一性依赖 `(issuer, subject)`，且 `iss` 示例 `https://id.example.com/t/acme` 实际已把 tenant 编码进 issuer 路径，说明真正的全局命名层是 issuer，`tenant_id` 只是退化的单段。
- **联邦压平。** 第 16.1/16.2 节把 Federation Trust 做成 tenant-scoped 且禁止 peer 指定/覆盖本地 tenant，伙伴方的命名空间不是一等公民，只能被临时映射，与生态模型冲突。
- **对齐风险。** `GB/Z 185.2` 身份码、SPIFFE trust domain 与 WIMSE Identifier 都更接近可分配、可分层、全局唯一的命名/寻址；把 trust domain 硬绑定到扁平 tenant 需要一个额外 shim。
- **安全/正确性。** `tenant_id` 无 canonical 规则、无全局唯一性要求，跨部署可能重名；JTI 重放缓存、撤销、联邦信任都按 tenant 隔离，同一实体在不同 tenant 视图下可能无法一致撤销。

RFC 早期草案曾采用“降级而非删除”，但保留 `tenant_id` 会持续诱导实现把它当作身份锚点，并让“tenant 与 namespace 的映射”成为长期歧义来源。因此决定直接移除。

## Detailed design

### 1. 术语（第 4.14–4.16 节）

- **Namespace**：主体控制、可委托、全局可寻址的标识作用域，具有稳定 canonical 表示，通常为部署方控制的 HTTPS URI。
- **Authority Namespace**：组织/客户/合作方/供应商控制的根 Namespace，可含 0..n 层组织内划分，是跨域身份的全局命名锚点。
- **Organization Unit**：Authority Namespace 内的一层划分，通过命名空间层级表达，不需要独立扁平标识。

不再定义 `Tenant` / `tenant_id`。

### 2. 命名空间层次（新增第 6.6 节）

```text
Authority Namespace（主体控制的根，全局唯一、可委托）
  └─ 组织内划分（0..n 层子 Namespace）
       └─ 逻辑 Agent ID（在该 Namespace 内唯一）
            └─ Agent Instance（逻辑实例）
```

Authority Namespace 全局唯一、可委托、不得重分配；组织内划分必须为子 Namespace 并遵循同一 canonical 规则；本地 Agent ID 在其 Authority Namespace 内唯一；同一部署接入的多个组织各自拥有 Namespace；联邦必须保留双方 Namespace 并维持主体隔离。

### 3. 标识、记录与唯一性

- 第 5.2 节可信来源删除 `tenant_id`，保留 `namespace`。
- 第 6.1 节标识层次为四种：Authority Namespace、本地 Agent ID、跨域 Principal Key、Workload ID。
- 第 6.2 节本地 Agent ID 在其 Authority Namespace 内唯一，删除 tenant 退化说明。
- 第 6.3 节跨域比较由“跨 tenant”改为“跨 Namespace”；issuer 必须解析到 Authority Namespace。
- 第 7.1 节 Agent Identity Record 删除 `tenant_id`，唯一性约束为 `namespace + agent_id`。
- 第 7.5 节 Workload Registration 删除 `tenant_id`，trust domain 必须预先关联同一 Authority Namespace。
- 第 7.6 节 Agent Instance 记录字段 `tenant_id` 改为 `namespace`。

### 4. 凭据、授权、撤销与联邦

- 第 9.2 节 enrollment challenge 为 namespace-scoped。
- 第 10.1 节身份 Token 声明仅保留 `namespace (canonical) and/or a namespace-scoped iss`，删除 `tenant_id` 及其一致性条款。
- 第 10.2 节 JTI 在 namespace 内原子消费；第 10.3 节 Instance 必须与 Agent 同 namespace；第 10.4 节在线验证检查 namespace-scoped 撤销选择器。
- 第 12.2、13.1、13.3、14 节的 tenant 绑定改为 namespace 绑定。
- 第 15.1 节撤销按 namespace-scoped selector；第 16.1 节 Federation Trust 为 namespace-scoped，Peer claim 不得指定/覆盖本地 namespace；第 16.2 节 Brokered Principal 保留来源 Authority Namespace，不得把 peer Namespace 压平为另一个 Namespace。
- 第 17.2 节安全事件字段 `tenant_id` 改为 `namespace`；第 18.3 节 prompt injection 不得选择 namespace。

### 5. 一致性（第 20、24 节）

- Level 1 为“Authority Namespace 内唯一的 Agent ID”；Level 2/3 的撤销与 Federation Trust 为 namespace-scoped。
- 第 24 节待决项改为 Authority Namespace 的 canonical 化方式、层次深度上限及与 `GB/Z 185.2` 身份码层级的映射。

### 6. 迁移

- 实现应将现有 `tenant_id` 迁移为 `namespace`，并保证 `namespace + agent_id` 全局唯一；
- 部署方可以在内部保留私有分区键，但不得将其作为 Token claim、Decision/Grant 绑定或跨域互操作字段；
- 迁移期可接受仅含旧 `tenant_id` 的已签发 Token，但签发方必须同时写入可解析到 Authority Namespace 的 `iss`，且新签发产物必须使用 `namespace`。

## Impact

- Compatibility: 不兼容（规范性变更，字段移除）。使用 `tenant_id` 的 Token、Decision、Grant、事件与 API 需迁移到 `namespace`。
- Affected profiles: `identity-token.md`、`enrollment.md`、`authorization.md`、`delegation.md`、`federation.md`、`audit.md`。
- Affected reference implementations: 独立 Agent Registry 必须将 Agent/Agent ID、Authority Namespace、Authority Binding 和发现从 `tenant_id` 迁移为 `namespace`；EIDOVELA（STS、Federation）与 AEGIVELA（Trusted Principal、撤销）必须消费该 namespace；`mappings/eidovela-aegivela.md` 已记录阻塞项。
- Security impact: 正面。消除 `tenant_id` 扁平重名、跨域撤销不一致与 tenant/issuer 双重锚点风险。
- Privacy impact: 中性。组织级命名可能泄露组织关系，需按第 19 节在跨域披露时最小化。

## Alternatives considered

1. **降级而非删除（前稿方案）。** 保留 `tenant_id` 作本地分区，持续推进会造成 tenant/namespace 长期并存与映射歧义。
2. **改名为 realm/partition。** 语义更清楚但仍需一个与 namespace 并列的字段，未解决扁平与联邦压平问题。
3. **完全删除且不提供本地分区概念（本方案）。** 部署本地隔离由实现自行处理，规范不暴露该字段。

## Unresolved questions

1. Authority Namespace 的 canonical 化是否直接采用 RFC 3986/HTTPS，还是采用反向 DNS 或 DID？
2. 命名空间层次深度是否有上限，如何避免与 `GB/Z 185.2` 身份码层级冲突？
3. 联邦场景下 peer Authority Namespace 的信任与撤销如何与本地 namespace-scoped 撤销统一？
4. 是否需要在非规范附录中给出部署本地分区键的参考做法？

## Decision

_Filled in by maintainers._
