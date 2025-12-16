import type { ModuleId } from "../registry/moduleRegistry";
import type { SchemaVersion } from "../registry/schemaVersions";

export type Intent =
  | "plan"
  | "learn"
  | "write"
  | "decide"
  | "stuck"
  | "vent_reflection";

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

export interface ResolvedPersonaConfig extends PersonaConfig {
  detailLevel?: string;
  infoStyles: string[];
  pressureStyle: string;
  signaturePhrases: string[];
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
  resolvedConfigSnapshot: ResolvedPersonaConfig;
  derived: DerivedPersonaFields;
  compiledAt: string;
  modules: CompiledModule[];
  systemPrompt: string;
  promptHash: string;
  tokenEstimate: number;
  tokenizerModel: string;
}
