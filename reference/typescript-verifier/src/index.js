"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fs_1 = require("fs");
var path_1 = require("path");
var verify_js_1 = require("./verify.js");
var errors_js_1 = require("./errors.js");
function usage() {
    console.log("Usage:");
    console.log("  node dist/index.js <path-to-vector.json>");
    process.exit(1);
}
function main() {
    var inputPath = process.argv[2];
    if (!inputPath)
        usage();
    var resolved = path_1.default.resolve(process.cwd(), inputPath);
    if (!fs_1.default.existsSync(resolved)) {
        console.error("File not found:", resolved);
        process.exit(1);
    }
    var raw = fs_1.default.readFileSync(resolved, "utf8");
    var parsed = JSON.parse(raw);
    var envelope = parsed.envelope;
    var authorization = parsed.authorization;
    if (!envelope || !authorization) {
        console.error("Invalid vector format. Must contain envelope and authorization.");
        process.exit(1);
    }
    var now = Date.now();
    try {
        var result = (0, verify_js_1.verifyEtg)(envelope, authorization, {
            currentTimeMs: now,
            isReplay: function () { return false; },
            verifySignature: function () { return false; } // reference mode
        });
        var computedHash = (0, verify_js_1.computeEnvelopeHash)(envelope);
        console.log(JSON.stringify({
            timestamp: now,
            result: result,
            computed_envelope_hash: computedHash
        }, null, 2));
        if (result !== "ETG_OK") {
            process.exit(2);
        }
    }
    catch (err) {
        if (err instanceof errors_js_1.EtgError) {
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
