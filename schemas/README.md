# Schemas

Normative JSON Schema, OpenAPI, and protocol schemas for `agent-iam-spec`.

Licensed under Apache-2.0. See `../LICENSE-CODE`.

## Status

No schema has been published yet. Until then, the normative text in `../spec/` governs.

## Planned schemas

| Schema | Purpose |
|---|---|
| `agent-identity.schema.json` | Agent Identity record |
| `agent-instance.schema.json` | Agent Instance record |
| `authority-binding.schema.json` | Authority Binding record |
| `workload-registration.schema.json` | Workload Registration record |
| `enrollment-proof.schema.json` | Enrollment JWT proof claims |
| `identity-token.schema.json` | Local Agent identity token claims |
| `policy-decision.schema.json` | Versioned policy decision |
| `execution-grant.schema.json` | Execution Grant claims |
| `security-event.schema.json` | Security event record |
| `federation-trust.schema.json` | Federation trust configuration |

## Requirements

- Schemas must not contradict `../spec/`.
- Claim names and field names must match the specification exactly.
- Every schema must identify its `agent-iam-spec` version.
- Security-critical fields must be required, not optional, unless the specification marks them conditional.
