package vn.hitechcloud.omnichannel;

/** Ngoại lệ AuthorizationException. */
public class AuthorizationException extends OmnichannelException {
    public AuthorizationException(String message, String code, int statusCode, Integer retryAfter) {
        super(message, code, statusCode, retryAfter);
    }
}
