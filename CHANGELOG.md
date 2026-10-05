# Changelog

All notable changes to this specification are recorded here.

The format is based on Keep a Changelog. Versions follow the scheme documented in `GOVERNANCE.md`.

## [0.4.0-draft] - 2026-10-04

### Added

- Public name **AgentIAM** (Agent Identity and Access Management Series) for the
  series, introduced in the root and series READMEs; the machine identifier
  `agent-iam-series` and the part identifiers are unchanged.
- Cross-repository conformance fixtures for Parts 3–7 under
  `conformance/cross-repo/`, with `fixture.schema.json`, `manifest.json`, an
  English and a Chinese README, and 27 executable HTTP-shaped fixtures covering
  enrollment, challenge single-use, token audience/epoch, PoP replay, credential
  generation, Registry Context fail-closed, workload proof profile version, JWKS
  rotation overlap, decision/grant, obligation enforcement, delegation
  non-amplification, approval, pre-dispatch revocation, federation trust,
  principal isolation, brokered exchange, and audit. These are the fixtures the
  reference implementations execute against their published contract surface
  (see AEGIVELA ADR-0016). `conformance/validate.mjs` validates the fixtures and
  the manifest.
- Six normative Profiles under `profiles/`: `identity-token`, `enrollment`,
  `authorization`, `delegation`, `federation`, and `audit`, each declaring its
  identifier, the part it narrows, the series version, narrowed clauses, and the
  conformance vectors that prove it; each has a Chinese equivalent
  (`profiles/*.zh-CN.md`).
- Six security-critical negative vectors closing the planned coverage: Authority
  Binding immutability and Agent ID non-reuse (Part 2), enrollment proof binding,
  credential-generation supersede, and online revocation fail-closed (Part 3),
  and Grant binding verification (Part 4). The abstract vector set is now 36.

### Changed

- Part 2 §5.5 now defines the optional versioned workload proof profile
  (`proofRequirements`) carried by a Workload Registration, and Part 3 §4.5 makes
  it authoritative for the enrollment verifier; RFC-0005.
- Part 2 §7.3 now defines the scoped registry service-principal vocabulary
  (`registry.read`, `registry.write`, `instance.commit`, `events.consume`) and
  the namespace-scoping rule; RFC-0005.
- Part 2 §7.4 now defines the atomic **Registry Context** point read as the
  authoritative registry read unit for issuance and online verification, failing
  closed on inconsistency, with optional conditional reads and optimistic
  concurrency; Part 2 §7.5 defines the recoverable registry event stream as a
  cache-invalidation mechanism only; RFC-0006.
- Part 4 §3.1 now names the **Identity Source** as the sole constructor of the
  trusted Principal and forbids Part 4 from re-deriving identity from request
  input, natural language, model output, or tool return values; RFC-0006.
- `schemas/workload-registration.schema.json` gains an optional
  `proofRequirements` object, exercised by the valid fixture, with positive and
  unknown-version negative vectors.
- Refreshed the AxisRobo reference-implementation mapping for the implementations'
  RFC-0003 contract lines: NOMIVELA `agent-registry-v2.0`, EIDOVELA Registry
  Consumer `v3.0`, and AEGIVELA `aegivela.io/v2.0` at release `v1.2.5`, including
  the new-versus-frozen contract-line table.

## [0.3.0-draft] - 2026-09-30

### Added

