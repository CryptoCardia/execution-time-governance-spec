# ETG v1 - Execution-Time Governance

## 1. Purpose
ETG v1 specifies portable authorization artifacts that bind intent to execution constraints at the point where an action becomes irreversible.

An executor MUST fail closed if verification fails.

## 2. Actors
- **Requester**: proposes an action intent.
- **Control Plane**: evaluates intent and issues authorization.
- **Executor**: performs the irreversible action if authorized.
- **Auditor**: independently verifies evidence.

## 3. Artifacts
ETG v1 defines two primary artifacts:

1. **Envelope**: canonical representation of an intended action and its execution parameters.
2. **Authorization Object (AO)**: a signed statement binding an Envelope to authority, policy identity, and time bounds.

Optionally, systems may produce an **Evidence Receipt** for audit portability.

## 4. Envelope (normative)
An Envelope MUST include:
- spec_version: string (MUST be "etg-1.0")
- envelope_id: unique identifier (string)
- domain: issuer context identifier (string)
- udience: intended executor identity (string)
- ail: target rail identifier (string)
- intent: structured intent object
- exec_params: structured execution parameters object
- policy_hash: hash of active policy identity (string)
- 	_issue: issuance time (unix ms)
- 	_expiry: expiry time (unix ms)
- 
once: unique per envelope (string)

An Envelope MUST be canonicalized prior to hashing and signing.

## 5. Authorization Object (AO) (normative)
An AO MUST include:
- spec_version: string (MUST be "etg-1.0")
- o_id: unique identifier (string)
- envelope_hash: hash of the canonicalized Envelope (string)
- policy_hash: MUST match the Envelope policy_hash
- uthority: structured authority descriptor (object)
- 	_issue: MUST equal Envelope 	_issue
- 	_expiry: MUST equal Envelope 	_expiry
- sig: signature object

The AO signature MUST be computed over a canonical signing payload that includes:
- spec_version
- o_id
- envelope_hash
- policy_hash
- uthority
- 	_issue
- 	_expiry
- domain
- udience
- ail

## 6. Verification (normative)
An executor MUST:
1. Canonicalize Envelope using ETG canonicalization rules
2. Compute envelope_hash
3. Verify AO.envelope_hash == envelope_hash
4. Verify AO.policy_hash == Envelope.policy_hash
5. Verify time bounds:
   - current_time MUST be >= 	_issue
   - current_time MUST be <= 	_expiry
6. Verify AO signature
7. Enforce replay semantics for envelope_id and/or 
once

If any step fails, executor MUST refuse execution.

## 7. Error model
Implementations MUST map failures to deterministic error codes. See spec/etg-v1-errors.md.

## 8. Canonicalization
ETG v1 uses deterministic JSON canonicalization rules. See spec/etg-v1-canonicalization.md.

## 9. Registries
Algorithms and canonicalization versions are registry-controlled. See spec/etg-v1-registries.md.
