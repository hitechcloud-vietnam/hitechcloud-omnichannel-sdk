# HiTechCloud Omnichannel — Java SDK

SDK Java chính thức cho [HiTechCloud Omnichannel API](https://developers.hitechcloud.vn). Java 11+, dùng `java.net.http` và Gson.

## Cài đặt (Maven)

```xml
<dependency>
    <groupId>vn.hitechcloud</groupId>
    <artifactId>omnichannel-sdk</artifactId>
    <version>1.0.0</version>
</dependency>
```

## Khởi tạo

```java
import vn.hitechcloud.omnichannel.OmnichannelClient;

OmnichannelClient omni = new OmnichannelClient(System.getenv("OMNI_ACCESS_TOKEN"));
// Sandbox: new OmnichannelClient(token, true);
```

## Ví dụ nhanh

```java
import vn.hitechcloud.omnichannel.resources.BaseResource.Q;
import java.util.List;
import java.util.Map;

// Danh sách kênh
Map<String, Object> channels = omni.channels().list(Q.of().p("platform", "facebook").build());

// Gửi tin nhắn
omni.messages().sendText("cnv_01HZABCDEF", "Chào anh/chị!", null);

// Gắn nhãn + phân công
omni.conversations().addTags("cnv_01HZABCDEF", List.of("da-chot-don"));
omni.conversations().assign("cnv_01HZABCDEF", Map.of("assignee_ids", List.of("usr_01HZNV01")));

// Tạo đơn hàng
omni.orders().create("cnv_01HZABCDEF",
    List.of(Map.of("name", "Ao thun", "quantity", 2, "price", 150000)), null, null);
```

## Webhook (HMAC-SHA256, header `X-HTC-Signature`)

```java
import vn.hitechcloud.omnichannel.Webhook;

String raw = /* thân request thô */;
String sig = request.getHeader(Webhook.SIGNATURE_HEADER);
if (!Webhook.verifySignature(raw, sig, signingSecret)) {
    // 400 Bad Request
}
```

## Xử lý lỗi

```java
import vn.hitechcloud.omnichannel.MessagingWindowClosedException;
import vn.hitechcloud.omnichannel.RateLimitException;

try {
    omni.messages().sendText("cnv_01HZABCDEF", "...", null);
} catch (MessagingWindowClosedException e) {
    // ngoài cửa sổ 24h -> dùng template
} catch (RateLimitException e) {
    Thread.sleep((e.getRetryAfter() == null ? 5 : e.getRetryAfter()) * 1000L);
}
```

## License

MIT
