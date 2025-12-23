import { getDefaultsForVersion } from "../registry/defaultsByVersion";
export function resolveDefaults(config) {
    const defaults = getDefaultsForVersion(config.schemaVersion);
    return {
        ...config,
        pressureStyle: config.pressureStyle ?? defaults.pressureStyle,
        signaturePhrases: [
            ...(config.signaturePhrases ?? defaults.signaturePhrases),
        ],
        infoStyles: [...(config.infoStyles ?? defaults.infoStyles)],
        boundaries: [...(config.boundaries ?? defaults.boundaries)],
        notes: [...(config.notes ?? defaults.notes)],
    };
}
