[English](../en/agent-iam-4-authorization.md) · [简体中文](agent-iam-4-authorization.md)

# 智能体身份与访问管理系列 — 第 4 部分：智能体授权与委托

- 系列标识：`agent-iam-series`
- 部分标识：`agent-iam-4-authorization`
- 版本：`0.1.0-draft`
- 日期：2026-09-22
- 状态：项目标准草案，非国际标准、国家标准或行业标准
- 许可证：CC BY 4.0（规范文本）

本部分规定如何将第 3 部分产出的 `Verified Agent Identity Context` 转化为可执行的执行授权。

本中文文本是英文文本的等价翻译，供对照参考。两种语言文本冲突时，以英文文本为准。

## 1. 范围

本部分规定：

- Principal 解析与授权模式；
- 有效权限；
- 策略决策与执行授权；
- 委托、Token Exchange、审批与预授权；
- PEP 和工具调用要求；
- 授权范围的撤销；
- 授权安全。

认证产物由第 3 部分规定。跨域联邦由第 5 部分规定。

## 2. 规范性引用

- 第 1 部分定义术语、身份不等于授权、canonical 化和撤销 freshness 词表。
- 第 3 部分定义 `Verified Agent Identity Context` 和授权模式的证明要求。
- 第 6 部分定义安全事件 envelope。

## 3. Principal 与授权模式

### 3.1 Principal 解析

授权系统必须从已验证的企业 IdP、Agent Identity Authority 记录、Workload Assertion 和授权上下文重建 Principal。客户端自报 Principal 只能作 comparison-only 输入。

### 3.2 授权模式

| Mode | 权威来源 |
|---|---|
| `human_web` | 人类 subject |
| `system_api` | 组织/系统根 |
| `delegated_api` | 人类 subject，服务为 actor |
| `service_agent_api` | 组织/系统根，Service Agent 为 actor |
| `twin_agent_api` | human master，Twin Agent 为 actor |

各模式的必需证明由第 3 部分第 6 节定义。

不同模式不得互相替代。Workload Token 不得冒充人类；Service Agent 不得声明 human master；Twin Agent 不得满足 system-only endpoint。

### 3.3 有效权限

有效权限必须是所有适用上限的交集：

```text
twin = master authority
       intersection agent envelope
       intersection workload grant
       intersection tool permission
       intersection requested authority
       intersection policy

service = organization authority
          intersection agent envelope
          intersection workload grant
          intersection requested authority
          intersection policy
```

缺失任何必需输入时必须拒绝。

## 4. Policy Decision 与 Execution Grant

### 4.1 唯一授权谱系

授权必须具有单一、可验证的谱系：

```text
verified principal
  -> canonical policy decision
  -> verified allow decision
  -> execution grant
  -> attenuated child grant
  -> PEP verification and effect
```

原始 bearer Token 只能建立身份上下文，不得单独作为 mint Execution Grant 的授权依据。

资源和安全关键引用的 digest 必须遵循第 1 部分第 6.2 节。

### 4.2 Decision

Decision 至少必须绑定：

- namespace 和 authorization mode；
- subject、actor、client、workload 和 authority root 中适用的字段；
- action 和不可变 resource identity/digest；
- normalized scope；
- audience；
- policy ID/version；
- lifecycle epoch；
- decision ID、issued-at 和 expiry；
- outcome 和 obligations。

只有 `allow` 可以派生 Execution Grant。`deny`、`approval_required`、`revoked` 和未知结果都必须阻断执行。

### 4.3 Grant

Execution Grant 应为短时、audience-bound 和 sender-constrained，并至少绑定 action、resource、scope、task、policy version、lifecycle epoch 和 parent lineage。PEP 必须在每个受保护效果前验证 Grant，而不是只在连接建立时验证。

## 5. 委托与 Token Exchange

### 5.1 不可放大

任何子授权必须满足：

