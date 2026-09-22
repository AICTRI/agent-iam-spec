[English](agent-iam-4-authorization.md) · [简体中文](../zh-CN/agent-iam-4-authorization.md)

# Agent IAM Series — Part 4: Authorization and Delegation

- Series identifier: `agent-iam-series`
- Part identifier: `agent-iam-4-authorization`
- Version: `0.1.0-draft`
- Date: 2026-09-22
- Status: Project draft, not an international, national, or industry standard
- License: CC BY 4.0 (specification text)

This part specifies how the `Verified Agent Identity Context` produced by Part 3 is turned into an enforceable execution authorization.

## 1. Scope

This part specifies:

- principal resolution and authorization modes;
- effective authority;
- policy decisions and execution grants;
- delegation, token exchange, approval, and pre-authorization;
- PEP and tool invocation requirements;
- authorization-scope revocation;
- authorization security.

Authentication artifacts are specified in Part 3. Cross-domain federation is specified in Part 5.

## 2. Normative References

- Part 1 defines terms, the rule that identity is not authorization, canonicalization, and the revocation freshness vocabulary.
- Part 3 defines the `Verified Agent Identity Context` and the authorization-mode proof requirements.
- Part 6 defines the security event envelope.

## 3. Principal and Authorization Modes

### 3.1 Principal Resolution

The authorization system MUST reconstruct the Principal from the verified enterprise IdP, Agent Identity Authority records, Workload Assertion, and authorization context. A client self-reported Principal can only be a comparison-only input.

### 3.2 Authorization Modes

| Mode | Authority Source |
|---|---|
| `human_web` | human subject |
| `system_api` | organization/system root |
| `delegated_api` | human subject, service as actor |
| `service_agent_api` | organization/system root, Service Agent as actor |
| `twin_agent_api` | human master, Twin Agent as actor |

The required proof for each mode is defined in Part 3 Section 6.

Different modes MUST NOT substitute for one another. A Workload Token MUST NOT impersonate a human; a Service Agent MUST NOT claim a human master; a Twin Agent MUST NOT satisfy a system-only endpoint.

### 3.3 Effective Authority

Effective authority MUST be the intersection of all applicable upper bounds:

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

When any required input is missing, it MUST be rejected.

## 4. Policy Decision and Execution Grant

### 4.1 Single Authorization Lineage

Authorization MUST have a single, verifiable lineage:

```text
verified principal
  -> canonical policy decision
  -> verified allow decision
  -> execution grant
  -> attenuated child grant
  -> PEP verification and effect
```

A raw bearer Token can only establish identity context and MUST NOT alone serve as the authorization basis for minting an Execution Grant.

Digests of resources and security-critical references MUST follow Part 1 Section 6.2.

### 4.2 Decision

A Decision MUST bind at least:

- namespace and authorization mode;
- applicable fields among subject, actor, client, workload, and authority root;
- action and immutable resource identity/digest;
- normalized scope;
- audience;
- policy ID/version;
- lifecycle epoch;
- decision ID, issued-at, and expiry;
- outcome and obligations.

Only `allow` may derive an Execution Grant. `deny`, `approval_required`, `revoked`, and unknown results MUST all block execution.

### 4.3 Grant

An Execution Grant SHOULD be short-lived, audience-bound, and sender-constrained, and MUST bind at least the action, resource, scope, task, policy version, lifecycle epoch, and parent lineage. The PEP MUST verify the Grant before every protected effect, not only when the connection is established.

## 5. Delegation and Token Exchange

### 5.1 No Amplification

Any child authorization MUST satisfy:

```text
child.scope       subset-of parent.scope
child.audience    subset-of parent.audience
child.expires_at  <= parent.expires_at
child.task        equal-to-or-narrower-than parent.task
child.action      equal-to-or-narrower-than parent.action
child.resource    equal-to-or-narrower-than parent.resource
```

The namespace, Authority Root, and immutable principal binding MUST NOT change during delegation.

The attenuation relation MUST be decidable and versioned: audience MUST be normalized into an exact string set and a set subset MUST be performed; action MUST be equal by default, unless the Profile defines an explicit partial order; resource MUST use a typed canonical descriptor and the containment function of that type; task MUST use an opaque `task_id` or structured constraints, and "narrower" MUST NOT be judged from natural language. A Decision and a Grant MUST identify the version of the attenuation Profile used.

### 5.2 OAuth Token Exchange

When using RFC 8693, the following MUST be distinguished:

- identity-preserving Token derivation;
- impersonation;
- delegation;
- Execution Grant derivation.

An exchange that only preserves identity, audience, expiry, and PoP MUST NOT be described as a complete authorization delegation. Multi-level delegation MUST preserve the actor/parent lineage, and the resource server MUST perform authority attenuation checks.

### 5.3 Approval and Pre-Authorization

An Approval MUST bind the namespace, approver, agent/actor, action, resource, scope, audience, reason digest, expiry, and policy version.

Pre-Authorization can only provide a time-limited, quota-limited usage window for existing authority, and MUST NOT elevate authority. Quota updates such as `max_grants` and `used_grants` MUST be atomic and monotonic.

## 6. PEP and Tool Invocation

The PEP MUST:

- accept only the authorization mode and artifact type applicable to the endpoint;
- verify signature, issuer, audience, expiry, namespace, PoP, resource digest, epoch, and revocation;
- allow an effect only after enforcing all obligations;
- re-check authorization and revocation at the continuation boundary of long-running tasks;
- perform exact matching on the action, target host, path, tool ID, skill hash, and implementation digest;
- MUST NOT treat Catalog visibility, model selection results, or natural-language plans as authorization.

Credential injection MUST be an explicit obligation and MUST bind `credential_ref` or class, target, scope, and expiry. The credential value itself MUST NOT enter a Decision, Grant, prompt, or evidence. An LLM MUST NOT have access to an Agent's primary identity private key or downstream service credentials.

## 7. Revocation (Authorization Scope)

Revocation MAY be performed by namespace-scoped selector, including:

- subject, session, or authority root;
- Decision JTI, Grant JTI, Approval JTI;
- policy version;
- resource/implementation digest.

Sensitive selectors SHOULD be persisted as digests with domain separation. Revocation checks MUST use the freshness classes defined in Part 1 Section 6.3. When a revocation dependency is unavailable, it MUST be rejected. Offline or degraded modes MUST NOT be used for credential injection, authority expansion, new targets, or high-risk destructive actions.

## 8. Security Considerations

### 8.1 Confused Deputy

Identity Tokens MUST bind the audience exactly; authorization Tokens and Execution Grants MUST further bind the action, resource, and task exactly. Security-critical audiences MUST NOT be matched using wildcards, prefixes, or case-insensitive means.

### 8.2 Prompt Injection

Natural language, model output, and tool return values are all untrusted inputs. They MUST NOT:

- select the namespace or Authority Root;
- modify the Agent class, epoch, or policy version;
- read the primary identity key or service credentials;
- bypass the PEP;
- expand a parent grant.

## Appendix A. Migration Source (Informative)

| Current clauses | Mapped here |
|---|---|
| §11 Principal and authorization modes | Sections 3 |
| §12 Policy Decision and Execution Grant | Section 4 |
| §13 Delegation and token exchange | Section 5 |
| §14 PEP and tool invocation | Section 6 |
| §15 (decision/grant/approval selectors) | Section 7 |
| §18.2 confused deputy, §18.3 prompt injection | Section 8 |
