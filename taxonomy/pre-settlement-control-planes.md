# Pre-Settlement Control Planes

A pre-settlement control plane is a governance layer positioned **before finality**.

## Why it exists
Many systems rely on:
- IAM and role permissions
- dashboards and monitoring
- post-hoc audit logs
- manual review checklists

Those controls surround execution, but they do not guarantee that authority resolved correctly at the moment an irreversible action committed.

## The boundary
A pre-settlement control plane sits:
- **above settlement**
- **below execution initiation**
- at the point-of-no-return for the relevant rail

Its job is to enforce a single invariant:

> An irreversible action MUST NOT execute unless a valid, time-bounded authorization artifact verifies at execution time.

## What it enforces
At minimum:
- envelope canonicalization rules
- envelope hash binding
- signature verification for authorization
- time bounds (issue/expiry)
- replay protection semantics (nonce/unique id expectations)
- fail-closed error behavior

## What it does NOT standardize
A control plane may use:
- deterministic rules
- ML signals
- human approval workflows
- external risk systems

ETG does not standardize how the decision is made. ETG standardizes how the decision is represented, verified, and audited.

## Interoperability value
A portable, verifiable authorization artifact means:
- auditors can verify decisions without platform access
- downstream executors can fail closed deterministically
- cross-system governance drift becomes detectable
