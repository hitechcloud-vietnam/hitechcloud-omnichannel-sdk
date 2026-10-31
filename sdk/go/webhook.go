package omnichannel

import (
	"crypto/hmac"
	"crypto/sha256"
	"encoding/hex"
	"strings"
)

// SignatureHeader là tên header chứa chữ ký webhook.
const SignatureHeader = "X-HTC-Signature"

// ComputeSignature tính HMAC-SHA256 hex của thân request thô.
func ComputeSignature(rawBody []byte, signingSecret string) string {
	mac := hmac.New(sha256.New, []byte(signingSecret))
	mac.Write(rawBody)
	return hex.EncodeToString(mac.Sum(nil))
}

// VerifySignature trả về true nếu chữ ký khớp (so sánh hằng số thời gian).
// signature có thể ở dạng "sha256=<hex>" hoặc "<hex>".
func VerifySignature(rawBody []byte, signature, signingSecret string) bool {
	if signature == "" {
		return false
	}
	signature = strings.TrimSpace(signature)
	signature = strings.TrimPrefix(signature, "sha256=")
	expected := ComputeSignature(rawBody, signingSecret)
	return hmac.Equal([]byte(expected), []byte(signature))
}
