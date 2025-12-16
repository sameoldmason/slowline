import type { LlmUsage } from "./types.js";

export interface LlmConfig {
  endpoint: string;
  apiKey: string;
  model: string;
}

const REQUIRED_LLM_ENV = {
  endpoint: "TEST_CHAT_LLM_ENDPOINT",
  apiKey: "TEST_CHAT_LLM_API_KEY",
  model: "TEST_CHAT_LLM_MODEL",
} as const;

function readEnvVar(name: string, env: NodeJS.ProcessEnv): string {
  const value = env[name];
  if (!value) {
    throw new Error(`Missing required env var ${name} for LLM client`);
  }
  return value;
}

export function loadLlmConfig(env: NodeJS.ProcessEnv = process.env): LlmConfig {
  return {
    endpoint: readEnvVar(REQUIRED_LLM_ENV.endpoint, env),
    apiKey: readEnvVar(REQUIRED_LLM_ENV.apiKey, env),
    model: readEnvVar(REQUIRED_LLM_ENV.model, env),
  };
}

interface OpenAIChatResponse {
  choices?: Array<{
    message?: { content?: string };
  }>;
  usage?: {
    prompt_tokens?: number;
    completion_tokens?: number;
    total_tokens?: number;
  };
}

export async function runTestChatCompletion(
  config: LlmConfig,
  systemPrompt: string,
  userMessage: string
): Promise<{ content: string; usage: LlmUsage }> {
  const response = await fetch(config.endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${config.apiKey}`,
    },
    body: JSON.stringify({
      model: config.model,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userMessage },
      ],
    }),
  });

  if (!response.ok) {
    throw new Error(`LLM request failed with status ${response.status}`);
  }

  const payload = (await response.json()) as OpenAIChatResponse;
  const content = payload.choices?.[0]?.message?.content;
  const usage = payload.usage;

  if (!content) {
    throw new Error("LLM response missing assistant content");
  }

  if (
    !usage ||
    typeof usage.prompt_tokens !== "number" ||
    (usage.completion_tokens !== undefined &&
      typeof usage.completion_tokens !== "number")
  ) {
    throw new Error("LLM response missing token usage for enforcement");
  }

  const completionTokens = usage.completion_tokens ?? 0;
  const totalTokens =
    typeof usage.total_tokens === "number"
      ? usage.total_tokens
      : usage.prompt_tokens + completionTokens;

  return {
    content,
    usage: {
      promptTokens: usage.prompt_tokens,
      completionTokens,
      totalTokens,
    },
  };
}

export const REQUIRED_LLM_ENV_VARS = Object.values(REQUIRED_LLM_ENV);
