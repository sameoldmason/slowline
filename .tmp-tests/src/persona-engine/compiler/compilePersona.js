import { assembleSystemPrompt } from "./assembleSystemPrompt";
import { computePromptHash } from "./hash";
import { estimateTokens } from "./tokenEstimate";
import { derivePersonaFields } from "../schema/derive";
import { resolveDefaults } from "../schema/resolveDefaults";
import { renderModules } from "./renderModules";
import { assertNoPlaceholders, assertPinnedLines, assertRegistryMatches, } from "../utils/assert";
import { validatePersonaConfig } from "../schema/validate";
export function compilePersona(input) {
    validatePersonaConfig(input);
    const resolved = resolveDefaults(input);
    const derived = derivePersonaFields(resolved);
    const modules = renderModules(resolved, derived);
    assertRegistryMatches(modules);
    const systemPrompt = assembleSystemPrompt(modules);
    assertNoPlaceholders(systemPrompt, "systemPrompt");
    assertPinnedLines(systemPrompt);
    const promptHash = computePromptHash({
        systemPrompt,
    });
    const { tokenEstimate, tokenizerModel } = estimateTokens(systemPrompt);
    const compiled = {
        schemaVersion: resolved.schemaVersion,
        resolvedConfigSnapshot: resolved,
        derived,
        compiledAt: new Date(0).toISOString(),
        modules,
        systemPrompt,
        promptHash,
        tokenEstimate,
        tokenizerModel,
    };
    return { resolved, compiled };
}
