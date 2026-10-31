package omnichannel

import (
	"fmt"
	"net/url"
)

// AccountResource - thông tin token.
type AccountResource struct {
	client *httpClient
}

// Me - GET /v1/me
func (r *AccountResource) Me() (*Envelope, error) {
	return r.client.get("/v1/me", nil)
}

// TagsResource - nhãn workspace.
type TagsResource struct {
	client *httpClient
}

// List - GET /v1/tags
func (r *TagsResource) List() (*Envelope, error) {
	return r.client.get("/v1/tags", nil)
}

// UsersResource - nhân viên workspace.
type UsersResource struct {
	client *httpClient
}

// List - GET /v1/users
func (r *UsersResource) List() (*Envelope, error) {
	return r.client.get("/v1/users", nil)
}

// OrdersResource - đơn hàng từ hội thoại.
type OrdersResource struct {
	client *httpClient
}

// List - GET /v1/orders
func (r *OrdersResource) List(params url.Values) (*Envelope, error) {
	return r.client.get("/v1/orders", params)
}

// Create - POST /v1/orders
func (r *OrdersResource) Create(body map[string]interface{}) (*Envelope, error) {
	return r.client.post("/v1/orders", body)
}

// Get - GET /v1/orders/{id}
func (r *OrdersResource) Get(id string) (*Envelope, error) {
	return r.client.get(fmt.Sprintf("/v1/orders/%s", id), nil)
}

// Update - PUT /v1/orders/{id}
func (r *OrdersResource) Update(id string, body map[string]interface{}) (*Envelope, error) {
	return r.client.put(fmt.Sprintf("/v1/orders/%s", id), body)
}

// WebhooksResource - webhook realtime.
type WebhooksResource struct {
	client *httpClient
}

// List - GET /v1/webhooks
func (r *WebhooksResource) List() (*Envelope, error) {
	return r.client.get("/v1/webhooks", nil)
}

// Create - POST /v1/webhooks (trả về signing_secret)
func (r *WebhooksResource) Create(body map[string]interface{}) (*Envelope, error) {
	return r.client.post("/v1/webhooks", body)
}

// Delete - DELETE /v1/webhooks/{id}
func (r *WebhooksResource) Delete(id string) (*Envelope, error) {
	return r.client.delete(fmt.Sprintf("/v1/webhooks/%s", id))
}

// WidgetResource - live chat website.
type WidgetResource struct {
	client *httpClient
}

// SendMessage - POST /v1/widget/messages
func (r *WidgetResource) SendMessage(body map[string]interface{}) (*Envelope, error) {
	return r.client.post("/v1/widget/messages", body)
}

// ListMessages - GET /v1/widget/messages
func (r *WidgetResource) ListMessages(channelID, conversationID string) (*Envelope, error) {
	return r.client.get("/v1/widget/messages", Params(map[string]string{
		"channel_id": channelID, "conversation_id": conversationID,
	}))
}

// SandboxResource - công cụ thử nghiệm.
type SandboxResource struct {
	client *httpClient
}

// SimulateIncomingMessage - POST /v1/sandbox/simulate/incoming-message
func (r *SandboxResource) SimulateIncomingMessage(channelID, text, customerName string) (*Envelope, error) {
	body := map[string]interface{}{"channel_id": channelID, "text": text}
	if customerName != "" {
		body["customer_name"] = customerName
	}
	return r.client.post("/v1/sandbox/simulate/incoming-message", body)
}
