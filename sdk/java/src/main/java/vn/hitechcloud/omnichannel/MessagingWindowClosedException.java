package vn.hitechcloud.omnichannel;

/** Ngoại lệ MessagingWindowClosedException. */
public class MessagingWindowClosedException extends OmnichannelException {
    public MessagingWindowClosedException(String message, String code, int statusCode, Integer retryAfter) {
        super(message, code, statusCode, retryAfter);
    }
}
