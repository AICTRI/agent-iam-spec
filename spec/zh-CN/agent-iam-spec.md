# Agent 身份与访问管理技术规范草案

版本：0.1.0-draft  
日期：2026-09-22  
状态：项目标准草案，非国际标准、国家标准或行业标准  
规范标识：`agent-iam-spec`  
许可证：CC BY 4.0（规范文本）；Apache-2.0（Schema、代码与一致性工具）  
仓库：<https://github.com/AICTRI/agent-iam-spec>


## 1. 范围

本文件规定自主或半自主软件 Agent 的标识、注册、权威归属、工作负载绑定、登记、认证、授权、委托、撤销、联邦和审计要求。本文件适用于私有云、混合云、多租户平台以及 Agent 调用模型、工具、服务和其他 Agent 的场景。

本文件不规定：

- 大模型、规划器或提示词的实现；
- 人类用户密码、MFA 和浏览器会话的实现；
- 特定厂商的 HSM、KMS、网关或服务网格；
- Agent 能力目录、业务资源和工作流的产品数据模型；
- 全球统一的 Agent ID 注册机构。

## 2. 文件状态与标准化结论

截至 2026-09-22，本草案未发现 ISO/IEC、IETF、W3C 或 OASIS 已发布的、专门定义端到端 Agent IAM 标识、凭据、委托、撤销和联邦互操作协议的单一标准。国际上可用的是通用身份、安全和授权标准的组合；IETF WIMSE 的 AIMS、Workload Identifier、Workload Credentials 和 Workload Proof Token 仍为 Internet-Draft，不是 RFC。

中国已于 2026-05-22 发布 `GB/Z 185-2026《人工智能 智能体互联》` 系列，其中：

- `GB/Z 185.1-2026`：第 1 部分，总体架构；
- `GB/Z 185.2-2026`：第 2 部分，身份码；
- `GB/Z 185.3-2026`：第 3 部分，身份管理。

`GB/Z` 是国家标准化指导性技术文件，不是强制性 `GB`，也不同于推荐性 `GB/T`。因此，“目前完全没有 Agent ID 国家标准化文件”已经不准确；但“目前没有统一的国际 Agent ID 标准”仍然成立。

本草案是厂商中立的 Agent IAM 互操作 Profile。具体参考实现与草案条款的映射、以及进入一致性声明前的差距，记录在 `mappings/` 目录，不属于规范正文。涉及 `GB/Z 185` 的字段级兼容性，应在获得并逐条审阅标准全文后另行形成映射表，不应仅根据标准名称推定一致性。

## 3. 规范性用语

本文件定义中文规范词，其强度对应 BCP 14（RFC 2119 与 RFC 8174）：“必须”和“不得”表示强制要求；“应”“不应”“应该”和“不应该”表示存在有效例外时才可偏离的推荐要求；“可以”和“可选”表示允许选择。只有这些词用作要求谓词时具有规范含义；“要求”作为名词以及“建议”“推荐”“需要”等其他文字不表达 BCP 14 强度。标记为“说明”“示例”或“参考”的内容不具有规范性。

## 4. 术语

### 4.1 Agent Identity

长期、逻辑上的 Agent 主体。它独立于进程、容器、Pod、虚拟机、设备或某次运行实例。

### 4.2 Agent Identifier

由身份权威分配给 Agent Identity 的稳定、不透明标识符。标识符本身不构成认证证明或执行授权。

### 4.3 Agent Instance

Agent Identity 在特定运行环境中的实例化。一个 Agent 可以先后或同时具有多个实例。

### 4.4 Authority Root

本 Profile 中用于确定 Agent 授权上限和治理归属的已验证主体引用。它是人类主体或组织/系统主体，不表示对法律责任归属作出判断。

### 4.5 Authority Binding

Agent Identity 与 Authority Root 之间的一对一、不可变绑定。

### 4.6 Workload Identity

对具体运行实例、设备或部署环境的身份表示。SPIFFE ID、Kubernetes ServiceAccount 身份或经验证的 mTLS 客户端证书可以作为 Workload Identity，但不自动成为逻辑 Agent ID。

### 4.7 Identity Credential

将 Agent Identifier 或 Workload Identity 与密码学密钥绑定的凭据。

### 4.8 Enrollment

依据注册记录、工作负载证明和密钥持有证明，为 Agent Instance 建立可信绑定的过程。

### 4.9 Lifecycle Epoch

随每次安全相关生命周期转换严格递增的整数，用于使旧凭据和授权产物失效。

### 4.10 Subject、Actor、Client 与 Workload

- `subject`：其权限允许某效果发生的主体；
- `actor`：直接发起请求的人、Agent 或工作负载；
- `client`：注册应用或 OAuth client；
- `workload`：证明调用方具体运行实例的身份。

