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

| Area | Positive | Negative |
|---|---|---|
| Agent ID uniqueness and non-reuse | required | required |
| Authority Binding immutability | required | required |
| Lifecycle epoch monotonicity | required | required |
| Enrollment challenge single use | required | required |
| Enrollment proof binding | required | required |
| Token audience binding | required | required |
| Request-level PoP | required | required |
| Delegation non-amplification | required | required |
| Revocation freshness classes | required | required |
| Federation trust disable | required | required |
| Security event redaction | required | required |
