[English](../en/agent-iam-2-registration-discovery.md) · [简体中文](agent-iam-2-registration-discovery.md)

# 智能体身份与访问管理系列 — 第 2 部分：智能体注册与发现

- 系列标识：`agent-iam-series`
- 部分标识：`agent-iam-2-registration-discovery`
- 版本：`0.1.0-draft`
- 日期：2026-09-22
- 状态：项目标准草案，非国际标准、国家标准或行业标准
- 许可证：CC BY 4.0（规范文本）

本部分规定 Agent 命名、身份记录、生命周期、注册表和身份发现。它是认证（第 3 部分）和授权（第 4 部分）的基础。

本中文文本是英文文本的等价翻译，供对照参考。两种语言文本冲突时，以英文文本为准。

## 1. 范围

本部分规定：

- Authority Namespace 层次与标识层次；
- 身份对象模型：Agent Identity Record、Agent Class、Authority Binding、Agent Blueprint、Workload Registration 和 Agent Instance；
- Agent 与 Instance 生命周期状态机及其不变量；
- 注册表：注册事务、唯一性和管理面要求；
- 发现：将 Namespace 或 Agent Identifier 解析为受信签发方元数据、密钥和信任包。

能力、工具和业务资源目录以及能力发现不在范围内。

## 2. 规范性引用

- 第 1 部分定义术语、可信数据来源、失败关闭、canonical 化和撤销 freshness 词表。
- 第 6 部分定义用于注册、生命周期和发现事件的安全事件 envelope。

## 3. 术语

除第 1 部分术语外：

### 3.1 Registry

一个或多个 Authority Namespace 的 Agent 记录、Authority Binding、Workload Registration、Instance 和生命周期状态的权威存储。注册表即身份权威。

### 3.2 Discovery Document

在 Authority Namespace 下发布的、经签名或 HTTPS 保护的文档，用于公布签发权威、注册表端点、验证密钥、支持的 Profile 和联邦信任配置。

## 4. 标识规范

### 4.1 标识层次

本部分区分四种标识：

| 标识 | 作用域 | 示例 | 用途 |
|---|---|---|---|
| Authority Namespace | 全局、可委托 | `https://id.example.com/org/acme` | 组织/合作方及组织内划分的命名与寻址 |
| 本地 Agent ID | Authority Namespace 内 | `agt_01J...` | 数据库主标识、API 路径 |
| 跨域 Agent Principal Key | issuer 范围 | `(iss, sub)` | Token、联邦、审计 |
| Workload ID | trust domain 内 | `spiffe://example.org/ns/a/sa/b` | 运行实例证明 |

### 4.2 本地 Agent ID

本地 Agent ID：

- 必须由身份权威生成；
- 必须在其 Authority Namespace 内唯一；
- 必须是不透明值，消费者不得解析其中的业务含义；
- 创建后不得修改；
- Agent 被撤销后不得重用；
- 不得包含人名、邮箱、组织名称或其他不必要的个人信息；
- 必须提供至少 128 bit 的标识空间和足够的碰撞安全性；标识暴露会形成枚举风险时，还必须具有足够不可预测性。使用 UUID 时应该选择 RFC 9562 定义的合适版本。

`agt_<opaque-id>` 是本系列的推荐本地表示，不是已注册的国际 URI scheme。

### 4.3 全局唯一性

跨 Namespace 或跨组织时，裸 `agent_id` 不具有全局唯一性。跨域主体键必须以 `(issuer, subject)` 二元组确定。issuer 必须解析到一个 Authority Namespace，因此 `(issuer, subject)` 等价于 `(Authority Namespace, Agent Subject)`；Namespace 可以包含组织内划分层，但各层必须共同形成同一个稳定 canonical value。issuer 注册时必须形成稳定的 canonical value；Token 验证时必须与该注册值执行精确字符串比较，不得在验证阶段通过 URI 规范化折叠不同 issuer。subject 必须在该 issuer 下唯一且永不重分配。RFC 9493 的 `iss_sub` 可以作为该二元组的结构化表示：

```json
{
  "format": "iss_sub",
  "iss": "https://id.example.com/org/acme",
  "sub": "agt_01JABCDEF..."
}
```

需要 URI 表示时，应使用由部署方控制的 HTTPS 命名空间，例如：

```text
https://id.example.com/org/acme/agents/agt_01JABCDEF...
```

实现不得自创未注册的 URI scheme 并宣称其具有国际互操作性。

### 4.4 命名空间层次

为支持企业与客户、合作伙伴和供应商 Agent 的交互，标识应按以下层次组织：

```text
Authority Namespace（主体控制的根，全局唯一、可委托）
  └─ 组织内划分（0..n 层子 Namespace）
       └─ 逻辑 Agent ID（在该 Namespace 内唯一）
            └─ Agent Instance（逻辑实例）
```

