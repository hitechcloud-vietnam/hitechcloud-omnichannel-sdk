package vn.hitechcloud.omnichannel.resources;

import vn.hitechcloud.omnichannel.HttpClient;

import java.util.Map;

/** Live chat website. */
public class Widget extends BaseResource {
    public Widget(HttpClient http) {
        super(http);
    }

    /** POST /v1/widget/messages */
    public Map<String, Object> sendMessage(Map<String, Object> body) {
        return http.post("/v1/widget/messages", clean(body));
    }

    /** GET /v1/widget/messages */
    public Map<String, Object> listMessages(String channelId, String conversationId) {
        return http.get("/v1/widget/messages",
                Q.of().p("channel_id", channelId).p("conversation_id", conversationId).build());
    }
}
