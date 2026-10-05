# AgentIAM Profiles

本目录承载 **AgentIAM**（Agent IAM 系列）的规范性 Profile。Profile 只能收窄或细化其所扩展部分的强制条款，不得放宽。Profile 是规范性文本（见 `GOVERNANCE.md` §3、§6）。

## Profiles

| Profile | 标识 | 所扩展的 Part | 覆盖范围 | 状态 |
|---|---|---|---|---|
| [`identity-token.md`](identity-token.md) · [中文](identity-token.zh-CN.md) | `agent-iam-profile-identity-token` | Part 3 `agent-iam-3-authentication` | 身份 Token 的 `typ`、claim、签发与验证、撤销新鲜度 | 草案（已编写） |
| [`enrollment.md`](enrollment.md) · [中文](enrollment.zh-CN.md) | `agent-iam-profile-enrollment` | Part 3 `agent-iam-3-authentication` | Enrollment challenge、JWT PoP proof、三阶段 attestation、凭据 generation | 草案（已编写） |
| [`authorization.md`](authorization.md) · [中文](authorization.zh-CN.md) | `agent-iam-profile-authorization` | Part 4 `agent-iam-4-authorization` | Principal、authorization mode、Decision、Grant、PEP obligation、撤销 | 草案（已编写） |
| [`delegation.md`](delegation.md) · [中文](delegation.zh-CN.md) | `agent-iam-profile-delegation` | Part 4 `agent-iam-4-authorization` | 不可放大关系、衰减版本化、Token exchange、Approval、Pre-Authorization | 草案（已编写） |
| [`federation.md`](federation.md) · [中文](federation.zh-CN.md) | `agent-iam-profile-federation` | Part 5 `agent-iam-5-federation` | Federation Trust、主体隔离、联邦验证、trust 撤销、证据关联 | 草案（已编写） |
| [`audit.md`](audit.md) · [中文](audit.zh-CN.md) | `agent-iam-profile-audit` | Part 6 `agent-iam-6-audit` | 最小事件、最小字段、数据最小化、事务与 outbox | 草案（已编写） |

每个 Profile 声明其标识、扩展的 Part 标识、适用的系列版本（当前 `0.3.0-draft`）、所收窄的强制条款、可判定结构、规范性引用与一致性向量。

## Profile 编写要求

每个 Profile 必须：

- 声明适用的主规范版本；
- 列出新增或收窄的强制条款；
- 定义可判定的数据结构和规范化算法；
- 提供一致性和否定测试向量；
- 标注与 Internet-Draft 的关系，且不得把草案当作 RFC。

## 状态

六个 Profile 均已作为草案发布（normative when published），全部声明适用系列版本 `0.3.0-draft`。规范性主文本为 `spec/part-*/en/` 与 `spec/part-*/zh-CN/`（见 `spec/README.zh-CN.md`）。一致性向量位于 `conformance/`，可执行跨仓 fixtures 位于 `conformance/cross-repo/`。
