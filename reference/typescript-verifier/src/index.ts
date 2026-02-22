import fs from "fs";
import path from "path";
import crypto from "crypto";
import { verifyEtg, computeEnvelopeHash, buildAoSigningPayload } from "./verify.js";
import { EtgError } from "./errors.js";

function usage(): never {
  console.log("Usage:");
  console.log("  node dist/index.js <path-to-vector.json> [--now <ms>] [--simulate-replay]");
  process.exit(1);
}

function readKeysJson(keysPath: string): Record<string, { publicKeyPem: string }> {
  if (!fs.existsSync(keysPath)) return {};
  const raw = fs.readFileSync(keysPath, "utf8");
  return JSON.parse(raw);
}

function parseArgs(argv: string[]) {
  const out: { vectorPath?: string; now?: number; simulateReplay?: boolean } = {};
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (!out.vectorPath && !a.startsWith("--")) {
      out.vectorPath = a;
      continue;
    }
    if (a === "--now") {
      const v = argv[i + 1];
      if (!v) usage();
      const n = Number(v);
      if (!Number.isFinite(n)) usage();
      out.now = n;
      i++;
      continue;
    }
    if (a === "--simulate-replay") {
      out.simulateReplay = true;
      continue;
    }
    usage();
  }
  return out;
}

function main() {
  const args = parseArgs(process.argv.slice(2));
  if (!args.vectorPath) usage();

  const resolved = path.resolve(process.cwd(), args.vectorPath);
  if (!fs.existsSync(resolved)) {
    console.error("File not found:", resolved);
    process.exit(1);
  }

  const raw = fs.readFileSync(resolved, "utf8");
  const parsed = JSON.parse(raw);

  const envelope = parsed.envelope;
  const authorization = parsed.authorization;

  if (!envelope || !authorization) {
    console.error("Invalid vector format. Must contain envelope and authorization.");
    process.exit(1);
  }

  const now = typeof args.now === "number" ? args.now : Date.now();
  const computedHash = computeEnvelopeHash(envelope);

  // key registry: reference/typescript-verifier/keys.json
  const keysPath = path.resolve(process.cwd(), "keys.json");
  const keys = readKeysJson(keysPath);

  try {
    const result = verifyEtg(envelope, authorization, {
      currentTimeMs: now,
      isReplay: () => !!args.simulateReplay,
      verifySignature: (payload, sig) => {
        if (sig.alg === "ed25519") {
          const kid = sig.kid || "";
          const entry = keys[kid];
          if (!entry || !entry.publicKeyPem) return false;
          const pub = entry.publicKeyPem;
          const signature = Buffer.from(sig.value, "base64");
          // For Ed25519, Node uses null algorithm
          return crypto.verify(null, Buffer.from(payload, "utf8"), pub, signature);
        }
        return false;
      }
    });

    console.log(JSON.stringify(
      {
        timestamp: now,
        result,
        computed_envelope_hash: computedHash
      },
      null,
      2
    ));

    process.exit(result === "ETG_OK" ? 0 : 2);

  } catch (err) {
    if (err instanceof EtgError) {
      console.error(JSON.stringify({ result: err.code, message: err.message }, null, 2));
      process.exit(2);
    }
    console.error("Unexpected error:", err);
    process.exit(3);
  }
}

main();