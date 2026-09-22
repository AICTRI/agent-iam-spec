# Governance

## 1. Scope

This document defines how `agent-iam-spec` is versioned, changed, and published.

## 2. Document status

This project is a project draft. It is not an international, national, or industry standard. The repository name and identifier must not be presented as evidence of standards-body approval.

## 3. Normative text

Only the following are normative:

- `spec/zh-CN/agent-iam-spec.md`
- `spec/en/agent-iam-spec.md`
- documents published under `profiles/`

Everything else, including `mappings/`, `examples/`, `README.md`, and this file, is informative.

The Chinese and English specification texts are normative and must stay aligned. A conflict between them is a defect and must be resolved by a change proposal.

## 4. Change process

All normative changes go through a proposal in `rfcs/`:

1. Open an issue describing the problem and affected clauses.
2. Submit an RFC document under `rfcs/` using `rfcs/RFC-TEMPLATE.md`.
3. Discussion period: minimum 14 calendar days for normative changes.
4. Decision: recorded in the RFC document with rationale and dissent.
5. Merge: update the specification and `CHANGELOG.md`.

Editorial changes, broken links, and typo fixes may be merged directly without an RFC.

## 5. Versioning

- Format: `major.minor.patch` with an optional `-draft` suffix.
- `major`: incompatible normative change.
- `minor`: backward-compatible normative addition.
- `patch`: editorial or clarification change with no behavior change.
- Draft versions may change incompatibly at any time.

## 6. Profiles

Profiles under `profiles/` may only narrow or refine base requirements. A profile may not relax a `MUST` or `MUST NOT` in the base specification.

## 7. Internet-Drafts and external standards

Internet-Drafts must be cited with an explicit version and marked as work in progress. They must not be cited as published standards. When an Internet-Draft is published as an RFC, the corresponding citations and clauses must be reviewed.

## 8. Decision making

- Lazy consensus is the default for editorial changes.
- Normative changes require explicit approval from at least one maintainer and no unresolved blocking objection.
- Blocking objections must include a concrete technical rationale and a proposed alternative.

## 9. Roles

- Maintainers: merge changes, cut releases, manage the repository.
- Editors: keep the Chinese and English texts aligned.
- Contributors: submit issues and RFCs.

Maintainer list is maintained by the hosting organization.

## 10. Licensing of contributions

By contributing, you agree that:

- specification text contributions are licensed under CC BY 4.0;
- schema, code, and tooling contributions are licensed under Apache-2.0.

See `CONTRIBUTING.md` for details.
