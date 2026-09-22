[English](agent-iam-1-architecture.md) · [简体中文](../zh-CN/agent-iam-1-architecture.md)

# Agent IAM Series — Part 1: Architecture and Terminology

- Series identifier: `agent-iam-series`
- Part identifier: `agent-iam-1-architecture`
- Version: `0.1.0-draft`
- Date: 2026-09-22
- Status: Project draft, not an international, national, or industry standard
- License: CC BY 4.0 (specification text)

This part is the framework for the Agent IAM Series. The other parts reference the terms, rules, and principles defined here.

## 1. Scope

The Agent IAM Series specifies the identification, registration, discovery, authentication, authorization, delegation, federation, and audit of autonomous or semi-autonomous software Agents. It applies to private clouds, hybrid clouds, multi-organization platforms, and scenarios in which Agents invoke models, tools, services, and other Agents.

This part (Part 1) specifies:

- the structure of the series and the dependency rules between parts;
- terminology used across all parts;
- the layering and plane boundaries of an Agent IAM system;
- trusted-data-source and fail-closed principles;
- cross-cutting security, canonicalization, revocation-freshness, and privacy principles.

The series does not specify:

- LLM, planner, or prompt implementations;
- human passwords, MFA, and browser sessions;
- vendor-specific HSM, KMS, gateway, or service mesh implementations;
- Agent capability, tool, or business-resource catalogs (this includes capability discovery);
- a global Agent ID registration authority.

## 2. Series Structure and Dependencies

| Part | Identifier | Title | Depends on |
|---|---|---|---|
| 1 | `agent-iam-1-architecture` | Architecture and Terminology | — |
| 2 | `agent-iam-2-registration-discovery` | Registration and Discovery | 1 |
| 3 | `agent-iam-3-authentication` | Identity and Authentication | 1, 2 |
| 4 | `agent-iam-4-authorization` | Authorization and Delegation | 1, 2, 3 |
| 5 | `agent-iam-5-federation` | Cross-Domain Federation | 1, 3, 4 |
| 6 | `agent-iam-6-audit` | Audit and Security Events | 1 |
| 7 | `agent-iam-7-conformance` | Conformance and Testing | all |

Rules:

- A lower-numbered part MUST NOT depend on a higher-numbered part.
- Part 3 consumes records defined by Part 2 and produces a `Verified Agent Identity Context` as defined in Part 3.
- Part 4 MUST consume that context and MUST NOT re-derive namespace, Agent class, lifecycle epoch, or workload identity from caller-supplied values.
- Part 5 MUST reference the Part 3 and Part 4 interfaces rather than redefine them.
- All parts MUST use the security event envelope defined by Part 6.

## 3. Normative Language

The Chinese normative keywords in this series correspond in strength to BCP 14 (RFC 2119 and RFC 8174): “MUST” and “MUST NOT” indicate absolute requirements; “SHOULD”, “SHOULD NOT”, and “RECOMMENDED” indicate recommended requirements from which a valid exception may justify deviation; “MAY” and “OPTIONAL” indicate permitted choices. English “MUST”, “MUST NOT”, “SHOULD”, “SHOULD NOT”, “MAY”, and “OPTIONAL” have the same normative meaning. Only these words used as requirement predicates carry normative meaning. Content marked as “Note”, “Example”, or “Informative” is non-normative.

## 4. Terms

### 4.1 Agent Identity

The long-lived, logical Agent principal. It is independent of a process, container, Pod, virtual machine, device, or a particular running instance.

### 4.2 Agent Identifier

A stable, opaque identifier assigned to an Agent Identity by the identity authority. The identifier itself does not constitute authentication proof or execution authorization.

### 4.3 Agent Instance

An instantiation of an Agent Identity in a specific runtime environment. One Agent may have multiple instances successively or simultaneously.

### 4.4 Authority Root

A verified principal reference used to determine the upper bound of an Agent's authorization and its governance attribution. It is a human principal or an organizational/system principal, and does not express a judgment on the attribution of legal liability.

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

### 4.14 Namespace

An identifier scope controlled by a principal, delegable, and globally addressable, used to name principals and Agents across an organizational ecosystem. A Namespace MUST have a stable, exactly comparable canonical representation, usually an HTTPS URI controlled by the deployer.

