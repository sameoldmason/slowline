import { randomUUID } from "node:crypto";
import type { CompiledModule, CompiledPersona } from "../../persona-engine/index.js";
import type { TestChatSession } from "./types.js";

const sessions = new Map<string, TestChatSession>();

function dayKey(timestamp: number): string {
  return new Date(timestamp).toISOString().slice(0, 10);
}

export function createSession(params: {
  compiledPersona: CompiledPersona;
  systemPrompt: string;
  testChatModule: CompiledModule;
  promptHash: string;
  createdAt?: number;
}): TestChatSession {
  const createdAt = params.createdAt ?? Date.now();
  const session: TestChatSession = {
    id: randomUUID(),
    compiledPersona: params.compiledPersona,
    systemPrompt: params.systemPrompt,
    testChatModule: params.testChatModule,
    promptHash: params.promptHash,
    createdAt,
    usage: {
      lastMessageAt: undefined,
      totalMessages: 0,
      totalTokens: 0,
      day: dayKey(createdAt),
      dailyMessages: 0,
      dailyTokens: 0,
      window: [],
    },
  };

  sessions.set(session.id, session);
  return session;
}

export function getSession(sessionId: string): TestChatSession | null {
  return sessions.get(sessionId) ?? null;
}

export function upsertSession(session: TestChatSession): void {
  sessions.set(session.id, session);
}

export function resetStore(): void {
  sessions.clear();
}
