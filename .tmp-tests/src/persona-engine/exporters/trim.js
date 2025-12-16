import { CANONICAL_PINNED_LINES } from "../registry/formattingContract.js";
import { assertPinnedLines } from "../utils/assert.js";
import { ExporterError } from "./errors.js";
export function deterministicTrimSystemPrompt(compiled) {
    if (!compiled?.systemPrompt) {
        throw new ExporterError("INVALID_INPUT", "Compiled persona is required to export.");
    }
    // No trimming rules beyond preserving the compiled canonical prompt have been
    // specified for phase 4, so we pass the prompt through unchanged while
    // enforcing pinned-line integrity using the resolved, materialized pinned
    // lines for this persona.
    assertPinnedLines(compiled.systemPrompt, materializePinnedLines(compiled));
    return {
        prompt: compiled.systemPrompt,
        trimmed: false,
        removedSections: [],
    };
}
export function buildExportMetadata(compiled, trim) {
    return {
        schemaVersion: compiled.schemaVersion,
        promptHash: compiled.promptHash,
        trimmed: trim.trimmed,
        removedSections: trim.removedSections,
    };
}
function materializePinnedLines(compiled) {
    const context = {
        tone: compiled.resolvedConfigSnapshot.tone,
        pacing: compiled.resolvedConfigSnapshot.pacing,
        tone_description: compiled.derived.toneDescription ?? compiled.resolvedConfigSnapshot.tone,
        pacing_description: compiled.derived.pacingDescription ??
            compiled.resolvedConfigSnapshot.pacing,
    };
    return CANONICAL_PINNED_LINES.map((line) => line.replace(/{{\s*([^}]+)\s*}}/g, (_, key) => context[key] ?? ""));
}
