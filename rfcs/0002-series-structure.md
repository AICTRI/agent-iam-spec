# RFC-0002: Reorganize `agent-iam-spec` into a Multi-Part Agent IAM Series

- Status: Draft
- Authors: _（待填写）_
- Date: 2026-09-22
- Affected documents and clauses: 全部 `spec/` 正文；`GOVERNANCE.md` 第 3、5、6 节；根 `README.md`、`README.zh-CN.md`；`schemas/README.md`、`profiles/README.md`、`conformance/README.md`；`mappings/`
- Type: Normative

## Summary

将单一文档 `agent-iam-spec` 重组为系列标准 `Agent IAM Series`，共 7 个部分：总体架构、注册与发现、身份与认证、授权与委托、跨域联邦、审计与安全事件、一致性与测试。认证与授权分离为独立部分；注册与发现（含身份发现）成为独立部分；联邦、审计、一致性各成一部分。各部分通过稳定的接口契约衔接，并共享第 1 部分定义的术语、可信来源、失败关闭与规范用语。

## Motivation

现行单文档把安全边界、变更节奏和读者各不相同的关注点混在一起：

- **认证与授权混淆风险。** 规范正文虽已声明“身份凭据不得解释为执行授权”，但两者共享同一文档、同一组章节编号，且第 11.2 节授权模式表把“必需证明”（认证）与“权威来源”（授权）放在同一张表，容易让实现越过边界。
- **注册/发现缺失。** 注册流程、生命周期与身份记录散落在第 6–8 节，而**发现**（issuer、JWKS、registry、trust bundle 的解析）几乎没有规定，导致跨域互操作缺少接入点。
- **联邦、审计、一致性横跨多个关注点**，却与身份/授权正文并列，无法独立演进。
- **发布与合规节奏不同。** 身份对象模型相对稳定，授权策略与撤销语义变化更快；单文档整体升版会放大不兼容影响。
- **与外部标准对齐。** `GB/Z 185` 采用“总体架构/身份码/身份管理”多部分结构，IETF WIMSE 亦按“架构/标识/凭据”分离；系列化便于形成部分级映射。

## Detailed design

### 1. 系列结构

系列标识 `agent-iam-series`，语言以英文为规范性主文本，中文为等价翻译。各部分版本随系列同步发布（`major.minor.patch[-draft]`）。

| Part | 标识 | 标题 | 依赖 |
|---|---|---|---|
| 1 | `agent-iam-1-architecture` | 总体架构与术语 | — |
| 2 | `agent-iam-2-registration-discovery` | 智能体注册与发现 | 1 |
| 3 | `agent-iam-3-authentication` | 智能体身份与认证 | 1, 2 |
| 4 | `agent-iam-4-authorization` | 智能体授权与委托 | 1, 2, 3 |
| 5 | `agent-iam-5-federation` | 跨域联邦与互操作 | 1, 3, 4 |
| 6 | `agent-iam-6-audit` | 审计与安全事件 | 1 |
| 7 | `agent-iam-7-conformance` | 一致性与测试 | 全部 |

仓库结构：

```text
spec/
├── README.md                          # 系列索引
├── part-01-architecture/{en,zh-CN}/
├── part-02-registration-discovery/{en,zh-CN}/
├── part-03-authentication/{en,zh-CN}/
├── part-04-authorization/{en,zh-CN}/
├── part-05-federation/{en,zh-CN}/
├── part-06-audit/{en,zh-CN}/
└── part-07-conformance/{en,zh-CN}/
```

### 2. 现章节到新 Part 的追溯

| 现章节 | 新 Part |
|---|---|
| §1 范围、§2 文件状态、§3 规范性用语、§4 术语、§5 体系结构 | Part 1 |
| §6 标识规范、§7 对象模型、§8 生命周期 | Part 2 |
| §9 Enrollment 与证明、§10 凭据与 Token | Part 3 |
| §11 Principal 与授权模式、§12 Decision/Grant、§13 委托、§14 PEP | Part 4 |
| §15 撤销 | 三拆：凭据/实例→Part 3；Decision/Grant/Approval→Part 4；Federation Trust→Part 5 |
| §16 联邦 | Part 5 |
| §17 审计与安全事件 | Part 6 |
| §18 安全要求 | 按关注点下沉：重放、Claim 解析→Part 3；Confused Deputy→Part 3+4；Prompt Injection→Part 4；管理面→Part 2 |
| §19 隐私要求 | Part 1（横切原则） |
| §20 一致性等级 | Part 7 |
| §21–23 标准采用与参考文献 | Part 1 |
| §24 待讨论事项 | 拆分到各 Part 与 Part 1 |

