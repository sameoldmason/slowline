export function derivePersonaFields(resolved) {
    const primaryJob = resolved.jobs.length > 0 ? resolved.jobs[0] : null;
    return {
        primaryJob,
        toneDescription: resolved.tone,
        pacingDescription: resolved.pacing,
    };
}
