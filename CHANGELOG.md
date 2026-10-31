# Changelog

Mọi thay đổi đáng chú ý của HiTechCloud Omnichannel SDK được ghi lại trong tệp này.

Định dạng theo [Keep a Changelog](https://keepachangelog.com/vi/1.1.0/) và tuân thủ [Semantic Versioning](https://semver.org/lang/vi/).

## [1.0.0] - 2026-11-01

### Added
- Phát hành lần đầu SDK đa ngôn ngữ: Node.js/TypeScript, Python, PHP, Go, Java.
- Bao phủ đầy đủ Omnichannel API `/v1`: kênh, hội thoại, tin nhắn (text/image/file/comment_reply/private_reply/template), upload media, khách hàng + ghi chú, nhãn, phân công nhân viên, chia tự động (round-robin), đơn hàng, bài viết, web widget, nhật ký cuộc gọi, xuất dữ liệu, thống kê, và quản lý webhook.
- Tiện ích xác minh chữ ký webhook HMAC-SHA256 (`X-HTC-Signature`) cho cả 5 ngôn ngữ.
- Tự thử lại (retry) với backoff cho `429`/`5xx`, tôn trọng `Retry-After`.
- Ánh xạ lỗi theo Envelope `code` sang lớp ngoại lệ riêng của từng ngôn ngữ.
- Hỗ trợ môi trường Sandbox (`omni-sandbox.hitechcloud.vn`).
- Đặc tả OpenAPI 3.0, tài liệu tiếng Việt, ví dụ cho mọi ngôn ngữ, và máy chủ MCP (Node).
