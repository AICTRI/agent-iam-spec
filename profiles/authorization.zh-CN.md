# Profile：授权

- Profile 标识：`agent-iam-profile-authorization`
- 适用：第 4 部分 `agent-iam-4-authorization`
- 系列版本：`0.4.1-draft`
- 状态：草案（发布后具规范性）
- 语言：英文为规范性主文本；本文件为等价翻译。

本 Profile 收窄第 4 部分第 3、4、6、7、8.1 节，不得放宽第 4 部分任何 `MUST`/`MUST NOT`。

## 1. 范围

定义 Principal 模型、授权模式、单一授权谱系、规范 Policy Decision、Execution Grant、PEP obligation 与授权撤销。委托与 Token exchange 由 `delegation` Profile 规定；本 Profile 规定其运行基础。

## 2. Principal

可信 Principal MUST 仅由 identity source 依据已验证认证输出（第 3 部分）构造，MUST 携带规范 `namespace`、`authorityBindingRef`、`agentClass`、`instanceId`、`workloadId`、`agentEpoch` 与 `identityEpoch`。第 4 部分 MUST NOT 从调用方自报值重新推导 namespace、agent class、workload 或 epoch。自然语言、模型输出与工具返回值 MUST NOT 选择 namespace 或 Authority Root。

## 3. 授权模式

模式词表固定：

| 模式 | 权威来源 | 所需证明 |
|---|---|---|
| `human_web` | 人类会话 / OIDC | 授权码流程与保证等级 |
| `system_api` | client + workload | client 与 workload 证明 |
| `delegated_api` | 用户委托 + client/workload | 委托加 client/workload 证明 |
| `service_agent_api` | Agent 身份 | 身份 + workload + epoch |
| `twin_agent_api` | 不可变 master 绑定 | master 绑定 + workload + epoch |

模式 MUST NOT 相互替代。端点 MUST 仅接受适用于自身的模式与 artifact 类型（第 4 部分 §6）。

## 4. 有效权限

有效权限 MUST 为所有适用上界的交集（第 4 部分 §3.3）。缺少任一必需输入 MUST 拒绝。仅 `allow` 可派生 Execution Grant；`deny`、`approval_required`、`revoked` 与未知结果均阻止执行。

## 5. Decision

Decision MUST 至少绑定 namespace、模式、适用的 subject/actor/client/workload/authority-root 字段、action、不可变资源标识或摘要、规范化 scope、audience、policy ID/version、生命周期 epoch、decision ID、签发时间、过期时间、outcome 与 obligations。摘要 MUST 遵循第 1 部分 §6.2。

## 6. Execution Grant

Execution Grant MUST 短时、绑定受众且发送方受限，且 MUST 绑定 action、resource、scope、task、policy version、生命周期 epoch 与父谱系。PEP MUST 在每次受保护效果前验证 Grant，而非仅在连接建立时。

## 7. PEP obligation

PEP MUST：

- 校验签名、issuer、audience、过期、namespace、PoP、资源摘要、epoch 与撤销；
- 仅在执行全部 obligation 后允许效果；
- 在长时任务的 continuation 边界重新校验授权与撤销；
- 对 action、目标 host、path、tool ID、skill hash 与 implementation digest 精确匹配；
- 不把目录可见性、模型选择结果或自然语言计划视为授权。

凭据注入 MUST 为显式 obligation，绑定 `credentialRef` 或 class、target、scope 与 expiry。凭据值 MUST NOT 进入 Decision、Grant、提示词或 evidence；LLM MUST NOT 访问主身份私钥或下游服务凭据。

## 8. 撤销

授权撤销 MAY 使用命名空间范围 selector，包括 subject、session、authority root、Decision JTI、Grant JTI、Approval JTI、policy version 与资源/实现摘要。检查 MUST 使用第 1 部分 §6.3 freshness 类，依赖不可用时 MUST 拒绝。离线或降级模式 MUST NOT 用于凭据注入、权限扩张、新目标或高风险破坏性操作。

## 9. 一致性

- `../conformance/part-04-authorization/decision-allow-derives-grant.positive.json`
- `../conformance/part-04-authorization/decision-deny-blocks-grant.negative.json`
- `../conformance/part-04-authorization/revocation-freshness-pre-dispatch.negative.json`
- `../conformance/part-04-authorization/prompt-injection-cannot-expand.negative.json`
- `../conformance/cross-repo/part-04-authorization/p4-decision-allow-derives-grant.json`
- `../conformance/cross-repo/part-04-authorization/p4-decision-deny-blocks-grant.json`
- `../conformance/cross-repo/part-04-authorization/p4-credential-injection-obligation.json`

声明本 Profile 的实现 MUST 通过以上全部向量。

## 10. 引用

- 第 1 部分 §6.2（canonical 化）、§6.3（撤销新鲜度）。
- 第 3 部分（认证输出与证明要求）。
- RFC 8693 — OAuth 2.0 Token Exchange（标准轨）；见 `delegation` Profile。
