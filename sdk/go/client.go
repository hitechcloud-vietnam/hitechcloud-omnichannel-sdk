// Package omnichannel là SDK Go chính thức cho HiTechCloud Omnichannel API.
package omnichannel

import "time"

const (
	// ProductionURL là base URL môi trường chính thức.
	ProductionURL = "https://omni.hitechcloud.vn"
	// SandboxURL là base URL môi trường thử nghiệm.
	SandboxURL = "https://omni-sandbox.hitechcloud.vn"
)

// Client là client chính của Omnichannel API.
type Client struct {
	http *httpClient

	Account       *AccountResource
	Channels      *ChannelsResource
	Conversations *ConversationsResource
	Messages      *MessagesResource
	Media         *MediaResource
	Customers     *CustomersResource
	Tags          *TagsResource
	Users         *UsersResource
	Orders        *OrdersResource
	Webhooks      *WebhooksResource
	Widget        *WidgetResource
	Stats         *StatsResource
	Sandbox       *SandboxResource
}

type config struct {
	baseURL     string
	accessToken string
	timeout     time.Duration
	maxRetries  int
}

// Option cấu hình Client.
type Option func(*config)

// WithAccessToken đặt access token Bearer.
func WithAccessToken(token string) Option {
	return func(c *config) { c.accessToken = token }
}

// WithBaseURL đặt base URL tuỳ chỉnh.
func WithBaseURL(u string) Option {
	return func(c *config) { c.baseURL = u }
}

// WithSandbox dùng môi trường Sandbox.
func WithSandbox() Option {
	return func(c *config) { c.baseURL = SandboxURL }
}

// WithTimeout đặt timeout mỗi request.
func WithTimeout(d time.Duration) Option {
	return func(c *config) { c.timeout = d }
}

// WithMaxRetries đặt số lần thử lại khi gặp 429/5xx.
func WithMaxRetries(n int) Option {
	return func(c *config) { c.maxRetries = n }
}

// NewClient tạo một Client mới.
//
// Ví dụ:
//
//	c := omnichannel.NewClient(omnichannel.WithAccessToken("YOUR_ACCESS_TOKEN"))
//	env, err := c.Channels.List(omnichannel.Params(map[string]string{"platform": "facebook"}))
func NewClient(opts ...Option) *Client {
	cfg := &config{
		baseURL:    ProductionURL,
		timeout:    30 * time.Second,
		maxRetries: 3,
	}
	for _, opt := range opts {
		opt(cfg)
	}

	hc := newHTTPClient(cfg.baseURL, cfg.accessToken, cfg.timeout, cfg.maxRetries)
	c := &Client{http: hc}

	c.Account = &AccountResource{client: hc}
	c.Channels = &ChannelsResource{client: hc}
	c.Conversations = &ConversationsResource{client: hc}
	c.Messages = &MessagesResource{client: hc}
	c.Media = &MediaResource{client: hc}
	c.Customers = &CustomersResource{client: hc}
	c.Tags = &TagsResource{client: hc}
	c.Users = &UsersResource{client: hc}
	c.Orders = &OrdersResource{client: hc}
	c.Webhooks = &WebhooksResource{client: hc}
	c.Widget = &WidgetResource{client: hc}
	c.Stats = &StatsResource{client: hc}
	c.Sandbox = &SandboxResource{client: hc}

	return c
}

// SetAccessToken đổi access token.
func (c *Client) SetAccessToken(token string) {
	c.http.setToken(token)
}

// Me - GET /v1/me (tiện ích).
func (c *Client) Me() (*Envelope, error) {
	return c.Account.Me()
}
