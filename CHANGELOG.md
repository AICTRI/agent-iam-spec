# Changelog

All notable changes to this specification are recorded here.

The format is based on Keep a Changelog. Versions follow the scheme documented in `GOVERNANCE.md`.

## [Unreleased]

### Changed

- Removed `tenant_id` from the specification and replaced it with the hierarchical `Authority Namespace` (RFC-0001, Draft).
- Added terms `Namespace`, `Authority Namespace`, and `Organization Unit` to Section 4; removed the `Tenant` term.
- Added the Namespace Hierarchy in Section 6.6; changed Agent ID uniqueness in Sections 6.2 and 7.1 to `namespace + agent_id`.
- Replaced `namespace` for `tenant_id` in the Agent Identity Record, Workload Registration, Agent Instance, trusted data sources, identity Token claims, challenge scoping, JTI replay scope, Decisions, Grants, revocation selectors, Federation Trust, and security events.
- Clarified in Section 16.2 that federated/brokered principals preserve their source Authority Namespace and do not flatten a peer Namespace into another Namespace.
- Updated `SECURITY.md` and the SPIFFE / EIDOVELA-AEGIVELA mappings accordingly.

## [0.1.0-draft] - 2026-09-22

### Added

- Initial project draft of the Agent IAM specification in Chinese and English.
- Identity model: Agent Identity, Agent Instance, Authority Root, Authority Binding, Workload Registration.
- Lifecycle state machine with monotonic lifecycle epoch.
- Enrollment, workload attestation three-phase model, and proof-of-possession requirements.
- Identity token claims, request-level PoP, and authoritative online verification.
- Principal model, five authorization modes, and effective-scope intersection rules.
- Canonical authorization lineage, policy decision, and execution grant requirements.
- Delegation non-amplification, token exchange, approval, and pre-authorization rules.
- PEP and tool invocation requirements, including credential injection obligations.
- Revocation selectors and freshness classes.
- Federation trust, principal isolation, and brokered token requirements.
- Security event record requirements and data minimization rules.
- Conformance levels 1, 2, and 3.
- Recommendations for adopting published international and national standards.
- Non-normative mappings for IETF WIMSE, SPIFFE, `GB/Z 185`, and reference implementations.

### Notes

- This version is a project draft and is not an international, national, or industry standard.
- `GB/Z 185` field-level compatibility is not yet verified; full standard text has not been reviewed.
- English is the primary normative text. The Chinese text is an equivalent translation provided for reference; where the two conflict, the English text governs.
