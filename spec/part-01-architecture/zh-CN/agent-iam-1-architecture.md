[English](../en/agent-iam-1-architecture.md) · [简体中文](agent-iam-1-architecture.md)

# 智能体身份与访问管理系列 — 第 1 部分：总体架构与术语

- 系列标识：`agent-iam-series`
- 部分标识：`agent-iam-1-architecture`
- 版本：`0.1.0-draft`
- 日期：2026-09-22
- 状态：项目标准草案，非国际标准、国家标准或行业标准
- 许可证：CC BY 4.0（规范文本）

本部分是 Agent IAM 系列的框架。其他部分引用本部分定义的术语、规则和原则。

本中文文本是英文文本的等价翻译，供对照参考。两种语言文本冲突时，以英文文本为准。

## 1. 范围

Agent IAM 系列规定自主或半自主软件 Agent 的标识、注册、发现、认证、授权、委托、联邦和审计要求。它适用于私有云、混合云、多组织平台以及 Agent 调用模型、工具、服务和其他 Agent 的场景。

本部分（第 1 部分）规定：

- 系列结构以及各部分之间的依赖规则；
- 全部部分共用的术语；
- Agent IAM 系统的分层与平面边界；
- 可信数据来源与失败关闭原则；
- 横切的安全、canonical 化、撤销 freshness 和隐私原则。

系列不规定：

- 大模型、规划器或提示词的实现；
- 人类用户密码、MFA 和浏览器会话的实现；
- 特定厂商的 HSM、KMS、网关或服务网格；
- Agent 能力、工具或业务资源目录（含能力发现）；
- 全球统一的 Agent ID 注册机构。

## 2. 系列结构与依赖

| 部分 | 标识 | 标题 | 依赖 |
|---|---|---|---|
| 1 | `agent-iam-1-architecture` | 总体架构与术语 | — |
| 2 | `agent-iam-2-registration-discovery` | 智能体注册与发现 | 1 |
| 3 | `agent-iam-3-authentication` | 智能体身份与认证 | 1, 2 |
| 4 | `agent-iam-4-authorization` | 智能体授权与委托 | 1, 2, 3 |
| 5 | `agent-iam-5-federation` | 跨域联邦与互操作 | 1, 3, 4 |
| 6 | `agent-iam-6-audit` | 审计与安全事件 | 1 |
| 7 | `agent-iam-7-conformance` | 一致性与测试 | 全部 |

规则：

- 低编号部分不得依赖高编号部分。
- 第 3 部分消费第 2 部分定义的记录，并输出第 3 部分定义的 `Verified Agent Identity Context`。
- 第 4 部分必须消费该上下文，不得从调用方自报值重新推导 namespace、Agent class、lifecycle epoch 或工作负载身份。
- 第 5 部分必须引用第 3、4 部分接口，不得重新定义。
- 全部部分必须使用第 6 部分定义的安全事件 envelope。

## 3. 规范性用语

本系列规范词的强度对应 BCP 14（RFC 2119 与 RFC 8174）：“必须”和“不得”表示绝对要求；“应”“不应”“应该”和“不应该”表示存在有效例外时才可偏离的推荐要求；“可以”和“可选”表示允许选择。英文 “MUST”“MUST NOT”“SHOULD”“SHOULD NOT”“MAY”“OPTIONAL” 具有相同的规范含义。只有这些词用作要求谓词时具有规范含义。标记为“说明”“示例”或“参考”的内容不具有规范性。

## 4. 术语

### 4.1 Agent Identity

长期、逻辑上的 Agent 主体。它独立于进程、容器、Pod、虚拟机、设备或某次运行实例。

### 4.2 Agent Identifier

由身份权威分配给 Agent Identity 的稳定、不透明标识符。标识符本身不构成认证证明或执行授权。

### 4.3 Agent Instance

Agent Identity 在特定运行环境中的实例化。一个 Agent 可以先后或同时具有多个实例。

