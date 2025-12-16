import { normalizeNewlines as normalizeNewlinesFromContract } from '../registry/formattingContract';

export function normalizeNewlines(text: string): string {
  return normalizeNewlinesFromContract(text);
}

export function trimTrailingWhitespace(text: string): string {
  return normalizeNewlines(text).replace(/[ \t]+$/gm, '').trimEnd();
}

export function canonicalizePromptText(text: string): string {
  return trimTrailingWhitespace(normalizeNewlines(text));
}

export function stableStringify(value: unknown): string {
  return JSON.stringify(sortValue(value));
}

function sortValue(value: unknown): unknown {
  if (Array.isArray(value)) {
    return value.map(sortValue);
  }

  if (value && typeof value === 'object') {
    const entries = Object.entries(value as Record<string, unknown>).sort(([a], [b]) =>
      a.localeCompare(b),
    );
    const sorted: Record<string, unknown> = {};
    entries.forEach(([key, val]) => {
      sorted[key] = sortValue(val);
    });
    return sorted;
  }

  return value;
}
