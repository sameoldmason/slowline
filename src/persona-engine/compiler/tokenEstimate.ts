import { TOKENIZER_MODEL_V1 } from '../registry/tokenizerModel';
import { canonicalizePromptText } from '../utils/normalize';

export interface TokenEstimate {
  tokenEstimate: number;
  tokenizerModel: string;
}

export function estimateTokens(prompt: string): TokenEstimate {
  const normalized = canonicalizePromptText(prompt);
  const tokenEstimate = Math.max(0, Math.ceil(normalized.length / 4));

  return {
    tokenEstimate,
    tokenizerModel: TOKENIZER_MODEL_V1,
  };
}