### 4.4 Authority Root

用于确定 Agent 授权上限和治理归属的已验证主体引用。它是人类主体或组织/系统主体，不表示对法律责任归属作出判断。

### 4.5 Authority Binding

Agent Identity 与 Authority Root 之间的一对一、不可变绑定。

### 4.6 Workload Identity

对具体运行实例、设备或部署环境的身份表示。SPIFFE ID、Kubernetes ServiceAccount 身份或经验证的 mTLS 客户端证书可以作为 Workload Identity，但不自动成为逻辑 Agent ID。

### 4.7 Identity Credential

将 Agent Identifier 或 Workload Identity 与密码学密钥绑定的凭据。

### 4.8 Enrollment

依据注册记录、工作负载证明和密钥持有证明，为 Agent Instance 建立可信绑定的过程。

### 4.9 Lifecycle Epoch

随每次安全相关生命周期转换严格递增的整数，用于使旧凭据和授权产物失效。

### 4.10 Subject、Actor、Client 与 Workload

- `subject`：其权限允许某效果发生的主体；
- `actor`：直接发起请求的人、Agent 或工作负载；
- `client`：注册应用或 OAuth client；
- `workload`：证明调用方具体运行实例的身份。

这些角色语义不同，不得压缩为单一的 service account 字段。

### 4.11 Policy Decision

策略决策点对可信 Principal、动作、资源和上下文产生的版本化结果。

### 4.12 Execution Grant

由已验证的 `allow` 决策派生的、短时、受众绑定、资源绑定、任务绑定且可撤销的执行授权。

### 4.13 PEP 与 PDP

- PDP：Policy Decision Point，策略决策点；
- PEP：Policy Enforcement Point，在效果发生前验证并执行决策和约束。

### 4.14 Namespace

由某一主体控制、可委托、全局可寻址的标识作用域，用于在组织生态中对主体和 Agent 命名。Namespace 必须有稳定、可精确比较的 canonical 表示，通常是部署方控制的 HTTPS URI。

### 4.15 Authority Namespace

组织、客户、合作伙伴或供应商主体控制的根 Namespace。它可以包含零到多层组织内划分（子 Namespace），并由该主体委托管理。Authority Namespace 是跨域身份的全局命名锚点。

### 4.16 Organization Unit

Authority Namespace 内的一层划分，例如部门、事业部、项目或环境。Organization Unit 通过命名空间层级表达，不需要独立的扁平标识。

### 4.17 Registration

在注册表中创建并记录 Agent Identity、其 Authority Binding 以及允许的 Workload Registration 的过程。注册由第 2 部分规定。

### 4.18 Discovery

将 Authority Namespace 或 Agent Identifier 解析为受信元数据的过程：签发权威、注册表端点、验证密钥和联邦信任配置。发现由第 2 部分规定。

### 4.19 Authentication

通过持钥证明和工作负载证明，建立调用方是某一 lifecycle epoch 下特定 Agent Identity 或 Agent Instance 的过程。认证由第 3 部分规定。

### 4.20 Authorization

判定已验证主体是否可对特定资源执行特定动作，并派生可执行、可衰减的执行授权的过程。授权由第 4 部分规定。

## 5. 体系结构

### 5.1 分层

Agent IAM 应至少分为以下逻辑层：

```text
企业人类 IdP / 组织权威
          |
          v
注册与发现：Agent 注册、Authority Binding、命名空间与标识、生命周期、发现
          |
          v
认证：工作负载 Enrollment、证明、PoP 凭据、身份 Token、权威在线验证
          |
          v
授权：Principal 解析、PDP、审批、委托、Execution Grant、撤销
          |
          v
PEP:      API Gateway、Tool Gateway、模型入口、业务服务、执行器
```

### 5.2 平面边界

