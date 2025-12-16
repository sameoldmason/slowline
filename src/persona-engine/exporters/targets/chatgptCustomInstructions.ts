import type { CompiledPersona } from "../../schema/types";
import type { ExportResult } from "../types.js";
import type { TrimResult } from "../trim.js";
import { buildExportMetadata } from "../trim.js";

export interface ChatGPTCustomInstructionsPayload {
  what_chatgpt_should_know: string;
  how_chatgpt_should_respond: string;
}

export function exportChatGPTCustomInstructions(
  compiled: CompiledPersona,
  trim: TrimResult
): ExportResult<ChatGPTCustomInstructionsPayload> {
  const content: ChatGPTCustomInstructionsPayload = {
    what_chatgpt_should_know: "",
    how_chatgpt_should_respond: trim.prompt,
  };

  return {
    target: "chatgpt_custom_instructions",
    filename: `persona-chatgpt_custom_instructions-${compiled.promptHash}.json`,
    content,
    metadata: buildExportMetadata(compiled, trim),
  };
}
