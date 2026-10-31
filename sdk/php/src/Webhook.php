<?php

namespace HiTechCloud\Omnichannel;

class Webhook
{
    public const SIGNATURE_HEADER = 'X-HTC-Signature';

    /** Tính HMAC-SHA256 hex của thân request thô. */
    public static function computeSignature(string $rawBody, string $signingSecret): string
    {
        return hash_hmac('sha256', $rawBody, $signingSecret);
    }

    /**
     * Trả về true nếu chữ ký khớp (so sánh theo thời gian hằng số).
     * $signature có thể ở dạng "sha256=<hex>" hoặc "<hex>".
     */
    public static function verifySignature(string $rawBody, ?string $signature, string $signingSecret): bool
    {
        if ($signature === null || $signature === '') {
            return false;
        }
        $signature = trim($signature);
        if (str_starts_with($signature, 'sha256=')) {
            $signature = substr($signature, 7);
        }
        $expected = self::computeSignature($rawBody, $signingSecret);
        return hash_equals($expected, $signature);
    }

    /** Như verifySignature nhưng ném ngoại lệ khi không khớp. */
    public static function verifyOrThrow(string $rawBody, ?string $signature, string $signingSecret): bool
    {
        if (!self::verifySignature($rawBody, $signature, $signingSecret)) {
            throw new OmnichannelException('Chữ ký X-HTC-Signature không hợp lệ');
        }
        return true;
    }
}
