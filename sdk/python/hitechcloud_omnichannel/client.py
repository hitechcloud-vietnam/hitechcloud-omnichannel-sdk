"""HiTechCloud Omnichannel — Client chính."""

from .http_client import HTTPClient
from .resources import (
    AccountResource,
    ChannelsResource,
    ConversationsResource,
    MessagesResource,
    MediaResource,
    CustomersResource,
    TagsResource,
    UsersResource,
    OrdersResource,
    WebhooksResource,
    WidgetResource,
    StatsResource,
    SandboxResource,
)


class Omnichannel:
    """Client cho HiTechCloud Omnichannel API.

    Args:
        access_token: Access token dạng Bearer (bắt buộc để gọi API).
        base_url: Base URL (mặc định Production). Dùng SANDBOX_URL để thử nghiệm.
        sandbox: True để tự chọn môi trường Sandbox.
        timeout: Timeout mỗi request (giây).
        max_retries: Số lần thử lại khi gặp 429/5xx.

    Ví dụ:
        omni = Omnichannel(access_token="YOUR_ACCESS_TOKEN")
        omni.channels.list(platform="facebook")
        omni.messages.send_text("cnv_01HZABCDEF", "Chào anh/chị!")
    """

    PRODUCTION_URL = "https://omni.hitechcloud.vn"
    SANDBOX_URL = "https://omni-sandbox.hitechcloud.vn"

    def __init__(self, access_token=None, base_url=None, sandbox=False,
                 timeout=30, max_retries=3):
        if base_url is None:
            base_url = self.SANDBOX_URL if sandbox else self.PRODUCTION_URL
        self._http = HTTPClient(
            base_url=base_url,
            access_token=access_token,
            timeout=timeout,
            max_retries=max_retries,
        )

        self.account = AccountResource(self._http)
        self.channels = ChannelsResource(self._http)
        self.conversations = ConversationsResource(self._http)
        self.messages = MessagesResource(self._http)
        self.media = MediaResource(self._http)
        self.customers = CustomersResource(self._http)
        self.tags = TagsResource(self._http)
        self.users = UsersResource(self._http)
        self.orders = OrdersResource(self._http)
        self.webhooks = WebhooksResource(self._http)
        self.widget = WidgetResource(self._http)
        self.stats = StatsResource(self._http)
        self.sandbox = SandboxResource(self._http)

    def set_access_token(self, access_token):
        """Đặt / đổi access token."""
        self._http.set_token(access_token)

    def me(self):
        """GET /v1/me — Thông tin token hiện tại (tiện ích)."""
        return self.account.me()

    def __repr__(self):
        return "Omnichannel(base_url=%r)" % self._http.base_url

    def __enter__(self):
        return self

    def __exit__(self, *args):
        self._http.close()
