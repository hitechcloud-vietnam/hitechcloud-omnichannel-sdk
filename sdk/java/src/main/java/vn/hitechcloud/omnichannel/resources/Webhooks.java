package vn.hitechcloud.omnichannel.resources;

import vn.hitechcloud.omnichannel.HttpClient;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

/** Webhook realtime. */
public class Webhooks extends BaseResource {
    public Webhooks(HttpClient http) {
        super(http);
    }

    /** GET /v1/webhooks */
    public Map<String, Object> list() {
        return http.get("/v1/webhooks");
    }

    /** POST /v1/webhooks (trả về signing_secret). */
    public Map<String, Object> create(String url, List<String> events, List<String> channelIds) {
        Map<String, Object> body = new LinkedHashMap<>();
        body.put("url", url);
        body.put("events", events);
        body.put("channel_ids", channelIds);
        return http.post("/v1/webhooks", clean(body));
    }

    /** DELETE /v1/webhooks/{id} */
    public Map<String, Object> delete(String id) {
        return http.delete("/v1/webhooks/" + id);
    }
}
