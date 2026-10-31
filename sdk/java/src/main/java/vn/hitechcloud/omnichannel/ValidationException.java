package vn.hitechcloud.omnichannel;

/** Ngoại lệ ValidationException. */
public class ValidationException extends OmnichannelException {
    public ValidationException(String message, String code, int statusCode, Integer retryAfter) {
        super(message, code, statusCode, retryAfter);
    }
}
