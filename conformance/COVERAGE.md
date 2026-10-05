# Coverage Matrix

Informative. Maps each part to its schemas, vectors, and examples. Regenerate and
review when adding artifacts; `node conformance/validate.mjs` verifies consistency.

| Part | Schemas | OpenAPI | Request schemas | Vectors (pos / neg) | Examples |
|---|---|---|---|---|---|
| 1 Architecture | — | — | — | 1 / 1 | — |
| 2 Registration & Discovery | agent-identity, agent-instance, authority-binding, workload-registration, discovery-document | registry-discovery | — | 5 / 9 | twin-agent-onboarding |
| 3 Authentication | identity-token, enrollment-proof | identity-sts | challenge, enrollment, token | 2 / 7 | twin-agent-onboarding, revocation-propagation |
| 4 Authorization | policy-decision, execution-grant | authorization | decision, grant, exchange, approval, revocation | 2 / 5 | service-agent-high-risk-action, delegated-cross-domain, revocation-propagation |
| 5 Federation | federation-trust | federation | brokered verification, trust update | 1 / 3 | delegated-cross-domain, federation-trust-lifecycle |
| 6 Audit | security-event | audit | — | 2 / 1 | federation-trust-lifecycle |
| 7 Conformance | — | — | — | 1 / 1 | — |

Totals: 41 vectors (14 positive, 27 negative), 11 record schemas, 10 request schemas,
5 OpenAPI documents.

## Cross-repository fixtures (Parts 3–7)

Executable fixtures under `conformance/cross-repo/`; see its `manifest.json`.

| Part | Fixtures | Positive | Negative |
|---|---|---|---|
| 3 Authentication | 9 | 3 | 6 |
| 4 Authorization | 7 | 3 | 4 |
| 5 Federation | 5 | 2 | 3 |
| 6 Audit | 3 | 2 | 1 |
| 7 Conformance | 3 | 2 | 1 |
| **Total** | **27** | **12** | **15** |

## Vectors by part

### Part 1

| Vector | Clause | Kind |
|---|---|---|
| canonical-digest.positive | 6.2 | positive |
| revocation-freshness-pre-dispatch.negative | 6.3 | negative |

### Part 2

| Vector | Clause | Kind |
|---|---|---|
| agent-id-uniqueness.positive | 5.1 | positive |
| agent-id-uniqueness.negative | 5.1 | negative |
| lifecycle-transition.positive | 6.2 | positive |
| lifecycle-epoch-monotonicity.negative | 6.2 | negative |
| discovery-success.positive | 8 | positive |
| discovery-stale-metadata.negative | 8.3 | negative |
| discovery-ssrf.negative | 8.4 | negative |
| authority-binding-immutability.negative | 5.3 | negative |
| agent-id-non-reuse.negative | 5.1 | negative |
| workload-proof-profile.positive | 5.5 | positive |
| workload-proof-profile-unknown-version.negative | 5.5 | negative |
| registry-context-single-snapshot.positive | 7.4 | positive |
| registry-context-inconsistent.negative | 7.4 | negative |
| event-stream-not-authoritative.negative | 7.5 | negative |

### Part 3

| Vector | Clause | Kind |
|---|---|---|
| enrollment-success.positive | 4 | positive |
| enrollment-challenge-single-use.negative | 4.2 | negative |
| token-issuance-success.positive | 5.3 | positive |
| token-audience-binding.negative | 5.1 | negative |
| token-epoch-mismatch.negative | 5.4 | negative |
| request-level-pop.negative | 5.4 | negative |
| enrollment-proof-binding.negative | 4.3 | negative |
| credential-generation-supersede.negative | 5.5 | negative |
| revocation-freshness-online.negative | 7.2 | negative |

### Part 4

| Vector | Clause | Kind |
|---|---|---|
| decision-allow-derives-grant.positive | 4.3 | positive |
| decision-deny-blocks-grant.negative | 4.2 | negative |
| delegation-non-amplification.positive | 5.1 | positive |
| delegation-non-amplification.negative | 5.1 | negative |
| revocation-freshness-pre-dispatch.negative | 7 | negative |
| prompt-injection-cannot-expand.negative | 8.2 | negative |
| grant-binding-verification.negative | 4.3 | negative |

### Parts 5-7

| Vector | Part | Clause | Kind |
|---|---|---|---|
| trust-disable.negative | 5 | 6 | negative |
| principal-isolation.negative | 5 | 4 | negative |
| brokered-token-forged-field.negative | 5 | 5 | negative |
| active-trust-verification.positive | 5 | 5 | positive |
| reject-event-persisted.positive | 6 | 5 | positive |
| event-redaction.negative | 6 | 5 | negative |
| transaction-consistency.positive | 6 | 6 | positive |
| claim-missing-part.negative | 7 | 5 | negative |
| claim-federated-complete.positive | 7 | 5 | positive |

## Gaps

- No successful brokered token exchange in the abstract vectors yet; Part 5 abstract coverage verifies active trust, while the executable fixture `cross-repo/part-05-federation/p5-brokered-exchange-success.json` covers the success path.
- All 11 record schemas and 10 request schemas have a valid JSON fixture. Expected-invalid fixtures cover extra fields, missing discovery metadata, missing PoP confirmation, and a missing federation key source.
