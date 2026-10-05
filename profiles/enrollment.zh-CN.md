# Profile：登记与工作负载证明

- Profile 标识：`agent-iam-profile-enrollment`
- 适用：第 3 部分 `agent-iam-3-authentication`
- 系列版本：`0.4.0-draft`
- 状态：草案（发布后具规范性）
- 语言：英文为规范性主文本；本文件为等价翻译。

本 Profile 收窄第 3 部分第 4 节（及 §5.5、§7、§8 的 challenge/attestation 部分），不得放宽第 3 部分任何 `MUST`/`MUST NOT`。

## 1. 范围

定义工作负载如何登记为 Agent Instance 并获得凭据 generation：challenge、enrollment 持钥证明、三阶段证明模型、支持的证明 Profile 与凭据生命周期。注册与生命周期权威仍在第 2 部分。

## 2. Challenge

Enrollment challenge MUST：命名空间范围、不可预测、单次使用，并绑定 Agent ID、Workload Registration 与期望受众。默认最长有效期为 5 分钟。消费 MUST 在命名空间内原子完成，且在签发凭据前记录。

## 3. Enrollment 持钥证明

采用项目定义的 Enrollment JWT proof 时，MUST 至少绑定：

- `iss = agentId`；
- `sub = agentId`，或本 Profile 定义的 instance subject；
- 期望的 `aud`；
- challenge ID 与 nonce；
- `iat`、`exp` 与单次使用的 `jti`。

验证方 MUST 固定允许算法，拒绝未知 `kid`、重复 JSON 成员、未知关键 claim、重复 claim、过长有效期与重放。proof JTI MUST 在命名空间内原子消费。

本 Profile 借鉴 RFC 7523 的 assertion 处理，但自定义 challenge、nonce、claim 与 HTTP 绑定，MUST NOT 表述为 OAuth `private_key_jwt` 客户端认证。若声明 RFC 7523 互操作，MUST 另行实现其 `clientAssertion_type`、`clientAssertion`、client 标识、端点与错误响应。

## 4. 三阶段证明

系统 MUST 区分并依序执行：

1. **证据密码学验证**：证书链或 JWT 签名、issuer、audience、有效期；
2. **属性规范化**：仅从已验证证据推导 namespace、ServiceAccount、SPIFFE ID、证书摘要等；
3. **selector 授权**：将推导属性与预注册 selector 精确匹配。

调用方提交的 PEM、JWT 或属性 JSON MUST NOT 直接视为"已验证证明"。未知证明方法 MUST 失败关闭。

## 5. 证明 Profile

### 5.1 `spiffe`

校验 X.509-SVID 或 JWT-SVID、trust domain 与唯一 SPIFFE URI；trust bundle MUST 固定到期望 trust anchor。

### 5.2 `k8s_projected_sa`

依据集群 JWKS 校验 projected ServiceAccount token 的签名、issuer、audience、时间与 subject；audience MUST 精确等于 enrollment audience。

### 5.3 `mtls`

校验证书链、有效期、`ClientAuth` EKU 与期望 trust anchor；绑定身份 MUST 从已验证链推导。

### 5.4 `private_key_jwt`

依据注册密钥校验 assertion 签名并绑定 challenge。此为 enrollment proof 类别，不是 RFC 7523 客户端认证。

### 5.5 RATS/EAT

使用 RATS/EAT 时，MUST 按 RFC 9334、RFC 9711 区分 Evidence 与 Attestation Result。

Workload Registration MAY 携带版本化 proof profile（`proofRequirements`），其对裸 allowed-methods 列表具权威性，且 MUST 声明 schema 版本、至少一个版本化方法与一个 selector schema 版本。

## 6. 凭据生命周期

凭据 MUST 绑定 Agent、Instance 与显式 enrollment generation。重新登记 MUST 建立严格更大的 generation，并使上一 generation 不可用于新签发。若声明即时 instance 撤销，则被撤销 generation 下签发的 Token MUST 在下一次在线验证时失效。

## 7. 一致性

- `../conformance/part-03-authentication/enrollment-success.positive.json`
- `../conformance/part-03-authentication/enrollment-challenge-single-use.negative.json`
- `../conformance/cross-repo/part-03-authentication/p3-enrollment-success.json`
- `../conformance/cross-repo/part-03-authentication/p3-enrollment-challenge-single-use.json`
- `../conformance/cross-repo/part-03-authentication/p3-credential-generation-rotation.json`

声明本 Profile 的实现 MUST 通过以上全部向量。

## 8. 引用

- RFC 7523 — OAuth 2.0 JWT Client Authentication/Authorization Grants（标准轨）。
- RFC 9334 — RATS 架构（标准轨）。
- RFC 9711 — Entity Attestation Token（标准轨）。
- SPIFFE X.509-SVID/JWT-SVID 规范（外部）。
- Kubernetes projected ServiceAccount token 文档（外部）。
- 第 2 部分（注册与 Workload Registration）、第 3 部分 §4–5。
