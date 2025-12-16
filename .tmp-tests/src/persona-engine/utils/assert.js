import { MODULE_REGISTRY } from "../registry/moduleRegistry";
import { CompileError } from "./errors";
export function assertPinnedLines(prompt, pinnedLines) {
    const missing = pinnedLines.filter((line) => !prompt.includes(line));
    if (missing.length > 0) {
        throw new CompileError("MISSING_PINNED_LINES", `Pinned lines missing: ${missing.join("; ")}`);
    }
}
export function assertNoPlaceholders(prompt, context) {
    const placeholderPattern = /{{[^}]+}}/;
    if (placeholderPattern.test(prompt)) {
        throw new CompileError("PLACEHOLDERS_REMAIN", `Placeholders found in ${context} output; compilation must resolve all placeholders.`);
    }
}
export function assertRegistryMatches(modules) {
    const registry = MODULE_REGISTRY.filter((module) => module.kind !== "test_chat");
    const orderById = registry.reduce((acc, module) => {
        acc[module.id] = module.order;
        return acc;
    }, {});
    const seen = new Set();
    let lastOrder = 0;
    modules.forEach((module) => {
        const order = orderById[module.id];
        if (!order) {
            throw new CompileError("REGISTRY_MISMATCH", `Unknown module id "${module.id}"`);
        }
        if (seen.has(module.id)) {
            throw new CompileError("REGISTRY_MISMATCH", `Duplicate module id "${module.id}"`);
        }
        if (order < lastOrder) {
            throw new CompileError("REGISTRY_MISMATCH", "Modules are out of registry order");
        }
        seen.add(module.id);
        lastOrder = order;
    });
    const missingCore = registry
        .filter((module) => module.kind === "core")
        .map((module) => module.id)
        .filter((id) => !seen.has(id));
    if (missingCore.length > 0) {
        throw new CompileError("REGISTRY_MISMATCH", `Missing required core modules: ${missingCore.join(", ")}`);
    }
}
