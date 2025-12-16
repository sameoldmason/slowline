import js from "@eslint/js";
import tseslint from "typescript-eslint";
import react from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";

export default [
  // ignore build output + temp test output
  {
    ignores: ["dist/**", ".tmp-tests/**", "node_modules/**"],
  },

  js.configs.recommended,
  ...tseslint.configs.recommended,

  // browser (React app code)
  {
    files: ["src/**/*.{ts,tsx}"],
    languageOptions: {
      globals: {
        window: "readonly",
        document: "readonly",
        navigator: "readonly",
        FormData: "readonly",
        performance: "readonly",
        setTimeout: "readonly",
        clearTimeout: "readonly",
        queueMicrotask: "readonly",
        matchMedia: "readonly",
      },
    },
    plugins: {
      react,
      "react-hooks": reactHooks,
    },
    rules: {
      "react/react-in-jsx-scope": "off",
      "react-hooks/rules-of-hooks": "error",
      "react-hooks/exhaustive-deps": "warn",
      // stop noise for common TS patterns
      "@typescript-eslint/no-unused-expressions": "off",
    },
    settings: {
      react: { version: "detect" },
    },
  },

  // node files
  {
    files: ["vite.config.ts", "tests/**/*.ts", "tests/**/*.mjs"],
    languageOptions: {
      globals: {
        process: "readonly",
        URL: "readonly",
        __dirname: "readonly",
        __filename: "readonly",
      },
    },
    rules: {
      "@typescript-eslint/no-unused-expressions": "off",
    },
  },
];
