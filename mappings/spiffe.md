# SPIFFE / SPIRE 对齐说明

状态：生态对齐，非规范性  
更新日期：2026-09-22

## 1. 状态声明

SPIFFE 是 CNCF 生态下的开放工作负载身份规范，不是 IETF RFC 或 ISO 标准。它适合为运行中的 Agent 建立工作负载身份，但不表达模型版本、委托人、任务、能力或法律责任主体。

规范入口：<https://spiffe.io/docs/latest/spiffe-specs/>

## 2. 标识关系

SPIFFE ID 形式为：

```text
spiffe://<trust-domain>/<path>
```

`agent-iam-spec` 规定：SPIFFE ID 是 Workload Identity 的一种，**不得**默认等同于逻辑 Agent ID。逻辑 Agent 与 SPIFFE ID 可以是一对多或多代绑定。

```text
Agent Identity 1 --- n Agent Instance 1 --- 1 current Workload Identity
```

## 3. 凭据映射

| SPIFFE 凭据 | agent-iam-spec 用途 |
|---|---|
| X.509-SVID | mTLS Workload proof；实例级身份 |
| JWT-SVID | 应用层 Workload proof |
| WIT-SVID | WIMSE 兼容的 Workload Identity Token |
| Workload API | 运行时凭据和 bundle 分发（实现细节） |

## 4. 采用要求

- 校验 X.509-SVID 时必须验证证书链、有效期、trust domain 和唯一 SPIFFE URI SAN；
- 仅从**已验证**证书派生 selector 属性；
- trust domain 必须预先关联到 tenant；
- SPIFFE Federation 用于跨 trust domain bundle 交换，不与本规范的 Agent Federation 混同。
