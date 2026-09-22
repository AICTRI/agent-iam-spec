# Contributing

## 1. Ways to contribute

- Report ambiguities, contradictions, security gaps, and missing requirements as issues.
- Propose normative changes through `rfcs/`.
- Add conformance vectors under `conformance/`.
- Fix editorial issues directly with a pull request.

## 2. Before you start

Read:

- `GOVERNANCE.md` for the change process and versioning;
- the current specification text;
- `mappings/` to understand reference implementation status.

## 3. Editing the specification

- English is the primary normative text. Any normative change must be made in English first, then reflected in the Chinese translation.
- Keep clause numbering identical between the two languages.
- Use the defined normative keywords consistently. See the specification's normative language section.
- Do not add vendor names to the specification body. Vendor and standards alignment belongs in `mappings/`.

## 4. Adding schemas and conformance vectors

- Schemas go under `schemas/`, licensed Apache-2.0.
- Test vectors go under `conformance/` and must include both positive and negative cases.
- Every negative case must name the clause it exercises.

## 5. Commit messages

Use a concise subject that states the change and the affected clauses, for example:

```text
spec: require request-level PoP in 10.4

Clarifies that submitting a public JWK is not proof of possession.
Closes #12.
```

## 6. Pull request checklist

- [ ] English text updated first, then the Chinese translation, if normative.
- [ ] Clause numbers stay aligned across languages.
- [ ] `CHANGELOG.md` updated for normative changes.
- [ ] No vendor names added to the specification body.
- [ ] Conformance vectors added or updated where behavior is testable.
- [ ] Internet-Draft citations carry an explicit version and a work-in-progress marker.

## 7. Licensing

By contributing you agree that:

- specification text is contributed under CC BY 4.0;
- schemas, code, and tooling are contributed under Apache-2.0.

Do not contribute material you cannot license under these terms.

## 8. Code of conduct

Be direct, technical, and respectful. Critique the text, not the person. Blocking objections must include a concrete rationale and a proposed alternative.
