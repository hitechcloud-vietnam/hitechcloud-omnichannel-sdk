<?php

namespace HiTechCloud\Omnichannel;

/**
 * Client cho HiTechCloud Omnichannel API.
 *
 * Ví dụ:
 *   $omni = new Client('YOUR_ACCESS_TOKEN');
 *   $omni->channels()->list(['platform' => 'facebook']);
 *   $omni->messages()->sendText('cnv_01HZABCDEF', 'Chào anh/chị!');
 */
class Client
{
    public const PRODUCTION_URL = 'https://omni.hitechcloud.vn';
    public const SANDBOX_URL = 'https://omni-sandbox.hitechcloud.vn';

    private HttpClient $http;

    private Resources\Account $account;
    private Resources\Channels $channels;
    private Resources\Conversations $conversations;
    private Resources\Messages $messages;
    private Resources\Media $media;
    private Resources\Customers $customers;
    private Resources\Tags $tags;
    private Resources\Users $users;
    private Resources\Orders $orders;
    private Resources\Webhooks $webhooks;
    private Resources\Widget $widget;
    private Resources\Stats $stats;
    private Resources\Sandbox $sandbox;

    public function __construct(
        ?string $accessToken = null,
        ?string $baseUrl = null,
        bool $sandbox = false,
        int $timeout = 30,
        int $maxRetries = 3
    ) {
        if ($baseUrl === null) {
            $baseUrl = $sandbox ? self::SANDBOX_URL : self::PRODUCTION_URL;
        }
        $this->http = new HttpClient($baseUrl, $accessToken, $timeout, $maxRetries);

        $this->account = new Resources\Account($this->http);
        $this->channels = new Resources\Channels($this->http);
        $this->conversations = new Resources\Conversations($this->http);
        $this->messages = new Resources\Messages($this->http);
        $this->media = new Resources\Media($this->http);
        $this->customers = new Resources\Customers($this->http);
        $this->tags = new Resources\Tags($this->http);
        $this->users = new Resources\Users($this->http);
        $this->orders = new Resources\Orders($this->http);
        $this->webhooks = new Resources\Webhooks($this->http);
        $this->widget = new Resources\Widget($this->http);
        $this->stats = new Resources\Stats($this->http);
        $this->sandbox = new Resources\Sandbox($this->http);
    }

    public function setAccessToken(string $accessToken): void
    {
        $this->http->setToken($accessToken);
    }

    public function account(): Resources\Account { return $this->account; }
    public function channels(): Resources\Channels { return $this->channels; }
    public function conversations(): Resources\Conversations { return $this->conversations; }
    public function messages(): Resources\Messages { return $this->messages; }
    public function media(): Resources\Media { return $this->media; }
    public function customers(): Resources\Customers { return $this->customers; }
    public function tags(): Resources\Tags { return $this->tags; }
    public function users(): Resources\Users { return $this->users; }
    public function orders(): Resources\Orders { return $this->orders; }
    public function webhooks(): Resources\Webhooks { return $this->webhooks; }
    public function widget(): Resources\Widget { return $this->widget; }
    public function stats(): Resources\Stats { return $this->stats; }
    public function sandbox(): Resources\Sandbox { return $this->sandbox; }

    /** GET /v1/me (tiện ích). */
    public function me(): array
    {
        return $this->account->me();
    }
}
