export class RouterError extends Error {
    reason;
    details;
    constructor(reason, message, details) {
        super(message);
        this.reason = reason;
        this.details = details;
        this.name = "RouterError";
    }
}
