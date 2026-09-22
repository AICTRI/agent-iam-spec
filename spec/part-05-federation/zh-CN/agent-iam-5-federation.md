[English](../en/agent-iam-5-federation.md) · [简体中文](agent-iam-5-federation.md)

# 智能体身份与访问管理系列 — 第 5 部分：跨域联邦与互操作

- 系列标识：`agent-iam-series`
- 部分标识：`agent-iam-5-federation`
- 版本：`0.1.0-draft`
- 日期：2026-09-22
- 状态：项目标准草案，非国际标准、国家标准或行业标准
- 许可证：CC BY 4.0（规范文本）

本部分规定不同 Authority Namespace 的 Agent 与主体如何互操作。它引用第 3、4 部分接口，不重新定义。

本中文文本是英文文本的等价翻译，供对照参考。两种语言文本冲突时，以英文文本为准。

## 1. 范围

本部分规定：

- Federation Trust 配置；
- peer 命名空间保留与主体隔离；
- Brokered Token；
- 联邦验证；
- 信任撤销；
- 跨域 evidence correlation；
- 联邦安全。

## 2. 规范性引用

- 第 1 部分定义术语、失败关闭和撤销 freshness 词表。
- 第 2 部分定义发现与 Authority Namespace。
- 第 3 部分定义身份 Token。
- 第 4 部分定义授权谱系与撤销。
- 第 6 部分定义安全事件 envelope 与跨域关联。

## 3. Federation Trust

Federation Trust 必须 namespace-scoped，并至少规定：

- peer issuer；
- JWKS URI 或 trust bundle；
- allowed audiences；
- claim mapping；
- PoP 要求；
- trust status；
- key refresh 和失败关闭策略。

Peer claim 不得指定或覆盖本地 namespace。

联邦 metadata/JWKS 获取必须限制为 HTTPS（明确的本地开发例外除外），并执行 host/scheme allowlist、DNS/IP 再验证、redirect 限制、响应大小限制、连接和读取超时、内容类型检查以及未知 `kid` 刷新限速。必须拒绝 loopback、link-local、云 metadata 地址和未经批准的私网目标，以防 SSRF；stale key 的最长可用时间必须有上限。

## 4. 主体隔离

Federated Principal 不得自动合并为本地 Agent Identity。Brokered Principal 必须使用不会与本地 Agent ID 冲突的命名空间，必须保留其来源 Authority Namespace，不得把 peer Namespace 压平为另一个 Namespace，并明确其没有本地 Agent epoch 时的撤销语义。

## 5. 联邦验证

联邦验证必须同时检查 trust status、signature、known `kid`、issuer、audience、time、PoP 和 claim mapping。Brokered Token 的在线验证必须根据其 trust/version reference 重新检查对应 Federation Trust；仅等待本地 Token 到期不满足此要求。

## 6. 信任撤销

禁用 trust 后，下一次权威在线验证必须失败关闭。信任撤销必须使用第 1 部分第 6.3 节定义的 freshness 等级。trust 或 key 依赖不可用时，验证必须失败关闭。

## 7. 跨域 evidence correlation

不同 Authority Namespace 产生的安全事件应能通过 `trace_id` 和受控引用关联，且不披露不必要的标识。关联不得要求把 federated principal 合并为本地 Agent Identity。

## 8. 安全考虑

- 发现与 peer 元数据获取复用第 2 部分第 8.4 节和本部分第 3 节的 SSRF 防御。
- Brokered Token 不得伪造本地 `agent_class`、`instance_id`、`workload_id`、`authority_root_ref` 或 lifecycle epoch（第 3 部分第 5.1 节）。
- trust-disable 在线撤销为强制要求；本地 Token 到期不是可接受的替代。

## 附录 A. 迁移来源（参考）

| 现条款 | 映射到本部分 |
|---|---|
| §16.1 Federation Trust | 第 3、8 节 |
| §16.2 主体隔离 | 第 4 节 |
| §16.3 联邦验证 | 第 5–6 节 |
| §15（Federation Trust 撤销） | 第 6 节 |
| §17.4 evidence 关联 | 第 7 节 |
