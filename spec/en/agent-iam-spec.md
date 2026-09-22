[English](agent-iam-spec.md) · [简体中文](../zh-CN/agent-iam-spec.md)

# Agent Identity and Access Management Technical Specification (Draft)

Version: 0.1.0-draft  
Date: 2026-09-22  
Status: Project standard draft; not an international, national, or industry standard  
Specification identifier: `agent-iam-spec`  
License: CC BY 4.0 (specification text); Apache-2.0 (Schema, code, and conformance tooling)  
Repository: <https://github.com/AICTRI/agent-iam-spec>

This English text is the primary normative text. The [Chinese text](../zh-CN/agent-iam-spec.md) is an equivalent translation. If the two texts conflict, this English text governs.


## 1. Scope

This document specifies requirements for the identification, registration, authority attribution, workload binding, enrollment, authentication, authorization, delegation, revocation, federation, and audit of autonomous or semi-autonomous software Agents. This document applies to private clouds, hybrid clouds, multi-tenant platforms, and scenarios in which Agents invoke models, tools, services, and other Agents.

This document does not specify:

- the implementation of large models, planners, or prompts;
- the implementation of human user passwords, MFA, and browser sessions;
- vendor-specific HSMs, KMSs, gateways, or service meshes;
- product data models for Agent capability catalogs, business resources, and workflows;
- a globally unified Agent ID registry authority.

## 2. Document Status and Standardization Conclusion

As of 2026-09-22, this draft has not found any single published standard from ISO/IEC, IETF, W3C, or OASIS that specifically defines end-to-end Agent IAM identification, credentials, delegation, revocation, and federation interoperability protocols. What is available internationally is a combination of general identity, security, and authorization standards; the IETF WIMSE AIMS, Workload Identifier, Workload Credentials, and Workload Proof Token remain Internet-Drafts and are not RFCs.

China published the `GB/Z 185-2026 "Artificial Intelligence Agent Interconnection"` series on 2026-05-22, in which:

- `GB/Z 185.1-2026`: Part 1, Overall Architecture;
- `GB/Z 185.2-2026`: Part 2, Identity Code;
- `GB/Z 185.3-2026`: Part 3, Identity Management.

`GB/Z` is a national standardization guiding technical document; it is not a mandatory `GB`, nor is it the same as a recommended `GB/T`. Therefore, the statement that "there are currently no Agent ID national standardization documents at all" is no longer accurate; however, the statement that "there is currently no unified international Agent ID standard" still holds.

This draft is a vendor-neutral Agent IAM interoperability Profile. The mapping between specific reference implementations and the clauses of this draft, together with the gaps that must be closed before a conformance claim, are recorded in the `mappings/` directory and are not part of the normative text. Field-level compatibility involving `GB/Z 185` should be formed into a separate mapping table only after the full text of the standard has been obtained and reviewed item by item; consistency should not be presumed solely on the basis of the standard's name.

## 3. Normative Language

This document uses the normative keywords of BCP 14 (RFC 2119 and RFC 8174): MUST and MUST NOT indicate mandatory requirements; SHOULD and SHOULD NOT indicate recommended requirements that may be deviated from only when a valid exception exists; MAY and OPTIONAL indicate permitted choices. Only these words, when used as requirement predicates, have normative meaning. The Chinese text of this specification defines the equivalent Chinese keywords (必须/不得, 应/不应/应该/不应该, 可以/可选) with the same strength. The two language texts MUST be interpreted as having identical normative force.

## 4. Terms

### 4.1 Agent Identity

The long-lived, logical Agent principal. It is independent of a process, container, Pod, virtual machine, device, or a particular running instance.

### 4.2 Agent Identifier

A stable, opaque identifier assigned to an Agent Identity by the identity authority. The identifier itself does not constitute authentication proof or execution authorization.

### 4.3 Agent Instance

An instantiation of an Agent Identity in a specific runtime environment. One Agent may have multiple instances successively or simultaneously.

### 4.4 Authority Root

In this Profile, a verified principal reference used to determine the upper bound of an Agent's authorization and its governance attribution. It is a human principal or an organizational/system principal, and does not express a judgment on the attribution of legal liability.

### 4.5 Authority Binding

The one-to-one, immutable binding between an Agent Identity and an Authority Root.

### 4.6 Workload Identity

The identity representation of a specific running instance, device, or deployment environment. A SPIFFE ID, a Kubernetes ServiceAccount identity, or a verified mTLS client certificate can serve as a Workload Identity, but does not automatically become a logical Agent ID.

### 4.7 Identity Credential

A credential that binds an Agent Identifier or Workload Identity to a cryptographic key.

### 4.8 Enrollment

The process of establishing a trusted binding for an Agent Instance based on the registration record, workload attestation, and proof of key possession.

### 4.9 Lifecycle Epoch

An integer that strictly increases with each security-related lifecycle transition, used to invalidate old credentials and authorization artifacts.