这些角色语义不同，不得压缩为单一的 service account 字段。

### 4.11 Policy Decision

策略决策点对可信 Principal、动作、资源和上下文产生的版本化结果。

### 4.12 Execution Grant

由已验证的 `allow` 决策派生的、短时、受众绑定、资源绑定、任务绑定且可撤销的执行授权。

### 4.13 PEP 与 PDP

- PDP：Policy Decision Point，策略决策点；
- PEP：Policy Enforcement Point，在效果发生前验证并执行决策和约束。

## 5. 体系结构

### 5.1 分层

Agent IAM 应至少分为以下逻辑层：

```text
企业人类 IdP / 组织权威
          |
          v
Agent Identity Provider: Agent 注册、Authority Binding、
          Workload Enrollment、生命周期、PoP 身份凭据、身份联邦
          |
          v
Agent Authorization Plane: Principal 解析、PDP、审批、
          委托、Execution Grant、撤销
          |
          v
PEP:      API Gateway、Tool Gateway、模型入口、业务服务、执行器
```

身份凭据只能证明“谁在调用”以及其当前身份状态，不得被直接解释为“允许执行该动作”。执行授权必须由授权层独立决定。

### 5.2 可信数据来源

下列值必须由可信来源解析，不得接受调用方覆盖：

- `tenant_id`；
- Authority Root；
- Agent class；
- lifecycle state 和 epoch；
- Workload Registration 和 selector；
- policy version；
- revocation state。

请求中携带的同名字段最多用于一致性比较；不一致时必须拒绝。

### 5.3 失败关闭

身份、策略、证明、密钥、生命周期或撤销依赖不可用时，系统必须失败关闭。不得把超时、未知状态、解析失败或 `approval_required` 解释为允许。

## 6. Agent 标识规范

### 6.1 标识层次

本文件区分三种标识：

| 标识 | 作用域 | 示例 | 用途 |
|---|---|---|---|
| 本地 Agent ID | tenant 内 | `agt_01J...` | 数据库主标识、API 路径 |
| 跨域 Agent Principal Key | issuer 范围 | `(iss, sub)` | Token、联邦、审计 |
| Workload ID | trust domain 内 | `spiffe://example.org/ns/a/sa/b` | 运行实例证明 |

### 6.2 本地 Agent ID

本地 Agent ID：

- 必须由身份权威生成；
- 必须在 tenant 内唯一；
- 必须是不透明值，消费者不得解析其中的业务含义；
- 创建后不得修改；
- Agent 被撤销后不得重用；
- 不得包含人名、邮箱、组织名称或其他不必要的个人信息；
- 必须提供至少 128 bit 的标识空间和足够的碰撞安全性；标识暴露会形成枚举风险时，还必须具有足够不可预测性。使用 UUID 时应该选择 RFC 9562 定义的合适版本。

`agt_<opaque-id>` 是本 Profile 的推荐本地表示，不是已注册的国际 URI scheme。

### 6.3 全局唯一性

跨 tenant 或跨组织时，裸 `agent_id` 不具有全局唯一性。跨域主体键必须以 `(issuer, subject)` 二元组确定。issuer 注册时必须形成稳定的 canonical value；Token 验证时必须与该注册值执行精确字符串比较，不得在验证阶段通过 URI 规范化折叠不同 issuer。subject 必须在该 issuer 下唯一且永不重分配。RFC 9493 的 `iss_sub` 可以作为该二元组的结构化表示：

```json
{
  "format": "iss_sub",
  "iss": "https://id.example.com/t/acme",
  "sub": "agt_01JABCDEF..."
}
```

需要 URI 表示时，应使用由部署方控制的 HTTPS 命名空间，例如：

```text
https://id.example.com/t/acme/agents/agt_01JABCDEF...
```

实现不得自创未注册的 URI scheme 并宣称其具有国际互操作性。

### 6.4 与 SPIFFE ID 的关系

SPIFFE ID 标识 trust domain 内的工作负载。逻辑 Agent ID 与 SPIFFE ID 可以建立一对多或多代绑定，但不得默认相等：

```text
Agent Identity 1 --- n Agent Instance 1 --- 1 current Workload Identity
```

只有当部署明确保证 Agent 与 Workload 生命周期完全相同，且不需要独立的 Authority Binding、Agent epoch 或实例历史时，才可以复用同一 URI；该简化不属于本 Profile 的推荐模式。

### 6.5 国家身份码和外部标识

如部署需要兼容 `GB/Z 185.2-2026` 的智能体身份码，应将其保存为带命名空间和签发方的外部标识，不得仅凭外部代码覆盖本地 Agent Identity：

```json
{
  "type": "gbz185_identity_code",
  "issuer": "<verified issuing authority>",
  "value": "<identity code>"
}
```

