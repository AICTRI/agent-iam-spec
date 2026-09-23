# Coverage Matrix

Informative. Maps each part to its schemas, vectors, and examples. Regenerate and
review when adding artifacts; `node conformance/validate.mjs` verifies consistency.

| Part | Schemas | OpenAPI | Request schemas | Vectors (pos / neg) | Examples |
|---|---|---|---|---|---|
| 1 Architecture | — | — | — | shared vocabulary | — |
| 2 Registration & Discovery | agent-identity, agent-instance, authority-binding, workload-registration, discovery-document | registry-discovery | — | 3 / 4 | twin-agent-onboarding |
| 3 Authentication | identity-token, enrollment-proof | identity-sts | challenge, enrollment, token | 2 / 4 | twin-agent-onboarding, revocation-propagation |
| 4 Authorization | policy-decision, execution-grant | authorization | decision, grant, exchange, revocation | 2 / 4 | service-agent-high-risk-action, delegated-cross-domain, revocation-propagation |
| 5 Federation | federation-trust | federation | — | 0 / 3 | delegated-cross-domain, federation-trust-lifecycle |
| 6 Audit | security-event | — | — | 2 / 1 | federation-trust-lifecycle |
| 7 Conformance | — | — | — | 0 / 1 | — |

Totals: 26 vectors (9 positive, 17 negative), 11 record schemas, 7 request schemas,
4 OpenAPI documents.

## Vectors by part

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

### Part 3

| Vector | Clause | Kind |
|---|---|---|
| enrollment-success.positive | 4 | positive |
| enrollment-challenge-single-use.negative | 4.2 | negative |
| token-issuance-success.positive | 5.3 | positive |
| token-audience-binding.negative | 5.1 | negative |
| token-epoch-mismatch.negative | 5.4 | negative |
| request-level-pop.negative | 5.4 | negative |

### Part 4

| Vector | Clause | Kind |
|---|---|---|
| decision-allow-derives-grant.positive | 4.3 | positive |
| decision-deny-blocks-grant.negative | 4.2 | negative |
| delegation-non-amplification.positive | 5.1 | positive |
| delegation-non-amplification.negative | 5.1 | negative |
| revocation-freshness-pre-dispatch.negative | 7 | negative |
| prompt-injection-cannot-expand.negative | 8.2 | negative |

### Parts 5-7

| Vector | Part | Clause | Kind |
|---|---|---|---|
| trust-disable.negative | 5 | 6 | negative |
| principal-isolation.negative | 5 | 4 | negative |
| brokered-token-forged-field.negative | 5 | 5 | negative |
| reject-event-persisted.positive | 6 | 5 | positive |
| event-redaction.negative | 6 | 5 | negative |
| transaction-consistency.positive | 6 | 6 | positive |
| claim-missing-part.negative | 7 | 5 | negative |

## Gaps

- Part 1 shared rules are exercised indirectly through Parts 2-6 vectors; no Part 1-only vectors yet.
- Part 5 has no positive vectors yet (active trust verification, successful brokered exchange).
- No JSON instance fixtures that validate records against the record schemas yet.