### 4.10 Subject, Actor, Client, and Workload

- `subject`: the principal whose authority allows a certain effect to occur;
- `actor`: the person, Agent, or workload that directly initiates a request;
- `client`: the registered application or OAuth client;
- `workload`: proves the identity of the caller's specific running instance.

These roles have different semantics and MUST NOT be compressed into a single service account field.

### 4.11 Policy Decision

A versioned result produced by a policy decision point for a trusted Principal, action, resource, and context.

### 4.12 Execution Grant

A short-lived, audience-bound, resource-bound, task-bound, and revocable execution authorization derived from a verified `allow` decision.

### 4.13 PEP and PDP

- PDP: Policy Decision Point;
- PEP: Policy Enforcement Point, which verifies and enforces decisions and constraints before an effect occurs.

## 5. Architecture

### 5.1 Layering

Agent IAM SHOULD be divided into at least the following logical layers:

```text
Enterprise human IdP / organizational authority
          |
          v
Agent Identity Provider: Agent registration, Authority Binding,
          Workload Enrollment, lifecycle, PoP identity credentials, identity federation
          |
          v
Agent Authorization Plane: Principal resolution, PDP, approval,
          delegation, Execution Grant, revocation
          |
          v
PEP:      API Gateway, Tool Gateway, model ingress, business services, executors
```

An identity credential can only prove "who is calling" and its current identity state; it MUST NOT be directly interpreted as "is permitted to execute that action." Execution authorization MUST be determined independently by the authorization layer.

### 5.2 Trusted Data Sources

The following values MUST be resolved from trusted sources and MUST NOT be accepted as overridden by the caller:

- `tenant_id`;
- Authority Root;
- Agent class;
- lifecycle state and epoch;
- Workload Registration and selector;
- policy version;
- revocation state.

Fields of the same name carried in a request are used at most for consistency comparison; on inconsistency they MUST be rejected.

### 5.3 Fail Closed

When identity, policy, attestation, key, lifecycle, or revocation dependencies are unavailable, the system MUST fail closed. Timeouts, unknown states, resolution failures, or `approval_required` MUST NOT be interpreted as permitted.

## 6. Agent Identifier Specification

### 6.1 Identifier Layers

This document distinguishes three kinds of identifiers:

| Identifier | Scope | Example | Use |
|---|---|---|---|
| Local Agent ID | within tenant | `agt_01J...` | database primary identifier, API path |
| Cross-domain Agent Principal Key | issuer scope | `(iss, sub)` | Token, federation, audit |
| Workload ID | within trust domain | `spiffe://example.org/ns/a/sa/b` | runtime instance attestation |

### 6.2 Local Agent ID

The local Agent ID:

- MUST be generated by the identity authority;
- MUST be unique within the tenant;
- MUST be an opaque value; consumers MUST NOT parse business meaning from it;
- MUST NOT be modified after creation;
- MUST NOT be reused after the Agent is revoked;
- MUST NOT contain personal names, email addresses, organization names, or other unnecessary personal information;
- MUST provide an identifier space of at least 128 bits and sufficient collision security; when exposure of the identifier would create an enumeration risk, it MUST also have sufficient unpredictability. When a UUID is used, an appropriate version defined by RFC 9562 SHOULD be chosen.

`agt_<opaque-id>` is the recommended local representation of this Profile and is not a registered international URI scheme.

### 6.3 Global Uniqueness

Across tenants or organizations, a bare `agent_id` does not have global uniqueness. A cross-domain principal key MUST be determined by the `(issuer, subject)` tuple. At registration, the issuer MUST form a stable canonical value; at Token verification, an exact string comparison MUST be performed against that registered value, and different issuers MUST NOT be collapsed through URI normalization during the verification phase. The subject MUST be unique under that issuer and MUST never be reassigned. The `iss_sub` of RFC 9493 can serve as a structured representation of this tuple:

```json
{
  "format": "iss_sub",
  "iss": "https://id.example.com/t/acme",
  "sub": "agt_01JABCDEF..."
}
```

When a URI representation is needed, an HTTPS namespace controlled by the deployer SHOULD be used, for example:

```text
https://id.example.com/t/acme/agents/agt_01JABCDEF...
```

Implementations MUST NOT invent unregistered URI schemes and claim that they have international interoperability.

### 6.4 Relationship with SPIFFE ID

A SPIFFE ID identifies a workload within a trust domain. A logical Agent ID and a SPIFFE ID may establish a one-to-many or multi-generation binding, but MUST NOT be equal by default:

```text
Agent Identity 1 --- n Agent Instance 1 --- 1 current Workload Identity
```

Only when a deployment explicitly guarantees that the Agent and Workload lifecycles are exactly identical and does not need an independent Authority Binding, Agent epoch, or instance history MAY the same URI be reused; this simplification is not a recommended mode of this Profile.

### 6.5 National Identity Code and External Identifiers

