package vn.hitechcloud.omnichannel.resources;

import vn.hitechcloud.omnichannel.HttpClient;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

/** Tin nhắn (messages) — tiện ích trỏ về /v1/conversations/{id}/messages. */
public class Messages extends BaseResource {
    public Messages(HttpClient http) {
        super(http);
    }

    private String path(String conversationId) {
        return "/v1/conversations/" + conversationId + "/messages";
    }

    /** POST /v1/conversations/{id}/messages */
    public Map<String, Object> send(String conversationId, Map<String, Object> body) {
        return http.post(path(conversationId), clean(body));
    }

    public Map<String, Object> sendText(String conversationId, String text, String idempotencyKey) {
        Map<String, Object> body = new LinkedHashMap<>();
        body.put("type", "text");
        body.put("text", text);
        body.put("idempotency_key", idempotencyKey);
        return send(conversationId, body);
    }

    public Map<String, Object> sendImage(String conversationId, List<String> attachmentIds) {
        Map<String, Object> body = new LinkedHashMap<>();
        body.put("type", "image");
        body.put("attachment_ids", attachmentIds);
        return send(conversationId, body);
    }

    public Map<String, Object> replyComment(String conversationId, String replyToMessageId, String text) {
        Map<String, Object> body = new LinkedHashMap<>();
        body.put("type", "comment_reply");
        body.put("reply_to_message_id", replyToMessageId);
        body.put("text", text);
        return send(conversationId, body);
    }

    public Map<String, Object> privateReply(String conversationId, String replyToMessageId, String text) {
        Map<String, Object> body = new LinkedHashMap<>();
        body.put("type", "private_reply");
        body.put("reply_to_message_id", replyToMessageId);
        body.put("text", text);
        return send(conversationId, body);
    }

    public Map<String, Object> sendTemplate(String conversationId, String templateId, Map<String, Object> templateParams) {
        Map<String, Object> body = new LinkedHashMap<>();
        body.put("type", "template");
        body.put("template_id", templateId);
        body.put("template_params", templateParams);
        return send(conversationId, body);
    }

    /** GET /v1/conversations/{id}/messages */
    public Map<String, Object> history(String conversationId, Map<String, String> params) {
        return http.get(path(conversationId), params);
    }
}
