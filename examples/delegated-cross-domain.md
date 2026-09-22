# Example: Delegated Cross-Domain Access

Informative. If this example conflicts with `../spec/part-*/`, the specification governs.

## Scenario

A user delegates access to an Agent, which exchanges the token and accesses a partner
resource in another Authority Namespace. Each hop must attenuate authority.

## Flow (Parts 4 and 5)

```text
human subject (delegated_api)
  -> Agent parent grant
  -> token exchange (attenuated child grant)
  -> cross-domain brokered token (Part 5)
  -> partner PEP verification
```

## 1. Delegation (Part 4 Section 5)

The mode is `delegated_api`: the authority source is the human subject and the service
is the actor; the required proof is user delegation + client/workload proof
(Part 3 Section 6). Any child authorization MUST satisfy:

```text
child.scope       subset-of parent.scope
child.audience    subset-of parent.audience
child.expires_at  <= parent.expires_at
child.task        equal-to-or-narrower-than parent.task
child.action      equal-to-or-narrower-than parent.action
child.resource    equal-to-or-narrower-than parent.resource
```

The namespace, Authority Root, and immutable principal binding MUST NOT change during
delegation. Attenuation MUST be decidable and versioned; "narrower" MUST NOT be judged
from natural language.

## 2. Token exchange (Part 4 Section 5.2)

When using RFC 8693, identity-preserving derivation, impersonation, delegation, and
Execution Grant derivation MUST be distinguished. An exchange that only preserves
identity, audience, expiry, and PoP MUST NOT be described as a complete authorization
delegation. Multi-level delegation preserves the actor/parent lineage.

## 3. Cross-domain (Part 5)

The partner verifies a brokered token against the active Federation Trust. The broker
uses a namespace that does not collide with local Agent IDs and preserves the source
Authority Namespace; the peer claim MUST NOT override the local namespace.
