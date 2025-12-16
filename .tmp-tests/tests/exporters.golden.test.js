import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { exportPersona } from "../src/persona-engine/exporters/index.js";
import { compilePersona } from "../src/persona-engine/compiler/compilePersona.js";
import { GOLDEN_CHATGPT_CUSTOM_INSTRUCTIONS, GOLDEN_COMPILED_PERSONA, GOLDEN_FILENAMES, GOLDEN_JSON_BOT_PACK, GOLDEN_MARKDOWN_PACK, GOLDEN_RESOLVED_CONFIG, GOLDEN_PROMPT_HASH, GOLDEN_SYSTEM_PROMPT, } from "./fixtures/exporters.golden.js";
const TARGETS = [
    "generic_system",
    "claude_system",
    "chatgpt_custom_instructions",
    "markdown_human_pack",
    "json_bot_pack",
];
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const CANONICAL_PROMPT_TEMPLATE_PATH = path.resolve(__dirname, "../../docs/persona-engine-v1/CANONICAL_PROMPT_TEMPLATE.md");
function readCanonicalPromptTemplate() {
    const content = fs.readFileSync(CANONICAL_PROMPT_TEMPLATE_PATH, "utf8");
    const match = content.match(/explicit architectural decision\.\r?\n\r?\n([\s\S]+?)\r?\n\r?\nPinned lines:/);
    if (!match) {
        throw new Error("Failed to extract canonical system prompt from template file");
    }
    return match[1];
}
const { compiled: recompilation } = compilePersona(GOLDEN_RESOLVED_CONFIG);
assert.strictEqual(readCanonicalPromptTemplate(), recompilation.systemPrompt, "CANONICAL_PROMPT_TEMPLATE.md must match the compiled system prompt");
assert.strictEqual(recompilation.systemPrompt, GOLDEN_SYSTEM_PROMPT, "Recompiled system prompt must stay byte-identical to the golden fixture");
function assertByteIdentity(result, compiledPrompt) {
    if (typeof result.content === "string") {
        assert.ok(result.content.includes(compiledPrompt), `${result.target} should include the canonical system prompt`);
    }
    else {
        const payload = result.content;
        if ("how_chatgpt_should_respond" in payload) {
            assert.strictEqual(payload.how_chatgpt_should_respond, compiledPrompt, "chatgpt_custom_instructions prompt mismatch");
        }
        if ("systemPrompt" in payload) {
            assert.strictEqual(payload.systemPrompt, compiledPrompt, "json_bot_pack prompt mismatch");
        }
    }
}
for (const target of TARGETS) {
    const compiled = GOLDEN_COMPILED_PERSONA;
    const result = exportPersona(compiled, target);
    assert.strictEqual(compiled.systemPrompt, GOLDEN_SYSTEM_PROMPT, "Compiled prompt deviated from golden fixture");
    assert.strictEqual(compiled.promptHash, GOLDEN_PROMPT_HASH, "promptHash deviated from golden fixture");
    assert.strictEqual(result.filename, GOLDEN_FILENAMES[target]);
    assert.strictEqual(result.metadata.promptHash, compiled.promptHash);
    assert.strictEqual(result.metadata.trimmed, false);
    assert.deepStrictEqual(result.metadata.removedSections, []);
    assertByteIdentity(result, compiled.systemPrompt);
    switch (target) {
        case "generic_system":
            assert.strictEqual(result.content, GOLDEN_SYSTEM_PROMPT);
            break;
        case "claude_system":
            assert.strictEqual(result.content, GOLDEN_SYSTEM_PROMPT);
            break;
        case "chatgpt_custom_instructions":
            assert.deepStrictEqual(result.content, GOLDEN_CHATGPT_CUSTOM_INSTRUCTIONS);
            break;
        case "markdown_human_pack":
            assert.strictEqual(result.content, GOLDEN_MARKDOWN_PACK);
            break;
        case "json_bot_pack":
            assert.deepStrictEqual(result.content, GOLDEN_JSON_BOT_PACK);
            break;
    }
    const rerun = exportPersona(compiled, target);
    assert.deepStrictEqual(rerun, result, `${target} export should be deterministic across invocations`);
}
