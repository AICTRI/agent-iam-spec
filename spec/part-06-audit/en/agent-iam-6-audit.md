[English](agent-iam-6-audit.md) · [简体中文](../zh-CN/agent-iam-6-audit.md)

# Agent IAM Series — Part 6: Audit and Security Events

- Series identifier: `agent-iam-series`
- Part identifier: `agent-iam-6-audit`
- Version: `0.1.0-draft`
- Date: 2026-09-22
- Status: Project draft, not an international, national, or industry standard
- License: CC BY 4.0 (specification text)

This part specifies the Security Event Records used for audit across all parts.

## 1. Scope

The Security Event Records in this part are used for audit and are different from the Attestation Evidence that serves as input to remote attestation in RFC 9334. The field name `evidence_ref` MUST identify whether it references attestation evidence, an attestation result, or a Security Event Record.

## 2. Normative References

- Part 1 defines terms and privacy principles.

## 3. Minimum Events

The following operations MUST produce security evidence:

- Agent registration and Authority Binding;
- Enrollment success and failure;
- Credential issuance, rotation, supersede, and revocation;
- lifecycle and instance state transitions;
- identity Token issuance, exchange, and introspection;
- Policy Decision, Approval, Grant, and PEP results;
- Federation Trust changes and federation verification;
- revocation and critical operational actions.

## 4. Minimum Fields

A Security Event Record MUST contain at least:

```text
event_id, event_type, timestamp
namespace
agent_id and instance_id, when applicable
subject/actor/client/workload references, when applicable
lifecycle_epoch, when applicable
action and resource digest, when applicable
policy_version, when applicable
decision/grant/approval identifiers, when applicable
trace_id
outcome and reason_code
evidence references
```

## 5. Data Minimization

Evidence and outbox MUST NOT store:

- private keys;
- complete bearer Tokens, PoP proofs, or downstream credentials;
- unrestricted prompts, tool parameters, or business payloads;
- sensitive plaintext that could satisfy the audit purpose by reference or digest.

Sensitive subject, resource, and reason SHOULD use domain-separated digests. Rejection events SHOULD be persisted after rate limiting and sanitization, and MUST NOT exist only as in-process counters.

## 6. Consistency and Outbox

Authoritative state changes, evidence, and outbox SHOULD be committed in the same transaction. The Outbox MUST define at-least-once delivery, idempotent consumers, retry, DLQ, and redrive semantics.

## Appendix A. Migration Source (Informative)

| Current clauses | Mapped here |
|---|---|
| §17.1 Minimum events | Section 3 |
| §17.2 Minimum fields | Section 4 |
| §17.3 Data minimization | Section 5 |
| §17.4 Consistency and outbox | Section 6 |