If a deployment needs to be compatible with the agent identity code of `GB/Z 185.2-2026`, it SHOULD store it as an external identifier with a namespace and issuing authority, and MUST NOT override the local Agent Identity solely on the basis of an external code:

```json
{
  "type": "gbz185_identity_code",
  "issuer": "<verified issuing authority>",
  "value": "<identity code>"
}
```

The creation, change, and disassociation of an external identifier MUST produce audit events and MUST undergo authenticity verification by the issuing authority.

## 7. Identity Object Model

### 7.1 Agent Identity Record

The minimal record SHOULD contain:

```text
tenant_id
agent_id
agent_class
blueprint_id and blueprint_version, if used
authority_binding_ref
sponsor_ref, optional
lifecycle_state
lifecycle_epoch
created_at
updated_at
```

`tenant_id + agent_id` MUST be unique. Registering an Agent, creating an Authority Binding, and recording registration evidence SHOULD be committed in the same transaction.

### 7.2 Agent Class

This Profile defines:

| Class | Authority Root | Constraint |
|---|---|---|
| `twin` | `human_master` | exactly one immutable human master |
| `service` | `organization_root` | MUST NOT forge or carry a human master |
| `ephemeral` | `human_master` or explicitly specified by the deployment Profile | MUST have a short lifetime and an explicit expiry policy |

A deployment that does not support `ephemeral` MUST reject rather than degrade to `twin` or `service`.

### 7.3 Authority Binding

Every Agent MUST have exactly one Authority Binding. An Authority Root change MUST NOT be updated in place; the system MUST revoke the old Agent ID and create a new Agent Identity.

### 7.4 Agent Blueprint

If a Blueprint is used, it MUST be versioned and have determinable states such as `draft`, `published`, and `deprecated`. At registration, the same explicit version MUST be validated and persisted; it MUST NOT validate the "latest version" and then store a different version supplied by the caller.

### 7.5 Workload Registration

A Workload Registration MUST contain at least:

```text
tenant_id
workload_registration_id
platform
selector
trust_domain
allowed_proof_methods
status
```

The trust domain MUST be pre-associated with the same tenant. All storage implementations, including test or in-memory implementations, SHOULD enforce the same tenant/trust-domain constraint.

### 7.6 Agent Instance

An Agent Instance MUST contain at least:

```text
tenant_id
instance_id
agent_id
workload_registration_id
workload_id
artifact_digest, optional
attestation_ref
credential_generation
lease_expires_at, optional
instance_state
```

`attestation_ref` MUST be able to correlate to an actual verification result, and MUST NOT be merely declared in the schema without being written.

## 8. Lifecycle

### 8.1 Agent State Machine

This Profile adopts:

```text
registered -> enrolled -> active -> suspended
     |           |          |          |
     +-----------+----------+----------+-> revoked

suspended -> enrolled -> active
revoked   -> no transition
```

An implementation MAY retain an internal `draft` state, but MUST NOT issue usable identity credentials or execution authorization for it.

### 8.2 Lifecycle Invariants

- Each legal state transition MUST atomically cause `lifecycle_epoch` to strictly increase;
- epoch MUST NOT roll back or be reused;
- `revoked` MUST be a terminal state;
- Only an `active` local Agent can obtain a new identity Token or Execution Grant; a Federated/Brokered Principal without a local Agent record MUST, after passing an active Federation Trust, PoP, and the authoritative online verification of Section 16, be able to obtain an Execution Grant according to policy;
- A `suspended` Agent MUST complete the required enrollment or equivalent re-verification again before resuming;
- Online verification MUST require the Token epoch to equal the current Agent epoch;
- Lifecycle state, events, evidence, and outbox SHOULD be committed in the same transaction.

### 8.3 Instance States

An instance supports at least `bound`, `active`, `expired`, and `terminated`. An instance that has been terminated or whose lease has expired MUST NOT obtain new Tokens.

Instance termination MUST cause issued Tokens to become invalid at the next authoritative online verification. Offline verification cannot provide this guarantee; merely blocking new issuance is not equivalent to immediate revocation.

## 9. Enrollment and Workload Attestation

### 9.1 General Flow

```text
1. Register the Agent and the immutable Authority Binding
2. Register the allowed workload selector and trust domain
3. Issue a short-lived, single-use enrollment challenge
4. Verify the cryptographic authenticity of the workload evidence
5. Normalize the verified attributes and match the selector
6. Verify the Agent's proof of possession of the private key
7. Atomically create the credential, instance, state transition, and evidence
```

### 9.2 Challenge

An enrollment challenge MUST:

- be tenant-scoped;
- have an unpredictable nonce;
- have a maximum validity period, recommended not to exceed 5 minutes;
- be single-use and consumed atomically;
- bind the Agent ID, Workload Registration, and expected audience.

### 9.3 Enrollment JWT Proof of Possession

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

### 9.4 Three Phases of Attestation

The system MUST distinguish:

