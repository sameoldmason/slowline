export const DEFAULT_PRESSURE_STYLE = "gentle_nudge";
export const DEFAULT_SIGNATURE_PHRASES = [];
export const DEFAULT_INFO_STYLES = [];
export const DEFAULT_BOUNDARIES = [];
export const DEFAULT_NOTES = [];
export const DEFAULTS_V1 = {
    pressureStyle: DEFAULT_PRESSURE_STYLE,
    signaturePhrases: DEFAULT_SIGNATURE_PHRASES,
    infoStyles: DEFAULT_INFO_STYLES,
    boundaries: DEFAULT_BOUNDARIES,
    notes: DEFAULT_NOTES,
};
export const DEFAULT_SNAPSHOT_BY_VERSION = {
    v1: DEFAULTS_V1,
};
export function getDefaultsForVersion(version) {
    return DEFAULT_SNAPSHOT_BY_VERSION[version];
}
