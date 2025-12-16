export type SchemaVersion = 'v1';

export const SUPPORTED_SCHEMA_VERSIONS: SchemaVersion[] = ['v1'];

export const DEFAULT_SCHEMA_VERSION: SchemaVersion = 'v1';

export const MIN_SCHEMA_VERSION: SchemaVersion = SUPPORTED_SCHEMA_VERSIONS[0];
export const MAX_SCHEMA_VERSION: SchemaVersion = SUPPORTED_SCHEMA_VERSIONS[SUPPORTED_SCHEMA_VERSIONS.length - 1];
