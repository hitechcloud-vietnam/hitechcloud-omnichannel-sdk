# Phân trang & Rate limit

## Phân trang theo con trỏ (cursor)

Dùng cho `conversations` và `messages`. Lần đầu không truyền `cursor`; các lần sau truyền lại `next_cursor` cho tới khi `has_more` là `false`.

```python
cursor = None
while True:
    body = omni.conversations.list(channel_id="chn_01HZX8QWERTY", per_page=60, cursor=cursor)
    for cv in body["data"]:
        ...
    pg = body["meta"]["pagination"]
    if not pg["has_more"]:
        break
    cursor = pg["next_cursor"]
```

Tiện ích có sẵn: `omni.conversations.iterate(...)` (Python) và `for await (const c of omni.conversations.iterate(...))` (Node) tự duyệt toàn bộ.

## Phân trang theo trang

Dùng cho `channels`, `customers`, `orders`, `posts`, `call-logs`.

| Tham số | Mặc định | Mô tả |
|---|---|---|
| `page` | 1 | Số thứ tự trang |
| `per_page` | 50 | Số bản ghi mỗi trang (tối đa 100; một số endpoint tối đa 30/60) |

## Giới hạn tần suất

| Loại | Giới hạn | Header |
|---|---|---|
| Mặc định mỗi token | 120 req/phút | `X-RateLimit-Limit: 120` |
| Gửi tin mỗi kênh | 20 tin/giây | `X-RateLimit-Limit: 20` |
| Sandbox | 60 req/phút | `X-RateLimit-Limit: 60` |

Khi vượt hạn mức, API trả HTTP `429` kèm header `Retry-After` (số giây) và Envelope:

```json
{ "status": "error", "code": "TOO_MANY_REQUESTS", "message": "...", "retry_after": 18 }
```

SDK tự đợi theo `Retry-After` rồi thử lại (trong giới hạn `max_retries`). Ngoại lệ `RateLimitError` cũng cung cấp `retry_after` để bạn tự điều tiết nếu cần.
