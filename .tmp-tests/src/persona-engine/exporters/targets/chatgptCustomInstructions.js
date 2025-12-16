import { buildExportMetadata } from "../trim.js";
export function exportChatGPTCustomInstructions(compiled, trim) {
    const content = {
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
