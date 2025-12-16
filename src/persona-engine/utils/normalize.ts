export function normalizeNewlines(text: string): string {
  // normalize CRLF / CR -> LF
  return text.replace(/\r\n/g, "\n").replace(/\r/g, "\n");
}

export function trimTrailingWhitespace(text: string): string {
  return normalizeNewlines(text)
    .replace(/[ \t]+$/gm, "")
    .trimEnd();
}

export function canonicalizePromptText(text: string): string {
  return trimTrailingWhitespace(text);
}

export function stableStringify(value: unknown): string {
  return JSON.stringify(sortValue(value));
}

function sortValue(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(sortValue);

  if (value && typeof value === "object") {
    const entries = Object.entries(value as Record<string, unknown>).sort(
      ([a], [b]) => a.localeCompare(b)
    );
    const sorted: Record<string, unknown> = {};
    for (const [key, val] of entries) sorted[key] = sortValue(val);
    return sorted;
  }

  return value;
}
