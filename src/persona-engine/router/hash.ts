import { stableStringify } from "../utils/normalize";
import type { ResponsePlan } from "./types";

export function computeResponsePlanHash(plan: ResponsePlan): string {
  const canonical = stableStringify(plan);
  return fnv1a64(canonical);
}

function fnv1a64(input: string): string {
  let hash = 0xcbf29ce484222325n;
  const prime = 0x100000001b3n;
  const mod = 2n ** 64n;

  for (let i = 0; i < input.length; i += 1) {
    hash ^= BigInt(input.charCodeAt(i));
    hash = (hash * prime) % mod;
  }

  return hash.toString(16).padStart(16, "0");
}
