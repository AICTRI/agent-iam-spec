# Example: Federation Trust Lifecycle

Informative. If this example conflicts with `../spec/part-*/`, the specification governs.

## Scenario

`acme` (`https://id.example.com/org/acme`) interoperates with partner `globex`
(`https://id.globex.example/org/globex`). A brokered token from Globex is verified
locally, then the trust is disabled and verification must fail closed.

## 1. Establish trust (Part 5 Section 3)

A Federation Trust MUST be namespace-scoped and preserve the peer Authority Namespace.

```json
{
  "namespace": "https://id.example.com/org/acme",
  "peer_issuer": "https://id.globex.example/org/globex",
  "jwks_uri": "https://id.globex.example/org/globex/jwks",
  "allowed_audiences": ["https://api.example.com/partners"],
  "claim_mapping": { "sub": "sub", "agent_class": "agent_class" },
  "pop_requirements": ["dpop"],
  "trust_status": "active",
  "key_refresh": { "max_stale_seconds": 3600, "refresh_interval_seconds": 300 }
}
```

Peer claims MUST NOT specify or override the local namespace.

## 2. Verify a brokered token (Part 5 Section 5)

Verification checks trust status, signature, known `kid`, issuer, audience, time, PoP,
and claim mapping. The brokered token uses an independent `typ` and carries the external
issuer/subject and the federation trust/version reference; it MUST NOT forge local
`agent_class`, `instance_id`, `workload_id`, `authority_root_ref`, or lifecycle epoch.

The broker presents a distinct namespace that does not collide with local Agent IDs
(Part 5 Section 4). The local namespace is not flattened into the peer's.

## 3. Disable trust (Part 5 Section 6)

```json
{
  "namespace": "https://id.example.com/org/acme",
  "peer_issuer": "https://id.globex.example/org/globex",
  "trust_status": "disabled"
}
```

After the trust is disabled, the next authoritative online verification MUST fail closed
with `trust-disabled`. Merely waiting for the local token to expire does not satisfy the
requirement. This is exercised by
`../conformance/part-05-federation/trust-disable.negative.json`.

## 4. Evidence correlation (Part 6)

Both sides record security events with a shared `trace_id` so the brokered flow can be
correlated without merging the federated principal into a local Agent Identity.
