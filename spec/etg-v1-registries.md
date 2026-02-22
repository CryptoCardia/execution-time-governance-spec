# ETG v1 Registries

## Hash algorithms
- sha256 (RECOMMENDED baseline)

## Signature schemes
- ed25519 (RECOMMENDED baseline)
- secp256k1 (OPTIONAL)

## Canonicalization
- etg-jcs-1 (sorted keys + minimal JSON; RFC 8785 style)

## Policy hash
policy_hash MUST be computed as:
- HASH(canonical_policy_descriptor) or
- an implementation-defined stable hash over policy identity.

ETG standardizes that the hash value is bound and verified, not how policy logic is evaluated.
