# Example: Service Agent High-Risk Action

Informative. If this example conflicts with `../spec/part-*/`, the specification governs.

## Scenario

A `service` Agent requests a high-risk action. The PDP first returns
`approval_required`, a human approves, the PDP returns `allow`, an Execution Grant is
minted, and the PEP enforces it before the effect.

## Flow (Part 4)

```text
verified principal (Part 3)
  -> PDP decision = approval_required
  -> Approval (human)
  -> PDP decision = allow
  -> Execution Grant
  -> PEP verification and effect
```

## 1. Authorization mode and effective authority

The mode is `service_agent_api`: the authority source is the organization/system root,
and the required proof is Agent identity + workload + epoch (Part 3 Section 6). Effective
authority is the intersection of the organization authority, the Agent envelope, the
workload grant, the requested authority, and policy (Part 4 Section 3.3). Missing any
input is rejected.

## 2. Decision requires approval

```json
{
  "namespace": "https://id.example.com/org/acme",
  "authorization_mode": "service_agent_api",
  "action": "payments.transfer",
  "resource": { "type": "account", "id": "acct_42" },
  "scope": ["payments:transfer"],
  "audience": "https://payments.example.com",
  "policy_id": "pol.payments",
  "policy_version": "7",
  "lifecycle_epoch": 12,
  "decision_id": "dec_01",
  "outcome": "approval_required"
}
```

`approval_required` MUST block execution. The Approval binds namespace, approver,
agent/actor, action, resource, scope, audience, reason digest, expiry, and policy
version (Part 4 Section 5.3).

## 3. Allow derives a grant

Only after a verified `allow` may an Execution Grant be minted. The grant binds action,
resource, scope, task, policy version, lifecycle epoch, and parent lineage, and is
sender-constrained (Part 4 Section 4.3).

## 4. PEP enforcement

The PEP verifies signature, audience, namespace, PoP, resource digest, epoch, and
revocation before the effect, re-checks at long-task continuation boundaries, and
performs exact matching on action, host, path, tool ID, skill hash, and implementation
digest (Part 4 Section 6). Credential injection, if any, is an explicit obligation and
the credential value never enters a Decision, Grant, prompt, or evidence.
