"""Tài nguyên Khách hàng (customers)."""

from .base import BaseResource


class CustomersResource(BaseResource):
    """Hồ sơ khách hàng hợp nhất theo định danh từng kênh, kèm ghi chú."""

    def list(self, channel_id=None, q=None, since=None, page=None, per_page=None):
        """GET /v1/customers — Danh sách khách hàng."""
        return self._http.get("/v1/customers", self._clean({
            "channel_id": channel_id, "q": q, "since": since,
            "page": page, "per_page": per_page,
        }))

    def get(self, customer_id):
        """GET /v1/customers/{id} — Chi tiết khách hàng."""
        return self._http.get("/v1/customers/%s" % customer_id)

    def update(self, customer_id, name=None, phone=None, email=None, address=None, **extra):
        """PUT /v1/customers/{id} — Cập nhật hồ sơ khách hàng."""
        body = self._clean({
            "name": name, "phone": phone, "email": email, "address": address,
        }) or {}
        body.update(extra)
        return self._http.put("/v1/customers/%s" % customer_id, body)

    def add_note(self, customer_id, message):
        """POST /v1/customers/{id}/notes — Thêm ghi chú nội bộ."""
        return self._http.post("/v1/customers/%s/notes" % customer_id, {"message": message})

    def update_note(self, customer_id, note_id, message):
        """PUT /v1/customers/{id}/notes/{note_id} — Sửa ghi chú."""
        return self._http.put("/v1/customers/%s/notes/%s" % (customer_id, note_id),
                              {"message": message})

    def delete_note(self, customer_id, note_id):
        """DELETE /v1/customers/{id}/notes/{note_id} — Xoá ghi chú."""
        return self._http.delete("/v1/customers/%s/notes/%s" % (customer_id, note_id))
