# Transaction-Governed Security (TGS)

TGS is a security model for irreversible systems.

When the cost of a wrong action is high (funds lost, contracts binding, irreversible commitments),
security cannot rely on intent, trust, or post-hoc explanation.

TGS says:

> Transaction execution is conditional on a verifiable authorization artifact at the moment of commitment.

## The core shift
Traditional security asks: "Who can call this API?"
TGS asks: "Should this execute right now, under these constraints, with this exact parameterization, before finality?"

## TGS properties
A TGS system MUST provide:
1. **Deterministic verification**: same artifact yields same decision.
2. **Fail closed at the irreversible boundary**.
3. **Parameter binding**: intent and execution parameters are cryptographically bound.
4. **Policy binding**: the active policy identity is bound.
5. **Time bounding**: authorizations expire.
6. **Replay resistance**: unique identifiers prevent re-use in unintended contexts.
7. **Audit-grade evidence**: artifacts can be verified independently.

## Why this matters now
Automation and agents increase execution speed and surface area.
The failure mode is not lack of logs; it is unauthorized commitment.

TGS treats governance as infrastructure.
Not a slide deck.
Not a dashboard.
A boundary.
