/** Lỗi của HiTechCloud Omnichannel SDK. */

export class OmnichannelError extends Error {
  code?: string;
  statusCode?: number;
  retryAfter?: number | null;

  constructor(
    message: string,
    options: { code?: string; statusCode?: number; retryAfter?: number | null } = {},
  ) {
    super(message);
    this.name = "OmnichannelError";
    this.code = options.code;
    this.statusCode = options.statusCode;
    this.retryAfter = options.retryAfter ?? null;
  }
}

export class AuthenticationError extends OmnichannelError {
  constructor(message: string, opts: any = {}) {
    super(message, opts);
    this.name = "AuthenticationError";
  }
}

export class AuthorizationError extends OmnichannelError {
  constructor(message: string, opts: any = {}) {
    super(message, opts);
    this.name = "AuthorizationError";
  }
}

export class NotFoundError extends OmnichannelError {
  constructor(message: string, opts: any = {}) {
    super(message, opts);
    this.name = "NotFoundError";
  }
}

export class ValidationError extends OmnichannelError {
  constructor(message: string, opts: any = {}) {
    super(message, opts);
    this.name = "ValidationError";
  }
}

export class MessagingWindowClosedError extends OmnichannelError {
  constructor(message: string, opts: any = {}) {
    super(message, opts);
    this.name = "MessagingWindowClosedError";
  }
}

export class ConflictError extends OmnichannelError {
  constructor(message: string, opts: any = {}) {
    super(message, opts);
    this.name = "ConflictError";
  }
}

export class RateLimitError extends OmnichannelError {
  constructor(message: string, opts: any = {}) {
    super(message, opts);
    this.name = "RateLimitError";
  }
}

export class ServerError extends OmnichannelError {
  constructor(message: string, opts: any = {}) {
    super(message, opts);
    this.name = "ServerError";
  }
}

type ErrCtor = new (m: string, o?: any) => OmnichannelError;

const CODE_MAP: Record<string, ErrCtor> = {
  UNAUTHORIZED: AuthenticationError,
  INSUFFICIENT_SCOPE: AuthorizationError,
  CHANNEL_NOT_CONNECTED: AuthorizationError,
  NOT_FOUND: NotFoundError,
  VALIDATION_ERROR: ValidationError,
  MESSAGING_WINDOW_CLOSED: MessagingWindowClosedError,
  DUPLICATE_REQUEST: ConflictError,
  TOO_MANY_REQUESTS: RateLimitError,
  INTERNAL_ERROR: ServerError,
};

const STATUS_MAP: Record<number, ErrCtor> = {
  400: ValidationError,
  401: AuthenticationError,
  403: AuthorizationError,
  404: NotFoundError,
  409: ConflictError,
  422: ValidationError,
  429: RateLimitError,
  500: ServerError,
  503: ServerError,
};

/** Dựng ngoại lệ phù hợp từ Envelope lỗi của API. */
export function errorFromResponse(
  statusCode: number,
  body: any,
  retryAfter?: number | null,
): OmnichannelError {
  let code: string | undefined;
  let message = `HTTP ${statusCode}`;
  if (body && typeof body === "object") {
    code = body.code;
    message = body.message || message;
    if (retryAfter == null && body.retry_after != null) {
      retryAfter = body.retry_after;
    }
  }
  const Ctor = (code && CODE_MAP[code]) || STATUS_MAP[statusCode] || OmnichannelError;
  return new Ctor(message, { code, statusCode, retryAfter });
}
