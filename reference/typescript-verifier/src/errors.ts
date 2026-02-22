export type EtgResult =
  | "ETG_OK"
  | "ETG_ERR_SCHEMA"
  | "ETG_ERR_CANONICALIZATION"
  | "ETG_ERR_HASH_MISMATCH"
  | "ETG_ERR_POLICY_MISMATCH"
  | "ETG_ERR_BAD_SIGNATURE"
  | "ETG_ERR_NOT_YET_VALID"
  | "ETG_ERR_EXPIRED"
  | "ETG_ERR_REPLAY"
  | "ETG_ERR_AUDIENCE_MISMATCH"
  | "ETG_ERR_DOMAIN_MISMATCH"
  | "ETG_ERR_RAIL_MISMATCH";

export class EtgError extends Error {
  public readonly code: EtgResult;
  constructor(code: EtgResult, message: string) {
    super(message);
    this.code = code;
  }
}
