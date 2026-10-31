package omnichannel

import (
	"bytes"
	"fmt"
	"io"
	"mime/multipart"
	"os"
)

// MediaResource xử lý upload media.
type MediaResource struct {
	client *httpClient
}

// Upload - POST /v1/media (multipart/form-data). Trả về Envelope chứa attachment_id.
func (r *MediaResource) Upload(file io.Reader, filename, channelID string) (*Envelope, error) {
	var buf bytes.Buffer
	w := multipart.NewWriter(&buf)

	part, err := w.CreateFormFile("file", filename)
	if err != nil {
		return nil, fmt.Errorf("omnichannel: create form file: %w", err)
	}
	if _, err := io.Copy(part, file); err != nil {
		return nil, fmt.Errorf("omnichannel: copy file: %w", err)
	}
	if channelID != "" {
		if err := w.WriteField("channel_id", channelID); err != nil {
			return nil, fmt.Errorf("omnichannel: write field: %w", err)
		}
	}
	if err := w.Close(); err != nil {
		return nil, fmt.Errorf("omnichannel: close writer: %w", err)
	}

	return r.client.postMultipart("/v1/media", w.FormDataContentType(), buf.Bytes())
}

// UploadFile tải lên theo đường dẫn tệp.
func (r *MediaResource) UploadFile(path, channelID string) (*Envelope, error) {
	f, err := os.Open(path)
	if err != nil {
		return nil, fmt.Errorf("omnichannel: open file: %w", err)
	}
	defer f.Close()

	name := path
	if i := lastSlash(path); i >= 0 {
		name = path[i+1:]
	}
	return r.Upload(f, name, channelID)
}

func lastSlash(s string) int {
	for i := len(s) - 1; i >= 0; i-- {
		if s[i] == '/' || s[i] == '\\' {
			return i
		}
	}
	return -1
}
