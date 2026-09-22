# Example: Twin Agent Onboarding

Informative. If this example conflicts with `../spec/part-*/`, the specification governs.

## Scenario

An organization at Authority Namespace `https://id.example.com/org/acme` registers a
`twin` Agent whose Authority Root is a single human master. A running workload
enrolls as an Agent Instance, obtains a short-lived identity token, and the token
is introspected by a resource server.

## Flow

```text
human master -> register Agent (Part 2)
             -> publish/consume discovery document (Part 2)
workload     -> enrollment challenge + attestation + PoP (Part 3)
             -> identity token request (Part 3)
resource PEP -> authoritative online verification / introspection (Part 3)
```

## 1. Register the Agent (Part 2)

`POST https://id.example.com/org/acme/agents` with an mTLS-authenticated caller.

```json
{
  "namespace": "https://id.example.com/org/acme",
  "agent_id": "agt_01JABCDEF0000000000000000",
  "agent_class": "twin",
  "authority_binding_ref": "ab_twin_01",
  "lifecycle_state": "registered",
  "lifecycle_epoch": 0
}
```

The Authority Binding is immutable and points to exactly one human master
(Part 2 Section 5.3). Registration, binding, and evidence commit in one transaction.

## 2. Discover the issuer (Part 2)

`GET https://id.example.com/org/acme/.well-known/agent-iam`

```json
{
  "discovery_version": "0.1.0-draft",
  "namespace": "https://id.example.com/org/acme",
  "issuer": "https://id.example.com/org/acme",
  "jwks_uri": "https://id.example.com/org/acme/jwks",
  "supported_proof_profiles": ["spiffe", "kubernetes", "mtls"],
  "supported_artifact_types": ["identity+jwt", "enrollment+jwt"],
  "key_rotation": { "overlap_seconds": 86400, "propagation_seconds": 60 }
}
```

## 3. Enroll the Instance (Part 3)

1. The registry issues a single-use, namespace-scoped challenge with a nonce.
2. The workload presents verified workload evidence (for example a SPIFFE X.509-SVID).
3. The Agent proves possession of its private key with an Enrollment JWT proof bound
   to `challenge_id` and `nonce` (Part 3 Section 4.3).
4. The credential, instance, state transition, and evidence are created atomically.

The Agent transitions `registered -> enrolled -> active`, increasing
`lifecycle_epoch` on each transition (Part 2 Section 6.2).

## 4. Obtain an identity token (Part 3)

The token binds the namespace, Agent class, instance, workload, authority root, and
current lifecycle epoch, and is sender-constrained via `cnf.jkt` (Part 3 Section 5.1).

## 5. Verify at the resource (Parts 3 and 4)

The resource server verifies the proof of possession and performs authoritative online
verification against the Agent, Instance, and credential state. Only then may the
authorization plane (Part 4) derive an Execution Grant. The identity token alone does
not authorize any action.
