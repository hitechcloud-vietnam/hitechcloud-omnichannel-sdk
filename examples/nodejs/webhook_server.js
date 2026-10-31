"use strict";

/**
 * Ví dụ webhook — xác minh chữ ký X-HTC-Signature rồi xử lý sự kiện.
 *
 *   export SIGNING_SECRET=whsec_...
 *   node webhook_server.js
 */
const http = require("http");
const { verifySignature } = require("@hitechcloud-vietnam/omnichannel-sdk");

const SIGNING_SECRET = process.env.SIGNING_SECRET || "";
const seen = new Set(); // chống xử lý trùng theo event_id (at-least-once)

const server = http.createServer((req, res) => {
  if (req.method !== "POST" || req.url !== "/htc/webhook") {
    res.writeHead(404);
    return res.end();
  }

  const chunks = [];
  req.on("data", (c) => chunks.push(c));
  req.on("end", () => {
    const raw = Buffer.concat(chunks).toString("utf8");
    const sig = req.headers["x-htc-signature"];

    if (!verifySignature(raw, sig, SIGNING_SECRET)) {
      res.writeHead(400);
      return res.end("invalid signature");
    }

    const event = JSON.parse(raw);
    if (seen.has(event.event_id)) {
      res.writeHead(200);
      return res.end("ok (duplicate)");
    }
    seen.add(event.event_id);

    switch (event.event_type) {
      case "message.created":
        console.log("Tin nhắn mới:", event.data.message.text);
        break;
      case "order.updated":
        console.log("Đơn hàng cập nhật:", event.data.order.status);
        break;
      default:
        console.log("Sự kiện:", event.event_type);
    }

    res.writeHead(200);
    res.end("ok");
  });
});

server.listen(3000, () => console.log("Webhook listener trên http://localhost:3000/htc/webhook"));
