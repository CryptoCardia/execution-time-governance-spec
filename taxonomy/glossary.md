# Glossary

**Execution-Time Governance (ETG)**  
A deterministic governance boundary that resolves whether an action may execute at the moment it would become irreversible.

**Pre-Settlement Control Plane**  
A control plane positioned before settlement/finality that evaluates authorization artifacts and prevents irreversible execution when constraints are not satisfied.

**Transaction-Governed Security (TGS)**  
A security model in which transaction execution is conditioned on verifiable, time-bounded, policy-bound authorization artifacts at the point-of-no-return.

**Envelope**  
A canonical representation of intent + execution parameters + policy identity + time bounds.

**Authorization Object (AO)**  
A signed authorization artifact that binds an Envelope to an authority decision.

**Executor/Rail**  
The system that performs the irreversible action (e.g., payment rail, chain, treasury system, contract submission system).

**Finality**  
The point at which reversal is economically or technically infeasible.

**Non-bypassable boundary**  
A boundary where execution cannot proceed without a successful verification result.

**Policy identity**  
A stable identifier for a policy set (typically via policy_hash).

**Evidence ledger**  
An append-only tamper-evident log of decisions and commitments, produced at commitment time rather than post-hoc.
