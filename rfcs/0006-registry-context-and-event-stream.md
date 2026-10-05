# RFC-0006: Registry Context Point Read, Recoverable Event Stream, and the Identity Source Boundary

- Status: Draft
- Authors: AICTRI maintainers
- Date: 2026-10-04
- Affected documents and clauses: Part 2 §7 (Registry), new §7.4 and §7.5; Part 4 §3.1 (Principal Resolution); `conformance/`; `profiles/enrollment.md`, `profiles/identity-token.md`
- Type: Normative

## Summary

Define three surfaces that the reference implementations already depend on: an
atomic **Registry Context** point read used as the single authoritative read unit
for issuance and online verification; a **recoverable registry event stream** used
only for bounded cache invalidation; and the **Identity Source** boundary that
constructs the Part 4 Principal.

## Motivation

EIDOVELA issues tokens and performs authoritative online verification against a
single NOMIVELA Registry Context read, and fails closed when the read is
unavailable; NOMIVELA exposes this as `GET /v1/registry-context`. The
specification defines the individual records and the discovery document but not
a single consistency unit, so two implementations cannot agree on what "one
authoritative read" means, and a consumer could be tempted to stitch state from
separate reads.

NOMIVELA also exposes a recoverable change stream (global cursor,
lease/ack/nack, replay) that EIDOVELA uses to invalidate a bounded registry
cache. Without a normative definition, an implementation could mistake a
cache-invalidating stream for an authoritative read, weakening revocation and
lifecycle correctness.

AEGIVELA records that only an identity source may construct the trusted principal
from verified authentication output. Part 4 §3.1 implies this but does not name
the constructor or forbid re-derivation explicitly enough for a conformance test.

## Detailed design

1. **Part 2 §7.4 Registry Context.** A registry MUST be able to serve one
   consistent snapshot that spans the Namespace, Agent, Agent Identity/binding,
   Workload Registration, and Agent Instance for a requested Agent. Token
   issuance and authoritative online verification MUST use this single read as
   the authoritative registry read unit, and MUST fail closed when the snapshot
   is unavailable or internally inconsistent. The snapshot MAY support
   conditional reads (`ETag` / `If-None-Match`) and optimistic-concurrency
   preconditions (`expectedEpoch` / `If-Match`), and a mismatched precondition
   MUST return a conflict rather than a partial result.

2. **Part 2 §7.5 Registry Event Stream.** A registry SHOULD expose an ordered,
   recoverable change stream with a global monotonic cursor, at-least-once
   delivery with lease, delivery attempts and dead-lettering, and cursor replay.
   The stream is for bounded cache invalidation only and MUST NOT replace the
   Registry Context read for issuance or online verification. Consuming the
   stream requires the `events.consume` scope (Part 2 §7.3).

3. **Part 4 §3.1 Identity Source.** Only the Identity Source MAY construct the
   trusted Principal, and it MUST do so from verified authentication output
   (Part 3). Part 4 MUST NOT re-derive namespace, agent class, workload, or
   lifecycle epoch from request input, natural language, model output, or tool
   return values. A verified identity context, when carried between planes, MUST
   be integrity-protected and scoped to its consuming audience.

4. **Conformance.** Add a positive single-snapshot vector, a negative
   inconsistent-snapshot fail-closed vector, and a negative
   cache-invalidation-not-authoritative vector under Part 2.

## Impact

- Compatibility: backward compatible; additive clauses that name behavior the
  reference implementations already ship.
- Affected profiles: `enrollment` and `identity-token` (both rely on the
  authoritative read).
- Affected reference implementations: NOMIVELA and EIDOVELA already implement
  this surface; AEGIVELA already enforces the Identity Source boundary.
- Security impact: positive; closes a path where inconsistent multi-read state or
  a cache stream could be treated as authoritative.
- Privacy impact: neutral.

## Alternatives considered

- **Define only the individual records and leave consistency to implementations.**
  Rejected: revocation and lifecycle correctness depend on agreeing on a single
  read unit.
- **Make the event stream authoritative for issuance.** Rejected: at-least-once
  delivery and best-effort caching are not a substitute for a fail-closed point
  read.
- **Keep the Identity Source boundary informative.** Rejected: it is a testable
  normative boundary between Part 3 and Part 4.

## Unresolved questions

- Whether the Registry Context snapshot should be identified by a monotonic
  `snapshotVersion` that consumers can pin.
- Whether the event stream contract needs its own profile, or Part 2 §7.5 is
  sufficient.

## Decision

Filled in by maintainers. Include rationale, date, and any recorded dissent.