### 4.15 Authority Namespace

The root Namespace controlled by an organization, customer, partner, or supplier principal. It may contain zero or more organization-internal divisions (sub-namespaces) and is delegated for management by that principal. An Authority Namespace is the global naming anchor for cross-domain identity.

### 4.16 Organization Unit

One level of division within an Authority Namespace, such as a department, business unit, project, or environment. An Organization Unit is expressed through the namespace hierarchy and does not require a separate flat identifier.

### 4.17 Registration

The process of creating and recording an Agent Identity, its Authority Binding, and its allowed workload registrations in a registry. Registration is specified in Part 2.

### 4.18 Discovery

The process of resolving an Authority Namespace or Agent Identifier to trusted metadata: the issuing authority, registry endpoint, verification keys, and federation trust configuration. Discovery is specified in Part 2.

### 4.19 Authentication

The process of establishing, with proof of possession and workload attestation, that a caller is a specific Agent Identity or Agent Instance at a given lifecycle epoch. Authentication is specified in Part 3.

### 4.20 Authorization

The process of deciding whether a verified principal may perform a specific action on a specific resource, and of deriving an enforceable, attenuable execution authorization. Authorization is specified in Part 4.

## 5. Architecture

### 5.1 Layering

Agent IAM SHOULD be divided into at least the following logical layers:

```text
Human IdP / organizational authority
          |
          v
Registration and Discovery: Agent registration, Authority Binding,
          namespace and identifiers, lifecycle, discovery
          |
          v
Authentication: workload enrollment, attestation, PoP credentials,
          identity tokens, authoritative online verification
          |
          v
Authorization: Principal resolution, PDP, approval, delegation,
          Execution Grant, revocation
          |
          v
PEP:      API Gateway, Tool Gateway, model ingress, business services, executors
```

### 5.2 Plane Boundaries

- Registration and Discovery (Part 2) assigns and resolves names. It does not issue credentials.
- Authentication (Part 3) produces a `Verified Agent Identity Context`. An identity credential proves who is calling and the current identity state.
- Authorization (Part 4) consumes the verified context. An identity credential MUST NOT be directly interpreted as “is permitted to execute that action”. Execution authorization MUST be determined independently by the authorization plane.
- The PEP verifies authorization artifacts before every protected effect, not only at connection establishment.

### 5.3 Trusted Data Sources

The following values MUST be resolved from trusted sources and MUST NOT be accepted as overridden by the caller:

- `namespace` (Authority Namespace) and its canonical representation;
- Authority Root;
- Agent class;
- lifecycle state and epoch;
- Workload Registration and selector;
- policy version;
- revocation state.

Fields of the same name carried in a request are used at most for consistency comparison; on inconsistency they MUST be rejected.

### 5.4 Fail Closed

When identity, policy, attestation, key, lifecycle, discovery, or revocation dependencies are unavailable, the system MUST fail closed. Timeouts, unknown states, resolution failures, or `approval_required` MUST NOT be interpreted as permitted.

## 6. Cross-Cutting Principles

### 6.1 Identity Is Not Authorization

An identity token only establishes an identity context. A raw bearer token MUST NOT by itself authorize the minting of an Execution Grant. Only a verified `allow` decision may derive an Execution Grant.

### 6.2 Canonicalization and Digests

Security-critical references and digests MUST fix the canonicalization algorithm, character encoding, hash algorithm, domain-separation label, and profile version. The base construction is:

```text
SHA-256("agent-iam:<object-type>:<profile-version>\x00" || canonical_bytes)
```

Each resource, subject, reason, and implementation type MUST define `canonical_bytes`. JSON types MUST use RFC 8785 JCS UTF-8 output by default. Security digests MUST NOT be computed directly from unnormalized JSON, natural language, or platform-dependent paths.

### 6.3 Revocation Freshness Vocabulary

Authorization artifacts are checked with one of the following freshness classes:

| Class | Requirement |
|---|---|
| `pre_dispatch` | authoritative check before the effect; negative caching MUST NOT be used |
| `continuation` | check at every external effect boundary of a long task; negative caching MUST NOT be used |
| `connection` | bounded negative caching MAY be used, not exceeding the artifact's remaining lifetime |