### 3. 接口契约（部分之间的接缝）

- **Part 1 提供**：术语、可信来源原则、失败关闭、规范用语、canonical 化与 digest 通用规则、撤销 freshness 词表、隐私原则。
- **Part 2 → Part 3**：`Agent Identity Record`、`Agent Instance`、`Workload Registration`、Authority Namespace、`lifecycle_state`/`lifecycle_epoch`、发现元数据。
- **Part 3 → Part 4**：`Verified Agent Identity Context`，至少包含 namespace、agent_id、agent_class、instance_id、workload_id、authority_root_ref、lifecycle_epoch、attestation/credential/revocation 状态。Part 4 **不得**从调用方重新推导这些值。
- **Part 3/4 → Part 5**：external issuer、external subject、federation trust/version reference。
- **全部 → Part 6**：统一安全事件 envelope 与最小字段。
- **Part 7**：各部分独立一致性 + 系列级组合 profile。

### 4. 第 11.2 节授权模式表的切分

- “必需证明”列（OIDC 授权码、client + workload proof、用户委托、Agent identity + workload + epoch、immutable master binding）→ **Part 3**。
- “权威来源”列（human subject、组织/系统根、human master）与有效权限交集 → **Part 4**。
- 模式的行为约束（不得互相替代、Workload 不得冒充人类等）→ **Part 4**，但其证明要求引用 Part 3。

### 5. 撤销的拆分

- **Part 1**：selector 语义、freshness 等级（`pre_dispatch`/`continuation`/`connection`）、失败关闭。
- **Part 3**：Agent、Instance、credential、lifecycle epoch 级撤销，凭据再注册与轮换。
- **Part 4**：Decision JTI、Grant JTI、Approval JTI、resource/implementation digest 撤销。
- **Part 5**：Federation Trust 撤销与 Brokered Token 的 trust-disable 在线撤销、cross-domain correlation。

### 6. 发现的边界

发现部分**仅**规定身份与注册发现：Authority Namespace → issuer 元数据、Agent ID → 身份/签发方、issuer → JWKS/trust bundle、Federation Trust → peer 元数据。**能力目录、工具目录与业务资源发现明确不在范围内**，与现 §1 out-of-scope 一致。发现机制应优先复用 HTTPS well-known 与既有命名空间模型；DID 与 Agent Name Service 等作为外部绑定，非规范性引用。

### 7. 治理变更

- `GOVERNANCE.md` 第 3 节“规范性文本”列表改为全部 `spec/part-*/`。
- 第 5 节版本策略增加“系列同步发版，各部分独立 `agent-iam-N-*` 标识”。
- 第 6 节 profile 规则保留：profile 只能在对应 Part 上收窄。
- RFC 流程不变，跨部分变更需列出受影响 Part。

### 8. 迁移与追溯

- 迁移期间保留单文档版本并标注“已由系列取代，迁移进行中”，避免丢失可审阅文本。
- 每部分建立“旧 §N → 新 Part M.N”追溯表。
- 参考实现映射（EIDOVELA/AEGIVELA）按 Part 重新对应。
- 迁移完成后删除单文档正文，更新所有链接。

## Impact

- Compatibility: 不兼容（文档结构、标识符与交叉引用变更）。规范要求内容不变，但位置与编号变化。
- Affected profiles: 全部，需重新归属到对应 Part。
- Affected reference implementations: 独立 Agent Registry 映射 Part 2；EIDOVELA 主要映射 Part 3/5 并消费 Part 2 记录；AEGIVELA 主要映射 Part 4/5/6。
- Security impact: 正面。认证/授权边界显式化，发现引入独立攻击面并由专门安全条款约束。
- Privacy impact: 中性。发现会新增元数据暴露面，需最小化与缓存上限约束。

## Alternatives considered

1. **保持单文档，仅在内部加章节标签。** 不解决独立演进与读者分离问题。
2. **拆成多仓库。** 版本对齐与双语编辑成本高，暂不采用。
3. **只拆认证/授权，注册发现并入 Part 1。** 注册与发现是独立读者与独立协议面，单独成部分更清晰。
4. **把联邦并入认证与授权。** 会导致两处重复且难以定义跨域撤销，故独立成部分。

## Unresolved questions

1. 各部分是否独立语义化版本，还是仅系列同步发版。
2. 发现是否在后续规范中定义具体 wire protocol（well-known 文档 schema、registry API）。
3. 系列与 `GB/Z 185` 部分编号是否做显式对齐。
4. 单文档迁移窗口期长度与删除条件。

## Decision

_Filled in by maintainers._
