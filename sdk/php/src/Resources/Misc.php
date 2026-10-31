<?php

namespace HiTechCloud\Omnichannel\Resources;

/** Thông tin token. */
class Account extends BaseResource
{
    /** GET /v1/me */
    public function me(): array
    {
        return $this->http->get('/v1/me');
    }
}

/** Nhãn workspace. */
class Tags extends BaseResource
{
    /** GET /v1/tags */
    public function list(): array
    {
        return $this->http->get('/v1/tags');
    }
}

/** Nhân viên workspace. */
class Users extends BaseResource
{
    /** GET /v1/users */
    public function list(): array
    {
        return $this->http->get('/v1/users');
    }
}

/** Đơn hàng từ hội thoại. */
class Orders extends BaseResource
{
    /** GET /v1/orders */
    public function list(array $params = []): array
    {
        return $this->http->get('/v1/orders', self::clean($params));
    }

    /** POST /v1/orders */
    public function create(string $conversationId, array $items, ?array $shippingAddress = null, ?string $note = null): array
    {
        return $this->http->post('/v1/orders', self::clean([
            'conversation_id' => $conversationId,
            'items' => $items,
            'shipping_address' => $shippingAddress,
            'note' => $note,
        ]));
    }

    /** GET /v1/orders/{id} */
    public function get(string $id): array
    {
        return $this->http->get('/v1/orders/' . $id);
    }

    /** PUT /v1/orders/{id} */
    public function update(string $id, array $data): array
    {
        return $this->http->put('/v1/orders/' . $id, self::clean($data));
    }
}

/** Webhook realtime. */
class Webhooks extends BaseResource
{
    /** GET /v1/webhooks */
    public function list(): array
    {
        return $this->http->get('/v1/webhooks');
    }

    /** POST /v1/webhooks (trả về signing_secret). */
    public function create(string $url, array $events, ?array $channelIds = null): array
    {
        return $this->http->post('/v1/webhooks', self::clean([
            'url' => $url,
            'events' => $events,
            'channel_ids' => $channelIds,
        ]));
    }

    /** DELETE /v1/webhooks/{id} */
    public function delete(string $id): array
    {
        return $this->http->delete('/v1/webhooks/' . $id);
    }
}

/** Live chat website. */
class Widget extends BaseResource
{
    /** POST /v1/widget/messages */
    public function sendMessage(array $body): array
    {
        return $this->http->post('/v1/widget/messages', self::clean($body));
    }

    /** GET /v1/widget/messages */
    public function listMessages(string $channelId, string $conversationId): array
    {
        return $this->http->get('/v1/widget/messages', [
            'channel_id' => $channelId,
            'conversation_id' => $conversationId,
        ]);
    }
}

/** Công cụ Sandbox. */
class Sandbox extends BaseResource
{
    /** POST /v1/sandbox/simulate/incoming-message */
    public function simulateIncomingMessage(string $channelId, string $text, ?string $customerName = null): array
    {
        return $this->http->post('/v1/sandbox/simulate/incoming-message', self::clean([
            'channel_id' => $channelId,
            'text' => $text,
            'customer_name' => $customerName,
        ]));
    }
}
