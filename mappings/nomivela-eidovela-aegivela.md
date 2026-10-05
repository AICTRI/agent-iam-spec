# NOMIVELA / EIDOVELA / AEGIVELA 映射与符合性差距

状态：参考实现映射，非规范正文  
更新日期：2026-10-04

本文件记录 Agent IAM 系列与 AxisRobo 参考实现之间的关系，以及进入一致性声明前必须解决的差距。本文件不改变规范正文要求；当二者冲突时，以 `spec/part-*/` 为依据。

参考实现：

- NOMIVELA（Agent Registry 与 Namespace Authority，第 2 部分）：<https://github.com/axisrobo/nomivela>、<https://github.com/axisrobo/nomivela-open>；release `v2.0.0`；当前公共契约 `agent-registry-v2.0`（九类 lowerCamelCase，应用 RFC-0003；`agent-registry-v1.0` 为冻结的 snake_case 行）。
- EIDOVELA（身份与认证，第 3、5 部分，消费第 2 部分 Registry 记录）：<https://github.com/axisrobo/eidovela>、<https://github.com/axisrobo/eidovela-open>；release `v2.2.1`；当前 Registry Consumer wire 契约 `v3.0`（camelCase、`…Ref`、双 epoch、去 `tenant_id`；`v2`/`v1`/`v1alpha1` 冻结）。
- AEGIVELA（授权与委托，第 4、6 部分）：<https://github.com/axisrobo/aegivela>、<https://github.com/axisrobo/aegivela-open>；release `v1.2.5`；当前契约行 `aegivela.io/v2.0`（camelCase、双 epoch、去 `tenant`；`v1alphaN` 冻结）（[ADR-0018](https://github.com/axisrobo/aegivela/blob/main/docs/adr/0018-contract-v2-naming-migration.md)）。

职责边界：NOMIVELA 是 Agent/Agent ID/Authority Namespace/Authority Binding/Workload Registration/Agent Instance 的唯一写权威，发布 discovery；EIDOVELA 只消费 Registry 记录，负责工作负载认证与凭据；AEGIVELA 只消费已验证身份上下文，负责授权与委托。实现不互相持有对方的写权威。

## 1. 系列部分映射

