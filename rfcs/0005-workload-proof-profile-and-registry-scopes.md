# RFC-0005: Versioned Workload Proof Profile and Registry Service-Principal Scopes

- Status: Draft
- Authors: AICTRI maintainers
- Date: 2026-10-04
- Affected documents and clauses: Part 2 §5.5 (Workload Registration), Part 2 §7.3 (Management Plane), Part 3 §4.5 (Supported Attestation Profiles), `schemas/workload-registration.schema.json`, `schemas/fixtures/workload-registration.valid.json`, `conformance/`, `profiles/enrollment.md`
- Type: Normative

## Summary

Define, in the normative text, the versioned workload proof profile
(`proofRequirements`) carried by a Workload Registration, and the scoped
registry service-principal vocabulary used by the management plane. Both are
already shipped by the NOMIVELA and EIDOVELA reference implementations as an
interoperable surface.

## Motivation

Part 2 §5.5 records only `allowedProofMethods` as a flat list. It cannot express
a proof profile version, an expected issuer/audience, a selector schema version,
an attestation-digest requirement, or a verifier identity. NOMIVELA
`agent-registry-v2.0` publishes a versioned `proofRequirements` object and
EIDOVELA gates enrollment on it; without a normative definition, two conforming
registries cannot agree on the same proof profile, and mechanical interop is
blocked.

Part 2 §7.3 requires the management plane to be "finely authorized" but defines
no scope vocabulary or namespace-scoping rule. NOMIVELA exposes scoped service
principals (`registry.read`, `registry.write`, `instance.commit`, namespace
scope). A conforming implementation cannot know which scopes to issue or how
namespace scoping is enforced.

## Detailed design

1. **Versioned workload proof profile.** A Workload Registration MAY carry
   `proofRequirements`. When present it is authoritative over
   `allowedProofMethods` and MUST contain at least `schemaVersion`, `methods[]`
   (each with `method` and `profileVersion`), and `selectorSchemaVersion`. It MAY
   additionally carry `expectedIssuer`, `expectedAudience`, `trustDomain`,
   `attestationDigestRequired`, and `verifierIdentity`. The enrollment verifier
   MUST require the declared schema version, at least one versioned method, and a
   selector schema version, and MUST fail closed on an unknown method, unknown
   profile version, or unknown schema version.

2. **Registry service-principal scopes.** A registry or management service
   principal MUST be scoped. The interoperable scope vocabulary is
   `registry.read`, `registry.write`, and `instance.commit`; a write scope
   implies the read scope. A namespace-scoped principal MUST be enforced
   server-side from the resolved Authority Namespace, and request attribution
   headers MUST NOT be the basis of authorization. Consuming a registry event
   stream requires the `events.consume` scope.

3. **Schema and fixtures.** `schemas/workload-registration.schema.json` gains an
   optional `proofRequirements` object, and the valid fixture exercises it.
   Conformance vectors cover the positive profile and the unknown-version
   negative case.

## Impact

- Compatibility: backward compatible; `proofRequirements` is optional and the
  scope vocabulary is additive.
- Affected profiles: `enrollment` (uses the versioned profile).
- Affected reference implementations: NOMIVELA and EIDOVELA already implement
  this surface; no wire change is required.
- Security impact: positive; makes the proof profile and registry authorization
  scopes decidable and testable.
- Privacy impact: neutral.

## Alternatives considered

- **Define the proof profile in Part 3 only.** Rejected: the profile is data
  carried by a Part 2 record and must be defined where the record is defined.
- **Use a single opaque capability string per Workload Registration.** Rejected:
  it cannot express versioning, expected issuer/audience, or selector schema
  version, and it hides the failure mode.
- **Leave scopes to each implementation.** Rejected: the management plane is an
  interoperability surface; differing scopes make least privilege
  non-portable.

## Unresolved questions

- Whether `methods[]` should be a closed registry of method identifiers or an
  open string with a registered profile namespace.
- Whether the scope vocabulary needs a `lifecycle.write` distinct from
  `registry.write`.

## Decision

Filled in by maintainers. Include rationale, date, and any recorded dissent.
