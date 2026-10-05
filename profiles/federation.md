# Profile: Federation

- Profile identifier: `agent-iam-profile-federation`
- Applies to: Part 5 `agent-iam-5-federation`
- Series version: `0.4.1-draft`
- Status: Draft (normative when published)
- Language: English is normative. A Chinese translation, when present, is an equivalent translation.

This Profile narrows Part 5 Sections 3–7. It does not relax any `MUST` or
`MUST NOT` in Part 5.

## 1. Scope

It defines the namespace-scoped Federation Trust, principal isolation, federated
verification, trust revocation, and cross-domain evidence correlation.

## 2. Federation Trust

A Federation Trust MUST be namespace-scoped and MUST specify at least:

- peer issuer;
- JWKS URI or trust bundle;
- allowed audiences;
- claim mapping;
- PoP requirements;
- trust status;
- key refresh and fail-closed policy.

Peer claims MUST NOT specify or override the local namespace. Trust metadata and
JWKS retrieval MUST be HTTPS (except an explicit local development exception) and
MUST enforce a host/scheme allowlist, DNS/IP re-validation, redirect and response
size limits, connection and read timeouts, content-type checks, and rate limiting
of unknown-`kid` refreshes. Loopback, link-local, cloud metadata addresses, and
unapproved private-network targets MUST be rejected. The maximum usable time of a
stale key MUST be bounded.

## 3. Principal isolation

A Federated Principal MUST NOT be automatically merged into a local Agent
Identity. A Brokered Principal MUST use a namespace that does not conflict with
local Agent IDs, MUST preserve its source Authority Namespace, MUST NOT flatten a
peer Namespace into another Namespace, and MUST make its revocation semantics
explicit when it has no local Agent epoch.

## 4. Federated verification

Federation verification MUST simultaneously check trust status, signature, known
`kid`, issuer, audience, time, PoP, and claim mapping. Online verification of a
Brokered Token MUST re-check the corresponding Federation Trust according to its
trust/version reference; waiting for the local Token to expire is not sufficient.
A Brokered Token MUST NOT forge local `agentClass`, `instanceId`, `workloadId`,
`authorityRootRef`, or lifecycle epoch.

## 5. Trust revocation

After a trust is disabled, the next authoritative online verification MUST fail
closed. Trust revocation MUST use the Part 1 §6.3 freshness classes. When a trust
or key dependency is unavailable, verification MUST fail closed.

## 6. Cross-domain evidence correlation

Security events produced in different Authority Namespaces SHOULD be correlatable
through a `traceId` and controlled references, without disclosing unnecessary
identifiers. Correlation MUST NOT require merging federated principals into local
Agent Identities. A federated subject SHOULD be namespaced as
`fed:<issuer>/<subject>` rather than a local agent reference.

## 7. Conformance

- `../conformance/part-05-federation/active-trust-verification.positive.json`
- `../conformance/part-05-federation/principal-isolation.negative.json`
- `../conformance/part-05-federation/brokered-token-forged-field.negative.json`
- `../conformance/part-05-federation/trust-disable.negative.json`
- `../conformance/cross-repo/part-05-federation/p5-active-trust-verification.json`
- `../conformance/cross-repo/part-05-federation/p5-principal-isolation.json`
- `../conformance/cross-repo/part-05-federation/p5-trust-disable-revokes-brokered.json`

An implementation claiming this Profile MUST pass every vector above.

## 8. References

- Part 1 §6.3 revocation freshness.
- Part 2 §8.4 discovery SSRF defenses.
- Part 3 §5.1 brokered token type and claims.
- RFC 8693 — OAuth 2.0 Token Exchange (Standards Track).