1. Cryptographic verification of evidence: certificate chain, JWT signature, issuer, audience, validity period;
2. Attribute normalization: derive attributes such as namespace, ServiceAccount, SPIFFE ID, and certificate digest only from verified evidence;
3. Selector authorization: exactly match the derived attributes against the pre-registered selector.

PEM, JWT, or attribute JSON submitted by the caller MUST NOT be directly treated as "verified proof." Unknown proof methods MUST fail closed.

### 9.5 Supported Attestation Profiles

- SPIFFE: SHOULD validate the X.509-SVID/JWT-SVID, trust domain, and unique SPIFFE URI;
- Kubernetes: MUST validate the signature, issuer, audience, time, and subject of the projected ServiceAccount token;
- mTLS: MUST validate the certificate chain, validity period, ClientAuth EKU, and expected trust anchor;
- RATS/EAT: when used, SHOULD follow RFC 9334 and RFC 9711, and distinguish Evidence from Attestation Result.

## 10. Identity Credentials and Tokens

### 10.1 PoP Requirements

Production credentials SHOULD use proof-of-possession. A local Agent identity Token MUST contain:

```text
iss, sub, aud, iat, exp, jti
tenant_id or a canonical tenant-scoped iss
agent_class
instance_id
workload_id
authority_root_ref
lifecycle_epoch
cnf.jkt or equivalent confirmation
```

If the tenant is derived from `iss`, the mapping MUST be unique and canonical; when `tenant_id` is also present in the Token, the two MUST be consistent. A Federated/Brokered Token MUST use an independent `typ` and carry an unambiguous external issuer, external subject, and federation trust/version reference; it MUST NOT forge local `agent_class`, `instance_id`, `workload_id`, `authority_root_ref`, or lifecycle epoch.

Identity Tokens, Enrollment proofs, Token request proofs, Policy Decisions, and Execution Grants MUST use different and fixed `typ` or equivalent artifact types. The Verifier MUST pin the allowed types per endpoint to prevent Token substitution.

Static API keys and long-lived bearer secrets MUST NOT be used as an Agent's primary identity credential.

### 10.2 Token Request Proof

A Token request proof MUST bind the Agent, Instance, Token endpoint audience, the requested target Token audience, time, and a single-use JTI. It MAY also bind a normalized Token request digest that includes the target audience. The JTI MUST be consumed atomically within the tenant. An implementation MUST specify a maximum proof lifetime and MUST NOT only check `exp > now`.

### 10.3 Issuance Conditions

The issuer MUST check:

- The Agent is `active`;
- The Instance belongs to the same tenant and Agent;
- The Instance state permits issuance and the lease has not expired;
- The proof key corresponds to an active credential;
- The audience is registered and matches exactly;
- Workload and attestation requirements still satisfy policy.

### 10.4 Online and Offline Verification

Offline verification MAY check the signature, issuer, audience, time, format, and verified PoP context, but MUST NOT claim to have real-time revocation capability. Submitting a public key, JWK, or thumbprint does not by itself constitute proof of key possession.

The PoP of a resource request MUST be verified by the PEP via DPoP, HTTP Message Signatures, mTLS, or an equivalent Profile, and then the verified key binding is passed to the Token verifier. When adopting the RFC 7662 introspection mode, the introspection endpoint MUST only accept calls from authenticated and authorized resource servers, and MUST return `cnf`; the PoP of the actual resource request is still verified by the resource server. Every adopted PoP Profile MUST define request binding, Token binding, replay cache scope, maximum clock skew, and error handling.

Authoritative online verification MUST additionally check:

- The Agent's current state and epoch;
- The Instance state and lease;
- The credential state;
- Tenant-scoped revocation selectors.

Externally, introspection SHOULD hide the specific failure reason behind a uniform inactive result, while recording the categorized reason in controlled evidence.

### 10.5 Credential Lifecycle

A Credential MUST bind the Agent, Instance, and an explicit enrollment generation. Re-enrollment MUST establish a new generation and cause the old generation to be unusable for new issuance. If an implementation allows old Tokens to continue to verify before expiry, it MUST state this in its conformance claim; when immediate instance revocation is claimed, old Tokens MUST be inactive at the next online verification.

### 10.6 Key Rotation

When a signing key is rotated, the verification overlap window for the old public key MUST cover at least:

```text
maximum Token lifetime + allowed clock skew + publication propagation delay
```

High-assurance deployments SHOULD keep private keys in an HSM, KMS, TPM, or equivalent isolated environment, and use mutually independent signing domains for identity Tokens, Policy Decisions, Execution Grants, Approvals, Attestation, and Workload Assertions.

## 11. Principal and Authorization Modes

### 11.1 Principal Resolution

The authorization system MUST reconstruct the Principal from the verified enterprise IdP, Agent Identity Authority records, Workload Assertion, and authorization context. A client self-reported Principal can only be a comparison-only input.

### 11.2 Authorization Modes

