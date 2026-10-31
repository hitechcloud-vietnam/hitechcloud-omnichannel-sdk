# Xử lý lỗi

Khi một yêu cầu không thành công, API trả về Envelope lỗi:

```json
{ "status": "error", "code": "MESSAGING_WINDOW_CLOSED", "message": "..." }
```

Hãy xử lý logic theo `code` (ổn định) thay vì `message` (có thể đổi). SDK tự chuyển mỗi `code`/HTTP status thành một lớp ngoại lệ.

## Mã HTTP

| HTTP | Ý nghĩa |
|---|---|
| 200 / 201 | Thành công / Tạo mới |
| 400 | Tham số không hợp lệ |
| 401 | Thiếu hoặc sai Access Token |
| 403 | Thiếu scope hoặc không có quyền với kênh |
| 404 | Không tìm thấy tài nguyên |
| 409 | Xung đột (trùng `idempotency_key`) |
| 422 | Không qua kiểm tra nghiệp vụ |
| 429 | Vượt giới hạn tần suất |
| 5xx | Lỗi máy chủ |

## Mã lỗi chuỗi → lớp ngoại lệ

| `code` | HTTP | Python | Node / Java |
|---|---|---|---|
| `UNAUTHORIZED` | 401 | `AuthenticationError` | `AuthenticationError` / `AuthenticationException` |
| `INSUFFICIENT_SCOPE` | 403 | `AuthorizationError` | `AuthorizationError` / `AuthorizationException` |
| `CHANNEL_NOT_CONNECTED` | 403 | `AuthorizationError` | nt |
| `NOT_FOUND` | 404 | `NotFoundError` | `NotFoundError` / `NotFoundException` |
| `VALIDATION_ERROR` | 400/422 | `ValidationError` | nt |
| `MESSAGING_WINDOW_CLOSED` | 422 | `MessagingWindowClosedError` | nt |
| `DUPLICATE_REQUEST` | 409 | `ConflictError` | `ConflictError` / `ConflictException` |
| `TOO_MANY_REQUESTS` | 429 | `RateLimitError` | nt |
| `INTERNAL_ERROR` | 500 | `ServerError` | nt |

Tất cả kế thừa từ `OmnichannelError` (Python/Node) / `OmnichannelException` (PHP/Java). Go dùng một kiểu `*APIError` với `Kind()`.

## Ví dụ

### Python
```python
from hitechcloud_omnichannel import MessagingWindowClosedError, RateLimitError, OmnichannelError
import time

try:
    omni.messages.send_text("cnv_01HZABCDEF", "...")
except MessagingWindowClosedError:
    pass  # ngoài cửa sổ 24h -> dùng template
except RateLimitError as e:
    time.sleep(e.retry_after or 5)
except OmnichannelError as e:
    print(e.code, e.message)
```

### Go
```go
_, err := c.Messages.SendText("cnv_01HZABCDEF", "...", "")
if apiErr, ok := err.(*omnichannel.APIError); ok {
    switch apiErr.Kind() {
    case omnichannel.KindMessagingWindow: /* dùng template */
    case omnichannel.KindRateLimit:       time.Sleep(time.Duration(apiErr.RetryAfter) * time.Second)
    }
}
```

## Thử lại (retry)

SDK tự thử lại với backoff tăng dần khi gặp `429` (tôn trọng `Retry-After`) và `5xx`. Với `400/401/403/404/422`, việc thử lại thường vô ích — cần sửa request.
