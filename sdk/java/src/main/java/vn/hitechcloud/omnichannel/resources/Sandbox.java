package vn.hitechcloud.omnichannel.resources;

import vn.hitechcloud.omnichannel.HttpClient;

import java.util.LinkedHashMap;
import java.util.Map;

/** Công cụ thử nghiệm (chỉ Sandbox). */
public class Sandbox extends BaseResource {
    public Sandbox(HttpClient http) {
        super(http);
    }

    /** POST /v1/sandbox/simulate/incoming-message */
    public Map<String, Object> simulateIncomingMessage(String channelId, String text, String customerName) {
        Map<String, Object> body = new LinkedHashMap<>();
        body.put("channel_id", channelId);
        body.put("text", text);
        body.put("customer_name", customerName);
        return http.post("/v1/sandbox/simulate/incoming-message", clean(body));
    }
}
