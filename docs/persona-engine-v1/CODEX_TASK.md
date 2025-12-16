# Codex Task Instructions — Persona Engine v1

You are implementing the Slowline persona engine.

Rules:

- Follow the SPEC.md exactly
- Implement phase by phase
- Do not change behavior
- Do not add features
- Fail closed on invalid input
- Do not paraphrase prompt rules
- No tools in test chat

Task:
Implement engine-impl-phase-3-router, Phase 3 only.

- Phase 3 scope: router modules under `src/persona-engine/router/` (`types.ts`, `errors.ts`, `hash.ts`, `route.ts`) and exports in `src/persona-engine/index.ts`.
- Keep compiler (phase 2) behavior stable while adding routing logic and hashing.

If anything is unclear, ask before coding.
