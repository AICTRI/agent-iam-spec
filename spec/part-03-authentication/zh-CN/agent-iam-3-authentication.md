[English](../en/agent-iam-3-authentication.md) · [简体中文](agent-iam-3-authentication.md)

# 智能体身份与访问管理系列 — 第 3 部分：智能体身份与认证

- 系列标识：`agent-iam-series`
- 部分标识：`agent-iam-3-authentication`
- 版本：`0.1.0-draft`
- 日期：2026-09-22
- 状态：项目标准草案，非国际标准、国家标准或行业标准
- 许可证：CC BY 4.0（规范文本）

本部分规定如何将 Agent Instance 认证为特定 Agent Identity，以及认证产物如何签发、验证和撤销。它消费第 2 部分定义的记录，并向第 4 部分输出 `Verified Agent Identity Context`。

本中文文本是英文文本的等价翻译，供对照参考。两种语言文本冲突时，以英文文本为准。

## 1. 范围

本部分规定：

- 认证输出：`Verified Agent Identity Context`；
- Enrollment 与工作负载证明；
- 持钥证明与身份 Token，包括 Token 请求证明和签发条件；
- 在线与离线验证；
- 授权模式的证明要求；
- 凭据生命周期与密钥轮换；
- 认证范围的撤销；
- 认证安全。

授权决策、授权和执行授权由第 4 部分规定。跨域联邦由第 5 部分规定。

## 2. 规范性引用

- 第 1 部分定义术语、可信数据来源、失败关闭、canonical 化和撤销 freshness 词表。
- 第 2 部分定义 Agent Identity Record、Agent Instance、Workload Registration、生命周期状态与 epoch，以及发现。
- 第 4 部分消费本部分定义的认证输出。
- 第 6 部分定义安全事件 envelope。

## 3. 认证输出

认证必须产出至少包含以下字段的 `Verified Agent Identity Context`：

```text
namespace
agent_id
agent_class
instance_id
workload_id
authority_root_ref
lifecycle_epoch
attestation_status
credential_status
revocation_status
```

该上下文必须完全来自已验证证据和权威记录。第 4 部分必须消费该上下文，不得从调用方自报值重新推导其字段。

## 4. Enrollment 与工作负载证明

### 4.1 通用流程

```text
1. 注册 Agent 和不可变 Authority Binding
2. 注册允许的 workload selector 与 trust domain
3. 签发短时、单次使用的 enrollment challenge
4. 验证工作负载证据的密码学真实性
5. 规范化经验证属性并匹配 selector
6. 验证 Agent 对私钥的持有证明
7. 原子创建 credential、instance、状态转换和 evidence
```

步骤 1 和 2 由第 2 部分（注册）规定。

### 4.2 Challenge

Enrollment challenge 必须：

- namespace-scoped；
- 具有不可预测 nonce；
- 具有最长有效期，推荐不超过 5 分钟；
- 单次使用并原子消费；
- 绑定 Agent ID、Workload Registration 和预期 audience。

### 4.3 Enrollment JWT 持钥证明

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

### 4.4 Attestation 三阶段

系统必须区分：

1. 证据密码学验证：证书链、JWT 签名、issuer、audience、有效期；
2. 属性规范化：仅从已验证证据派生 namespace、ServiceAccount、SPIFFE ID、证书摘要等属性；
3. Selector 授权：将派生属性与预注册 selector 精确匹配。

不得把调用方提交的 PEM、JWT 或属性 JSON 直接视为“已验证证明”。未知证明方法必须失败关闭。

### 4.5 支持的证明 Profile

- SPIFFE：应校验 X.509-SVID/JWT-SVID、trust domain 和唯一 SPIFFE URI；
- Kubernetes：必须校验 projected ServiceAccount token 的签名、issuer、audience、时间和 subject；
- mTLS：必须校验证书链、有效期、ClientAuth EKU 和预期信任锚；
- RATS/EAT：使用时应遵循 RFC 9334 和 RFC 9711，并区分 Evidence 与 Attestation Result。

## 5. 持钥证明与身份 Token

### 5.1 PoP 要求

生产凭据应该使用 proof-of-possession。本地 Agent 身份 Token 必须包含：

```text
iss, sub, aud, iat, exp, jti
namespace (canonical) and/or a namespace-scoped iss
agent_class
instance_id
workload_id
authority_root_ref
lifecycle_epoch
cnf.jkt or equivalent confirmation
```

若 namespace 从 `iss` 派生，映射必须唯一且规范化。Federated/Brokered Token 必须使用独立的 `typ`，并携带不可歧义的 external issuer、external subject 和 federation trust/version reference；它不得伪造本地 `agent_class`、`instance_id`、`workload_id`、`authority_root_ref` 或 lifecycle epoch。

身份 Token、Enrollment proof、Token 请求 proof、Policy Decision 和 Execution Grant 必须使用不同且固定的 `typ` 或等价 artifact type。Verifier 必须按 endpoint 固定允许的类型，防止 Token substitution。