| Part | 标识 | NOMIVELA | EIDOVELA | AEGIVELA | 当前符合状态 |
|---|---|---|---|---|---|
| 1 | `agent-iam-1-architecture` | 横切适用 | 横切适用 | 横切适用 | — |
| 2 | `agent-iam-2-registration-discovery` | 实现：注册、生命周期与 epoch、不可变 Authority Binding、Workload Registration、Agent Instance、签名 discovery；当前契约 `agent-registry-v2.0` | 消费 Registry 记录，wire 契约 `v3.0` | — | NOMIVELA 已实现并把契约毕业到 `agent-registry-v1.0`，并按 RFC-0003 发布 `agent-registry-v2.0`（九类 camelCase）；EIDOVELA 已切换为 consumer-only（写端点返回 `410 write_authority_moved`） |
| 3 | `agent-iam-3-authentication` | 提供 Registry 状态 | 实现：登记、工作负载证明、credential generation、PoP Token、双 epoch 在线验证、credential 撤销 | — | 核心实现；EE 侧硬件密钥托管与 console 待补 |
| 4 | `agent-iam-4-authorization` | — | — | 实现：Trusted Principal、PDP/Decision/Grant、Approval/Pre-Authorization、PEP/Revocation、委托非放大；当前契约行 `aegivela.io/v2.0` | F5 已闭合 canonical allow lineage、撤销边界对齐、生命周期激活；`v1alpha3` 已冻结，RFC-0003 命名迁移以 `v2.0` 契约行发布（[ADR-0018](https://github.com/axisrobo/aegivela/blob/main/docs/adr/0018-contract-v2-naming-migration.md)） |
| 5 | `agent-iam-5-federation` | 提供 Registry 状态 | 实现：Federation Trust、federated introspection、brokered issuance | 跨域撤销接口 | 核心实现；brokered 本地 Token 在线复检 Federation Trust（trust-disable 在过期前撤销） |
| 6 | `agent-iam-6-audit` | 注册表生命周期事件与证据 | evidence event | security evidence envelope（`evidence/v2.0` canonical envelope） | AEGIVELA 已补齐 Part 6 证据一致性（按 namespace/trace 关联，脱敏；v2.0 起仅持久化合约生产者字段） |
| 7 | `agent-iam-7-conformance` | — | 一致性声明 | 一致性声明 | EIDOVELA 与 AEGIVELA 均声明尚未按系列组合 profile 声明；两方均将跨仓 Parts 3–7 fixtures 列为阻塞项，fixtures 由本规范仓库交付（见 AEGIVELA ADR-0016） |

## 2. 统一契约约定（RFC-0003）

三个实现与规范统一采用以下约定（详见 `rfcs/0003-contract-naming-and-identity-conventions.md`）：

- **命名**:线上 JSON 字段一律 **camelCase**。
- **引用**:引用字段用 **`…Ref`** 后缀（`agentRef`、`authorityBindingRef`、`authorityRootRef`、`sponsorRef`、`ownerRef`、`workloadRegistrationRef`、`instanceRef`）;标识字段用 `…Id`（`agentId`）。
- **Epoch**:采用**双 epoch** `agentEpoch` + `identityEpoch`;`lifecycleEpoch` 仅作 legacy 兼容,不再作为稳定面唯一信号。
- **Agent class**:采用**合集** 9 类 —— `embedded`、`organizational`、`user`、`assetTwin`、`personalTwin`、`twin`、`service`、`ephemeral`、`simulation`。
- **Authority Binding**:记录字段用 `authorityBindingRef`(ref 格式);需要种类时用 `authorityBindingKind`（`human_master`/`organization_root`）。
- **tenant**:不作为互操作 claim,不得作为规范记录/上下文/决策/资产/事件的必填字段;实现可保留为**内部键**,由 Authority Namespace 确定性映射（用于 SaaS 多租户）。唯一互操作命名锚点是 `namespace`,`namespace + agentId` 为唯一性基础。

**当前契约行**（产品 release 与契约版本分离；契约版本格式为 `v<major>.<minor>`，产品 release 为 `major.minor.patch`）：

| 实现 | 产品 release | 当前契约行 | 冻结行 |
|---|---|---|---|
| NOMIVELA | `2.0.0` | `agent-registry-v2.0`（九类 lowerCamelCase，应用 RFC-0003） | `agent-registry-v1.0`（snake_case，`asset_twin`/`personal_twin`） |
| EIDOVELA | `2.2.1` | Registry Consumer `v3.0`（camelCase、`…Ref`、双 epoch、去 `tenant_id`） | `v2`、`v1`、`v1alpha1` |
| AEGIVELA | `1.2.5` | `aegivela.io/v2.0`（camelCase、双 epoch、去 `tenant`） | `v1alpha1`–`v1alpha3` |

## 3. 能力映射

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

## 4. NOMIVELA 阻塞项

- C1 的 EIDOVELA 登记握手契约仍标记 Pending；其余注册/生命周期/实例/命名空间路径已实现。
- EIDOVELA 写权重的受控切换（cutover）程序与校验器已就绪，实际执行待集成环境。
- C4 的联邦与边缘投影尚未开始（未来阶段）。

## 5. EIDOVELA 阻塞项

- EE 侧 HSM/KMS KeyProvider 的 cgo 接线与 console UI 待补（私有 EE 仓库跟踪）。
- 其余核心项（consumer 模式、证明信任、credential generation、PoP、双 epoch 在线验证、Federation Trust 复检、registry-consumer 一致性套件）已实现并在 CI 复现。

## 6. AEGIVELA 阻塞项

- Part 7 一致性组合 profile 声明待补；具体依赖规范仓库交付 Parts 3–7 跨仓 fixtures（当前标注为 *pending external delivery*）。
- 企业服务授权 profile 已从 exploratory 转为已实现（`contracts/enterprise-service/v1alpha1`，请求路径强制词汇校验）；`v2.0` 契约行对齐 descriptor 词汇与 digest。
- web 资源投影证据已补齐 namespace 关联。

## 7. 术语对照

| 规范术语 | NOMIVELA | EIDOVELA | AEGIVELA |
|---|---|---|---|
| Agent Identity | Agent registry record（权威） | 消费 | Agent Identity Authority record |
| Agent Instance | Agent Instance record（权威） | 消费认证绑定 | workload binding / instance context |
| Authority Root | `authorityRootRef`（不可变） | 消费 | `authorityRootRef` |
| Authority Binding | `authorityBindingRef` | 消费 | `authorityBindingRef` / `authorityBindingKind` |
| Authority Namespace | Namespace Authority（权威，`namespace`） | 消费 `namespace` | `namespace`（tenant 为内部键） |
| Discovery Document | 发布且签名（camelCase 文档） | 解析消费 | 不适用 |
| Lifecycle Epoch | `agentEpoch` + `identityEpoch`（权威） | 在线校验 | 绑定到决策与 grant |
| Principal | — | verified principal | trusted principal |
| Policy Decision | — | — | signed policy decision |
| Execution Grant | — | — | execution grant |
| Security Event Record | 注册表生命周期事件/证据 | evidence event | security evidence envelope |

## 8. 发现集成指引

独立 Registry（NOMIVELA）在 Authority Namespace 的 HTTPS 主机下发布 `/.well-known/agent-iam`，至少包含
`discoveryVersion`、`namespace`、`issuer`、`registryEndpoint`、`jwksUri`、
`supportedProofProfiles`、`supportedArtifactTypes`、`keyRotation`，并以独立可解析的签名密钥签名；
`/.well-known/agent-iam/jwks.json` 暴露公钥。EIDOVELA 作为认证方消费该文档：

1. **消费与验证**：校验 Registry 文档签名，签名密钥可独立于文档解析；轮换 overlap 至少覆盖最大 artifact 寿命加时钟偏差。
2. **解析规则**：namespace 采用 canonical 形式精确比较；issuer 必须来自注册记录，不因自声明而信任；结果带最大年龄缓存，过期元数据对新签发失败关闭。
3. **获取安全**：仅 HTTPS；host/scheme allowlist、DNS/IP 再验证、redirect/大小/超时/内容类型限制，拒绝 loopback、link-local、云 metadata 与未批准私网；对未知 `kid` 刷新限速。
4. **在线权威**：签发与在线验证以 Registry Context 单点读取为唯一 Registry 读取单元，不可用时失败关闭。

## 9. 一致性声明模板

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
