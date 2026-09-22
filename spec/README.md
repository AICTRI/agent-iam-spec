[English](README.md) · [简体中文](README.zh-CN.md)

# Agent IAM Series

An open interoperability series for AI Agent identity, registration, discovery, authentication, authorization, delegation, federation, and audit.

- Series identifier: `agent-iam-series`
- Version: `0.1.0-draft`
- Status: **Project draft**, not an international, national, or industry standard
- Repository: <https://github.com/AICTRI/agent-iam-spec>

> Migration note: the previous single-document edition (`spec/en/agent-iam-spec.md`,
> `spec/zh-CN/agent-iam-spec.md`) is being split into the parts below. During the
> migration both editions coexist; the parts are the target normative structure.
> See `rfcs/0002-series-structure.md`.

## Parts

| Part | Identifier | Title | Depends on | Status |
|---|---|---|---|---|
| 1 | `agent-iam-1-architecture` | Architecture and Terminology | — | Draft (written) |
| 2 | `agent-iam-2-registration-discovery` | Registration and Discovery | 1 | Draft (written) |
| 3 | `agent-iam-3-authentication` | Identity and Authentication | 1, 2 | Draft (written) |
| 4 | `agent-iam-4-authorization` | Authorization and Delegation | 1, 2, 3 | Draft (written) |
| 5 | `agent-iam-5-federation` | Cross-Domain Federation | 1, 3, 4 | Draft (written) |
| 6 | `agent-iam-6-audit` | Audit and Security Events | 1 | Draft (written) |
| 7 | `agent-iam-7-conformance` | Conformance and Testing | all | Draft (written) |

All seven parts carry the normative text. The former single-document edition is
retained only for traceability and will be removed once the parts are reviewed.

## Language

English is the primary normative language. The Chinese text is an equivalent translation provided for reference. If the two conflict, the English text governs.

Each part is published as:

```text
part-0N-<slug>/
├── en/<part-file>.md        # English (primary, normative)
└── zh-CN/<part-file>.md     # 简体中文 (translation)
```

## Dependency rules

- Part 1 defines terms, trusted-data-source rules, fail-closed behavior, normative language, canonicalization, revocation freshness vocabulary, and privacy principles.
- Part 2 defines names, identity records, lifecycle, the registry, and discovery.
- Part 3 consumes Part 2 records and outputs a `Verified Agent Identity Context`.
- Part 4 consumes the Part 3 context and MUST NOT re-derive identity from caller-supplied values.
- Part 5 references Part 3 and Part 4 interfaces for cross-domain operation.
- Part 6 provides one security event envelope used by all parts.
- Part 7 defines per-part conformance and a series-level composite profile.

A lower part MUST NOT depend on a higher part.

## License

- Specification text: CC BY 4.0. See [`../LICENSE`](../LICENSE).
- Schemas, code, and conformance tooling: Apache-2.0. See [`../LICENSE-CODE`](../LICENSE-CODE).