- Authority Namespace 必须全局唯一、可委托，且不得重分配；
- 组织内划分必须表达为子 Namespace，并沿用一个 canonical 规则；
- 本地 Agent ID 必须在其 Authority Namespace 内唯一，不得跨 Namespace 假定唯一；
- 接入同一部署的多个组织必须各自拥有 Authority Namespace，不得共享或相互覆盖；
- 联邦必须保留双方 Authority Namespace，并按第 5 部分维持主体隔离。

### 4.5 与 SPIFFE ID 的关系

SPIFFE ID 标识 trust domain 内的工作负载。逻辑 Agent ID 与 SPIFFE ID 可以建立一对多或多代绑定，但不得默认相等：

```text
Agent Identity 1 --- n Agent Instance 1 --- 1 current Workload Identity
```

只有当部署明确保证 Agent 与 Workload 生命周期完全相同，且不需要独立的 Authority Binding、Agent epoch 或实例历史时，才可以复用同一 URI；该简化不属于本系列的推荐模式。

### 4.6 国家身份码和外部标识

如部署需要兼容 `GB/Z 185.2-2026` 的智能体身份码，应将其保存为带命名空间和签发方的外部标识，不得仅凭外部代码覆盖本地 Agent Identity：

```json
{
  "type": "gbz185_identity_code",
  "issuer": "<verified issuing authority>",
  "value": "<identity code>"
}
```

外部标识建立、变更和解除关联必须产生审计事件，并经过签发方真实性验证。

## 5. 身份对象模型

### 5.1 Agent Identity Record

最小记录应包含：

```text
namespace
agent_id
agent_class
blueprint_id and blueprint_version, if used
authority_binding_ref
sponsor_ref, optional
lifecycle_state
lifecycle_epoch
created_at
updated_at
```

`namespace + agent_id` 必须唯一，它是唯一性依据。注册 Agent、创建 Authority Binding 和记录注册 evidence 应在同一事务提交。

### 5.2 Agent Class

本系列定义：

| Class | Authority Root | 约束 |
|---|---|---|
| `twin` | `human_master` | 恰好一个不可变的人类主控 |
| `service` | `organization_root` | 不得伪造或携带 human master |
| `ephemeral` | `human_master` 或由部署 Profile 明确规定 | 必须有短生命周期和显式到期策略 |

部署若不支持 `ephemeral`，必须拒绝而不是降级为 `twin` 或 `service`。

### 5.3 Authority Binding

每个 Agent 必须有且仅有一个 Authority Binding。Authority Root 变更不得原地更新；系统必须撤销旧 Agent ID，并创建新的 Agent Identity。

### 5.4 Agent Blueprint

如使用 Blueprint，它必须版本化并具有 `draft`、`published`、`deprecated` 等可判定状态。注册时必须校验并持久化同一个明确版本，不得校验“最新版本”后保存调用方提供的另一个版本。

### 5.5 Workload Registration

Workload Registration 必须至少包含：

```text
namespace
workload_registration_id
platform
selector
trust_domain
allowed_proof_methods
status
```

信任域必须预先关联到同一 Authority Namespace。所有存储实现，包括测试或内存实现，都应执行相同的 namespace/trust-domain 约束。

### 5.6 Agent Instance

Agent Instance 必须至少包含：

```text
namespace
instance_id
agent_id
workload_registration_id
workload_id
artifact_digest, optional
attestation_ref
credential_generation
lease_expires_at, optional
instance_state
```

`attestation_ref` 必须能够关联到实际验证结果，不得只在 schema 中声明而不写入。填充这些字段的 Enrollment 与证明流程由第 3 部分规定。

## 6. 生命周期

### 6.1 Agent 状态机

本系列采用：

```text
registered -> enrolled -> active -> suspended
     |           |          |          |
     +-----------+----------+----------+-> revoked

suspended -> enrolled -> active
revoked   -> no transition
```

实现可以保留内部 `draft` 状态，但不得为其签发可用身份凭据或执行授权。

### 6.2 生命周期不变量

- 每次合法状态转换必须原子地令 `lifecycle_epoch` 严格增加；
- epoch 不得回退或重用；
- `revoked` 必须是终态；
- 只有 `active` 的本地 Agent 可以获得新的身份 Token 或 Execution Grant；无本地 Agent 记录的 Federated/Brokered Principal 必须通过 active Federation Trust、PoP 和第 5 部分的权威在线验证后，才可以按策略获得 Execution Grant；
- `suspended` Agent 恢复前必须重新完成所需的 enrollment 或等价再验证；
- 在线验证必须要求 Token epoch 等于当前 Agent epoch；
- 生命周期状态、事件、evidence 和 outbox 应在同一事务提交。

### 6.3 Instance 状态

