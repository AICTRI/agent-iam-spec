# EIDOVELA / AEGIVELA 映射与符合性差距

状态：参考实现映射，非规范正文  
更新日期：2026-09-22

本文件记录 `agent-iam-spec` 与 AxisRobo 参考实现之间的关系，以及进入一致性声明前必须解决的差距。本文件不改变规范正文要求；当二者冲突时，以 `spec/` 为依据。

参考实现：

- EIDOVELA（身份与认证）：<https://github.com/axisrobo/eidovela>、<https://github.com/axisrobo/eidovela-open>
- AEGIVELA（授权与委托）：<https://github.com/axisrobo/aegivela>、<https://github.com/axisrobo/aegivela-open>

## 1. 能力映射

| 规范能力 | 参考组件 | 当前符合状态 |
|---|---|---|
| Agent/Instance/Binding 注册 | EIDOVELA Registry | 部分符合：对象已实现，注册事务和 attestation reference 未完整满足 |
| 生命周期与 epoch | EIDOVELA Lifecycle | 部分符合：Agent epoch 已实现，Instance/credential 在线撤销未完整满足 |
| Enrollment 和 PoP | EIDOVELA Enrollment/STS | 部分符合：项目 JWT proof/JTI 已实现，不是 RFC 7523 线协议 |
| SPIFFE/Kubernetes/mTLS | EIDOVELA Workload profiles | 不符合生产 Profile：属性匹配已实现，密码学 attestor 未接线且存在调用方属性回退 |
| 身份 Token/introspection | EIDOVELA STS | 部分符合：短时 Token 和 Agent epoch 已实现，请求级 PoP 与 Instance/credential 在线检查不完整 |
| Federation/Broker | EIDOVELA Federation | 部分符合：核心路径已实现，Brokered Token 不具备 trust-disable 在线撤销 |
| Principal 和授权模式 | AEGIVELA Trusted Principal | 部分符合：核心模式已实现，接口认证和契约仍有差距 |
| PDP/Decision/Grant | AEGIVELA | 部分符合：模型和签名产物已实现，token exchange 尚不满足 canonical allow lineage |
| Approval/Pre-Authorization | AEGIVELA | 部分符合：主要约束已实现，仍依赖整体 Grant/撤销链路 |
| PEP/Revocation/Security Event | AEGIVELA | 不符合完整 Profile：部分契约、SDK 和运行时不一致 |

## 2. EIDOVELA 阻塞项

- 管理 API 需要强认证和授权；
- 所有存储实现需要一致执行 namespace/trust-domain 校验；
- `tenant_id` 必须迁移为 `namespace`（RFC-0001），并保证 `namespace + agent_id` 唯一；
- Blueprint 必须按请求版本精确校验和绑定；
- Agent 注册与 Binding/evidence 需要事务一致性；
- SPIFFE、Kubernetes 和 mTLS 证据需要接入实际链/签名验证器；
- 符合模式必须禁用调用方自报 workload attributes 的回退，并持久化可解析到验证结果的 `attestation_ref`；
- Credential re-enrollment、轮换和撤销语义需要完成；
- Instance terminate 必须使既有 Token 在下一次权威在线验证时失效；
- Token 请求 proof 必须绑定目标 Token audience，并由 namespace-scoped audience registry 校验；
- 资源请求必须验证请求级 PoP；仅提交 public JWK/thumbprint 不得视为持钥证明；
- Brokered Token 在线验证必须重新检查 Federation Trust 状态；
- 安全 JSON/JWT/JWK 解析必须拒绝重复 member，并提供跨实现测试向量；
- PostgreSQL evidence 需要持久保存 outcome，并覆盖安全拒绝事件；
- OIDC discovery issuer 必须与 namespace issuer 语义一致；
- 签名 key overlap 必须覆盖最大 Token TTL 和 clock skew。

## 3. AEGIVELA 阻塞项

- Enterprise bearer exchange 必须先调用 PDP，并仅接受绑定相同 principal、action、resource、scope 和 audience 的已验证 `allow` Decision；不得在 exchange service 内合成 allow；
- Revocation check endpoint、公开 contract 和 PEP SDK 必须一致，并携带 namespace 和 freshness class；
- Agent lifecycle schema/OpenAPI 与 runtime 状态、路由和 DTO 必须统一；
- Agent activation 必须按 Profile 强制 enrollment/attestation；
- Identity resolve 和 Evidence schema 必须与 runtime envelope 一致；
- 持久化 signing keys 应接入实际 signer 和 rotation；
- Attestation verifier 必须强制所有 Profile 要求的 assertion 组；
- Gateway 的 `system_api` 类型校验需要与 handler 一致。

## 4. 术语对照

| 规范术语 | EIDOVELA | AEGIVELA |
|---|---|---|
| Agent Identity | `agent` | Agent Identity Authority record |
| Agent Instance | `instance` | workload binding / instance context |
| Authority Root | Authority Binding (`human_master` / `organization_root`) | authority root |
| Authority Namespace | `tenant` / trust domain（需迁移为 namespace） | tenant context（需迁移为 namespace） |
| Lifecycle Epoch | `lifecycle_epoch` | `lifecycle_epoch` |
| Principal | verified principal | trusted principal |
| Policy Decision | 不适用 | signed policy decision |
| Execution Grant | 不适用 | execution grant |
| Security Event Record | evidence event | security evidence envelope |

## 5. 一致性声明模板

```text
实现名称：
版本 / commit：
声明 Level：1 | 2 | 3
支持的 proof Profile：
支持的 Token / artifact 版本：
撤销 SLO：
已知扩展：
未满足的规范条款：
```
