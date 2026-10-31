package omnichannel

import (
	"fmt"
	"net/url"
)

// ChannelsResource xử lý nhóm endpoint kênh.
type ChannelsResource struct {
	client *httpClient
}

// List - GET /v1/channels
func (r *ChannelsResource) List(params url.Values) (*Envelope, error) {
	return r.client.get("/v1/channels", params)
}

// Get - GET /v1/channels/{id}
func (r *ChannelsResource) Get(id string) (*Envelope, error) {
	return r.client.get(fmt.Sprintf("/v1/channels/%s", id), nil)
}

// CreateAccessToken - POST /v1/channels/{id}/access-token
func (r *ChannelsResource) CreateAccessToken(id string, scopes []string) (*Envelope, error) {
	body := map[string]interface{}{}
	if scopes != nil {
		body["scopes"] = scopes
	}
	return r.client.post(fmt.Sprintf("/v1/channels/%s/access-token", id), body)
}

// ListPosts - GET /v1/channels/{id}/posts
func (r *ChannelsResource) ListPosts(id string, params url.Values) (*Envelope, error) {
	return r.client.get(fmt.Sprintf("/v1/channels/%s/posts", id), params)
}

// AvatarURL trả về URL ảnh đại diện khách (endpoint 301 redirect tới ảnh).
func (r *ChannelsResource) AvatarURL(id, psid string) string {
	return fmt.Sprintf("%s/v1/channels/%s/avatar/%s", r.client.baseURL, id, psid)
}

// GetRoundRobin - GET /v1/channels/{id}/round-robin
func (r *ChannelsResource) GetRoundRobin(id string) (*Envelope, error) {
	return r.client.get(fmt.Sprintf("/v1/channels/%s/round-robin", id), nil)
}

// UpdateRoundRobin - PUT /v1/channels/{id}/round-robin
func (r *ChannelsResource) UpdateRoundRobin(id string, body map[string]interface{}) (*Envelope, error) {
	return r.client.put(fmt.Sprintf("/v1/channels/%s/round-robin", id), body)
}

// ExportConversations - GET /v1/channels/{id}/export
func (r *ChannelsResource) ExportConversations(id string, params url.Values) (*Envelope, error) {
	if params == nil {
		params = url.Values{}
	}
	if params.Get("action") == "" {
		params.Set("action", "conversations_from_ads")
	}
	return r.client.get(fmt.Sprintf("/v1/channels/%s/export", id), params)
}

// CallLogs - GET /v1/channels/{id}/call-logs
func (r *ChannelsResource) CallLogs(id string, params url.Values) (*Envelope, error) {
	if params == nil {
		params = url.Values{}
	}
	if params.Get("page") == "" {
		params.Set("page", "1")
	}
	return r.client.get(fmt.Sprintf("/v1/channels/%s/call-logs", id), params)
}
