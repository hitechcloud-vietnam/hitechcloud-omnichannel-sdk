package vn.hitechcloud.omnichannel.resources;

import vn.hitechcloud.omnichannel.HttpClient;

import java.util.List;
import java.util.Map;

/** Đơn hàng từ hội thoại. */
public class Orders extends BaseResource {
    public Orders(HttpClient http) {
        super(http);
    }

    /** GET /v1/orders */
    public Map<String, Object> list(Map<String, String> params) {
        return http.get("/v1/orders", params);
    }

    /** POST /v1/orders */
    public Map<String, Object> create(String conversationId, List<Map<String, Object>> items,
                                      Map<String, Object> shippingAddress, String note) {
        java.util.Map<String, Object> body = new java.util.LinkedHashMap<>();
        body.put("conversation_id", conversationId);
        body.put("items", items);
        body.put("shipping_address", shippingAddress);
        body.put("note", note);
        return http.post("/v1/orders", clean(body));
    }

    /** GET /v1/orders/{id} */
    public Map<String, Object> get(String id) {
        return http.get("/v1/orders/" + id);
    }

    /** PUT /v1/orders/{id} */
    public Map<String, Object> update(String id, Map<String, Object> body) {
        return http.put("/v1/orders/" + id, clean(body));
    }
}
