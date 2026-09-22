[English](README.md) · [简体中文](README.zh-CN.md)

# 智能体身份与访问管理系列（Agent IAM Series）

面向 AI 智能体的身份、注册、发现、认证、授权、委托、联邦与审计的开放互操作系列标准。

- 系列标识：`agent-iam-series`
- 版本：`0.1.0-draft`
- 状态：**项目标准草案**，非国际标准、国家标准或行业标准
- 仓库：<https://github.com/AICTRI/agent-iam-spec>

> 迁移说明：此前的单文档版本（`spec/en/agent-iam-spec.md`、`spec/zh-CN/agent-iam-spec.md`）
> 正在拆分为下列各部分。迁移期间两个版本并存；各部分为目标规范性结构。
> 详见 `rfcs/0002-series-structure.md`。

## 各部分

| 部分 | 标识 | 标题 | 依赖 | 状态 |
|---|---|---|---|---|
| 1 | `agent-iam-1-architecture` | 总体架构与术语 | — | 草案（已编写） |
| 2 | `agent-iam-2-registration-discovery` | 智能体注册与发现 | 1 | 草案（已编写） |
| 3 | `agent-iam-3-authentication` | 智能体身份与认证 | 1, 2 | 草案（已编写） |
| 4 | `agent-iam-4-authorization` | 智能体授权与委托 | 1, 2, 3 | 草案（已编写） |
| 5 | `agent-iam-5-federation` | 跨域联邦与互操作 | 1, 3, 4 | 草案（已编写） |
| 6 | `agent-iam-6-audit` | 审计与安全事件 | 1 | 草案（已编写） |
| 7 | `agent-iam-7-conformance` | 一致性与测试 | 全部 | 草案（已编写） |

七个部分均承载规范性正文。原单文档版本仅为追溯保留，待各部分评审后删除。

## 语言

英文为规范性主文本，中文为等价翻译，供对照参考。两种语言冲突时以英文为准。

各部分以如下形式发布：

```text
part-0N-<slug>/
├── en/<part-file>.md        # 英文（主文本，规范性）
└── zh-CN/<part-file>.md     # 简体中文（翻译）
```

## 依赖规则

- 第 1 部分定义术语、可信数据来源、失败关闭、规范用语、canonical 化、撤销 freshness 词表和隐私原则。
- 第 2 部分定义命名、身份记录、生命周期、注册表与发现。
- 第 3 部分消费第 2 部分的记录，输出 `Verified Agent Identity Context`。
- 第 4 部分消费第 3 部分的上下文，且不得从调用方自报值重新推导身份。
- 第 5 部分引用第 3、4 部分接口实现跨域操作。
- 第 6 部分提供全部部分共用的安全事件 envelope。
- 第 7 部分定义各部分一致性与系列级组合 profile。

低编号部分不得依赖高编号部分。

## 许可证

- 规范文本：CC BY 4.0，见 [`../LICENSE`](../LICENSE)。
- Schema、代码与一致性工具：Apache-2.0，见 [`../LICENSE-CODE`](../LICENSE-CODE)。
