"""Tài nguyên Kênh (channels)."""

from .base import BaseResource


class ChannelsResource(BaseResource):
    """Các trang/kênh đã kết nối: Facebook, Instagram, Zalo, TikTok, Web."""

    def list(self, platform=None, connected=None, page=None, per_page=None):
        """GET /v1/channels — Danh sách kênh đã kết nối."""
        return self._http.get("/v1/channels", self._clean({
            "platform": platform, "connected": connected,
            "page": page, "per_page": per_page,
        }))

    def get(self, channel_id):
        """GET /v1/channels/{id} — Chi tiết một kênh."""
        return self._http.get("/v1/channels/%s" % channel_id)

    def create_access_token(self, channel_id, scopes=None):
        """POST /v1/channels/{id}/access-token — Sinh token truy cập riêng cho kênh."""
        body = {}
        if scopes is not None:
            body["scopes"] = scopes
        return self._http.post("/v1/channels/%s/access-token" % channel_id, body)

    def list_posts(self, channel_id, since, until, type=None, page=None, per_page=None):
        """GET /v1/channels/{id}/posts — Danh sách bài viết của kênh."""
        return self._http.get("/v1/channels/%s/posts" % channel_id, self._clean({
            "since": since, "until": until, "type": type,
            "page": page, "per_page": per_page,
        }))

    def avatar_url(self, channel_id, psid):
        """URL ảnh đại diện khách (endpoint trả 301 redirect tới ảnh)."""
        return "%s/v1/channels/%s/avatar/%s" % (self._http.base_url, channel_id, psid)

    def get_round_robin(self, channel_id):
        """GET /v1/channels/{id}/round-robin — Cấu hình chia tự động."""
        return self._http.get("/v1/channels/%s/round-robin" % channel_id)

    def update_round_robin(self, channel_id, inbox=None, comment=None):
        """PUT /v1/channels/{id}/round-robin — Cập nhật chia tự động."""
        return self._http.put("/v1/channels/%s/round-robin" % channel_id, self._clean({
            "inbox": inbox, "comment": comment,
        }))

    def export_conversations(self, channel_id, since, until,
                             action="conversations_from_ads", offset=None):
        """GET /v1/channels/{id}/export — Xuất hội thoại từ quảng cáo."""
        return self._http.get("/v1/channels/%s/export" % channel_id, self._clean({
            "action": action, "since": since, "until": until, "offset": offset,
        }))

    def call_logs(self, channel_id, page=1, per_page=None, since=None, until=None):
        """GET /v1/channels/{id}/call-logs — Nhật ký cuộc gọi của kênh."""
        return self._http.get("/v1/channels/%s/call-logs" % channel_id, self._clean({
            "page": page, "per_page": per_page, "since": since, "until": until,
        }))
