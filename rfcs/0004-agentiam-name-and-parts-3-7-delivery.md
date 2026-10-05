# RFC-0004: AgentIAM Public Name and Parts 3–7 Conformance and Profile Delivery

- Status: Accepted
- Authors: AICTRI maintainers
- Date: 2026-10-04
- Affected documents and clauses: root `README.md` / `README.zh-CN.md`, `spec/README.md` / `spec/README.zh-CN.md`, each `spec/part-*/{en,zh-CN}/` title, `profiles/` (new), `conformance/cross-repo/` (new), `conformance/{README.md,COVERAGE.md,validate.mjs}`, `mappings/nomivela-eidovela-aegivela.md`, `IMPLEMENTATIONS.md` / `IMPLEMENTATIONS.zh-CN.md`, `CHANGELOG.md`
- Type: Normative

## Summary

Adopt the public name **AgentIAM** for the Agent IAM Series, sync the reference-implementation mapping to the implementations' RFC-0003 contract lines, and deliver the Parts 3–7 artifacts the implementations are blocked on: a set of executable cross-repository conformance fixtures and six normative Profiles.

## Motivation

The series already has a machine identifier (`agent-iam-series`), but no short public name to use in prose, talks, and comparisons, which slows adoption and discussion.

Three reference implementations (NOMIVELA, EIDOVELA, AEGIVELA) have applied RFC-0003 and published new contract lines — `agent-registry-v2.0`, Registry Consumer `v3.0`, and `aegivela.io/v2.0` at release `v1.2.5`. The informative mapping and `IMPLEMENTATIONS` status still cite the previous lines and versions.

The implementations record that the cross-repository Parts 3–7 conformance fixtures are **owned by this specification** and are a blocking dependency (AEGIVELA ADR-0016; EIDOVELA conformance claim). The specification published abstract vectors but no executable fixtures. In addition, `profiles/` listed six planned Profiles that were never written, leaving Part 7 composite profiles without their normative narrowing.

## Detailed design

1. **Public name.** The series is published under the public name **AgentIAM** (Agent Identity and Access Management Series). The machine identifier `agent-iam-series` and every `agent-iam-N-<slug>` part identifier are unchanged. Use "AgentIAM" in prose; reference implementations are named for the plane they own and implement AgentIAM, not AgentIAM itself.

2. **Mapping sync.** `mappings/nomivela-eidovela-aegivela.md` and `IMPLEMENTATIONS.md` / `.zh-CN.md` record the current contract lines and releases, and a new-versus-frozen contract-line table for each implementation.

3. **Cross-repository fixtures.** `conformance/cross-repo/` defines `fixture.schema.json`, a `manifest.json`, and HTTP-shaped fixtures for Parts 3–7 (27 as delivered, with the later RFC-0005 and RFC-0006 cases). A fixture declares its part, clause, `threatRef`, `kind`, target `contract` surface/version, preconditions, operation, and expected outcome. `conformance/validate.mjs` validates each fixture against the schema and cross-checks the manifest. Implementations execute the fixtures against their published contract surface.

4. **Profiles.** Six normative Profiles are published under `profiles/`: `identity-token`, `enrollment`, `authorization`, `delegation`, `federation`, and `audit`, each with a Chinese equivalent (`profiles/*.zh-CN.md`). Each declares its identifier, the part it narrows, series version `0.4.0-draft`, the narrowed clauses, decidable structures, references, and the conformance vectors that prove it. Profiles only narrow; they do not relax any `MUST` or `MUST NOT`.

5. **Abstract vector coverage.** Six security-critical negative vectors are added so every row of the planned coverage matrix has a positive and a negative vector where required; with the RFC-0005 and RFC-0006 vectors the abstract vector set reaches 41. The cross-repository fixtures (item 3) remain the executable layer.

## Impact

- Compatibility: backward compatible for spec consumers. The name is additive; profiles and fixtures are additive. The mapping refresh changes only informative text.
- Affected profiles: all six new Profiles; the Part 7 composite profiles now have their per-part narrowing.
- Affected reference implementations: NOMIVELA, EIDOVELA, and AEGIVELA can execute the Parts 3–7 fixtures; no wire change is required by this RFC.
- Security impact: positive; makes revocation freshness, non-amplification, PoP replay, redaction, and fail-closed behavior executable and testable.
- Privacy impact: neutral; the audit Profile restates data-minimization requirements.

## Alternatives considered

- **Keep only "Agent IAM Series".** Rejected: it is descriptive but not memorable; a short name is needed for propagation, as "OAuth 2.0" is for RFC 6749.
- **A vendor-derived name (for example, "VELA").** Rejected: the standard is cross-vendor; deriving its name from one vendor's implementation family would imply endorsement and confuse the standard with its implementations.
- **Defer the fixtures and Profiles.** Rejected: the reference implementations' Part 7 claims are blocked on the fixtures, and the composite profiles are not testable without the Profiles.

## Unresolved questions

- Whether cross-repository fixtures MUST be exercised over HTTP, or whether an equivalent transport binding that preserves request semantics and contract version is acceptable.
- Whether the Profile-defined artifact `typ` values (`agent-iam-identity+jwt`, `agent-iam-brokered-identity+jwt`) are final or belong in a separate media-type registry.
- Whether the naming change should be recorded as a `minor` (additive) or `patch` (editorial) series release.

## Decision

Accepted and applied in `0.4.0-draft` (2026-10-04): the AgentIAM public name was adopted, the reference-implementation mapping was refreshed, 27 cross-repository fixtures and six bilingual Profiles were published, and the abstract vector set was completed. No blocking objection recorded.
