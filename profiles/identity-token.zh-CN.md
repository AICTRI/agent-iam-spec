# Profile：身份 Token

- Profile 标识：`agent-iam-profile-identity-token`
- 适用：第 3 部分 `agent-iam-3-authentication`
- 系列版本：`0.4.1-draft`
- 状态：草案（发布后具规范性）
- 语言：英文为规范性主文本；本文件为等价翻译。

本 Profile 收窄第 3 部分第 5、7 节，不得放宽第 3 部分任何 `MUST`/`MUST NOT`。如冲突，以第 3 部分为准。

## 1. 范围

定义 **Agent 身份 Token** 的可互操作结构、`typ`、签发条件、验证与撤销新鲜度。身份 Token 用于资源服务器判定"谁在调用、当前身份状态"，不承载授权；授权见第 4 部分。

## 2. Token 类型

本地 Token 的 `typ` MUST 为 `agent-iam-identity+jwt`；联邦/中转 Token MUST 为 `agent-iam-brokered-identity+jwt`。实现 MUST 按端点固定期望的 `typ`（第 3 部分 §8.3），且不得在需要 enrollment proof、token-request proof、policy decision 或 execution grant 的位置接受身份 Token。

签名算法 MUST 固定。本 Profile 默认 `EdDSA`（Ed25519），`kid` 通过签发方 JWKS 解析。

## 3. 必需 claim

本地身份 Token MUST 包含：

| Claim | 要求 |
|---|---|
| `iss` | 规范签发方 URI；若 namespace 由 `iss` 推导，映射 MUST 唯一且规范。 |
| `sub` | Agent ID，或本 Profile 明确定义的 instance subject。 |
| `aud` | 恰好一个已注册受众，按规范化精确字符串比较。 |
| `iat`、`exp` | `exp - iat` 不得超过部署最大 Token 寿命；建议不超过 10 分钟。 |
| `jti` | 每个 Token 唯一，用于重放与撤销关联。 |
| `namespace` | 规范 Authority Namespace（第 1 部分 §6.2）。 |
| `agentClass` | 第 2 部分九类词表之一。 |
| `instanceId` | Agent Instance。 |
| `workloadId` | Workload Registration。 |
| `authorityRootRef` | 不可变 Authority Root 引用。 |
| `agentEpoch` | Agent 业务生命周期 epoch。 |
| `identityEpoch` | Agent ID 安全生命周期 epoch。 |
| `cnf` | `cnf.jkt`（RFC 7638 SHA-256 thumbprint）或等价确认方式。 |
| `credentialGeneration` | 签发该凭据的 enrollment generation。 |

中转 Token MUST 额外携带明确的外部 `iss`、`sub` 与 federation trust/version 引用，且 MUST NOT 伪造 `agentClass`、`instanceId`、`workloadId`、`authorityRootRef` 或任一 epoch（第 5 部分 §5）。

`tenant` MUST NOT 作为必需 claim（RFC-0003）。

## 4. 签发条件

除第 3 部分 §5.3 外，签发方 MUST：

1. 当 `agentEpoch` 或 `identityEpoch` 相对注册权威状态过期时拒绝签发；
2. 当凭据 generation 非活动 generation 时拒绝签发；
3. 当请求的 `aud` 未为该 Agent 或 Instance 注册时拒绝签发；
4. 在同一命名空间内原子提交 token-request proof 的 JTI 消费与签发决定。

## 5. 验证

### 5.1 离线

离线验证 MAY 校验签名、固定的 `typ`、`iss`、规范化 `aud`、时钟偏差内的 `iat`/`exp`、格式与已验证 PoP 上下文。MUST NOT 声称具备实时撤销能力，且 MUST NOT 把出示的 JWK 或 thumbprint 视为持钥证明。

### 5.2 在线（权威）

权威验证 MUST 校验当前 Agent 状态与双 epoch、Instance 状态与 lease、凭据状态与 generation，以及命名空间范围内的撤销 selector。采用 introspection 时，MUST 仅接受已认证且已授权的资源服务器，MUST 返回 `cnf`，并 SHOULD 对外以统一的 inactive 结果隐藏具体失败原因，同时在受控 evidence 中记录分类原因。

### 5.3 请求证明

资源请求 PoP MUST 由 PEP 验证（RFC 9449 DPoP、HTTP Message Signatures、mTLS 或等价 Profile），并把已验证的密钥绑定传给 Token 验证器。DPoP 验证器 MUST 校验 `htm`、`htu`、`iat`、`jti`，并在存在时校验 `ath` 与服务端 nonce。

## 6. 撤销新鲜度

撤销检查 MUST 使用第 1 部分 §6.3 的 freshness 类。权威验证使用 `pre_dispatch` 或 `continuation` 语义。撤销依赖不可用时 MUST 拒绝。

## 7. 一致性

- `../conformance/part-03-authentication/token-issuance-success.positive.json`
- `../conformance/part-03-authentication/token-audience-binding.negative.json`
- `../conformance/part-03-authentication/token-epoch-mismatch.negative.json`
- `../conformance/part-03-authentication/request-level-pop.negative.json`
- `../conformance/cross-repo/part-03-authentication/p3-token-audience-binding.json`
- `../conformance/cross-repo/part-03-authentication/p3-token-epoch-mismatch.json`
- `../conformance/cross-repo/part-03-authentication/p3-pop-proof-replay.json`
- `../conformance/cross-repo/part-03-authentication/p3-credential-generation-rotation.json`

声明本 Profile 的实现 MUST 通过以上全部向量。

## 8. 引用

- RFC 7638 — JWK Thumbprint（标准轨）。
- RFC 9449 — OAuth 2.0 DPoP（标准轨）。
- RFC 7662 — OAuth 2.0 Token Introspection（标准轨）。
- 第 1 部分 §6.2 canonical 化、§6.3 撤销新鲜度。
- RFC-0003《契约命名与身份约定》。
