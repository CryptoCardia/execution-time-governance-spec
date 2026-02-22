# Execution-Time Governance v1 (ETG v1)

**Category spec** for:
- **Execution-Time Governance v1**
- **Pre-Settlement Control Planes**
- **Transaction-Governed Security (TGS)**

This repository defines a missing layer for modern systems that touch irreversible outcomes:
a deterministic governance boundary that resolves authority **at the moment of execution**.

## What this is

ETG v1 specifies portable, cryptographically verifiable artifacts that bind:
- **intent**
- **execution parameters**
- **policy identity**
- **time bounds**
- **authority**

to the moment an action becomes irreversible.

If verification fails, execution **MUST fail closed**.

## What this is not

This repo does **not** include:
- CryptoCardia production enforcement logic
- rail integrations
- proprietary risk scoring / AI models
- internal policy engines

It defines interoperable artifacts, verification rules, error codes, test vectors, and a minimal reference verifier.

## Specs

- ETG v1: spec/etg-v1.md
- Canonicalization: spec/etg-v1-canonicalization.md
- Verification algorithm: spec/etg-v1-verification.md
- Error model: spec/etg-v1-errors.md
- Registries: spec/etg-v1-registries.md
- JSON schema: spec/etg-v1-schema.json

## Category docs

- Pre-Settlement Control Planes: 	axonomy/pre-settlement-control-planes.md
- Transaction-Governed Security (TGS): 	axonomy/transaction-governed-security.md
- Glossary: 	axonomy/glossary.md
- Comparisons: 	axonomy/comparisons.md

## Threat model and test vectors

- Threat model: 	hreat-model/threat-model.md
- Mitigations: 	hreat-model/mitigations.md
- Test vectors: 	est-vectors/
- Reference verifier (TypeScript): eference/typescript-verifier/

## Versioning

This repository uses **spec versioning**. ETG v1 is stable once tagged.
Backward-incompatible changes require a new major version.

See: governance/versioning.md

## License

Apache 2.0. See LICENSE and NOTICE.

## Attribution

CryptoCardia - Transaction-Governed Security
