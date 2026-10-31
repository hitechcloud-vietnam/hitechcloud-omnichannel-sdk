package vn.hitechcloud.omnichannel.resources;

import vn.hitechcloud.omnichannel.HttpClient;

import java.util.Map;

/** Nhân viên workspace. */
public class Users extends BaseResource {
    public Users(HttpClient http) {
        super(http);
    }

    /** GET /v1/users */
    public Map<String, Object> list() {
        return http.get("/v1/users");
    }
}
