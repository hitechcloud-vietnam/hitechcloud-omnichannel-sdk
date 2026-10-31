"""Tài nguyên Tin nhắn (messages) — tiện ích trỏ về endpoint hội thoại."""

from .base import BaseResource


class MessagesResource(BaseResource):
    """Gửi và đọc tin nhắn qua /v1/conversations/{id}/messages."""

    def send(self, conversation_id, type, text=None, attachment_ids=None,
             reply_to_message_id=None, template_id=None, template_params=None,
             mentions=None, idempotency_key=None):
        """POST /v1/conversations/{id}/messages — Gửi tin nhắn.

        type: text | image | file | comment_reply | private_reply | template
        """
        body = self._clean({
            "type": type, "text": text, "attachment_ids": attachment_ids,
            "reply_to_message_id": reply_to_message_id, "template_id": template_id,
            "template_params": template_params, "mentions": mentions,
            "idempotency_key": idempotency_key,
        })
        return self._http.post("/v1/conversations/%s/messages" % conversation_id, body)

    def send_text(self, conversation_id, text, idempotency_key=None):
        """Gửi tin văn bản (type=text)."""
        return self.send(conversation_id, "text", text=text, idempotency_key=idempotency_key)

    def send_image(self, conversation_id, attachment_ids, idempotency_key=None):
        """Gửi hình ảnh đã upload (type=image)."""
        return self.send(conversation_id, "image", attachment_ids=attachment_ids,
                         idempotency_key=idempotency_key)

    def reply_comment(self, conversation_id, reply_to_message_id, text, mentions=None):
        """Trả lời công khai dưới bình luận (type=comment_reply)."""
        return self.send(conversation_id, "comment_reply", text=text,
                         reply_to_message_id=reply_to_message_id, mentions=mentions)

    def private_reply(self, conversation_id, reply_to_message_id, text):
        """Nhắn riêng cho người bình luận (type=private_reply)."""
        return self.send(conversation_id, "private_reply", text=text,
                         reply_to_message_id=reply_to_message_id)

    def send_template(self, conversation_id, template_id, template_params=None):
        """Gửi tin theo mẫu đã duyệt (type=template)."""
        return self.send(conversation_id, "template", template_id=template_id,
                         template_params=template_params)

    def history(self, conversation_id, before=None, per_page=None):
        """GET /v1/conversations/{id}/messages — Lịch sử tin nhắn."""
        return self._http.get("/v1/conversations/%s/messages" % conversation_id, self._clean({
            "before": before, "per_page": per_page,
        }))
