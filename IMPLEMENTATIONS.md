[English](IMPLEMENTATIONS.md) · [简体中文](IMPLEMENTATIONS.zh-CN.md)

# Reference Implementations

This page lists implementations of the Agent IAM Series. Implementations are informative: they do not define the specification and their status does not modify any clause.

No implementation listed here is endorsed as fully conformant. Refer to the conformance claim of each implementation and to [`mappings/`](mappings/) for the current gaps.

## Components

| Component | Series parts | Role in the specification | Repositories |
|---|---|---|---|
| EIDOVELA | 2, 3, 5 | Agent Identity Provider: Agent registration, Authority Binding, workload enrollment, lifecycle and epoch, proof-of-possession credentials, identity tokens, authoritative introspection, federation | Core (private): <https://github.com/axisrobo/eidovela> · Open contracts and SDKs: <https://github.com/axisrobo/eidovela-open> |
| AEGIVELA | 4, 6 | Agent Authorization plane: Principal resolution, authorization modes, policy decisions, execution grants, delegation, approval, revocation | Core (private): <https://github.com/axisrobo/aegivela> · Open contracts and SDK: <https://github.com/axisrobo/aegivela-open> |

The `-open` repositories host public contracts, SDKs, examples, and conformance fixtures under Apache-2.0. The core repositories host the implementation and are private; access is required.

## How the components compose

```text
Enterprise human IdP / organization authority
          |
          v
EIDOVELA  Agent Identity Provider
          registration, Authority Binding, workload enrollment,
          lifecycle and epoch, PoP identity credentials, federation
          |
          v
AEGIVELA  Agent Authorization plane
          Principal resolution, PDP, approval, delegation,
          Execution Grant, revocation
          |
          v
PEP       API gateway, tool gateway, model ingress, business service, executor
```

Identity credentials prove who is calling and the current identity state. They do not authorize an action. Execution authorization is decided by the authorization plane, as required by the specification.

## Mapping and conformance status

The clause-by-clause mapping and the gaps that must be closed before a conformance claim are recorded in:

- [`mappings/eidovela-aegivela.md`](mappings/eidovela-aegivela.md)

Current status summary:

| Component | Status |
|---|---|
| EIDOVELA | Partial: identity object model, lifecycle epoch, and PoP enrollment exist; request-level PoP, instance and credential online revocation, attestor integration, and brokered token revocation are incomplete |
| AEGIVELA | Partial: authorization modes, decisions, and grants exist; the token exchange path does not yet satisfy the canonical allow lineage, and some contracts and runtime behavior diverge |

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
