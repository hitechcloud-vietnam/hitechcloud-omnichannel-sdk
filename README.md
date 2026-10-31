# HiTechCloud Omnichannel SDK

> SDK đa ngôn ngữ chính thức cho [HiTechCloud Omnichannel API](https://developers.hitechcloud.vn) — gom hội thoại **Facebook, Instagram, Zalo, TikTok, Website** vào một REST API hợp nhất: đọc, trả lời, gắn nhãn, phân công nhân viên, chốt đơn và nhận webhook thời gian thực.

## Tổng quan

Thay vì tích hợp riêng lẻ Graph API của Facebook, Zalo OA API, TikTok Business và widget chat website, bạn kết nối một lần rồi dùng một bộ REST API thống nhất. Kho này cung cấp SDK cho 5 ngôn ngữ, cùng đặc tả OpenAPI, tài liệu tiếng Việt và một máy chủ MCP.

| Hạng mục | Giá trị |
|---|---|
| Host Production | `https://omni.hitechcloud.vn` |
| Host Sandbox | `https://omni-sandbox.hitechcloud.vn` |
| Base path | `/v1` |
| Xác thực | Bearer access token |
| Định danh | ULID (`chn_…`, `cnv_…`, `msg_…`, `cus_…`, `ord_…`) |
| Phản hồi | Envelope `{ status, data, meta }` |
| Webhook | HMAC-SHA256 qua header `X-HTC-Signature` |

## Ngôn ngữ hỗ trợ

| Ngôn ngữ | Gói | Đường dẫn |
|---|---|---|
| Node.js / TypeScript | `@hitechcloud-vietnam/omnichannel-sdk` (npm) | [`sdk/nodejs`](sdk/nodejs) |
| Python | `hitechcloud-omnichannel` (PyPI) | [`sdk/python`](sdk/python) |
| PHP | `hitechcloud-vietnam/omnichannel-sdk` (Composer) | [`sdk/php`](sdk/php) |
| Go | `github.com/hitechcloud-vietnam/hitechcloud-omnichannel-sdk/go` | [`sdk/go`](sdk/go) |
| Java | `vn.hitechcloud:omnichannel-sdk` (Maven) | [`sdk/java`](sdk/java) |

## Nhóm tài nguyên

`channels` · `conversations` · `messages` · `media` · `customers` · `tags` · `users` · `orders` · `webhooks` · `widget` · `stats` · `sandbox` · `account`.

## Bắt đầu nhanh

### Node.js / TypeScript
```ts
import { Omnichannel } from "@hitechcloud-vietnam/omnichannel-sdk";

const omni = new Omnichannel({ accessToken: process.env.OMNI_ACCESS_TOKEN! });
const channels = await omni.channels.list({ platform: "facebook" });
await omni.messages.sendText("cnv_01HZABCDEF", "Chào anh/chị!");
```

### Python
```python
from hitechcloud_omnichannel import Omnichannel

omni = Omnichannel(access_token="YOUR_ACCESS_TOKEN")
omni.channels.list(platform="facebook")
omni.messages.send_text("cnv_01HZABCDEF", "Chào anh/chị!")
```

### PHP
```php
$omni = new HiTechCloud\Omnichannel\Client(getenv('OMNI_ACCESS_TOKEN'));
$omni->messages()->sendText('cnv_01HZABCDEF', 'Chào anh/chị!');
```

### Go
```go
c := omnichannel.NewClient(omnichannel.WithAccessToken(os.Getenv("OMNI_ACCESS_TOKEN")))
c.Messages.SendText("cnv_01HZABCDEF", "Chào anh/chị!", "")
```

### Java
```java
OmnichannelClient omni = new OmnichannelClient(System.getenv("OMNI_ACCESS_TOKEN"));
omni.messages().sendText("cnv_01HZABCDEF", "Chào anh/chị!", null);
```

## Webhook (X-HTC-Signature)

Mọi request webhook mang header `X-HTC-Signature` là HMAC-SHA256 của thân request, ký bằng `signing_secret`. Mỗi SDK có hàm xác minh sẵn:

```ts
import { verifySignature } from "@hitechcloud-vietnam/omnichannel-sdk";
if (!verifySignature(rawBody, req.header("X-HTC-Signature"), SIGNING_SECRET)) { /* 400 */ }
```

```python
from hitechcloud_omnichannel import verify_signature
verify_signature(raw_body, request.headers["X-HTC-Signature"], signing_secret)
```

Sự kiện: `message.created`, `message.updated`, `conversation.created`, `conversation.updated`, `order.created`, `order.updated`, `channel.connected`, `channel.disconnected`, `post.created`, `post.updated`, `subscription.updated`.

## Tài liệu

- [Bắt đầu nhanh](docs/getting-started.md)
- [Xác thực](docs/authentication.md)
- [Tham chiếu API](docs/api-reference.md)
- [Xử lý lỗi](docs/error-handling.md)
- [Phân trang & Rate limit](docs/rate-limiting.md)
- [Đặc tả OpenAPI](openapi.json)
- [Máy chủ MCP](mcp/README.md)

## Giấy phép

[MIT](LICENSE) © HiTechCloud Vietnam