When a revocation dependency is unavailable, the check MUST be rejected. Offline or degraded modes MUST NOT be used for credential injection, authority expansion, new targets, or high-risk destructive actions. The concrete revocation selectors are defined in the part that owns the artifact (Part 3, Part 4, or Part 5).

### 6.4 No Caller Override

No caller-supplied value, model output, natural-language instruction, or tool return value may select or override a trusted value defined in Section 5.3.

## 7. Security and Privacy

### 7.1 General Security Principles

- Replay protection MUST use short-lived nonces or JTIs consumed atomically in the appropriate scope.
- Audience, action, resource, and task bindings MUST be exact; wildcard, prefix, and case-insensitive matching MUST NOT be used for security-critical values.
- Verifiers MUST reject duplicate JSON members, unknown critical claims, algorithm downgrade, unknown `kid`, oversized artifacts, and non-canonical resource representations before semantic processing.
- Management APIs (registration, blueprint, workload registration, trust domain, federation trust, key rotation, and DLQ redrive) MUST be strongly authenticated and finely authorized. Relying only on network location or a shared internal token is insufficient.

### 7.2 Privacy Requirements

- Agent IDs SHOULD be opaque pseudonymous identifiers;
- stable correlation identifiers SHOULD NOT be reused across trust domains without need;
- a twin's `master_id` SHOULD be disclosed only to components with a genuine authorization need;
- external presentation and audit export SHOULD prefer controlled references or digests;
- retention periods SHOULD be set per event type, regulatory purpose, and minimization;
- federation claim mapping SHOULD enforce a whitelist and MUST NOT pass through all upstream claims.

## 8. Conformance Model

Each part defines its own conformance requirements. Part 7 defines the per-part conformance levels and the series-level composite profile. A conformance claim MUST list the supported parts, proof Profiles, Token/artifact versions, revocation SLO, and known extensions, and MUST NOT merely claim “compatible with Agent IAM”.

## 9. Published References

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
- ISO/IEC 24760-1:2019, A framework for identity management — Terminology and concepts.
- ISO/IEC 29115:2013, Entity authentication assurance framework.
- OASIS XACML Version 3.0.
- W3C DID Core 1.0.
- W3C Verifiable Credentials Data Model 2.0.
- GB/Z 185.1-2026, 人工智能 智能体互联 第1部分：总体架构.
- GB/Z 185.2-2026, 人工智能 智能体互联 第2部分：身份码.
- GB/Z 185.3-2026, 人工智能 智能体互联 第3部分：身份管理.

## 10. Informative References

The following are not published standards and MUST NOT be cited as such:

- `draft-ietf-wimse-aims-00`, AI Identity Management System;
- `draft-ietf-wimse-arch-08`, WIMSE Architecture;
- `draft-ietf-wimse-identifier-03`, Workload Identifier;
- `draft-ietf-wimse-workload-creds-02`, WIMSE Workload Credentials;
- `draft-ietf-wimse-wpt-02`, WIMSE Workload Proof Token;
- `draft-ietf-wimse-mutual-tls-02`, Workload Authentication Using Mutual TLS;
- `draft-ietf-wimse-http-signature-07`, Workload-to-Workload Authentication with HTTP Signatures;
- `draft-ietf-wimse-workload-identity-practices-06`, Workload Identity Practices;
- `draft-narajala-courtney-ansv2-01`, Agent Name Service v2;
- `draft-hardt-oauth-aauth-protocol-10`, AAuth Protocol;
- `draft-sharif-agent-identity-framework-01`, Agent Identity Framework;
- `draft-wahl-scim-agent-schema-01`, SCIM Agentic Identity Schema.

Status verification entry points:

- IETF WIMSE: <https://datatracker.ietf.org/wg/wimse/documents/>
- National Standards Information Public Service Platform: <https://std.samr.gov.cn/>

## 11. Items for Discussion

1. Whether the series releases parts synchronously or with independent semantic versions;
2. whether a future revision defines a discovery wire protocol;
3. whether to align part numbering explicitly with `GB/Z 185`;
4. the length of the single-document migration window and the removal condition.
