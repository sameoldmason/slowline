import { CompileError } from "../utils/errors";
import { SUPPORTED_SCHEMA_VERSIONS } from "../registry/schemaVersions";
export function isSupportedSchemaVersion(version) {
    return SUPPORTED_SCHEMA_VERSIONS.includes(version);
}
export function validatePersonaConfig(config) {
    if (!isSupportedSchemaVersion(config.schemaVersion)) {
        throw new CompileError("UNSUPPORTED_SCHEMA_VERSION", `Unsupported schemaVersion "${config.schemaVersion}"`);
    }
    const errors = [];
    if (!config.tone ||
        typeof config.tone !== "string" ||
        config.tone.trim().length === 0) {
        errors.push("tone is required");
    }
    if (!config.pacing ||
        typeof config.pacing !== "string" ||
        config.pacing.trim().length === 0) {
        errors.push("pacing is required");
    }
    if (!Array.isArray(config.jobs) || config.jobs.length === 0) {
        errors.push("jobs must include at least one entry");
    }
    if (Array.isArray(config.jobs) &&
        config.jobs.some((job) => typeof job !== "string" || job.trim().length === 0)) {
        errors.push("jobs must be non-empty strings");
    }
    if (config.signaturePhrases && config.signaturePhrases.length > 3) {
        errors.push("signaturePhrases may not exceed 3 items");
    }
    const optionalStringArrays = [
        [config.signaturePhrases, "signaturePhrases"],
        [config.infoStyles, "infoStyles"],
        [config.boundaries, "boundaries"],
        [config.notes, "notes"],
    ];
    optionalStringArrays.forEach(([value, fieldName]) => {
        if (value === undefined)
            return;
        if (!Array.isArray(value) ||
            value.some((entry) => typeof entry !== "string" || entry.trim().length === 0)) {
            errors.push(`${fieldName} must be an array of strings when provided`);
        }
    });
    if (config.detailLevel !== undefined &&
        (typeof config.detailLevel !== "string" ||
            config.detailLevel.trim().length === 0)) {
        errors.push("detailLevel must be a string when provided");
    }
    if (config.pressureStyle !== undefined &&
        (typeof config.pressureStyle !== "string" ||
            config.pressureStyle.trim().length === 0)) {
        errors.push("pressureStyle must be a string when provided");
    }
    if (errors.length > 0) {
        throw new CompileError("INVALID_SCHEMA", errors.join("; "));
    }
}
