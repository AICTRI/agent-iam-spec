[English](README.md) · [简体中文](README.zh-CN.md)

# 智能体身份与访问管理系列（Agent IAM Series）

面向 AI Agent 标识、注册、发现、认证、授权、委托、生命周期、联邦与审计的开放互操作系列标准。

- 系列标识：`agent-iam-series`
- 版本：`0.1.0-draft`
- 状态：**项目草案**，非国际标准、国家标准或行业标准
- 仓库：<https://github.com/AICTRI/agent-iam-spec>

系列分为七个部分，部分划分与迁移状态见 [`spec/README.zh-CN.md`](spec/README.zh-CN.md)，重构决策见 [`rfcs/0002-series-structure.md`](rfcs/0002-series-structure.md)。

## 语言

本系列以英文为规范性主文本。中文文本为等价翻译，供对照参考。两种语言冲突时以英文为准。

| 文档 | 语言 | 路径 |
|---|---|---|
| 系列索引 | English | [`spec/README.md`](spec/README.md) |
| 系列索引（翻译） | 简体中文 | [`spec/README.zh-CN.md`](spec/README.zh-CN.md) |
| 第 1–7 部分（主文本，规范性） | English | `spec/part-0N-*/en/` |
| 第 1–7 部分（翻译） | 简体中文 | `spec/part-0N-*/zh-CN/` |

## 仓库结构

```text
agent-iam-spec/
├── README.md            # 英文（主）
├── README.zh-CN.md      # 中文
├── IMPLEMENTATIONS.md   # 参考实现（英文，主）
├── IMPLEMENTATIONS.zh-CN.md
├── GOVERNANCE.md
├── CONTRIBUTING.md
├── SECURITY.md
├── CHANGELOG.md
├── LICENSE              # 规范文本：CC BY 4.0
├── LICENSE-CODE         # Schema、代码与工具：Apache-2.0
├── spec/
│   ├── README.zh-CN.md  # 系列索引与部分划分
│   ├── part-01-architecture/{en,zh-CN}/
│   ├── part-02-registration-discovery/{en,zh-CN}/
│   ├── part-03-authentication/{en,zh-CN}/
│   ├── part-04-authorization/{en,zh-CN}/
│   ├── part-05-federation/{en,zh-CN}/
│   ├── part-06-audit/{en,zh-CN}/
│   └── part-07-conformance/{en,zh-CN}/
├── profiles/            # 规范性 Profile（收窄主规范）
├── schemas/             # JSON Schema、OpenAPI 与协议 Schema
├── conformance/         # 一致性测试向量与 fixture
├── mappings/            # 厂商与标准对齐（非规范性）
├── rfcs/                # 变更提案
└── examples/            # 端到端示例
```

## 相关标准状态

截至 2026-09-22：

- 尚无 ISO/IEC、IETF、W3C 或 OASIS 已发布的、专门定义端到端 Agent IAM 标识、凭据、委托、撤销和联邦互操作协议的单一标准。
- IETF WIMSE 文件（含 AIMS `draft-ietf-wimse-aims-00`）均为 Internet-Draft，不是 RFC。
- 中国已发布 `GB/Z 185.1-2026`、`GB/Z 185.2-2026`、`GB/Z 185.3-2026`《人工智能 智能体互联》。它们是国家标准化指导性技术文件，不是强制性 `GB`，也不同于推荐性 `GB/T`。

详见 [`mappings/`](mappings/)。

## 范围

包含：

- Agent 身份对象：Agent、Agent Instance、Authority Root、Authority Binding；
- 注册与身份发现；
- 生命周期状态机与 lifecycle epoch；
- Enrollment、工作负载证明与持钥证明；
- 身份 Token 与权威在线验证；
- Principal 模型与授权模式；
- Policy Decision、Execution Grant 与委托不可放大；
- 撤销分级与新鲜度；
- 联邦与主体隔离；
- 安全事件记录。

不包含：

- 大模型、规划器与提示词实现；
- 人类密码、MFA 与浏览器会话；
- 特定厂商 HSM、KMS、网关或服务网格实现；
- 产品目录与工作流数据模型；
- 全球统一 Agent ID 注册机构。

## 参考实现

| 组件 | 角色 |
|---|---|
| Agent Registry | Agent/Agent ID 注册权威：Authority Namespace、Authority Binding、生命周期权威、发现（规划中的独立系统） |
| [EIDOVELA](https://github.com/axisrobo/eidovela) | Agent 认证提供商：消费 Registry 记录；工作负载登记/证明、PoP 凭据、身份 Token、联邦 |
| [AEGIVELA](https://github.com/axisrobo/aegivela) | Agent 授权平面：Principal 解析、策略决策、Execution Grant、委托、撤销 |

仓库、组件协作与一致性状态见 [`IMPLEMENTATIONS.zh-CN.md`](IMPLEMENTATIONS.zh-CN.md)。

## 一致性

一致性按各部分定义声明，并由第 7 部分的系列组合 profile（`Identity`/`Authorization`/`Federated`）组合。一致性声明必须列出支持的部分与等级、proof Profile、Token/artifact 版本、撤销 SLO、发现机制、已知扩展以及未满足的条款。

参考实现映射记录在 [`mappings/`](mappings/)，不得用于替代规范。

## 许可证

- 规范文本：CC BY 4.0，见 [`LICENSE`](LICENSE)。
- Schema、代码与一致性工具：Apache-2.0，见 [`LICENSE-CODE`](LICENSE-CODE)。

## 贡献

见 [`CONTRIBUTING.md`](CONTRIBUTING.md) 与 [`GOVERNANCE.md`](GOVERNANCE.md)。安全问题请见 [`SECURITY.md`](SECURITY.md)。
