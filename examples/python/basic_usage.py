#!/usr/bin/env python3
"""
Ví dụ cơ bản — HiTechCloud Omnichannel Python SDK

    export OMNI_ACCESS_TOKEN=your-access-token
    python basic_usage.py
"""
import os

from hitechcloud_omnichannel import Omnichannel, MessagingWindowClosedError


def main():
    omni = Omnichannel(access_token=os.getenv("OMNI_ACCESS_TOKEN"))

    # 1) Liệt kê kênh Facebook đã kết nối
    channels = omni.channels.list(platform="facebook", connected=True)
    for chn in channels.get("data", []):
        print(chn["id"], "|", chn["platform"], "|", chn.get("name"))

    data = channels.get("data") or []
    if not data:
        return
    channel_id = data[0]["id"]

    # 2) Đọc hội thoại chưa đọc
    convs = omni.conversations.list(channel_id=channel_id, unread_first=True, per_page=20)

    # 3) Trả lời hội thoại đầu tiên
    conv_list = convs.get("data") or []
    if conv_list:
        conv_id = conv_list[0]["id"]
        try:
            sent = omni.messages.send_text(conv_id, "Chào anh/chị, HiTechCloud hỗ trợ gì cho mình ạ?")
            print("Đã gửi:", sent["data"]["id"])
            omni.conversations.add_tags(conv_id, ["da-tra-loi"])
        except MessagingWindowClosedError:
            print("Ngoài cửa sổ 24h — cần gửi theo mẫu (template).")

    # 4) Duyệt toàn bộ hội thoại qua cursor
    total = sum(1 for _ in omni.conversations.iterate(channel_id=channel_id, per_page=60))
    print("Tổng hội thoại:", total)

    # 5) Thống kê theo kênh
    stats = omni.stats.channels("2026-10-01", "2026-10-31")
    print("Thống kê:", stats.get("data"))


if __name__ == "__main__":
    main()
