[English](README.md) · [简体中文](README.zh-CN.md)

# Agent IAM Series

An open interoperability series for AI Agent identity, registration, discovery, authentication, authorization, delegation, lifecycle, federation, and audit.

- Series identifier: `agent-iam-series`
- Version: `0.1.0-draft`
- Status: **Project draft**, not an international, national, or industry standard
- Repository: <https://github.com/AICTRI/agent-iam-spec>

The series is organized into seven parts. See [`spec/README.md`](spec/README.md) for the part map and migration status, and [`rfcs/0002-series-structure.md`](rfcs/0002-series-structure.md) for the restructuring decision.

## Language

English is the primary normative language. The Chinese text is an equivalent translation provided for reference. If the two conflict, the English text governs.

| Document | Language | Path |
|---|---|---|
| Series index | English | [`spec/README.md`](spec/README.md) |
| Series index (translation) | 简体中文 | [`spec/README.zh-CN.md`](spec/README.zh-CN.md) |
| Part 1–7 (primary, normative) | English | `spec/part-0N-*/en/` |
| Part 1–7 (translation) | 简体中文 | `spec/part-0N-*/zh-CN/` |

## Repository layout

```text
agent-iam-spec/
├── README.md            # English (primary)
├── README.zh-CN.md      # Chinese
├── IMPLEMENTATIONS.md   # Reference implementations (English, primary)
├── IMPLEMENTATIONS.zh-CN.md
├── GOVERNANCE.md
├── CONTRIBUTING.md
├── SECURITY.md
├── CHANGELOG.md
├── LICENSE              # CC BY 4.0 for specification text
├── LICENSE-CODE         # Apache-2.0 for schemas, code, tooling
├── spec/
│   ├── README.md        # series index and part map
│   ├── part-01-architecture/{en,zh-CN}/
│   ├── part-02-registration-discovery/{en,zh-CN}/
│   ├── part-03-authentication/{en,zh-CN}/
│   ├── part-04-authorization/{en,zh-CN}/
│   ├── part-05-federation/{en,zh-CN}/
│   ├── part-06-audit/{en,zh-CN}/
│   └── part-07-conformance/{en,zh-CN}/
├── profiles/            # Normative profiles (narrow the base spec)
├── schemas/             # JSON Schema, OpenAPI, protocol schemas
├── conformance/         # Conformance test vectors and fixtures
├── mappings/            # Vendor and standards alignment (non-normative)
├── rfcs/                # Change proposals
└── examples/            # End-to-end examples
```

## Status of related standards

As of 2026-09-22:

- No single published ISO/IEC, IETF, W3C, or OASIS standard defines end-to-end Agent IAM identity, credentials, delegation, revocation, and federation interoperability.
- The IETF WIMSE documents, including AIMS (`draft-ietf-wimse-aims-00`), are Internet-Drafts, not RFCs.
- China has published `GB/Z 185.1-2026`, `GB/Z 185.2-2026`, and `GB/Z 185.3-2026` (Artificial intelligence — Agent interconnection). These are national standardization guidance technical documents, not mandatory `GB` and not recommended `GB/T`.

See [`mappings/`](mappings/) for details.

## Scope

In scope:

- Agent identity objects: Agent, Agent Instance, Authority Root, Authority Binding;
- registration and identity discovery;
- lifecycle state machine and lifecycle epoch;
- enrollment, workload attestation, and proof-of-possession;
- identity tokens and authoritative online verification;
- principal model and authorization modes;
- policy decisions, execution grants, and delegation non-amplification;
- revocation classes and freshness;
- federation and principal isolation;
- security event records.

Out of scope:

- LLM, planner, and prompt implementations;
- human passwords, MFA, and browser sessions;
- vendor-specific HSM, KMS, gateway, or service mesh implementations;
- product catalogs and workflow data models;
- a global Agent ID registration authority.

## Reference implementations

| Component | Role |
|---|---|
| [EIDOVELA](https://github.com/axisrobo/eidovela) | Agent Identity Provider: registration, Authority Binding, workload enrollment, lifecycle, PoP credentials, identity tokens, federation |
| [AEGIVELA](https://github.com/axisrobo/aegivela) | Agent authorization plane: Principal resolution, policy decisions, execution grants, delegation, revocation |

See [`IMPLEMENTATIONS.md`](IMPLEMENTATIONS.md) for repositories, composition, and conformance status.

## Conformance

Conformance is declared per part and composed through the series profiles (`Identity`, `Authorization`, `Federated`) defined in Part 7. A conformance claim must list the supported parts and levels, proof profiles, token/artifact versions, revocation SLO, discovery mechanism, known extensions, and any unmet clauses.

Reference implementation mappings are recorded in [`mappings/`](mappings/) and must not be used as a substitute for the specification.

Repository consistency (JSON, schemas, conformance vectors, and links) is checked by `node conformance/validate.mjs` and run in CI.

## License

- Specification text: CC BY 4.0. See [`LICENSE`](LICENSE).
- Schemas, code, and conformance tooling: Apache-2.0. See [`LICENSE-CODE`](LICENSE-CODE).

## Contributing

See [`CONTRIBUTING.md`](CONTRIBUTING.md) and [`GOVERNANCE.md`](GOVERNANCE.md). To report a security issue, see [`SECURITY.md`](SECURITY.md).
