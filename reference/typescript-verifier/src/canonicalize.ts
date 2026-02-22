type Json = null | boolean | number | string | Json[] | { [k: string]: Json };

function isObj(v: unknown): v is Record<string, unknown> {
  return typeof v === "object" && v !== null && !Array.isArray(v);
}

function sortKeys(obj: Record<string, Json>): Record<string, Json> {
  const out: Record<string, Json> = {};
  const keys = Object.keys(obj).sort((a, b) => (a < b ? -1 : a > b ? 1 : 0));
  for (const k of keys) out[k] = obj[k];
  return out;
}

// Minimal deterministic canonicalization (JCS-style light reference).
export function canonicalize(value: Json): string {
  return serialize(normalize(value));
}

function normalize(v: Json): Json {
  if (Array.isArray(v)) return v.map(normalize);
  if (isObj(v)) {
    const obj: Record<string, Json> = {};
    for (const [k, val] of Object.entries(v)) {
      obj[k] = normalize(val as Json);
    }
    return sortKeys(obj);
  }
  return v;
}

function serialize(v: Json): string {
  return JSON.stringify(v);
}
