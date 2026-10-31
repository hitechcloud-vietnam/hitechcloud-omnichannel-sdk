<?php

namespace HiTechCloud\Omnichannel\Resources;

/** Hội thoại (conversations). */
class Conversations extends BaseResource
{
    /** GET /v1/conversations */
    public function list(array $params = []): array
    {
        return $this->http->get('/v1/conversations', self::clean($params));
    }

    /** GET /v1/conversations/{id} */
    public function get(string $id): array
    {
        return $this->http->get('/v1/conversations/' . $id);
    }

    /** GET /v1/conversations/{id}/messages */
    public function listMessages(string $id, array $params = []): array
    {
        return $this->http->get('/v1/conversations/' . $id . '/messages', self::clean($params));
    }

    /** POST /v1/conversations/{id}/messages */
    public function sendMessage(string $id, array $body): array
    {
        return $this->http->post('/v1/conversations/' . $id . '/messages', self::clean($body));
    }

    /** POST /v1/conversations/{id}/tags (action: add|remove) */
    public function tag(string $id, string $action, array $tags): array
    {
        return $this->http->post('/v1/conversations/' . $id . '/tags', [
            'action' => $action,
            'tags' => $tags,
        ]);
    }

    public function addTags(string $id, array $tags): array
    {
        return $this->tag($id, 'add', $tags);
    }

    public function removeTags(string $id, array $tags): array
    {
        return $this->tag($id, 'remove', $tags);
    }

    /** POST /v1/conversations/{id}/assign */
    public function assign(string $id, ?array $assigneeIds = null, ?string $strategy = null): array
    {
        return $this->http->post('/v1/conversations/' . $id . '/assign', self::clean([
            'assignee_ids' => $assigneeIds,
            'strategy' => $strategy,
        ]));
    }

    /** POST /v1/conversations/{id}/read */
    public function markRead(string $id): array
    {
        return $this->http->post('/v1/conversations/' . $id . '/read');
    }

    /** POST /v1/conversations/{id}/unread */
    public function markUnread(string $id): array
    {
        return $this->http->post('/v1/conversations/' . $id . '/unread');
    }
}
