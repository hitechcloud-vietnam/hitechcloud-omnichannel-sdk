package vn.hitechcloud.omnichannel.resources;

import vn.hitechcloud.omnichannel.HttpClient;

import java.util.List;
import java.util.Map;

/** Hội thoại (conversations). */
public class Conversations extends BaseResource {
    public Conversations(HttpClient http) {
        super(http);
    }

    /** GET /v1/conversations */
    public Map<String, Object> list(Map<String, String> params) {
        return http.get("/v1/conversations", params);
    }

    /** GET /v1/conversations/{id} */
    public Map<String, Object> get(String id) {
        return http.get("/v1/conversations/" + id);
    }

    /** GET /v1/conversations/{id}/messages */
    public Map<String, Object> listMessages(String id, Map<String, String> params) {
        return http.get("/v1/conversations/" + id + "/messages", params);
    }

    /** POST /v1/conversations/{id}/messages */
    public Map<String, Object> sendMessage(String id, Map<String, Object> body) {
        return http.post("/v1/conversations/" + id + "/messages", clean(body));
    }

    /** POST /v1/conversations/{id}/tags (action: add|remove) */
    public Map<String, Object> tag(String id, String action, List<String> tags) {
        return http.post("/v1/conversations/" + id + "/tags",
                Map.of("action", action, "tags", tags));
    }

    public Map<String, Object> addTags(String id, List<String> tags) {
        return tag(id, "add", tags);
    }

    public Map<String, Object> removeTags(String id, List<String> tags) {
        return tag(id, "remove", tags);
    }

    /** POST /v1/conversations/{id}/assign */
    public Map<String, Object> assign(String id, Map<String, Object> body) {
        return http.post("/v1/conversations/" + id + "/assign", clean(body));
    }

    /** POST /v1/conversations/{id}/read */
    public Map<String, Object> markRead(String id) {
        return http.post("/v1/conversations/" + id + "/read", Map.of());
    }

    /** POST /v1/conversations/{id}/unread */
    public Map<String, Object> markUnread(String id) {
        return http.post("/v1/conversations/" + id + "/unread", Map.of());
    }
}
