# Xác thực

Mọi endpoint của Omnichannel API đều yêu cầu một Access Token hợp lệ.

## Bearer Token (khuyến nghị)

```http
Authorization: Bearer YOUR_ACCESS_TOKEN
Accept: application/json
```

Trong SDK, token được truyền khi khởi tạo client và tự động gắn vào mọi request:

```python
omni = Omnichannel(access_token="YOUR_ACCESS_TOKEN")
```

## Tham số `access_token` trên query

Với môi trường không đặt được header tuỳ ý (webhook ngược, công cụ no-code), có thể truyền token qua query string:

```bash
curl "https://omni.hitechcloud.vn/v1/channels?access_token=YOUR_ACCESS_TOKEN"
```

> Ưu tiên Bearer header. Khi dùng `access_token` trên URL, token có thể bị ghi vào log — chỉ dùng với HTTPS tin cậy và token phạm vi hẹp.

## Phạm vi quyền (scopes)

| Scope | Cho phép |
|---|---|
| `channels:read` | Đọc danh sách và chi tiết kênh |
| `conversations:read` | Đọc hội thoại và tin nhắn |
| `messages:write` | Gửi tin nhắn, trả lời bình luận |
| `tags:write` | Gắn / gỡ nhãn hội thoại |
| `assign:write` | Phân công hội thoại cho nhân viên |
| `customers:write` | Cập nhật hồ sơ và ghi chú khách hàng |
| `orders:read` | Đọc đơn hàng phát sinh từ hội thoại |
| `webhooks:write` | Đăng ký và quản lý webhook |

## Token theo kênh (channel access token)

Access Token tổng có thể sinh token riêng cho từng kênh:

```bash
curl -X POST "https://omni.hitechcloud.vn/v1/channels/chn_01HZX8QWERTY/access-token" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{ "scopes": ["conversations:read", "messages:write"] }'
```

SDK: `omni.channels.create_access_token("chn_...", ["conversations:read", "messages:write"])`.

## Kiểm tra token

`GET /v1/me` trả về chủ sở hữu token, scopes và danh sách kênh truy cập được:

```python
print(omni.me())  # hoặc omni.account.me()
```

Khi token sai hoặc hết hạn, API trả về HTTP `401` với `code: UNAUTHORIZED`.
