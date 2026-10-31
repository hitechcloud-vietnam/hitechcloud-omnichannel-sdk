"""
HiTechCloud Omnichannel SDK for Python

Thư viện chính thức cho HiTechCloud Omnichannel API
(https://developers.hitechcloud.vn) — gom hội thoại Facebook, Instagram,
Zalo, TikTok và Website vào một REST API hợp nhất.

Ví dụ:
    from hitechcloud_omnichannel import Omnichannel

    omni = Omnichannel(access_token="YOUR_ACCESS_TOKEN")

    channels = omni.channels.list(platform="facebook")
    omni.messages.send("cnv_01HZABCDEF", type="text", text="Chào anh/chị!")
"""

from .client import Omnichannel
from .webhook import verify_signature, WebhookSignatureError
from .exceptions import (
    OmnichannelError,
    AuthenticationError,
    AuthorizationError,
    NotFoundError,
    ValidationError,
    MessagingWindowClosedError,
    ConflictError,
    RateLimitError,
    ServerError,
)

__version__ = "1.0.0"
__author__ = "HiTechCloud Vietnam"
__email__ = "support@hitechcloud.vn"

__all__ = [
    "Omnichannel",
    "verify_signature",
    "WebhookSignatureError",
    "OmnichannelError",
    "AuthenticationError",
    "AuthorizationError",
    "NotFoundError",
    "ValidationError",
    "MessagingWindowClosedError",
    "ConflictError",
    "RateLimitError",
    "ServerError",
]
