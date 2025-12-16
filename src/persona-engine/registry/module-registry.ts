import { CANONICAL_PINNED_LINES } from '../utils/formatting';

export type ModuleId =
  | 'core_identity'
  | 'global_safety_basics'
  | 'boundaries_policy'
  | 'contradiction_handling'
  | 'pressure_style'
  | 'intent_routing'
  | 'info_routing_map'
  | 'tone_pacing'
  | 'detail_level'
  | 'jobs_behavior'
  | 'stuck_core'
  | 'info_style_library'
  | 'stuck_protocol_extended'
  | 'formal_mode_switch'
  | 'mannerism_mirroring'
  | 'test_chat_controls';

export type ModuleKind = 'core' | 'optional' | 'test_chat';

export interface ModuleDefinition {
  id: ModuleId;
  order: number;
  kind: ModuleKind;
  droppable: boolean;
  pinnedLines?: readonly string[];
  description?: string;
}

const CORE_MODULES: ModuleDefinition[] = [
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

const OPTIONAL_MODULES: ModuleDefinition[] = [
  { id: 'info_style_library', order: 12, kind: 'optional', droppable: true },
  { id: 'stuck_protocol_extended', order: 13, kind: 'optional', droppable: true },
  { id: 'formal_mode_switch', order: 14, kind: 'optional', droppable: true },
  { id: 'mannerism_mirroring', order: 15, kind: 'optional', droppable: true },
];

const TEST_CHAT_MODULE: ModuleDefinition = {
  id: 'test_chat_controls',
  order: 16,
  kind: 'test_chat',
  droppable: false,
};

export const MODULE_REGISTRY: ModuleDefinition[] = [
  ...CORE_MODULES,
  ...OPTIONAL_MODULES,
  TEST_CHAT_MODULE,
];

export const MODULE_REGISTRY_BY_ID: Record<ModuleId, ModuleDefinition> = MODULE_REGISTRY.reduce(
  (acc, module) => {
    acc[module.id] = module;
    return acc;
  },
  {} as Record<ModuleId, ModuleDefinition>,
);

export function isCoreModule(id: ModuleId): boolean {
  return MODULE_REGISTRY_BY_ID[id].kind === 'core';
}

export function isOptionalModule(id: ModuleId): boolean {
  return MODULE_REGISTRY_BY_ID[id].kind === 'optional';
}

export function isDroppableModule(id: ModuleId): boolean {
  return MODULE_REGISTRY_BY_ID[id].droppable;
}

export function getModuleDefinition(id: ModuleId): ModuleDefinition {
  return MODULE_REGISTRY_BY_ID[id];
}
