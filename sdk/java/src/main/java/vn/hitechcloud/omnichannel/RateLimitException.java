package vn.hitechcloud.omnichannel;

/** Ngoại lệ RateLimitException. */
public class RateLimitException extends OmnichannelException {
    public RateLimitException(String message, String code, int statusCode, Integer retryAfter) {
        super(message, code, statusCode, retryAfter);
    }
}
