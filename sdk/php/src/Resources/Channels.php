<?php

namespace HiTechCloud\Omnichannel\Resources;

/** Kênh (channels): Facebook, Instagram, Zalo, TikTok, Web. */
class Channels extends BaseResource
{
    /** GET /v1/channels */
    public function list(array $params = []): array
    {
        return $this->http->get('/v1/channels', self::clean($params));
    }

    /** GET /v1/channels/{id} */
    public function get(string $id): array
    {
        return $this->http->get('/v1/channels/' . $id);
    }

    /** POST /v1/channels/{id}/access-token */
    public function createAccessToken(string $id, ?array $scopes = null): array
    {
        return $this->http->post('/v1/channels/' . $id . '/access-token', self::clean(['scopes' => $scopes]));
    }

    /** GET /v1/channels/{id}/posts */
    public function listPosts(string $id, array $params): array
    {
        return $this->http->get('/v1/channels/' . $id . '/posts', self::clean($params));
    }

    /** URL ảnh đại diện khách (endpoint trả 301 redirect tới ảnh). */
    public function avatarUrl(string $id, string $psid): string
    {
        return $this->http->getBaseUrl() . '/v1/channels/' . $id . '/avatar/' . $psid;
    }

    /** GET /v1/channels/{id}/round-robin */
    public function getRoundRobin(string $id): array
    {
        return $this->http->get('/v1/channels/' . $id . '/round-robin');
    }

    /** PUT /v1/channels/{id}/round-robin */
    public function updateRoundRobin(string $id, array $data): array
    {
        return $this->http->put('/v1/channels/' . $id . '/round-robin', self::clean($data));
    }

    /** GET /v1/channels/{id}/export */
    public function exportConversations(string $id, array $params): array
    {
        $params = array_merge(['action' => 'conversations_from_ads'], $params);
        return $this->http->get('/v1/channels/' . $id . '/export', self::clean($params));
    }

    /** GET /v1/channels/{id}/call-logs */
    public function callLogs(string $id, array $params = []): array
    {
        $params = array_merge(['page' => 1], $params);
        return $this->http->get('/v1/channels/' . $id . '/call-logs', self::clean($params));
    }
}
