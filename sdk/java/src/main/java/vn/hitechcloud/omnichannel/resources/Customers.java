package vn.hitechcloud.omnichannel.resources;

import vn.hitechcloud.omnichannel.HttpClient;

import java.util.Map;

/** Khách hàng (customers). */
public class Customers extends BaseResource {
    public Customers(HttpClient http) {
        super(http);
    }

    /** GET /v1/customers */
    public Map<String, Object> list(Map<String, String> params) {
        return http.get("/v1/customers", params);
    }

    /** GET /v1/customers/{id} */
    public Map<String, Object> get(String id) {
        return http.get("/v1/customers/" + id);
    }

    /** PUT /v1/customers/{id} */
    public Map<String, Object> update(String id, Map<String, Object> body) {
        return http.put("/v1/customers/" + id, clean(body));
    }

    /** POST /v1/customers/{id}/notes */
    public Map<String, Object> addNote(String id, String message) {
        return http.post("/v1/customers/" + id + "/notes", Map.of("message", message));
    }

    /** PUT /v1/customers/{id}/notes/{note_id} */
    public Map<String, Object> updateNote(String id, String noteId, String message) {
        return http.put("/v1/customers/" + id + "/notes/" + noteId, Map.of("message", message));
    }

    /** DELETE /v1/customers/{id}/notes/{note_id} */
    public Map<String, Object> deleteNote(String id, String noteId) {
        return http.delete("/v1/customers/" + id + "/notes/" + noteId);
    }
}
