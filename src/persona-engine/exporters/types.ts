import type { SchemaVersion } from "../registry/schemaVersions.js";

export type ExporterTarget =
  | "generic_system"
  | "claude_system"
  | "chatgpt_custom_instructions"
  | "markdown_human_pack"
  | "json_bot_pack";

export interface ExportMetadata {
  schemaVersion: SchemaVersion;
  promptHash: string;
  trimmed: boolean;
  removedSections: string[];
}

export interface ExportResult<TContent = unknown> {
  target: ExporterTarget;
  filename: string;
  content: TContent;
  metadata: ExportMetadata;
}
