"""Các nhóm tài nguyên của Omnichannel SDK."""

from .base import BaseResource
from .channels import ChannelsResource
from .conversations import ConversationsResource
from .messages import MessagesResource
from .media import MediaResource
from .customers import CustomersResource
from .stats import StatsResource
from .misc import (
    AccountResource,
    TagsResource,
    UsersResource,
    OrdersResource,
    WebhooksResource,
    WidgetResource,
    SandboxResource,
)

__all__ = [
    "BaseResource",
    "ChannelsResource",
    "ConversationsResource",
    "MessagesResource",
    "MediaResource",
    "CustomersResource",
    "StatsResource",
    "AccountResource",
    "TagsResource",
    "UsersResource",
    "OrdersResource",
    "WebhooksResource",
    "WidgetResource",
    "SandboxResource",
]
