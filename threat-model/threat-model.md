# Threat Model: Execution-Time Governance v1

## Scope
This model covers structural threats to deterministic execution-time authorization at irreversible boundaries.

## Assumptions
- Adversaries may control network transport.
- Adversaries may replay or mutate payloads.
- Policy state may evolve between authorization and execution.
- Concurrent execution may occur.
- Compromised signing keys are out of scope unless explicitly stated.

## Threats (high-level)
- Replay of authorization artifacts
- Parameter mutation between authorization and execution
- Cross-context reuse (cross-rail / cross-environment)
- Stale authorizations (expired time bounds)
- Canonicalization mismatch
- Evidence tampering / non-portable logging
- Policy drift (policy updated after authorization)
