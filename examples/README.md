# Ví dụ sử dụng

Mỗi thư mục con là ví dụ cho một ngôn ngữ. Trước khi chạy, cài SDK tương ứng và đặt biến môi trường `OMNI_ACCESS_TOKEN`.

| Ngôn ngữ | Tệp | Chạy |
|---|---|---|
| Node.js | `nodejs/basic_usage.js`, `nodejs/webhook_server.js` | `node basic_usage.js` |
| Python | `python/basic_usage.py` | `python basic_usage.py` |
| PHP | `php/basic_usage.php` | `php basic_usage.php` |
| Go | `go/basic_usage.go` | `go run basic_usage.go` |
| Java | `java/BasicUsage.java` | biên dịch với `omnichannel-sdk` trên classpath |

Tất cả ví dụ đều dùng Production. Để thử nghiệm an toàn, chuyển sang Sandbox:

- Node: `new Omnichannel({ accessToken, sandbox: true })`
- Python: `Omnichannel(access_token=..., sandbox=True)`
- PHP: `new Client($token, null, true)`
- Go: `omnichannel.NewClient(omnichannel.WithAccessToken(...), omnichannel.WithSandbox())`
- Java: `new OmnichannelClient(token, true)`
