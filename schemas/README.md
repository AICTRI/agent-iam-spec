# Schemas

Normative JSON Schema, OpenAPI, and protocol schemas for the Agent IAM Series.

Licensed under Apache-2.0. See `../LICENSE-CODE`.

## Status

Draft schemas are published for the records below. They are derived from the
normative text in `../spec/part-*/`, which governs if they conflict.

| Schema | Part | Purpose |
|---|---|---|
| `agent-identity.schema.json` | 2 | Agent Identity record |
| `agent-instance.schema.json` | 2 | Agent Instance record |
| `authority-binding.schema.json` | 2 | Authority Binding record |
| `workload-registration.schema.json` | 2 | Workload Registration record |
| `discovery-document.schema.json` | 2 | Authority Namespace discovery document |
| `identity-token.schema.json` | 3 | Local Agent identity token claims |
| `enrollment-proof.schema.json` | 3 | Enrollment JWT proof of possession claims |
| `policy-decision.schema.json` | 4 | Versioned policy decision |
| `execution-grant.schema.json` | 4 | Execution Grant claims |
| `federation-trust.schema.json` | 5 | Federation trust configuration |
| `security-event.schema.json` | 6 | Security event record |

| `registry-discovery.openapi.json` | 2 | Registry and discovery HTTP API (OpenAPI 3.1) |
| `identity-sts.openapi.json` | 3 | Enrollment, token, and introspection API (OpenAPI 3.1) |
| `authorization.openapi.json` | 4 | Decision, grant, exchange, approval, revocation API (OpenAPI 3.1) |
| `federation.openapi.json` | 5 | Federation trust management and brokered verification API (OpenAPI 3.1) |

Reusable request body schemas are under `requests/`. Field-to-clause mappings are in `FIELD-MAPPING.md`.

## Requirements

- Schemas must not contradict `../spec/`.
- Claim names and field names must match the specification exactly.
- Every schema must identify its series version and the part it belongs to.
- Security-critical fields must be required, not optional, unless the specification marks them conditional.