- Applied the RFC-0003 conventions to the normative text, schemas, conformance vectors, and examples: field names are camelCase with `…Ref` references, records and contexts carry the dual `agentEpoch` / `identityEpoch` (with `agentState` / `identityState`), the Agent class vocabulary is the unified nine-class set, and `tenant` is no longer an interoperable claim.
- RFC-0003 `Contract Naming and Identity Conventions` (Draft): camelCase wire naming, `…Ref` references, dual `agentEpoch`/`identityEpoch`, a nine-class Agent set, `authorityBindingRef`/`authorityBindingKind`, and `tenant` as an implementation-only key mapped from the Authority Namespace.
- The NOMIVELA registry reference-implementation mapping, and a refreshed AxisRobo mapping covering NOMIVELA (Part 2), EIDOVELA (Parts 3, 5), and AEGIVELA (Parts 4, 6) under `mappings/nomivela-eidovela-aegivela.md`; `mappings/eidovela-aegivela.md` now points to it.
- Multi-part `Agent IAM Series` structure under `spec/part-01-architecture` through `spec/part-07-conformance` (RFC-0002, Draft).
- Part 1 Architecture and Terminology (framework: terms, layering, trusted data sources, fail-closed, canonicalization, revocation freshness, privacy).
- Part 2 Registration and Discovery, including a new discovery chapter (discovery document, resolution rules, SSRF defenses).
- Part 3 Authentication, Part 4 Authorization, Part 5 Federation, Part 6 Audit, and Part 7 Conformance written in full, each with an informative migration-mapping appendix.
- Series index `spec/README.md` and `spec/README.zh-CN.md`.
- Draft JSON Schemas for Parts 2-6 records under `schemas/`, and OpenAPI 3.1 definitions for registry/discovery (Part 2), identity/STS (Part 3), and authorization (Part 4).
- Conformance vector format (`conformance/vector.schema.json`) and initial positive and negative vectors for Parts 2-5.
- End-to-end examples under `examples/` for twin onboarding, high-risk action, delegated cross-domain access, federation trust lifecycle, and revocation propagation.
- Part-level EIDOVELA/AEGIVELA, SPIFFE, and IETF WIMSE mappings.
- Reusable request body schemas under `schemas/requests/` and a field-to-clause mapping table in `schemas/FIELD-MAPPING.md`.
- Conformance vectors for discovery, lifecycle, negation, brokered-field forgery, audit redaction/transaction, and composite-profile completeness.
- Federation management OpenAPI (`schemas/federation.openapi.json`) and a Part-by-Part coverage matrix (`conformance/COVERAGE.md`).
- Part 1 and Part 5 conformance vectors, plus six schema-validated record fixtures under `schemas/fixtures/`.
- Fixture validation in `conformance/validate.mjs`; the validator now reports JSON, vectors, fixtures, schema references, and Markdown links.
- Valid fixtures for all record and request schemas, and additional dependency-free checks for schema patterns, URI/date-time formats, and array minimum lengths.
- Tightened discovery, identity-token, policy-decision, and federation-trust schemas to require their normative security fields; added expected-invalid fixtures and `anyOf` validation for a JWKS URI or trust bundle.
- Structured approval and federation request schemas, audit event ingestion OpenAPI, and positive conformance-profile coverage.

### Changed

- Updated `IMPLEMENTATIONS.md` / `IMPLEMENTATIONS.zh-CN.md` to list NOMIVELA as the implemented Agent Registry and Namespace Authority and to refresh the EIDOVELA and AEGIVELA status summaries.
- Removed `tenant_id` from the specification and replaced it with the hierarchical `Authority Namespace` (RFC-0001, Draft).
- Split the single-document edition into the series and removed `spec/en/agent-iam-spec.md` and `spec/zh-CN/agent-iam-spec.md`; their content is carried by the seven parts.
- `GOVERNANCE.md` normative-text list, versioning, and profile rules updated for the series.
- Root `README.md` / `README.zh-CN.md` reorganized around the series and its seven parts.
- Added terms `Namespace`, `Authority Namespace`, and `Organization Unit` to Part 1 Section 4; removed the `Tenant` term.
- Added the Namespace Hierarchy in Part 2 Section 4.4; changed Agent ID uniqueness in Part 2 Sections 4.2 and 5.1 to `namespace + agent_id`.
- Replaced `namespace` for `tenant_id` in the Agent Identity Record, Workload Registration, Agent Instance, trusted data sources, identity Token claims, challenge scoping, JTI replay scope, Decisions, Grants, revocation selectors, Federation Trust, and security events.
- Clarified in Part 5 Section 4 that federated/brokered principals preserve their source Authority Namespace and do not flatten a peer Namespace into another Namespace.
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
