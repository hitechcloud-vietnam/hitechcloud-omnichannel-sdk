# Bắt đầu nhanh

Hướng dẫn này giúp bạn đi từ số 0 đến khi gửi được một tin nhắn trả lời khách qua HiTechCloud Omnichannel API.

## 1. Lấy Access Token

1. Đăng nhập `https://omni.hitechcloud.vn`.
2. Vào **Cài đặt → API & Tích hợp → Access Token**.
3. Nhấn **+ Tạo token mới**, chọn phạm vi quyền (scopes) rồi bấm Tạo.
4. Sao chép `access_token` và lưu vào biến môi trường. Token chỉ hiển thị một lần.

> Access Token cho phép đọc và trả lời tin nhắn khách hàng. Tuyệt đối không nhúng vào mã frontend hay commit lên Git — chỉ gọi API từ phía server.

## 2. Cài đặt SDK

### Node.js / TypeScript
```bash
npm install @hitechcloud-vietnam/omnichannel-sdk
```

### Python
```bash
pip install hitechcloud-omnichannel
```

### PHP
```bash
composer require hitechcloud-vietnam/omnichannel-sdk
```

### Go
```bash
go get github.com/hitechcloud-vietnam/hitechcloud-omnichannel-sdk/go
```

### Java (Maven)
```xml
<dependency>
  <groupId>vn.hitechcloud</groupId>
  <artifactId>omnichannel-sdk</artifactId>
  <version>1.0.0</version>
</dependency>
```

## 3. Gọi API đầu tiên

### Node.js
```ts
import { Omnichannel } from "@hitechcloud-vietnam/omnichannel-sdk";

const omni = new Omnichannel({ accessToken: process.env.OMNI_ACCESS_TOKEN! });
const channels = await omni.channels.list({ platform: "facebook" });
console.log(channels.data);
```

### Python
```python
from hitechcloud_omnichannel import Omnichannel
import os

omni = Omnichannel(access_token=os.getenv("OMNI_ACCESS_TOKEN"))
print(omni.channels.list(platform="facebook")["data"])
```

### PHP
```php
$omni = new HiTechCloud\Omnichannel\Client(getenv('OMNI_ACCESS_TOKEN'));
print_r($omni->channels()->list(['platform' => 'facebook']));
```

## 4. Gửi tin nhắn trả lời

```python
omni.messages.send_text("cnv_01HZABCDEF", "Chào anh/chị, HiTechCloud hỗ trợ gì cho mình ạ?")
```

```ts
await omni.messages.sendText("cnv_01HZABCDEF", "Chào anh/chị!");
```

## 5. Môi trường Sandbox

Mọi SDK đều cho phép chuyển sang Sandbox (`https://omni-sandbox.hitechcloud.vn`) để thử nghiệm an toàn mà không gửi tin thật:

- Node: `new Omnichannel({ accessToken, sandbox: true })`
- Python: `Omnichannel(access_token=..., sandbox=True)`
- PHP: `new Client($token, null, true)`
- Go: `omnichannel.NewClient(omnichannel.WithAccessToken(...), omnichannel.WithSandbox())`
- Java: `new OmnichannelClient(token, true)`

Tiếp theo: [Xác thực](authentication.md) · [Tham chiếu API](api-reference.md) · [Xử lý lỗi](error-handling.md).
