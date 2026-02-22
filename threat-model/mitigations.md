# Mitigations

ETG v1 mitigates key threats through binding + determinism.

## Replay
- Require unique envelope_id and/or 
once
- Executors SHOULD maintain a replay registry for consumed authorizations

## Mutation
- Bind canonicalized envelope hash
- Verify signature over the bound hash

## Cross-context misuse
- Bind domain (issuer context) and ail identifiers
- Bind udience (executor identity)

## Stale authorization
- Enforce 	_issue and 	_expiry

## Canonicalization mismatch
- Publish canonicalization rules
- Provide test vectors

## Evidence integrity
- Require portable evidence artifacts
- Encourage hash-chained append-only ledgers (implementation choice)
