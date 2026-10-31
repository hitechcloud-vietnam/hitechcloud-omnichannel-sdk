import { BaseResource } from "./base";
import { clean, Envelope } from "../httpClient";

/** Thông tin token. */
export class AccountResource extends BaseResource {
  /** GET /v1/me */
  me(): Promise<Envelope> {
    return this.http.get("/v1/me");
  }
}

/** Nhãn workspace. */
export class TagsResource extends BaseResource {
  /** GET /v1/tags */
  list(): Promise<Envelope> {
    return this.http.get("/v1/tags");
  }
}

/** Nhân viên workspace. */
export class UsersResource extends BaseResource {
  /** GET /v1/users */
  list(): Promise<Envelope> {
    return this.http.get("/v1/users");
  }
}

export interface ListOrdersParams {
  channel_id?: string;
  conversation_id?: string;
  status?: string;
  page?: number;
  per_page?: number;
}

export interface CreateOrderBody {
  conversation_id: string;
  items: Array<Record<string, any>>;
  shipping_address?: Record<string, any>;
  note?: string;
}

/** Đơn hàng từ hội thoại. */
export class OrdersResource extends BaseResource {
  /** GET /v1/orders */
  list(params: ListOrdersParams = {}): Promise<Envelope> {
    return this.http.get("/v1/orders", clean(params));
  }

  /** POST /v1/orders */
  create(body: CreateOrderBody): Promise<Envelope> {
    return this.http.post("/v1/orders", clean(body as any));
  }

  /** GET /v1/orders/{id} */
  get(id: string): Promise<Envelope> {
    return this.http.get(`/v1/orders/${id}`);
  }

  /** PUT /v1/orders/{id} */
  update(id: string, body: Record<string, any>): Promise<Envelope> {
    return this.http.put(`/v1/orders/${id}`, clean(body));
  }
}

export interface CreateWebhookBody {
  url: string;
  events: string[];
  channel_ids?: string[];
}

/** Webhook realtime. */
export class WebhooksResource extends BaseResource {
  /** GET /v1/webhooks */
  list(): Promise<Envelope> {
    return this.http.get("/v1/webhooks");
  }

  /** POST /v1/webhooks (trả về signing_secret). */
  create(body: CreateWebhookBody): Promise<Envelope> {
    return this.http.post("/v1/webhooks", clean(body as any));
  }

  /** DELETE /v1/webhooks/{id} */
  delete(id: string): Promise<Envelope> {
    return this.http.delete(`/v1/webhooks/${id}`);
  }
}

export interface WidgetSendBody {
  channel_id: string;
  visitor_id: string;
  text?: string;
  conversation_id?: string;
  attachment_ids?: string[];
  name?: string;
}

/** Live chat website. */
export class WidgetResource extends BaseResource {
  /** POST /v1/widget/messages */
  sendMessage(body: WidgetSendBody): Promise<Envelope> {
    return this.http.post("/v1/widget/messages", clean(body as any));
  }

  /** GET /v1/widget/messages */
  listMessages(channelId: string, conversationId: string): Promise<Envelope> {
    return this.http.get("/v1/widget/messages", { channel_id: channelId, conversation_id: conversationId });
  }
}

/** Công cụ Sandbox. */
export class SandboxResource extends BaseResource {
  /** POST /v1/sandbox/simulate/incoming-message */
  simulateIncomingMessage(channelId: string, text: string, customerName?: string): Promise<Envelope> {
    return this.http.post(
      "/v1/sandbox/simulate/incoming-message",
      clean({ channel_id: channelId, text, customer_name: customerName }),
    );
  }
}