外部标识建立、变更和解除关联必须产生审计事件，并经过签发方真实性验证。

## 7. 身份对象模型

### 7.1 Agent Identity Record

最小记录应包含：

```text
tenant_id
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

`tenant_id + agent_id` 必须唯一。注册 Agent、创建 Authority Binding 和记录注册 evidence 应在同一事务提交。

### 7.2 Agent Class

本 Profile 定义：

| Class | Authority Root | 约束 |
|---|---|---|
| `twin` | `human_master` | 恰好一个不可变的人类主控 |
| `service` | `organization_root` | 不得伪造或携带 human master |
| `ephemeral` | `human_master` 或由部署 Profile 明确规定 | 必须有短生命周期和显式到期策略 |

部署若不支持 `ephemeral`，必须拒绝而不是降级为 `twin` 或 `service`。

### 7.3 Authority Binding

每个 Agent 必须有且仅有一个 Authority Binding。Authority Root 变更不得原地更新；系统必须撤销旧 Agent ID，并创建新的 Agent Identity。

### 7.4 Agent Blueprint

如使用 Blueprint，它必须版本化并具有 `draft`、`published`、`deprecated` 等可判定状态。注册时必须校验并持久化同一个明确版本，不得校验“最新版本”后保存调用方提供的另一个版本。

### 7.5 Workload Registration

Workload Registration 必须至少包含：

```text
tenant_id
workload_registration_id
platform
selector
trust_domain
allowed_proof_methods
status
```

信任域必须预先关联到同一 tenant。所有存储实现，包括测试或内存实现，都应执行相同的 tenant/trust-domain 约束。

### 7.6 Agent Instance

Agent Instance 必须至少包含：

```text
tenant_id
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

`attestation_ref` 必须能够关联到实际验证结果，不得只在 schema 中声明而不写入。

## 8. 生命周期

### 8.1 Agent 状态机

本 Profile 采用：

```text
registered -> enrolled -> active -> suspended
     |           |          |          |
     +-----------+----------+----------+-> revoked

suspended -> enrolled -> active
revoked   -> no transition
```

实现可以保留内部 `draft` 状态，但不得为其签发可用身份凭据或执行授权。

### 8.2 生命周期不变量

- 每次合法状态转换必须原子地令 `lifecycle_epoch` 严格增加；
- epoch 不得回退或重用；
- `revoked` 必须是终态；
- 只有 `active` 的本地 Agent 可以获得新的身份 Token 或 Execution Grant；无本地 Agent 记录的 Federated/Brokered Principal 必须通过 active Federation Trust、PoP 和第 16 节的权威在线验证后，才可以按策略获得 Execution Grant；
- `suspended` Agent 恢复前必须重新完成所需的 enrollment 或等价再验证；
- 在线验证必须要求 Token epoch 等于当前 Agent epoch；
- 生命周期状态、事件、evidence 和 outbox 应在同一事务提交。

### 8.3 Instance 状态

实例至少支持 `bound`、`active`、`expired` 和 `terminated`。被终止或 lease 到期的实例不得获得新 Token。

实例终止必须使已签发 Token 在下一次权威在线验证时失效。离线验证无法提供该保证；仅阻止新签发不等价于立即撤销。

## 9. Enrollment 与工作负载证明

### 9.1 通用流程

```text
1. 注册 Agent 和不可变 Authority Binding
2. 注册允许的 workload selector 与 trust domain
3. 签发短时、单次使用的 enrollment challenge
4. 验证工作负载证据的密码学真实性
5. 规范化经验证属性并匹配 selector
6. 验证 Agent 对私钥的持有证明
7. 原子创建 credential、instance、状态转换和 evidence
```

### 9.2 Challenge

Enrollment challenge 必须：

- tenant-scoped；
- 具有不可预测 nonce；
- 具有最长有效期，推荐不超过 5 分钟；
- 单次使用并原子消费；
- 绑定 Agent ID、Workload Registration 和预期 audience。

### 9.3 Enrollment JWT 持钥证明

使用项目定义的 Enrollment JWT proof 时，proof 至少必须绑定：

- `iss = agent_id`；
- `sub = agent_id` 或 Profile 规定的 instance subject；
- 预期 `aud`；
- challenge ID；
- nonce；
- `iat` 和 `exp`；
- 单次使用的 `jti`。

Verifier 必须固定允许的算法，拒绝未知 `kid`、重复 claim、超长有效期和重放。

该机制借鉴 RFC 7523 的 JWT assertion 处理，但其 challenge、nonce、claim 和 HTTP 传输绑定属于本 Profile，不声明符合 OAuth `private_key_jwt` 客户端认证。若实现声明 RFC 7523 互操作，还必须实现该 RFC 规定的 `client_assertion_type`、`client_assertion`、client identifier、endpoint 和错误响应。

