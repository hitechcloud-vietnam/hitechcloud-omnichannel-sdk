package omnichannel

import "fmt"

// MessagesResource là tiện ích gửi/đọc tin nhắn qua endpoint hội thoại.
type MessagesResource struct {
	client *httpClient
}

func (r *MessagesResource) path(conversationID string) string {
	return fmt.Sprintf("/v1/conversations/%s/messages", conversationID)
}

// Send - POST /v1/conversations/{id}/messages
func (r *MessagesResource) Send(conversationID string, body map[string]interface{}) (*Envelope, error) {
	return r.client.post(r.path(conversationID), body)
}

// SendText gửi tin văn bản (type=text).
func (r *MessagesResource) SendText(conversationID, text, idempotencyKey string) (*Envelope, error) {
	body := map[string]interface{}{"type": "text", "text": text}
	if idempotencyKey != "" {
		body["idempotency_key"] = idempotencyKey
	}
	return r.Send(conversationID, body)
}

// SendImage gửi ảnh đã upload (type=image).
func (r *MessagesResource) SendImage(conversationID string, attachmentIDs []string) (*Envelope, error) {
	return r.Send(conversationID, map[string]interface{}{
		"type":           "image",
		"attachment_ids": attachmentIDs,
	})
}

// ReplyComment trả lời công khai dưới bình luận (type=comment_reply).
func (r *MessagesResource) ReplyComment(conversationID, replyToMessageID, text string) (*Envelope, error) {
	return r.Send(conversationID, map[string]interface{}{
		"type":                "comment_reply",
		"reply_to_message_id": replyToMessageID,
		"text":                text,
	})
}

// PrivateReply nhắn riêng cho người bình luận (type=private_reply).
func (r *MessagesResource) PrivateReply(conversationID, replyToMessageID, text string) (*Envelope, error) {
	return r.Send(conversationID, map[string]interface{}{
		"type":                "private_reply",
		"reply_to_message_id": replyToMessageID,
		"text":                text,
	})
}

// SendTemplate gửi tin theo mẫu đã duyệt (type=template).
func (r *MessagesResource) SendTemplate(conversationID, templateID string, templateParams map[string]interface{}) (*Envelope, error) {
	return r.Send(conversationID, map[string]interface{}{
		"type":            "template",
		"template_id":     templateID,
		"template_params": templateParams,
	})
}