实例至少支持 `bound`、`active`、`expired` 和 `terminated`。被终止或 lease 到期的实例不得获得新 Token。

实例终止必须使已签发 Token 在下一次权威在线验证时失效。离线验证无法提供该保证；仅阻止新签发不等价于立即撤销。凭据 generation 与 Token 签发由第 3 部分规定。

## 7. 注册表

### 7.1 注册事务

注册必须：

- 校验调用方在目标 Authority Namespace 下创建 Agent 的权限；
- 分配在该 Namespace 内唯一的本地 Agent ID；
- 创建不可变 Authority Binding；
- 持久化明确、具体的 Blueprint 版本（如使用）；
- 记录注册 evidence；
- 在同一事务提交 Agent 记录、Authority Binding 和 evidence。

### 7.2 唯一性与命名空间完整性

- `namespace + agent_id` 在注册表内必须唯一；
- namespace 不得重分配给不同主体；
- 跨 namespace 查询不得假定裸 `agent_id` 唯一；
- 实现内部若保留类 tenant 的部署分区，不得将其作为互操作 claim 暴露。

### 7.3 管理面

注册、Blueprint、Workload Registration、trust-domain 和 namespace 委托 API 必须经过强认证和细粒度授权，并必须产生安全事件。仅依赖网络位置或共享 internal token 不足以构成高保证管理面。

## 8. 发现

### 8.1 目标

发现必须在不依赖调用方提示的情况下解析受信元数据：

- Authority Namespace → 签发方元数据与注册表端点；
- Agent Identifier → 拥有它的身份权威；
- issuer → 验证密钥（JWKS）与信任包；
- Federation Trust → peer 元数据（见第 5 部分）。

发现只涉及身份与注册。能力、工具和业务资源发现不在范围内。

### 8.2 Discovery Document

Authority Namespace 应在其命名空间下的 well-known HTTPS 位置发布 discovery document，例如 `https://<namespace-host>/.well-known/agent-iam`。该文档必须通过 HTTPS 获取，且至少包含：

```text
discovery_version
namespace                      # canonical Authority Namespace
issuer                         # canonical issuer identifier
registry_endpoint              # optional; registration/management API
jwks_uri                       # verification keys
supported_proof_profiles
supported_artifact_types
conformance_claim_ref          # optional
key_rotation                   # overlap and propagation metadata
```

文档应被签名。签名时，签名密钥必须能够独立于文档本身被解析，且密钥轮换必须至少覆盖最大 artifact 寿命加时钟偏差，以保证既有产物的验证。

### 8.3 解析规则

- 用于解析的 namespace 必须 canonical（第 4.3 节），并必须按精确字符串比较，而不是 URI 规范化；
- 从文档解析出的 issuer 必须已注册，不得仅因其自声明而视为权威；
- 结果必须带最大年龄上限地缓存；过期元数据对新签发必须失败关闭，且不得用于满足撤销；
- 未知或缺失的元数据必须失败关闭。

### 8.4 发现安全

发现获取是面向网络的信任操作，必须：

- 限制为 HTTPS（明确的本地开发例外除外）；
- 执行 host 和 scheme allowlist、DNS/IP 再验证、redirect 限制、响应大小限制、连接和读取超时以及内容类型检查；
- 拒绝 loopback、link-local、云 metadata 地址和未经批准的私网目标，以防 SSRF；
- 对由未知 `kid` 或反复失败触发的刷新限速；
- 限制 stale key 的最长可用时间。

第 5 部分规定 peer 与联邦元数据获取的对应约束。

### 8.5 与标识的绑定

- 发现的 issuer 必须仅映射到部署信任域中的一个 canonical Authority Namespace；
- Agent Identifier 只能通过其 Authority Namespace 解析到拥有它的注册表；
- 如使用 Agent 的网络 URI 表示，必须从 canonical namespace 表示派生，且不得引入新的未注册 scheme。

## 9. 安全考虑

- 注册与 namespace 委托是高价值管理操作，必须强授权（第 7.3 节）。
- 发现引入额外攻击面；第 8.4 节约束为强制要求。
- 生命周期 epoch 单调性与终态撤销（第 6.2 节）是防止凭据和授权重用的必要条件。
- 外部标识（第 4.6 节）不得覆盖本地身份。

## 10. 隐私考虑

- Agent ID 应为不透明且不携带个人数据（第 4.2 节）。
- Discovery document 应只暴露互操作所需的最小元数据，且不应枚举 Agent。
- 命名空间层次可能泄露组织关系；跨域披露应按第 1 部分第 7.2 节最小化。

## 11. 一致性

第 2 部分一致性声明必须说明：

- 支持的 namespace canonical 形式；
- 支持的发现机制及其缓存上限；
- 是否支持签名的 discovery document；
- 注册事务与管理面保证；
- 已知扩展与未满足条款。
