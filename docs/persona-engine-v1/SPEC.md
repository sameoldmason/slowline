# Slowline Persona Engine v1 — Specification

## Purpose

Define the complete, locked behavior of the Slowline persona engine v1.
This system compiles intake configuration into a deterministic persona prompt,
routes runtime behavior by intent, powers a real-LLM test chat, and exports
portable prompt packs for external AI tools.

This is a behavior contract, not a suggestion.

---

## Product Definition (Locked)

Slowline is a calm, warm, tool-like web app that generates personalized AI personas
(prompt packs) for use in external AI tools, plus a thin test chat to try the persona.

Slowline is NOT:

- a full assistant
- a coach or therapist
- a gamified product
- a growth or notification system

Tone: cozy productivity tool. No hype. No corporate language.

---

## Scope (Locked)

### In scope

- Persona engine architecture
- Compiler (config → compiled persona)
- Runtime routing (intent → response plan)
- Boundaries, pressure style, contradictions
- Test chat execution (real LLM call)
- Export formats and token trimming
- Refactor-proof guarantees

### Out of scope

- Visual / UX work
- Intake redesign
- Marketing copy
- Long-term memory

---

## Intake Summary (Locked)

Intake v1 (Steps 1–8) is complete and merged to main.

Key rules:

- Tone + pacing are single-select and blended 50/50
- Info styles are selected but applied contextually at runtime
- Detail controls depth; pacing controls delivery
- Jobs are multi-purpose; primary job inferred (first selected)
- Stuck support: clarify goal → one small step
- Permission asking only if tone is Soft/Warm OR pacing is Slow
- Boundaries enforce no guilt, no judgment, no toxic positivity
- Pressure style default: gentle_nudge
- Contradictions obey newest instruction, surface at task end, and are stored as notes
- Signature phrases cap: 3
- Must support formal writing mode
- Schema versioning required day 1
- Minimum required fields: tone + pacing + jobs

---

## Persona Engine Architecture (Locked)

### Deterministic Compiler

Same input config must always produce the same compiled output.

Compiler steps (fixed):

1. Validate schema
2. Apply versioned defaults
3. Compute derived fields
4. Render modules in locked order
5. Omit empty optional modules entirely
6. Assemble canonical system prompt
7. Assert pinned lines
8. Compute promptHash
9. Estimate tokens
10. Return compiled persona

Fail closed if:

- schemaVersion unsupported
- required fields missing
- invalid enum values
- registry mismatch
- unresolved placeholders
- pinned lines missing

---

## Module Registry (Locked)

### Core (never droppable)

1. core_identity
2. global_safety_basics
3. boundaries_policy
4. contradiction_handling
5. pressure_style
6. intent_routing
7. info_routing_map
8. tone_pacing (pinned lines)
9. detail_level
10. jobs_behavior
11. stuck_core

### Optional (droppable in order)

12. info_style_library
13. stuck_protocol_extended
14. formal_mode_switch
15. mannerism_mirroring

### Test chat only

16. test_chat_controls

---

## Runtime Routing (Locked)

Intents (fixed set):

- plan
- learn
- write
- decide
- stuck
- vent_reflection

If intent unclear: ask exactly one clarifying question.

Vent rules:

- reflect briefly
- no advice unless explicitly requested

Stuck rules:

- one concrete next step (≤10 minutes)
- question only if permission asking enabled

Pressure:

- may increase directness
- never guilt, shame, moralize
- inactive during vent_reflection

Formal mode:

- per response only
- triggered for formal artifacts
- auto resets

---

## Exporter Contract (Locked)

Exports are pure transforms of CompiledPersona.

Targets:

- generic_system
- claude_system
- chatgpt_custom_instructions
- markdown_human_pack
- json_bot_pack

Rules:

- No paraphrasing
- Byte-for-byte copying for model ingestion
- Pinned lines always preserved
- Deterministic filenames
- Deterministic trimming

---

## Test Chat Execution (Locked)

- Single model only
- No tools
- system prompt = compiled prompt + test_chat_controls only
- No hidden wrappers
- PromptHash mismatch blocks session
- Rate limits, token caps, cooldowns enforced
- No long-term memory

---

## Non-Negotiables

- No invented modes
- No explaining internal logic unless asked
- No therapy framing
- No silent behavior drift
