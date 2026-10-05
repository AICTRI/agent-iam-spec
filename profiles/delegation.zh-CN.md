# Profile：委托与 Token Exchange

- Profile 标识：`agent-iam-profile-delegation`
- 适用：第 4 部分 `agent-iam-4-authorization`
- 系列版本：`0.4.1-draft`
- 状态：草案（发布后具规范性）
- 语言：英文为规范性主文本；本文件为等价翻译。

本 Profile 收窄第 4 部分第 5 节（委托、Token exchange、Approval、Pre-Authorization），并依赖 `authorization` Profile。不得放宽第 4 部分任何 `MUST`/`MUST NOT`。

## 1. 范围

定义使委托可判定、可版本化的衰减关系，身份保持、模拟、委托与 Execution Grant 派生的区分，OAuth 2.0 token exchange 绑定，以及 Approval / Pre-Authorization。

## 2. 衰减关系

任一子授权 MUST 满足：

```text
child.scope       subset-of parent.scope
child.audience    subset-of parent.audience
child.expiresAt  <= parent.expiresAt
child.task        equal-to-or-narrower-than parent.task
child.action      equal-to-or-narrower-than parent.action
child.resource    equal-to-or-narrower-than parent.resource
```

委托过程中 namespace、Authority Root 与不可变 Principal 绑定 MUST NOT 改变。任一维度放大的子 artifact MUST 在签发前拒绝。

## 3. 可判定性与版本化

衰减关系 MUST 可判定且版本化：

- **audience** MUST 规范化为精确字符串集合并做集合子集运算；
- **action** 默认 MUST 相等，除非本 Profile 定义显式偏序；
- **resource** MUST 使用有类型规范描述符及该类型的包含函数；`structuredResourceDigest` MUST 按第 1 部分 §6.2 计算；
- **task** MUST 使用不透明 `taskId` 或结构化约束；"更窄" MUST NOT 依据自然语言判定；
- Decision 与 Grant MUST 标识所用衰减 Profile 的版本。

子 Principal 身份（namespace、`authorityBindingRef`、双 epoch、instance）MUST 从已验证父级保持；委托 MUST NOT 重新指向身份。

## 4. OAuth Token Exchange

采用 RFC 8693 时，MUST 区分：

- 身份保持的 Token 派生；
- 模拟；
- 委托；
- Execution Grant 派生。

仅保持身份、audience、expiry 与 PoP 的 exchange MUST NOT 表述为完整授权委托。多级委托 MUST 保持 actor/父谱系，资源服务器 MUST 执行权限衰减检查。exchange 服务 MUST NOT 合成 `allow` 决策；grant MUST 从已验证的规范 allow 决策派生。

## 5. Approval

Approval MUST 绑定 namespace、approver、agent/actor、action、resource、scope、audience、reason digest、expiry 与 policy version。绑定结构化资源时，Approval MUST 同时携带 `structuredResourceDigest` 与 `descriptorVersion`。审批 artifact MUST 仍受权威 `approvalJti` 撤销检查约束，MUST NOT 绕过。

## 6. Pre-Authorization

Pre-Authorization 仅为既有权限提供时间受限、配额受限的使用窗口，MUST NOT 提升权限。`maxGrants`、`usedGrants` 等配额更新 MUST 原子且单调。

## 7. 一致性

- `../conformance/part-04-authorization/delegation-non-amplification.positive.json`
- `../conformance/part-04-authorization/delegation-non-amplification.negative.json`
- `../conformance/cross-repo/part-04-authorization/p4-delegation-non-amplification.json`
- `../conformance/cross-repo/part-04-authorization/p4-approval-binding.json`

声明本 Profile 的实现 MUST 通过以上全部向量。

## 8. 引用

- RFC 8693 — OAuth 2.0 Token Exchange（标准轨）。
- 第 1 部分 §6.2 canonical 化。
- 第 4 部分 §4、§5；`authorization` Profile。
