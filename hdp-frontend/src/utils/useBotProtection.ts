import { useRef } from 'react';

// Name of the hidden honeypot field. Kept generic/innocuous so bots that
// auto-fill "every" field are more likely to trip it.
export const HONEYPOT_FIELD_NAME = 'company';

// Minimum time (ms) a human needs to fill out the form. Submissions faster
// than this are almost certainly scripted.
export const MIN_SUBMIT_MS = 3000;

interface BotProtectionPayload {
  [HONEYPOT_FIELD_NAME]: string;
  formLoadedAt: number;
}

/**
 * Tracks when a form was mounted and provides a honeypot field + helpers
 * to detect bot submissions before hitting the network.
 */
export const useBotProtection = () => {
  const mountedAt = useRef(Date.now());
  const honeypotRef = useRef<HTMLInputElement>(null);

  /** Returns true if the submission looks automated (honeypot filled or too fast). */
  const isLikelyBot = () => {
    const honeypotValue = honeypotRef.current?.value ?? '';
    const elapsed = Date.now() - mountedAt.current;
    return honeypotValue.trim().length > 0 || elapsed < MIN_SUBMIT_MS;
  };

  /** Extra fields to merge into the request body for server-side verification. */
  const getPayload = (): BotProtectionPayload => ({
    [HONEYPOT_FIELD_NAME]: honeypotRef.current?.value ?? '',
    formLoadedAt: mountedAt.current,
  });

  return { honeypotRef, isLikelyBot, getPayload };
};
