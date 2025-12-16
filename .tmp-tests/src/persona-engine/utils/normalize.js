export function normalizeNewlines(text) {
    // normalize CRLF / CR -> LF
    return text.replace(/\r\n/g, "\n").replace(/\r/g, "\n");
}
export function trimTrailingWhitespace(text) {
    return normalizeNewlines(text)
        .replace(/[ \t]+$/gm, "")
        .trimEnd();
}
export function canonicalizePromptText(text) {
    return trimTrailingWhitespace(text);
}
export function stableStringify(value) {
    return JSON.stringify(sortValue(value));
}
function sortValue(value) {
    if (Array.isArray(value))
        return value.map(sortValue);
    if (value && typeof value === "object") {
        const entries = Object.entries(value).sort(([a], [b]) => a.localeCompare(b));
        const sorted = {};
        for (const [key, val] of entries)
            sorted[key] = sortValue(val);
        return sorted;
    }
    return value;
}
