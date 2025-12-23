import { assembleSystemPrompt } from "./assembleSystemPrompt";
import { computePromptHash } from "./hash";
import { estimateTokens } from "./tokenEstimate";
import { derivePersonaFields } from "../schema/derive";
import { resolveDefaults } from "../schema/resolveDefaults";
import { renderModules } from "./renderModules";
import { assertNoPlaceholders, assertPinnedLines, assertRegistryMatches, } from "../utils/assert";
import { validatePersonaConfig } from "../schema/validate";
import { CANONICAL_PINNED_LINES } from "../registry/formattingContract";
export function compilePersona(input) {
    validatePersonaConfig(input);
    const resolved = resolveDefaults(input);
    const derived = derivePersonaFields(resolved);
    const modules = renderModules(resolved, derived);
    assertRegistryMatches(modules);
    const systemPrompt = assembleSystemPrompt(modules);
    assertNoPlaceholders(systemPrompt, "systemPrompt");
    assertPinnedLines(systemPrompt, CANONICAL_PINNED_LINES.map((line) => line.replace(/{{\s*([^}]+)\s*}}/g, (_, key) => {
        const ctx = {
            tone: resolved.tone,
            pacing: resolved.pacing,
            tone_description: derived.toneDescription ?? resolved.tone,
            pacing_description: derived.pacingDescription ?? resolved.pacing,
        };
        return ctx[key] ?? "";
    })));
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
