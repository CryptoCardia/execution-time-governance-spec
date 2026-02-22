# ETG v1 Error Codes

Implementations MUST produce deterministic error codes.

- ETG_OK
- ETG_ERR_SCHEMA
- ETG_ERR_CANONICALIZATION
- ETG_ERR_HASH_MISMATCH
- ETG_ERR_POLICY_MISMATCH
- ETG_ERR_BAD_SIGNATURE
- ETG_ERR_NOT_YET_VALID
- ETG_ERR_EXPIRED
- ETG_ERR_REPLAY
- ETG_ERR_AUDIENCE_MISMATCH
- ETG_ERR_DOMAIN_MISMATCH
- ETG_ERR_RAIL_MISMATCH

Notes:
- Audience/domain/rail mismatches are OPTIONAL checks depending on executor integration.
- If checked, they MUST fail closed.
