"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sha256Hex = sha256Hex;
exports.computeEnvelopeHash = computeEnvelopeHash;
exports.buildAoSigningPayload = buildAoSigningPayload;
exports.verifyEtg = verifyEtg;
var crypto_1 = require("crypto");
var canonicalize_js_1 = require("./canonicalize.js");
var errors_js_1 = require("./errors.js");
function requireString(o, k) {
    var v = o[k];
    if (typeof v !== "string" || v.length === 0) {
        throw new errors_js_1.EtgError("ETG_ERR_SCHEMA", "Missing/invalid string: " + k);
    }
    return v;
}
function requireNumber(o, k) {
    var v = o[k];
    if (typeof v !== "number" || !Number.isFinite(v)) {
        throw new errors_js_1.EtgError("ETG_ERR_SCHEMA", "Missing/invalid number: " + k);
    }
    return v;
}
function sha256Hex(input) {
    return crypto_1.default.createHash("sha256")
        .update(Buffer.from(input, "utf8"))
        .digest("hex");
}
function computeEnvelopeHash(envelope) {
    var canon = (0, canonicalize_js_1.canonicalize)(envelope);
    var hex = sha256Hex(canon);
    return "sha256:" + hex;
}
function buildAoSigningPayload(ao) {
    var payload = {
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
    return (0, canonicalize_js_1.canonicalize)(payload);
}
function verifyEtg(envelope, ao, opts) {
    var specE = requireString(envelope, "spec_version");
    var specA = requireString(ao, "spec_version");
    if (specE !== "etg-1.0" || specA !== "etg-1.0") {
        throw new errors_js_1.EtgError("ETG_ERR_SCHEMA", "Unsupported spec_version");
    }
    var envelopeId = requireString(envelope, "envelope_id");
    var nonce = requireString(envelope, "nonce");
    var policyHashEnv = requireString(envelope, "policy_hash");
    var tIssueEnv = requireNumber(envelope, "t_issue");
    var tExpiryEnv = requireNumber(envelope, "t_expiry");
    var envelopeHash = computeEnvelopeHash(envelope);
    var aoEnvelopeHash = requireString(ao, "envelope_hash");
    if (aoEnvelopeHash !== envelopeHash)
        return "ETG_ERR_HASH_MISMATCH";
    var aoPolicyHash = requireString(ao, "policy_hash");
    if (aoPolicyHash !== policyHashEnv)
        return "ETG_ERR_POLICY_MISMATCH";
    var tIssueAo = requireNumber(ao, "t_issue");
    var tExpiryAo = requireNumber(ao, "t_expiry");
    if (tIssueAo !== tIssueEnv || tExpiryAo !== tExpiryEnv) {
        return "ETG_ERR_SCHEMA";
    }
    var now = opts.currentTimeMs;
    if (now < tIssueEnv)
        return "ETG_ERR_NOT_YET_VALID";
    if (now > tExpiryEnv)
        return "ETG_ERR_EXPIRED";
    var domEnv = requireString(envelope, "domain");
    var audEnv = requireString(envelope, "audience");
    var railEnv = requireString(envelope, "rail");
    var domAo = requireString(ao, "domain");
    var audAo = requireString(ao, "audience");
    var railAo = requireString(ao, "rail");
    if (domAo !== domEnv)
        return "ETG_ERR_DOMAIN_MISMATCH";
    if (audAo !== audEnv)
        return "ETG_ERR_AUDIENCE_MISMATCH";
    if (railAo !== railEnv)
        return "ETG_ERR_RAIL_MISMATCH";
    if (opts.isReplay && opts.isReplay(envelopeId, nonce)) {
        return "ETG_ERR_REPLAY";
    }
    var sig = ao["sig"];
    if (!sig || typeof sig !== "object") {
        throw new errors_js_1.EtgError("ETG_ERR_SCHEMA", "Missing sig");
    }
    var alg = typeof sig.alg === "string" ? sig.alg : "";
    var val = typeof sig.value === "string" ? sig.value : "";
    if (alg !== "none") {
        var signingPayload = buildAoSigningPayload(ao);
        var ok = opts.verifySignature
            ? opts.verifySignature(signingPayload, { alg: alg, kid: sig.kid, value: val })
            : false;
        if (!ok)
            return "ETG_ERR_BAD_SIGNATURE";
    }
    return "ETG_OK";
}
