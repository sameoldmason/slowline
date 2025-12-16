import type { CompiledPersona } from "../../schema/types";
import type { ExportResult } from "../types.js";
import type { TrimResult } from "../trim.js";
import { buildExportMetadata } from "../trim.js";

export interface JsonBotPackPayload {
  type: "slowline_persona_bot_pack_v1";
  schemaVersion: CompiledPersona["schemaVersion"];
  promptHash: string;
  systemPrompt: string;
  tokenizerModel: string;
  tokenEstimate: number;
}

export function exportJsonBotPack(
  compiled: CompiledPersona,
  trim: TrimResult
): ExportResult<JsonBotPackPayload> {
  const content: JsonBotPackPayload = {
    type: "slowline_persona_bot_pack_v1",
    schemaVersion: compiled.schemaVersion,
    promptHash: compiled.promptHash,
    systemPrompt: trim.prompt,
    tokenizerModel: compiled.tokenizerModel,
    tokenEstimate: compiled.tokenEstimate,
  };

  return {
    target: "json_bot_pack",
    filename: `persona-json_bot_pack-${compiled.promptHash}.json`,
    content,
    metadata: buildExportMetadata(compiled, trim),
  };
}
