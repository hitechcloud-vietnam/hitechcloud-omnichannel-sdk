package omnichannel

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"net/url"
	"strconv"
	"strings"
	"time"
)

// Version của SDK.
const Version = "1.0.0"

// Envelope là cấu trúc phản hồi chung của Omnichannel API.
type Envelope struct {
	Status string          `json:"status"`
	Data   json.RawMessage `json:"data,omitempty"`
	Meta   json.RawMessage `json:"meta,omitempty"`
	// Các trường lỗi (khi status == "error")
	Code       string `json:"code,omitempty"`
	Message    string `json:"message,omitempty"`
	RetryAfter int    `json:"retry_after,omitempty"`
}

// DecodeData giải mã trường data vào v.
func (e *Envelope) DecodeData(v interface{}) error {
	if len(e.Data) == 0 {
		return nil
	}
	return json.Unmarshal(e.Data, v)
}

type httpClient struct {
	baseURL     string
	accessToken string
	maxRetries  int
	hc          *http.Client
}

func newHTTPClient(baseURL, accessToken string, timeout time.Duration, maxRetries int) *httpClient {
	return &httpClient{
		baseURL:     strings.TrimRight(baseURL, "/"),
		accessToken: accessToken,
		maxRetries:  maxRetries,
		hc:          &http.Client{Timeout: timeout},
	}
}

func (c *httpClient) setToken(token string) { c.accessToken = token }

func (c *httpClient) buildURL(path string, params url.Values) string {
	u := c.baseURL + path
	if len(params) > 0 {
		u += "?" + params.Encode()
	}
	return u
}

func (c *httpClient) doRequest(method, path string, params url.Values, body interface{}) (*Envelope, error) {
	var lastErr error

	for attempt := 0; attempt <= c.maxRetries; attempt++ {
		var reader io.Reader
		if body != nil {
			payload, err := json.Marshal(body)
			if err != nil {
				return nil, fmt.Errorf("omnichannel: marshal body: %w", err)
			}
			reader = bytes.NewReader(payload)
		}

		req, err := http.NewRequest(method, c.buildURL(path, params), reader)
		if err != nil {
			return nil, fmt.Errorf("omnichannel: new request: %w", err)
		}
		req.Header.Set("Accept", "application/json")
		req.Header.Set("User-Agent", "HiTechCloud-Omnichannel-Go/"+Version)
		if body != nil {
			req.Header.Set("Content-Type", "application/json")
		}
		if c.accessToken != "" {
			req.Header.Set("Authorization", "Bearer "+c.accessToken)
		}

		resp, err := c.hc.Do(req)
		if err != nil {
			lastErr = err
			if attempt < c.maxRetries {
				time.Sleep(backoff(attempt))
				continue
			}
			return nil, fmt.Errorf("omnichannel: request failed: %w", err)
		}

		respBody, _ := io.ReadAll(resp.Body)
		resp.Body.Close()

		retryAfter := parseRetryAfter(resp.Header.Get("Retry-After"))

		if resp.StatusCode == http.StatusTooManyRequests && attempt < c.maxRetries {
			time.Sleep(retryOrBackoff(retryAfter, attempt))
			continue
		}
		if resp.StatusCode >= 500 && attempt < c.maxRetries {
			time.Sleep(backoff(attempt))
			continue
		}

		var env Envelope
		if len(respBody) > 0 {
			if err := json.Unmarshal(respBody, &env); err != nil {
				if resp.StatusCode >= 400 {
					return nil, newAPIError(resp.StatusCode, "", truncate(string(respBody), 200), retryAfter)
				}
				return nil, fmt.Errorf("omnichannel: unmarshal response: %w", err)
			}
		}

		if resp.StatusCode >= 400 || env.Status == "error" {
			ra := env.RetryAfter
			if ra == 0 {
				ra = retryAfter
			}
			return nil, newAPIError(resp.StatusCode, env.Code, env.Message, ra)
		}

		return &env, nil
	}

	return nil, fmt.Errorf("omnichannel: request failed after %d retries: %v", c.maxRetries, lastErr)
}

func (c *httpClient) get(path string, params url.Values) (*Envelope, error) {
	return c.doRequest(http.MethodGet, path, params, nil)
}

func (c *httpClient) post(path string, body interface{}) (*Envelope, error) {
	return c.doRequest(http.MethodPost, path, nil, body)
}

func (c *httpClient) put(path string, body interface{}) (*Envelope, error) {
	return c.doRequest(http.MethodPut, path, nil, body)
}

func (c *httpClient) delete(path string) (*Envelope, error) {
	return c.doRequest(http.MethodDelete, path, nil, nil)
}

// postMultipart gửi multipart/form-data (dùng cho upload media). Không retry
// để tránh đọc lại body đã tiêu thụ.
func (c *httpClient) postMultipart(path, contentType string, body []byte) (*Envelope, error) {
	req, err := http.NewRequest(http.MethodPost, c.buildURL(path, nil), bytes.NewReader(body))
	if err != nil {
		return nil, fmt.Errorf("omnichannel: new request: %w", err)
	}
	req.Header.Set("Accept", "application/json")
	req.Header.Set("User-Agent", "HiTechCloud-Omnichannel-Go/"+Version)
	req.Header.Set("Content-Type", contentType)
	if c.accessToken != "" {
		req.Header.Set("Authorization", "Bearer "+c.accessToken)
	}

	resp, err := c.hc.Do(req)
	if err != nil {
		return nil, fmt.Errorf("omnichannel: request failed: %w", err)
	}
	respBody, _ := io.ReadAll(resp.Body)
	resp.Body.Close()
	retryAfter := parseRetryAfter(resp.Header.Get("Retry-After"))

	var env Envelope
	if len(respBody) > 0 {
		if err := json.Unmarshal(respBody, &env); err != nil {
			if resp.StatusCode >= 400 {
				return nil, newAPIError(resp.StatusCode, "", truncate(string(respBody), 200), retryAfter)
			}
			return nil, fmt.Errorf("omnichannel: unmarshal response: %w", err)
		}
	}
	if resp.StatusCode >= 400 || env.Status == "error" {
		ra := env.RetryAfter
		if ra == 0 {
			ra = retryAfter
		}
		return nil, newAPIError(resp.StatusCode, env.Code, env.Message, ra)
	}
	return &env, nil
}

func backoff(attempt int) time.Duration {
	return time.Duration(1<<uint(attempt)) * time.Second
}

func retryOrBackoff(retryAfter, attempt int) time.Duration {
	if retryAfter > 0 {
		return time.Duration(retryAfter) * time.Second
	}
	return backoff(attempt)
}

func parseRetryAfter(h string) int {
	if h == "" {
		return 0
	}
	n, _ := strconv.Atoi(h)
	return n
}

func truncate(s string, n int) string {
	if len(s) <= n {
		return s
	}
	return s[:n]
}

// Params là tiện ích dựng url.Values, bỏ qua giá trị rỗng.
func Params(kv map[string]string) url.Values {
	v := url.Values{}
	for k, val := range kv {
		if val != "" {
			v.Set(k, val)
		}
	}
	return v
}
