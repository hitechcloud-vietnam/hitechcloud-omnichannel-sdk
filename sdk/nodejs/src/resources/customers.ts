import { BaseResource } from "./base";
import { clean, Envelope } from "../httpClient";

export interface ListCustomersParams {
  channel_id?: string;
  q?: string;
  since?: string;
  page?: number;
  per_page?: number;
}

export interface CustomerUpdate {
  name?: string;
  phone?: string;
  email?: string;
  address?: string;
  [key: string]: any;
}

/** Khách hàng (customers). */
export class CustomersResource extends BaseResource {
  /** GET /v1/customers */
  list(params: ListCustomersParams = {}): Promise<Envelope> {
    return this.http.get("/v1/customers", clean(params));
  }

  /** GET /v1/customers/{id} */
  get(id: string): Promise<Envelope> {
    return this.http.get(`/v1/customers/${id}`);
  }

  /** PUT /v1/customers/{id} */
  update(id: string, body: CustomerUpdate): Promise<Envelope> {
    return this.http.put(`/v1/customers/${id}`, clean(body));
  }

  /** POST /v1/customers/{id}/notes */
  addNote(id: string, message: string): Promise<Envelope> {
    return this.http.post(`/v1/customers/${id}/notes`, { message });
  }

  /** PUT /v1/customers/{id}/notes/{note_id} */
  updateNote(id: string, noteId: string, message: string): Promise<Envelope> {
    return this.http.put(`/v1/customers/${id}/notes/${noteId}`, { message });
  }

  /** DELETE /v1/customers/{id}/notes/{note_id} */
  deleteNote(id: string, noteId: string): Promise<Envelope> {
    return this.http.delete(`/v1/customers/${id}/notes/${noteId}`);
  }
}
