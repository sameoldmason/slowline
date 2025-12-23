export const CANONICAL_PINNED_LINES = [
    "Tone: {{tone}}",
    "Pace: {{pacing}}",
    "Overall, responses should feel {{tone_description}} and move at a {{pacing_description}} pace.",
];
export const FORMATTING_CONTRACT = {
    newline: "\n", // keeps literal type '\n' happy without magic
    sectionDivider: "\n\n",
    pinnedLines: CANONICAL_PINNED_LINES,
};
