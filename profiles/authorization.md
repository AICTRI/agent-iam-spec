# Profile: Authorization

- Profile identifier: `agent-iam-profile-authorization`
- Applies to: Part 4 `agent-iam-4-authorization`
- Series version: `0.4.1-draft`
- Status: Draft (normative when published)
- Language: English is normative. A Chinese translation, when present, is an equivalent translation.

This Profile narrows Part 4 Sections 3, 4, 6, 7, and 8.1. It does not relax any
`MUST` or `MUST NOT` in Part 4.

## 1. Scope

It defines the principal model, the authorization modes, the single authorization
lineage, the canonical policy Decision, the Execution Grant, the PEP obligations,
and authorization revocation. Delegation and token exchange are specified in the
`delegation` Profile; this Profile states the base on which delegation operates.

## 2. Principal

A trusted principal MUST be constructed only by the identity source from verified
authentication output (Part 3). It MUST carry the canonical `namespace`, the
`authorityBindingRef`, `agentClass`, `instanceId`, `workloadId`, `agentEpoch`, and
`identityEpoch`. Part 4 MUST NOT re-derive namespace, agent class, workload, or
epoch from caller-supplied values. Natural language, model output, and tool return
values MUST NOT select the namespace or Authority Root.

## 3. Authorization modes

The mode vocabulary is fixed:

| Mode | Authority source | Required proof |
|---|---|---|
| `human_web` | Human session / OIDC | Authorization code flow and assurance |
| `system_api` | Client + workload | Client and workload proof |
| `delegated_api` | User delegation + client/workload | Delegation plus client/workload proof |
| `service_agent_api` | Agent identity | Identity + workload + epoch |
| `twin_agent_api` | Immutable master binding | Master binding + workload + epoch |

Modes MUST NOT substitute for one another. The endpoint MUST accept only the mode
and artifact type applicable to it (Part 4 §6).

## 4. Effective authority

Effective authority MUST be the intersection of every applicable upper bound
(Part 4 §3.3). A missing required input MUST cause rejection. Only `allow` derives
an Execution Grant; `deny`, `approval_required`, `revoked`, and unknown results
block execution.

## 5. Decision

A Decision MUST bind at least the namespace, mode, applicable subject/actor/client/
workload/authority-root fields, action, immutable resource identity or digest, the
normalized scope, audience, policy ID/version, lifecycle epoch, decision ID,
issued-at, expiry, outcome, and obligations. Digests MUST follow Part 1 §6.2.

## 6. Execution Grant

An Execution Grant MUST be short-lived, audience-bound, and sender-constrained,
and MUST bind the action, resource, scope, task, policy version, lifecycle epoch,
and parent lineage. The PEP MUST verify the Grant before every protected effect,
not only at connection establishment.

## 7. PEP obligations

The PEP MUST:

- verify signature, issuer, audience, expiry, namespace, PoP, resource digest,
  epoch, and revocation;
- allow an effect only after enforcing all obligations;
- re-check authorization and revocation at the continuation boundary of
  long-running tasks;
- match exactly on action, target host, path, tool ID, skill hash, and
  implementation digest;
- treat catalog visibility, model selection, and natural-language plans as
  non-authoritative.

Credential injection MUST be an explicit obligation binding a `credentialRef` or
class, target, scope, and expiry. The credential value MUST NOT enter a Decision,
Grant, prompt, or evidence, and an LLM MUST NOT access the primary identity key or
downstream service credentials.

## 8. Revocation

Authorization revocation MAY use namespace-scoped selectors including subject,
session, authority root, Decision JTI, Grant JTI, Approval JTI, policy version,
and resource/implementation digest. Checks MUST use Part 1 §6.3 freshness classes
and MUST reject when a dependency is unavailable. Offline or degraded modes MUST
NOT be used for credential injection, authority expansion, new targets, or
high-risk destructive actions.

## 9. Conformance

- `../conformance/part-04-authorization/decision-allow-derives-grant.positive.json`
- `../conformance/part-04-authorization/decision-deny-blocks-grant.negative.json`
- `../conformance/part-04-authorization/revocation-freshness-pre-dispatch.negative.json`
- `../conformance/part-04-authorization/prompt-injection-cannot-expand.negative.json`
- `../conformance/cross-repo/part-04-authorization/p4-decision-allow-derives-grant.json`
- `../conformance/cross-repo/part-04-authorization/p4-decision-deny-blocks-grant.json`
- `../conformance/cross-repo/part-04-authorization/p4-credential-injection-obligation.json`

An implementation claiming this Profile MUST pass every vector above.

## 10. References

- Part 1 §6.2 (canonicalization) and §6.3 (revocation freshness).
- Part 3 (authentication output and proof requirements).
- RFC 8693 — OAuth 2.0 Token Exchange (Standards Track); see the `delegation` Profile.
