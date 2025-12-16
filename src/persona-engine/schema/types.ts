import { ModuleId } from '../registry/moduleRegistry';
import { SchemaVersion } from '../registry/schemaVersions';

export type Intent =
  | 'plan'
  | 'learn'
  | 'write'
  | 'decide'
  | 'stuck'
  | 'vent_reflection';

export interface PersonaConfig {
  schemaVersion: SchemaVersion;
  tone: string;
  pacing: string;
  jobs: string[];
  detailLevel?: string;
  infoStyles?: string[];
  pressureStyle?: string;
  signaturePhrases?: string[];
  boundaries?: string[];
  notes?: string[];
}

export interface PersonaDefaults {
  pressureStyle: string;
  signaturePhrases: string[];
  infoStyles: string[];
  boundaries: string[];
  notes: string[];
}

export interface DerivedPersonaFields {
  primaryJob: string | null;
  toneDescription?: string;
  pacingDescription?: string;
}

export interface CompiledModule {
  id: ModuleId;
  body: string;
}

export interface CompiledPersona {
  schemaVersion: SchemaVersion;
  config: PersonaConfig;
  derived: DerivedPersonaFields;
  compiledAt: string;
  modules: CompiledModule[];
  canonicalPrompt: string;
  promptHash: string;
  tokenEstimate: number;
}
