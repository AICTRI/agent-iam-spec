[English](README.md) · [简体中文](README.zh-CN.md)

# Agent IAM 规范

面向 AI Agent 标识、认证、授权、委托、生命周期、联邦与审计的开放互操作规范。

- 规范标识：`agent-iam-spec`
- 版本：`0.1.0-draft`
- 状态：**项目草案**，非国际标准、国家标准或行业标准
- 仓库：<https://github.com/AICTRI/agent-iam-spec>

## 语言

本规范以英文为主。中文文本为等价翻译，供对照参考。

| 文档 | 语言 | 路径 |
|---|---|---|
| 规范（主文本，规范性） | English | [`spec/en/agent-iam-spec.md`](spec/en/agent-iam-spec.md) |
| 规范（翻译） | 简体中文 | [`spec/zh-CN/agent-iam-spec.md`](spec/zh-CN/agent-iam-spec.md) |

两种语言文本冲突时，以英文文本为准，中文文本视为需要修复的缺陷。

## 仓库结构

```text
agent-iam-spec/
├── README.md            # 英文（主）
├── README.zh-CN.md      # 中文
├── GOVERNANCE.md
├── CONTRIBUTING.md
├── SECURITY.md
├── CHANGELOG.md
├── LICENSE              # 规范文本：CC BY 4.0
├── LICENSE-CODE         # Schema、代码与工具：Apache-2.0
├── spec/
│   ├── en/              # 英文规范文本（主）
│   └── zh-CN/           # 中文翻译
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

## 一致性

一致性按规范定义的 Level 1、2、3 声明。一致性声明必须列出支持的 Level、proof Profile、Token/Profile 版本、撤销 SLO、已知扩展以及未满足的条款。

参考实现映射记录在 [`mappings/`](mappings/)，不得用于替代规范。

## 许可证

- 规范文本：CC BY 4.0，见 [`LICENSE`](LICENSE)。
- Schema、代码与一致性工具：Apache-2.0，见 [`LICENSE-CODE`](LICENSE-CODE)。

## 贡献

见 [`CONTRIBUTING.md`](CONTRIBUTING.md) 与 [`GOVERNANCE.md`](GOVERNANCE.md)。安全问题请见 [`SECURITY.md`](SECURITY.md)。
