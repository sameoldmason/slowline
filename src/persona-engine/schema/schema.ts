export type SchemaVersion = 'v1';

export const SUPPORTED_SCHEMA_VERSIONS: SchemaVersion[] = ['v1'];

export const DEFAULT_SCHEMA_VERSION: SchemaVersion = 'v1';

export function isSupportedSchemaVersion(version: string): version is SchemaVersion {
  return SUPPORTED_SCHEMA_VERSIONS.includes(version as SchemaVersion);
}
