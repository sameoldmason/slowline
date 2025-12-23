import type { IncomingMessage, ServerResponse } from "node:http";
import { compilePersona } from "../../persona-engine/compiler/compilePersona.js";
import { buildTestChatSystemPrompt } from "../../persona-engine/test-chat/index.js";
import { loadLlmConfig, runTestChatCompletion } from "./llmClient.js";
import { loadLimitsConfig } from "./limits.js";
import { applyUsage, checkPreflightLimits } from "./rateLimit.js";
import {
  PromptParityError,
  assertPromptHashMatch,
  assertSystemPromptParity,
} from "./promptParity.js";
import { createSession, getSession } from "./sessionStore.js";
import type {
  MessageRequestBody,
  MessageResponseBody,
  StartRequestBody,
  StartResponseBody,
} from "./types.js";

type NextHandler = (err?: unknown) => void;

class HttpError extends Error {
  readonly status: number;

  constructor(status: number, message: string) {
    super(message);
    this.status = status;
    this.name = "HttpError";
  }
}

async function readJsonBody<T>(req: IncomingMessage): Promise<T> {
  const chunks: Buffer[] = [];

  for await (const chunk of req) {
    chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
  }

  const raw = Buffer.concat(chunks).toString("utf8");

  if (!raw) {
    throw new HttpError(400, "Request body is required");
  }

  try {
    return JSON.parse(raw) as T;
  } catch {
    throw new HttpError(400, "Invalid JSON body");
  }
}

function sendJson(res: ServerResponse, status: number, payload: unknown): void {
  res.statusCode = status;
  res.setHeader("Content-Type", "application/json");
  res.end(JSON.stringify(payload));
}

function validateStartBody(body: StartRequestBody): void {
  if (!body || typeof body !== "object") {
    throw new HttpError(400, "personaConfig is required");
  }

  if (!("personaConfig" in body)) {
    throw new HttpError(400, "personaConfig is required");
  }

  const keys = Object.keys(body);
  if (keys.length !== 1 || !keys.includes("personaConfig")) {
    throw new HttpError(400, "Unexpected request fields");
  }
}

function validateMessageBody(body: MessageRequestBody): void {
  if (!body || typeof body !== "object") {
    throw new HttpError(400, "sessionId, promptHash, and message are required");
  }

  if (!("promptHash" in body)) {
    throw new HttpError(403, "promptHash is required");
  }

  if (!("sessionId" in body) || !("message" in body)) {
    throw new HttpError(400, "sessionId, promptHash, and message are required");
  }

  const keys = Object.keys(body);
  const expectedKeys = ["sessionId", "promptHash", "message"];
  if (
    keys.length !== expectedKeys.length ||
    !expectedKeys.every((key) => keys.includes(key))
  ) {
    throw new HttpError(400, "Unexpected request fields");
  }

  if (typeof body.promptHash !== "string" || body.promptHash.length === 0) {
    throw new HttpError(403, "promptHash is required");
  }

  if (typeof body.sessionId !== "string" || typeof body.message !== "string") {
    throw new HttpError(400, "sessionId, promptHash, and message are required");
  }
}

async function handleStart(body: StartRequestBody): Promise<StartResponseBody> {
  validateStartBody(body);

  // Ensure required configuration is present before creating a session.
  loadLimitsConfig();
  loadLlmConfig();

  const { compiled } = compilePersona(body.personaConfig);
  const { systemPrompt, testChatModule } = buildTestChatSystemPrompt(compiled);
  const session = createSession({
    compiledPersona: compiled,
    systemPrompt,
    testChatModule,
    promptHash: compiled.promptHash,
  });

  return {
    sessionId: session.id,
    promptHash: session.promptHash,
    tokenizerModel: compiled.tokenizerModel,
    tokenEstimate: compiled.tokenEstimate,
  };
}

