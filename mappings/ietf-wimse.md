# IETF WIMSE 对齐说明

状态：工作草案对齐，非规范性  
更新日期：2026-09-22

## 1. 状态声明

IETF WIMSE 工作组文件均为 Internet-Draft，不是 RFC。它们**不得**被引用为已发布标准。使用时应固定版本，并声明可能不兼容后续修订。

## 2. 相关文件

| 文档 | 标题 | 状态 |
|---|---|---|
| `draft-ietf-wimse-aims-00` | AI Identity Management System | WG Internet-Draft |
| `draft-ietf-wimse-arch-08` | WIMSE Architecture | WG Internet-Draft |
| `draft-ietf-wimse-identifier-03` | Workload Identifier | WG Internet-Draft |
| `draft-ietf-wimse-workload-creds-02` | WIMSE Workload Credentials | WG Internet-Draft |
| `draft-ietf-wimse-wpt-02` | WIMSE Workload Proof Token | WG Internet-Draft |
| `draft-ietf-wimse-mutual-tls-02` | Workload Authentication Using Mutual TLS | WG Internet-Draft |
| `draft-ietf-wimse-http-signature-07` | Workload-to-Workload Authentication with HTTP Signatures | WG Internet-Draft |
| `draft-ietf-wimse-workload-identity-practices-06` | Workload Identity Practices | 已提交 IESG，仍非 RFC |

入口：<https://datatracker.ietf.org/wg/wimse/documents/>

## 3. 与 agent-iam-spec 的关系

| WIMSE 概念 | agent-iam-spec 对应 | 说明 |
|---|---|---|
| Agent as workload | Agent Identity + Agent Instance | 规范将长期身份与运行实例显式分离 |
| Workload Identifier | Workload ID（第 6.1 节） | 规范不将 Workload ID 等同于逻辑 Agent ID |
| WIT / WIC | Identity Credential（第 10 节） | 规范要求 PoP，未强制具体凭据格式 |
| WPT | Token 请求 proof / PoP Profile（第 10.2 节） | 规范要求请求级 PoP |
| Agent Authorization | Principal、Decision、Grant（第 11-13 节） | 规范要求 canonical allow lineage |
| Agent audit record | 安全事件记录（第 17 节） | 规范强调脱敏和事务一致性 |

## 4. 采用建议

- 需要应用层 PoP 时，优先对齐 WIMSE WPT 或 HTTP Message Signatures Profile；
- 需要标识互操作时，可采用 WIMSE Identifier，但保留独立 Agent Identity 语义；
- 跟踪 AIMS 演进，避免将草案行为写入规范强制条款。
