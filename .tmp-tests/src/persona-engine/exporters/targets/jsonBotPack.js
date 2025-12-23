import { buildExportMetadata } from "../trim.js";
export function exportJsonBotPack(compiled, trim) {
    const content = {
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
