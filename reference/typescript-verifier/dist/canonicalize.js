function isObj(v) {
    return typeof v === "object" && v !== null && !Array.isArray(v);
}
function sortKeys(obj) {
    const out = {};
    const keys = Object.keys(obj).sort((a, b) => (a < b ? -1 : a > b ? 1 : 0));
    for (const k of keys)
        out[k] = obj[k];
    return out;
}
// Minimal deterministic canonicalization (JCS-style light reference).
export function canonicalize(value) {
    return serialize(normalize(value));
}
function normalize(v) {
    if (Array.isArray(v))
        return v.map(normalize);
    if (isObj(v)) {
        const obj = {};
        for (const [k, val] of Object.entries(v)) {
            obj[k] = normalize(val);
        }
        return sortKeys(obj);
    }
    return v;
}
function serialize(v) {
    return JSON.stringify(v);
}
