import { PersonaDefaults } from '../types';
import { SchemaVersion } from '../schema/schema';

export const DEFAULT_PRESSURE_STYLE = 'gentle_nudge';

export const DEFAULT_SIGNATURE_PHRASES: string[] = [];

export const DEFAULT_INFO_STYLES: string[] = [];

export const DEFAULT_BOUNDARIES: string[] = [];

export const DEFAULT_NOTES: string[] = [];

export const DEFAULTS_V1: PersonaDefaults = {
  pressureStyle: DEFAULT_PRESSURE_STYLE,
  signaturePhrases: DEFAULT_SIGNATURE_PHRASES,
  infoStyles: DEFAULT_INFO_STYLES,
  boundaries: DEFAULT_BOUNDARIES,
  notes: DEFAULT_NOTES,
};

export const DEFAULT_SNAPSHOT_BY_VERSION: Record<SchemaVersion, PersonaDefaults> = {
  v1: DEFAULTS_V1,
};

export function getDefaultsForVersion(version: SchemaVersion): PersonaDefaults {
  return DEFAULT_SNAPSHOT_BY_VERSION[version];
}
