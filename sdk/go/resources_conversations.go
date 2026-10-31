package omnichannel

import (
	"fmt"
	"net/url"
)

// ConversationsResource xử lý nhóm endpoint hội thoại.
type ConversationsResource struct {
	client *httpClient
}

// List - GET /v1/conversations
func (r *ConversationsResource) List(params url.Values) (*Envelope, error) {
	return r.client.get("/v1/conversations", params)
}

// Get - GET /v1/conversations/{id}
func (r *ConversationsResource) Get(id string) (*Envelope, error) {
	return r.client.get(fmt.Sprintf("/v1/conversations/%s", id), nil)
}

// ListMessages - GET /v1/conversations/{id}/messages
func (r *ConversationsResource) ListMessages(id string, params url.Values) (*Envelope, error) {
	return r.client.get(fmt.Sprintf("/v1/conversations/%s/messages", id), params)
}

// SendMessage - POST /v1/conversations/{id}/messages
func (r *ConversationsResource) SendMessage(id string, body map[string]interface{}) (*Envelope, error) {
	return r.client.post(fmt.Sprintf("/v1/conversations/%s/messages", id), body)
}

// Tag - POST /v1/conversations/{id}/tags (action: add|remove)
func (r *ConversationsResource) Tag(id, action string, tags []string) (*Envelope, error) {
	return r.client.post(fmt.Sprintf("/v1/conversations/%s/tags", id), map[string]interface{}{
		"action": action,
		"tags":   tags,
	})
}

// AddTags gắn nhãn.
func (r *ConversationsResource) AddTags(id string, tags []string) (*Envelope, error) {
	return r.Tag(id, "add", tags)
}

// RemoveTags gỡ nhãn.
func (r *ConversationsResource) RemoveTags(id string, tags []string) (*Envelope, error) {
	return r.Tag(id, "remove", tags)
}

// Assign - POST /v1/conversations/{id}/assign
func (r *ConversationsResource) Assign(id string, body map[string]interface{}) (*Envelope, error) {
	return r.client.post(fmt.Sprintf("/v1/conversations/%s/assign", id), body)
}

// MarkRead - POST /v1/conversations/{id}/read
func (r *ConversationsResource) MarkRead(id string) (*Envelope, error) {
	return r.client.post(fmt.Sprintf("/v1/conversations/%s/read", id), map[string]interface{}{})
}

// MarkUnread - POST /v1/conversations/{id}/unread
func (r *ConversationsResource) MarkUnread(id string) (*Envelope, error) {
	return r.client.post(fmt.Sprintf("/v1/conversations/%s/unread", id), map[string]interface{}{})
}
