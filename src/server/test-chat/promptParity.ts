import { buildTestChatSystemPrompt } from "../../persona-engine/test-chat/index.js";
import type { TestChatSession } from "./types.js";

export function assertPromptHashMatch(
  session: TestChatSession,
  provided: unknown
): void {
  if (typeof provided !== "string" || provided.length === 0) {
    throw new Error("promptHash is required");
  }

  if (provided !== session.promptHash) {
    throw new Error("promptHash mismatch for session");
  }
}

export function assertSystemPromptParity(session: TestChatSession): void {
  const { systemPrompt } = buildTestChatSystemPrompt(session.compiledPersona);

  if (systemPrompt !== session.systemPrompt) {
    throw new Error("System prompt drifted from compiled persona");
  }
}
