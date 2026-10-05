# Profile: Audit and Security Events

- Profile identifier: `agent-iam-profile-audit`
- Applies to: Part 6 `agent-iam-6-audit`
- Series version: `0.4.1-draft`
- Status: Draft (normative when published)
- Language: English is normative. A Chinese translation, when present, is an equivalent translation.

This Profile narrows Part 6 Sections 3–6. It does not relax any `MUST` or
`MUST NOT` in Part 6.

## 1. Scope

It defines the minimum security events, the minimum fields of a Security Event
Record, data minimization, and transactional/outbox consistency. The Security
Event Record is the single envelope used by all parts.

## 2. Minimum events

A conforming deployment MUST emit evidence for at least:

- enrollment and attestation outcomes (including denials);
- credential issuance, rotation, supersede, and revocation;
- lifecycle and instance state transitions;
- identity Token issuance, exchange, and introspection;
- Policy Decision, Approval, Grant, and PEP results;
- Federation Trust changes and federation verification;
- revocation and critical operational actions.

Rejection events SHOULD be persisted after rate limiting and sanitization and
MUST NOT exist only as in-process counters.

## 3. Minimum fields

A Security Event Record MUST contain at least:

```text
eventId, eventType, timestamp
namespace
agentId and instanceId, when applicable
subject/actor/client/workload references, when applicable
agentEpoch, when applicable
action and resource digest, when applicable
policyVersion, when applicable
decision/grant/approval identifiers, when applicable
traceId
outcome and reasonCode
evidence references
```

`tenant` MUST NOT be a required field (RFC-0003). Correlation uses `namespace`
and `traceId`.

## 4. Data minimization

Evidence and outbox MUST NOT store:

- private keys;
- complete bearer Tokens, PoP proofs, or downstream credentials;
- unrestricted prompts, tool parameters, or business payloads;
- sensitive plaintext that could satisfy the audit purpose by reference or digest.

Sensitive subject, resource, and reason SHOULD use domain-separated digests. A
record that carries a prohibited field MUST be rejected or redacted before
storage.

## 5. Consistency and outbox

Authoritative state changes, evidence, and outbox SHOULD be committed in the same
transaction. The outbox MUST define at-least-once delivery, idempotent consumers,
retry, dead-letter, and redrive semantics. A persistence failure MUST roll back
the state change.

## 6. Conformance

- `../conformance/part-06-audit/reject-event-persisted.positive.json`
- `../conformance/part-06-audit/event-redaction.negative.json`
- `../conformance/part-06-audit/transaction-consistency.positive.json`
- `../conformance/cross-repo/part-06-audit/p6-security-event-persisted.json`
- `../conformance/cross-repo/part-06-audit/p6-event-redaction.json`
- `../conformance/cross-repo/part-06-audit/p6-transaction-consistency.json`

An implementation claiming this Profile MUST pass every vector above.

## 7. References

- Part 1 §6.2 canonicalization (domain-separated digests).
- Part 6 `schemas/security-event.schema.json`.
- `../conformance/cross-repo/part-06-audit/`.
