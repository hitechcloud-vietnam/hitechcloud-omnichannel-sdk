"use strict";

/**
 * Ví dụ cơ bản — HiTechCloud Omnichannel Node.js SDK
 *
 *   export OMNI_ACCESS_TOKEN=your-access-token
 *   node basic_usage.js
 */
const { Omnichannel, MessagingWindowClosedError } = require("@hitechcloud-vietnam/omnichannel-sdk");

async function main() {
  const omni = new Omnichannel({ accessToken: process.env.OMNI_ACCESS_TOKEN });

  // 1) Liệt kê kênh Facebook đã kết nối
  const channels = await omni.channels.list({ platform: "facebook", connected: true });
  for (const chn of channels.data || []) {
    console.log(`${chn.id} | ${chn.platform} | ${chn.name}`);
  }

  // 2) Đọc hội thoại chưa đọc của kênh đầu tiên
  const channelId = channels.data?.[0]?.id;
  if (!channelId) return;
  const convs = await omni.conversations.list({ channel_id: channelId, unread_first: true, per_page: 20 });

  // 3) Trả lời hội thoại đầu tiên
  const conv = convs.data?.[0];
  if (conv) {
    try {
      const sent = await omni.messages.sendText(conv.id, "Chào anh/chị, HiTechCloud hỗ trợ gì cho mình ạ?");
      console.log("Đã gửi:", sent.data.id);
      await omni.conversations.addTags(conv.id, ["da-tra-loi"]);
    } catch (e) {
      if (e instanceof MessagingWindowClosedError) {
        console.log("Ngoài cửa sổ 24h — cần gửi theo mẫu (template).");
      } else {
        throw e;
      }
    }
  }

  // 4) Thống kê theo kênh trong tháng
  const stats = await omni.stats.channels("2026-10-01", "2026-10-31");
  console.log("Thống kê kênh:", JSON.stringify(stats.data));
}

main().catch((err) => {
  console.error("Lỗi:", err.code || err.name, err.message);
  process.exit(1);
});
