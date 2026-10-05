# Conformance

Conformance test vectors and fixtures for **AgentIAM** (the Agent IAM Series).

Licensed under Apache-2.0. See `../LICENSE-CODE`.

## Status

Language-neutral vectors are published for Parts 1–7. Executable,
cross-repository fixtures are published for Parts 3–7 under
[`cross-repo/`](cross-repo/README.md) (27 fixtures) so an implementation can
prove interoperability against its published contract surface. Coverage continues
to expand; see [`COVERAGE.md`](COVERAGE.md).

## Validation

Run the dependency-free validator:

```text
node conformance/validate.mjs
```

It parses every `*.json`, validates each vector against `vector.schema.json`,
validates the fixtures declared in `../schemas/fixtures/manifest.json`, checks that
external `$ref` targets exist, and checks relative Markdown links.
CI runs it on every push and pull request (`.github/workflows/validate.yml`).

## Layout

```text
conformance/
├── vector.schema.json
├── part-02-registration-discovery/
├── part-03-authentication/
├── part-04-authorization/
├── part-05-federation/
├── part-06-audit/
├── part-07-conformance/
└── cross-repo/          # executable fixtures for Parts 3–7
```

The series composite profiles (`Identity`, `Authorization`, `Federated`) defined in
`../spec/part-07-conformance/` compose per-part vectors.

## Vector format

Every vector is a JSON document conforming to `vector.schema.json`:

```json
{
  "id": "p2-agent-id-uniqueness-001",
  "part": "agent-iam-2-registration-discovery",
  "clause": "5.1",
  "kind": "negative",
  "description": "...",
  "input": { "operation": "...", "..." : "..." },
  "expected": { "outcome": "reject", "reasonCode": "duplicate-agent-id" }
}
```

See `COVERAGE.md` for the Part-by-Part coverage matrix.

## Published vectors

| Vector | Part | Clause | Kind |
|---|---|---|---|
| `part-01-architecture/canonical-digest.positive.json` | 1 | 6.2 | positive |
| `part-01-architecture/revocation-freshness-pre-dispatch.negative.json` | 1 | 6.3 | negative |
| `part-02-registration-discovery/agent-id-uniqueness.positive.json` | 2 | 5.1 | positive |
| `part-02-registration-discovery/agent-id-uniqueness.negative.json` | 2 | 5.1 | negative |
| `part-02-registration-discovery/lifecycle-transition.positive.json` | 2 | 6.2 | positive |
| `part-02-registration-discovery/lifecycle-epoch-monotonicity.negative.json` | 2 | 6.2 | negative |
| `part-02-registration-discovery/discovery-success.positive.json` | 2 | 8 | positive |
| `part-02-registration-discovery/discovery-stale-metadata.negative.json` | 2 | 8.3 | negative |
| `part-02-registration-discovery/discovery-ssrf.negative.json` | 2 | 8.4 | negative |
| `part-02-registration-discovery/authority-binding-immutability.negative.json` | 2 | 5.3 | negative |
| `part-02-registration-discovery/agent-id-non-reuse.negative.json` | 2 | 5.1 | negative |
| `part-02-registration-discovery/workload-proof-profile.positive.json` | 2 | 5.5 | positive |
| `part-02-registration-discovery/workload-proof-profile-unknown-version.negative.json` | 2 | 5.5 | negative |
| `part-02-registration-discovery/registry-context-single-snapshot.positive.json` | 2 | 7.4 | positive |
| `part-02-registration-discovery/registry-context-inconsistent.negative.json` | 2 | 7.4 | negative |
| `part-02-registration-discovery/event-stream-not-authoritative.negative.json` | 2 | 7.5 | negative |
| `part-03-authentication/enrollment-success.positive.json` | 3 | 4 | positive |
| `part-03-authentication/enrollment-challenge-single-use.negative.json` | 3 | 4.2 | negative |
| `part-03-authentication/token-issuance-success.positive.json` | 3 | 5.3 | positive |
| `part-03-authentication/token-audience-binding.negative.json` | 3 | 5.1 | negative |
| `part-03-authentication/token-epoch-mismatch.negative.json` | 3 | 5.4 | negative |
| `part-03-authentication/request-level-pop.negative.json` | 3 | 5.4 | negative |
| `part-03-authentication/enrollment-proof-binding.negative.json` | 3 | 4.3 | negative |
| `part-03-authentication/credential-generation-supersede.negative.json` | 3 | 5.5 | negative |
| `part-03-authentication/revocation-freshness-online.negative.json` | 3 | 7.2 | negative |
| `part-04-authorization/decision-allow-derives-grant.positive.json` | 4 | 4.3 | positive |
| `part-04-authorization/decision-deny-blocks-grant.negative.json` | 4 | 4.2 | negative |
| `part-04-authorization/delegation-non-amplification.positive.json` | 4 | 5.1 | positive |
| `part-04-authorization/delegation-non-amplification.negative.json` | 4 | 5.1 | negative |
| `part-04-authorization/revocation-freshness-pre-dispatch.negative.json` | 4 | 7 | negative |
| `part-04-authorization/prompt-injection-cannot-expand.negative.json` | 4 | 8.2 | negative |
| `part-04-authorization/grant-binding-verification.negative.json` | 4 | 4.3 | negative |
| `part-05-federation/trust-disable.negative.json` | 5 | 6 | negative |
| `part-05-federation/principal-isolation.negative.json` | 5 | 4 | negative |
| `part-05-federation/brokered-token-forged-field.negative.json` | 5 | 5 | negative |
| `part-05-federation/active-trust-verification.positive.json` | 5 | 5 | positive |
| `part-06-audit/reject-event-persisted.positive.json` | 6 | 5 | positive |
| `part-06-audit/event-redaction.negative.json` | 6 | 5 | negative |
| `part-06-audit/transaction-consistency.positive.json` | 6 | 6 | positive |
| `part-07-conformance/claim-missing-part.negative.json` | 7 | 5 | negative |
| `part-07-conformance/claim-federated-complete.positive.json` | 7 | 5 | positive |

