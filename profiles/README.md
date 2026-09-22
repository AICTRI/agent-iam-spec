# Profiles

本目录承载 Agent IAM 系列的规范性 Profile。Profile 只能收窄或细化其所扩展部分的强制条款，不得放宽。

## 规划中的 Profile

| Profile | 所扩展的 Part | 覆盖范围 | 状态 |
|---|---|---|---|
| `identity-token.md` | Part 3 `agent-iam-3-authentication` | 身份 Token 的 claim、`typ`、受众和验证 | 待编写 |
| `enrollment.md` | Part 3 `agent-iam-3-authentication` | Enrollment challenge、JWT proof、attestation 三阶段 | 待编写 |
| `authorization.md` | Part 4 `agent-iam-4-authorization` | Principal、authorization mode、PDP Decision | 待编写 |
| `delegation.md` | Part 4 `agent-iam-4-authorization` | Token exchange、衰减算法、Approval、Pre-Authorization | 待编写 |
| `federation.md` | Part 5 `agent-iam-5-federation` | Federation Trust、联邦验证、主体隔离 | 待编写 |
| `audit.md` | Part 6 `agent-iam-6-audit` | 安全事件记录的最小事件和字段 | 待编写 |

## Profile 编写要求

每个 Profile 必须：

- 声明适用的主规范版本；
- 列出新增或收窄的强制条款；
- 定义可判定的数据结构和规范化算法；
- 提供一致性和否定测试向量；
- 标注与 Internet-Draft 的关系，且不得把草案当作 RFC。

## 状态

当前尚未发布任何 Profile。规范性文本为 `spec/part-*/en/` 与 `spec/part-*/zh-CN/`（见 `spec/README.zh-CN.md`）。每个 Profile 必须声明其扩展的 Part 标识与系列版本。
