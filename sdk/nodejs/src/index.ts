export { Omnichannel, PRODUCTION_URL, SANDBOX_URL } from "./client";
export type { OmnichannelOptions } from "./client";
export type { Envelope } from "./httpClient";
export {
  verifySignature,
  verifyOrThrow,
  computeSignature,
  WebhookSignatureError,
  SIGNATURE_HEADER,
} from "./webhook";
export {
  OmnichannelError,
  AuthenticationError,
  AuthorizationError,
  NotFoundError,
  ValidationError,
  MessagingWindowClosedError,
  ConflictError,
  RateLimitError,
  ServerError,
} from "./errors";
export type { SendMessageBody, MessageType } from "./resources/conversations";

import { Omnichannel } from "./client";
export default Omnichannel;
