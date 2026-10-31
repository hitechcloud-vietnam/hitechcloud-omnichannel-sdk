package omnichannel

import (
	"fmt"
	"net/url"
)

// CustomersResource xử lý nhóm endpoint khách hàng.
type CustomersResource struct {
	client *httpClient
}

// List - GET /v1/customers
func (r *CustomersResource) List(params url.Values) (*Envelope, error) {
	return r.client.get("/v1/customers", params)
}

// Get - GET /v1/customers/{id}
func (r *CustomersResource) Get(id string) (*Envelope, error) {
	return r.client.get(fmt.Sprintf("/v1/customers/%s", id), nil)
}

// Update - PUT /v1/customers/{id}
func (r *CustomersResource) Update(id string, body map[string]interface{}) (*Envelope, error) {
	return r.client.put(fmt.Sprintf("/v1/customers/%s", id), body)
}

// AddNote - POST /v1/customers/{id}/notes
func (r *CustomersResource) AddNote(id, message string) (*Envelope, error) {
	return r.client.post(fmt.Sprintf("/v1/customers/%s/notes", id), map[string]interface{}{"message": message})
}

// UpdateNote - PUT /v1/customers/{id}/notes/{note_id}
func (r *CustomersResource) UpdateNote(id, noteID, message string) (*Envelope, error) {
	return r.client.put(fmt.Sprintf("/v1/customers/%s/notes/%s", id, noteID), map[string]interface{}{"message": message})
}

// DeleteNote - DELETE /v1/customers/{id}/notes/{note_id}
func (r *CustomersResource) DeleteNote(id, noteID string) (*Envelope, error) {
	return r.client.delete(fmt.Sprintf("/v1/customers/%s/notes/%s", id, noteID))
}
