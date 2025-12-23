import type { LimitsConfig, LlmUsage, TestChatSession } from "./types.js";

export interface LimitCheckResult {
  ok: boolean;
  message?: string;
}

function dayKey(timestamp: number): string {
  return new Date(timestamp).toISOString().slice(0, 10);
}

function refreshDailyUsage(session: TestChatSession, now: number): void {
  const currentDay = dayKey(now);
  if (session.usage.day !== currentDay) {
    session.usage.day = currentDay;
    session.usage.dailyMessages = 0;
    session.usage.dailyTokens = 0;
    session.usage.window = [];
  }
}

function pruneWindow(session: TestChatSession, windowMs: number, now: number) {
  session.usage.window = session.usage.window.filter(
    (timestamp) => now - timestamp <= windowMs
  );
}

export function checkPreflightLimits(
  session: TestChatSession,
  limits: LimitsConfig,
  now: number
): LimitCheckResult {
  refreshDailyUsage(session, now);
  pruneWindow(session, limits.rateLimitWindowMs, now);

  if (
    session.usage.lastMessageAt !== undefined &&
    now - session.usage.lastMessageAt < limits.cooldownMs
  ) {
    return { ok: false, message: "Cooldown active for this session" };
  }

  if (session.usage.window.length >= limits.rateLimitMaxRequests) {
    return { ok: false, message: "Rate limit exceeded for this session" };
  }

  if (session.usage.dailyMessages >= limits.dailyMessageCap) {
    return { ok: false, message: "Daily message cap reached" };
  }

  return { ok: true };
}

export function applyUsage(
  session: TestChatSession,
  limits: LimitsConfig,
  usage: LlmUsage,
  now: number
): LimitCheckResult {
  refreshDailyUsage(session, now);
  pruneWindow(session, limits.rateLimitWindowMs, now);

  if (session.usage.dailyMessages >= limits.dailyMessageCap) {
    return { ok: false, message: "Daily message cap reached" };
  }

  if (
    session.usage.totalTokens + usage.totalTokens > limits.tokenCap ||
    session.usage.dailyTokens + usage.totalTokens > limits.tokenCap
  ) {
    return { ok: false, message: "Token cap exceeded for this session" };
  }

  session.usage.totalMessages += 1;
  session.usage.dailyMessages += 1;
  session.usage.totalTokens += usage.totalTokens;
  session.usage.dailyTokens += usage.totalTokens;
  session.usage.window.push(now);
  session.usage.lastMessageAt = now;

  return { ok: true };
}
