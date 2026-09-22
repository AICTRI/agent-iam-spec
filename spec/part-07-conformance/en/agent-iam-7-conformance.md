[English](agent-iam-7-conformance.md) · [简体中文](../zh-CN/agent-iam-7-conformance.md)

# Agent IAM Series — Part 7: Conformance and Testing

- Series identifier: `agent-iam-series`
- Part identifier: `agent-iam-7-conformance`
- Version: `0.1.0-draft`
- Date: 2026-09-22
- Status: Project draft, not an international, national, or industry standard
- License: CC BY 4.0 (specification text)

This part defines conformance for each part and the series-level composite profiles. It replaces the former Level 1/2/3 model that assumed a single document.

## 1. Scope

This part specifies:

- per-part conformance levels;
- series composite profiles;
- the content of a conformance claim;
- test vectors and interoperability test events;
- the relation to profiles under `profiles/`.

## 2. Normative References

All parts.

## 3. Per-Part Conformance Levels

Each part defines its own conformance level. At minimum:

### 3.1 Part 2: Registration and Discovery

- namespace-scoped Agent ID and `namespace + agent_id` uniqueness;
- immutable Authority Binding;
- Agent/Instance separation and lifecycle with monotonic epoch;
- discovery document and resolution rules;
- basic evidence for registration and lifecycle.

### 3.2 Part 3: Identity and Authentication

- enrollment challenge and workload attestation;
- proof of possession and short-lived identity Token;
- token request proof;
- authoritative online verification of Agent, Instance, and credential generation state;
- credential revocation.

### 3.3 Part 4: Authorization and Delegation

- subject/actor/client/workload separation;
- authorization modes and effective authority;
- versioned PDP Decision;
- audience/resource/task-bound Execution Grant;
- PEP and namespace-scoped revocation;
- non-amplification of authority.

### 3.4 Part 5: Federation

- namespace-scoped Federation Trust;
- PoP federated verification;
- local/federated principal isolation;
- online revocation of trust disable;
- cross-domain evidence correlation.

## 4. Series Composite Profiles

The series defines the following composite profiles:

| Profile | Composed of |
|---|---|
| `Identity` | Part 2 + Part 3 |
| `Authorization` | `Identity` + Part 4 |
| `Federated` | `Authorization` + Part 5 |

The audit requirements of Part 6 apply to any claimed profile. This part applies to any claimed profile.

## 5. Conformance Claim

A conformance claim MUST list:

- the supported parts and levels;
- the composite profile, if claimed;
- the supported proof Profiles;
- the supported Token/artifact versions;
- the revocation SLO;
- the discovery mechanism and caching bounds;
- known extensions;
- any unmet clauses.

A claim MUST NOT merely state "compatible with Agent IAM."

## 6. Test Vectors and Interoperability Events

- Test vectors are published under `conformance/` and MUST include positive and negative cases.
- Every negative case MUST name the part and clause it exercises.
- Vectors MUST be language-neutral and reproducible.
- Where behavior depends on a profile, the vector MUST state the profile and version.

## 7. Relation to Profiles

Profiles under `profiles/` may only narrow or refine the part they extend. A profile MUST declare the part identifier and series version it applies to. A profile MUST NOT relax a `MUST` or `MUST NOT` in that part.

## Appendix A. Migration Source (Informative)

| Current clauses | Mapped here |
|---|---|
| §20.1 Level 1 Agent Identity | Section 4 (`Identity`) |
| §20.2 Level 2 Agent Authorization | Section 4 (`Authorization`) |
| §20.3 Level 3 Federated Agent IAM | Section 4 (`Federated`) |
| conformance/ and profiles/ | Sections 3, 6, 7 |
