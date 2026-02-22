import crypto from "crypto";
import { canonicalize } from "./canonicalize.js";
import { EtgError } from "./errors.js";
function requireString(o, k) {
    const v = o[k];
    if (typeof v !== "string" || v.length === 0) {
        throw new EtgError("ETG_ERR_SCHEMA", "Missing/invalid string: " + k);
    }
    return v;
}
function requireNumber(o, k) {
    const v = o[k];
    if (typeof v !== "number" || !Number.isFinite(v)) {
        throw new EtgError("ETG_ERR_SCHEMA", "Missing/invalid number: " + k);
    }
    return v;
}
export function sha256Hex(input) {
    return crypto.createHash("sha256")
        .update(Buffer.from(input, "utf8"))
        .digest("hex");
}
export function computeEnvelopeHash(envelope) {
    const canon = canonicalize(envelope);
    const hex = sha256Hex(canon);
    return "sha256:" + hex;
}
export function buildAoSigningPayload(ao) {
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
    return canonicalize(payload);
}
export function verifyEtg(envelope, ao, opts) {
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
    if (aoEnvelopeHash !== envelopeHash)
        return "ETG_ERR_HASH_MISMATCH";
    const aoPolicyHash = requireString(ao, "policy_hash");
    if (aoPolicyHash !== policyHashEnv)
        return "ETG_ERR_POLICY_MISMATCH";
    const tIssueAo = requireNumber(ao, "t_issue");
    const tExpiryAo = requireNumber(ao, "t_expiry");
    if (tIssueAo !== tIssueEnv || tExpiryAo !== tExpiryEnv) {
        return "ETG_ERR_SCHEMA";
    }
    const now = opts.currentTimeMs;
    if (now < tIssueEnv)
        return "ETG_ERR_NOT_YET_VALID";
    if (now > tExpiryEnv)
        return "ETG_ERR_EXPIRED";
    const domEnv = requireString(envelope, "domain");
    const audEnv = requireString(envelope, "audience");
    const railEnv = requireString(envelope, "rail");
    const domAo = requireString(ao, "domain");
    const audAo = requireString(ao, "audience");
    const railAo = requireString(ao, "rail");
    if (domAo !== domEnv)
        return "ETG_ERR_DOMAIN_MISMATCH";
    if (audAo !== audEnv)
        return "ETG_ERR_AUDIENCE_MISMATCH";
    if (railAo !== railEnv)
        return "ETG_ERR_RAIL_MISMATCH";
    if (opts.isReplay && opts.isReplay(envelopeId, nonce)) {
        return "ETG_ERR_REPLAY";
    }
    const sig = ao["sig"];
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
        if (!ok)
            return "ETG_ERR_BAD_SIGNATURE";
    }
    return "ETG_OK";
}
