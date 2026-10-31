package omnichannel

import "testing"

func TestNewClientDefaults(t *testing.T) {
	c := NewClient(WithAccessToken("tok"))
	if c == nil {
		t.Fatal("expected non-nil client")
	}
	if c.http.baseURL != ProductionURL {
		t.Errorf("baseURL = %q, want %q", c.http.baseURL, ProductionURL)
	}
	if c.Channels == nil || c.Conversations == nil || c.Messages == nil || c.Webhooks == nil {
		t.Error("expected resources to be initialised")
	}
}

func TestWithSandbox(t *testing.T) {
	c := NewClient(WithAccessToken("tok"), WithSandbox())
	if c.http.baseURL != SandboxURL {
		t.Errorf("baseURL = %q, want %q", c.http.baseURL, SandboxURL)
	}
}

func TestVerifySignature(t *testing.T) {
	secret := "whsec_test"
	body := []byte(`{"event_type":"message.created"}`)
	sig := ComputeSignature(body, secret)

	if !VerifySignature(body, sig, secret) {
		t.Error("expected valid signature to verify")
	}
	if !VerifySignature(body, "sha256="+sig, secret) {
		t.Error("expected prefixed signature to verify")
	}
	if VerifySignature(body, "deadbeef", secret) {
		t.Error("expected invalid signature to fail")
	}
	if VerifySignature(body, "", secret) {
		t.Error("expected empty signature to fail")
	}
}

func TestAPIErrorKind(t *testing.T) {
	e := newAPIError(422, "MESSAGING_WINDOW_CLOSED", "closed", 0)
	if e.Kind() != KindMessagingWindow {
		t.Errorf("Kind = %v, want %v", e.Kind(), KindMessagingWindow)
	}
}
