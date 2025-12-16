import { SchemaVersion, SUPPORTED_SCHEMA_VERSIONS } from '../registry/schemaVersions';

export function isSupportedSchemaVersion(version: string): version is SchemaVersion {
  return SUPPORTED_SCHEMA_VERSIONS.includes(version as SchemaVersion);
}
