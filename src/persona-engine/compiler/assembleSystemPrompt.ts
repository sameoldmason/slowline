import { FORMATTING_CONTRACT } from "../registry/formattingContract";
import type { CompiledModule } from "../schema/types";
import { canonicalizePromptText } from "../utils/normalize";

const MODULE_HEADER_PREFIX = "### module: ";

export function assembleSystemPrompt(modules: CompiledModule[]): string {
  const sections = modules.map((module) => {
    const header = `${MODULE_HEADER_PREFIX}${module.id}`;
    return `${header}${FORMATTING_CONTRACT.newline}${module.body}`;
  });

  const prompt = sections.join(FORMATTING_CONTRACT.sectionDivider);
  return canonicalizePromptText(prompt);
}
