# HiTechCloud Omnichannel — Go SDK

SDK Go chính thức cho [HiTechCloud Omnichannel API](https://developers.hitechcloud.vn).

## Cài đặt

```bash
go get github.com/hitechcloud-vietnam/hitechcloud-omnichannel-sdk/go
```

```go
import omnichannel "github.com/hitechcloud-vietnam/hitechcloud-omnichannel-sdk/go"
```

## Khởi tạo

```go
c := omnichannel.NewClient(
    omnichannel.WithAccessToken(os.Getenv("OMNI_ACCESS_TOKEN")),
    // omnichannel.WithSandbox(),
)
```

## Ví dụ nhanh

```go
// Danh sách kênh
env, err := c.Channels.List(omnichannel.Params(map[string]string{"platform": "facebook"}))

// Gửi tin nhắn
_, err = c.Messages.SendText("cnv_01HZABCDEF", "Chào anh/chị!", "")

// Gắn nhãn + phân công
_, _ = c.Conversations.AddTags("cnv_01HZABCDEF", []string{"da-chot-don"})
_, _ = c.Conversations.Assign("cnv_01HZABCDEF", map[string]interface{}{
    "assignee_ids": []string{"usr_01HZNV01"},
})

// Tạo đơn hàng
_, _ = c.Orders.Create(map[string]interface{}{
    "conversation_id": "cnv_01HZABCDEF",
    "items": []map[string]interface{}{
        {"name": "Ao thun", "quantity": 2, "price": 150000},
    },
})
```

## Đọc dữ liệu từ Envelope

```go
env, _ := c.Channels.List(nil)
var channels []map[string]interface{}
_ = env.DecodeData(&channels)
```

## Webhook (HMAC-SHA256, header `X-HTC-Signature`)

```go
func handler(w http.ResponseWriter, r *http.Request) {
    raw, _ := io.ReadAll(r.Body)
    sig := r.Header.Get(omnichannel.SignatureHeader)
    if !omnichannel.VerifySignature(raw, sig, signingSecret) {
        http.Error(w, "invalid signature", http.StatusBadRequest)
        return
    }
    // xử lý idempotent theo event_id
    w.WriteHeader(http.StatusOK)
}
```

## Xử lý lỗi

```go
_, err := c.Messages.SendText("cnv_01HZABCDEF", "...", "")
if apiErr, ok := err.(*omnichannel.APIError); ok {
    switch apiErr.Kind() {
    case omnichannel.KindMessagingWindow:
        // dùng template
    case omnichannel.KindRateLimit:
        time.Sleep(time.Duration(apiErr.RetryAfter) * time.Second)
    }
}
```

## License

MIT
