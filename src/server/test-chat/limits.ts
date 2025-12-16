import type { LimitsConfig } from "./types.js";

const REQUIRED_LIMIT_VARS = {
  rateLimitWindowMs: "TEST_CHAT_RATE_LIMIT_WINDOW_MS",
  rateLimitMaxRequests: "TEST_CHAT_RATE_LIMIT_MAX_REQUESTS",
  cooldownMs: "TEST_CHAT_COOLDOWN_MS",
  dailyMessageCap: "TEST_CHAT_DAILY_MESSAGE_CAP",
  tokenCap: "TEST_CHAT_TOKEN_CAP",
} as const;

function parseNumericEnv(name: string, env: NodeJS.ProcessEnv): number {
  const raw = env[name];

  if (!raw) {
    throw new Error(`Missing required env var ${name}`);
  }

  const value = Number(raw);

  if (!Number.isFinite(value)) {
    throw new Error(`Env var ${name} must be a finite number`);
  }

  return value;
}

export function loadLimitsConfig(env: NodeJS.ProcessEnv = process.env): LimitsConfig {
  return {
    rateLimitWindowMs: parseNumericEnv(REQUIRED_LIMIT_VARS.rateLimitWindowMs, env),
    rateLimitMaxRequests: parseNumericEnv(
      REQUIRED_LIMIT_VARS.rateLimitMaxRequests,
      env
    ),
    cooldownMs: parseNumericEnv(REQUIRED_LIMIT_VARS.cooldownMs, env),
    dailyMessageCap: parseNumericEnv(REQUIRED_LIMIT_VARS.dailyMessageCap, env),
    tokenCap: parseNumericEnv(REQUIRED_LIMIT_VARS.tokenCap, env),
  };
}

export const REQUIRED_LIMIT_ENV_VARS = Object.values(REQUIRED_LIMIT_VARS);
