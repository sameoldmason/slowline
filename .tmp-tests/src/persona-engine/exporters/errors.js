export class ExporterError extends Error {
    reason;
    details;
    constructor(reason, message, details) {
        super(message);
        this.reason = reason;
        this.details = details;
        this.name = "ExporterError";
    }
}
