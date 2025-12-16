import type { CompiledPersona } from "../../schema/types";
import type { ExportResult } from "../types.js";
import type { TrimResult } from "../trim.js";
import { buildExportMetadata } from "../trim.js";

export function exportMarkdownHumanPack(
  compiled: CompiledPersona,
  trim: TrimResult
): ExportResult<string> {
  const content = [
    "# Slowline Persona Pack",
    `schema_version: ${compiled.schemaVersion}`,
    `prompt_hash: ${compiled.promptHash}`,
    "",
    "## Canonical System Prompt",
    "```",
    trim.prompt,
    "```",
  ].join("\n");

  return {
    target: "markdown_human_pack",
    filename: `persona-markdown_human_pack-${compiled.promptHash}.md`,
    content,
    metadata: buildExportMetadata(compiled, trim),
  };
}
