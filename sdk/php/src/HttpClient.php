<?php

namespace HiTechCloud\Omnichannel;

use GuzzleHttp\Client;
use GuzzleHttp\Exception\ConnectException;
use GuzzleHttp\Exception\RequestException;

class HttpClient
{
    public const VERSION = '1.0.0';

    private Client $client;
    private string $baseUrl;
    private ?string $accessToken;
    private int $maxRetries;

    public function __construct(string $baseUrl, ?string $accessToken = null, int $timeout = 30, int $maxRetries = 3)
    {
        $this->baseUrl = rtrim($baseUrl, '/');
        $this->accessToken = $accessToken;
        $this->maxRetries = $maxRetries;
        $this->client = new Client([
            'base_uri' => $this->baseUrl . '/',
            'timeout' => $timeout,
            'http_errors' => false,
            'headers' => [
                'Accept' => 'application/json',
                'User-Agent' => 'HiTechCloud-Omnichannel-PHP/' . self::VERSION,
            ],
        ]);
    }

    public function getBaseUrl(): string
    {
        return $this->baseUrl;
    }

    public function setToken(string $accessToken): void
    {
        $this->accessToken = $accessToken;
    }

    public function clearToken(): void
    {
        $this->accessToken = null;
    }

    private function authHeaders(): array
    {
        return $this->accessToken ? ['Authorization' => 'Bearer ' . $this->accessToken] : [];
    }

    public function request(string $method, string $path, array $options = [])
    {
        $path = ltrim($path, '/');
        $options['headers'] = array_merge($this->authHeaders(), $options['headers'] ?? []);

        for ($attempt = 0; $attempt <= $this->maxRetries; $attempt++) {
            try {
                $response = $this->client->request($method, $path, $options);
            } catch (ConnectException $e) {
                if ($attempt < $this->maxRetries) {
                    sleep(2 ** $attempt);
                    continue;
                }
                throw new OmnichannelException('Kết nối thất bại: ' . $e->getMessage());
            } catch (RequestException $e) {
                if ($attempt < $this->maxRetries) {
                    sleep(2 ** $attempt);
                    continue;
                }
                throw new OmnichannelException($e->getMessage());
            }

            $status = $response->getStatusCode();
            $retryAfterHeader = $response->getHeaderLine('Retry-After');
            $retryAfter = $retryAfterHeader !== '' ? (int) $retryAfterHeader : null;

            if ($status === 429 && $attempt < $this->maxRetries) {
                sleep($retryAfter ?? (2 ** $attempt));
                continue;
            }
            if ($status >= 500 && $attempt < $this->maxRetries) {
                sleep(2 ** $attempt);
                continue;
            }

            $raw = (string) $response->getBody();
            $body = $raw !== '' ? json_decode($raw, true) : null;

            if ($status >= 400 || (is_array($body) && ($body['status'] ?? null) === 'error')) {
                throw ErrorFactory::make($status, is_array($body) ? $body : [], $retryAfter);
            }

            return $body;
        }

        throw new OmnichannelException('Yêu cầu thất bại sau ' . $this->maxRetries . ' lần thử');
    }

    public function get(string $path, array $query = [])
    {
        $query = array_filter($query, static fn ($v) => $v !== null);
        return $this->request('GET', $path, $query ? ['query' => $query] : []);
    }

    public function post(string $path, array $json = [])
    {
        return $this->request('POST', $path, ['json' => (object) $json]);
    }

    public function postMultipart(string $path, array $multipart)
    {
        return $this->request('POST', $path, ['multipart' => $multipart]);
    }

    public function put(string $path, array $json = [])
    {
        return $this->request('PUT', $path, ['json' => (object) $json]);
    }

    public function delete(string $path)
    {
        return $this->request('DELETE', $path);
    }
}
