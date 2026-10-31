package vn.hitechcloud.omnichannel;

/** Ngoại lệ NotFoundException. */
public class NotFoundException extends OmnichannelException {
    public NotFoundException(String message, String code, int statusCode, Integer retryAfter) {
        super(message, code, statusCode, retryAfter);
    }
}
