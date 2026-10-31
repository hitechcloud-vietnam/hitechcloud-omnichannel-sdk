package omnichannel

import "fmt"

// APIError là lỗi trả về từ Omnichannel API (Envelope lỗi).
type APIError struct {
	StatusCode int
	Code       string // mã lỗi chuỗi ổn định, ví dụ MESSAGING_WINDOW_CLOSED
	Message    string
	RetryAfter int // số giây (0 nếu không có)
}

func (e *APIError) Error() string {
	if e.Code != "" {
		return fmt.Sprintf("omnichannel: [%s] %s (HTTP %d)", e.Code, e.Message, e.StatusCode)
	}
	return fmt.Sprintf("omnichannel: %s (HTTP %d)", e.Message, e.StatusCode)
}

// Kind phân loại lỗi để so khớp không cần type assertion phức tạp.
type Kind string

const (
	KindUnknown              Kind = "unknown"
	KindAuthentication       Kind = "authentication"
	KindAuthorization        Kind = "authorization"
	KindNotFound             Kind = "not_found"
	KindValidation           Kind = "validation"
	KindMessagingWindow      Kind = "messaging_window_closed"
	KindConflict             Kind = "conflict"
	KindRateLimit            Kind = "rate_limit"
	KindServer               Kind = "server"
)

// Kind suy ra loại lỗi từ code hoặc HTTP status.
func (e *APIError) Kind() Kind {
	switch e.Code {
	case "UNAUTHORIZED":
		return KindAuthentication
	case "INSUFFICIENT_SCOPE", "CHANNEL_NOT_CONNECTED":
		return KindAuthorization
	case "NOT_FOUND":
		return KindNotFound
	case "VALIDATION_ERROR":
		return KindValidation
	case "MESSAGING_WINDOW_CLOSED":
		return KindMessagingWindow
	case "DUPLICATE_REQUEST":
		return KindConflict
	case "TOO_MANY_REQUESTS":
		return KindRateLimit
	case "INTERNAL_ERROR":
		return KindServer
	}
	switch {
	case e.StatusCode == 401:
		return KindAuthentication
	case e.StatusCode == 403:
		return KindAuthorization
	case e.StatusCode == 404:
		return KindNotFound
	case e.StatusCode == 400, e.StatusCode == 422:
		return KindValidation
	case e.StatusCode == 409:
		return KindConflict
	case e.StatusCode == 429:
		return KindRateLimit
	case e.StatusCode >= 500:
		return KindServer
	}
	return KindUnknown
}

func newAPIError(statusCode int, code, message string, retryAfter int) *APIError {
	if message == "" {
		message = fmt.Sprintf("HTTP %d", statusCode)
	}
	return &APIError{StatusCode: statusCode, Code: code, Message: message, RetryAfter: retryAfter}
}
