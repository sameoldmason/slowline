import { CANONICAL_PINNED_LINES } from "../registry/formattingContract";
import { MODULE_REGISTRY } from "../registry/moduleRegistry";
import { CompileError } from "../utils/errors";
import { trimTrailingWhitespace } from "../utils/normalize";
function joinLines(lines) {
    return trimTrailingWhitespace(lines
        .filter((line) => line.trim().length > 0)
        .map((line) => line.trimEnd())
        .join("\n"));
}
function interpolatePinned(template, resolved, derived) {
    const context = {
        tone: resolved.tone,
        pacing: resolved.pacing,
        tone_description: derived.toneDescription ?? resolved.tone,
        pacing_description: derived.pacingDescription ?? resolved.pacing,
    };
    return template.replace(/{{\s*([^}]+)\s*}}/g, (_, key) => context[key] ?? "");
}
function renderModule(id, resolved, derived) {
    switch (id) {
        case "core_identity": {
            const lines = [
                `- tone: ${resolved.tone}`,
                `- pacing: ${resolved.pacing}`,
                `- detail_level: ${resolved.detailLevel ?? "unspecified"}`,
                `- primary_job: ${derived.primaryJob ?? "none"}`,
                `- pressure_style: ${resolved.pressureStyle}`,
            ];
            return joinLines(lines);
        }
        case "global_safety_basics": {
            const lines = [
                "- Slowline is a calm, warm, tool-like web app that generates personalized AI personas (prompt packs) for use in external AI tools.",
                "- Slowline is NOT: a full assistant; a coach or therapist; a gamified product; a growth or notification system.",
            ];
            return joinLines(lines);
        }
        case "boundaries_policy": {
            const boundaryLines = resolved.boundaries.length > 0
                ? resolved.boundaries.map((entry) => `- boundary: ${entry}`)
                : [];
            const lines = [
                "- Boundaries enforce no guilt, no judgment, no toxic positivity.",
                ...boundaryLines,
            ];
            return joinLines(lines);
        }
        case "contradiction_handling": {
            const lines = [
                "- Contradictions obey newest instruction.",
                "- Surface contradictions at task end.",
                "- Store contradictions as notes.",
            ];
            return joinLines(lines);
        }
        case "pressure_style": {
            const signatureLines = resolved.signaturePhrases.length > 0
                ? [`- signature_phrases: ${resolved.signaturePhrases.join(" | ")}`]
                : [];
            const lines = [
                `- pressure_style: ${resolved.pressureStyle}`,
                "- Pressure may increase directness.",
                "- Never guilt, shame, or moralize.",
                "- Inactive during vent_reflection.",
                ...signatureLines,
            ];
            return joinLines(lines);
        }
        case "intent_routing": {
            const lines = [
                "- intents: plan | learn | write | decide | stuck | vent_reflection",
                "- If intent unclear: ask exactly one clarifying question.",
                "- Vent rules: reflect briefly; no advice unless explicitly requested.",
            ];
            return joinLines(lines);
        }
        case "info_routing_map": {
            const styleLines = resolved.infoStyles.length > 0
                ? [`- info_styles: ${resolved.infoStyles.join(" | ")}`]
                : ["- info_styles: none selected"];
            const lines = [
                "- Info styles are selected but applied contextually at runtime.",
                ...styleLines,
            ];
            return joinLines(lines);
        }
        case "tone_pacing": {
            const pinned = CANONICAL_PINNED_LINES.map((line) => interpolatePinned(line, resolved, derived));
            const lines = [
                "- Tone + pacing are single-select and blended 50/50.",
                "- Permission asking only if tone is Soft/Warm OR pacing is Slow.",
                ...pinned,
            ];
            return joinLines(lines);
        }
        case "detail_level": {
            const lines = [
                "- Detail controls depth; pacing controls delivery.",
                `- detail_level: ${resolved.detailLevel ?? "unspecified"}`,
            ];
            return joinLines(lines);
        }
        case "jobs_behavior": {
            const lines = [
                "- Jobs are multi-purpose; primary job inferred (first selected).",
                `- jobs: ${resolved.jobs.join(" | ")}`,
                `- primary_job: ${derived.primaryJob ?? "none"}`,
            ];
            return joinLines(lines);
        }
        case "stuck_core": {
            const lines = [
                "- Stuck support: clarify goal -> one small step.",
                "- Offer one concrete next step (<=10 minutes).",
                "- Ask a question only if permission asking is enabled.",
            ];
            return joinLines(lines);
        }
        case "info_style_library": {
            if (resolved.infoStyles.length === 0) {
                return "";
            }
            const lines = resolved.infoStyles.map((style) => `- info_style: ${style}`);
            return joinLines(lines);
        }
        case "stuck_protocol_extended": {
            if (resolved.notes.length === 0) {
                return "";
            }
            const lines = resolved.notes.map((note) => `- note: ${note}`);
            return joinLines(lines);
        }
        case "formal_mode_switch": {
            const lines = [
                "- Formal mode is per response only.",
                "- Triggered for formal artifacts; auto resets after the response.",
            ];
            return joinLines(lines);
        }
        case "mannerism_mirroring": {
            if (resolved.signaturePhrases.length === 0) {
                return "";
            }
            const lines = [
                "- Signature phrases cap: 3.",
                `- signature_phrases: ${resolved.signaturePhrases.join(" | ")}`,
            ];
            return joinLines(lines);
        }
        case "test_chat_controls": {
            const lines = [
                "- Test chat only: single model, no tools, promptHash required, no long-term memory.",
            ];
            return joinLines(lines);
        }
    }
    const exhaustiveCheck = id;
    throw new CompileError("RENDER_FAILURE", `Unhandled module id ${String(exhaustiveCheck)}`);
}
export function renderModules(resolved, derived, options) {
    const shouldIncludeTestChat = options?.includeTestChat ?? false;
    const modules = MODULE_REGISTRY.filter((module) => shouldIncludeTestChat || module.kind !== "test_chat").sort((a, b) => a.order - b.order);
    return modules
        .map((definition) => {
        const body = renderModule(definition.id, resolved, derived);
        const isEmpty = body.trim().length === 0;
        if (isEmpty && definition.droppable) {
            return null;
        }
        if (isEmpty && !definition.droppable) {
            throw new CompileError("RENDER_FAILURE", `Module "${definition.id}" rendered empty`);
        }
        return {
            id: definition.id,
            body,
        };
    })
        .filter((module) => module !== null);
}
