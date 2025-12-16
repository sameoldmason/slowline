import { buildExportMetadata } from "../trim.js";
export function exportGenericSystem(compiled, trim) {
    return {
        target: "generic_system",
        filename: buildFilename("generic_system", compiled.promptHash, "txt"),
        content: trim.prompt,
        metadata: buildExportMetadata(compiled, trim),
    };
}
function buildFilename(target, promptHash, extension) {
    return `persona-${target}-${promptHash}.${extension}`;
}
export function exportClaudeSystem(compiled, trim) {
    return {
        target: "claude_system",
        filename: buildFilename("claude_system", compiled.promptHash, "txt"),
        content: trim.prompt,
        metadata: buildExportMetadata(compiled, trim),
    };
}
