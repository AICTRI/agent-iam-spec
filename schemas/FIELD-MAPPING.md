# Schema Field Mapping

Informative. Maps each schema field to the normative clause in `../spec/part-*/`.
The specification governs if this table conflicts with it.

## agent-identity.schema.json (Part 2)

| Field | Clause |
|---|---|
| `namespace` | 4.3 |
| `agent_id` | 4.2 |
| `agent_class` | 5.2 |
| `blueprint_id`, `blueprint_version` | 5.4 |
| `authority_binding_ref` | 5.3 |
| `sponsor_ref` | 5.1 |
| `lifecycle_state`, `lifecycle_epoch` | 6.1, 6.2 |
| `created_at`, `updated_at` | 5.1 |

## agent-instance.schema.json (Part 2)

| Field | Clause |
|---|---|
| `namespace`, `instance_id`, `agent_id` | 5.6 |
| `workload_registration_id`, `workload_id` | 5.6, 5.5 |
| `artifact_digest` | 5.6 |
| `attestation_ref` | 5.6 |
| `credential_generation`, `lease_expires_at` | 5.6, 3.5 (Part 3) |
| `instance_state` | 6.3 |

## authority-binding.schema.json (Part 2)

| Field | Clause |
|---|---|
| `namespace`, `agent_id`, `authority_root_ref` | 4.4, 5.3 |
| `authority_root_type` | 5.2 |
| `immutable` | 4.5, 5.3 |

## workload-registration.schema.json (Part 2)

| Field | Clause |
|---|---|
| `namespace`, `workload_registration_id` | 5.5 |
| `platform`, `selector` | 5.5, 4.4 (Part 3) |
| `trust_domain` | 5.5 |
| `allowed_proof_methods` | 5.5, 4.5 (Part 3) |
| `status` | 5.5 |

## discovery-document.schema.json (Part 2)

| Field | Clause |
|---|---|
| `discovery_version` | 8.2 |
| `namespace`, `issuer` | 8.2, 8.3 |
| `registry_endpoint` | 8.2 |
| `jwks_uri` | 8.2 |
| `supported_proof_profiles`, `supported_artifact_types` | 8.2 |
| `conformance_claim_ref` | 8.2 |
| `key_rotation` | 8.2 (Part 3 5.6) |

## identity-token.schema.json (Part 3)

| Field | Clause |
|---|---|
| `iss`, `sub`, `aud`, `iat`, `exp`, `jti` | 5.1 |
| `namespace` | 5.1 |
| `agent_class`, `instance_id`, `workload_id`, `authority_root_ref`, `lifecycle_epoch` | 5.1 |
| `cnf.jkt` | 5.1, 5.4 |

## enrollment-proof.schema.json (Part 3)

| Field | Clause |
|---|---|
| `iss`, `sub`, `aud` | 4.3 |
| `iat`, `exp`, `jti` | 4.3 |
| `challenge_id`, `nonce` | 4.2, 4.3 |

## policy-decision.schema.json (Part 4)

| Field | Clause |
|---|---|
| `namespace`, `authorization_mode` | 4.2, 3.2 |
| `subject`, `actor`, `client`, `workload`, `authority_root_ref` | 4.2, 3.3 |
| `action`, `resource` | 4.2 |
| `scope`, `audience` | 4.2 |
| `policy_id`, `policy_version` | 4.2 |
| `lifecycle_epoch` | 4.2 |
| `decision_id`, `iat`, `exp` | 4.2 |
| `outcome`, `obligations` | 4.2 |

## execution-grant.schema.json (Part 4)

| Field | Clause |
|---|---|
| `grant_id`, `namespace` | 4.3 |
| `action`, `resource`, `scope`, `task` | 4.3 |
| `audience` | 4.3 |
| `policy_version`, `lifecycle_epoch` | 4.3 |
| `parent_lineage` | 4.1, 4.3 |
| `expires_at` | 4.3, 5.1 |
| `cnf` | 3.1 (Part 3), 4.3 |

## federation-trust.schema.json (Part 5)

| Field | Clause |
|---|---|
| `namespace`, `peer_issuer` | 3 |
| `jwks_uri`, `trust_bundle` | 3 |
| `allowed_audiences` | 3 |
| `claim_mapping` | 3 |
| `pop_requirements` | 3 |
| `trust_status` | 3, 6 |
| `key_refresh` | 3, 8 |

## security-event.schema.json (Part 6)

| Field | Clause |
|---|---|
| `event_id`, `event_type`, `timestamp` | 4 |
| `namespace` | 4 |
| `agent_id`, `instance_id` | 4 |
| `subject`, `actor`, `client`, `workload` | 4 |
| `lifecycle_epoch` | 4 |
| `action`, `resource_digest` | 4 |
| `policy_version` | 4 |
| `decision_id`, `grant_id`, `approval_id` | 4 |
| `trace_id`, `outcome`, `reason_code` | 4 |
| `evidence_refs` | 1, 4, 5 |
