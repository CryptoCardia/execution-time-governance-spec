"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.canonicalize = canonicalize;
function isObj(v) {
    return typeof v === "object" && v !== null && !Array.isArray(v);
}
function sortKeys(obj) {
    var out = {};
    var keys = Object.keys(obj).sort(function (a, b) { return (a < b ? -1 : a > b ? 1 : 0); });
    for (var _i = 0, keys_1 = keys; _i < keys_1.length; _i++) {
        var k = keys_1[_i];
        out[k] = obj[k];
    }
    return out;
}
// Minimal deterministic canonicalization (JCS-style light reference).
function canonicalize(value) {
    return serialize(normalize(value));
}
function normalize(v) {
    if (Array.isArray(v))
        return v.map(normalize);
    if (isObj(v)) {
        var obj = {};
        for (var _i = 0, _a = Object.entries(v); _i < _a.length; _i++) {
            var _b = _a[_i], k = _b[0], val = _b[1];
            obj[k] = normalize(val);
        }
        return sortKeys(obj);
    }
    return v;
}
function serialize(v) {
    return JSON.stringify(v);
}
