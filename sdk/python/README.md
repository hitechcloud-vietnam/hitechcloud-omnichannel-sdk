# HiTechCloud Omnichannel — Python SDK

SDK chính thức cho [HiTechCloud Omnichannel API](https://developers.hitechcloud.vn): gom hội thoại Facebook, Instagram, Zalo, TikTok và Website vào một REST API hợp nhất.

## Cài đặt

```bash
pip install hitechcloud-omnichannel
```

## Khởi tạo

```python
from hitechcloud_omnichannel import Omnichannel

omni = Omnichannel(access_token="YOUR_ACCESS_TOKEN")
# Thử nghiệm: Omnichannel(access_token="...", sandbox=True)
```

## Ví dụ nhanh

```python
# Danh sách kênh Facebook đã kết nối
channels = omni.channels.list(platform="facebook", connected=True)

# Đọc hội thoại chưa đọc của một kênh
convs = omni.conversations.list(channel_id="chn_01HZX8QWERTY", unread_first=True)

# Gửi tin nhắn trả lời
omni.messages.send_text("cnv_01HZABCDEF", "Chào anh/chị, HiTechCloud hỗ trợ gì ạ?")

# Gắn nhãn và phân công
omni.conversations.add_tags("cnv_01HZABCDEF", ["da-chot-don"])
omni.conversations.assign("cnv_01HZABCDEF", assignee_ids=["usr_01HZNV01"])

# Tạo đơn hàng từ hội thoại
omni.orders.create(
    conversation_id="cnv_01HZABCDEF",
    items=[{"name": "Ao thun", "quantity": 2, "price": 150000}],
)

# Tải media rồi gửi ảnh
media = omni.media.upload("/duong-dan/anh.jpg", channel_id="chn_01HZX8QWERTY")
omni.messages.send_image("cnv_01HZABCDEF", [media["data"]["id"]])
```

## Phân trang theo cursor

```python
for conv in omni.conversations.iterate(channel_id="chn_01HZX8QWERTY", per_page=60):
    print(conv["id"], conv["customer"]["name"])
```

## Webhook (HMAC-SHA256, header `X-HTC-Signature`)

```python
from hitechcloud_omnichannel import verify_signature

@app.post("/htc/webhook")
def handler(request):
    raw = request.get_data(as_text=True)
    sig = request.headers.get("X-HTC-Signature")
    if not verify_signature(raw, sig, SIGNING_SECRET):
        return "invalid signature", 400
    event = request.json
    # xử lý idempotent theo event["event_id"]
    return "", 200
```

## Xử lý lỗi

```python
from hitechcloud_omnichannel import (
    RateLimitError, MessagingWindowClosedError, OmnichannelError,
)

try:
    omni.messages.send_text("cnv_01HZABCDEF", "...")
except MessagingWindowClosedError:
    pass  # ngoài cửa sổ 24h -> dùng mẫu (template)
except RateLimitError as e:
    time.sleep(e.retry_after or 5)
except OmnichannelError as e:
    print(e.code, e.message)
```

## Tài nguyên

`channels`, `conversations`, `messages`, `media`, `customers`, `tags`, `users`, `orders`, `webhooks`, `widget`, `stats`, `sandbox`, `account`.

## License

MIT