- 注册与发现（第 2 部分）分配并解析名称，不签发凭据。
- 认证（第 3 部分）产出 `Verified Agent Identity Context`。身份凭据证明谁在调用以及当前身份状态。
- 授权（第 4 部分）消费已验证上下文。身份凭据不得被直接解释为“允许执行该动作”。执行授权必须由授权平面独立决定。
- PEP 必须在每个受保护效果前验证授权产物，而不是只在连接建立时验证。

### 5.3 可信数据来源

下列值必须由可信来源解析，不得接受调用方覆盖：

- `namespace`（Authority Namespace）及其 canonical 表示；
- Authority Root；
- Agent class；
- lifecycle state 和 epoch；
- Workload Registration 和 selector；
- policy version；
- revocation state。

请求中携带的同名字段最多用于一致性比较；不一致时必须拒绝。

### 5.4 失败关闭

身份、策略、证明、密钥、生命周期、发现或撤销依赖不可用时，系统必须失败关闭。不得把超时、未知状态、解析失败或 `approval_required` 解释为允许。

## 6. 横切原则

### 6.1 身份不等于授权

身份 Token 只建立身份上下文。原始 bearer Token 不得单独作为 mint Execution Grant 的授权依据。只有已验证的 `allow` 决策可以派生 Execution Grant。

### 6.2 Canonical 化与摘要

安全关键引用和摘要必须固定规范化算法、字符编码、hash 算法、域分离标签和 Profile 版本。基础结构为：

```text
SHA-256("agent-iam:<object-type>:<profile-version>\x00" || canonical_bytes)
```

每类 resource、subject、reason 和 implementation 必须定义 `canonical_bytes`。JSON 类型默认必须使用 RFC 8785 JCS 的 UTF-8 输出。不得根据未规范化 JSON、自然语言或平台相关路径直接计算安全摘要。

### 6.3 撤销 freshness 词表

授权产物按以下 freshness 等级之一检查：

| Class | 要求 |
|---|---|
| `pre_dispatch` | 效果前权威检查，不得使用 negative cache |
| `continuation` | 长任务每个外部效果边界检查，不得使用 negative cache |
| `connection` | 可使用有界 negative cache，不得超过 artifact 剩余寿命 |

撤销依赖不可用时必须拒绝。离线或降级模式不得用于 credential injection、权限扩大、新目标或高风险破坏性动作。具体撤销 selector 由拥有该产物的部分（第 3、4 或 5 部分）定义。

### 6.4 禁止调用方覆盖

任何调用方提交值、模型输出、自然语言指令或工具返回值都不得选择或覆盖第 5.3 节定义的受信值。

## 7. 安全与隐私

### 7.1 通用安全原则

- 重放保护必须使用短时 nonce 或 JTI，并在适当作用域内原子消费。
- audience、action、resource 和 task 绑定必须精确；安全关键值不得使用 wildcard、prefix 或大小写不敏感匹配。
- Verifier 必须在语义处理前拒绝重复 JSON member、未知关键 claim、算法降级、未知 `kid`、超限 artifact 和不规范资源表示。
- 管理 API（注册、Blueprint、Workload Registration、Trust Domain、Federation Trust、密钥轮换和 DLQ redrive）必须经过强认证和细粒度授权。仅依赖网络位置或共享 internal token 不足以构成高保证管理面。

### 7.2 隐私要求

- Agent ID 应为不透明 pseudonymous identifier；
- 跨 trust domain 不应无必要复用稳定关联标识；
- Twin 的 `master_id` 只应向确有授权需要的组件披露；
- 外部展示和审计导出应优先使用受控 reference 或 digest；
- 数据保留期限应按事件类型、监管目的和最小化原则设定；
- 联邦 claim mapping 应执行白名单，不得透传全部上游 claim。

## 8. 一致性模型

各部分定义自身的一致性要求。第 7 部分定义各部分一致性等级与系列级组合 profile。一致性声明必须列出支持的部分、proof Profile、Token/artifact 版本、撤销 SLO 和已知扩展，不得仅声称“兼容 Agent IAM”。

