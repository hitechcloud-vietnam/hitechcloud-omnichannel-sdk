"""Các tài nguyên gọn: account, tags, users, orders, webhooks, widget, sandbox."""

from .base import BaseResource


class AccountResource(BaseResource):
    """Thông tin token hiện tại."""

    def me(self):
        """GET /v1/me — Chủ sở hữu token, scopes, kênh truy cập được."""
        return self._http.get("/v1/me")


class TagsResource(BaseResource):
    """Nhãn trong workspace."""

    def list(self):
        """GET /v1/tags — Danh sách nhãn."""
        return self._http.get("/v1/tags")


class UsersResource(BaseResource):
    """Nhân viên trong workspace."""

    def list(self):
        """GET /v1/users — Danh sách nhân viên."""
        return self._http.get("/v1/users")


class OrdersResource(BaseResource):
    """Đơn hàng phát sinh từ hội thoại."""

    def list(self, channel_id=None, conversation_id=None, status=None,
             page=None, per_page=None):
        """GET /v1/orders — Danh sách đơn hàng."""
        return self._http.get("/v1/orders", self._clean({
            "channel_id": channel_id, "conversation_id": conversation_id,
            "status": status, "page": page, "per_page": per_page,
        }))

    def create(self, conversation_id, items, shipping_address=None, note=None):
        """POST /v1/orders — Tạo đơn hàng từ hội thoại."""
        return self._http.post("/v1/orders", self._clean({
            "conversation_id": conversation_id, "items": items,
            "shipping_address": shipping_address, "note": note,
        }))

    def get(self, order_id):
        """GET /v1/orders/{id} — Chi tiết đơn hàng."""
        return self._http.get("/v1/orders/%s" % order_id)

    def update(self, order_id, status=None, note=None, shipping_address=None, **extra):
        """PUT /v1/orders/{id} — Cập nhật đơn hàng."""
        body = self._clean({
            "status": status, "note": note, "shipping_address": shipping_address,
        }) or {}
        body.update(extra)
        return self._http.put("/v1/orders/%s" % order_id, body)


class WebhooksResource(BaseResource):
    """Đăng ký và quản lý webhook realtime."""

    def list(self):
        """GET /v1/webhooks — Danh sách webhook."""
        return self._http.get("/v1/webhooks")

    def create(self, url, events, channel_ids=None):
        """POST /v1/webhooks — Đăng ký webhook (trả về signing_secret)."""
        return self._http.post("/v1/webhooks", self._clean({
            "url": url, "events": events, "channel_ids": channel_ids,
        }))

    def delete(self, webhook_id):
        """DELETE /v1/webhooks/{id} — Xoá webhook."""
        return self._http.delete("/v1/webhooks/%s" % webhook_id)


class WidgetResource(BaseResource):
    """Live chat website (widget nhúng)."""

    def send_message(self, channel_id, visitor_id, text=None, conversation_id=None,
                     attachment_ids=None, name=None):
        """POST /v1/widget/messages — Gửi tin / tạo hội thoại web."""
        return self._http.post("/v1/widget/messages", self._clean({
            "channel_id": channel_id, "visitor_id": visitor_id, "text": text,
            "conversation_id": conversation_id, "attachment_ids": attachment_ids,
            "name": name,
        }))

    def list_messages(self, channel_id, conversation_id):
        """GET /v1/widget/messages — Đọc tin nhắn hội thoại web."""
        return self._http.get("/v1/widget/messages", {
            "channel_id": channel_id, "conversation_id": conversation_id,
        })


class SandboxResource(BaseResource):
    """Công cụ thử nghiệm (chỉ hoạt động trên môi trường Sandbox)."""

    def simulate_incoming_message(self, channel_id, text, customer_name=None):
        """POST /v1/sandbox/simulate/incoming-message — Mô phỏng tin đến."""
        return self._http.post("/v1/sandbox/simulate/incoming-message", self._clean({
            "channel_id": channel_id, "text": text, "customer_name": customer_name,
        }))
