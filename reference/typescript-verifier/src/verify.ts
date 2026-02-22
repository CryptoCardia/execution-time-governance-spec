import crypto from "crypto";
import { canonicalize } from "./canonicalize.js";
import { EtgError, EtgResult } from "./errors.js";

type Envelope = Record<string, unknown>;
type AO = Record<string, unknown>;

export type VerifyOptions = {
  currentTimeMs: number;
  isReplay?: (envelopeId: string, nonce: string) => boolean;
  verifySignature?: (payload: string, sig: { alg: string; kid?: string; value: string }) => boolean;
};

function requireString(o: Record<string, unknown>, k: string): string {
  const v = o[k];
  if (typeof v !== "string" || v.length === 0) {
    throw new EtgError("ETG_ERR_SCHEMA", "Missing/invalid string: " + k);
  }
  return v;
}

function requireNumber(o: Record<string, unknown>, k: string): number {
  const v = o[k];
  if (typeof v !== "number" || !Number.isFinite(v)) {
    throw new EtgError("ETG_ERR_SCHEMA", "Missing/invalid number: " + k);
  }
  return v;
}

export function sha256Hex(input: string): string {
  return crypto.createHash("sha256")
    .update(Buffer.from(input, "utf8"))
    .digest("hex");
}

export function computeEnvelopeHash(envelope: Envelope): string {
  const canon = canonicalize(envelope as any);
  const hex = sha256Hex(canon);
  return "sha256:" + hex;
}

export function buildAoSigningPayload(ao: AO): string {
  const payload = {
    spec_version: ao["spec_version"],
    ao_id: ao["ao_id"],
    envelope_hash: ao["envelope_hash"],
    policy_hash: ao["policy_hash"],
    authority: ao["authority"],
    t_issue: ao["t_issue"],
    t_expiry: ao["t_expiry"],
    domain: ao["domain"],
    audience: ao["audience"],
    rail: ao["rail"]
  };

  return canonicalize(payload as any);
}

export function verifyEtg(envelope: Envelope, ao: AO, opts: VerifyOptions): EtgResult {
  const specE = requireString(envelope, "spec_version");
  const specA = requireString(ao, "spec_version");

  if (specE !== "etg-1.0" || specA !== "etg-1.0") {
    throw new EtgError("ETG_ERR_SCHEMA", "Unsupported spec_version");
  }

  const envelopeId = requireString(envelope, "envelope_id");
  const nonce = requireString(envelope, "nonce");
  const policyHashEnv = requireString(envelope, "policy_hash");

  const tIssueEnv = requireNumber(envelope, "t_issue");
  const tExpiryEnv = requireNumber(envelope, "t_expiry");

  const envelopeHash = computeEnvelopeHash(envelope);

  const aoEnvelopeHash = requireString(ao, "envelope_hash");
  if (aoEnvelopeHash !== envelopeHash) return "ETG_ERR_HASH_MISMATCH";

  const aoPolicyHash = requireString(ao, "policy_hash");
  if (aoPolicyHash !== policyHashEnv) return "ETG_ERR_POLICY_MISMATCH";

  const tIssueAo = requireNumber(ao, "t_issue");
  const tExpiryAo = requireNumber(ao, "t_expiry");

  if (tIssueAo !== tIssueEnv || tExpiryAo !== tExpiryEnv) {
    return "ETG_ERR_SCHEMA";
  }

  const now = opts.currentTimeMs;

  if (now < tIssueEnv) return "ETG_ERR_NOT_YET_VALID";
  if (now > tExpiryEnv) return "ETG_ERR_EXPIRED";

  const domEnv = requireString(envelope, "domain");
  const audEnv = requireString(envelope, "audience");
  const railEnv = requireString(envelope, "rail");

  const domAo = requireString(ao, "domain");
  const audAo = requireString(ao, "audience");
  const railAo = requireString(ao, "rail");

  if (domAo !== domEnv) return "ETG_ERR_DOMAIN_MISMATCH";
  if (audAo !== audEnv) return "ETG_ERR_AUDIENCE_MISMATCH";
  if (railAo !== railEnv) return "ETG_ERR_RAIL_MISMATCH";

  if (opts.isReplay && opts.isReplay(envelopeId, nonce)) {
    return "ETG_ERR_REPLAY";
  }

  const sig = ao["sig"] as any;
  if (!sig || typeof sig !== "object") {
    throw new EtgError("ETG_ERR_SCHEMA", "Missing sig");
  }

  const alg = typeof sig.alg === "string" ? sig.alg : "";
  const val = typeof sig.value === "string" ? sig.value : "";

  if (alg !== "none") {
    const signingPayload = buildAoSigningPayload(ao);
    const ok = opts.verifySignature
      ? opts.verifySignature(signingPayload, { alg, kid: sig.kid, value: val })
      : false;

    if (!ok) return "ETG_ERR_BAD_SIGNATURE";
  }

  return "ETG_OK";
}
