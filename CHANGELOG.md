# Changelog

All notable changes to this specification are recorded here.

The format is based on Keep a Changelog. Versions follow the scheme documented in `GOVERNANCE.md`.

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
