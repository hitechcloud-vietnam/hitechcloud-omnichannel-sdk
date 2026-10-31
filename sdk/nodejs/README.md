# HiTechCloud Omnichannel — Node.js / TypeScript SDK

SDK TypeScript chính thức cho [HiTechCloud Omnichannel API](https://developers.hitechcloud.vn).

## Cài đặt

```bash
npm install @hitechcloud-vietnam/omnichannel-sdk
```

Yêu cầu Node.js >= 18 (dùng `fetch` và `FormData` sẵn có).

## Khởi tạo

```ts
import { Omnichannel } from "@hitechcloud-vietnam/omnichannel-sdk";

const omni = new Omnichannel({ accessToken: process.env.OMNI_ACCESS_TOKEN! });
// Sandbox: new Omnichannel({ accessToken: "...", sandbox: true })
```

## Ví dụ nhanh

```ts
// Danh sách kênh
const channels = await omni.channels.list({ platform: "facebook", connected: true });

// Hội thoại chưa đọc
const convs = await omni.conversations.list({
  channel_id: "chn_01HZX8QWERTY",
  unread_first: true,
});

// Gửi tin nhắn
await omni.messages.sendText("cnv_01HZABCDEF", "Chào anh/chị!");

// Gắn nhãn + phân công
await omni.conversations.addTags("cnv_01HZABCDEF", ["da-chot-don"]);
await omni.conversations.assign("cnv_01HZABCDEF", { assignee_ids: ["usr_01HZNV01"] });

// Tạo đơn hàng
await omni.orders.create({
  conversation_id: "cnv_01HZABCDEF",
  items: [{ name: "Ao thun", quantity: 2, price: 150000 }],
});
```

## Phân trang cursor

```ts
for await (const conv of omni.conversations.iterate({ channel_id: "chn_01HZX8QWERTY", per_page: 60 })) {
  console.log(conv.id, conv.customer.name);
}
```

## Webhook (HMAC-SHA256, header `X-HTC-Signature`)

```ts
import express from "express";
import { verifySignature } from "@hitechcloud-vietnam/omnichannel-sdk";

const app = express();
app.post("/htc/webhook", express.raw({ type: "*/*" }), (req, res) => {
  const raw = req.body.toString("utf8");
  const sig = req.header("X-HTC-Signature");
  if (!verifySignature(raw, sig, process.env.SIGNING_SECRET!)) {
    return res.status(400).send("invalid signature");
  }
  const event = JSON.parse(raw);
  // xử lý idempotent theo event.event_id
  res.sendStatus(200);
});
```

## Xử lý lỗi

```ts
import { RateLimitError, MessagingWindowClosedError } from "@hitechcloud-vietnam/omnichannel-sdk";

try {
  await omni.messages.sendText("cnv_01HZABCDEF", "...");
} catch (e) {
  if (e instanceof MessagingWindowClosedError) {
    // ngoài cửa sổ 24h -> dùng template
  } else if (e instanceof RateLimitError) {
    await new Promise((r) => setTimeout(r, (e.retryAfter ?? 5) * 1000));
  } else {
    throw e;
  }
}
```

## Build

```bash
npm run build   # tsc -> dist/
```

## License

MIT
