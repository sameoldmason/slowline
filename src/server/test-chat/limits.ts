import type { LimitsConfig } from "./types.js";

const REQUIRED_LIMIT_VARS = {
  rateLimitWindowMs: "TEST_CHAT_RATE_LIMIT_WINDOW_MS",
  rateLimitMaxRequests: "TEST_CHAT_RATE_LIMIT_MAX_REQUESTS",
  cooldownMs: "TEST_CHAT_COOLDOWN_MS",
  dailyMessageCap: "TEST_CHAT_DAILY_MESSAGE_CAP",
  tokenCap: "TEST_CHAT_TOKEN_CAP",
  maxMessageChars: "TEST_CHAT_MAX_MESSAGE_CHARS",
  maxHistoryMessages: "TEST_CHAT_MAX_HISTORY_MESSAGES",
} as const;

function parsePositiveIntEnv(name: string, env: NodeJS.ProcessEnv): number {
  const raw = env[name];

  if (!raw) {
    throw new Error(`Missing required env var ${name}`);
  }

  const value = Number(raw);

  if (!Number.isInteger(value) || value < 1) {
    throw new Error(`Env var ${name} must be an integer >= 1`);
  }

  return value;
}

export function loadLimitsConfig(env: NodeJS.ProcessEnv = process.env): LimitsConfig {
  return {
    rateLimitWindowMs: parsePositiveIntEnv(
      REQUIRED_LIMIT_VARS.rateLimitWindowMs,
      env
    ),
    rateLimitMaxRequests: parsePositiveIntEnv(
      REQUIRED_LIMIT_VARS.rateLimitMaxRequests,
      env
    ),
    cooldownMs: parsePositiveIntEnv(REQUIRED_LIMIT_VARS.cooldownMs, env),
    dailyMessageCap: parsePositiveIntEnv(
      REQUIRED_LIMIT_VARS.dailyMessageCap,
      env
    ),
    tokenCap: parsePositiveIntEnv(REQUIRED_LIMIT_VARS.tokenCap, env),
    maxMessageChars: parsePositiveIntEnv(
      REQUIRED_LIMIT_VARS.maxMessageChars,
      env
    ),
    maxHistoryMessages: parsePositiveIntEnv(
      REQUIRED_LIMIT_VARS.maxHistoryMessages,
      env
    ),
  };
}

export const REQUIRED_LIMIT_ENV_VARS = Object.values(REQUIRED_LIMIT_VARS);
