[English](agent-iam-3-authentication.md) · [简体中文](../zh-CN/agent-iam-3-authentication.md)

# Agent IAM Series — Part 3: Identity and Authentication

- Series identifier: `agent-iam-series`
- Part identifier: `agent-iam-3-authentication`
- Version: `0.1.0-draft`
- Date: 2026-09-22
- Status: Project draft, not an international, national, or industry standard
- License: CC BY 4.0 (specification text)

This part specifies how an Agent Instance is authenticated as a specific Agent Identity, and how authentication artifacts are issued, verified, and revoked. It consumes the records defined in Part 2 and produces the `Verified Agent Identity Context` consumed by Part 4.

## 1. Scope

This part specifies:

- the output of authentication: the `Verified Agent Identity Context`;
- enrollment and workload attestation;
- proof of possession and identity tokens, including token request proofs and issuance conditions;
- online and offline verification;
- the authorization-mode proof requirements;
- credential lifecycle and key rotation;
- authentication-scope revocation;
- authentication security.

Authorization decisions, grants, and delegation are specified in Part 4. Cross-domain federation is specified in Part 5.

## 2. Normative References

- Part 1 defines terms, trusted-data-source rules, fail-closed behavior, canonicalization, and the revocation freshness vocabulary.
- Part 2 defines the Agent Identity Record, Agent Instance, Workload Registration, lifecycle state and epoch, and discovery.
- Part 4 consumes the authentication output defined here.
- Part 6 defines the security event envelope.

## 3. Authentication Output

Authentication MUST produce a `Verified Agent Identity Context` that includes at least:

```text
namespace
agent_id
agent_class
instance_id
workload_id
authority_root_ref
lifecycle_epoch
attestation_status
credential_status
revocation_status
```

The context MUST be derived exclusively from verified evidence and authoritative records. Part 4 MUST consume this context and MUST NOT re-derive its fields from caller-supplied values.

## 4. Enrollment and Workload Attestation

### 4.1 General Flow

```text
1. Register the Agent and the immutable Authority Binding
2. Register the allowed workload selector and trust domain
3. Issue a short-lived, single-use enrollment challenge
4. Verify the cryptographic authenticity of the workload evidence
5. Normalize the verified attributes and match the selector
6. Verify the Agent's proof of possession of the private key
7. Atomically create the credential, instance, state transition, and evidence
```

Steps 1 and 2 are specified in Part 2 (Registration).

### 4.2 Challenge

An enrollment challenge MUST:

- be namespace-scoped;
- have an unpredictable nonce;
- have a maximum validity period, recommended not to exceed 5 minutes;
- be single-use and consumed atomically;
- bind the Agent ID, Workload Registration, and expected audience.

### 4.3 Enrollment JWT Proof of Possession

When using the project-defined Enrollment JWT proof, the proof MUST bind at least:

- `iss = agent_id`;
- `sub = agent_id` or the instance subject specified by the Profile;
- the expected `aud`;
- challenge ID;
- nonce;
- `iat` and `exp`;
- a single-use `jti`.

The Verifier MUST pin the allowed algorithms and reject unknown `kid`, duplicate claims, excessively long validity periods, and replay.

This mechanism draws on the JWT assertion handling of RFC 7523, but its challenge, nonce, claims, and HTTP transport binding belong to this Profile, and it does not claim to conform to OAuth `private_key_jwt` client authentication. If an implementation claims RFC 7523 interoperability, it MUST also implement the `client_assertion_type`, `client_assertion`, client identifier, endpoint, and error responses specified by that RFC.

### 4.4 Three Phases of Attestation

The system MUST distinguish:

1. Cryptographic verification of evidence: certificate chain, JWT signature, issuer, audience, validity period;
2. Attribute normalization: derive attributes such as namespace, ServiceAccount, SPIFFE ID, and certificate digest only from verified evidence;
3. Selector authorization: exactly match the derived attributes against the pre-registered selector.

PEM, JWT, or attribute JSON submitted by the caller MUST NOT be directly treated as "verified proof." Unknown proof methods MUST fail closed.

### 4.5 Supported Attestation Profiles

- SPIFFE: SHOULD validate the X.509-SVID/JWT-SVID, trust domain, and unique SPIFFE URI;
- Kubernetes: MUST validate the signature, issuer, audience, time, and subject of the projected ServiceAccount token;
- mTLS: MUST validate the certificate chain, validity period, ClientAuth EKU, and expected trust anchor;
- RATS/EAT: when used, SHOULD follow RFC 9334 and RFC 9711, and distinguish Evidence from Attestation Result.

## 5. Proof of Possession and Identity Tokens

### 5.1 PoP Requirements

Production credentials SHOULD use proof-of-possession. A local Agent identity Token MUST contain:

```text
iss, sub, aud, iat, exp, jti
namespace (canonical) and/or a namespace-scoped iss
agent_class
instance_id
workload_id
authority_root_ref
lifecycle_epoch
cnf.jkt or equivalent confirmation
```

If the namespace is derived from `iss`, the mapping MUST be unique and canonical. A Federated/Brokered Token MUST use an independent `typ` and carry an unambiguous external issuer, external subject, and federation trust/version reference; it MUST NOT forge local `agent_class`, `instance_id`, `workload_id`, `authority_root_ref`, or lifecycle epoch.

