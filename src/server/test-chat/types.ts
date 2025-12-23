import type {
  CompiledModule,
  CompiledPersona,
  PersonaConfig,
} from "../../persona-engine/index.js";

export interface StartRequestBody {
  personaConfig: PersonaConfig;
}

export interface StartResponseBody {
  sessionId: string;
  promptHash: string;
  tokenizerModel: string;
  tokenEstimate: number;
}

export interface MessageRequestBody {
  sessionId: string;
  promptHash: string;
  message: string;
}

export interface LlmUsage {
  promptTokens: number;
  completionTokens: number;
  totalTokens: number;
}

export interface LimitsConfig {
  rateLimitWindowMs: number;
  rateLimitMaxRequests: number;
  cooldownMs: number;
  dailyMessageCap: number;
  tokenCap: number;
  maxMessageChars: number;
  maxHistoryMessages: number;
}

export interface SessionUsage {
  lastMessageAt?: number;
  totalMessages: number;
  totalTokens: number;
  day: string;
  dailyMessages: number;
  dailyTokens: number;
  window: number[];
}

export interface TestChatSession {
  id: string;
  compiledPersona: CompiledPersona;
  systemPrompt: string;
  testChatModule: CompiledModule;
  promptHash: string;
  createdAt: number;
  messages: Array<{ role: "user" | "assistant"; content: string; at: number }>;
  usage: SessionUsage;
}

export interface MessageResponseBody {
  sessionId: string;
  promptHash: string;
  reply: string;
  usage: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
    totalMessages: number;
    totalTokensUsed: number;
    dailyMessages: number;
    dailyTokens: number;
    tokenCap: number;
  };
}
