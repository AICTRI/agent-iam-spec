# RFC-0003: Contract Naming and Identity Conventions

- Status: Accepted
- Authors: AxisRobo
- Date: 2026-09-30
- Affected documents and clauses: Part 1 §4 (terminology), Part 2 §5.1–5.2 (record and class), Part 3 §3 (authentication output), Parts 4–6 (artifact and event field names), `schemas/`, `conformance/`
- Type: Normative

## Summary

Adopt one wire-format convention across the series and its reference implementations: camelCase JSON field names with a `…Ref` suffix for references; dual lifecycle epochs (`agentEpoch` and `identityEpoch`) in place of the single `lifecycleEpoch`; a unified Agent class vocabulary; and an explicit statement that `tenant` is an implementation technique (namespace-to-tenant mapping for SaaS), not an interoperable claim.

## Motivation

The series currently uses snake_case field names and a single `lifecycleEpoch`, while the reference implementations diverge: NOMIVELA publishes camelCase (`authorityRootRef`, `agentId`, `agentEpoch`, `identityEpoch`), EIDOVELA projects snake_case and carries `tenant_id`, and AEGIVELA carries `tenant_id` and a legacy `lifecycle_epoch` alongside dual epochs. Names like `authority_binding_ref` / `authorityRootRef` / `authority_root` / `authority_binding` refer to the same concept under four spellings, and the Agent class vocabulary differs across products (`twin`/`service`/`ephemeral` vs `asset_twin`/`personal_twin`/`embedded`/`organizational`/`user`). This blocks mechanical interoperability and makes "same field" mapping error-prone.

## Detailed design

1. **Naming.** All JSON field names in normative records, requests, responses, and schemas use `lowerCamelCase`.

2. **References.** Fields that carry a reference use the `…Ref` suffix: `agentRef`, `authorityBindingRef`, `authorityRootRef`, `sponsorRef`, `ownerRef`, `workloadRegistrationRef`, `instanceRef`. Identifiers use `…Id` (`agentId`). The distinction between an identifier and a reference is preserved.

3. **Lifecycle epochs.** The verified context, records, decisions, grants, and events carry **two** epochs:
   - `agentEpoch` — the Agent business lifecycle epoch;
   - `identityEpoch` — the Agent ID security lifecycle epoch.
   The single `lifecycleEpoch` is deprecated; it MAY appear only as a legacy compatibility field and MUST NOT be the sole lifecycle signal. A change in either epoch invalidates affected artifacts.

4. **Agent class.** Part 2 §5.2 defines the following class set (the union of the reference implementations' classes):
   `embedded`, `organizational`, `user`, `assetTwin`, `personalTwin`, `twin`, `service`, `ephemeral`, `simulation`.
   The authority-root rule applies per class: `twin`/`assetTwin`/`personalTwin`/`ephemeral` → `human_master`; `service`/`organizational`/`embedded` → `organization_root` unless a deployment Profile narrows it; `simulation` MUST NOT be issued a production execution grant unless a deployment Profile explicitly permits it.

5. **Authority binding.** The record carries `authorityBindingRef` (a reference) consistent with other `…Ref` fields; the binding kind, when needed as a separate value, is `authorityBindingKind` with values `human_master` or `organization_root`.

6. **Tenant.** `tenant` is **not** an interoperable claim and MUST NOT appear as a required field in normative records, contexts, decisions, grants, or events. It MAY be retained by an implementation as an internal key that is deterministically mapped from the Authority Namespace (`namespace`), e.g. to operate a SaaS deployment. `namespace` is the only interoperable naming anchor; `namespace + agentId` is the uniqueness basis.

7. **Contract version format.** A contract version is written `v<major>.<minor>` — a `v` prefix followed by `major.minor`, for example `v1.0`, `v2.0`. No `-alpha`/`-beta`/`-draft` suffix appears in a contract version. The version is used consistently as the version directory name (`contracts/<domain>/v2.0`), the `api_version` literal (`aegivela.io/v2.0`), and the registry/SDK contract identifier (`agent-registry-v1.0`). The product *release* version remains `major.minor.patch` and is separate from the contract version.

## Impact

- Compatibility: incompatible. Field renames and the epoch change require new contract versions for consumers using snake_case or a single epoch.
- Affected profiles: all.
- Affected reference implementations:
  - NOMIVELA already publishes camelCase, `…Ref` references, and dual epochs; it needs only the Agent class set and the tenant/namespace statement aligned.
  - EIDOVELA must publish a contract line that uses camelCase and drops `tenant_id` as a required field; its current `v2.0` (snake_case, `tenant_id`) is frozen and a successor line is required.
  - AEGIVELA must migrate its contracts to camelCase, dual epochs, and `…Ref` references, and stop requiring `tenant_id`; its current `v1alphaX` lines remain frozen.
- Security impact: neutral to positive; `namespace`-scoped uniqueness and dual-epoch invalidation are preserved and made uniform.
- Privacy impact: none.

## Alternatives considered

- Keep snake_case as the series default and require implementations to project. Rejected: it preserves four spellings of the same concept and keeps interop mapping error-prone.
- Keep the single `lifecycleEpoch` and derive the dual epochs in implementations. Rejected: the dual epochs are security-relevant and must be explicit in the interoperable surface.
- Make `tenant` a required claim to simplify multi-tenancy. Rejected: it is an implementation concern and leaks deployment topology into the interoperable surface.

## Unresolved questions

- Whether `simulation` requires an explicit deployment Profile to issue any artifact, or only production execution grants.
- Whether the deprecated `lifecycleEpoch` is removed in the next major series version or retained indefinitely as optional.

## Decision

Accepted and applied in `0.3.0-draft` (2026-09-30): camelCase wire names, `…Ref` references, the dual `agentEpoch` / `identityEpoch`, the unified nine-class Agent set, and `tenant` as an implementation-only key were applied across the normative text, schemas, conformance vectors, and examples. No blocking objection recorded.
