# Profile：联邦

- Profile 标识：`agent-iam-profile-federation`
- 适用：第 5 部分 `agent-iam-5-federation`
- 系列版本：`0.3.0-draft`
- 状态：草案（发布后具规范性）
- 语言：英文为规范性主文本；本文件为等价翻译。

本 Profile 收窄第 5 部分第 3–7 节，不得放宽第 5 部分任何 `MUST`/`MUST NOT`。

## 1. 范围

定义命名空间范围的 Federation Trust、主体隔离、联邦验证、trust 撤销与跨域证据关联。

## 2. Federation Trust

Federation Trust MUST 为命名空间范围，且 MUST 至少指定：

- peer issuer；
- JWKS URI 或 trust bundle；
- 允许的 audiences；
- claim 映射；
- PoP 要求；
- trust 状态；
- 密钥刷新与失败关闭策略。

peer claim MUST NOT 指定或覆盖本地 namespace。trust 元数据与 JWKS 获取 MUST 使用 HTTPS（显式本地开发例外除外），并 MUST 实施 host/scheme allowlist、DNS/IP 再验证、redirect 与响应大小限制、连接与读超时、content-type 检查，以及未知 `kid` 刷新的限速。loopback、link-local、云 metadata 地址与未批准私网目标 MUST 拒绝。过期密钥的最大可用时间 MUST 受限。

## 3. 主体隔离

Federated Principal MUST NOT 被自动合并进本地 Agent Identity。Brokered Principal MUST 使用不与本地 Agent ID 冲突的 namespace，MUST 保持其源 Authority Namespace，MUST NOT 把 peer Namespace 拍平为另一 Namespace，且在其无本地 Agent epoch 时 MUST 明确其撤销语义。

## 4. 联邦验证

联邦验证 MUST 同时检查 trust 状态、签名、已知 `kid`、issuer、audience、时间、PoP 与 claim 映射。Brokered Token 的在线验证 MUST 依据其 trust/version 引用重新检查对应 Federation Trust；仅等待本地 Token 过期不满足要求。Brokered Token MUST NOT 伪造本地 `agentClass`、`instanceId`、`workloadId`、`authorityRootRef` 或生命周期 epoch。

## 5. Trust 撤销

trust 被禁用后，下一次权威在线验证 MUST 失败关闭。trust 撤销 MUST 使用第 1 部分 §6.3 freshness 类。trust 或密钥依赖不可用时，验证 MUST 失败关闭。

## 6. 跨域证据关联

不同 Authority Namespace 产生的安全事件 SHOULD 通过 `traceId` 与受控引用关联，且不披露不必要的标识。关联 MUST NOT 要求把联邦主体合并为本地 Agent Identity。联邦主体 SHOULD 以 `fed:<issuer>/<subject>` 命名，而非本地 agent 引用。

## 7. 一致性

- `../conformance/part-05-federation/active-trust-verification.positive.json`
- `../conformance/part-05-federation/principal-isolation.negative.json`
- `../conformance/part-05-federation/brokered-token-forged-field.negative.json`
- `../conformance/part-05-federation/trust-disable.negative.json`
- `../conformance/cross-repo/part-05-federation/p5-active-trust-verification.json`
- `../conformance/cross-repo/part-05-federation/p5-principal-isolation.json`
- `../conformance/cross-repo/part-05-federation/p5-trust-disable-revokes-brokered.json`

声明本 Profile 的实现 MUST 通过以上全部向量。

## 8. 引用

- 第 1 部分 §6.3 撤销新鲜度。
- 第 2 部分 §8.4 发现 SSRF 防御。
- 第 3 部分 §5.1 中转 Token 类型与 claim。
- RFC 8693 — OAuth 2.0 Token Exchange（标准轨）。