```text
child.scope       subset-of parent.scope
child.audience    subset-of parent.audience
child.expires_at  <= parent.expires_at
child.task        equal-to-or-narrower-than parent.task
child.action      equal-to-or-narrower-than parent.action
child.resource    equal-to-or-narrower-than parent.resource
```

namespace、Authority Root 和不可变主体绑定不得在委托中改变。

衰减关系必须可判定且版本化：audience 必须规范化为精确字符串集合并执行集合子集；action 默认必须相等，除非 Profile 定义显式偏序；resource 必须使用类型化 canonical descriptor 和该类型的 containment function；task 必须使用不透明 `task_id` 或结构化约束，不得根据自然语言判断“更窄”。Decision 和 Grant 必须标识使用的 attenuation Profile 版本。

### 5.2 OAuth Token Exchange

使用 RFC 8693 时必须区分：

- 身份保持型 Token 派生；
- impersonation；
- delegation；
- Execution Grant 派生。

仅保持 identity、audience、expiry 和 PoP 的 exchange 不得被描述为完整授权委托。多级委托必须保留 actor/parent lineage，并由资源服务器执行权限衰减检查。

### 5.3 Approval 与 Pre-Authorization

Approval 必须绑定 namespace、approver、agent/actor、action、resource、scope、audience、reason digest、expiry 和 policy version。

Pre-Authorization 只能为已有权限提供限时、限额的使用窗口，不得提升权限。`max_grants`、`used_grants` 等配额更新必须原子且单调。

## 6. PEP 和工具调用

PEP 必须：

- 只接受适用于 endpoint 的 authorization mode 和 artifact type；
- 验证 signature、issuer、audience、expiry、namespace、PoP、resource digest、epoch 和 revocation；
- 执行全部 obligations 后才允许效果；
- 在长任务的 continuation boundary 重新检查授权和撤销；
- 对动作、目标主机、路径、工具 ID、skill hash 和实现摘要执行精确匹配；
- 不得把 Catalog 可见性、模型选择结果或自然语言计划当作授权。

凭证注入必须是显式 obligation，并绑定 `credential_ref` 或 class、目标、scope 和 expiry。凭证值本身不得进入 Decision、Grant、提示词或 evidence。LLM 不得访问 Agent 主身份私钥或下游服务凭证。

## 7. 撤销（授权范围）

撤销可以按 namespace-scoped selector 执行，包括：

- subject、session 或 authority root；
- Decision JTI、Grant JTI、Approval JTI；
- policy version；
- resource/implementation digest。

敏感 selector 应使用带域分离的摘要持久化。撤销检查必须使用第 1 部分第 6.3 节定义的 freshness 等级。撤销依赖不可用时必须拒绝。离线或降级模式不得用于 credential injection、权限扩大、新目标或高风险破坏性动作。

## 8. 安全考虑

### 8.1 Confused Deputy

身份 Token 必须精确绑定 audience；授权 Token 和 Execution Grant 必须进一步精确绑定 action、resource 和 task。不得使用 wildcard、prefix 或大小写不敏感方式匹配安全关键 audience。

### 8.2 Prompt Injection

自然语言、模型输出和工具返回值均为不可信输入。它们不得：

- 选择 namespace 或 Authority Root；
- 修改 Agent class、epoch 或 policy version；
- 读取主身份密钥或服务凭证；
- 绕过 PEP；
- 扩大 parent grant。

## 附录 A. 迁移来源（参考）

| 现条款 | 映射到本部分 |
|---|---|
| §11 Principal 与授权模式 | 第 3 节 |
| §12 Policy Decision 与 Execution Grant | 第 4 节 |
| §13 委托与 Token Exchange | 第 5 节 |
| §14 PEP 和工具调用 | 第 6 节 |
| §15（decision/grant/approval selector） | 第 7 节 |
| §18.2 confused deputy、§18.3 prompt injection | 第 8 节 |
