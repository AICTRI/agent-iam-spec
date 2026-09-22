# Example: Revocation Propagation

Informative. If this example conflicts with `../spec/part-*/`, the specification governs.

## Scenario

An Agent is suspended, an instance is terminated, a grant is revoked, and the effects
of each are checked under the correct freshness class.

## Flow (Parts 1, 3, 4)

```text
suspend Agent        -> lifecycle_epoch increases (Part 2 Section 6.2)
terminate Instance   -> tokens inactive at next online verification (Part 3)
revoke Grant JTI     -> pre_dispatch / continuation checks (Part 4)
```

## 1. Lifecycle and credential revocation (Parts 2 and 3)

A suspend transition strictly increases `lifecycle_epoch`; authoritative online
verification requires the token epoch to equal the current Agent epoch. Credential and
Instance selectors are namespace-scoped (Part 3 Section 7). Instance termination makes
already-issued tokens inactive at the next authoritative online verification; offline
verification cannot provide this guarantee.

## 2. Authorization artifact revocation (Part 4)

Revocation selectors include Decision JTI, Grant JTI, Approval JTI, policy version, and
resource/implementation digest. Sensitive selectors are persisted as domain-separated
digests.

## 3. Freshness classes (Part 1 Section 6.3)

| Class | Check |
|---|---|
| `pre_dispatch` | authoritative check before the effect; no negative cache |
| `continuation` | check at every external effect boundary; no negative cache |
| `connection` | bounded negative cache, not exceeding artifact lifetime |

When a revocation dependency is unavailable, the check MUST be rejected. Offline or
degraded modes MUST NOT be used for credential injection, authority expansion, new
targets, or high-risk destructive actions. A negative-cache reuse in a `pre_dispatch`
path is rejected, as exercised by
`../conformance/part-04-authorization/revocation-freshness-pre-dispatch.negative.json`.
