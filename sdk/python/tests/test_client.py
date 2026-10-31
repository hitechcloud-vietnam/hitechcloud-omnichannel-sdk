"""Kiểm thử cho HiTechCloud Omnichannel Python SDK."""

import pytest
import responses

from hitechcloud_omnichannel import (
    Omnichannel,
    AuthenticationError,
    NotFoundError,
    RateLimitError,
    MessagingWindowClosedError,
    verify_signature,
)

BASE = "https://omni.hitechcloud.vn"


def make_client():
    return Omnichannel(access_token="tok", max_retries=0)


def test_client_defaults():
    c = make_client()
    assert c._http.base_url == BASE
    assert c.channels is not None and c.conversations is not None
    assert c.messages is not None and c.webhooks is not None


def test_sandbox_url():
    c = Omnichannel(access_token="tok", sandbox=True)
    assert c._http.base_url == Omnichannel.SANDBOX_URL


def test_bearer_header():
    c = make_client()
    assert c._http.session.headers["Authorization"] == "Bearer tok"


@responses.activate
def test_list_channels():
    responses.get(f"{BASE}/v1/channels",
                  json={"status": "success", "data": [{"id": "chn_1", "platform": "facebook"}]},
                  status=200)
    c = make_client()
    body = c.channels.list(platform="facebook")
    assert body["data"][0]["id"] == "chn_1"


@responses.activate
def test_send_message():
    responses.post(f"{BASE}/v1/conversations/cnv_1/messages",
                   json={"status": "success", "data": {"id": "msg_1", "direction": "out"}},
                   status=201)
    c = make_client()
    body = c.messages.send_text("cnv_1", "xin chao")
    assert body["data"]["id"] == "msg_1"


@responses.activate
def test_unauthorized():
    responses.get(f"{BASE}/v1/me",
                  json={"status": "error", "code": "UNAUTHORIZED", "message": "het han"},
                  status=401)
    c = make_client()
    with pytest.raises(AuthenticationError):
        c.me()


@responses.activate
def test_not_found():
    responses.get(f"{BASE}/v1/conversations/x",
                  json={"status": "error", "code": "NOT_FOUND", "message": "khong thay"},
                  status=404)
    c = make_client()
    with pytest.raises(NotFoundError):
        c.conversations.get("x")


@responses.activate
def test_messaging_window_closed():
    responses.post(f"{BASE}/v1/conversations/cnv_1/messages",
                   json={"status": "error", "code": "MESSAGING_WINDOW_CLOSED", "message": "ngoai cua so"},
                   status=422)
    c = make_client()
    with pytest.raises(MessagingWindowClosedError):
        c.messages.send_text("cnv_1", "hi")


@responses.activate
def test_rate_limit():
    responses.get(f"{BASE}/v1/channels",
                  json={"status": "error", "code": "TOO_MANY_REQUESTS", "message": "qua nhieu", "retry_after": 18},
                  status=429, headers={"Retry-After": "18"})
    c = make_client()
    with pytest.raises(RateLimitError) as exc:
        c.channels.list()
    assert exc.value.retry_after == 18


def test_webhook_signature_roundtrip():
    import hashlib, hmac
    secret = "whsec_test"
    body = '{"event_type":"message.created"}'
    sig = hmac.new(secret.encode(), body.encode(), hashlib.sha256).hexdigest()
    assert verify_signature(body, sig, secret) is True
    assert verify_signature(body, "sha256=" + sig, secret) is True
    assert verify_signature(body, "deadbeef", secret) is False


def test_repr():
    assert "omni.hitechcloud.vn" in repr(make_client())
