// Ví dụ cơ bản — HiTechCloud Omnichannel Java SDK
//
//   export OMNI_ACCESS_TOKEN=your-access-token
//   (biên dịch cùng omnichannel-sdk trên classpath)
import vn.hitechcloud.omnichannel.OmnichannelClient;
import vn.hitechcloud.omnichannel.MessagingWindowClosedException;
import vn.hitechcloud.omnichannel.resources.BaseResource.Q;

import java.util.List;
import java.util.Map;

public class BasicUsage {
    public static void main(String[] args) {
        OmnichannelClient omni = new OmnichannelClient(System.getenv("OMNI_ACCESS_TOKEN"));

        // 1) Liệt kê kênh Facebook đã kết nối
        Map<String, Object> channels = omni.channels().list(
                Q.of().p("platform", "facebook").p("connected", "true").build());
        System.out.println("Kênh: " + channels.get("data"));

        // 2) Trả lời một hội thoại
        try {
            Map<String, Object> sent = omni.messages().sendText(
                    "cnv_01HZABCDEF", "Chào anh/chị, HiTechCloud hỗ trợ gì cho mình ạ?", "reply-001");
            System.out.println("Đã gửi: " + sent.get("data"));
            omni.conversations().addTags("cnv_01HZABCDEF", List.of("da-tra-loi"));
        } catch (MessagingWindowClosedException e) {
            System.out.println("Ngoài cửa sổ 24h — cần gửi theo mẫu (template).");
        }

        // 3) Thống kê theo kênh
        Map<String, Object> stats = omni.stats().channels("2026-10-01", "2026-10-31");
        System.out.println("Thống kê: " + stats.get("data"));
    }
}
