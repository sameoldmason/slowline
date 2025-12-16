import { buildExportMetadata } from "../trim.js";
export function exportMarkdownHumanPack(compiled, trim) {
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
