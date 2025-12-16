export type RouterErrorReason = "INVALID_INPUT" | "INVALID_INTENT";

export class RouterError extends Error {
  readonly reason: RouterErrorReason;
  readonly details?: string;

  constructor(reason: RouterErrorReason, message: string, details?: string) {
    super(message);
    this.reason = reason;
    this.details = details;
    this.name = "RouterError";
  }
}
