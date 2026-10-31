<?php

namespace HiTechCloud\Omnichannel\Resources;

/** Tin nhắn (messages) — tiện ích trỏ về /v1/conversations/{id}/messages. */
class Messages extends BaseResource
{
    /** POST /v1/conversations/{id}/messages */
    public function send(string $conversationId, array $body): array
    {
        return $this->http->post('/v1/conversations/' . $conversationId . '/messages', self::clean($body));
    }

    public function sendText(string $conversationId, string $text, ?string $idempotencyKey = null): array
    {
        return $this->send($conversationId, [
            'type' => 'text',
            'text' => $text,
            'idempotency_key' => $idempotencyKey,
        ]);
    }

    public function sendImage(string $conversationId, array $attachmentIds, ?string $idempotencyKey = null): array
    {
        return $this->send($conversationId, [
            'type' => 'image',
            'attachment_ids' => $attachmentIds,
            'idempotency_key' => $idempotencyKey,
        ]);
    }

    public function replyComment(string $conversationId, string $replyToMessageId, string $text, ?array $mentions = null): array
    {
        return $this->send($conversationId, [
            'type' => 'comment_reply',
            'reply_to_message_id' => $replyToMessageId,
            'text' => $text,
            'mentions' => $mentions,
        ]);
    }

    public function privateReply(string $conversationId, string $replyToMessageId, string $text): array
    {
        return $this->send($conversationId, [
            'type' => 'private_reply',
            'reply_to_message_id' => $replyToMessageId,
            'text' => $text,
        ]);
    }

    public function sendTemplate(string $conversationId, string $templateId, ?array $templateParams = null): array
    {
        return $this->send($conversationId, [
            'type' => 'template',
            'template_id' => $templateId,
            'template_params' => $templateParams,
        ]);
    }

    /** GET /v1/conversations/{id}/messages */
    public function history(string $conversationId, array $params = []): array
    {
        return $this->http->get('/v1/conversations/' . $conversationId . '/messages', self::clean($params));
    }
}
