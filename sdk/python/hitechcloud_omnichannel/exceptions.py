"""Ngoại lệ của HiTechCloud Omnichannel SDK"""


class OmnichannelError(Exception):
    """Ngoại lệ cơ sở cho Omnichannel SDK.

    Phản hồi lỗi của API theo cấu trúc Envelope:
        {"status": "error", "code": "...", "message": "..."}
    """

    def __init__(self, message, code=None, status_code=None, retry_after=None):
        self.message = message
        self.code = code
        self.status_code = status_code
        self.retry_after = retry_after
        super().__init__(self.message)

    def __str__(self):
        if self.code:
            return "[%s] %s" % (self.code, self.message)
        return self.message


class AuthenticationError(OmnichannelError):
    """401 UNAUTHORIZED — token không hợp lệ hoặc đã hết hạn."""


class AuthorizationError(OmnichannelError):
    """403 — INSUFFICIENT_SCOPE hoặc CHANNEL_NOT_CONNECTED."""


class NotFoundError(OmnichannelError):
    """404 NOT_FOUND — không tìm thấy tài nguyên."""


class ValidationError(OmnichannelError):
    """400/422 VALIDATION_ERROR — tham số hoặc payload sai định dạng."""


class MessagingWindowClosedError(OmnichannelError):
    """422 MESSAGING_WINDOW_CLOSED — ngoài cửa sổ nhắn tin cho phép."""


class ConflictError(OmnichannelError):
    """409 DUPLICATE_REQUEST — trùng idempotency_key."""


class RateLimitError(OmnichannelError):
    """429 TOO_MANY_REQUESTS — vượt giới hạn tần suất."""


class ServerError(OmnichannelError):
    """5xx INTERNAL_ERROR — lỗi phía máy chủ."""


# Ánh xạ theo trường `code` ổn định của Envelope lỗi.
CODE_MAP = {
    "UNAUTHORIZED": AuthenticationError,
    "INSUFFICIENT_SCOPE": AuthorizationError,
    "CHANNEL_NOT_CONNECTED": AuthorizationError,
    "NOT_FOUND": NotFoundError,
    "VALIDATION_ERROR": ValidationError,
    "MESSAGING_WINDOW_CLOSED": MessagingWindowClosedError,
    "DUPLICATE_REQUEST": ConflictError,
    "TOO_MANY_REQUESTS": RateLimitError,
    "INTERNAL_ERROR": ServerError,
}

# Ánh xạ dự phòng theo mã HTTP khi không có `code`.
STATUS_MAP = {
    400: ValidationError,
    401: AuthenticationError,
    403: AuthorizationError,
    404: NotFoundError,
    409: ConflictError,
    422: ValidationError,
    429: RateLimitError,
    500: ServerError,
    503: ServerError,
}


def error_from_response(status_code, body, retry_after=None):
    """Chọn lớp ngoại lệ phù hợp từ Envelope lỗi."""
    code = None
    message = "HTTP %s" % status_code
    if isinstance(body, dict):
        code = body.get("code")
        message = body.get("message") or message
        if retry_after is None:
            retry_after = body.get("retry_after")
    cls = CODE_MAP.get(code) or STATUS_MAP.get(status_code, OmnichannelError)
    return cls(message, code=code, status_code=status_code, retry_after=retry_after)
