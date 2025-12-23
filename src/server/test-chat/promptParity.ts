import { buildTestChatSystemPrompt } from "../../persona-engine/test-chat/index.js";
import type { TestChatSession } from "./types.js";

export type PromptParityErrorCode =
  | "PROMPT_HASH_REQUIRED"
  | "PROMPT_HASH_MISMATCH"
  | "SYSTEM_PROMPT_DRIFT";

export class PromptParityError extends Error {
  readonly code: PromptParityErrorCode;

  constructor(code: PromptParityErrorCode, message: string) {
    super(message);
    this.code = code;
    this.name = "PromptParityError";
  }
}

export function assertPromptHashMatch(
  session: TestChatSession,
  provided: unknown
): void {
  if (typeof provided !== "string" || provided.length === 0) {
    throw new PromptParityError("PROMPT_HASH_REQUIRED", "promptHash is required");
  }

  if (provided !== session.promptHash) {
    throw new PromptParityError(
      "PROMPT_HASH_MISMATCH",
      "promptHash mismatch for session"
    );
  }
}

export function assertSystemPromptParity(session: TestChatSession): void {
  const { systemPrompt } = buildTestChatSystemPrompt(session.compiledPersona);

  if (systemPrompt !== session.systemPrompt) {
    throw new PromptParityError(
      "SYSTEM_PROMPT_DRIFT",
      "System prompt drifted from compiled persona"
    );
  }
}
