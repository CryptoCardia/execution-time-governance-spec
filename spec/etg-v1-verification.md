# ETG v1 Verification Algorithm

This document defines a reference verification flow.

## Inputs
- Envelope (JSON)
- Authorization Object (AO) (JSON)
- current_time_ms (number)
- verifier key material resolver (implementation-defined)

## Algorithm (normative)
1. Validate required fields exist.
2. Canonicalize Envelope.
3. Compute envelope_hash = HASH(canonical_envelope).
4. If AO.envelope_hash != envelope_hash -> error ETG_ERR_HASH_MISMATCH.
5. If AO.policy_hash != Envelope.policy_hash -> error ETG_ERR_POLICY_MISMATCH.
6. If current_time_ms < t_issue -> error ETG_ERR_NOT_YET_VALID.
7. If current_time_ms > t_expiry -> error ETG_ERR_EXPIRED.
8. Verify signature over canonical signing payload -> if fail, ETG_ERR_BAD_SIGNATURE.
9. Apply replay checks (nonce/envelope_id) -> if replay, ETG_ERR_REPLAY.
10. If all pass -> OK.

## Fail-closed behavior
Executors MUST refuse execution for any non-OK result.
