package vn.hitechcloud.omnichannel.resources;

import vn.hitechcloud.omnichannel.HttpClient;

import java.util.Map;

/** Nhãn workspace. */
public class Tags extends BaseResource {
    public Tags(HttpClient http) {
        super(http);
    }

    /** GET /v1/tags */
    public Map<String, Object> list() {
        return http.get("/v1/tags");
    }
}
