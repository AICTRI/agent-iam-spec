# NOMIVELA / EIDOVELA / AEGIVELA 映射与符合性差距

状态：参考实现映射，非规范正文  
更新日期：2026-09-30

本文件记录 Agent IAM 系列与 AxisRobo 参考实现之间的关系，以及进入一致性声明前必须解决的差距。本文件不改变规范正文要求；当二者冲突时，以 `spec/part-*/` 为依据。

参考实现：

- NOMIVELA（Agent Registry 与 Namespace Authority，第 2 部分）：<https://github.com/axisrobo/nomivela>、<https://github.com/axisrobo/nomivela-open>；版本 `v2.0.0`；公共契约 `agent-registry-v1.0`（自 `2.0.0` 由 `0.1` 毕业）。
- EIDOVELA（身份与认证，第 3、5 部分，消费第 2 部分 Registry 记录）：<https://github.com/axisrobo/eidovela>、<https://github.com/axisrobo/eidovela-open>；版本 `v2.2.1`。
- AEGIVELA（授权与委托，第 4、6 部分）：<https://github.com/axisrobo/aegivela>、<https://github.com/axisrobo/aegivela-open>；版本 `v1.1.1`。

职责边界：NOMIVELA 是 Agent/Agent ID/Authority Namespace/Authority Binding/Workload Registration/Agent Instance 的唯一写权威，发布 discovery；EIDOVELA 只消费 Registry 记录，负责工作负载认证与凭据；AEGIVELA 只消费已验证身份上下文，负责授权与委托。实现不互相持有对方的写权威。

## 1. 系列部分映射

| Part | 标识 | NOMIVELA | EIDOVELA | AEGIVELA | 当前符合状态 |
|---|---|---|---|---|---|
| 1 | `agent-iam-1-architecture` | 横切适用 | 横切适用 | 横切适用 | — |
| 2 | `agent-iam-2-registration-discovery` | 实现：注册、生命周期与 epoch、不可变 Authority Binding、Workload Registration、Agent Instance、签名 discovery | 消费 | — | NOMIVELA 已实现并把契约毕业到 `agent-registry-v1.0`；EIDOVELA 已切换为 consumer-only（写端点返回 `410 write_authority_moved`） |
| 3 | `agent-iam-3-authentication` | 提供 Registry 状态 | 实现：登记、工作负载证明、credential generation、PoP Token、双 epoch 在线验证、credential 撤销 | — | 核心实现；EE 侧硬件密钥托管与 console 待补 |
| 4 | `agent-iam-4-authorization` | — | — | 实现：Trusted Principal、PDP/Decision/Grant、Approval/Pre-Authorization、PEP/Revocation、委托非放大 | F5 已闭合 canonical allow lineage、撤销边界对齐、生命周期激活、`policy/v1alpha3` 契约 |
| 5 | `agent-iam-5-federation` | 提供 Registry 状态 | 实现：Federation Trust、federated introspection、brokered issuance | 跨域撤销接口 | 核心实现；brokered 本地 Token 在线复检 Federation Trust（trust-disable 在过期前撤销） |
| 6 | `agent-iam-6-audit` | 注册表生命周期事件与证据 | evidence event | security evidence envelope | AEGIVELA 已补齐 Part 6 证据一致性（按 tenant/namespace/trace 关联，脱敏） |
| 7 | `agent-iam-7-conformance` | — | 一致性声明 | 一致性声明 | 待补：尚未按系列组合 profile 声明；跨仓 fixtures 依赖规范仓库交付 |

## 2. 能力映射

