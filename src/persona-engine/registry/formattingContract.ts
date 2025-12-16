export const CANONICAL_PINNED_LINES = [
  "Tone: {{tone}}",
  "Pace: {{pacing}}",
  "Overall, responses should feel {{tone_description}} and move at a {{pacing_description}} pace.",
] as const;

export type CanonicalPinnedLine = (typeof CANONICAL_PINNED_LINES)[number];

export interface FormattingContract {
  newline: "\n";
  sectionDivider: "\n\n";
  pinnedLines: readonly CanonicalPinnedLine[];
}

export const FORMATTING_CONTRACT: FormattingContract = {
  newline: "\n" as const, // keeps literal type '\n' happy without magic
  sectionDivider: "\n\n",
  pinnedLines: CANONICAL_PINNED_LINES,
};
