import type { CompiledPersona } from "../../schema/types";
import type { ExportResult } from "../types.js";
import type { TrimResult } from "../trim.js";
import { buildExportMetadata } from "../trim.js";

export function exportGenericSystem(
  compiled: CompiledPersona,
  trim: TrimResult
): ExportResult<string> {
  return {
    target: "generic_system",
    filename: buildFilename("generic_system", compiled.promptHash, "txt"),
    content: trim.prompt,
    metadata: buildExportMetadata(compiled, trim),
  };
}

function buildFilename(
  target: "generic_system" | "claude_system",
  promptHash: string,
  extension: string
): string {
  return `persona-${target}-${promptHash}.${extension}`;
}

export function exportClaudeSystem(
  compiled: CompiledPersona,
  trim: TrimResult
): ExportResult<string> {
  return {
    target: "claude_system",
    filename: buildFilename("claude_system", compiled.promptHash, "txt"),
    content: trim.prompt,
    metadata: buildExportMetadata(compiled, trim),
  };
}