| 规范能力 | Part | 参考组件 | 当前符合状态 |
|---|---|---|---|
| Agent/Agent ID/Binding 注册 | 2 | NOMIVELA Registry | 已实现：`namespace + agent_id` 唯一、每个 Agent 一个 live Agent ID、不可变 Authority Binding |
| 生命周期与 epoch | 2, 3 | NOMIVELA（权威）+ EIDOVELA（凭据 generation 与认证状态） | 已实现：NOMIVELA 权威管理 `agent_epoch`/`identity_epoch`；EIDOVELA 在线校验并在不可用时失败关闭 |
| Registry Context 单点读取 | 2 | NOMIVELA `GET /v1/registry-context` | 已实现：单快照返回 Namespace/Agent/Agent Identity/Binding/Workload Registration/Instance，跨状态不一致时失败关闭 |
| Discovery Document/解析 | 2 | NOMIVELA 发布；EIDOVELA 消费 | 已实现：`/.well-known/agent-iam` 签名文档 + `jwks.json`；EIDOVELA 校验签名、缓存上限、SSRF/未知 `kid` 防御 |
| Enrollment 与 PoP | 3 | EIDOVELA Enrollment/STS | 已实现：`private_key_jwt` 登记、证明选择器匹配、PoP Token、proof-JTI 重放保护 |
| 身份 Token/introspection | 3 | EIDOVELA STS | 已实现：短时 Token、双 epoch 在线验证、credential generation 与在线撤销 |
| Federation/Broker | 5 | EIDOVELA Federation | 已实现：trust 管理、federated introspection、brokered issuance；brokered Token 在线复检 trust |
| Principal 与授权模式 | 4 | AEGIVELA Trusted Principal | 已实现：五模式、`identitysrc` 只允许 Provider 构造 principal |
| PDP/Decision/Grant | 4 | AEGIVELA | 已实现：签名决策、Execution Grant、canonical allow lineage（exchange 不合成 allow） |
| Approval/Pre-Authorization | 4 | AEGIVELA | 已实现：签名审批制品、scope 衰减、撤销绑定 |
| PEP/Revocation | 4 | AEGIVELA PEP SDK/运行时 | 已实现：selector 与 freshness class 一致（`pre_dispatch`/`continuation`/`connection`），依赖不可用即失败关闭 |
| Security Event | 6 | AEGIVELA security evidence | 已实现：append-only `evidence_events`，脱敏，按 tenant/namespace/trace 关联 |

## 3. NOMIVELA 阻塞项

- C1 的 EIDOVELA 登记握手契约仍标记 Pending；其余注册/生命周期/实例/命名空间路径已实现。
- EIDOVELA 写权重的受控切换（cutover）程序与校验器已就绪，实际执行待集成环境。
- C4 的联邦与边缘投影尚未开始（未来阶段）。

## 4. EIDOVELA 阻塞项

- EE 侧 HSM/KMS KeyProvider 的 cgo 接线与 console UI 待补（私有 EE 仓库跟踪）。
- 其余核心项（consumer 模式、证明信任、credential generation、PoP、双 epoch 在线验证、Federation Trust 复检、registry-consumer 一致性套件）已实现并在 CI 复现。

## 5. AEGIVELA 阻塞项

- Part 7 一致性组合 profile 声明待补；具体依赖规范仓库交付 Parts 3–7 跨仓 fixtures（当前标注为 *pending external delivery*）。
- 企业服务授权 profile 已从 exploratory 转为已实现（`contracts/enterprise-service/v1alpha1`，请求路径强制词汇校验）。
- web 资源投影证据已补齐 namespace 关联。

## 6. 术语对照

| 规范术语 | NOMIVELA | EIDOVELA | AEGIVELA |
|---|---|---|---|
| Agent Identity | Agent registry record（权威） | 消费 | Agent Identity Authority record |
| Agent Instance | Agent Instance record（权威） | 消费认证绑定 | workload binding / instance context |
| Authority Root | Authority Binding（不可变） | 消费 | authority root |
| Authority Namespace | Namespace Authority（权威） | 消费 namespace | tenant context（保留 `tenant_id` 作为技术键） |
| Discovery Document | 发布且签名 | 解析消费 | 不适用 |
| Lifecycle Epoch | `agent_epoch`/`identity_epoch`（权威） | 在线校验 | 绑定到决策与 grant |
| Principal | — | verified principal | trusted principal |
| Policy Decision | — | — | signed policy decision |
| Execution Grant | — | — | execution grant |
| Security Event Record | 注册表生命周期事件/证据 | evidence event | security evidence envelope |

## 7. 发现集成指引

独立 Registry（NOMIVELA）在 Authority Namespace 的 HTTPS 主机下发布 `/.well-known/agent-iam`，至少包含
`discovery_version`、`namespace`、`issuer`、`registry_endpoint`、`jwks_uri`、
`supported_proof_profiles`、`supported_artifact_types`、`key_rotation`，并以独立可解析的签名密钥签名；
`/.well-known/agent-iam/jwks.json` 暴露公钥。EIDOVELA 作为认证方消费该文档：

1. **消费与验证**：校验 Registry 文档签名，签名密钥可独立于文档解析；轮换 overlap 至少覆盖最大 artifact 寿命加时钟偏差。
2. **解析规则**：namespace 采用 canonical 形式精确比较；issuer 必须来自注册记录，不因自声明而信任；结果带最大年龄缓存，过期元数据对新签发失败关闭。
3. **获取安全**：仅 HTTPS；host/scheme allowlist、DNS/IP 再验证、redirect/大小/超时/内容类型限制，拒绝 loopback、link-local、云 metadata 与未批准私网；对未知 `kid` 刷新限速。
4. **在线权威**：签发与在线验证以 Registry Context 单点读取为唯一 Registry 读取单元，不可用时失败关闭。

## 8. 一致性声明模板

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
