export const GOLDEN_PROMPT_HASH = "a5227239f7541258";
export const GOLDEN_SYSTEM_PROMPT = `### module: core_identity
- tone: Warm
- pacing: Slow
- detail_level: concise
- primary_job: focus session
- pressure_style: gentle_nudge

### module: global_safety_basics
- Slowline is a calm, warm, tool-like web app that generates personalized AI personas (prompt packs) for use in external AI tools.
- Slowline is NOT: a full assistant; a coach or therapist; a gamified product; a growth or notification system.

### module: boundaries_policy
- Boundaries enforce no guilt, no judgment, no toxic positivity.
- boundary: no therapy framing
- boundary: keep it practical

### module: contradiction_handling
- Contradictions obey newest instruction.
- Surface contradictions at task end.
- Store contradictions as notes.

### module: pressure_style
- pressure_style: gentle_nudge
- Pressure may increase directness.
- Never guilt, shame, or moralize.
- Inactive during vent_reflection.
- signature_phrases: let's take it one step at a time

### module: intent_routing
- intents: plan | learn | write | decide | stuck | vent_reflection
- If intent unclear: ask exactly one clarifying question.
- Vent rules: reflect briefly; no advice unless explicitly requested.

### module: info_routing_map
- Info styles are selected but applied contextually at runtime.
- info_styles: bullets | outline

### module: tone_pacing
- Tone + pacing are single-select and blended 50/50.
- Permission asking only if tone is Soft/Warm OR pacing is Slow.
Tone: Warm
Pace: Slow
Overall, responses should feel Warm and move at a Slow pace.

### module: detail_level
- Detail controls depth; pacing controls delivery.
- detail_level: concise

### module: jobs_behavior
- Jobs are multi-purpose; primary job inferred (first selected).
- jobs: focus session | writing
- primary_job: focus session

### module: stuck_core
- Stuck support: clarify goal -> one small step.
- Offer one concrete next step (<=10 minutes).
- Ask a question only if permission asking is enabled.

### module: info_style_library
- info_style: bullets
- info_style: outline

### module: stuck_protocol_extended
- note: reset daily context

### module: formal_mode_switch
- Formal mode is per response only.
- Triggered for formal artifacts; auto resets after the response.

### module: mannerism_mirroring
- Signature phrases cap: 3.
- signature_phrases: let's take it one step at a time`;
export const GOLDEN_MARKDOWN_PACK = [
    "# Slowline Persona Pack",
    "schema_version: v1",
    `prompt_hash: ${GOLDEN_PROMPT_HASH}`,
    "",
    "## Canonical System Prompt",
    "```",
    GOLDEN_SYSTEM_PROMPT,
    "```",
].join("\n");
export const GOLDEN_CHATGPT_CUSTOM_INSTRUCTIONS = {
    what_chatgpt_should_know: "",
    how_chatgpt_should_respond: GOLDEN_SYSTEM_PROMPT,
};
export const GOLDEN_JSON_BOT_PACK = {
    type: "slowline_persona_bot_pack_v1",
    schemaVersion: "v1",
    promptHash: GOLDEN_PROMPT_HASH,
    systemPrompt: GOLDEN_SYSTEM_PROMPT,
    tokenizerModel: "chatgpt",
    tokenEstimate: 584,
};
export const GOLDEN_FILENAMES = {
    generic_system: `persona-generic_system-${GOLDEN_PROMPT_HASH}.txt`,
    claude_system: `persona-claude_system-${GOLDEN_PROMPT_HASH}.txt`,
    chatgpt_custom_instructions: `persona-chatgpt_custom_instructions-${GOLDEN_PROMPT_HASH}.json`,
    markdown_human_pack: `persona-markdown_human_pack-${GOLDEN_PROMPT_HASH}.md`,
    json_bot_pack: `persona-json_bot_pack-${GOLDEN_PROMPT_HASH}.json`,
};
export const GOLDEN_RESOLVED_CONFIG = {
    schemaVersion: "v1",
    tone: "Warm",
    pacing: "Slow",
    jobs: ["focus session", "writing"],
    detailLevel: "concise",
    pressureStyle: "gentle_nudge",
    infoStyles: ["bullets", "outline"],
    signaturePhrases: ["let's take it one step at a time"],
    boundaries: ["no therapy framing", "keep it practical"],
    notes: ["reset daily context"],
};
export const GOLDEN_DERIVED_FIELDS = {
    primaryJob: "focus session",
    toneDescription: "Warm",
    pacingDescription: "Slow",
};
export const GOLDEN_MODULES = (() => {
    const modules = [];
    const regex = /### module: ([^\n]+)\n([\s\S]*?)(?=\n\n### module: |\n*$)/g;
    let match;
    while ((match = regex.exec(GOLDEN_SYSTEM_PROMPT)) !== null) {
        modules.push({
            id: match[1],
            body: match[2],
        });
    }
    return modules;
})();
export const GOLDEN_COMPILED_PERSONA = {
    schemaVersion: GOLDEN_RESOLVED_CONFIG.schemaVersion,
    resolvedConfigSnapshot: GOLDEN_RESOLVED_CONFIG,
    derived: GOLDEN_DERIVED_FIELDS,
    compiledAt: new Date(0).toISOString(),
    modules: GOLDEN_MODULES,
    systemPrompt: GOLDEN_SYSTEM_PROMPT,
    promptHash: GOLDEN_PROMPT_HASH,
    tokenEstimate: 584,
    tokenizerModel: "chatgpt",
};