| Mode | Authority Source | Required Proof |
|---|---|---|
| `human_web` | human subject | OIDC authorization code flow and appropriate assurance |
| `system_api` | organization/system root | client + workload proof |
| `delegated_api` | human subject, service as actor | user delegation + client/workload proof |
| `service_agent_api` | organization/system root, Service Agent as actor | Agent identity + workload + epoch |
| `twin_agent_api` | human master, Twin Agent as actor | immutable master binding + workload + epoch |

Different modes MUST NOT substitute for one another. A Workload Token MUST NOT impersonate a human; a Service Agent MUST NOT claim a human master; a Twin Agent MUST NOT satisfy a system-only endpoint.

### 11.3 Effective Authority

Effective authority MUST be the intersection of all applicable upper bounds:

```text
twin = master authority
       intersection agent envelope
       intersection workload grant
       intersection tool permission
       intersection requested authority
       intersection policy

service = organization authority
          intersection agent envelope
          intersection workload grant
          intersection requested authority
          intersection policy
```

When any required input is missing, it MUST be rejected.

## 12. Policy Decision and Execution Grant

### 12.1 Single Authorization Lineage

Authorization MUST have a single, verifiable lineage:

```text
verified principal
  -> canonical policy decision
  -> verified allow decision
  -> execution grant
  -> attenuated child grant
  -> PEP verification and effect
```

A raw bearer Token can only establish identity context and MUST NOT alone serve as the authorization basis for minting an Execution Grant.

Digests of resources and security-critical references MUST pin the canonicalization algorithm, character encoding, hash algorithm, domain separation label, and Profile version. The base construction of this Profile is:

```text
SHA-256("agent-iam:<object-type>:<profile-version>\x00" || canonical_bytes)
```

`canonical_bytes` MUST be defined for each kind of resource, subject, reason, and implementation; for JSON types, the UTF-8 output of RFC 8785 JCS MUST be used by default. Security digests MUST NOT be computed directly from non-canonicalized JSON, natural language, or platform-dependent paths.

### 12.2 Decision

A Decision MUST bind at least:

- tenant and authorization mode;
- applicable fields among subject, actor, client, workload, and authority root;
- action and immutable resource identity/digest;
- normalized scope;
- audience;
- policy ID/version;
- lifecycle epoch;
- decision ID, issued-at, and expiry;
- outcome and obligations.

Only `allow` may derive an Execution Grant. `deny`, `approval_required`, `revoked`, and unknown results MUST all block execution.

### 12.3 Grant

An Execution Grant SHOULD be short-lived, audience-bound, and sender-constrained, and MUST bind at least the action, resource, scope, task, policy version, lifecycle epoch, and parent lineage. The PEP MUST verify the Grant before every protected effect, not only when the connection is established.

## 13. Delegation and Token Exchange

### 13.1 No Amplification

Any child authorization MUST satisfy:

```text
child.scope       subset-of parent.scope
child.audience    subset-of parent.audience
child.expires_at  <= parent.expires_at
child.task        equal-to-or-narrower-than parent.task
child.action      equal-to-or-narrower-than parent.action
child.resource    equal-to-or-narrower-than parent.resource
```

The tenant, Authority Root, and immutable principal binding MUST NOT change during delegation.

The attenuation relation MUST be decidable and versioned: audience MUST be normalized into an exact string set and a set subset MUST be performed; action MUST be equal by default, unless the Profile defines an explicit partial order; resource MUST use a typed canonical descriptor and the containment function of that type; task MUST use an opaque `task_id` or structured constraints, and "narrower" MUST NOT be judged from natural language. A Decision and a Grant MUST identify the version of the attenuation Profile used.

### 13.2 OAuth Token Exchange

When using RFC 8693, the following MUST be distinguished:

- identity-preserving Token derivation;
- impersonation;
- delegation;
- Execution Grant derivation.

An exchange that only preserves identity, audience, expiry, and PoP MUST NOT be described as a complete authorization delegation. Multi-level delegation MUST preserve the actor/parent lineage, and the resource server MUST perform authority attenuation checks.

### 13.3 Approval and Pre-Authorization

An Approval MUST bind the tenant, approver, agent/actor, action, resource, scope, audience, reason digest, expiry, and policy version.

Pre-Authorization can only provide a time-limited, quota-limited usage window for existing authority, and MUST NOT elevate authority. Quota updates such as `max_grants` and `used_grants` MUST be atomic and monotonic.

## 14. PEP and Tool Invocation

The PEP MUST:

- accept only the authorization mode and artifact type applicable to the endpoint;
- verify signature, issuer, audience, expiry, tenant, PoP, resource digest, epoch, and revocation;
- allow an effect only after enforcing all obligations;
- re-check authorization and revocation at the continuation boundary of long-running tasks;
- perform exact matching on the action, target host, path, tool ID, skill hash, and implementation digest;
- MUST NOT treat Catalog visibility, model selection results, or natural-language plans as authorization.

