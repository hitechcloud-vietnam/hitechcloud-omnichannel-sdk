<?php

namespace HiTechCloud\Omnichannel;

class OmnichannelException extends \Exception
{
    protected ?string $errorCode;
    protected ?int $retryAfter;

    public function __construct(string $message = '', ?string $errorCode = null, int $statusCode = 0, ?int $retryAfter = null)
    {
        parent::__construct($message, $statusCode);
        $this->errorCode = $errorCode;
        $this->retryAfter = $retryAfter;
    }

    /** Mã lỗi chuỗi ổn định từ Envelope (ví dụ MESSAGING_WINDOW_CLOSED). */
    public function getErrorCode(): ?string
    {
        return $this->errorCode;
    }

    public function getRetryAfter(): ?int
    {
        return $this->retryAfter;
    }
}

class AuthenticationException extends OmnichannelException {}
class AuthorizationException extends OmnichannelException {}
class NotFoundException extends OmnichannelException {}
class ValidationException extends OmnichannelException {}
class MessagingWindowClosedException extends OmnichannelException {}
class ConflictException extends OmnichannelException {}
class RateLimitException extends OmnichannelException {}
class ServerException extends OmnichannelException {}

final class ErrorFactory
{
    private const CODE_MAP = [
        'UNAUTHORIZED' => AuthenticationException::class,
        'INSUFFICIENT_SCOPE' => AuthorizationException::class,
        'CHANNEL_NOT_CONNECTED' => AuthorizationException::class,
        'NOT_FOUND' => NotFoundException::class,
        'VALIDATION_ERROR' => ValidationException::class,
        'MESSAGING_WINDOW_CLOSED' => MessagingWindowClosedException::class,
        'DUPLICATE_REQUEST' => ConflictException::class,
        'TOO_MANY_REQUESTS' => RateLimitException::class,
        'INTERNAL_ERROR' => ServerException::class,
    ];

    private const STATUS_MAP = [
        400 => ValidationException::class,
        401 => AuthenticationException::class,
        403 => AuthorizationException::class,
        404 => NotFoundException::class,
        409 => ConflictException::class,
        422 => ValidationException::class,
        429 => RateLimitException::class,
        500 => ServerException::class,
        503 => ServerException::class,
    ];

    public static function make(int $statusCode, ?array $body, ?int $retryAfter = null): OmnichannelException
    {
        $code = $body['code'] ?? null;
        $message = $body['message'] ?? ('HTTP ' . $statusCode);
        if ($retryAfter === null && isset($body['retry_after'])) {
            $retryAfter = (int) $body['retry_after'];
        }
        $class = ($code !== null && isset(self::CODE_MAP[$code]))
            ? self::CODE_MAP[$code]
            : (self::STATUS_MAP[$statusCode] ?? OmnichannelException::class);

        return new $class($message, $code, $statusCode, $retryAfter);
    }
}
