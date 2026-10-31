/** Xác minh chữ ký webhook (HMAC-SHA256, header X-HTC-Signature). */

import * as crypto from "crypto";

export const SIGNATURE_HEADER = "X-HTC-Signature";

export class WebhookSignatureError extends Error {
  constructor(message = "Chữ ký X-HTC-Signature không hợp lệ") {
    super(message);
    this.name = "WebhookSignatureError";
  }
}

/** Tính HMAC-SHA256 hex của thân request thô. */
export function computeSignature(rawBody: string | Buffer, signingSecret: string): string {
  return crypto.createHmac("sha256", signingSecret).update(rawBody).digest("hex");
}

/**
 * Trả về true nếu chữ ký khớp. So sánh theo thời gian hằng số.
 * `signature` có thể ở dạng "sha256=<hex>" hoặc "<hex>".
 */
export function verifySignature(
  rawBody: string | Buffer,
  signature: string | null | undefined,
  signingSecret: string,
): boolean {
  if (!signature) return false;
  let sig = signature.trim();
  if (sig.startsWith("sha256=")) sig = sig.slice("sha256=".length);
  const expected = computeSignature(rawBody, signingSecret);
  const a = Buffer.from(expected, "utf8");
  const b = Buffer.from(sig, "utf8");
  if (a.length !== b.length) return false;
  return crypto.timingSafeEqual(a, b);
}

/** Như verifySignature nhưng ném lỗi khi không khớp. */
export function verifyOrThrow(
  rawBody: string | Buffer,
  signature: string | null | undefined,
  signingSecret: string,
): true {
  if (!verifySignature(rawBody, signature, signingSecret)) {
    throw new WebhookSignatureError();
  }
  return true;
}
