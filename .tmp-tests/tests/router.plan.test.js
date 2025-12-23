import assert from "node:assert/strict";
import { compilePersona } from "../src/persona-engine/compiler/compilePersona.js";
import { routeResponse } from "../src/persona-engine/router/route.js";
import { GOLDEN_RESOLVED_CONFIG } from "./fixtures/exporters.golden.js";
const COMPILED = compilePersona(GOLDEN_RESOLVED_CONFIG).compiled;
function runPlan(message, runtime = {}) {
  return routeResponse({
    persona: COMPILED,
    runtime: {
      message,
      ...runtime,
    },
  });
}
const unclear = runPlan("hello there");
const unclearRerun = runPlan("hello there");
assert.strictEqual(unclear.plan.kind, "clarify_intent");
const firstLine = (unclear.plan.question.split("\n")[0] ?? "").trim();
assert.ok(
  firstLine.includes("?"),
  "Clarifying plan should start with a question"
);
assert.deepStrictEqual(
  unclear.plan,
  unclearRerun.plan,
  "Clarifying plan should be deterministic"
);
if (
  typeof unclear.planHash === "string" &&
  typeof unclearRerun.planHash === "string"
) {
  assert.strictEqual(
    unclear.planHash,
    unclearRerun.planHash,
    "Clarifying plan hash should be deterministic"
  );
}
const vent = runPlan("I need to vent about this");
const ventRerun = runPlan("I need to vent about this");
assert.strictEqual(vent.plan.kind, "routed");
if (vent.plan.kind === "routed") {
  assert.strictEqual(vent.plan.intent, "vent_reflection");
  assert.strictEqual(vent.plan.allowAdvice, false);
}
assert.deepStrictEqual(
  vent.plan,
  ventRerun.plan,
  "Vent plan should be deterministic"
);
if (
  typeof vent.planHash === "string" &&
  typeof ventRerun.planHash === "string"
) {
  assert.strictEqual(
    vent.planHash,
    ventRerun.planHash,
    "Vent plan hash should be deterministic"
  );
}
const stuck = runPlan("I'm stuck on the next step");
const stuckRerun = runPlan("I'm stuck on the next step");
assert.strictEqual(stuck.plan.kind, "routed");
if (stuck.plan.kind === "routed") {
  assert.strictEqual(stuck.plan.intent, "stuck");
  assert.strictEqual(stuck.plan.includeNextStep, true);
}
assert.deepStrictEqual(
  stuck.plan,
  stuckRerun.plan,
  "Stuck plan should be deterministic"
);
if (
  typeof stuck.planHash === "string" &&
  typeof stuckRerun.planHash === "string"
) {
  assert.strictEqual(
    stuck.planHash,
    stuckRerun.planHash,
    "Stuck plan hash should be deterministic"
  );
}
