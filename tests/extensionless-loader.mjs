import { accessSync, constants } from "node:fs";
import { extname } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

export async function resolve(specifier, context, next) {
  const parentURL = context.parentURL ?? pathToFileURL(`${process.cwd()}/`).href;

  if (specifier.startsWith(".") || specifier.startsWith("/")) {
    const candidateUrl = new URL(specifier, parentURL);
    const candidatePath = fileURLToPath(candidateUrl);
    const hasExtension = extname(candidatePath).length > 0;

    if (!hasExtension) {
      const withJs = candidatePath.endsWith("/")
        ? `${candidatePath}index.js`
        : `${candidatePath}.js`;

      try {
        accessSync(withJs, constants.F_OK);
        return { url: pathToFileURL(withJs).href, shortCircuit: true };
      } catch {
        // fall through to default resolver
      }
    }
  }

  return next(specifier, context);
}
