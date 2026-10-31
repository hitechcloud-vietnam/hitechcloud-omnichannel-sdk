package vn.hitechcloud.omnichannel;

/** Ngoại lệ AuthenticationException. */
public class AuthenticationException extends OmnichannelException {
    public AuthenticationException(String message, String code, int statusCode, Integer retryAfter) {
        super(message, code, statusCode, retryAfter);
    }
}