Credential injection MUST be an explicit obligation and MUST bind `credential_ref` or class, target, scope, and expiry. The credential value itself MUST NOT enter a Decision, Grant, prompt, or evidence. An LLM MUST NOT have access to an Agent's primary identity private key or downstream service credentials.

## 15. Revocation

### 15.1 Selectors

Revocation MAY be performed by tenant-scoped selector, including:

- Agent, Instance, credential, or lifecycle epoch;
- subject, session, or authority root;
- Decision JTI, Grant JTI, Approval JTI;
- policy version;
- resource/implementation digest;
- Workload Binding or attestation reference.

Sensitive selectors SHOULD be persisted as digests with domain separation.

### 15.2 Freshness Classes

| Class | Requirement |
|---|---|
| `pre_dispatch` | authoritative check before the effect; negative cache MUST NOT be used |
| `continuation` | check at every external effect boundary of a long-running task; negative cache MUST NOT be used |
| `connection` | a bounded negative cache MAY be used, and MUST NOT exceed the artifact's remaining lifetime |

When a revocation dependency is unavailable, it MUST be rejected. Offline or degraded modes MUST NOT be used for credential injection, authority expansion, new targets, or high-risk destructive actions.

## 16. Federation

### 16.1 Federation Trust

A Federation Trust MUST be tenant-scoped and MUST specify at least:

- peer issuer;
- JWKS URI or trust bundle;
- allowed audiences;
- claim mapping;
- PoP requirements;
- trust status;
- key refresh and fail-closed policy.

Peer claims MUST NOT specify or override the local tenant.

Federation metadata/JWKS retrieval MUST be restricted to HTTPS (except for an explicit local development exception), and MUST enforce host/scheme allowlist, DNS/IP re-validation, redirect limits, response size limits, connection and read timeouts, content type checks, and rate limiting of unknown `kid` refreshes. Loopback, link-local, cloud metadata addresses, and unapproved private network targets MUST be rejected to prevent SSRF; the maximum usable time of a stale key MUST be bounded.

### 16.2 Principal Isolation

A Federated Principal MUST NOT be automatically merged into a local Agent Identity. A Brokered Principal MUST use a namespace that does not conflict with local Agent IDs, and MUST make explicit its revocation semantics when it has no local Agent epoch.

### 16.3 Federation Verification

Federation verification MUST simultaneously check trust status, signature, known `kid`, issuer, audience, time, PoP, and claim mapping. After a trust is disabled, the next authoritative online verification MUST fail closed. Online verification of a Brokered Token MUST re-check the corresponding Federation Trust according to its trust/version reference; merely waiting for the local Token to expire does not satisfy this requirement.

## 17. Audit and Security Event Records

The Security Event Records in this section are used for audit and are different from the Attestation Evidence that serves as input to remote attestation in RFC 9334. The field name `evidence_ref` MUST identify whether it references attestation evidence, an attestation result, or a Security Event Record.

### 17.1 Minimum Events

The following operations MUST produce security evidence:

- Agent registration and Authority Binding;
- Enrollment success and failure;
- Credential issuance, rotation, supersede, and revocation;
- lifecycle and instance state transitions;
- identity Token issuance, exchange, and introspection;
- Policy Decision, Approval, Grant, and PEP results;
- Federation Trust changes and federation verification;
- revocation and critical operational actions.

### 17.2 Minimum Fields

A Security Event Record MUST contain at least:

```text
event_id, event_type, timestamp
tenant_id
agent_id and instance_id, when applicable
subject/actor/client/workload references, when applicable
lifecycle_epoch, when applicable
action and resource digest, when applicable
policy_version, when applicable
decision/grant/approval identifiers, when applicable
trace_id
outcome and reason_code
evidence references
```

### 17.3 Data Minimization

Evidence and outbox MUST NOT store:

- private keys;
- complete bearer Tokens, PoP proofs, or downstream credentials;
- unrestricted prompts, tool parameters, or business payloads;
- sensitive plaintext that could satisfy the audit purpose by reference or digest.

Sensitive subject, resource, and reason SHOULD use domain-separated digests. Rejection events SHOULD be persisted after rate limiting and sanitization, and MUST NOT exist only as in-process counters.

### 17.4 Consistency

Authoritative state changes, evidence, and outbox SHOULD be committed in the same transaction. The Outbox MUST define at-least-once delivery, idempotent consumers, retry, DLQ, and redrive semantics.

## 18. Security Requirements

### 18.1 Replay

Challenges, Token proofs, and high-value requests MUST use short-lived nonce/JTI and consume them atomically within the appropriate scope. DPoP MUST validate `htm`, `htu`, `iat`, and `jti` per RFC 9449, and validate `ath` and the server nonce when applicable. An HTTP Message Signatures Profile MUST specify the covered components; when message content is present, `content-digest` SHOULD be covered, and depending on the routing model, `@method`, `@authority`, and either `@target-uri` or equivalent components SHOULD be covered.

