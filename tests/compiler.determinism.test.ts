import assert from "node:assert/strict";
import { compilePersona } from "../src/persona-engine/compiler/compilePersona.js";
import type { PersonaConfig } from "../src/persona-engine/schema/types.js";
import { GOLDEN_RESOLVED_CONFIG } from "./fixtures/exporters.golden.js";

const CONFIG = GOLDEN_RESOLVED_CONFIG;

const firstRun = compilePersona(CONFIG).compiled;
const secondRun = compilePersona(CONFIG).compiled;
const thirdRun = compilePersona(CONFIG).compiled;

assert.strictEqual(
  firstRun.promptHash,
  secondRun.promptHash,
  "compilePersona should produce a stable promptHash for the same input"
);
assert.strictEqual(
  secondRun.promptHash,
  thirdRun.promptHash,
  "promptHash must remain stable across repeated runs"
);
assert.strictEqual(
  firstRun.systemPrompt,
  secondRun.systemPrompt,
  "systemPrompt should be deterministic for the same input"
);
assert.strictEqual(
  secondRun.systemPrompt,
  thirdRun.systemPrompt,
  "systemPrompt must remain stable across repeated runs"
);
assert.strictEqual(
  firstRun.tokenEstimate,
  secondRun.tokenEstimate,
  "tokenEstimate should be deterministic for the same input"
);
assert.strictEqual(
  firstRun.tokenizerModel,
  secondRun.tokenizerModel,
  "tokenizerModel should be deterministic for the same input"
);

const invalidConfig: PersonaConfig = {
  ...CONFIG,
  schemaVersion: "v999" as unknown as PersonaConfig["schemaVersion"],
};

assert.throws(
  () => compilePersona(invalidConfig),
  /Unsupported schemaVersion/,
  "Compiler must fail closed on unsupported schema versions"
);