## 9. 已发布参考文献

- RFC 2119, Key words for use in RFCs to Indicate Requirement Levels.
- RFC 3986, Uniform Resource Identifier (URI): Generic Syntax.
- RFC 5280, Internet X.509 Public Key Infrastructure Certificate and CRL Profile.
- RFC 7519, JSON Web Token (JWT).
- RFC 7523, JSON Web Token (JWT) Profile for OAuth 2.0 Client Authentication and Authorization Grants.
- RFC 7638, JSON Web Key (JWK) Thumbprint.
- RFC 7662, OAuth 2.0 Token Introspection.
- RFC 8174, Ambiguity of Uppercase vs Lowercase in RFC 2119 Key Words.
- RFC 8446, The Transport Layer Security (TLS) Protocol Version 1.3.
- RFC 8693, OAuth 2.0 Token Exchange.
- RFC 8705, OAuth 2.0 Mutual-TLS Client Authentication and Certificate-Bound Access Tokens.
- RFC 8785, JSON Canonicalization Scheme (JCS).
- RFC 9334, Remote ATtestation procedureS (RATS) Architecture.
- RFC 9396, OAuth 2.0 Rich Authorization Requests.
- RFC 9421, HTTP Message Signatures.
- RFC 9449, OAuth 2.0 Demonstrating Proof of Possession (DPoP).
- RFC 9493, Subject Identifiers for Security Event Tokens.
- RFC 9562, Universally Unique IDentifiers (UUIDs).
- RFC 9635, Grant Negotiation and Authorization Protocol (GNAP).
- RFC 9700, Best Current Practice for OAuth 2.0 Security.
- RFC 9711, The Entity Attestation Token (EAT).
- ISO/IEC 24760-1:2019, A framework for identity management — Terminology and concepts.
- ISO/IEC 29115:2013, Entity authentication assurance framework.
- OASIS XACML Version 3.0.
- W3C DID Core 1.0.
- W3C Verifiable Credentials Data Model 2.0.
- GB/Z 185.1-2026, 人工智能 智能体互联 第1部分：总体架构。
- GB/Z 185.2-2026, 人工智能 智能体互联 第2部分：身份码。
- GB/Z 185.3-2026, 人工智能 智能体互联 第3部分：身份管理。

## 10. 参考性资料

以下不是已发布标准，不得作为标准引用：

- `draft-ietf-wimse-aims-00`, AI Identity Management System；
- `draft-ietf-wimse-arch-08`, WIMSE Architecture；
- `draft-ietf-wimse-identifier-03`, Workload Identifier；
- `draft-ietf-wimse-workload-creds-02`, WIMSE Workload Credentials；
- `draft-ietf-wimse-wpt-02`, WIMSE Workload Proof Token；
- `draft-ietf-wimse-mutual-tls-02`, Workload Authentication Using Mutual TLS；
- `draft-ietf-wimse-http-signature-07`, Workload-to-Workload Authentication with HTTP Signatures；
- `draft-ietf-wimse-workload-identity-practices-06`, Workload Identity Practices；
- `draft-narajala-courtney-ansv2-01`, Agent Name Service v2；
- `draft-hardt-oauth-aauth-protocol-10`, AAuth Protocol；
- `draft-sharif-agent-identity-framework-01`, Agent Identity Framework；
- `draft-wahl-scim-agent-schema-01`, SCIM Agentic Identity Schema。

状态核验入口：

- IETF WIMSE：<https://datatracker.ietf.org/wg/wimse/documents/>
- 国家标准信息公共服务平台：<https://std.samr.gov.cn/>

## 11. 待讨论事项

1. 系列各部分采用同步发版还是独立语义化版本；
2. 是否在后续修订中定义发现的 wire protocol；
3. 部分编号是否与 `GB/Z 185` 做显式对齐；
4. 单文档迁移窗口期长度与删除条件。
