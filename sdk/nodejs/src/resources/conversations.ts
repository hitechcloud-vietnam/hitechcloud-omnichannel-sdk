import { BaseResource } from "./base";
import { clean, Envelope } from "../httpClient";

export interface ListConversationsParams {
  channel_id?: string;
  type?: "inbox" | "comment" | "all";
  tag?: string;
  assignee_id?: string;
  unread_first?: boolean;
  since?: string;
  until?: string;
  cursor?: string;
  per_page?: number;
}

export type MessageType =
  | "text"
  | "image"
  | "file"
  | "comment_reply"
  | "private_reply"
  | "template";

export interface SendMessageBody {
  type: MessageType;
  text?: string;
  attachment_ids?: string[];
  reply_to_message_id?: string;
  template_id?: string;
  template_params?: Record<string, any>;
  mentions?: Array<Record<string, any>>;
  idempotency_key?: string;
}

/** Hội thoại (conversations). */
export class ConversationsResource extends BaseResource {
  /** GET /v1/conversations */
  list(params: ListConversationsParams = {}): Promise<Envelope> {
    return this.http.get("/v1/conversations", clean(params));
  }

  /** GET /v1/conversations/{id} */
  get(id: string): Promise<Envelope> {
    return this.http.get(`/v1/conversations/${id}`);
  }

  /** GET /v1/conversations/{id}/messages */
  listMessages(id: string, params: { before?: string; per_page?: number } = {}): Promise<Envelope> {
    return this.http.get(`/v1/conversations/${id}/messages`, clean(params));
  }

  /** POST /v1/conversations/{id}/messages */
  sendMessage(id: string, body: SendMessageBody): Promise<Envelope> {
    return this.http.post(`/v1/conversations/${id}/messages`, clean(body as any));
  }

  /** POST /v1/conversations/{id}/tags */
  tag(id: string, action: "add" | "remove", tags: string[]): Promise<Envelope> {
    return this.http.post(`/v1/conversations/${id}/tags`, { action, tags });
  }

  addTags(id: string, tags: string[]): Promise<Envelope> {
    return this.tag(id, "add", tags);
  }

  removeTags(id: string, tags: string[]): Promise<Envelope> {
    return this.tag(id, "remove", tags);
  }

  /** POST /v1/conversations/{id}/assign */
  assign(
    id: string,
    body: { assignee_ids?: string[]; strategy?: "manual" | "round_robin" } = {},
  ): Promise<Envelope> {
    return this.http.post(`/v1/conversations/${id}/assign`, clean(body));
  }

  /** POST /v1/conversations/{id}/read */
  markRead(id: string): Promise<Envelope> {
    return this.http.post(`/v1/conversations/${id}/read`);
  }

  /** POST /v1/conversations/{id}/unread */
  markUnread(id: string): Promise<Envelope> {
    return this.http.post(`/v1/conversations/${id}/unread`);
  }

  /** Duyệt toàn bộ hội thoại qua phân trang cursor. */
  async *iterate(params: ListConversationsParams = {}): AsyncGenerator<any> {
    let cursor: string | undefined = params.cursor;
    for (;;) {
      const body = await this.list({ ...params, cursor });
      for (const item of (body.data as any[]) || []) yield item;
      const pg = body.meta?.pagination || {};
      if (!pg.has_more || !pg.next_cursor) break;
      cursor = pg.next_cursor;
    }
  }
}