### 9.4 Attestation 三阶段

系统必须区分：

1. 证据密码学验证：证书链、JWT 签名、issuer、audience、有效期；
2. 属性规范化：仅从已验证证据派生 namespace、ServiceAccount、SPIFFE ID、证书摘要等属性；
3. Selector 授权：将派生属性与预注册 selector 精确匹配。

不得把调用方提交的 PEM、JWT 或属性 JSON 直接视为“已验证证明”。未知证明方法必须失败关闭。

### 9.5 支持的证明 Profile

- SPIFFE：应校验 X.509-SVID/JWT-SVID、trust domain 和唯一 SPIFFE URI；
- Kubernetes：必须校验 projected ServiceAccount token 的签名、issuer、audience、时间和 subject；
- mTLS：必须校验证书链、有效期、ClientAuth EKU 和预期信任锚；
- RATS/EAT：使用时应遵循 RFC 9334 和 RFC 9711，并区分 Evidence 与 Attestation Result。

## 10. 身份凭据与 Token

### 10.1 PoP 要求

生产凭据应该使用 proof-of-possession。本地 Agent 身份 Token 必须包含：

```text
iss, sub, aud, iat, exp, jti
tenant_id or a canonical tenant-scoped iss
agent_class
instance_id
workload_id
authority_root_ref
lifecycle_epoch
cnf.jkt or equivalent confirmation
```

若 tenant 从 `iss` 派生，映射必须唯一且规范化；Token 中同时存在 `tenant_id` 时两者必须一致。Federated/Brokered Token 必须使用独立的 `typ`，并携带不可歧义的 external issuer、external subject 和 federation trust/version reference；它不得伪造本地 `agent_class`、`instance_id`、`workload_id`、`authority_root_ref` 或 lifecycle epoch。

身份 Token、Enrollment proof、Token 请求 proof、Policy Decision 和 Execution Grant 必须使用不同且固定的 `typ` 或等价 artifact type。Verifier 必须按 endpoint 固定允许的类型，防止 Token substitution。

静态 API key 和长期 bearer secret 不得作为 Agent 的主身份凭据。

### 10.2 Token 请求证明

Token 请求 proof 必须绑定 Agent、Instance、Token endpoint audience、请求的目标 Token audience、时间和单次使用 JTI。也可以绑定包含目标 audience 的规范化 Token 请求摘要。JTI 必须在 tenant 内原子消费。实现必须规定 proof 最大寿命，不得只检查 `exp > now`。

### 10.3 签发条件

签发方必须检查：

- Agent 为 `active`；
- Instance 属于相同 tenant 和 Agent；
- Instance 状态允许签发且 lease 未到期；
- proof key 对应 active credential；
- audience 已注册并精确匹配；
- Workload 和 attestation 要求仍满足策略。

### 10.4 在线与离线验证

离线验证可以检查签名、issuer、audience、时间、格式和已验证的 PoP 上下文，但不得声称具有实时撤销能力。提交公钥、JWK 或 thumbprint 本身不构成持钥证明。

资源请求的 PoP 必须由 PEP 通过 DPoP、HTTP Message Signatures、mTLS 或等价 Profile 验证，再将验证后的 key binding 传给 Token verifier。采用 RFC 7662 introspection 模式时，introspection endpoint 必须只接受经过认证和授权的资源服务器调用，并返回 `cnf`；实际资源请求的 PoP 仍由资源服务器验证。每个采用的 PoP Profile 必须定义请求绑定、Token 绑定、重放缓存作用域、最大时间偏差和错误处理。

权威在线验证必须额外检查：

- Agent 当前状态和 epoch；
- Instance 状态和 lease；
- credential 状态；
- tenant-scoped revocation selectors。

Introspection 对外应以统一的 inactive 结果隐藏具体失败原因，同时在受控 evidence 中记录分类原因。

### 10.5 Credential 生命周期

Credential 必须绑定 Agent、Instance 和明确的 enrollment generation。重新 enrollment 必须建立新 generation，并使旧 generation 不得用于新签发。实现如允许旧 Token 在到期前继续验证，必须在一致性声明中说明；声明即时实例撤销时，旧 Token 必须在下一次在线验证时 inactive。

### 10.6 密钥轮换

签发密钥轮换时，旧公钥的验证重叠窗口必须至少覆盖：

```text
最大 Token 寿命 + 允许的 clock skew + 发布传播延迟
```

高保证部署应将私钥保存在 HSM、KMS、TPM 或等价隔离环境中，并对身份 Token、Policy Decision、Execution Grant、Approval、Attestation 和 Workload Assertion 使用相互独立的签名域。

## 11. Principal 与授权模式

### 11.1 Principal 解析

