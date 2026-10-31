package vn.hitechcloud.omnichannel.resources;

import vn.hitechcloud.omnichannel.HttpClient;

import java.util.Map;

/** Thông tin token. */
public class Account extends BaseResource {
    public Account(HttpClient http) {
        super(http);
    }

    /** GET /v1/me */
    public Map<String, Object> me() {
        return http.get("/v1/me");
    }
}
