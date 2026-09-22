# Security Policy

## 1. Reporting a vulnerability

Do not open a public issue for a security defect.

Report privately to the maintainers through the hosting organization's security contact, or use GitHub private vulnerability reporting on this repository if enabled.

Include:

- affected document and clause, or affected schema/tool and version;
- a description of the weakness;
- a concrete attack scenario;
- impact assessment;
- a proposed fix, if available.

## 2. What counts as a security defect

Because this repository publishes a specification, security defects include:

- a requirement that is unsafe or that can be interpreted ambiguously in a way that is unsafe;
- a contradiction between clauses that permits an unsafe implementation;
- a missing requirement that enables a known attack class;
- a wrong or misleading reference to another standard;
- a mapping document that overstates the security of a reference implementation.

## 3. Attack classes of interest

- identity confusion and identifier reuse;
- token substitution and audience confusion;
- replay of enrollment, token requests, or high-value requests;
- confused deputy through missing audience, action, resource, or task binding;
- privilege escalation through delegation or pre-authorization;
- missing or delayed revocation;
- prompt injection that influences namespace, authority root, epoch, or policy;
- SSRF and key-cache abuse in federation;
- evidence leakage of secrets, tokens, prompts, or unrestricted arguments;
- management-plane exposure.

## 4. Disclosure

- The project will acknowledge receipt and provide an initial assessment.
- A fix will be coordinated before public disclosure.
- Credit will be given unless the reporter requests otherwise.

## 5. Scope limitation

This repository defines requirements. It does not ship a production identity or authorization system. Vulnerabilities in reference implementations must be reported to the corresponding implementation repository.
