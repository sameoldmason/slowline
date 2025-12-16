import type { CompiledPersona, Intent } from "../schema/types";

export type ResponsePlanKind = "clarify_intent" | "routed";

export interface ClarifyIntentPlan {
  kind: "clarify_intent";
  question: string;
}

export interface RoutedPlan {
  kind: "routed";
  intent: Intent;
  applyPressure: boolean;
  allowAdvice: boolean;
  includeNextStep: boolean;
  useFormalMode: boolean;
  permissionRequiredForQuestions: boolean;
  pressureStyle: string;
  boundaries: string[];
  flaggedBoundaries: string[];
  allowQuestions: boolean;
}

export type ResponsePlan = ClarifyIntentPlan | RoutedPlan;

export interface RouteRuntime {
  intent?: Intent | null;
  message: string;
  explicitAdviceRequested?: boolean;
  requestFormalMode?: boolean;
}

export interface RouteContext {
  persona: CompiledPersona;
  runtime: RouteRuntime;
}

export interface PlannedResponse {
  plan: ResponsePlan;
  planHash: string;
}
