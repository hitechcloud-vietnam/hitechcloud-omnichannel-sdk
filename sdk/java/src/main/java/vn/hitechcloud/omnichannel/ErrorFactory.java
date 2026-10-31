package vn.hitechcloud.omnichannel;

import java.util.Map;

/** Dựng ngoại lệ phù hợp từ Envelope lỗi của API. */
final class ErrorFactory {
    private ErrorFactory() {}

    static OmnichannelException make(int statusCode, Map<String, Object> body, Integer retryAfter) {
        String code = null;
        String message = "HTTP " + statusCode;
        if (body != null) {
            if (body.get("code") != null) code = body.get("code").toString();
            if (body.get("message") != null) message = body.get("message").toString();
            if (retryAfter == null && body.get("retry_after") != null) {
                retryAfter = (int) Double.parseDouble(body.get("retry_after").toString());
            }
        }

        if (code != null) {
            switch (code) {
                case "UNAUTHORIZED":
                    return new AuthenticationException(message, code, statusCode, retryAfter);
                case "INSUFFICIENT_SCOPE":
                case "CHANNEL_NOT_CONNECTED":
                    return new AuthorizationException(message, code, statusCode, retryAfter);
                case "NOT_FOUND":
                    return new NotFoundException(message, code, statusCode, retryAfter);
                case "VALIDATION_ERROR":
                    return new ValidationException(message, code, statusCode, retryAfter);
                case "MESSAGING_WINDOW_CLOSED":
                    return new MessagingWindowClosedException(message, code, statusCode, retryAfter);
                case "DUPLICATE_REQUEST":
                    return new ConflictException(message, code, statusCode, retryAfter);
                case "TOO_MANY_REQUESTS":
                    return new RateLimitException(message, code, statusCode, retryAfter);
                case "INTERNAL_ERROR":
                    return new ServerException(message, code, statusCode, retryAfter);
                default:
                    break;
            }
        }

        switch (statusCode) {
            case 401:
                return new AuthenticationException(message, code, statusCode, retryAfter);
            case 403:
                return new AuthorizationException(message, code, statusCode, retryAfter);
            case 404:
                return new NotFoundException(message, code, statusCode, retryAfter);
            case 400:
            case 422:
                return new ValidationException(message, code, statusCode, retryAfter);
            case 409:
                return new ConflictException(message, code, statusCode, retryAfter);
            case 429:
                return new RateLimitException(message, code, statusCode, retryAfter);
            default:
                if (statusCode >= 500) {
                    return new ServerException(message, code, statusCode, retryAfter);
                }
                return new OmnichannelException(message, code, statusCode, retryAfter);
        }
    }
}
