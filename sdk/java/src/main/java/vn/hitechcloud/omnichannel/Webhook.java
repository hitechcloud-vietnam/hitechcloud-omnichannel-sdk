package vn.hitechcloud.omnichannel;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;

/** Xác minh chữ ký webhook (HMAC-SHA256, header X-HTC-Signature). */
public final class Webhook {
    public static final String SIGNATURE_HEADER = "X-HTC-Signature";

    private Webhook() {}

    /** Tính HMAC-SHA256 hex của thân request thô. */
    public static String computeSignature(String rawBody, String signingSecret) {
        try {
            Mac mac = Mac.getInstance("HmacSHA256");
            mac.init(new SecretKeySpec(signingSecret.getBytes(StandardCharsets.UTF_8), "HmacSHA256"));
            byte[] digest = mac.doFinal(rawBody.getBytes(StandardCharsets.UTF_8));
            StringBuilder sb = new StringBuilder(digest.length * 2);
            for (byte b : digest) {
                sb.append(Character.forDigit((b >> 4) & 0xF, 16));
                sb.append(Character.forDigit(b & 0xF, 16));
            }
            return sb.toString();
        } catch (Exception e) {
            throw new OmnichannelException("Không tính được chữ ký: " + e.getMessage());
        }
    }

    /**
     * Trả về true nếu chữ ký khớp (so sánh hằng số thời gian).
     * signature có thể ở dạng "sha256=&lt;hex&gt;" hoặc "&lt;hex&gt;".
     */
    public static boolean verifySignature(String rawBody, String signature, String signingSecret) {
        if (signature == null || signature.isEmpty()) {
            return false;
        }
        signature = signature.trim();
        if (signature.startsWith("sha256=")) {
            signature = signature.substring("sha256=".length());
        }
        String expected = computeSignature(rawBody, signingSecret);
        return MessageDigest.isEqual(
                expected.getBytes(StandardCharsets.UTF_8),
                signature.getBytes(StandardCharsets.UTF_8));
    }

    /** Như verifySignature nhưng ném ngoại lệ khi không khớp. */
    public static void verifyOrThrow(String rawBody, String signature, String signingSecret) {
        if (!verifySignature(rawBody, signature, signingSecret)) {
            throw new OmnichannelException("Chữ ký X-HTC-Signature không hợp lệ");
        }
    }
}
