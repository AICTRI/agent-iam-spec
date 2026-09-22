# Conformance

Conformance test vectors and fixtures for the `Agent IAM Series`.

Licensed under Apache-2.0. See `../LICENSE-CODE`.

## Status

No test vectors have been published yet.

## Layout

```text
conformance/
├── part-02-registration-discovery/
├── part-03-authentication/
├── part-04-authorization/
├── part-05-federation/
└── negative/
```

The series composite profiles (`Identity`, `Authorization`, `Federated`) defined in
`../spec/part-07-conformance/` compose per-part vectors.

## Requirements

- Every vector must name the part, the conformance level, and the clause it exercises.
- Negative vectors are mandatory for each security-critical clause.
- Vectors must be language-neutral and reproducible.
- Where behavior depends on a profile, the vector must state the profile and version.

## Planned coverage

| Area | Part | Positive | Negative |
|---|---|---|---|
| Agent ID uniqueness and non-reuse | 2 | required | required |
| Authority Binding immutability | 2 | required | required |
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