async function handleMessage(
  body: MessageRequestBody
): Promise<MessageResponseBody> {
  validateMessageBody(body);

  const limits = loadLimitsConfig();
  const llmConfig = loadLlmConfig();
  const session = getSession(body.sessionId);

  if (!session) {
    throw new HttpError(404, "Session not found");
  }

  try {
    assertPromptHashMatch(session, body.promptHash);
    assertSystemPromptParity(session);
  } catch (error) {
    if (error instanceof PromptParityError) {
      if (error.code === "PROMPT_HASH_REQUIRED") {
        throw new HttpError(403, "promptHash is required");
      }
      if (error.code === "PROMPT_HASH_MISMATCH") {
        throw new HttpError(409, "promptHash mismatch");
      }
      if (error.code === "SYSTEM_PROMPT_DRIFT") {
        throw new HttpError(409, "System prompt mismatch");
      }
    }
    throw error;
  }

  const now = Date.now();
  const preflight = checkPreflightLimits(session, limits, now);

  if (!preflight.ok) {
    throw new HttpError(429, preflight.message ?? "Rate limit exceeded");
  }

  if (body.message.length > limits.maxMessageChars) {
    throw new HttpError(413, "Message too long");
  }

  const proposedMessages = session.messages.slice();
  proposedMessages.push({ role: "user", content: body.message, at: now });
  trimHistory({ messages: proposedMessages }, limits.maxHistoryMessages);

  const { content, usage } = await runTestChatCompletion(
    llmConfig,
    session.systemPrompt,
    proposedMessages.map((message) => ({
      role: message.role,
      content: message.content,
    }))
  );

  const nextMessages = proposedMessages.slice();
  nextMessages.push({ role: "assistant", content, at: Date.now() });
  trimHistory({ messages: nextMessages }, limits.maxHistoryMessages);

  const applied = applyUsage(session, limits, usage, now);

  if (!applied.ok) {
    throw new HttpError(429, applied.message ?? "Limit exceeded");
  }

  session.messages = nextMessages;

  return {
    sessionId: session.id,
    promptHash: session.promptHash,
    reply: content,
    usage: {
      promptTokens: usage.promptTokens,
      completionTokens: usage.completionTokens,
      totalTokens: usage.totalTokens,
      totalMessages: session.usage.totalMessages,
      totalTokensUsed: session.usage.totalTokens,
      dailyMessages: session.usage.dailyMessages,
      dailyTokens: session.usage.dailyTokens,
      tokenCap: limits.tokenCap,
    },
  };
}

function handleError(res: ServerResponse, error: unknown): void {
  if (error instanceof HttpError) {
    sendJson(res, error.status, { error: error.message });
    return;
  }

  const message =
    error instanceof Error ? error.message : "Unexpected server error";
  sendJson(res, 500, { error: message });
}

function normalizePath(url: string | undefined): string | null {
  if (!url) return null;
  try {
    return new URL(url, "http://localhost").pathname;
  } catch {
    return null;
  }
}

export function createTestChatMiddleware(): (
  req: IncomingMessage,
  res: ServerResponse,
  next: NextHandler
) => void {
  return (req, res, next) => {
    const pathname = normalizePath(req.url);

    if (!pathname || !pathname.startsWith("/api/test-chat/")) {
      next();
      return;
    }

    if (req.method !== "POST") {
      sendJson(res, 405, { error: "Method not allowed" });
      return;
    }

    if (pathname === "/api/test-chat/start") {
      readJsonBody<StartRequestBody>(req)
        .then(handleStart)
        .then((payload) => sendJson(res, 200, payload))
        .catch((error) => handleError(res, error));
      return;
    }

    if (pathname === "/api/test-chat/message") {
      readJsonBody<MessageRequestBody>(req)
        .then(handleMessage)
        .then((payload) => sendJson(res, 200, payload))
        .catch((error) => handleError(res, error));
      return;
    }

    sendJson(res, 404, { error: "Not found" });
  };
}

function trimHistory(
  session: { messages: Array<{ role: "user" | "assistant" }> },
  maxMessages: number
): void {
  if (session.messages.length > maxMessages) {
    session.messages.splice(0, session.messages.length - maxMessages);
  }
}
