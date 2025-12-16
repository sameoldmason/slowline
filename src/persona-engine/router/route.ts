import {
  type PlannedResponse,
  type ResponsePlan,
  type RoutedPlan,
  type RouteContext,
  type RouteRuntime,
} from "./types";
import { RouterError } from "./errors";
import { computeResponsePlanHash } from "./hash";
import type { Intent, ResolvedPersonaConfig } from "../schema/types";

const KNOWN_INTENTS: Intent[] = [
  "plan",
  "learn",
  "write",
  "decide",
  "stuck",
  "vent_reflection",
];

const INTENT_MATCHERS: Array<[Intent, RegExp[]]> = [
  ["vent_reflection", [/\bvent\b/i, /\bfrustrat/i, /\bupset\b/i, /\bmad\b/i]],
  ["stuck", [/\bstuck\b/i, /\bblocked\b/i, /\bspinning\b/i, /\bnot sure\b/i]],
  ["plan", [/\bplan\b/i, /\broadmap\b/i, /\bschedule\b/i]],
  ["learn", [/\blearn\b/i, /\bstudy\b/i, /\bunderstand\b/i]],
  ["write", [/\bwrite\b/i, /\bdraft\b/i, /\boutline\b/i, /\bcompose\b/i]],
  ["decide", [/\bdecide\b/i, /\bchoose\b/i, /\bpick\b/i, /\bselect\b/i]],
];

function isValidIntent(intent: unknown): intent is Intent {
  return typeof intent === "string" && KNOWN_INTENTS.includes(intent as Intent);
}

function resolveIntent(runtime: RouteRuntime): Intent | null {
  if (runtime.intent !== undefined && runtime.intent !== null) {
    if (!isValidIntent(runtime.intent)) {
      throw new RouterError(
        "INVALID_INTENT",
        `Unsupported intent "${String(runtime.intent)}"`
      );
    }
    return runtime.intent;
  }

  const inferred = inferIntent(runtime.message);
  return inferred;
}

function inferIntent(message: string): Intent | null {
  const normalized = message.trim();
  if (!normalized) return null;

  for (const [intent, matchers] of INTENT_MATCHERS) {
    if (matchers.some((matcher) => matcher.test(normalized))) {
      return intent;
    }
  }

  return null;
}

function isPermissionAskingEnabled(config: ResolvedPersonaConfig): boolean {
  const tone = config.tone.trim().toLowerCase();
  const pacing = config.pacing.trim().toLowerCase();
  return tone === "soft" || tone === "warm" || pacing === "slow";
}

function detectFlaggedBoundaries(
  boundaries: string[],
  message: string
): string[] {
  const normalizedMessage = message.toLowerCase();
  return boundaries.filter((boundary) =>
    normalizedMessage.includes(boundary.toLowerCase())
  );
}

function buildClarifyPlan(): ResponsePlan {
  const options = KNOWN_INTENTS.join(" / ");
  const question = `Which intent fits best? Options: ${options}?`;
  return {
    kind: "clarify_intent",
    question,
  };
}

function buildRoutedPlan(
  intent: Intent,
  context: RouteContext,
  permissionRequiredForQuestions: boolean,
  flaggedBoundaries: string[]
): RoutedPlan {
  const { resolvedConfigSnapshot } = context.persona;
  const applyPressure = intent !== "vent_reflection";
  const allowAdvice =
    intent !== "vent_reflection" ||
    context.runtime.explicitAdviceRequested === true;

  return {
    kind: "routed",
    intent,
    applyPressure,
    allowAdvice,
    allowQuestions: intent === "stuck" ? permissionRequiredForQuestions : true,
    includeNextStep: intent === "stuck",
    useFormalMode: context.runtime.requestFormalMode === true,
    permissionRequiredForQuestions: permissionRequiredForQuestions,
    pressureStyle: resolvedConfigSnapshot.pressureStyle,
    boundaries: [...resolvedConfigSnapshot.boundaries],
    flaggedBoundaries,
  };
}

function assertRuntimeInput(runtime: RouteRuntime): void {
  if (
    !runtime ||
    typeof runtime.message !== "string" ||
    runtime.message.trim().length === 0
  ) {
    throw new RouterError(
      "INVALID_INPUT",
      "runtime.message is required for routing"
    );
  }
}

export function routeResponse(context: RouteContext): PlannedResponse {
  if (!context || !context.persona) {
    throw new RouterError("INVALID_INPUT", "persona is required for routing");
  }

  assertRuntimeInput(context.runtime);

  const intent = resolveIntent(context.runtime);
  const permissionRequiredForQuestions = isPermissionAskingEnabled(
    context.persona.resolvedConfigSnapshot
  );
  const flaggedBoundaries = detectFlaggedBoundaries(
    context.persona.resolvedConfigSnapshot.boundaries,
    context.runtime.message
  );

  const plan =
    intent === null
      ? buildClarifyPlan()
      : buildRoutedPlan(
          intent,
          context,
          permissionRequiredForQuestions,
          flaggedBoundaries
        );

  const planHash = computeResponsePlanHash(plan);

  return {
    plan,
    planHash,
  };
}