## Requirements

- Every vector must name the part and the clause it exercises.
- Negative vectors are mandatory for each security-critical clause.
- Vectors must be language-neutral and reproducible.
- Where behavior depends on a profile, the vector must state the profile and version.

## Planned coverage

| Area | Part | Positive | Negative |
|---|---|---|---|
| Agent ID uniqueness and non-reuse | 2 | required | required |
| Authority Binding immutability | 2 | required | required |
| Registry Context single-snapshot consistency | 2 | required | required |
| Event stream is cache-invalidation only | 2 | — | required |
| Lifecycle epoch monotonicity | 2 | required | required |
| Discovery document resolution and caching | 2 | required | required |
| Discovery SSRF target rejection | 2 | required | required |
| Enrollment challenge single use | 3 | required | required |
| Enrollment proof binding | 3 | required | required |
| Token audience binding | 3 | required | required |
| Request-level PoP | 3 | required | required |
| Credential generation and re-enrollment | 3 | required | required |
| Decision and Grant binding | 4 | required | required |
| Delegation non-amplification | 4 | required | required |
| Prompt injection cannot expand a grant | 4 | required | required |
| Revocation freshness classes | 1, 3, 4 | required | required |
| Federation trust disable | 5 | required | required |
| Cross-domain principal isolation | 5 | required | required |
| Security event redaction | 6 | required | required |
| Composite profile claim completeness | 7 | required | required |

## Cross-repository fixtures

The abstract vectors above state *what* must hold. For Parts 3–7, executable
fixtures under [`cross-repo/`](cross-repo/README.md) state *how to check it*
against an implementation's published contract surface: an HTTP-shaped
`operation`, the preconditions to establish, and the expected outcome. They are
owned by this repository and executed by each implementation, per the
dependency direction recorded in the reference implementations' governance
(see [`../mappings/nomivela-eidovela-aegivela.md`](../mappings/nomivela-eidovela-aegivela.md)).