静态 API key 和长期 bearer secret 不得作为 Agent 的主身份凭据。

### 5.2 Token 请求证明

Token 请求 proof 必须绑定 Agent、Instance、Token endpoint audience、请求的目标 Token audience、时间和单次使用 JTI。也可以绑定包含目标 audience 的规范化 Token 请求摘要。JTI 必须在 namespace 内原子消费。实现必须规定 proof 最大寿命，不得只检查 `exp > now`。

### 5.3 签发条件

签发方必须检查：

- Agent 为 `active`；
- Instance 属于相同 namespace 和 Agent；
- Instance 状态允许签发且 lease 未到期；
- proof key 对应 active credential；
- audience 已注册并精确匹配；
- Workload 和 attestation 要求仍满足策略。

### 5.4 在线与离线验证

离线验证可以检查签名、issuer、audience、时间、格式和已验证的 PoP 上下文，但不得声称具有实时撤销能力。提交公钥、JWK 或 thumbprint 本身不构成持钥证明。

资源请求的 PoP 必须由 PEP 通过 DPoP、HTTP Message Signatures、mTLS 或等价 Profile 验证，再将验证后的 key binding 传给 Token verifier。采用 RFC 7662 introspection 模式时，introspection endpoint 必须只接受经过认证和授权的资源服务器调用，并返回 `cnf`；实际资源请求的 PoP 仍由资源服务器验证。每个采用的 PoP Profile 必须定义请求绑定、Token 绑定、重放缓存作用域、最大时间偏差和错误处理。

权威在线验证必须额外检查：

- Agent 当前状态和 epoch；
- Instance 状态和 lease；
- credential 状态；
- namespace-scoped revocation selectors。

Introspection 对外应以统一的 inactive 结果隐藏具体失败原因，同时在受控 evidence 中记录分类原因。

### 5.5 Credential 生命周期

Credential 必须绑定 Agent、Instance 和明确的 enrollment generation。重新 enrollment 必须建立新 generation，并使旧 generation 不得用于新签发。实现如允许旧 Token 在到期前继续验证，必须在一致性声明中说明；声明即时实例撤销时，旧 Token 必须在下一次在线验证时 inactive。

### 5.6 密钥轮换

签发密钥轮换时，旧公钥的验证重叠窗口必须至少覆盖：

```text
最大 Token 寿命 + 允许的 clock skew + 发布传播延迟
```

高保证部署应将私钥保存在 HSM、KMS、TPM 或等价隔离环境中，并对身份 Token、Policy Decision、Execution Grant、Approval、Attestation 和 Workload Assertion 使用相互独立的签名域。

## 6. 授权模式的证明要求

第 4 部分定义的每个授权模式需要特定证明。证明要求为：

| Mode | 必需证明 |
|---|---|
| `human_web` | OIDC 授权码流程及适当 assurance |
| `system_api` | client + workload proof |
| `delegated_api` | 用户委托 + client/workload proof |
| `service_agent_api` | Agent identity + workload + epoch |
| `twin_agent_api` | immutable master binding + workload + epoch |

各模式的权威来源，以及模式不得互相替代的规则，由第 4 部分规定。

## 7. 撤销（认证范围）

### 7.1 Selector

撤销可以按 namespace-scoped selector 执行，包括：

- Agent、Instance、credential 或 lifecycle epoch；
- Workload Binding 或 attestation reference。

敏感 selector 应使用带域分离的摘要持久化。

### 7.2 Freshness

撤销检查必须使用第 1 部分第 6.3 节定义的 freshness 等级。撤销依赖不可用时必须拒绝。

## 8. 安全考虑

### 8.1 重放

Challenge、Token proof 和高价值请求必须使用短时 nonce/JTI，并在适当作用域内原子消费。DPoP 必须按 RFC 9449 验证 `htm`、`htu`、`iat`、`jti`，适用时验证 `ath` 和 server nonce。HTTP Message Signatures Profile 必须规定 covered components；有消息内容时应该覆盖 `content-digest`，并根据路由模型覆盖 `@method`、`@authority` 以及 `@target-uri` 或等价组件。

### 8.2 Claim 和解析安全

Verifier 必须在语义处理前拒绝重复 JSON member、未知关键 claim、算法降级、未知 `kid`、超限 artifact 和不规范资源表示。结构化资源必须采用第 1 部分第 6.2 节规定的确定性规范化和 digest。

### 8.3 Token substitution

必须按 endpoint 固定 artifact 类型（第 5.1 节）。在需要某一类型时，Verifier 不得接受另一类型的产物。

## 附录 A. 迁移来源（参考）

| 现条款 | 映射到本部分 |
|---|---|
| §9 Enrollment 与证明 | 第 4 节 |
| §10 身份凭据与 Token | 第 3、5 节 |
| §11.2 授权模式“必需证明”列 | 第 6 节 |
| §15（agent/instance/credential/epoch selector） | 第 7 节 |
| §18.1 重放、§18.4 Claim 解析 | 第 8 节 |
