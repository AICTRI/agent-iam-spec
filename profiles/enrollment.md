# Profile: Enrollment and Workload Attestation

- Profile identifier: `agent-iam-profile-enrollment`
- Applies to: Part 3 `agent-iam-3-authentication`
- Series version: `0.3.0-draft`
- Status: Draft (normative when published)
- Language: English is normative. A Chinese translation, when present, is an equivalent translation.

This Profile narrows Part 3 Section 4 (and the challenge/attestation parts of
Sections 5.5, 7, and 8). It does not relax any `MUST` or `MUST NOT` in Part 3.

## 1. Scope

It defines how a workload enrolls as an Agent Instance and obtains a credential
generation: the challenge, the enrollment proof of possession, the three-phase
attestation model, the supported attestation Profiles, and the credential
lifecycle. Registration and lifecycle authority remain in Part 2.

## 2. Challenge

An enrollment challenge MUST be namespace-scoped, unpredictable, single-use, and
bound to the Agent ID, Workload Registration, and expected audience. The default
maximum validity is 5 minutes. Consumption MUST be atomic within the namespace and
MUST be recorded before a credential is issued.

## 3. Enrollment proof of possession

When the project-defined Enrollment JWT proof is used, it MUST bind at least:

- `iss = agentId`;
- `sub = agentId` or the instance subject defined by this Profile;
- the expected `aud`;
- the challenge ID and nonce;
- `iat`, `exp`, and a single-use `jti`.

The verifier MUST pin allowed algorithms, reject unknown `kid`, duplicate JSON
members, unknown critical claims, duplicate claims, excessive validity periods,
and replay. The proof JTI MUST be consumed atomically within the namespace.

This Profile draws on RFC 7523 assertion handling but defines its own challenge,
nonce, claims, and HTTP transport. It MUST NOT be presented as OAuth
`private_key_jwt` client authentication. An implementation claiming RFC 7523
interoperability MUST additionally implement `clientAssertion_type`,
`clientAssertion`, the client identifier, endpoint, and error responses of that
RFC.

## 4. Three-phase attestation

The system MUST distinguish, in order:

1. **Cryptographic verification** of the evidence: certificate chain or JWT
   signature, issuer, audience, and validity period;
2. **Attribute normalization**: derive namespace, ServiceAccount, SPIFFE ID,
   certificate digest, and similar attributes only from verified evidence;
3. **Selector authorization**: exactly match the derived attributes against the
   pre-registered selector.

PEM, JWT, or attribute JSON submitted by the caller MUST NOT be treated as
verified proof. Unknown proof methods MUST fail closed.

## 5. Attestation Profiles

### 5.1 `spiffe`

Validate the X.509-SVID or JWT-SVID, the trust domain, and the unique SPIFFE URI.
The trust bundle MUST be pinned to an expected trust anchor.

### 5.2 `k8s_projected_sa`

Validate the signature, issuer, audience, time, and subject of the projected
ServiceAccount token against the cluster JWKS. The audience MUST equal the
enrollment audience exactly.

### 5.3 `mtls`

Validate the certificate chain, validity period, `ClientAuth` EKU, and expected
trust anchor. The bound identity MUST be derived from the verified chain.

### 5.4 `private_key_jwt`

Validate the assertion signature against the registered key and bind it to the
challenge. This Profile is the enrollment proof class, not RFC 7523 client
authentication.

### 5.5 RATS/EAT

When RATS/EAT is used, Evidence and Attestation Result MUST be distinguished per
RFC 9334 and RFC 9711.

A Workload Registration MAY carry a versioned proof profile
(`proofRequirements`) that is authoritative over a bare allowed-methods list. It
MUST declare a schema version, at least one versioned method, and a selector
schema version.

## 6. Credential lifecycle

A credential MUST bind the Agent, the Instance, and an explicit enrollment
generation. Re-enrollment MUST establish a strictly greater generation and MUST
make the previous generation unusable for new issuance. When immediate instance
revocation is claimed, Tokens issued under a revoked generation MUST be inactive
at the next online verification.

## 7. Conformance

- `../conformance/part-03-authentication/enrollment-success.positive.json`
- `../conformance/part-03-authentication/enrollment-challenge-single-use.negative.json`
- `../conformance/cross-repo/part-03-authentication/p3-enrollment-success.json`
- `../conformance/cross-repo/part-03-authentication/p3-enrollment-challenge-single-use.json`
- `../conformance/cross-repo/part-03-authentication/p3-credential-generation-rotation.json`

An implementation claiming this Profile MUST pass every vector above.

## 8. References

- RFC 7523 — JWT Profile for OAuth 2.0 Client Authentication and Authorization Grants (Standards Track).
- RFC 9334 — RATS Architecture (Standards Track).
- RFC 9711 — Entity Attestation Token (Standards Track).
- SPIFFE X.509-SVID and JWT-SVID specifications (external).
- Kubernetes projected ServiceAccount token documentation (external).
- Part 2 (registration and Workload Registration), Part 3 §4–5.
