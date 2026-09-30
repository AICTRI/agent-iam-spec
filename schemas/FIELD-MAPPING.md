# Schema Field Mapping

Informative. Maps each schema field to the normative clause in `../spec/part-*/`.
The specification governs if this table conflicts with it.

## agent-identity.schema.json (Part 2)

| Field | Clause |
|---|---|
| `namespace` | 4.3 |
| `agentId` | 4.2 |
| `agentClass` | 5.2 |
| `blueprintId`, `blueprintVersion` | 5.4 |
| `authorityBindingRef` | 5.3 |
| `sponsorRef` | 5.1 |
| `agentState`, `agentEpoch` | 6.1, 6.2 |
| `createdAt`, `updatedAt` | 5.1 |

## agent-instance.schema.json (Part 2)

| Field | Clause |
|---|---|
| `namespace`, `instanceId`, `agentId` | 5.6 |
| `workloadRegistrationId`, `workloadId` | 5.6, 5.5 |
| `artifactDigest` | 5.6 |
| `attestationRef` | 5.6 |
| `credentialGeneration`, `lease_expiresAt` | 5.6, 3.5 (Part 3) |
| `instanceState` | 6.3 |

## authority-binding.schema.json (Part 2)

| Field | Clause |
|---|---|
| `namespace`, `agentId`, `authorityRootRef` | 4.4, 5.3 |
| `authorityRootType` | 5.2 |
| `immutable` | 4.5, 5.3 |

## workload-registration.schema.json (Part 2)

| Field | Clause |
|---|---|
| `namespace`, `workloadRegistrationId` | 5.5 |
| `platform`, `selector` | 5.5, 4.4 (Part 3) |
| `trustDomain` | 5.5 |
| `allowedProofMethods` | 5.5, 4.5 (Part 3) |
| `status` | 5.5 |

## discovery-document.schema.json (Part 2)

| Field | Clause |
|---|---|
| `discoveryVersion` | 8.2 |
| `namespace`, `issuer` | 8.2, 8.3 |
| `registryEndpoint` | 8.2 |
| `jwksUri` | 8.2 |
| `supportedProofProfiles`, `supportedArtifactTypes` | 8.2 |
| `conformanceClaimRef` | 8.2 |
| `keyRotation` | 8.2 (Part 3 5.6) |

## identity-token.schema.json (Part 3)

| Field | Clause |
|---|---|
| `iss`, `sub`, `aud`, `iat`, `exp`, `jti` | 5.1 |
| `namespace` | 5.1 |
| `agentClass`, `instanceId`, `workloadId`, `authorityRootRef`, `agentEpoch` | 5.1 |
| `cnf.jkt` | 5.1, 5.4 |

## enrollment-proof.schema.json (Part 3)

| Field | Clause |
|---|---|
| `iss`, `sub`, `aud` | 4.3 |
| `iat`, `exp`, `jti` | 4.3 |
| `challengeId`, `nonce` | 4.2, 4.3 |

## policy-decision.schema.json (Part 4)

| Field | Clause |
|---|---|
| `namespace`, `authorizationMode` | 4.2, 3.2 |
| `subject`, `actor`, `client`, `workload`, `authorityRootRef` | 4.2, 3.3 |
| `action`, `resource` | 4.2 |
| `scope`, `audience` | 4.2 |
| `policyId`, `policyVersion` | 4.2 |
| `agentEpoch` | 4.2 |
| `decisionId`, `iat`, `exp` | 4.2 |
| `outcome`, `obligations` | 4.2 |

## execution-grant.schema.json (Part 4)

| Field | Clause |
|---|---|
| `grantId`, `namespace` | 4.3 |
| `action`, `resource`, `scope`, `task` | 4.3 |
| `audience` | 4.3 |
| `policyVersion`, `agentEpoch` | 4.3 |
| `parentLineage` | 4.1, 4.3 |
| `expiresAt` | 4.3, 5.1 |
| `cnf` | 3.1 (Part 3), 4.3 |

## federation-trust.schema.json (Part 5)

| Field | Clause |
|---|---|
| `namespace`, `peerIssuer` | 3 |
| `jwksUri`, `trustBundle` | 3 |
| `allowedAudiences` | 3 |
| `claimMapping` | 3 |
| `popRequirements` | 3 |
| `trustStatus` | 3, 6 |
| `keyRefresh` | 3, 8 |

## security-event.schema.json (Part 6)

| Field | Clause |
|---|---|
| `eventId`, `eventType`, `timestamp` | 4 |
| `namespace` | 4 |
| `agentId`, `instanceId` | 4 |
| `subject`, `actor`, `client`, `workload` | 4 |
| `agentEpoch` | 4 |
| `action`, `resourceDigest` | 4 |
| `policyVersion` | 4 |
| `decisionId`, `grantId`, `approvalId` | 4 |
| `traceId`, `outcome`, `reasonCode` | 4 |
| `evidenceRefs` | 1, 4, 5 |

## requests/*.schema.json

| Schema | Key fields | Clause |
|---|---|---|
| `challenge-request.schema.json` | `agentId`, `workloadRegistrationId`, `audience` | Part 3 4.2 |
| `enrollment-request.schema.json` | `agentId`, `workloadRegistrationId`, `workloadEvidence`, `proof` | Part 3 4.1-4.4 |
| `token-request.schema.json` | `instanceId`, `audience`, `proof` | Part 3 5.2 |
| `decision-request.schema.json` | `namespace`, `authorizationMode`, `action`, `resource`, `scope`, `audience`, `task` | Part 4 4.2 |
| `grant-request.schema.json` | `decisionId` | Part 4 4.3 |
| `exchange-request.schema.json` | `subjectToken`, `requestedScope`, `audience`, `task` | Part 4 5.2 |
| `approval-request.schema.json` | `namespace`, `approver`, `agentOrActor`, `action`, `resource`, `scope`, `audience`, `reasonDigest`, `expiresAt`, `policyVersion` | Part 4 5.3 |
| `revocation-request.schema.json` | `namespace`, `selectorType`, `selectorValue`, `freshnessClass` | Part 1 6.3; Parts 3, 4, 5 |
| `brokered-token-verification-request.schema.json` | `token`, `expectedAudience` | Part 5 5 |
| `federation-trust-update-request.schema.json` | `trustStatus` | Part 5 6 |
