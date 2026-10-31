"""Tài nguyên Hội thoại (conversations)."""

from .base import BaseResource


class ConversationsResource(BaseResource):
    """Luồng trao đổi giữa doanh nghiệp và khách trên một kênh."""

    def list(self, channel_id=None, type=None, tag=None, assignee_id=None,
             unread_first=None, since=None, until=None, cursor=None, per_page=None):
        """GET /v1/conversations — Danh sách hội thoại (phân trang theo cursor)."""
        return self._http.get("/v1/conversations", self._clean({
            "channel_id": channel_id, "type": type, "tag": tag,
            "assignee_id": assignee_id, "unread_first": unread_first,
            "since": since, "until": until, "cursor": cursor, "per_page": per_page,
        }))

    def get(self, conversation_id):
        """GET /v1/conversations/{id} — Chi tiết hội thoại."""
        return self._http.get("/v1/conversations/%s" % conversation_id)

    def list_messages(self, conversation_id, before=None, per_page=None):
        """GET /v1/conversations/{id}/messages — Lịch sử tin nhắn."""
        return self._http.get("/v1/conversations/%s/messages" % conversation_id, self._clean({
            "before": before, "per_page": per_page,
        }))

    def send_message(self, conversation_id, type, text=None, attachment_ids=None,
                     reply_to_message_id=None, template_id=None, template_params=None,
                     mentions=None, idempotency_key=None):
        """POST /v1/conversations/{id}/messages — Gửi tin nhắn."""
        body = self._clean({
            "type": type, "text": text, "attachment_ids": attachment_ids,
            "reply_to_message_id": reply_to_message_id, "template_id": template_id,
            "template_params": template_params, "mentions": mentions,
            "idempotency_key": idempotency_key,
        })
        return self._http.post("/v1/conversations/%s/messages" % conversation_id, body)

    def tag(self, conversation_id, action, tags):
        """POST /v1/conversations/{id}/tags — Gắn/gỡ nhãn (action: add|remove)."""
        return self._http.post("/v1/conversations/%s/tags" % conversation_id, {
            "action": action, "tags": tags,
        })

    def add_tags(self, conversation_id, tags):
        """Gắn nhãn (tiện ích: action=add)."""
        return self.tag(conversation_id, "add", tags)

    def remove_tags(self, conversation_id, tags):
        """Gỡ nhãn (tiện ích: action=remove)."""
        return self.tag(conversation_id, "remove", tags)

    def assign(self, conversation_id, assignee_ids=None, strategy=None):
        """POST /v1/conversations/{id}/assign — Gán hội thoại cho nhân viên."""
        return self._http.post("/v1/conversations/%s/assign" % conversation_id, self._clean({
            "assignee_ids": assignee_ids, "strategy": strategy,
        }))

    def mark_read(self, conversation_id):
        """POST /v1/conversations/{id}/read — Đánh dấu đã đọc."""
        return self._http.post("/v1/conversations/%s/read" % conversation_id)

    def mark_unread(self, conversation_id):
        """POST /v1/conversations/{id}/unread — Đánh dấu chưa đọc."""
        return self._http.post("/v1/conversations/%s/unread" % conversation_id)

    def iterate(self, **filters):
        """Duyệt toàn bộ hội thoại qua phân trang cursor (generator)."""
        cursor = None
        while True:
            params = dict(filters)
            if cursor:
                params["cursor"] = cursor
            body = self.list(**params)
            for item in (body.get("data") or []):
                yield item
            pg = (body.get("meta") or {}).get("pagination") or {}
            if not pg.get("has_more"):
                break
            cursor = pg.get("next_cursor")
            if not cursor:
                break
