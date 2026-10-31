<?php

namespace HiTechCloud\Omnichannel\Resources;

/** Khách hàng (customers). */
class Customers extends BaseResource
{
    /** GET /v1/customers */
    public function list(array $params = []): array
    {
        return $this->http->get('/v1/customers', self::clean($params));
    }

    /** GET /v1/customers/{id} */
    public function get(string $id): array
    {
        return $this->http->get('/v1/customers/' . $id);
    }

    /** PUT /v1/customers/{id} */
    public function update(string $id, array $data): array
    {
        return $this->http->put('/v1/customers/' . $id, self::clean($data));
    }

    /** POST /v1/customers/{id}/notes */
    public function addNote(string $id, string $message): array
    {
        return $this->http->post('/v1/customers/' . $id . '/notes', ['message' => $message]);
    }

    /** PUT /v1/customers/{id}/notes/{note_id} */
    public function updateNote(string $id, string $noteId, string $message): array
    {
        return $this->http->put('/v1/customers/' . $id . '/notes/' . $noteId, ['message' => $message]);
    }

    /** DELETE /v1/customers/{id}/notes/{note_id} */
    public function deleteNote(string $id, string $noteId): array
    {
        return $this->http->delete('/v1/customers/' . $id . '/notes/' . $noteId);
    }
}
