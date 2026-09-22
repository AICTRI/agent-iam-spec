[English](agent-iam-5-federation.md) · [简体中文](../zh-CN/agent-iam-5-federation.md)

# Agent IAM Series — Part 5: Cross-Domain Federation

- Series identifier: `agent-iam-series`
- Part identifier: `agent-iam-5-federation`
- Version: `0.1.0-draft`
- Date: 2026-09-22
- Status: Project draft, not an international, national, or industry standard
- License: CC BY 4.0 (specification text)

This part specifies how Agents and principals from different Authority Namespaces interoperate. It references the Part 3 and Part 4 interfaces and does not redefine them.

## 1. Scope

This part specifies:

- Federation Trust configuration;
- peer namespace preservation and principal isolation;
- brokered tokens;
- federation verification;
- trust revocation;
- cross-domain evidence correlation;
- federation security.

## 2. Normative References

- Part 1 defines terms, fail-closed behavior, and the revocation freshness vocabulary.
- Part 2 defines discovery and the Authority Namespace.
- Part 3 defines identity tokens.
- Part 4 defines authorization lineage and revocation.
- Part 6 defines the security event envelope and cross-domain correlation.

## 3. Federation Trust

A Federation Trust MUST be namespace-scoped and MUST specify at least:

- peer issuer;
- JWKS URI or trust bundle;
- allowed audiences;
- claim mapping;
- PoP requirements;
- trust status;
- key refresh and fail-closed policy.

Peer claims MUST NOT specify or override the local namespace.

Federation metadata/JWKS retrieval MUST be restricted to HTTPS (except for an explicit local development exception), and MUST enforce host/scheme allowlist, DNS/IP re-validation, redirect limits, response size limits, connection and read timeouts, content type checks, and rate limiting of unknown `kid` refreshes. Loopback, link-local, cloud metadata addresses, and unapproved private network targets MUST be rejected to prevent SSRF; the maximum usable time of a stale key MUST be bounded.

## 4. Principal Isolation

A Federated Principal MUST NOT be automatically merged into a local Agent Identity. A Brokered Principal MUST use a namespace that does not conflict with local Agent IDs, MUST preserve its source Authority Namespace, MUST NOT flatten a peer Namespace into another Namespace, and MUST make explicit its revocation semantics when it has no local Agent epoch.

## 5. Federation Verification

Federation verification MUST simultaneously check trust status, signature, known `kid`, issuer, audience, time, PoP, and claim mapping. Online verification of a Brokered Token MUST re-check the corresponding Federation Trust according to its trust/version reference; merely waiting for the local Token to expire does not satisfy this requirement.

## 6. Trust Revocation

After a trust is disabled, the next authoritative online verification MUST fail closed. Trust revocation MUST use the freshness classes defined in Part 1 Section 6.3. When a trust or key dependency is unavailable, verification MUST fail closed.

## 7. Cross-Domain Evidence Correlation

Security events produced in different Authority Namespaces SHOULD be correlatable through a `trace_id` and controlled references, without disclosing unnecessary identifiers. Correlation MUST NOT require merging federated principals into local Agent Identities.

## 8. Security Considerations

- Discovery and peer-metadata retrieval share the SSRF defenses defined in Part 2 Section 8.4 and Section 3 of this part.
- A Brokered Token MUST NOT forge local `agent_class`, `instance_id`, `workload_id`, `authority_root_ref`, or lifecycle epoch (Part 3 Section 5.1).
- Trust-disable online revocation is mandatory; local token expiry is not an acceptable substitute.

## Appendix A. Migration Source (Informative)

| Current clauses | Mapped here |
|---|---|
| §16.1 Federation Trust | Sections 3, 8 |
| §16.2 Principal isolation | Section 4 |
| §16.3 Federation verification | Sections 5–6 |
| §15 (Federation Trust revocation) | Section 6 |
| §17.4 evidence correlation | Section 7 |
