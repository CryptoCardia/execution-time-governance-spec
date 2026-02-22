import fs from "fs";
import path from "path";
import { verifyEtg, computeEnvelopeHash } from "./verify.js";
import { EtgError } from "./errors.js";

function usage() {
  console.log("Usage:");
  console.log("  node dist/index.js <path-to-vector.json>");
  process.exit(1);
}

function main() {
  const inputPath = process.argv[2];
  if (!inputPath) usage();

  const resolved = path.resolve(process.cwd(), inputPath);

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

  const now = Date.now();

  try {
    const result = verifyEtg(envelope, authorization, {
      currentTimeMs: now,
      isReplay: () => false,
      verifySignature: () => false // reference mode
    });

    const computedHash = computeEnvelopeHash(envelope);

    console.log(JSON.stringify({
      timestamp: now,
      result,
      computed_envelope_hash: computedHash
    }, null, 2));

    if (result !== "ETG_OK") {
      process.exit(2);
    }

  } catch (err) {
    if (err instanceof EtgError) {
      console.error(JSON.stringify({
        result: err.code,
        message: err.message
      }, null, 2));
      process.exit(2);
    }

    console.error("Unexpected error:", err);
    process.exit(3);
  }
}

main();