### 18.2 Confused Deputy

Identity Tokens MUST bind the audience exactly; authorization Tokens and Execution Grants MUST further bind the action, resource, and task exactly. Security-critical audiences MUST NOT be matched using wildcards, prefixes, or case-insensitive means.

### 18.3 Prompt Injection

Natural language, model output, and tool return values are all untrusted inputs. They MUST NOT:

- select the tenant or Authority Root;
- modify the Agent class, epoch, or policy version;
- read the primary identity key or service credentials;
- bypass the PEP;
- expand a parent grant.

### 18.4 Claim and Parsing Security

The Verifier MUST, before semantic processing, reject duplicate JSON members, unknown critical claims, algorithm downgrade, unknown `kid`, oversized artifacts, and non-canonical resource representations. Structured resources MUST adopt the deterministic canonicalization and digest specified in Section 12.1.

### 18.5 Management Plane

Management APIs such as those for Agent, Blueprint, Workload Registration, Trust Domain, Federation Trust, key rotation, and DLQ redrive MUST undergo strong authentication and fine-grained authorization. Relying solely on network location or a shared internal token is insufficient to constitute a high-assurance management plane.

## 19. Privacy Requirements

- Agent IDs SHOULD be opaque pseudonymous identifiers;
- stable correlation identifiers SHOULD NOT be reused across trust domains without necessity;
- a Twin's `master_id` SHOULD be disclosed only to components that actually have an authorized need;
- external presentation and audit export SHOULD preferentially use controlled references or digests;
- data retention periods SHOULD be set according to event type, regulatory purpose, and the minimization principle;
- federation claim mapping SHOULD enforce a whitelist and MUST NOT pass through all upstream claims.

## 20. Conformance Levels

### 20.1 Level 1: Agent Identity

The following MUST be implemented:

- tenant-scoped Agent ID;
- immutable Authority Binding;
- Agent/Instance separation;
- lifecycle and monotonic epoch;
- Enrollment challenge and PoP;
- short-lived identity Token;
- online Agent, Instance, and credential generation state verification;
- basic evidence.

### 20.2 Level 2: Agent Authorization

On the basis of Level 1, the following MUST be implemented:

- subject/actor/client/workload separation;
- authorization modes;
- versioned PDP Decision;
- audience/resource/task-bound Execution Grant;
- PEP and tenant-scoped revocation;
- non-amplification of authority.

### 20.3 Level 3: Federated Agent IAM

On the basis of Level 2, the following MUST be implemented:

- tenant-scoped Federation Trust;
- PoP federated verification;
- local/federated principal isolation;
- online revocation of trust disable;
- cross-domain evidence correlation;
- complete key rotation and production-grade custody.

A conformance claim MUST list the supported Level, proof Profile, Token/Profile version, revocation SLO, and known extensions, and MUST NOT merely claim "compatible with Agent IAM."

## 21. Recommendations for Adopting International and National Standards

| Domain | Published, normatively referenceable | Agent-specific work status |
|---|---|---|
| Identifier | RFC 3986, RFC 9562, RFC 9493, W3C DID Core | GB/Z 185.2-2026; IETF WIMSE Identifier draft |
| Identity management | ISO/IEC 24760 series, SCIM RFC 7643/7644 | GB/Z 185.3-2026; SCIM Agent schema individual draft has expired |
| Credentials | RFC 5280, RFC 7519, W3C VC 2.0 | SPIFFE SVID; WIMSE Credentials draft |
| PoP/request authentication | RFC 8705, RFC 9449, RFC 9421, TLS 1.3 | WIMSE WPT, mTLS, HTTP Signature drafts |
| Authorization/delegation | RFC 8693, RFC 9396, RFC 9635, OASIS XACML 3.0 | IETF AIMS WG draft; AAuth is still not a formal standard |
| Attestation | RFC 9334, RFC 9711 | Agent/workload attestation draft |
| Federation | OIDC Core, SAML 2.0, RFC 8693 | SPIFFE Federation, Agent cross-domain draft |
| Audit | RFC 5424, RFC 8417, RFC 9493 | Agent audit record individual draft |
| Governance | ISO/IEC 42001, ISO/IEC 23894, NIST AI RMF | does not define Agent ID or wire protocols |

Engineering SHOULD preferentially combine published standards; when using an Internet-Draft, the version MUST be pinned, experimental extensions MUST be isolated, and possible incompatibility with subsequent versions MUST be declared.

## 22. Principal Published References

