# EIDOVELA / AEGIVELA 映射与符合性差距

状态：参考实现映射，非规范正文  
更新日期：2026-09-22

本文件记录 Agent IAM 系列与 AxisRobo 参考实现之间的关系，以及进入一致性声明前必须解决的差距。本文件不改变规范正文要求；当二者冲突时，以 `spec/part-*/` 为依据。

参考实现：

- EIDOVELA（身份与认证，主要对应第 2、3、5 部分）：<https://github.com/axisrobo/eidovela>、<https://github.com/axisrobo/eidovela-open>
- AEGIVELA（授权与委托，主要对应第 4、6 部分）：<https://github.com/axisrobo/aegivela>、<https://github.com/axisrobo/aegivela-open>

## 1. 系列部分映射

| Part | 标识 | EIDOVELA | AEGIVELA | 当前符合状态 |
|---|---|---|---|---|
| 1 | `agent-iam-1-architecture` | 横切适用 | 横切适用 | — |
| 2 | `agent-iam-2-registration-discovery` | Registry、Lifecycle、Workload profiles | — | 部分符合：注册/生命周期对象已实现；**发现（Discovery Document/解析）未实现** |
| 3 | `agent-iam-3-authentication` | Enrollment/STS、Workload profiles、身份 Token/introspection | — | 部分符合：项目 JWT proof 和短时 Token 已实现，生产级 attestor、请求级 PoP、credential 在线撤销未完整满足 |
| 4 | `agent-iam-4-authorization` | — | Trusted Principal、PDP/Decision/Grant、Approval/Pre-Authorization、PEP/Revocation | 部分符合：核心模式与签名产物已实现，canonical allow lineage 和撤销契约未完整满足 |
| 5 | `agent-iam-5-federation` | Federation/Broker | 跨域撤销接口 | 部分符合：核心路径已实现，Brokered Token 缺 trust-disable 在线撤销 |
| 6 | `agent-iam-6-audit` | evidence event | security evidence envelope | 部分符合：PostgreSQL evidence 未完整覆盖 outcome 与安全拒绝事件 |
| 7 | `agent-iam-7-conformance` | 一致性声明 | 一致性声明 | 待补：尚未按系列组合 profile 声明 |

## 2. 能力映射

| 规范能力 | Part | 参考组件 | 当前符合状态 |
|---|---|---|---|
| Agent/Instance/Binding 注册 | 2 | EIDOVELA Registry | 部分符合：对象已实现，注册事务和 attestation reference 未完整满足 |
| 生命周期与 epoch | 2 | EIDOVELA Lifecycle | 部分符合：Agent epoch 已实现，Instance/credential 在线撤销未完整满足 |
| 发现（Discovery Document/解析） | 2 | 无 | 不符合：未实现 discovery document、issuer/JWKS 解析与缓存约束 |
| Enrollment 和 PoP | 3 | EIDOVELA Enrollment/STS | 部分符合：项目 JWT proof/JTI 已实现，不是 RFC 7523 线协议 |
| SPIFFE/Kubernetes/mTLS | 3 | EIDOVELA Workload profiles | 不符合生产 Profile：属性匹配已实现，密码学 attestor 未接线且存在调用方属性回退 |
| 身份 Token/introspection | 3 | EIDOVELA STS | 部分符合：短时 Token 和 Agent epoch 已实现，请求级 PoP 与 Instance/credential 在线检查不完整 |
| Federation/Broker | 5 | EIDOVELA Federation | 部分符合：核心路径已实现，Brokered Token 不具备 trust-disable 在线撤销 |
| Principal 和授权模式 | 4 | AEGIVELA Trusted Principal | 部分符合：核心模式已实现，接口认证和契约仍有差距 |
| PDP/Decision/Grant | 4 | AEGIVELA | 部分符合：模型和签名产物已实现，token exchange 尚不满足 canonical allow lineage |
| Approval/Pre-Authorization | 4 | AEGIVELA | 部分符合：主要约束已实现，仍依赖整体 Grant/撤销链路 |
| PEP/Revocation | 4 | AEGIVELA | 不符合完整 Profile：部分契约、SDK 和运行时不一致 |
| Security Event | 6 | AEGIVELA | 部分符合：envelope 已实现，脱敏与 reject 事件持久化待补 |

## 3. EIDOVELA 阻塞项