Identity Tokens, Enrollment proofs, Token request proofs, Policy Decisions, and Execution Grants MUST use different and fixed `typ` or equivalent artifact types. The Verifier MUST pin the allowed types per endpoint to prevent Token substitution.

Static API keys and long-lived bearer secrets MUST NOT be used as an Agent's primary identity credential.

### 5.2 Token Request Proof

A Token request proof MUST bind the Agent, Instance, Token endpoint audience, the requested target Token audience, time, and a single-use JTI. It MAY also bind a normalized Token request digest that includes the target audience. The JTI MUST be consumed atomically within the namespace. An implementation MUST specify a maximum proof lifetime and MUST NOT only check `exp > now`.

### 5.3 Issuance Conditions

The issuer MUST check:

- The Agent is `active`;
- The Instance belongs to the same namespace and Agent;
- The Instance state permits issuance and the lease has not expired;
- The proof key corresponds to an active credential;
- The audience is registered and matches exactly;
- Workload and attestation requirements still satisfy policy.

### 5.4 Online and Offline Verification

Offline verification MAY check the signature, issuer, audience, time, format, and verified PoP context, but MUST NOT claim to have real-time revocation capability. Submitting a public key, JWK, or thumbprint does not by itself constitute proof of key possession.

The PoP of a resource request MUST be verified by the PEP via DPoP, HTTP Message Signatures, mTLS, or an equivalent Profile, and then the verified key binding is passed to the Token verifier. When adopting the RFC 7662 introspection mode, the introspection endpoint MUST only accept calls from authenticated and authorized resource servers, and MUST return `cnf`; the PoP of the actual resource request is still verified by the resource server. Every adopted PoP Profile MUST define request binding, Token binding, replay cache scope, maximum clock skew, and error handling.

Authoritative online verification MUST additionally check:

- The Agent's current state and epoch;
- The Instance state and lease;
- The credential state;
- Namespace-scoped revocation selectors.

Externally, introspection SHOULD hide the specific failure reason behind a uniform inactive result, while recording the categorized reason in controlled evidence.

### 5.5 Credential Lifecycle

A Credential MUST bind the Agent, Instance, and an explicit enrollment generation. Re-enrollment MUST establish a new generation and cause the old generation to be unusable for new issuance. If an implementation allows old Tokens to continue to verify before expiry, it MUST state this in its conformance claim; when immediate instance revocation is claimed, old Tokens MUST be inactive at the next online verification.

### 5.6 Key Rotation

When a signing key is rotated, the verification overlap window for the old public key MUST cover at least:

```text
maximum Token lifetime + allowed clock skew + publication propagation delay
```

High-assurance deployments SHOULD keep private keys in an HSM, KMS, TPM, or equivalent isolated environment, and use mutually independent signing domains for identity Tokens, Policy Decisions, Execution Grants, Approvals, Attestation, and Workload Assertions.

## 6. Authorization-Mode Proof Requirements

Each authorization mode defined in Part 4 requires a specific proof. The proof requirements are:

| Mode | Required Proof |
|---|---|
| `human_web` | OIDC authorization code flow and appropriate assurance |
| `system_api` | client + workload proof |
| `delegated_api` | user delegation + client/workload proof |
| `service_agent_api` | Agent identity + workload + epoch |
| `twin_agent_api` | immutable master binding + workload + epoch |

The authority source for each mode, and the rule that modes MUST NOT substitute for one another, are specified in Part 4.

## 7. Revocation (Authentication Scope)

### 7.1 Selectors

Revocation MAY be performed by namespace-scoped selector, including:

- Agent, Instance, credential, or lifecycle epoch;
- Workload Binding or attestation reference.

Sensitive selectors SHOULD be persisted as digests with domain separation.

### 7.2 Freshness

Revocation checks MUST use the freshness classes defined in Part 1 Section 6.3. When a revocation dependency is unavailable, the check MUST be rejected.

## 8. Security Considerations

### 8.1 Replay

Challenges, Token proofs, and high-value requests MUST use short-lived nonce/JTI and consume them atomically within the appropriate scope. DPoP MUST validate `htm`, `htu`, `iat`, and `jti` per RFC 9449, and validate `ath` and the server nonce when applicable. An HTTP Message Signatures Profile MUST specify the covered components; when message content is present, `content-digest` SHOULD be covered, and depending on the routing model, `@method`, `@authority`, and either `@target-uri` or equivalent components SHOULD be covered.

### 8.2 Claim and Parsing Security

The Verifier MUST, before semantic processing, reject duplicate JSON members, unknown critical claims, algorithm downgrade, unknown `kid`, oversized artifacts, and non-canonical resource representations. Structured resources MUST adopt the deterministic canonicalization and digest specified in Part 1 Section 6.2.

### 8.3 Token Substitution

Artifact types MUST be pinned per endpoint (Section 5.1). A verifier MUST NOT accept an artifact of one type where another is expected.

## Appendix A. Migration Source (Informative)

| Current clauses | Mapped here |
|---|---|
| §9 Enrollment and attestation | Section 4 |
| §10 Identity credentials and tokens | Sections 3, 5 |
| §11.2 authorization-mode "required proof" column | Section 6 |
| §15 (agent/instance/credential/epoch selectors) | Section 7 |
| §18.1 replay, §18.4 claim parsing | Section 8 |
