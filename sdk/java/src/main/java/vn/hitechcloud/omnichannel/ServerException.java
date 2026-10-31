package vn.hitechcloud.omnichannel;

/** Ngoại lệ ServerException. */
public class ServerException extends OmnichannelException {
    public ServerException(String message, String code, int statusCode, Integer retryAfter) {
        super(message, code, statusCode, retryAfter);
    }
}
