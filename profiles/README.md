# Profiles

本目录承载 `agent-iam-spec` 的规范性 Profile。Profile 只能收窄或细化主规范要求，不得放宽 `spec/` 中的强制条款。

## 规划中的 Profile

| Profile | 覆盖范围 | 状态 |
|---|---|---|
| `identity-token.md` | 身份 Token 的 claim、`typ`、受众和验证 | 待编写 |
| `enrollment.md` | Enrollment challenge、JWT proof、attestation 三阶段 | 待编写 |
| `authorization.md` | Principal、authorization mode、PDP Decision | 待编写 |
| `delegation.md` | Token exchange、衰减算法、Approval、Pre-Authorization | 待编写 |
| `federation.md` | Federation Trust、联邦验证、主体隔离 | 待编写 |
| `audit.md` | 安全事件记录的最小事件和字段 | 待编写 |

## Profile 编写要求

每个 Profile 必须：

- 声明适用的主规范版本；
- 列出新增或收窄的强制条款；
- 定义可判定的数据结构和规范化算法；
- 提供一致性和否定测试向量；
- 标注与 Internet-Draft 的关系，且不得把草案当作 RFC。

## 状态

当前尚未发布任何 Profile。主规范 `spec/zh-CN/agent-iam-spec.md` 与 `spec/en/agent-iam-spec.md` 为唯一规范性文本。