授权系统必须从已验证的企业 IdP、Agent Identity Authority 记录、Workload Assertion 和授权上下文重建 Principal。客户端自报 Principal 只能作 comparison-only 输入。

### 11.2 授权模式

| Mode | 权威来源 | 必需证明 |
|---|---|---|
| `human_web` | 人类 subject | OIDC 授权码流程及适当 assurance |
| `system_api` | 组织/系统根 | client + workload proof |
| `delegated_api` | 人类 subject，服务为 actor | 用户委托 + client/workload proof |
| `service_agent_api` | 组织/系统根，Service Agent 为 actor | Agent identity + workload + epoch |
| `twin_agent_api` | human master，Twin Agent 为 actor | immutable master binding + workload + epoch |

不同模式不得互相替代。Workload Token 不得冒充人类；Service Agent 不得声明 human master；Twin Agent 不得满足 system-only endpoint。

### 11.3 有效权限

有效权限必须是所有适用上限的交集：

```text
twin = master authority
       intersection agent envelope
       intersection workload grant
       intersection tool permission
       intersection requested authority
       intersection policy

service = organization authority
          intersection agent envelope
          intersection workload grant
          intersection requested authority
          intersection policy
```

缺失任何必需输入时必须拒绝。

## 12. Policy Decision 与 Execution Grant

### 12.1 唯一授权谱系

授权必须具有单一、可验证的谱系：

```text
verified principal
  -> canonical policy decision
  -> verified allow decision
  -> execution grant
  -> attenuated child grant
  -> PEP verification and effect
```

原始 bearer Token 只能建立身份上下文，不得单独作为 mint Execution Grant 的授权依据。

资源和安全关键引用的 digest 必须固定规范化算法、字符编码、hash 算法、域分离标签和 Profile 版本。本 Profile 的基础结构为：

```text
SHA-256("agent-iam:<object-type>:<profile-version>\x00" || canonical_bytes)
```

每类 resource、subject、reason 和 implementation 必须定义 `canonical_bytes`；JSON 类型默认必须使用 RFC 8785 JCS 的 UTF-8 输出。不得根据未规范化 JSON、自然语言或平台相关路径直接计算安全 digest。

### 12.2 Decision

Decision 至少必须绑定：

- tenant 和 authorization mode；
- subject、actor、client、workload 和 authority root 中适用的字段；
- action 和不可变 resource identity/digest；
- normalized scope；
- audience；
- policy ID/version；
- lifecycle epoch；
- decision ID、issued-at 和 expiry；
- outcome 和 obligations。

只有 `allow` 可以派生 Execution Grant。`deny`、`approval_required`、`revoked` 和未知结果都必须阻断执行。

### 12.3 Grant

Execution Grant 应为短时、audience-bound 和 sender-constrained，并至少绑定 action、resource、scope、task、policy version、lifecycle epoch 和 parent lineage。PEP 必须在每个受保护效果前验证 Grant，而不是只在连接建立时验证。

## 13. 委托与 Token Exchange

### 13.1 不可放大

任何子授权必须满足：

```text
child.scope       subset-of parent.scope
child.audience    subset-of parent.audience
child.expires_at  <= parent.expires_at
child.task        equal-to-or-narrower-than parent.task
child.action      equal-to-or-narrower-than parent.action
child.resource    equal-to-or-narrower-than parent.resource
```

tenant、Authority Root 和不可变主体绑定不得在委托中改变。

衰减关系必须可判定且版本化：audience 必须规范化为精确字符串集合并执行集合子集；action 默认必须相等，除非 Profile 定义显式偏序；resource 必须使用类型化 canonical descriptor 和该类型的 containment function；task 必须使用不透明 `task_id` 或结构化约束，不得根据自然语言判断“更窄”。Decision 和 Grant 必须标识使用的 attenuation Profile 版本。

### 13.2 OAuth Token Exchange

使用 RFC 8693 时必须区分：

- 身份保持型 Token 派生；
- impersonation；
- delegation；
- Execution Grant 派生。

仅保持 identity、audience、expiry 和 PoP 的 exchange 不得被描述为完整授权委托。多级委托必须保留 actor/parent lineage，并由资源服务器执行权限衰减检查。

### 13.3 Approval 与 Pre-Authorization

Approval 必须绑定 tenant、approver、agent/actor、action、resource、scope、audience、reason digest、expiry 和 policy version。

Pre-Authorization 只能为已有权限提供限时、限额的使用窗口，不得提升权限。`max_grants`、`used_grants` 等配额更新必须原子且单调。

## 14. PEP 和工具调用

PEP 必须：

- 只接受适用于 endpoint 的 authorization mode 和 artifact type；
- 验证 signature、issuer、audience、expiry、tenant、PoP、resource digest、epoch 和 revocation；
- 执行全部 obligations 后才允许效果；
- 在长任务的 continuation boundary 重新检查授权和撤销；
- 对动作、目标主机、路径、工具 ID、skill hash 和实现摘要执行精确匹配；
- 不得把 Catalog 可见性、模型选择结果或自然语言计划当作授权。

