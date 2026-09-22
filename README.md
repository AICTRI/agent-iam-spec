[English](README.md) · [简体中文](README.zh-CN.md)

# Agent IAM Specification

An open interoperability specification for AI Agent identity, authentication, authorization, delegation, lifecycle, federation, and audit.

- Specification identifier: `agent-iam-spec`
- Version: `0.1.0-draft`
- Status: **Project draft**, not an international, national, or industry standard
- Repository: <https://github.com/AICTRI/agent-iam-spec>

## Language

English is the primary language of this specification. The Chinese text is an equivalent translation provided for reference.

| Document | Language | Path |
|---|---|---|
| Specification (primary, normative) | English | [`spec/en/agent-iam-spec.md`](spec/en/agent-iam-spec.md) |
| Specification (translation) | 简体中文 | [`spec/zh-CN/agent-iam-spec.md`](spec/zh-CN/agent-iam-spec.md) |

If the two language texts conflict, the English text governs and the Chinese text is treated as having a defect that must be fixed.

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
│   ├── en/              # English normative text (primary)
│   └── zh-CN/           # Chinese translation
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

Conformance is declared at Level 1, 2, or 3 as defined in the specification. A conformance claim must list the supported level, proof profiles, token/profile versions, revocation SLO, known extensions, and any unmet clauses.

Reference implementation mappings are recorded in [`mappings/`](mappings/) and must not be used as a substitute for the specification.

## License

- Specification text: CC BY 4.0. See [`LICENSE`](LICENSE).
- Schemas, code, and conformance tooling: Apache-2.0. See [`LICENSE-CODE`](LICENSE-CODE).

## Contributing

See [`CONTRIBUTING.md`](CONTRIBUTING.md) and [`GOVERNANCE.md`](GOVERNANCE.md). To report a security issue, see [`SECURITY.md`](SECURITY.md).
