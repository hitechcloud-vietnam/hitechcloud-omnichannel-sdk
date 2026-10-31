"""Tiện ích xác minh chữ ký webhook (HMAC-SHA256, header X-HTC-Signature)."""

import hashlib
import hmac

SIGNATURE_HEADER = "X-HTC-Signature"


class WebhookSignatureError(Exception):
    """Chữ ký webhook không hợp lệ."""


def compute_signature(raw_body, signing_secret):
    """Tính HMAC-SHA256 hex của thân request thô bằng signing_secret."""
    if isinstance(raw_body, str):
        raw_body = raw_body.encode("utf-8")
    if isinstance(signing_secret, str):
        signing_secret = signing_secret.encode("utf-8")
    return hmac.new(signing_secret, raw_body, hashlib.sha256).hexdigest()


def verify_signature(raw_body, signature, signing_secret):
    """Trả về True nếu `signature` (giá trị header X-HTC-Signature) khớp.

    So sánh theo thời gian hằng số để tránh timing attack. `signature` có
    thể ở dạng "sha256=<hex>" hoặc chỉ "<hex>".
    """
    if signature is None:
        return False
    if signature.startswith("sha256="):
        signature = signature[len("sha256="):]
    expected = compute_signature(raw_body, signing_secret)
    return hmac.compare_digest(expected, signature.strip())


def verify_or_raise(raw_body, signature, signing_secret):
    """Như verify_signature nhưng ném WebhookSignatureError khi không khớp."""
    if not verify_signature(raw_body, signature, signing_secret):
        raise WebhookSignatureError("Chữ ký X-HTC-Signature không hợp lệ")
    return True
