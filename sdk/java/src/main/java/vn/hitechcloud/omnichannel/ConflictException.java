package vn.hitechcloud.omnichannel;

/** Ngoại lệ ConflictException. */
public class ConflictException extends OmnichannelException {
    public ConflictException(String message, String code, int statusCode, Integer retryAfter) {
        super(message, code, statusCode, retryAfter);
    }
}
