export type ExporterErrorReason =
  | "INVALID_TARGET"
  | "INVALID_INPUT"
  | "PINNED_LINES_VIOLATION";

export class ExporterError extends Error {
  readonly reason: ExporterErrorReason;
  readonly details?: string;

  constructor(reason: ExporterErrorReason, message: string, details?: string) {
    super(message);
    this.reason = reason;
    this.details = details;
    this.name = "ExporterError";
  }
}
