[English](IMPLEMENTATIONS.md) · [简体中文](IMPLEMENTATIONS.zh-CN.md)

# Reference Implementations

This page lists implementations of the Agent IAM Series. Implementations are informative: they do not define the specification and their status does not modify any clause.

No implementation listed here is endorsed as fully conformant. Refer to the conformance claim of each implementation and to [`mappings/`](mappings/) for the current gaps.

## Components

| Component | Series parts | Role in the specification | Repositories |
|---|---|---|---|
| NOMIVELA | 2 | Agent Registry and Namespace Authority: Agent/Agent ID registration, Authority Namespace, immutable Authority Binding, lifecycle and epochs, Workload Registration, Agent Instance, signed discovery | Core (private): <https://github.com/axisrobo/nomivela> · Open contracts and SDKs: <https://github.com/axisrobo/nomivela-open> |
| EIDOVELA | 3, 5 | Agent Authentication Provider: consumes Registry records; workload enrollment, attestation, proof-of-possession credentials, identity tokens, authoritative introspection, federation | Core (private): <https://github.com/axisrobo/eidovela> · Open contracts and SDKs: <https://github.com/axisrobo/eidovela-open> |
| AEGIVELA | 4, 6 | Agent Authorization plane: Principal resolution, authorization modes, policy decisions, execution grants, delegation, approval, revocation | Core (private): <https://github.com/axisrobo/aegivela> · Open contracts and SDK: <https://github.com/axisrobo/aegivela-open> |

The `-open` repositories host public contracts, SDKs, examples, and conformance fixtures under Apache-2.0. The core repositories host the implementation and are private; access is required.

## How the components compose

```text
Enterprise human IdP / organization authority
          |
          v
NOMIVELA  Agent Registry and Namespace Authority
          Agent / Agent ID / Authority Namespace / Authority Binding /
          lifecycle and epochs / Workload Registration / Agent Instance /
          signed discovery
          |
          v
EIDOVELA  Agent Authentication Provider
          consumes Registry records; registration, Authority Binding,
          workload enrollment, lifecycle and epoch, PoP identity
          credentials, federation
          |
          v
AEGIVELA  Agent Authorization plane
          Principal resolution, PDP, approval, delegation,
          Execution Grant, revocation
          |
          v
PEP       API gateway, tool gateway, model ingress, business service, executor
```

Identity credentials prove who is calling and the current identity state. They do not authorize an action. Registration and lifecycle are authoritative in the Registry; authentication is authoritative in the Authentication Provider; execution authorization is decided by the authorization plane, as required by the specification.

## Mapping and conformance status

The clause-by-clause mapping and the gaps that must be closed before a conformance claim are recorded in:

- [`mappings/nomivela-eidovela-aegivela.md`](mappings/nomivela-eidovela-aegivela.md)

Current status summary:

| Component | Status |
|---|---|
| NOMIVELA | Implemented (`v2.0.0`): registration, separate lifecycle epochs, immutable Authority Binding, Workload Registration, Agent Instance, signed discovery, and the Registry Context point read; the public contract graduated from `0.1` to `agent-registry-v1.0` |
| EIDOVELA | Implemented (`v2.2.1`): registry-consumer mode (write endpoints return `410 write_authority_moved`), enrollment and workload attestation, credential generations, PoP tokens, dual-epoch online verification, credential revocation, and federation trust with brokered issuance; EE HSM/KMS custody and console remain pending |
| AEGIVELA | Implemented (`v1.1.1`): authorization modes, signed decisions, execution grants, delegation, approval, revocation, and Part 6 evidence alignment; the Part 7 composite conformance claim and the cross-repository Part 3–7 fixtures remain pending |

## Conformance claim template

An implementation publishing a conformance claim should state:

```text
Implementation name:
Version / commit:
Supported parts and levels: Part 2 | 3 | 4 | 5 (list each)
Declared composite profile: Identity | Authorization | Federated
Supported proof profiles:
Supported token / artifact versions:
Revocation SLO:
Discovery mechanism and caching bounds:
Known extensions:
Unmet clauses:
```

## Adding an implementation

Submit a pull request that adds a row to the Components table and, when available, a mapping document under [`mappings/`](mappings/). Include:

- the component name and the specification part(s) and role it implements;
- repository links, and a note if access is restricted;
- the declared parts, levels, composite profile, and any unmet clauses;
- a mapping document that cites the specification parts and clauses.
