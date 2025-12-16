import { CANONICAL_PINNED_LINES } from './formattingContract';
const CORE_MODULES = [
    { id: 'core_identity', order: 1, kind: 'core', droppable: false },
    { id: 'global_safety_basics', order: 2, kind: 'core', droppable: false },
    { id: 'boundaries_policy', order: 3, kind: 'core', droppable: false },
    { id: 'contradiction_handling', order: 4, kind: 'core', droppable: false },
    { id: 'pressure_style', order: 5, kind: 'core', droppable: false },
    { id: 'intent_routing', order: 6, kind: 'core', droppable: false },
    { id: 'info_routing_map', order: 7, kind: 'core', droppable: false },
    {
        id: 'tone_pacing',
        order: 8,
        kind: 'core',
        droppable: false,
        pinnedLines: CANONICAL_PINNED_LINES,
    },
    { id: 'detail_level', order: 9, kind: 'core', droppable: false },
    { id: 'jobs_behavior', order: 10, kind: 'core', droppable: false },
    { id: 'stuck_core', order: 11, kind: 'core', droppable: false },
];
const OPTIONAL_MODULES = [
    { id: 'info_style_library', order: 12, kind: 'optional', droppable: true },
    { id: 'stuck_protocol_extended', order: 13, kind: 'optional', droppable: true },
    { id: 'formal_mode_switch', order: 14, kind: 'optional', droppable: true },
    { id: 'mannerism_mirroring', order: 15, kind: 'optional', droppable: true },
];
const TEST_CHAT_MODULE = {
    id: 'test_chat_controls',
    order: 16,
    kind: 'test_chat',
    droppable: false,
};
export const MODULE_REGISTRY = [
    ...CORE_MODULES,
    ...OPTIONAL_MODULES,
    TEST_CHAT_MODULE,
];
export const MODULE_REGISTRY_BY_ID = MODULE_REGISTRY.reduce((acc, module) => {
    acc[module.id] = module;
    return acc;
}, {});
export function isCoreModule(id) {
    return MODULE_REGISTRY_BY_ID[id].kind === 'core';
}
export function isOptionalModule(id) {
    return MODULE_REGISTRY_BY_ID[id].kind === 'optional';
}
export function isDroppableModule(id) {
    return MODULE_REGISTRY_BY_ID[id].droppable;
}
export function getModuleDefinition(id) {
    return MODULE_REGISTRY_BY_ID[id];
}
