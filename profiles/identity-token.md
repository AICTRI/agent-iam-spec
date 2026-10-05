# Profile: Identity Token

- Profile identifier: `agent-iam-profile-identity-token`
- Applies to: Part 3 `agent-iam-3-authentication`
- Series version: `0.4.1-draft`
- Status: Draft (normative when published)
- Language: English is normative. A Chinese translation, when present, is an equivalent translation.

This Profile narrows Part 3 Sections 5 and 7. It does not relax any `MUST` or `MUST NOT`
in Part 3. Where this Profile and Part 3 conflict, Part 3 governs.

## 1. Scope

It defines the interoperable shape, `typ`, issuance conditions, verification, and
revocation freshness of an **Agent identity Token** — the short-lived,
audience-bound, sender-constrained credential that a resource server verifies to
learn *who is calling and the current identity state*. An identity Token never
carries authorization; that is Part 4.

## 2. Token type

The Token `typ` MUST be `agent-iam-identity+jwt` for a local Token and
`agent-iam-brokered-identity+jwt` for a federated/brokered Token. An
implementation MUST pin the expected `typ` per endpoint (Part 3 §8.3) and MUST NOT
accept an identity Token where an enrollment proof, token-request proof, policy
decision, or execution grant is expected.

The signing algorithm MUST be pinned. The Profile default is `EdDSA` (Ed25519)
with a `kid` that resolves through the issuer's JWKS.

## 3. Required claims

A local identity Token MUST contain:

| Claim | Requirement |
|---|---|
| `iss` | Canonical issuer URI; if the namespace is derived from `iss`, the mapping MUST be unique and canonical. |
| `sub` | The Agent ID or an instance subject explicitly defined by this Profile. |
| `aud` | Exactly one registered audience, compared as a normalized exact string. |
| `iat`, `exp` | `exp - iat` MUST NOT exceed the deployment maximum Token lifetime; the recommended maximum is 10 minutes. |
| `jti` | Unique per Token, used for replay and revocation correlation. |
| `namespace` | Canonical Authority Namespace (Part 1 §6.2). |
| `agentClass` | One of the Part 2 nine-class vocabulary. |
| `instanceId` | The Agent Instance. |
| `workloadId` | The Workload Registration. |
| `authorityRootRef` | The immutable Authority Root reference. |
| `agentEpoch` | The Agent business lifecycle epoch. |
| `identityEpoch` | The Agent ID security lifecycle epoch. |
| `cnf` | `cnf.jkt` (RFC 7638 SHA-256 thumbprint) or an equivalent confirmation method. |
| `credentialGeneration` | The enrollment generation that issued the credential. |

A brokered Token MUST additionally carry an unambiguous external `iss` and `sub`,
and a federation trust/version reference. It MUST NOT forge `agentClass`,
`instanceId`, `workloadId`, `authorityRootRef`, or either epoch (Part 5 §5).

`tenant` MUST NOT appear as a required claim (RFC-0003).

## 4. Issuance conditions

In addition to Part 3 §5.3, the issuer MUST:

1. reject issuance when either `agentEpoch` or `identityEpoch` is stale relative
   to authoritative registry state;
2. reject issuance when the credential generation is not the active generation;
3. reject issuance when the requested `aud` is not registered for the Agent or
   Instance;
4. commit the token-request proof JTI consumption and the issuance decision
   atomically within the namespace.

## 5. Verification

### 5.1 Offline

Offline verification MAY check signature, pinned `typ`, `iss`, normalized `aud`,
`iat`/`exp` within clock skew, format, and a verified PoP context. It MUST NOT
claim real-time revocation capability and MUST NOT treat a presented JWK or
thumbprint as proof of possession.

### 5.2 Online (authoritative)

Authoritative verification MUST check the current Agent state and both epochs,
the Instance state and lease, the credential state and generation, and
namespace-scoped revocation selectors. Introspection, when used, MUST only accept
authenticated and authorized resource servers, MUST return `cnf`, and SHOULD hide
the specific failure reason behind a uniform inactive result while recording a
categorized reason in controlled evidence.

### 5.3 Request proof

Resource-request PoP MUST be verified by the PEP (DPoP per RFC 9449, HTTP Message
Signatures, mTLS, or an equivalent Profile) and the verified key binding passed to
the Token verifier. A DPoP verifier MUST validate `htm`, `htu`, `iat`, `jti`, and,
where present, `ath` and the server nonce.

## 6. Revocation freshness

Revocation checks MUST use the Part 1 §6.3 freshness classes. Authoritative
verification uses `pre_dispatch` or `continuation` semantics. When a revocation
dependency is unavailable the check MUST reject.

## 7. Conformance

Positive and negative vectors:

- `../conformance/part-03-authentication/token-issuance-success.positive.json`
- `../conformance/part-03-authentication/token-audience-binding.negative.json`
- `../conformance/part-03-authentication/token-epoch-mismatch.negative.json`
- `../conformance/part-03-authentication/request-level-pop.negative.json`
- `../conformance/cross-repo/part-03-authentication/p3-token-audience-binding.json`
- `../conformance/cross-repo/part-03-authentication/p3-token-epoch-mismatch.json`
- `../conformance/cross-repo/part-03-authentication/p3-pop-proof-replay.json`
- `../conformance/cross-repo/part-03-authentication/p3-credential-generation-rotation.json`

An implementation claiming this Profile MUST pass every vector above.

## 8. References

- RFC 7638 — JSON Web Key (JWK) Thumbprint (Standards Track).
- RFC 9449 — OAuth 2.0 Demonstrating Proof of Possession (DPoP) (Standards Track).
- RFC 7662 — OAuth 2.0 Token Introspection (Standards Track).
- Part 1 §6.2 canonicalization, §6.3 revocation freshness.
- RFC-0003 `Contract Naming and Identity Conventions`.
