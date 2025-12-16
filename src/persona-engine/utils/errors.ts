export type CompileErrorReason =
  | 'UNSUPPORTED_SCHEMA_VERSION'
  | 'INVALID_SCHEMA'
  | 'REGISTRY_MISMATCH'
  | 'RENDER_FAILURE'
  | 'MISSING_PINNED_LINES'
  | 'PLACEHOLDERS_REMAIN';

export class CompileError extends Error {
  readonly reason: CompileErrorReason;
  readonly details?: string;

  constructor(reason: CompileErrorReason, message: string, details?: string) {
    super(message);
    this.reason = reason;
    this.details = details;
    this.name = 'CompileError';
  }
}