凭证注入必须是显式 obligation，并绑定 `credential_ref` 或 class、目标、scope 和 expiry。凭证值本身不得进入 Decision、Grant、提示词或 evidence。LLM 不得访问 Agent 主身份私钥或下游服务凭证。

## 15. 撤销

### 15.1 Selector

撤销可以按 tenant-scoped selector 执行，包括：

- Agent、Instance、credential 或 lifecycle epoch；
- subject、session 或 authority root；
- Decision JTI、Grant JTI、Approval JTI；
- policy version；
- resource/implementation digest；
- Workload Binding 或 attestation reference。

敏感 selector 应使用带域分离的摘要持久化。

### 15.2 新鲜度等级

| Class | 要求 |
|---|---|
| `pre_dispatch` | 效果前权威检查，不得使用 negative cache |
| `continuation` | 长任务每个外部效果边界检查，不得使用 negative cache |
| `connection` | 可使用有界 negative cache，不得超过 artifact 剩余寿命 |

撤销依赖不可用时必须拒绝。离线或降级模式不得用于 credential injection、权限扩大、新目标或高风险破坏性动作。

## 16. 联邦

### 16.1 Federation Trust

Federation Trust 必须 tenant-scoped，并至少规定：

- peer issuer；
- JWKS URI 或 trust bundle；
- allowed audiences；
- claim mapping；
- PoP 要求；
- trust status；
- key refresh 和失败关闭策略。

Peer claim 不得指定或覆盖本地 tenant。

联邦 metadata/JWKS 获取必须限制为 HTTPS（明确的本地开发例外除外），并执行 host/scheme allowlist、DNS/IP 再验证、redirect 限制、响应大小限制、连接和读取超时、内容类型检查以及未知 `kid` 刷新限速。必须拒绝 loopback、link-local、云 metadata 地址和未经批准的私网目标，以防 SSRF；stale key 的最长可用时间必须有上限。

### 16.2 主体隔离

Federated Principal 不得自动合并为本地 Agent Identity。Brokered Principal 必须使用不会与本地 Agent ID 冲突的命名空间，并明确其没有本地 Agent epoch 时的撤销语义。

### 16.3 联邦验证

联邦验证必须同时检查 trust status、signature、known `kid`、issuer、audience、time、PoP 和 claim mapping。禁用 trust 后，下一次权威在线验证必须失败关闭。Brokered Token 的在线验证必须根据其 trust/version reference 重新检查对应 Federation Trust；仅等待本地 Token 到期不满足此要求。

## 17. 审计与安全事件记录

本节的安全事件记录用于审计，不同于 RFC 9334 中作为远程证明输入的 Attestation Evidence。字段名 `evidence_ref` 必须标识其引用的是证明证据、证明结果还是安全事件记录。

### 17.1 最小事件

下列操作必须产生安全 evidence：

- Agent 注册和 Authority Binding；
- Enrollment 成功和失败；
- Credential 签发、轮换、supersede 和撤销；
- 生命周期和实例状态转换；
- 身份 Token 签发、exchange 和 introspection；
- Policy Decision、Approval、Grant 和 PEP 结果；
- Federation Trust 变更和联邦验证；
- 撤销和关键运维操作。

### 17.2 最小字段

安全事件记录必须至少包含：

