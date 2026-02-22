# ETG v1 Canonicalization

ETG v1 requires deterministic canonicalization prior to hashing and signing.

## Requirements
- JSON MUST be parsed and re-serialized deterministically.
- Object keys MUST be sorted lexicographically (Unicode code point order).
- No insignificant whitespace.
- Numbers MUST be represented minimally (no trailing zeros) and MUST round-trip.
- Strings MUST be UTF-8.
- Arrays preserve order.
- Null/true/false are lowercase.

This is aligned with the intent of RFC 8785 (JCS) style canonicalization, with implementation-specific care for number handling.

## Canonicalization output
The canonical form is a UTF-8 encoded JSON string.

Hashing MUST be computed over the UTF-8 bytes of the canonical form.
