import type { CompiledPersona } from "../schema/types";
import { ExporterError } from "./errors.js";
import type { ExportResult, ExporterTarget } from "./types.js";
import {
  deterministicTrimSystemPrompt,
  type TrimResult,
} from "./trim.js";
import {
  exportGenericSystem,
  exportClaudeSystem,
} from "./targets/genericSystem.js";
import { exportChatGPTCustomInstructions } from "./targets/chatgptCustomInstructions.js";
import { exportMarkdownHumanPack } from "./targets/markdownHumanPack.js";
import { exportJsonBotPack } from "./targets/jsonBotPack.js";

export function exportPersona(
  compiledPersona: CompiledPersona,
  target: ExporterTarget
): ExportResult {
  const trimResult: TrimResult = deterministicTrimSystemPrompt(compiledPersona);

  switch (target) {
    case "generic_system":
      return exportGenericSystem(compiledPersona, trimResult);
    case "claude_system":
      return exportClaudeSystem(compiledPersona, trimResult);
    case "chatgpt_custom_instructions":
      return exportChatGPTCustomInstructions(compiledPersona, trimResult);
    case "markdown_human_pack":
      return exportMarkdownHumanPack(compiledPersona, trimResult);
    case "json_bot_pack":
      return exportJsonBotPack(compiledPersona, trimResult);
    default:
      throw new ExporterError(
        "INVALID_TARGET",
        `Unknown export target "${String(target)}".`
      );
  }
}
