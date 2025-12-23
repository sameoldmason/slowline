import { assembleSystemPrompt } from "../compiler/assembleSystemPrompt";
import { renderModules } from "../compiler/renderModules";
export function buildTestChatSystemPrompt(compiled) {
    const modulesWithTestChat = renderModules(compiled.resolvedConfigSnapshot, compiled.derived, { includeTestChat: true });
    const testChatModule = modulesWithTestChat.find((module) => module.id === "test_chat_controls");
    if (!testChatModule) {
        throw new Error("test_chat_controls module could not be rendered");
    }
    const withoutTestChat = modulesWithTestChat.filter((module) => module.id !== "test_chat_controls");
    const rebuiltBasePrompt = assembleSystemPrompt(withoutTestChat);
    if (rebuiltBasePrompt !== compiled.systemPrompt) {
        throw new Error("Compiled system prompt does not match canonical module rendering");
    }
    return {
        systemPrompt: assembleSystemPrompt([...withoutTestChat, testChatModule]),
        testChatModule,
    };
}
