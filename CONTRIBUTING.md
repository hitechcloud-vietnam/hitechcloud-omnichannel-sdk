# Đóng góp cho HiTechCloud Omnichannel SDK

Cảm ơn bạn đã quan tâm đóng góp!

## Chuẩn bị môi trường

1. Clone kho này.
2. Chọn SDK ngôn ngữ trong `sdk/`.
3. Cài dependencies và chạy test.

| Ngôn ngữ | Cài | Test |
|---|---|---|
| Python | `pip install -e sdk/python[dev]` | `pytest sdk/python` |
| Node.js | `cd sdk/nodejs && npm install && npm run build` | `npm test` |
| PHP | `cd sdk/php && composer install` | `vendor/bin/phpunit` |
| Go | `cd sdk/go` | `go test ./...` |
| Java | `cd sdk/java` | `mvn test` |

## Nguyên tắc

- Mọi phương thức phải dựa trên một endpoint có thật trong `openapi.json`.
- Giữ cấu trúc tài nguyên nhất quán giữa các ngôn ngữ (channels, conversations, messages, media, customers, tags, users, orders, webhooks, widget, stats, sandbox, account).
- Thêm docstring/JSDoc/PHPDoc cho phương thức công khai.
- Tuân theo quy ước của từng ngôn ngữ; chạy formatter (`gofmt`, `prettier`, ...).

## Thêm một ngôn ngữ mới

1. Tạo thư mục dưới `sdk/<ngôn-ngữ>` với Client + Resources + errors + webhook verify + README + manifest.
2. Thêm test cơ bản (khởi tạo client + xác minh chữ ký webhook).
3. Thêm ví dụ trong `examples/<ngôn-ngữ>`.
4. Cập nhật `README.md` và `CHANGELOG.md`.

## Pull Request

1. Fork và tạo nhánh tính năng.
2. Thêm test cho thay đổi.
3. Đảm bảo toàn bộ test qua.
4. Gửi PR mô tả rõ thay đổi.

## Giấy phép

Khi đóng góp, bạn đồng ý rằng phần đóng góp được cấp phép theo giấy phép MIT.
