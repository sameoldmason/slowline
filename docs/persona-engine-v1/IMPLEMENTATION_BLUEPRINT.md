# Persona Engine v1 — Implementation Blueprint

This document defines HOW to implement the locked spec without refactors.

---

## Folder Structure

src/persona-engine/

- registry/
- schema/
- compiler/
- router/
- exporters/
  - targets/
- test-chat/
- utils/

src/server/test-chat/

persona-engine must have ZERO server imports.

---

## Phase Sequencing

### Phase 1 — Types + Registry

- Shared types
- Module registry
- Schema versions
- Defaults snapshots
- Formatting contract

### Phase 2 — Compiler

- Validation
- Defaults resolution
- Derived fields
- Module rendering
- Prompt assembly
- Hashing
- Token estimates

### Phase 3 — Router

- Intent detection
- Emotional boundary detection
- Question clamping
- Stuck logic
- Pressure logic
- ResponsePlan hashing

### Phase 4 — Exporters

- Trimming logic
- Target adapters
- Byte-identical guarantees
- Golden tests

### Phase 5 — Test Chat Server

- Session store
- Rate limits
- Daily caps
- Real LLM calls
- Prompt parity enforcement

### Phase 6 — Tests

- Determinism tests
- Golden export tests
- Router plan tests
- PromptHash stability tests

---

## Required Invariants

- compile is pure and deterministic
- router never mutates persona
- exporter never paraphrases
- test chat matches exports exactly
