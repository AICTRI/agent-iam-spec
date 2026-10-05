# Profile: Delegation and Token Exchange

- Profile identifier: `agent-iam-profile-delegation`
- Applies to: Part 4 `agent-iam-4-authorization`
- Series version: `0.4.1-draft`
- Status: Draft (normative when published)
- Language: English is normative. A Chinese translation, when present, is an equivalent translation.

This Profile narrows Part 4 Section 5 (delegation, token exchange, approval, and
pre-authorization) and depends on the `authorization` Profile. It does not relax
any `MUST` or `MUST NOT` in Part 4.

## 1. Scope

It defines the attenuation relation that makes delegation decidable and
versioned, the distinction between identity preservation, impersonation,
delegation, and execution-grant derivation, the OAuth 2.0 token-exchange binding,
and approval / pre-authorization.

## 2. Attenuation relation

Any child authorization MUST satisfy:

```text
child.scope       subset-of parent.scope
child.audience    subset-of parent.audience
child.expiresAt  <= parent.expiresAt
child.task        equal-to-or-narrower-than parent.task
child.action      equal-to-or-narrower-than parent.action
child.resource    equal-to-or-narrower-than parent.resource
```

The namespace, Authority Root, and immutable principal binding MUST NOT change
during delegation. A child artifact that widens any dimension MUST be denied
before issuance.

## 3. Decidability and versioning

The attenuation relation MUST be decidable and versioned:

- **audience** MUST be normalized into an exact string set and compared with a set
  subset operation;
- **action** MUST be equal by default unless this Profile defines an explicit
  partial order;
- **resource** MUST use a typed canonical descriptor and the containment function
  of that type; a `structuredResourceDigest` MUST be computed per Part 1 §6.2;
- **task** MUST use an opaque `taskId` or structured constraints; "narrower" MUST
  NOT be judged from natural language;
- a Decision and a Grant MUST identify the version of the attenuation Profile they
  use.

The child principal identity (namespace, `authorityBindingRef`, both epochs,
instance) MUST be preserved from the verified parent; a delegation MUST NOT
re-target identity.

## 4. OAuth token exchange

When RFC 8693 is used, the following MUST be distinguished:

- identity-preserving token derivation;
- impersonation;
- delegation;
- execution-grant derivation.

An exchange that only preserves identity, audience, expiry, and PoP MUST NOT be
described as a complete authorization delegation. Multi-level delegation MUST
preserve the actor/parent lineage, and the resource server MUST perform authority
attenuation checks. An exchange service MUST NOT synthesize an `allow` decision;
a grant MUST be derived from a verified canonical allow decision.

## 5. Approval

An Approval MUST bind the namespace, approver, agent/actor, action, resource,
scope, audience, reason digest, expiry, and policy version. When a structured
resource is bound, the approval MUST carry a `structuredResourceDigest` and a
`descriptorVersion` together. The approval artifact MUST remain subject to the
authoritative `approvalJti` revocation check and MUST NOT bypass it.

## 6. Pre-authorization

Pre-Authorization provides only a time-limited, quota-limited usage window for
existing authority and MUST NOT elevate authority. Quota updates such as
`maxGrants` and `usedGrants` MUST be atomic and monotonic.

## 7. Conformance

- `../conformance/part-04-authorization/delegation-non-amplification.positive.json`
- `../conformance/part-04-authorization/delegation-non-amplification.negative.json`
- `../conformance/cross-repo/part-04-authorization/p4-delegation-non-amplification.json`
- `../conformance/cross-repo/part-04-authorization/p4-approval-binding.json`

An implementation claiming this Profile MUST pass every vector above.

## 8. References

- RFC 8693 — OAuth 2.0 Token Exchange (Standards Track).
- Part 1 §6.2 canonicalization.
- Part 4 §4 and §5; the `authorization` Profile.