- RFC 2119, Key words for use in RFCs to Indicate Requirement Levels.
- RFC 3986, Uniform Resource Identifier (URI): Generic Syntax.
- RFC 5280, Internet X.509 Public Key Infrastructure Certificate and CRL Profile.
- RFC 7519, JSON Web Token (JWT).
- RFC 7523, JSON Web Token (JWT) Profile for OAuth 2.0 Client Authentication and Authorization Grants.
- RFC 7638, JSON Web Key (JWK) Thumbprint.
- RFC 7662, OAuth 2.0 Token Introspection.
- RFC 8174, Ambiguity of Uppercase vs Lowercase in RFC 2119 Key Words.
- RFC 8446, The Transport Layer Security (TLS) Protocol Version 1.3.
- RFC 8693, OAuth 2.0 Token Exchange.
- RFC 8705, OAuth 2.0 Mutual-TLS Client Authentication and Certificate-Bound Access Tokens.
- RFC 8785, JSON Canonicalization Scheme (JCS).
- RFC 9334, Remote ATtestation procedureS (RATS) Architecture.
- RFC 9396, OAuth 2.0 Rich Authorization Requests.
- RFC 9421, HTTP Message Signatures.
- RFC 9449, OAuth 2.0 Demonstrating Proof of Possession (DPoP).
- RFC 9493, Subject Identifiers for Security Event Tokens.
- RFC 9562, Universally Unique IDentifiers (UUIDs).
- RFC 9635, Grant Negotiation and Authorization Protocol (GNAP).
- RFC 9700, Best Current Practice for OAuth 2.0 Security.
- RFC 9711, The Entity Attestation Token (EAT).
- ISO/IEC 24760-1:2019, A framework for identity management -- Terminology and concepts.
- ISO/IEC 29115:2013, Entity authentication assurance framework.
- OASIS XACML Version 3.0.
- W3C DID Core 1.0.
- W3C Verifiable Credentials Data Model 2.0.
- GB/Z 185.1-2026, Artificial Intelligence Agent Interconnection Part 1: Overall Architecture.
- GB/Z 185.2-2026, Artificial Intelligence Agent Interconnection Part 2: Identity Code.
- GB/Z 185.3-2026, Artificial Intelligence Agent Interconnection Part 3: Identity Management.

## 23. Informative References and Work in Progress

The following is a non-exhaustive list directly involved in this document and MUST NOT be cited as published standards:

- `draft-ietf-wimse-aims-00`, AI Identity Management System, IETF WIMSE WG Internet-Draft;
- `draft-ietf-wimse-arch-08`, WIMSE Architecture, WG Internet-Draft;
- `draft-ietf-wimse-identifier-03`, Workload Identifier, WG Internet-Draft;
- `draft-ietf-wimse-workload-creds-02`, WIMSE Workload Credentials, WG Internet-Draft;
- `draft-ietf-wimse-wpt-02`, WIMSE Workload Proof Token, WG Internet-Draft;
- `draft-ietf-wimse-mutual-tls-02`, Workload Authentication Using Mutual TLS, WG Internet-Draft;
- `draft-ietf-wimse-http-signature-07`, WIMSE Workload-to-Workload Authentication with HTTP Signatures, WG Internet-Draft;
- `draft-ietf-wimse-workload-identity-practices-06`, Workload Identity Practices, submitted to the IESG and still not an RFC;
- `draft-narajala-courtney-ansv2-01`, Agent Name Service v2, individual Internet-Draft;
- `draft-hardt-oauth-aauth-protocol-10`, AAuth Protocol, individual Internet-Draft;
- `draft-sharif-agent-identity-framework-01`, Agent Identity Framework, individual Internet-Draft;
- `draft-wahl-scim-agent-schema-01`, SCIM Agentic Identity Schema, archived individual Internet-Draft.

Status verification entry points:

- IETF WIMSE: <https://datatracker.ietf.org/wg/wimse/documents/>
- AIMS: <https://datatracker.ietf.org/doc/draft-ietf-wimse-aims/>
- National Standards Information Public Service Platform: <https://std.samr.gov.cn/>
- GB/Z 185.1-2026: <https://openstd.samr.gov.cn/bzgk/gb/newGbInfo?hcno=CFF03D872963466AC7F03ED0E28B6702>
- GB/Z 185.2-2026: <https://openstd.samr.gov.cn/bzgk/gb/newGbInfo?hcno=11B33B7532093ED660305B2BF4940A12>
- GB/Z 185.3-2026: <https://openstd.samr.gov.cn/bzgk/gb/newGbInfo?hcno=BFCCE65447B30927953D90059AB89E23>

## 24. Items for Discussion

1. Whether the Authority Root of an `ephemeral` Agent MUST be limited to a human master, or whether short-lived instances under an organization root are permitted;
2. whether to pin an HTTPS URI Profile for the logical Agent Principal, or to wait for the WIMSE Identifier to mature;
3. the bidirectional mapping rules between the `GB/Z 185.2-2026` identity code and this Profile's `(issuer, subject)`;
4. the default maximum TTLs for Token, Decision, Grant, and Attestation;
5. the maximum depth, cycle detection, and privacy disclosure rules for cross-organization delegation chains;
6. whether the security event envelope adopts SET, OTel semantic conventions, or an independent JSON Schema;
7. the publication location for conformance test vectors and interoperability test events.
