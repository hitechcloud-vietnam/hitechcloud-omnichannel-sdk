package vn.hitechcloud.omnichannel;

/** Ngoại lệ cơ sở cho Omnichannel SDK (từ Envelope lỗi của API). */
public class OmnichannelException extends RuntimeException {
    private final String code;
    private final int statusCode;
    private final Integer retryAfter;

    public OmnichannelException(String message, String code, int statusCode, Integer retryAfter) {
        super(message);
        this.code = code;
        this.statusCode = statusCode;
        this.retryAfter = retryAfter;
    }

    public OmnichannelException(String message) {
        this(message, null, 0, null);
    }

    /** Mã lỗi chuỗi ổn định (ví dụ MESSAGING_WINDOW_CLOSED). */
    public String getCode() {
        return code;
    }

    public int getStatusCode() {
        return statusCode;
    }

    /** Số giây cần đợi khi bị rate limit (có thể null). */
    public Integer getRetryAfter() {
        return retryAfter;
    }
}