- 管理 API 需要强认证和授权（第 2 部分第 7.3 节）；
- 所有存储实现需要一致执行 namespace/trust-domain 校验；
- `tenant_id` 必须迁移为 `namespace`（RFC-0001），并保证 `namespace + agent_id` 唯一；
- 必须实现 discovery document、issuer/JWKS 解析、缓存上限与 SSRF 防御（第 2 部分第 8 节）；
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

## 4. AEGIVELA 阻塞项

- Enterprise bearer exchange 必须先调用 PDP，并仅接受绑定相同 principal、action、resource、scope 和 audience 的已验证 `allow` Decision；不得在 exchange service 内合成 allow；
- Revocation check endpoint、公开 contract 和 PEP SDK 必须一致，并携带 namespace 和 freshness class；
- Agent lifecycle schema/OpenAPI 与 runtime 状态、路由和 DTO 必须统一；
- Agent activation 必须按 Profile 强制 enrollment/attestation；
- Identity resolve 和 Evidence schema 必须与 runtime envelope 一致；
- 持久化 signing keys 应接入实际 signer 和 rotation；
- Attestation verifier 必须强制所有 Profile 要求的 assertion 组；
- Gateway 的 `system_api` 类型校验需要与 handler 一致。

## 5. 术语对照

| 规范术语 | EIDOVELA | AEGIVELA |
|---|---|---|
| Agent Identity | `agent` | Agent Identity Authority record |
| Agent Instance | `instance` | workload binding / instance context |
| Authority Root | Authority Binding (`human_master` / `organization_root`) | authority root |
| Authority Namespace | `tenant` / trust domain（需迁移为 namespace） | tenant context（需迁移为 namespace） |
| Discovery Document | 无（需新增） | 不适用 |
| Lifecycle Epoch | `lifecycle_epoch` | `lifecycle_epoch` |
| Principal | verified principal | trusted principal |
| Policy Decision | 不适用 | signed policy decision |
| Execution Grant | 不适用 | execution grant |
| Security Event Record | evidence event | security evidence envelope |

## 6. 发现实现指引（EIDOVELA）

第 2 部分第 8 节要求实现身份发现。EIDOVELA 目前没有 discovery document，建议按以下方式补齐（对应条款见括号）：

1. **发布 discovery document**：在每个 Authority Namespace 的 HTTPS 主机下发布
   `/.well-known/agent-iam`，至少包含
   `discovery_version`、`namespace`、`issuer`、`registry_endpoint`、`jwks_uri`、
   `supported_proof_profiles`、`supported_artifact_types`、`key_rotation`
   （第 2 部分第 8.2 节）。
2. **签名与密钥**：对文档签名，且签名密钥必须能独立于文档解析；轮换 overlap 至少覆盖
   最大 artifact 寿命加时钟偏差（第 2 部分第 8.2 节、第 3 部分第 5.6 节）。
3. **解析规则**：namespace 采用 canonical 形式并精确字符串比较；issuer 必须来自注册记录，
   不得因自声明而信任；结果带最大年龄缓存，过期元数据对新签发失败关闭，且不得用于满足撤销
   （第 2 部分第 8.3 节）。
4. **获取安全**：仅 HTTPS；host/scheme allowlist、DNS/IP 再验证、redirect/大小/超时/内容类型限制；
   拒绝 loopback、link-local、云 metadata 与未批准私网；对未知 `kid` 刷新限速
   （第 2 部分第 8.4 节）。
5. **绑定**：Registry 负责 namespace → issuer/registry 解析，STS 负责 `jwks_uri` 与轮换元数据，
   Federation 负责 peer trust 元数据；`iss`/OIDC discovery issuer 必须与 namespace issuer 语义一致
   （第 2 部分第 8.5 节、第 5 部分第 3 节）。

验收要点：给定一个 Authority Namespace，能在无调用方提示的情况下解析到受信 issuer、注册表端点
与验证密钥，并在元数据过期或被篡改时失败关闭。

## 7. 一致性声明模板

```text
实现名称：
版本 / commit：
支持的部分与等级：Part 2 | 3 | 4 | 5 （分别列出）
声明的组合 profile：Identity | Authorization | Federated
支持的 proof Profile：
支持的 Token / artifact 版本：
撤销 SLO：
发现机制与缓存上限：
已知扩展：
未满足的规范条款：
```
