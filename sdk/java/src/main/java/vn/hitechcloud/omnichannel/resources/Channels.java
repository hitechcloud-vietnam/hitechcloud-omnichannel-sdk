package vn.hitechcloud.omnichannel.resources;

import vn.hitechcloud.omnichannel.HttpClient;

import java.util.Map;

/** Kênh (channels): Facebook, Instagram, Zalo, TikTok, Web. */
public class Channels extends BaseResource {
    public Channels(HttpClient http) {
        super(http);
    }

    /** GET /v1/channels */
    public Map<String, Object> list(Map<String, String> params) {
        return http.get("/v1/channels", params);
    }

    /** GET /v1/channels/{id} */
    public Map<String, Object> get(String id) {
        return http.get("/v1/channels/" + id);
    }

    /** POST /v1/channels/{id}/access-token */
    public Map<String, Object> createAccessToken(String id, java.util.List<String> scopes) {
        return http.post("/v1/channels/" + id + "/access-token",
                scopes == null ? Map.of() : Map.of("scopes", scopes));
    }

    /** GET /v1/channels/{id}/posts */
    public Map<String, Object> listPosts(String id, Map<String, String> params) {
        return http.get("/v1/channels/" + id + "/posts", params);
    }

    /** URL ảnh đại diện khách (endpoint 301 redirect tới ảnh). */
    public String avatarUrl(String id, String psid) {
        return http.getBaseUrl() + "/v1/channels/" + id + "/avatar/" + psid;
    }

    /** GET /v1/channels/{id}/round-robin */
    public Map<String, Object> getRoundRobin(String id) {
        return http.get("/v1/channels/" + id + "/round-robin");
    }

    /** PUT /v1/channels/{id}/round-robin */
    public Map<String, Object> updateRoundRobin(String id, Map<String, Object> body) {
        return http.put("/v1/channels/" + id + "/round-robin", clean(body));
    }

    /** GET /v1/channels/{id}/export */
    public Map<String, Object> exportConversations(String id, Map<String, String> params) {
        return http.get("/v1/channels/" + id + "/export", params);
    }

    /** GET /v1/channels/{id}/call-logs */
    public Map<String, Object> callLogs(String id, Map<String, String> params) {
        return http.get("/v1/channels/" + id + "/call-logs", params);
    }
}