```text
event_id, event_type, timestamp
tenant_id
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

### 17.3 数据最小化

Evidence 和 outbox 不得保存：

- private key；
- 完整 bearer Token、PoP proof 或下游 credential；
- 未经限制的提示词、工具参数或业务 payload；
- 可由引用或摘要满足审计目的的敏感原文。

敏感 subject、resource 和 reason 应使用域分离摘要。拒绝事件应在限速、脱敏后持久化，不得只存在于进程内计数器。

### 17.4 一致性

权威状态变化、evidence 和 outbox 应在同一事务提交。Outbox 必须定义至少一次投递、幂等消费者、重试、DLQ 和 redrive 语义。

## 18. 安全要求

### 18.1 重放

Challenge、Token proof 和高价值请求必须使用短时 nonce/JTI，并在适当作用域内原子消费。DPoP 必须按 RFC 9449 验证 `htm`、`htu`、`iat`、`jti`，适用时验证 `ath` 和 server nonce。HTTP Message Signatures Profile 必须规定 covered components；有消息内容时应该覆盖 `content-digest`，并根据路由模型覆盖 `@method`、`@authority` 以及 `@target-uri` 或等价组件。

### 18.2 Confused Deputy

身份 Token 必须精确绑定 audience；授权 Token 和 Execution Grant 必须进一步精确绑定 action、resource 和 task。不得使用 wildcard、prefix 或大小写不敏感方式匹配安全关键 audience。

### 18.3 Prompt Injection

自然语言、模型输出和工具返回值均为不可信输入。它们不得：

- 选择 tenant 或 Authority Root；
- 修改 Agent class、epoch 或 policy version；
- 读取主身份密钥或服务凭证；
- 绕过 PEP；
- 扩大 parent grant。

### 18.4 Claim 和解析安全

Verifier 必须在语义处理前拒绝重复 JSON member、未知关键 claim、算法降级、未知 `kid`、超限 artifact 和不规范资源表示。结构化资源必须采用第 12.1 节规定的确定性规范化和 digest。

### 18.5 管理面

Agent、Blueprint、Workload Registration、Trust Domain、Federation Trust、密钥轮换和 DLQ redrive 等管理 API 必须经过强认证和细粒度授权。仅依赖网络位置或共享 internal token 不足以构成高保证管理面。

## 19. 隐私要求

- Agent ID 应为不透明 pseudonymous identifier；
- 跨 trust domain 不应无必要复用稳定关联标识；
- Twin 的 `master_id` 只应向确有授权需要的组件披露；
- 外部展示和审计导出应优先使用受控 reference 或 digest；
- 数据保留期限应按事件类型、监管目的和最小化原则设定；
- 联邦 claim mapping 应执行白名单，不得透传全部上游 claim。

## 20. 一致性等级

### 20.1 Level 1：Agent Identity

必须实现：

- tenant-scoped Agent ID；
- immutable Authority Binding；
- Agent/Instance 分离；
- 生命周期和单调 epoch；
- Enrollment challenge 和 PoP；
- 短时身份 Token；
- 在线 Agent、Instance、credential generation 状态验证；
- 基础 evidence。

### 20.2 Level 2：Agent Authorization

在 Level 1 基础上必须实现：

- subject/actor/client/workload 分离；
- authorization modes；
- versioned PDP Decision；
- audience/resource/task-bound Execution Grant；
- PEP 和 tenant-scoped revocation；
- 权限不可放大。

### 20.3 Level 3：Federated Agent IAM

在 Level 2 基础上必须实现：

- tenant-scoped Federation Trust；
- PoP federated verification；
- local/federated principal 隔离；
- trust disable 的在线撤销；
- 跨域 evidence correlation；
- 完整密钥轮换和生产级托管。

一致性声明必须列出支持的 Level、proof Profile、Token/Profile 版本、撤销 SLO 和已知扩展，不得仅声称“兼容 Agent IAM”。

## 21. 国际和国家标准采用建议

| 领域 | 已发布、可规范引用 | Agent 专项工作进展 |
|---|---|---|
| 标识 | RFC 3986、RFC 9562、RFC 9493、W3C DID Core | GB/Z 185.2-2026；IETF WIMSE Identifier 草案 |
| 身份管理 | ISO/IEC 24760 系列、SCIM RFC 7643/7644 | GB/Z 185.3-2026；SCIM Agent schema 个人草案已过期 |
| 凭据 | RFC 5280、RFC 7519、W3C VC 2.0 | SPIFFE SVID；WIMSE Credentials 草案 |
| PoP/请求认证 | RFC 8705、RFC 9449、RFC 9421、TLS 1.3 | WIMSE WPT、mTLS、HTTP Signature 草案 |
| 授权/委托 | RFC 8693、RFC 9396、RFC 9635、OASIS XACML 3.0 | IETF AIMS WG 草案；AAuth 仍非正式标准 |
| 证明 | RFC 9334、RFC 9711 | Agent/workload attestation 草案 |
| 联邦 | OIDC Core、SAML 2.0、RFC 8693 | SPIFFE Federation、Agent cross-domain 草案 |
| 审计 | RFC 5424、RFC 8417、RFC 9493 | Agent audit record 个人草案 |
| 治理 | ISO/IEC 42001、ISO/IEC 23894、NIST AI RMF | 不定义 Agent ID 或线协议 |

工程上应优先组合已发布标准；使用 Internet-Draft 时必须固定版本、隔离实验扩展，并声明可能不兼容后续版本。

## 22. 主要已发布参考文献

- RFC 2119, Key words for use in RFCs to Indicate Requirement Levels.
- RFC 3986, Uniform Resource Identifier (URI): Generic Syntax.
- RFC 5280, Internet X.509 Public Key Infrastructure Certificate and CRL Profile.
- RFC 7519, JSON Web Token (JWT).
- RFC 7523, JSON Web Token (JWT) Profile for OAuth 2.0 Client Authentication and Authorization Grants.
- RFC 7638, JSON Web Key (JWK) Thumbprint.
- RFC 7662, OAuth 2.0 Token Introspection.
- RFC 8174, Ambiguity of Uppercase vs Lowercase in RFC 2119 Key Words.
- RFC 8446, The Transport Layer Security (TLS) Protocol Version 1.3.
- RFC 8693, OAuth 2.0 Token Exchange.
- RFC 8705, OAuth 2.0 Mutual-TLS Client Authentication and Certificate-Bound Access Tokens.
- RFC 8785, JSON Canonicalization Scheme (JCS).
- RFC 9334, Remote ATtestation procedureS (RATS) Architecture.
- RFC 9396, OAuth 2.0 Rich Authorization Requests.
- RFC 9421, HTTP Message Signatures.
- RFC 9449, OAuth 2.0 Demonstrating Proof of Possession (DPoP).
- RFC 9493, Subject Identifiers for Security Event Tokens.
- RFC 9562, Universally Unique IDentifiers (UUIDs).
- RFC 9635, Grant Negotiation and Authorization Protocol (GNAP).
- RFC 9700, Best Current Practice for OAuth 2.0 Security.
- RFC 9711, The Entity Attestation Token (EAT).
- ISO/IEC 24760-1:2019, A framework for identity management -- Terminology and concepts.
- ISO/IEC 29115:2013, Entity authentication assurance framework.
- OASIS XACML Version 3.0.
- W3C DID Core 1.0.
- W3C Verifiable Credentials Data Model 2.0.
- GB/Z 185.1-2026, 人工智能 智能体互联 第1部分：总体架构。
- GB/Z 185.2-2026, 人工智能 智能体互联 第2部分：身份码。
- GB/Z 185.3-2026, 人工智能 智能体互联 第3部分：身份管理。

## 23. 参考性资料和进行中工作

以下为本文件直接涉及的非穷举列表，不得作为已发布标准引用：

- `draft-ietf-wimse-aims-00`, AI Identity Management System，IETF WIMSE WG Internet-Draft；
- `draft-ietf-wimse-arch-08`, WIMSE Architecture，WG Internet-Draft；
- `draft-ietf-wimse-identifier-03`, Workload Identifier，WG Internet-Draft；
- `draft-ietf-wimse-workload-creds-02`, WIMSE Workload Credentials，WG Internet-Draft；
- `draft-ietf-wimse-wpt-02`, WIMSE Workload Proof Token，WG Internet-Draft；
- `draft-ietf-wimse-mutual-tls-02`, Workload Authentication Using Mutual TLS，WG Internet-Draft；
- `draft-ietf-wimse-http-signature-07`, WIMSE Workload-to-Workload Authentication with HTTP Signatures，WG Internet-Draft；
- `draft-ietf-wimse-workload-identity-practices-06`, Workload Identity Practices，已提交 IESG、仍非 RFC；
- `draft-narajala-courtney-ansv2-01`, Agent Name Service v2，个人 Internet-Draft；
- `draft-hardt-oauth-aauth-protocol-10`, AAuth Protocol，个人 Internet-Draft；
- `draft-sharif-agent-identity-framework-01`, Agent Identity Framework，个人 Internet-Draft；
- `draft-wahl-scim-agent-schema-01`, SCIM Agentic Identity Schema，已归档的个人 Internet-Draft。

状态核验入口：

- IETF WIMSE：<https://datatracker.ietf.org/wg/wimse/documents/>
- AIMS：<https://datatracker.ietf.org/doc/draft-ietf-wimse-aims/>
- 国家标准信息公共服务平台：<https://std.samr.gov.cn/>
- GB/Z 185.1-2026：<https://openstd.samr.gov.cn/bzgk/gb/newGbInfo?hcno=CFF03D872963466AC7F03ED0E28B6702>
- GB/Z 185.2-2026：<https://openstd.samr.gov.cn/bzgk/gb/newGbInfo?hcno=11B33B7532093ED660305B2BF4940A12>
- GB/Z 185.3-2026：<https://openstd.samr.gov.cn/bzgk/gb/newGbInfo?hcno=BFCCE65447B30927953D90059AB89E23>

## 24. 待讨论事项

1. `ephemeral` Agent 的 Authority Root 是否必须限定为 human master，还是允许组织根下的短期实例；
2. 是否为逻辑 Agent Principal 固定 HTTPS URI Profile，或等待 WIMSE Identifier 成熟；
3. `GB/Z 185.2-2026` 身份码与本 Profile `(issuer, subject)` 的双向映射规则；
4. 默认 Token、Decision、Grant 和 Attestation 最大 TTL；
5. 跨组织委托链的最大深度、循环检测和隐私披露规则；
6. 安全事件 envelope 是否采用 SET、OTel semantic conventions 或独立 JSON Schema；
7. 一致性测试向量和互操作测试事件的发布位置。
